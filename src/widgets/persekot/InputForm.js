import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Label,
  Form,
  FormGroup,
  Button,
  InputGroup,
  InputGroupAddon,
  Table,
  Row,
  Badge,
} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "components/common/CustomSelectInput";
import CurrencyFormat from "react-currency-format";
import { Colxx } from "components/common/CustomBootstrap";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import ItemNoForm from "widgets/common/ItemNoForm";
import { getRabList, getCategoryList, addCategoryItem, getPersekotList } from "redux/actions";
import { countTax, getCurrentUser } from "helpers/Utils";
import Creatable from "react-select/creatable";
import { NotificationManager } from "components/common/react-notifications";
import { useLocation } from "react-router-dom";

const PersekotForm = ({
  getRabListAction,
  rabItems,
  loading,
  error,
  getCategoryListAction,
  addCategoryItemAction,
  categoryItems,
  categoryLoading,
  categoryError,
  loading2,
  getPersekotListAction,
  persekotItems,
  persekotLoading,
  persekotError,
  onSubmit,
}) => {
  const user = getCurrentUser();
  const location = useLocation();

  const [data, setData] = useState({
    persekot_no: "",
    persekot_name: "",
    persekot_value: 0,
    ppn: 0,
    pph: 0,
    sub_total: 0,
    rab_id: "",
    persekot_detail: [],
  });
  const [rabOptions, setRabOptions] = useState([]);
  const [selectedRab, setSelectedRab] = useState(null);
  const [rows, setRows] = useState([1, 2]);
  const [selectedOption, setSelectedOption] = useState(
    rows.map((row) => {
      return {
        id: row,
        description: "",
        persekot_detail_value: 0,
        category_id: -1,
      };
    })
  );
  const [ppn, setPpn] = useState(11);
  const [pph, setPph] = useState(5);
  const [isDrafted, setIsDrafted] = useState(false);
  const [persekot_id, setPersekotId] = useState(null);

  const selectRab = (e) => {
    const selected = rabItems
      .filter((x) => x.rab_id === e.value)
      .map((x) => ({
        ...x,
        key: x.rab_id,
        label: `${x.rab_no} - ${x.rab_name}`,
        value: x.rab_id,
      }))[0];
    setSelectedRab(selected);
    setData({ ...data, rab_id: selected.rab_id });
  };

  const deleteRow = (row) => {
    if (rows.length > 1) {
      let newRows = [...rows];
      newRows.splice(rows.indexOf(row), 1);
      let newOption = selectedOption.filter((i) => i.id !== row);
      setRows(newRows);
      setSelectedOption(newOption);
    }
  };

  const addRow = () => {
    let newRows = [...rows];
    let newOption = [...selectedOption];
    if (newOption.length === 0) {
      (newRows = [1]),
        (newOption = [
          {
            id: 1,
            description: "",
            persekot_detail_value: 0,
            category_id: -1,
          },
        ]);
      setRows(newRows);
      setSelectedOption(newOption);
    } else {
      newRows.push(rows[rows.length - 1] + 1);
      newOption.push({
        id: newRows[newRows.length - 1],
        description: "",
        persekot_detail_value: 0,
        category_id: -1,
      });
      setRows(newRows);
      setSelectedOption(newOption);
    }
  };

  useEffect(() => {
    getRabListAction();
    getCategoryListAction("persekot");

    if (location.state) {
      const { persekot_id, status } = location.state;
      setPersekotId(persekot_id);
      getPersekotListAction(persekot_id, status);
      setIsDrafted(true);
    }
  }, []);

  useEffect(() => {
    if (rabItems) {
      const options = rabItems
        .filter((x) => x.status === "APPROVED")
        .map((item) => ({
          key: item.rab_id,
          label: `${item.rab_no} - ${item.rab_name}`,
          value: item.rab_id,
        }));
      setRabOptions(options);
    }
  }, [rabItems]);

  useEffect(() => {
    let sub_total = 0;
    selectedOption.forEach((item) => {
      if (item.persekot_detail_value !== "") {
        sub_total += item.persekot_detail_value;
      }
    });
    const total = sub_total + data.ppn + data.pph;

    if (isDrafted) {
      if (total > persekotItems[0].persekot_balance) {
        NotificationManager.warning("Nilai yang diajukan melebihi saldo Persekot!", "Peringatan", 3000, null, null, "");
      } else {
        setData({
          ...data,
          sub_total,
          persekot_value: total,
        });
      }
    } else {
      if (selectedRab && total > selectedRab.rab_value) {
        NotificationManager.warning("Nilai yang diajukan melebihi nilai RAB!", "Peringatan", 3000, null, null, "");
      } else if (selectedRab === null && sub_total > 0) {
        NotificationManager.warning("RAB belum dipilih!", "Peringatan", 3000, null, null, "");
      } else {
        setData({
          ...data,
          sub_total,
          persekot_value: total,
        });
      }
    }
  }, [data.persekot_value, data.ppn, data.pph, selectedOption, selectedRab]);

  useEffect(() => {
    const ppn_value = countTax("ppn", ppn, data.sub_total);
    const pph_value = countTax("pph", pph, data.sub_total);
    setData({ ...data, ppn: ppn_value, pph: pph_value });
  }, [ppn, pph, data.sub_total]);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
    if (categoryError !== "") {
      NotificationManager.error(categoryError, "Gagal", 3000, null, null, "");
    }
  }, [error, categoryError]);

  return (
    <>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...data,
          persekot_id,
          persekot_detail: selectedOption,
        });
      }}>
        <div className="d-flex align-items-center justify-content-between">
          <ItemNoForm type="Persekot" onChange={(val) => setData({ ...data, persekot_no: val })} />
          {isDrafted && (
            <h6>
              Status: <Badge pill color="info">DRAFTED</Badge>
            </h6>
          )}
        </div>
        <Card className="mb-4">
          {persekotLoading ? (
            <CardBody>
              <h5 className="font-weight-bold mb-4">Detail</h5>
              <FormGroup>
                <Label>Judul Persekot</Label>
                {isDrafted ? (
                  <p className="pl-3">{persekotItems[0].persekot_name}</p>
                ) : (
                  <Input
                    required
                    className="rounded-lg"
                    value={data.persekot_name}
                    onChange={(e) =>
                      setData({ ...data, persekot_name: e.target.value })
                    }
                  />
                )}
              </FormGroup>
              {isDrafted && persekotItems[0].rab ? (
                <>
                  <FormGroup>
                    <Label>No. RAB</Label>
                    <p className="pl-3">{persekotItems[0].rab.rab_no}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Judul RAB</Label>
                    <p className="pl-3">{persekotItems[0].rab.rab_name}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Nilai RAB</Label>
                    <p className="pl-3 font-weight-bold">
                      <CurrencyFormat
                        prefix="Rp"
                        displayType="text"
                        thousandSeparator={true}
                        value={persekotItems[0].rab.rab_value}
                      />
                    </p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Saldo Persekot</Label>
                    <p className="pl-3 font-weight-bold">
                      <CurrencyFormat
                        prefix="Rp"
                        displayType="text"
                        thousandSeparator={true}
                        value={persekotItems[0].persekot_balance}
                      />
                    </p>
                  </FormGroup>
                </>
              ) : (
                <>
                  <FormGroup>
                    <Label>Pilih RAB</Label>
                    <Select
                      components={{ Input: CustomSelectInput }}
                      className="react-select"
                      classNamePrefix="react-select"
                      placeholder={loading ? "Pilih" : "Loading..."}
                      value={selectedRab ? selectedRab : ""}
                      onChange={selectRab}
                      options={rabOptions}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Nilai RAB</Label>
                    <InputGroup>
                      <InputGroupAddon addonType="append">
                        <div
                          className="d-flex align-items-center px-3"
                          style={{
                            background: "#E0E7EC",
                          }}
                        >
                          IDR
                        </div>
                      </InputGroupAddon>
                      <CurrencyFormat
                        readOnly={true}
                        thousandSeparator={true}
                        prefix={"Rp"}
                        className="form-control"
                        value={loading && selectedRab ? selectedRab.rab_value : 0}
                      />
                    </InputGroup>
                  </FormGroup>
                </>
              )}
            </CardBody>
          ) : (
            <div className="loading position-relative my-4" />
          )}
        </Card>
        <Card className="mb-4">
          <CardBody>
            <h5 className="font-weight-bold text-center mb-4">
              Rincian Persekot yang diajukan
            </h5>
            <Table className="w-100">
              <thead>
                <tr>
                  <th width="5%">#</th>
                  <th width="35%">Uraian</th>
                  <th width="25%">Kategori</th>
                  <th width="30%">Nilai yang diajukan</th>
                  <th width="5%"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Input
                        required
                        className="rounded-lg"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].description
                        }
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                description: e.target.value,
                              };
                            } else {
                              return option;
                            }
                          });
                          setSelectedOption(newOption);
                        }}
                      />
                    </td>
                    <td>
                      <Creatable
                        components={{ Input: CustomSelectInput }}
                        className="react-select"
                        classNamePrefix="react-select"
                        placeholder={categoryLoading ? "Pilih" : "Loading..."}
                        value={categoryLoading && categoryItems && categoryItems.filter(
                          (x) => x.category_id === selectedOption[index].category_id
                        ).map((x) => ({
                          label: x.category_name,
                          value: x.category_id,
                          key: x.category_id,
                        }))}
                        onCreateOption={(value) => addCategoryItemAction({
                          category_name: value,
                          category_type: "PERSEKOT",
                        })}
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                category_id: e.value,
                              };
                            } else {
                              return option;
                            }
                          });
                          setSelectedOption(newOption);
                        }}
                        options={categoryLoading && categoryItems && [...categoryItems.map((x) => ({
                          label: x.category_name,
                          value: x.category_id,
                          key: x.category_id,
                        }))]}
                      />
                    </td>
                    <td>
                      <CurrencyFormat
                        required={true}
                        thousandSeparator={true}
                        prefix={"Rp"}
                        className="form-control rounded-lg"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].persekot_detail_value
                        }
                        onValueChange={(e) => {
                          const { value } = e;
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                persekot_detail_value: parseInt(value)
                                  ? parseInt(value)
                                  : 0,
                              };
                            } else {
                              return option;
                            }
                          });
                          setSelectedOption(newOption);
                        }}
                      />
                    </td>
                    <td>
                      <Button
                        type="button"
                        color=""
                        onClick={() => deleteRow(row)}
                      >
                        <i
                          className="simple-icon-trash font-weight-bold"
                          style={{ fontSize: "1.2rem" }}
                        />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button
              type="button"
              outline
              color="primary btn-shadow mb-4"
              onClick={addRow}
            >
              Tambah transaksi
            </Button>
            <Row>
              <Colxx xxs="2">
                <FormGroup>
                  <Label>PPN</Label>
                  <CurrencyFormat
                    required={true}
                    suffix="%"
                    className="form-control"
                    value={ppn}
                    onValueChange={(e) => {
                      const { value } = e;
                      const result = parseInt(value) ? parseInt(value) : 0;
                      setPpn(result);
                    }}
                  />
                </FormGroup>
              </Colxx>
              <Colxx xxs="10">
                <FormGroup>
                  <Label>Nilai PPN</Label>
                  <CurrencyFormat
                    readOnly={true}
                    thousandSeparator={true}
                    prefix={"Rp"}
                    className="form-control"
                    value={data.ppn}
                  />
                </FormGroup>
              </Colxx>
            </Row>
            <Row>
              <Colxx xxs="2">
                <FormGroup>
                  <Label>PPH</Label>
                  <CurrencyFormat
                    required={true}
                    suffix="%"
                    className="form-control"
                    value={pph}
                    onValueChange={(e) => {
                      const { value } = e;
                      const result = parseInt(value) ? parseInt(value) : 0;
                      setPph(result);
                    }}
                  />
                </FormGroup>
              </Colxx>
              <Colxx xxs="10">
                <FormGroup>
                  <Label>Nilai PPH</Label>
                  <CurrencyFormat
                    readOnly={true}
                    thousandSeparator={true}
                    prefix={"Rp"}
                    className="form-control"
                    value={data.pph}
                  />
                </FormGroup>
              </Colxx>
            </Row>
            <FormGroup>
              <Label>Total biaya yang diajukan</Label>
              <InputGroup>
                <InputGroupAddon addonType="append">
                  <div
                    className="d-flex align-items-center px-3"
                    style={{
                      background: "#E0E7EC",
                    }}
                  >
                    IDR
                  </div>
                </InputGroupAddon>
                <CurrencyFormat
                  readOnly={true}
                  thousandSeparator={true}
                  prefix={"Rp"}
                  className="form-control"
                  value={data.persekot_value}
                />
              </InputGroup>
            </FormGroup>
            <Row>
              <Colxx xxs="6">
                <FormGroup>
                  <Label>Dibuat oleh</Label>
                  <Input readOnly className="rounded-lg" value={user.username} />
                </FormGroup>
              </Colxx>
              <Colxx xxs="6">
                <FormGroup>
                  <Label>Departemen</Label>
                  <Input
                    readOnly
                    className="rounded-lg"
                    value={user.department}
                  />
                </FormGroup>
              </Colxx>
            </Row>
          </CardBody>
        </Card>
        {loading2 ? (
          <Button size="lg" color="primary w-100 btn-shadow">
            Ajukan
          </Button>
        ) : (
          <div className="loading position-relative" />
        )}
      </Form>
    </>
  );
};

const mapStateToProps = ({ rab, category, persekot }) => {
  return {
    rabItems: rab.rabItems,
    loading: rab.loading,
    error: rab.error,
    categoryItems: category.categoryItems,
    categoryLoading: category.loading,
    categoryError: category.error,
    persekotItems: persekot.persekotItems,
    persekotLoading: persekot.loading,
    persekotError: persekot.error,
  };
}
export default injectIntl(
  connect(mapStateToProps, {
    getRabListAction: getRabList,
    getCategoryListAction: getCategoryList,
    addCategoryItemAction: addCategoryItem,
    getPersekotListAction: getPersekotList,
  })(PersekotForm)
);
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
import { getRabList, getCategoryList, addCategoryItem, getRpbList } from "redux/actions";
import { countTax, getCurrentUser } from "helpers/Utils";
import Creatable from "react-select/creatable";
import { NotificationManager } from "components/common/react-notifications";
import { useLocation } from "react-router-dom";
import { statusColor } from "constants/defaultValues";

const RpbForm = ({
  getRpbListAction,
  rpbItems,
  loading,
  error,
  getCategoryListAction,
  addCategoryItemAction,
  categoryItems,
  categoryLoading,
  categoryError,
  onSubmit,
}) => {
  const user = getCurrentUser();
  const state = useLocation().state;

  const [data, setData] = useState({
    pkm_no: "",
    pkm_name: "",
    pkm_value: 0,
    sub_total: 0,
    rab_id: "",
    pkm_detail: [],
  });
  const [rows, setRows] = useState([1, 2]);
  const [selectedOption, setSelectedOption] = useState(
    rows.map((row) => {
      return {
        id: row,
        description: "",
        pkm_quantity: 1,
        pkm_sub_total: 0,
        pkm_detail_price: 0,
        category_id: -1,
      };
    })
  );

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
            pkm_quantity: 1,
            pkm_sub_total: 0,
            pkm_detail_price: 0,
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
        pkm_quantity: 1,
        pkm_sub_total: 0,
        pkm_detail_price: 0,
        category_id: -1,
      });
      setRows(newRows);
      setSelectedOption(newOption);
    }
  };

  useEffect(() => {
    getCategoryListAction("pkm");
    const { pkm_id, status } = state;
    getRpbListAction(pkm_id, status);
  }, []);

  useEffect(() => {
    let sub_total = 0;
    selectedOption.forEach((item) => {
      if (item.pkm_detail_price !== "") {
        sub_total += item.pkm_detail_price;
      }
    });
    const total = sub_total;

    if (loading && rpbItems && rpbItems[0]) {
      if (total + rpbItems[0].ppn > rpbItems[0].pkm_balance) {
        NotificationManager.warning("Nilai yang diajukan melebihi saldo Rpb!", "Peringatan", 3000, null, null, "");
      } else {
        setData({
          ...data,
          sub_total,
          pkm_name: rpbItems[0].pkm_name,
          rab_id: rpbItems[0].rab_id,
          pkm_value: total,
        });
      }
    }
  }, [data.pkm_value, selectedOption]);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
    if (categoryError !== "") {
      NotificationManager.error(categoryError, "Gagal", 3000, null, null, "");
    }
  }, [error, categoryError]);

  return rpbItems && rpbItems[0] && rpbItems[0].rab ? (
    <>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...data,
          pkm_id: rpbItems[0].pkm_id,
          pkm_detail: selectedOption,
        });
      }}>
        <div className="d-flex align-items-center justify-content-between">
          <ItemNoForm type="RPB" onChange={(val) => setData({ ...data, pkm_no: val })} />
          <h6>
            Status: <Badge pill color={statusColor[rpbItems[0].status]}>{rpbItems[0].status}</Badge>
          </h6>
        </div>
        <Card className="mb-4">
          <CardBody>
            <h5 className="font-weight-bold mb-4">Detail</h5>
            <FormGroup>
              <Label>Judul RPB</Label>
              <p className="pl-3">{rpbItems[0].pkm_name}</p>
            </FormGroup>
            <FormGroup>
              <Label>No. RAB</Label>
              <p className="pl-3">{rpbItems[0].rab.rab_no}</p>
            </FormGroup>
            <FormGroup>
              <Label>Judul RAB</Label>
              <p className="pl-3">{rpbItems[0].rab.rab_name}</p>
            </FormGroup>
            <FormGroup>
              <Label>Nilai RAB</Label>
              <p className="pl-3 font-weight-bold">
                <CurrencyFormat
                  prefix="Rp"
                  displayType="text"
                  thousandSeparator={true}
                  value={rpbItems[0].rab.rab_value}
                />
              </p>
            </FormGroup>
            <FormGroup>
              <Label>Nilai RPB</Label>
              <p className="pl-3 font-weight-bold">
                <CurrencyFormat
                  prefix="Rp"
                  displayType="text"
                  thousandSeparator={true}
                  value={rpbItems[0].pkm_value}
                />
              </p>
            </FormGroup>
            <FormGroup>
              <Label>Saldo RPB</Label>
              <p className="pl-3 font-weight-bold">
                <CurrencyFormat
                  prefix="Rp"
                  displayType="text"
                  thousandSeparator={true}
                  value={rpbItems[0].pkm_balance}
                />
              </p>
            </FormGroup>
          </CardBody>
        </Card>
        <Card className="mb-4">
          <CardBody>
            <h5 className="font-weight-bold text-center mb-4">
              Rincian Rpb yang diajukan
            </h5>
            <Table className="w-100">
              <thead>
                <tr>
                  <th width="5%">#</th>
                  <th width="25%">Paket pengadaan/Uraian</th>
                  <th width="10%">Qty</th>
                  <th width="15%">Satuan</th>
                  <th width="20%">Harga Satuan</th>
                  <th width="20%">Jumlah Harga</th>
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
                      <Input
                        required
                        className="rounded-lg"
                        type="number"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].pkm_quantity
                        }
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                pkm_quantity: parseInt(e.target.value),
                                pkm_detail_price: parseInt(e.target.value) * option.pkm_sub_total,
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
                          category_type: "PKM",
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
                          )[0].pkm_sub_total
                        }
                        onValueChange={(e) => {
                          const { value } = e;
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                pkm_detail_price: parseInt(value) * option.pkm_quantity,
                                pkm_sub_total: parseInt(value)
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
                      <CurrencyFormat
                        required={true}
                        readOnly
                        thousandSeparator={true}
                        prefix={"Rp"}
                        className="form-control rounded-lg"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].pkm_detail_price
                        }
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
            <FormGroup>
              <Label>Nilai PPN</Label>
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
                  value={rpbItems[0].ppn}
                />
              </InputGroup>
            </FormGroup>
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
                  value={data.pkm_value + rpbItems[0].ppn}
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
        {loading ? (
          <Button size="lg" color="primary w-100 btn-shadow">
            Ajukan
          </Button>
        ) : (
          <div className="loading position-relative" />
        )}
      </Form>
    </>
  ) : (
    <div className="loading" />
  );
};

const mapStateToProps = ({ category, rpb }) => {
  return {
    rpbItems: rpb.rpbItems,
    loading: rpb.loading,
    error: rpb.error,
    categoryItems: category.categoryItems,
    categoryLoading: category.loading,
    categoryError: category.error,
  };
}
export default injectIntl(
  connect(mapStateToProps, {
    getCategoryListAction: getCategoryList,
    addCategoryItemAction: addCategoryItem,
    getRpbListAction: getRpbList,
  })(RpbForm)
);
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
import CustomSelectInput from "components/common/CustomSelectInput";
import CurrencyFormat from "react-currency-format";
import { Colxx } from "components/common/CustomBootstrap";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import ItemNoForm from "widgets/common/ItemNoForm";
import { getCategoryList, addCategoryItem, getPersekotList } from "redux/actions";
import { getCurrentUser } from "helpers/Utils";
import Creatable from "react-select/creatable";
import { NotificationManager } from "components/common/react-notifications";
import { useLocation } from "react-router-dom";
import { statusColor } from "constants/defaultValues";

const PersekotForm = ({
  getPersekotListAction,
  persekotItems,
  loading,
  error,
  getCategoryListAction,
  addCategoryItemAction,
  categoryItems,
  categoryLoading,
  categoryError,
  onSubmit,
  uploadedItems,
}) => {
  const user = getCurrentUser();
  const state = useLocation().state;

  const [data, setData] = useState({
    persekot_no: "",
    persekot_name: "",
    persekot_value: 0,
    sub_total: 0,
    rab_id: "",
    persekot_detail: [],
  });
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
    if (uploadedItems) {
      setRows([...uploadedItems.map((_, i) => i + 1)]);
      setSelectedOption([...uploadedItems.map((x, i) => ({
        id: i + 1,
        description: x["Uraian"],
        persekot_detail_value: parseInt(x["Nilai"]),
        category_id: categoryItems.find((c) =>
          c.category_name.toLowerCase() === x["Kategori"].toLowerCase())
          .category_id,
      }))]);
      setData({ ...data, persekot_value: uploadedItems.map((x) => parseInt(x["Nilai"])).reduce((a, b) => a + b) })
    }
  }, [uploadedItems, categoryItems]);

  useEffect(() => {
    getCategoryListAction("persekot");
    const { persekot_id, status } = state;
    getPersekotListAction(persekot_id, status);
  }, []);

  useEffect(() => {
    let sub_total = 0;
    selectedOption.forEach((item) => {
      if (item.persekot_detail_value !== "") {
        sub_total += item.persekot_detail_value;
      }
    });
    const total = sub_total;

    if (loading && persekotItems && persekotItems[0]) {
      if (total > persekotItems[0].persekot_balance) {
        NotificationManager.warning("Nilai yang diajukan melebihi saldo Persekot!", "Peringatan", 3000, null, null, "");
      } else {
        setData({
          ...data,
          sub_total,
          persekot_name: persekotItems[0].persekot_name,
          rab_id: persekotItems[0].rab_id,
          persekot_value: total,
        });
      }
    }
  }, [data.persekot_value, selectedOption]);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
    if (categoryError !== "") {
      NotificationManager.error(categoryError, "Gagal", 3000, null, null, "");
    }
  }, [error, categoryError]);

  return persekotItems && persekotItems[0] && persekotItems[0].rab ? (
    <>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...data,
          persekot_id: persekotItems[0].persekot_id,
          persekot_detail: selectedOption,
        });
      }}>
        <div className="d-flex align-items-center justify-content-between">
          <ItemNoForm type="Persekot" onChange={(val) => setData({ ...data, persekot_no: val })} />
          <h6>
            Status: <Badge pill color={statusColor[persekotItems[0].status]}>{persekotItems[0].status}</Badge>
          </h6>
        </div>
        <Card className="mb-4">
          <CardBody>
            <h5 className="font-weight-bold mb-4">Detail</h5>
            <FormGroup>
              <Label>Judul Persekot</Label>
              <p className="pl-3">{persekotItems[0].persekot_name}</p>
            </FormGroup>
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
              <Label>Nilai Persekot</Label>
              <p className="pl-3 font-weight-bold">
                <CurrencyFormat
                  prefix="Rp"
                  displayType="text"
                  thousandSeparator={true}
                  value={persekotItems[0].persekot_value}
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
          </CardBody>
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

const mapStateToProps = ({ category, persekot }) => {
  return {
    persekotItems: persekot.persekotItems,
    loading: persekot.loading,
    error: persekot.error,
    categoryItems: category.categoryItems,
    categoryLoading: category.loading,
    categoryError: category.error,
  };
}
export default injectIntl(
  connect(mapStateToProps, {
    getCategoryListAction: getCategoryList,
    addCategoryItemAction: addCategoryItem,
    getPersekotListAction: getPersekotList,
  })(PersekotForm)
);
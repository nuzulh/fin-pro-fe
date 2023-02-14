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
} from "reactstrap";
import Select from "react-select";
import Creatable from "react-select/creatable";
import CustomSelectInput from "components/common/CustomSelectInput";
import CurrencyFormat from "react-currency-format";
import { Colxx } from "components/common/CustomBootstrap";
import { addRpbItem } from "redux/actions";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";
import { NotificationManager } from "components/common/react-notifications";

const RpbForm = ({ item, addRpbItemAction }) => {
  const user = getCurrentUser();
  const history = useHistory();
  const [budgetPlans, setBudgetPlans] = useState([]);
  const [category, setCategory] = useState([]);
  const [showDetail, setShowDetail] = useState(true);
  const [rows, setRows] = useState([1, 2]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    rows.map((row) => {
      return {
        id: row,
        description: "",
        quantity: 1,
        category_name: "",
        price: 0,
        total: 0,
      };
    })
  );
  const [data, setData] = useState({
    procurement_name: "",
    procurement_no: "",
    budget_plan_id: "",
    proposed_budget_plan: 0,
    sub_total: 0,
    value_added_tax: 0,
    income_tax: 0,
    total: 0,
  });
  const [rpbNo, setRpbNo] = useState({
    no: "",
    code: "",
    month: "",
    year: new Date().getFullYear(),
  });
  const [rab, setRab] = useState({
    budget_plan_id: "",
    budget_plan_name: "",
    budget_plan_no: "",
    work_plan: {
      activity_code: "",
      budget_post: "",
      rka_value: 0,
      budget_type: "",
    },
    rka_value: 0,
    proposed_budget_plan: 0,
    current_balance: 0,
    details: [],
    sub_total: 0,
    value_added_tax: 0,
    income_tax: 0,
    total: 0,
    creation_time: "",
    maker: "",
    proposed_by: "",
  });
  const [ppn, setPpn] = useState(11);
  const [pph, setPph] = useState(5);

  useEffect(() => {
    const ppn_value = data.sub_total * (ppn * 0.01);
    const pph_value = data.sub_total * (pph * 0.005);
    setData({ ...data, value_added_tax: ppn_value, income_tax: pph_value });
  }, [ppn, pph, data.sub_total]);

  const getBudgetPlans = async () => {
    setLoading1(true);
    await axios
      .get(`${servicePath}/budget-plans/list`, {
        headers: {
          Authorization: `Basic ${user.token}`,
        },
      })
      .then((res) => {
        const temp = res.data.output_schema.map((i, index) => {
          return {
            label: `${i.budget_plan_no} - ${i.budget_plan_name}`,
            value: i.budget_plan_id,
            key: index,
          };
        });
        setBudgetPlans(temp);
        setLoading1(false);
      })
      .catch((err) => {
        NotificationManager.error(
          err.response.data.error_schema.error_message.bahasa,
          "Gagal membuat daftar RAB",
          3000,
          null,
          null,
          ""
        );
        setLoading1(false);
      });
  };

  useEffect(() => {
    getBudgetPlanDetail();
    return () => setLoading3(false);
  }, [data.budget_plan_id]);

  const [nilaiRab, setNilaiRab] = useState(0);
  const getBudgetPlanDetail = async (id) => {
    setLoading3(true);
    await axios
      .get(
        `${servicePath}/budget-plans/detail?budget-plan-id=${
          id ? id : data.budget_plan_id
        }`,
        {
          headers: {
            Authorization: `Basic ${user.token}`,
          },
        }
      )
      .then((res) => {
        if (data.budget_plan_id !== "") {
          setRab(res.data.output_schema);
        }
        if (item) {
          if (item.budgetPlan) {
            setNilaiRab(res.data.output_schema.total);
          }
        }
        setLoading3(false);
      });
  };

  const getCategories = async () => {
    setLoading2(true);
    await axios
      .get(`${servicePath}/categories?category-type=rpb`, {
        headers: {
          Authorization: `Basic ${user.token}`,
        },
      })
      .then((res) => {
        const result = res.data.output_schema.map((item, index) => {
          return {
            label: item.category_name,
            value: item.category_name,
            key: index,
          };
        });
        setCategory(result);
        setLoading2(false);
      });
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
            quantity: 1,
            category_name: "",
            price: 0,
            total: 0,
          },
        ]);
      setRows(newRows);
      setSelectedOption(newOption);
    } else {
      newRows.push(rows[rows.length - 1] + 1);
      newOption.push({
        id: newRows[newRows.length - 1],
        description: "",
        quantity: 1,
        category_name: "",
        price: 0,
        total: 0,
      });
      setRows(newRows);
      setSelectedOption(newOption);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    category.forEach(async (item) => {
      if (typeof item.key === "string") {
        if (item.key[0] === "*") {
          await axios.post(
            `${servicePath}/categories`,
            {
              category_name: item.value,
              category_type: "rpb",
            },
            {
              headers: {
                Authorization: `Basic ${user.token}`,
              },
            }
          );
        }
      }
    });
    const details = selectedOption.map((item) => {
      return {
        description: item.description,
        quantity: item.quantity,
        category_name: item.category_name,
        price: item.price,
        total: item.total,
      };
    });
    const formData = {
      procurement_no: data.procurement_no,
      procurement_name: item ? item.procurementName : data.procurement_name,
      budget_plan_id: item ? item.budgetPlan.budgetPlanId : rab.budget_plan_id,
      proposed_budget_plan: data.proposed_budget_plan,
      sub_total: data.sub_total,
      value_added_tax: data.value_added_tax,
      income_tax: data.income_tax,
      total: data.total,
      details,
    };
    addRpbItemAction([formData, history]);
  };

  useEffect(() => {
    if (item === undefined) {
      getBudgetPlans();
    }
    getCategories();
    return () => {
      setLoading1(false);
      setLoading2(false);
      setLoading3(false);
    };
  }, []);

  useEffect(() => {
    setData({
      ...data,
      procurement_no: `${rpbNo.no}/RPB/CDB-${rpbNo.code}/${rpbNo.month}/${rpbNo.year}`,
    });
  }, [rpbNo]);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (errorMsg !== "") {
      NotificationManager.warning(
        errorMsg,
        "Peringatan!",
        3000,
        null,
        null,
        ""
      );
      setErrorMsg("");
    }
  }, [errorMsg]);

  useEffect(() => {
    let sub_total = 0;
    selectedOption.forEach((item) => {
      sub_total += item.total;
    });
    const total = sub_total + data.value_added_tax + data.income_tax;

    // if (total > rab.total) {
    //   setErrorMsg("Nilai yang diajukan melebihi nilai RAB!");
    // } else {
    setData({
      ...data,
      sub_total,
      total,
      proposed_budget_plan: total,
    });
    // }
  }, [data.value_added_tax, data.income_tax, selectedOption]);

  useEffect(() => {
    if (item) {
      if (item.budgetPlan) {
        getBudgetPlanDetail(item.budgetPlan.budgetPlanId);
      }
    }
  }, [item]);

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Row className="mx-1 mb-3 d-flex">
          <h6 className="my-auto">No.</h6>
          <Input
            required
            className="p-1 mx-2"
            style={{
              width: "5rem",
              outline: "none",
              borderColor: "transparent",
              background: "transparent",
              borderBottomWidth: "1",
              borderBottomColor: "black",
            }}
            value={rpbNo.no}
            onChange={(e) => setRpbNo({ ...rpbNo, no: e.target.value })}
          />
          <h6 className="my-auto">/RPB/CDB-</h6>
          <Input
            required
            className="p-1 mx-2"
            style={{
              width: "9rem",
              outline: "none",
              borderColor: "transparent",
              background: "transparent",
              borderBottomWidth: "1",
              borderBottomColor: "black",
            }}
            placeholder="Kode divisi/proyek"
            value={rpbNo.code}
            onChange={(e) => setRpbNo({ ...rpbNo, code: e.target.value })}
          />
          <h6 className="my-auto">/</h6>
          <Input
            required
            className="p-1 mx-2"
            style={{
              width: "4rem",
              outline: "none",
              borderColor: "transparent",
              background: "transparent",
              borderBottomWidth: "1",
              borderBottomColor: "black",
            }}
            placeholder="Bulan"
            value={rpbNo.month}
            onChange={(e) => setRpbNo({ ...rpbNo, month: e.target.value })}
          />
          <h6 className="my-auto">/</h6>
          <Input
            required
            className="p-1 mx-2"
            style={{
              width: "6rem",
              outline: "none",
              borderColor: "transparent",
              background: "transparent",
              borderBottomWidth: "1",
              borderBottomColor: "black",
            }}
            type="number"
            placeholder="Tahun"
            value={rpbNo.year}
            onChange={(e) => setRpbNo({ ...rpbNo, year: e.target.value })}
          />
        </Row>
        <Card className="mb-4">
          <CardBody>
            <div
              className="w-100 d-flex align-items-center justify-content-between"
              style={{ cursor: "pointer" }}
              onClick={() => setShowDetail(!showDetail)}
            >
              <h5 className="font-weight-bold">Detail</h5>
              <i className="simple-icon-arrow-down font-weight-bold" />
            </div>
            {showDetail && (
              <>
                <FormGroup className="mt-3">
                  <Label>Judul RPB/RPP</Label>
                  {item ? (
                    <p className="px-3">{item.procurementName}</p>
                  ) : (
                    <Input
                      required
                      value={data.procurement_name}
                      className="rounded-lg"
                      onChange={(e) =>
                        setData({ ...data, procurement_name: e.target.value })
                      }
                    />
                  )}
                </FormGroup>
                {item ? (
                  <>
                    <FormGroup>
                      <Label>Nilai RAB</Label>
                      <p className="pl-3">
                        <CurrencyFormat
                          prefix="Rp"
                          thousandSeparator={true}
                          displayType="text"
                          className="font-weight-bold"
                          value={nilaiRab}
                        />
                      </p>
                    </FormGroup>
                  </>
                ) : (
                  <FormGroup>
                    <Label>Pilih RAB</Label>
                    <Select
                      components={{ Input: CustomSelectInput }}
                      className="react-select"
                      classNamePrefix="react-select"
                      placeholder={loading1 ? "Loading..." : "Pilih"}
                      value={budgetPlans.filter(
                        (rab) => rab.value === data.budget_plan_id
                      )}
                      onChange={(val) => {
                        setData({ ...data, budget_plan_id: val.value });
                      }}
                      options={budgetPlans}
                    />
                  </FormGroup>
                )}
                <FormGroup>
                  <Label>
                    {item && item.budgetPlan
                      ? "Nilai RPB"
                      : "Nilai yang diajukan"}
                  </Label>
                  {item && item.budgetPlan ? (
                    <p className="pl-3">
                      <CurrencyFormat
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType="text"
                        className="font-weight-bold"
                        value={item.total}
                      />
                    </p>
                  ) : (
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
                        value={`${
                          loading2 ? "Loading..." : rab.proposed_budget_plan
                        }`}
                      />
                    </InputGroup>
                  )}
                </FormGroup>
              </>
            )}
          </CardBody>
        </Card>
        <Card className="mb-4">
          <CardBody>
            <h5 className="font-weight-bold text-center mb-4">
              Rincian Pengadaan Barang/Jasa
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
                        type="number"
                        className="rounded-lg"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].quantity
                        }
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                quantity: parseInt(e.target.value),
                                total: e.target.value * option.price,
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
                        placeholder="Pilih"
                        value={category.filter(
                          (item) =>
                            item.value === selectedOption[index].category_name
                        )}
                        onCreateOption={(value) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                category_name: value,
                              };
                            } else {
                              return option;
                            }
                          });
                          setSelectedOption(newOption);
                          let newCategory = category;
                          category.push({
                            label: value,
                            value: value,
                            key: `*${category.length + 1}`,
                          });
                          setCategory(newCategory);
                        }}
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                category_name: e.value,
                              };
                            } else {
                              return option;
                            }
                          });
                          setSelectedOption(newOption);
                        }}
                        options={category}
                      />
                    </td>
                    <td>
                      <CurrencyFormat
                        thousandSeparator={true}
                        prefix={"Rp"}
                        className="form-control rounded-lg"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].price
                        }
                        onValueChange={(e) => {
                          const { value } = e;
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                price: parseInt(value) ? parseInt(value) : 0,
                                total: option.quantity * value,
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
                        readOnly={true}
                        thousandSeparator={true}
                        prefix={"Rp"}
                        className="form-control rounded-lg"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].total
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
              color="primary btn-shadow"
              onClick={addRow}
            >
              Tambah barang/jasa
            </Button>
            <FormGroup className="mt-4">
              <Label>Subtotal</Label>
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
                  value={data.sub_total}
                />
              </InputGroup>
            </FormGroup>
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
                    value={data.value_added_tax}
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
                    value={data.income_tax}
                  />
                </FormGroup>
              </Colxx>
            </Row>
            <FormGroup>
              <Label>Total</Label>
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
                  value={data.total}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label>Diajukan oleh</Label>
              <Input
                readOnly
                className="rounded-lg"
                placeholder="Direksi A"
                value={user.username}
              />
            </FormGroup>
          </CardBody>
        </Card>
        <Button size="lg" color="primary w-100 btn-shadow">
          Ajukan
        </Button>
      </Form>
    </>
  );
};

const mapStateToProps = ({ rpb }) => {
  const { rpbItems, loading } = rpb;
  return { rpbItems, loading };
};
export default injectIntl(
  connect(mapStateToProps, {
    addRpbItemAction: addRpbItem,
  })(RpbForm)
);

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
import { addPersekotItem, getPersekotList } from "redux/actions";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";
import { NotificationManager } from "components/common/react-notifications";

const PersekotForm = ({
  item,
  addPersekotItemAction,
  getPersekotListAction,
}) => {
  const history = useHistory();
  const user = getCurrentUser();
  const [showDetail, setShowDetail] = useState(true);
  const [rows, setRows] = useState([1, 2]);
  const [selectedOption, setSelectedOption] = useState(
    rows.map((row) => {
      return {
        id: row,
        description: "",
        category_name: "",
        imprest_detail_worth: 0,
      };
    })
  );
  const [data, setData] = useState({
    imprest_no: "",
    imprest_name: "",
    imprest_balance: 0,
    imprest_total: 0,
    ppn: 0,
    pph: 0,
    work_plan_id: "",
    budget_plan_id: "",
    budget_type: "",
    rka_value: 0,
  });
  const [persekotNo, setPersekotNo] = useState({
    no: "",
    code: "",
    month: "",
    year: new Date().getFullYear(),
  });
  const [category, setCategory] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [budgetPlans, setBudgetPlans] = useState([]);
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
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let total = 0;
    selectedOption.forEach((i) => {
      total += i.imprest_detail_worth;
    });

    const ppnValue = total * (ppn * 0.01);
    const pphValue = total * (pph * 0.005);
    const imprest_total = ppnValue + pphValue + total;

    if (
      imprest_total > rab.proposed_budget_plan &&
      imprest_total > item.imprestBalance
    ) {
      setErrorMsg("Nilai yang diajukan melebihi nilai RAB/Persekot!");
    } else {
      setData({ ...data, ppn: ppnValue, pph: pphValue, imprest_total });
    }
  }, [ppn, pph, selectedOption]);

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
      });
  };

  const [nilaiRab, setNilaiRab] = useState(0);
  const getBudgetPlanDetail = async (id) => {
    setLoading2(true);
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
        setLoading2(false);
      });
  };

  const getCategories = async () => {
    setLoading3(true);
    await axios
      .get(`${servicePath}/categories?category-type=persekot`, {
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
        setLoading3(false);
      });
  };

  useEffect(() => {
    getPersekotListAction();
    getBudgetPlans();
    getCategories();
    return () => {
      setLoading1(false);
      setLoading2(false);
      setLoading3(false);
    };
  }, []);

  useEffect(() => {
    getBudgetPlanDetail();
    return () => setLoading2(false);
  }, [data.budget_plan_id]);

  useEffect(() => {
    setData({
      ...data,
      imprest_no: `${persekotNo.no}/Persekot/CDB-${persekotNo.code}/${persekotNo.month}/${persekotNo.year}`,
    });
  }, [persekotNo]);

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
            category_name: "",
            imprest_detail_worth: 0,
          },
        ]);
      setRows(newRows);
      setSelectedOption(newOption);
    } else {
      newRows.push(rows[rows.length - 1] + 1);
      newOption.push({
        id: newRows[newRows.length - 1],
        description: "",
        category_name: "",
        imprest_detail_worth: 0,
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
              category_type: "persekot",
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
        category_name: item.category_name,
        imprest_detail_worth: item.imprest_detail_worth,
      };
    });
    const formData = {
      imprest_no: data.imprest_no,
      imprest_name: item ? item.imprestName : data.imprest_name,
      imprest_balance: item ? item.imprestBalance : data.imprest_balance,
      imprest_total: data.imprest_total,
      work_plan_id: item
        ? item.workPlan.workPlanId
        : rab.work_plan.work_plan_id,
      budget_plan_id: item ? item.budgetPlan.budgetPlanId : rab.budget_plan_id,
      details,
    };
    addPersekotItemAction([formData, history]);
  };

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
            value={persekotNo.no}
            onChange={(e) =>
              setPersekotNo({ ...persekotNo, no: e.target.value })
            }
          />
          <h6 className="my-auto">/Persekot/CDB-</h6>
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
            value={persekotNo.code}
            onChange={(e) =>
              setPersekotNo({ ...persekotNo, code: e.target.value })
            }
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
            value={persekotNo.month}
            onChange={(e) =>
              setPersekotNo({ ...persekotNo, month: e.target.value })
            }
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
            value={persekotNo.year}
            onChange={(e) =>
              setPersekotNo({ ...persekotNo, year: e.target.value })
            }
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
                  <Label>Judul persekot</Label>
                  {item ? (
                    <p className="px-3">{item.imprestName}</p>
                  ) : (
                    <Input
                      className="rounded-lg"
                      value={data.imprest_name}
                      onChange={(e) =>
                        setData({ ...data, imprest_name: e.target.value })
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
                      ? "Nilai Persekot"
                      : "Nilai yang diajukan"}
                  </Label>
                  {item && item.budgetPlan ? (
                    <p className="pl-3">
                      <CurrencyFormat
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType="text"
                        className="font-weight-bold"
                        value={item.imprestBalance}
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
                        required={true}
                        thousandSeparator={true}
                        prefix={"Rp"}
                        className="form-control rounded-lg"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].imprest_detail_worth
                        }
                        onValueChange={(e) => {
                          const { value } = e;
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                imprest_detail_worth: parseInt(value)
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
              color="primary btn-shadow"
              onClick={addRow}
            >
              Tambah transaksi
            </Button>
            <Row className="mt-4">
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
                      const percentage = parseInt(value) ? parseInt(value) : 0;
                      setPpn(percentage);
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
                      const percentage = parseInt(value) ? parseInt(value) : 0;
                      setPph(percentage);
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
                  value={data.imprest_total}
                />
              </InputGroup>
            </FormGroup>
            <Row>
              <Colxx xxs="6">
                <FormGroup>
                  <Label>Dibuat oleh</Label>
                  <Input
                    readOnly
                    className="rounded-lg"
                    value={user.username}
                  />
                </FormGroup>
              </Colxx>
              <Colxx xxs="6">
                <FormGroup>
                  <Label>Departemen</Label>
                  <Input readOnly className="rounded-lg" value="department" />
                </FormGroup>
              </Colxx>
            </Row>
            <FormGroup>
              <Label>Diajukan oleh</Label>
              <Input readOnly className="rounded-lg" value={user.username} />
            </FormGroup>
            <FormGroup>
              <Label>Disetujui oleh</Label>
              <Input readOnly className="rounded-lg" value="direksi" />
            </FormGroup>
          </CardBody>
        </Card>
        <Button size="lg" color="primary btn-shadow w-100">
          Ajukan
        </Button>
      </Form>
    </>
  );
};

const mapStateToProps = ({ persekot }) => {
  const { persekotItems, loading } = persekot;
  return { persekotItems, loading };
};
export default injectIntl(
  connect(mapStateToProps, {
    addPersekotItemAction: addPersekotItem,
    getPersekotListAction: getPersekotList,
  })(PersekotForm)
);

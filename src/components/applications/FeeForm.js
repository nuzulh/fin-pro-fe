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
import CustomSelectInput from "components/common/CustomSelectInput";
import CurrencyFormat from "react-currency-format";
import { Colxx } from "components/common/CustomBootstrap";
import { addFeeItem, getFeeList } from "redux/actions";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { servicePath, servicePath2 } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";
import { NotificationManager } from "components/common/react-notifications";

const FeeForm = ({ item, addFeeItemAction, details }) => {
  const history = useHistory();
  const user = getCurrentUser();
  const [selectedBudgetPlan, setSelectedBudgetPlan] = useState("");
  const [budgetPlans, setBudgetPlans] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [showDetail, setShowDetail] = useState(true);
  const [rows, setRows] = useState([1, 2]);
  const [selectedOption, setSelectedOption] = useState(
    rows.map((row) => {
      return {
        id: row,
        unit: "",
        no_memo: "",
        departure_date: "",
        return_date: "",
        value: 0,
        department: "",
      };
    })
  );
  const [data, setData] = useState({
    project_fee_no: "",
    project_fee_name: "",
    budget_plan_id: "",
    project_fee_total: 0,
    ppn: 0,
    pph: 0,
  });
  const [feeNo, setFeeNo] = useState({
    no: "",
    code: "",
    month: "",
    year: new Date().getFullYear(),
  });
  const [ppn, setPpn] = useState(11);
  const [pph, setPph] = useState(5);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (details) {
      const x = [];
      const temp = details.map((item, index) => {
        x.push(index + 1);
        return {
          id: index + 1,
          unit: item.unit,
          no_memo: item.no_memo,
          departure_date: item.departure_date,
          return_date: item.return_date,
          value: item.value,
          department: item.department,
        };
      });
      setRows(x);
      setSelectedOption(temp);
    }
  }, [details, setRows, setSelectedOption]);

  useEffect(() => {
    let total = 0;
    selectedOption.forEach((i) => {
      total += i.value;
    });

    const ppnValue = total * (ppn * 0.01);
    const pphValue = total * (pph * 0.005);
    const project_fee_total = ppnValue + pphValue + total;

    if (project_fee_total > item.budget_plan.total) {
      setErrorMsg("Nilai yang diajukan melebihi nilai RAB!");
    } else {
      setData({ ...data, ppn: ppnValue, pph: pphValue, project_fee_total });
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
        params: {
          key: "budgetPlanId",
          value: selectedBudgetPlan,
        },
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

  useEffect(() => {
    if (item === undefined) {
      getBudgetPlans();
    }

    return () => setLoading1(false);
  }, []);

  useEffect(() => {
    if (selectedBudgetPlan !== "") {
      getBudgetPlans();
    }
  }, [selectedBudgetPlan]);

  useEffect(() => {
    setData({
      ...data,
      project_fee_no: `${feeNo.no}/Fee project/CDB-${feeNo.code}/${feeNo.month}/${feeNo.year}`,
    });
  }, [feeNo]);

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
            unit: "",
            no_memo: "",
            departure_date: "",
            return_date: "",
            value: 0,
            department: "",
          },
        ]);
      setRows(newRows);
      setSelectedOption(newOption);
    } else {
      newRows.push(rows[rows.length - 1] + 1);
      newOption.push({
        id: newRows[newRows.length - 1],
        unit: "",
        no_memo: "",
        departure_date: "",
        return_date: "",
        value: 0,
        department: "",
      });
      setRows(newRows);
      setSelectedOption(newOption);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const details = selectedOption.map((i) => {
      return {
        unit: i.unit,
        no_memo: i.no_memo,
        departure_date: i.departure_date,
        return_date: i.return_date,
        value: i.value,
        department: i.department,
        project_fee_id: item.project_fee_id,
      };
    });
    const formData = {
      project_fee_no: data.project_fee_no,
      project_fee_name: item
        ? item.project_fee_name + `~~${item.project_fee_id}`
        : data.project_fee_name,
      budget_plan_id: item
        ? item.budget_plan.budget_plan_id
        : data.budget_plan_id,
    };

    await axios
      .post(`${servicePath2}/project-fee-detail`, details)
      .then((res) => {
        localStorage.setItem("project_fee_id", item.project_fee_id);
        addFeeItemAction([formData, history]);
      });
  };

  const [nilai, setNilai] = useState(0);
  useEffect(() => {
    if (item) {
      const temp = item.budget_plan.details;
      if (temp) {
        const x = temp.filter((i) => i.evidence === "FEE_PROJECT")[0];
        setNilai(x.price);
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
            value={feeNo.no}
            onChange={(e) => setFeeNo({ ...feeNo, no: e.target.value })}
          />
          <h6 className="my-auto">/Fee project/CDB-</h6>
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
            value={feeNo.code}
            onChange={(e) => setFeeNo({ ...feeNo, code: e.target.value })}
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
            value={feeNo.month}
            onChange={(e) => setFeeNo({ ...feeNo, month: e.target.value })}
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
            value={feeNo.year}
            onChange={(e) => setFeeNo({ ...feeNo, year: e.target.value })}
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
                  <Label>Judul Fee Project</Label>
                  {item ? (
                    <p className="px-3">{item.project_fee_name}</p>
                  ) : (
                    <Input
                      required
                      className="rounded-lg"
                      value={data.project_fee_name}
                      onChange={(e) =>
                        setData({ ...data, project_fee_name: e.target.value })
                      }
                    />
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>No. RAB</Label>
                  {item ? (
                    <p className="px-3">{item.budget_plan.budget_plan_no}</p>
                  ) : (
                    <Select
                      components={{ Input: CustomSelectInput }}
                      className="react-select"
                      classNamePrefix="react-select"
                      placeholder={loading1 ? "Loading..." : "Pilih"}
                      value={budgetPlans.filter(
                        (rab) => rab.value === data.budget_plan_id
                      )}
                      onChange={(val) =>
                        setData({ ...data, budget_plan_id: val.value })
                      }
                      options={budgetPlans}
                    />
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>Judul RAB</Label>
                  <p className="pl-3">{item.budget_plan.budget_plan_name}</p>
                </FormGroup>
                <FormGroup>
                  <Label>Nilai RAB</Label>
                  <p className="pl-3">
                    <CurrencyFormat
                      className="font-weight-bold"
                      prefix="Rp"
                      displayType="text"
                      thousandSeparator={true}
                      value={item.budget_plan.total}
                    />
                  </p>
                </FormGroup>
                <FormGroup>
                  <Label>Nilai Fee Project</Label>
                  <p className="pl-3">
                    <CurrencyFormat
                      className="font-weight-bold"
                      prefix="Rp"
                      displayType="text"
                      thousandSeparator={true}
                      value={nilai}
                    />
                  </p>
                </FormGroup>
              </>
            )}
          </CardBody>
        </Card>
        <Card className="mb-4">
          <CardBody>
            <h5 className="font-weight-bold text-center mb-4">
              Rincian Fee Project
            </h5>
            <Table className="w-100">
              <thead>
                <tr>
                  <th width="5%">#</th>
                  <th width="15%">Unit</th>
                  <th width="10%">No. Memo</th>
                  <th width="15%">Tgl. Berangkat</th>
                  <th width="15%">Tgl. Pulang</th>
                  <th width="18%">Nilai</th>
                  <th width="18%">Dept./PIC</th>
                  <th width="4%"></th>
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
                          )[0].unit
                        }
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                unit: e.target.value,
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
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].no_memo
                        }
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                no_memo: e.target.value,
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
                        type="date"
                        className="rounded-lg"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].departure_date
                        }
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                departure_date: e.target.value,
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
                        type="date"
                        className="rounded-lg"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].return_date
                        }
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                return_date: e.target.value,
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
                        thousandSeparator={true}
                        prefix={"Rp"}
                        className="form-control rounded-lg"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].value
                        }
                        onValueChange={(e) => {
                          const { value } = e;
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                value: parseInt(value) ? parseInt(value) : 0,
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
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].department
                        }
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                department: e.target.value,
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
                          className="simple-icon-trash"
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
                  value={data.project_fee_total}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label>Diajukan oleh</Label>
              <Input readOnly className="rounded-lg" value={user.username} />
            </FormGroup>
          </CardBody>
        </Card>
        <Button size="lg" color="primary w-100 btn-shadow">
          Simpan
        </Button>
      </Form>
    </>
  );
};

const mapStateToProps = ({ fee }) => {
  const { feeItems, loading } = fee;
  return { feeItems, loading };
};
export default injectIntl(
  connect(mapStateToProps, {
    addFeeItemAction: addFeeItem,
  })(FeeForm)
);

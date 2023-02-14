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
import { addRabItem } from "redux/actions";
import { useHistory } from "react-router-dom";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import axios from "axios";
import { menuMasters, servicePath } from "constants/defaultValues";
import { checkDuplicate, getCurrentUser } from "helpers/Utils";
import { NotificationManager } from "components/common/react-notifications";

const evidenceList = [
  {
    label: "PERSEKOT",
    value: "persekot",
    key: 0,
  },
  {
    label: "SPPD",
    value: "sppd",
    key: 1,
  },
  {
    label: "Fee Project",
    value: "fee_project",
    key: 2,
  },
  {
    label: "PKM",
    value: "third_party",
    key: 3,
  },
];

const RabForm = ({ addRabItemAction }) => {
  const user = getCurrentUser();
  const history = useHistory();
  const [showDetail, setShowDetail] = useState(true);
  const [rows, setRows] = useState([1, 2]);
  const [selectedOption, setSelectedOption] = useState(
    rows.map((row) => {
      return {
        id: row,
        description: "",
        price: 0,
        evidence: "",
      };
    })
  );
  const [data, setData] = useState({
    budget_plan_no: "",
    budget_plan_name: "",
    work_plan_id: "",
    rka_value: 0,
    proposed_budget_plan: 0,
    current_balance: 0,
    budget_type: "",
    subtotal: 0,
    ppn: 0,
    pph: 0,
    profit: 0,
    total: 0,
    maker: "admin",
    department: "Departemen ABC",
    applicant: "Direksi A",
    approver: "Direksi A",
  });
  const [rabNo, setRabNo] = useState({
    no: "",
    code: "",
    month: "",
    year: new Date().getFullYear(),
  });
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [ppn, setPpn] = useState(11);
  const [pph, setPph] = useState(5);

  useEffect(() => {
    const ppn_value = data.subtotal * (ppn * 0.01);
    const pph_value = data.subtotal * (pph * 0.005);
    setData({ ...data, ppn: ppn_value, pph: pph_value });
  }, [ppn, pph, data.subtotal]);

  const getActivities = async () => {
    setLoading1(true);
    await axios
      .get(`${servicePath}/work-plans/list-activity`, {
        headers: {
          Authorization: `Basic ${user.token}`,
        },
      })
      .then((res) => {
        const result = res.data.output_schema.map((item, index) => {
          return {
            label: item.activity_code,
            value: item.activity_code,
            key: index,
          };
        });
        setActivities(result);
        setLoading1(false);
      });
  };

  const getWorkPlan = async () => {
    setLoading2(true);
    await axios
      .get(
        `${servicePath}/work-plans?key=activityCode&value=${selectedActivity}`,
        {
          headers: {
            Authorization: `Basic ${user.token}`,
          },
        }
      )
      .then((res) => {
        const result = res.data.output_schema.data[0];
        setData({
          ...data,
          work_plan_id: result.work_plan_id,
          rka_value: result.rka_value,
          budget_type: result.budget_type,
        });
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
            price: 0,
            evidence: "",
          },
        ]);
      setRows(newRows);
      setSelectedOption(newOption);
    } else {
      newRows.push(rows[rows.length - 1] + 1);
      newOption.push({
        id: newRows[newRows.length - 1],
        description: "",
        price: 0,
        evidence: "",
      });
      setRows(newRows);
      setSelectedOption(newOption);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const details = selectedOption.map((item) => {
      return {
        description: item.description,
        price: item.price,
        evidence: item.evidence,
      };
    });
    const postData = {
      budget_plan_no: data.budget_plan_no,
      budget_plan_name: data.budget_plan_name,
      work_plan_id: data.work_plan_id,
      rka_value: data.rka_value,
      proposed_budget_plan: data.proposed_budget_plan,
      current_balance: data.current_balance,
      sub_total: data.subtotal,
      value_added_tax: data.ppn,
      income_tax: data.pph,
      total: data.total,
      details,
    };
    const check = await checkDuplicate(postData.budget_plan_no, menuMasters["/budget-plans"], 'budgetPlanNo');
    if (check.data.valid) {
      addRabItemAction([postData, history]);
    } else {
      NotificationManager.error('RAB telah ada!', 'Gagal', 3000, null, null, '');
    }
  };

  useEffect(() => {
    getActivities();
    return () => setLoading1(false);
  }, []);

  useEffect(() => {
    setData({
      ...data,
      budget_plan_no: `${rabNo.no}/RAB/CDB-${rabNo.code}/${rabNo.month}/${rabNo.year}`,
    });
  }, [rabNo]);

  useEffect(() => {
    if (selectedActivity !== "") {
      getWorkPlan();
    }
  }, [selectedActivity]);

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
    let subtotal = 0;
    selectedOption.forEach((item) => {
      if (item.price !== "") {
        subtotal += item.price;
      }
    });
    const total = subtotal + data.ppn + data.pph;
    const current_balance = data.rka_value - total;
    const profit = ((current_balance / data.rka_value) * 100).toFixed(2);

    if (current_balance < 0) {
      setErrorMsg("Nilai yang diajukan melebihi nilai RKA!");
    } else {
      setData({
        ...data,
        subtotal,
        total,
        current_balance,
        profit,
        proposed_budget_plan: total,
      });
    }
  }, [data.ppn, data.pph, selectedOption]);

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
            value={rabNo.no}
            onChange={(e) => setRabNo({ ...rabNo, no: e.target.value })}
          />
          <h6 className="my-auto">/RAB/CDB-</h6>
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
            value={rabNo.code}
            onChange={(e) => setRabNo({ ...rabNo, code: e.target.value })}
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
            value={rabNo.month}
            onChange={(e) => setRabNo({ ...rabNo, month: e.target.value })}
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
            value={rabNo.year}
            onChange={(e) => setRabNo({ ...rabNo, year: e.target.value })}
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
                  <Label>Judul RAB</Label>
                  <Input
                    required
                    className="rounded-lg"
                    value={data.budget_plan_name}
                    onChange={(e) =>
                      setData({ ...data, budget_plan_name: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Kode aktivitas</Label>
                  <Select
                    components={{ Input: CustomSelectInput }}
                    className="react-select"
                    classNamePrefix="react-select"
                    placeholder={`${loading1 ? "Loading..." : "Pilih"}`}
                    value={activities.filter(
                      (item) => item.value === selectedActivity
                    )}
                    onChange={(e) => setSelectedActivity(e.value)}
                    options={activities}
                  />
                </FormGroup>
                {/* <FormGroup>
                  <Label>Tipe</Label>
                  <Input
                    readOnly
                    className="rounded-lg"
                    value={`${loading2 ? "Loading..." : data.budget_type}`}
                  />
                </FormGroup> */}
                <FormGroup>
                  <Label>Estimasi pendapatan</Label>
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
                      value={`${loading2 ? "Loading..." : data.rka_value}`}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label>Rencana pengadaan yang diusulkan</Label>
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
                      value={data.proposed_budget_plan}
                      onValueChange={(e) => {
                        const { value } = e;
                        setData({
                          ...data,
                          proposed_budget_plan: parseInt(value)
                            ? parseInt(value)
                            : 0,
                        });
                      }}
                    />
                  </InputGroup>
                </FormGroup>
                <Row>
                  <Colxx xxs="6">
                    <FormGroup>
                      <Label>Estimasi profit</Label>
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
                          value={data.current_balance}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Colxx>
                  <Colxx xxs="6">
                    <FormGroup>
                      <Label>Persentase profit</Label>
                      <InputGroup>
                        <InputGroupAddon addonType="append">
                          <div
                            className="d-flex align-items-center px-3"
                            style={{
                              background: "#E0E7EC",
                            }}
                          >
                            %
                          </div>
                        </InputGroupAddon>
                        <CurrencyFormat
                          readOnly={true}
                          thousandSeparator={true}
                          suffix="%"
                          className="form-control"
                          value={data.profit ? data.profit : 0}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Colxx>
                </Row>
              </>
            )}
          </CardBody>
        </Card>
        <Card className="mb-4">
          <CardBody>
            <h5 className="font-weight-bold text-center mb-4">Rincian RAB</h5>
            <Table className="w-100">
              <thead>
                <tr>
                  <th width="5%">#</th>
                  <th width="35%">Paket pengadaan/Uraian</th>
                  <th width="25%">Jumlah Harga</th>
                  <th width="25%">Keterangan</th>
                  <th width="10%"></th>
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
                      <CurrencyFormat
                        required={true}
                        thousandSeparator={true}
                        prefix={"Rp"}
                        className="form-control"
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
                      <Select
                        components={{ Input: CustomSelectInput }}
                        className="react-select"
                        classNamePrefix="react-select"
                        placeholder="Pilih"
                        value={evidenceList.filter(
                          (item) =>
                            item.value === selectedOption[index].evidence
                        )}
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                evidence: e.value,
                              };
                            } else {
                              return option;
                            }
                          });
                          setSelectedOption(newOption);
                        }}
                        options={evidenceList}
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
                  value={data.subtotal}
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
            <Row>
              <Colxx xxs="6">
                <FormGroup>
                  <Label>Dibuat oleh</Label>
                  <Input readOnly className="rounded-lg" value={data.maker} />
                </FormGroup>
              </Colxx>
              <Colxx xxs="6">
                <FormGroup>
                  <Label>Departemen</Label>
                  <Input
                    readOnly
                    className="rounded-lg"
                    value={data.department}
                  />
                </FormGroup>
              </Colxx>
            </Row>
            <FormGroup>
              <Label>Diajukan oleh</Label>
              <Input readOnly className="rounded-lg" value={data.applicant} />
            </FormGroup>
            <FormGroup>
              <Label>Disetujui oleh</Label>
              <Input readOnly className="rounded-lg" value={data.approver} />
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

const mapStateToProps = ({ rab }) => {
  const { rabItems, loading } = rab;
  return { rabItems, loading };
};
export default injectIntl(
  connect(mapStateToProps, {
    addRabItemAction: addRabItem,
  })(RabForm)
);

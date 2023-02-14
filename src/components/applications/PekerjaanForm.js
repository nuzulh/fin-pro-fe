import React, { useState } from "react";
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
  Row,
} from "reactstrap";
import CurrencyFormat from "react-currency-format";
import { useEffect } from "react";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser, getDateWithFormat } from "helpers/Utils";
import Select from "react-select";
import CustomSelectInput from "components/common/CustomSelectInput";
import { Colxx } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";

const PekerjaanForm = ({ onSubmit }) => {
  const user = getCurrentUser();
  const [data, setData] = useState({
    project_title: "",
    reference_number: "",
    budget_plan_id: "",
    offer_value: 0,
    tax: 11,
  });
  const [projectNo, setProjectNo] = useState({
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
  const [budgetPlans, setBudgetPlans] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [offerTotal, setOfferTotal] = useState(0);

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

  const getBudgetPlanDetail = async () => {
    setLoading2(true);
    await axios
      .get(
        `${servicePath}/budget-plans/detail?budget-plan-id=${data.budget_plan_id}`,
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
        setLoading2(false);
      });
  };

  useEffect(() => {
    setData({
      ...data,
      work_no: `${projectNo.no}/Project/CDB-${projectNo.code}/${projectNo.month}/${projectNo.year}`,
    });
  }, [projectNo]);

  useEffect(() => {
    getBudgetPlanDetail();
    return () => setLoading2(false);
  }, [data.budget_plan_id]);

  useEffect(() => {
    getBudgetPlans();
    return () => setLoading1(false);
  }, []);

  useEffect(() => {
    const tax = data.tax * 0.01 * data.offer_value;
    const total = data.offer_value + tax;
    if (total > rab.total) {
      NotificationManager.warning(
        "Nilai penawaran melebihi nilai RAB!",
        "Peringatan",
        3000,
        null,
        null,
        ""
      );
    } else {
      setOfferTotal(total);
    }
  }, [data.tax, data.offer_value]);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...data,
          budget_plan: {
            ...rab,
          },
        });
      }}
    >
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
          value={projectNo.no}
          onChange={(e) => setProjectNo({ ...projectNo, no: e.target.value })}
        />
        <h6 className="my-auto">/Project/CDB-</h6>
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
          value={projectNo.code}
          onChange={(e) => setProjectNo({ ...projectNo, code: e.target.value })}
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
          value={projectNo.month}
          onChange={(e) =>
            setProjectNo({ ...projectNo, month: e.target.value })
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
          type="number"
          placeholder="Tahun"
          value={projectNo.year}
          onChange={(e) => setProjectNo({ ...projectNo, year: e.target.value })}
        />
      </Row>
      <Card className="mb-4">
        <CardBody>
          <h5 className="mb-4 font-weight-bold">Detail</h5>
          <FormGroup>
            <Label>Judul Pekerjaan</Label>
            <Input
              required
              className="rounded-lg"
              value={data.project_title}
              onChange={(e) =>
                setData({ ...data, project_title: e.target.value })
              }
            />
          </FormGroup>
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
          <FormGroup>
            <Label>Tanggal RAB</Label>
            <Input
              required
              readOnly
              className="rounded-lg"
              value={
                loading2
                  ? "Loading..."
                  : rab.creation_time !== ""
                  ? getDateWithFormat(rab.creation_time)
                  : ""
              }
            />
          </FormGroup>
          <FormGroup>
            <Label>No. RAB</Label>
            <Input
              required
              readOnly
              className="rounded-lg"
              value={loading2 ? "Loading..." : rab.budget_plan_no}
            />
          </FormGroup>
          <FormGroup>
            <Label>Kode aktivitas</Label>
            <Input
              required
              readOnly
              className="rounded-lg"
              value={loading2 ? "Loading..." : rab.work_plan.activity_code}
            />
          </FormGroup>
          <FormGroup>
            <Label>Nilai RAB</Label>
            <CurrencyFormat
              required={true}
              readOnly={true}
              thousandSeparator={true}
              prefix={"Rp"}
              className="form-control"
              value={loading2 ? "Loading..." : rab.total}
            />
          </FormGroup>
          <FormGroup>
            <Label>No. Referensi</Label>
            <Input
              required
              className="rounded-lg"
              value={data.reference_number}
              onChange={(e) =>
                setData({ ...data, reference_number: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label>Nilai penawaran (Tanpa PPN)</Label>
            <CurrencyFormat
              required={true}
              thousandSeparator={true}
              prefix={"Rp"}
              className="form-control"
              value={data.offer_value}
              onValueChange={(e) => {
                const { value } = e;
                setData({
                  ...data,
                  offer_value: parseInt(value) ? parseInt(value) : 0,
                });
              }}
            />
          </FormGroup>
          <Row>
            <Colxx xxs="2">
              <FormGroup>
                <Label>PPN</Label>
                <CurrencyFormat
                  required={true}
                  suffix="%"
                  className="form-control"
                  value={data.tax}
                  onValueChange={(e) => {
                    const { value } = e;
                    setData({
                      ...data,
                      tax: parseInt(value) ? parseInt(value) : 0,
                    });
                  }}
                />
              </FormGroup>
            </Colxx>
            <Colxx xxs="10">
              <FormGroup>
                <Label>Nilai penawaran (Termasuk PPN)</Label>
                <CurrencyFormat
                  readOnly={true}
                  thousandSeparator={true}
                  prefix={"Rp"}
                  className="form-control"
                  value={offerTotal}
                />
              </FormGroup>
            </Colxx>
          </Row>
        </CardBody>
      </Card>
      <Button size="lg" color="primary w-100 btn-shadow">
        Simpan
      </Button>
    </Form>
  );
};

export default PekerjaanForm;

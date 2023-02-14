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
} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "components/common/CustomSelectInput";
import CurrencyFormat from "react-currency-format";
import { getRkaList } from "redux/actions";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

const bugdetType = [
  {
    label: "Proyek",
    value: "PROJECT",
    key: 0,
  },
  {
    label: "Operasional",
    value: "OPERATIONAL",
    key: 1,
  },
  {
    label: "Investasi",
    value: "INVESTMENT",
    key: 2,
  },
];

const RkaForm = ({ onSubmit, getRkaListAction }) => {
  const [data, setData] = useState({
    activity_code: "",
    budget_post: "-",
    unit: "",
    type: "PROJECT",
    rka_value: 0,
  });

  useEffect(() => {
    getRkaListAction(1, 5);
  }, [getRkaListAction]);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(data);
      }}
    >
      <Card className="mb-4">
        <CardBody>
          <h5 className="mb-4">Detail</h5>
          <FormGroup>
            <Label>Kode aktivitas</Label>
            <Input
              required
              name="code"
              className="rounded-lg"
              placeholder="Kode aktivitas"
              value={data.activity_code}
              onChange={(e) =>
                setData({ ...data, activity_code: e.target.value })
              }
            />
          </FormGroup>
          {/* <FormGroup>
            <Label>Anggaran yang dipergunakan</Label>
            <Input
              required
              name="pos"
              className="rounded-lg"
              placeholder="Nama pos anggaran"
              value={data.budget_post}
              onChange={(e) =>
                setData({ ...data, budget_post: e.target.value })
              }
            />
          </FormGroup> */}
          <FormGroup>
            <Label>Unit kerja</Label>
            <Input
              required
              name="unit"
              className="rounded-lg"
              placeholder="Nama unit kerja"
              value={data.unit}
              onChange={(e) => setData({ ...data, unit: e.target.value })}
            />
          </FormGroup>
          {/* <FormGroup>
            <Label>Tipe budget</Label>
            <Select
              components={{ Input: CustomSelectInput }}
              className="react-select"
              classNamePrefix="react-select"
              name="budgetType"
              placeholder="Pilih tipe budget"
              value={bugdetType.filter((item) => item.value === "PROJECT")}
              onChange={(e) => setData({ ...data, type: e.value })}
              options={bugdetType}
            />
            <Input readOnly className="rounded-lg" value={data.type} />
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
                required={true}
                thousandSeparator={true}
                prefix={"Rp"}
                className="form-control"
                name="amount"
                value={data.rka_value}
                onValueChange={(e) => {
                  const { value } = e;
                  setData({
                    ...data,
                    rka_value: parseInt(value) ? parseInt(value) : 0,
                  });
                }}
              />
            </InputGroup>
          </FormGroup>
        </CardBody>
      </Card>
      <Button size="lg" color="primary w-100 btn-shadow">
        Simpan
      </Button>
    </Form>
  );
};

const mapStateToProps = ({ rka }) => {
  const { rkaItems, loading } = rka;
  return { rkaItems, loading };
};
export default injectIntl(
  connect(mapStateToProps, {
    getRkaListAction: getRkaList,
  })(RkaForm)
);

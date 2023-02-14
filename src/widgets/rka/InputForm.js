import { getCurrentUser } from "helpers/Utils";
import React, { useState } from "react";
import CurrencyFormat from "react-currency-format";
import { Button, Card, CardBody, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label } from "reactstrap";

const RkaForm = ({ onSubmit, loading }) => {
  const user = getCurrentUser();

  const [data, setData] = useState({
    activity_code: "",
    unit: "",
    rka_value: 0,
    created_by: user.username,
  });

  return (
    <Form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(data);
    }}>
      <Card className="mb-4">
        <CardBody>
          <h5 className="mb-4">Detail</h5>
          <FormGroup>
            <Label>Kode aktivitas</Label>
            <Input
              required
              name="activity_code"
              className="rounded-lg"
              placeholder="Kode aktivitas"
              value={data.activity_code}
              onChange={(e) =>
                setData({ ...data, activity_code: e.target.value })
              }
            />
          </FormGroup>
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
                name="rka_value"
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
      {loading ? (
        <Button size="lg" color="primary w-100 btn-shadow">
          Simpan
        </Button>
      ) : (
        <div className="loading position-relative" />
      )}
    </Form>
  );
};

export default React.memo(RkaForm);
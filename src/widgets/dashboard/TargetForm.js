import React, { useState } from "react";
import CurrencyFormat from "react-currency-format";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Label,
  Row,
} from "reactstrap";
import { Colxx } from "components/common/CustomBootstrap";

const TargetForm = ({ onSubmit, loading }) => {
  const [data, setData] = useState({
    year: 0,
    jan: 0,
    feb: 0,
    mar: 0,
    apr: 0,
    mei: 0,
    jun: 0,
    jul: 0,
    agt: 0,
    sep: 0,
    okt: 0,
    nov: 0,
    des: 0,
  });

  return (
    <Form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(data)
    }}>
      <Card className="mb-4">
        <CardBody>
          <CardTitle>Tahunan</CardTitle>
          <FormGroup>
            <Label>Target tahun ini</Label>
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
                value={data.year}
                onValueChange={(e) => {
                  const { value } = e;
                  setData({
                    ...data,
                    year: parseInt(value) ? parseInt(value) : 0,
                  });
                }}
              />
            </InputGroup>
          </FormGroup>
        </CardBody>
      </Card>
      <Card className="mb-4">
        <CardBody>
          <CardTitle>Bulanan</CardTitle>
          <p>Silahkan tentukan target setiap bulannya</p>
          <Row>
            <Colxx xss="6">
              <FormGroup>
                <Label>Januari</Label>
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
                    value={data.jan}
                    onValueChange={(e) => {
                      const { value } = e;
                      setData({
                        ...data,
                        jan: parseInt(value) ? parseInt(value) : 0,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Februari</Label>
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
                    value={data.feb}
                    onValueChange={(e) => {
                      const { value } = e;
                      setData({
                        ...data,
                        feb: parseInt(value) ? parseInt(value) : 0,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Maret</Label>
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
                    value={data.mar}
                    onValueChange={(e) => {
                      const { value } = e;
                      setData({
                        ...data,
                        mar: parseInt(value) ? parseInt(value) : 0,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>April</Label>
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
                    value={data.apr}
                    onValueChange={(e) => {
                      const { value } = e;
                      setData({
                        ...data,
                        apr: parseInt(value) ? parseInt(value) : 0,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Mei</Label>
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
                    value={data.mei}
                    onValueChange={(e) => {
                      const { value } = e;
                      setData({
                        ...data,
                        mei: parseInt(value) ? parseInt(value) : 0,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Juni</Label>
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
                    value={data.jun}
                    onValueChange={(e) => {
                      const { value } = e;
                      setData({
                        ...data,
                        jun: parseInt(value) ? parseInt(value) : 0,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
            </Colxx>
            <Colxx xss="6">
              <FormGroup>
                <Label>Juli</Label>
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
                    value={data.jul}
                    onValueChange={(e) => {
                      const { value } = e;
                      setData({
                        ...data,
                        jul: parseInt(value) ? parseInt(value) : 0,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Agustus</Label>
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
                    value={data.agt}
                    onValueChange={(e) => {
                      const { value } = e;
                      setData({
                        ...data,
                        agt: parseInt(value) ? parseInt(value) : 0,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>September</Label>
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
                    value={data.sep}
                    onValueChange={(e) => {
                      const { value } = e;
                      setData({
                        ...data,
                        sep: parseInt(value) ? parseInt(value) : 0,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Oktober</Label>
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
                    value={data.okt}
                    onValueChange={(e) => {
                      const { value } = e;
                      setData({
                        ...data,
                        okt: parseInt(value) ? parseInt(value) : 0,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>November</Label>
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
                    value={data.nov}
                    onValueChange={(e) => {
                      const { value } = e;
                      setData({
                        ...data,
                        nov: parseInt(value) ? parseInt(value) : 0,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Desember</Label>
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
                    value={data.des}
                    onValueChange={(e) => {
                      const { value } = e;
                      setData({
                        ...data,
                        des: parseInt(value) ? parseInt(value) : 0,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
            </Colxx>
          </Row>
        </CardBody>
      </Card>
      {loading ? (
        <Button size="lg" color="primary btn-shadow w-100">
          Simpan
        </Button>
      ) : (
        <div className="loading position-relative my-4" />
      )}
    </Form>
  );
};

export default React.memo(TargetForm);
import React, { useState } from "react";
import CurrencyFormat from "react-currency-format";
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
import { Colxx } from "components/common/CustomBootstrap";
import { getDateWithFormat } from "helpers/Utils";

const RkaListItem = ({
  item,
  onEdit,
  isImport = false,
}) => {
  const [showDetail, setShowDetail] = useState(false);
  const [newValue, setNewValue] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <>
      {showEditForm ? (
        <Colxx xxs="12">
          <Form>
            <Card className="mb-4">
              <CardBody>
                <h5 className="mb-4">Edit</h5>
                <FormGroup>
                  <Label>Unit kerja</Label>
                  <Input
                    required
                    className="rounded-lg"
                    placeholder="Nama unit kerja"
                    value={newValue.unit}
                    onChange={(e) =>
                      setNewValue({
                        ...newValue,
                        unit: e.target.value,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Estimasi Pendapatan</Label>
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
                      thousandSeparator={true}
                      prefix={"Rp"}
                      className="form-control"
                      name="amount"
                      value={newValue.rka_value}
                      onValueChange={(e) => {
                        const { value } = e;
                        setNewValue({
                          ...newValue,
                          rka_value: parseInt(value) ? parseInt(value) : 0,
                        });
                      }}
                    />
                  </InputGroup>
                </FormGroup>
                <div>
                  <Button
                    outline
                    color="primary btn-shadow mr-3"
                    onClick={() => {
                      setShowEditForm(false);
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    color="primary btn-shadow"
                    onClick={() => onEdit(newValue)}
                  >
                    Simpan perubahan
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Form>
        </Colxx>
      ) : (
        <Colxx xxs="12">
          <Card className="card d-flex mb-3">
            <div
              className="d-flex flex-grow-1 min-width-zero"
              onClick={() => setShowDetail(!showDetail)}
            >
              <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                <p className="mb-1 text-small w-30 w-xs-100">
                  {item.activity_code}
                </p>
                <p className="mb-1 text-small w-25 w-xs-100">{item.unit}</p>
                <p className="mb-1 text-small w-25 w-xs-100">
                  <CurrencyFormat
                    prefix="Rp"
                    thousandSeparator={true}
                    displayType="text"
                    value={item.rka_value}
                  />
                </p>
                <p className="mb-1 text-small w-20 w-xs-100">
                  {getDateWithFormat(item.created_date)}
                </p>
                <i
                  hidden={isImport}
                  className={
                    showDetail
                      ? "simple-icon-arrow-up text-primary align-self-center w-5 w-xs-100 font-weight-bold"
                      : "simple-icon-arrow-down text-primary align-self-center w-5 w-xs-100 font-weight-bold"
                  }
                />
                <i
                  hidden={!isImport}
                  style={{
                    fontSize: "1.1rem",
                  }}
                  className={
                    item.isValid
                      ? "simple-icon-check text-success align-self-center w-5 w-xs-100 font-weight-bold"
                      : "simple-icon-close text-danger align-self-center w-5 w-xs-100 font-weight-bold"
                  }
                />
              </CardBody>
            </div>
            {showDetail && !isImport && (
              <div className="d-flex align-items-end justify-content-end">
                {/* <Button
                  color="primary btn-shadow m-4"
                  onClick={() => {
                    setNewValue(item);
                    setShowEditForm(true);
                  }}
                >
                  Edit
                </Button> */}
                <div className="mx-1 mb-3 align-self-end">
                  <div className="mx-4 d-flex flex-column text-right">
                    <span className="my-1">
                      <span>Estimasi Pendapatan: </span>
                      <strong>
                        <CurrencyFormat
                          prefix="Rp"
                          thousandSeparator={true}
                          displayType="text"
                          value={item.rka_value || 0}
                        />
                      </strong>
                    </span>
                    <span className="my-1">
                      <span>Saldo: </span>
                      <strong>
                        <CurrencyFormat
                          prefix="Rp"
                          thousandSeparator={true}
                          displayType="text"
                          value={item.balance || 0}
                        />
                      </strong>
                    </span>
                    <span className="my-1">
                      <span>Realisasi PA: </span>
                      <strong>
                        <CurrencyFormat
                          prefix="Rp"
                          thousandSeparator={true}
                          displayType="text"
                          value={item.pa_realization || 0}
                        />
                      </strong>
                    </span>
                    <span className="my-1">
                      <span>Realisasi PO: </span>
                      <strong>
                        <CurrencyFormat
                          prefix="Rp"
                          thousandSeparator={true}
                          displayType="text"
                          value={item.po_realization || 0}
                        />
                      </strong>
                    </span>
                    <span className="my-1">
                      <span>Realisasi BA/Invoice: </span>
                      <strong>
                        <CurrencyFormat
                          prefix="Rp"
                          thousandSeparator={true}
                          displayType="text"
                          value={item.ba_realization || 0}
                        />
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </Colxx>
      )}
    </>
  );
};

export default React.memo(RkaListItem);

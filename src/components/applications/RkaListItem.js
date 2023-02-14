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
import Select from "react-select";
import CustomSelectInput from "components/common/CustomSelectInput";
import { Colxx } from "../common/CustomBootstrap";
import { getDateWithFormat } from "helpers/Utils";

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

const RkaListItem = ({
  item,
  editOption = false,
  onEdit,
  isImport = false,
}) => {
  const [showDetail, setShowDetail] = useState(false);
  const [newValue, setNewValue] = useState(item);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedBudgetType, setSelectedBudgetType] = useState(
    item.budget_type ? item.budget_type : item.type
  );

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
                    onClick={async () => {
                      await onEdit(newValue);
                      setNewValue(item);
                    }}
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
                  {getDateWithFormat(item.creation_time)}
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
                    item.valid
                      ? "simple-icon-check text-success align-self-center w-5 w-xs-100 font-weight-bold"
                      : "simple-icon-close text-danger align-self-center w-5 w-xs-100 font-weight-bold"
                  }
                />
              </CardBody>
            </div>
            {showDetail && !isImport && (
              <div className="d-flex align-items-end justify-content-between">
                <Button
                  color="primary btn-shadow m-4"
                  onClick={() => {
                    setShowEditForm(true);
                  }}
                >
                  Edit
                </Button>
                <div className="mx-1 mb-3 align-self-end">
                  <div className="mx-4 d-flex flex-column text-right">
                    <span className="my-1">
                      <span>Estimasi Pendapatan: </span>
                      <strong>
                        <CurrencyFormat
                          prefix="Rp"
                          thousandSeparator={true}
                          displayType="text"
                          value={item.rka_value}
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
                          value={
                            item.details && item.details.offer_total
                              ? item.details.offer_total
                              : 0
                          }
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
                          value={
                            item.details.contract_total
                              ? item.details.contract_total
                              : 0
                          }
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
                          value={
                            item.details.ba_total ? item.details.ba_total : 0
                          }
                        />
                      </strong>
                    </span>
                    {/* <strong className="my-2">Saldo</strong>
                    <span className="my-1">
                      IDR <strong>000.000.000.000</strong>
                    </span> */}
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

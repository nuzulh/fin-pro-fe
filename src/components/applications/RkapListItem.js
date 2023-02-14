import { adminRoot, servicePath2 } from "constants/defaultValues";
import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import ReactDatePicker from "react-datepicker";
import { NavLink, useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { Colxx } from "../common/CustomBootstrap";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { NotificationManager } from "components/common/react-notifications";

const RkapListItem = ({ item, onEdit }) => {
  const [showContract, setShowContract] = useState(false);
  const [showBa, setShowBa] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newValue, setNewValue] = useState(item);
  const [contract, setContract] = useState({
    date: new Date(),
    no: "",
    value: 0,
    files: [],
  });
  const [ba, setBa] = useState({
    date: new Date(),
    no: "",
    value: 0,
    files: [],
  });
  const [invoice, setInvoice] = useState({
    date: new Date(),
    no: "",
    value: 0,
    files: [],
  });

  const handleUpload = (e) => {
    const files = Array.prototype.slice.call(e.target.files);
    if (showContract) {
      const uploaded = [...contract.files];
      files.some((file) => {
        if (uploaded.findIndex((f) => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setContract({ ...contract, files: uploaded });
    } else if (showBa) {
      const uploaded = [...ba.files];
      files.some((file) => {
        if (uploaded.findIndex((f) => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setBa({ ...ba, files: uploaded });
    } else {
      const uploaded = [...invoice.files];
      files.some((file) => {
        if (uploaded.findIndex((f) => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setInvoice({ ...invoice, files: uploaded });
    }
  };

  const handleDelete = (fileName) => {
    if (showContract) {
      const files = contract.files.filter((file) => file.name !== fileName);
      setContract({ ...contract, files });
    } else if (showBa) {
      const files = ba.files.filter((file) => file.name !== fileName);
      setBa({ ...ba, files });
    } else {
      const files = invoice.files.filter((file) => file.name !== fileName);
      setInvoice({ ...invoice, files });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (showContract) {
      try {
        await axios
          .patch(
            `${servicePath2}/income?id=${item.id}&status=CONTRACT`,
            contract
          )
          .then(() => {
            window.location.reload();
          });
      } catch (e) {
        NotificationManager.error(
          e.response.data.message,
          "Gagal perbarui!",
          3000,
          null,
          null,
          ""
        );
      }
    } else if (showBa) {
      try {
        await axios
          .patch(`${servicePath2}/income?id=${item.id}&status=BA`, ba)
          .then(() => {
            window.location.reload();
          });
      } catch (e) {
        NotificationManager.error(
          e.response.data.message,
          "Gagal perbarui!",
          3000,
          null,
          null,
          ""
        );
      }
    } else {
      try {
        await axios
          .patch(`${servicePath2}/income?id=${item.id}&status=INVOICE`, invoice)
          .then(() => {
            window.location.reload();
          });
      } catch (e) {
        NotificationManager.error(
          e.response.data.message,
          "Gagal perbarui!",
          3000,
          null,
          null,
          ""
        );
      }
    }
  };

  const [offerTotal, setOfferTotal] = useState(0);
  useEffect(() => {
    if (item) {
      const ppn = item.tax * 0.01 * item.offer_value;
      const total = ppn + item.offer_value;

      setOfferTotal(total);
    }
  }, [item]);

  return (
    <>
      <Colxx xxs="12">
        <Card className="card d-flex mb-3">
          <div className="d-flex flex-grow-1 min-width-zero">
            <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
              <NavLink
                className="mb-1 text-small w-15 w-xs-100 btn btn-primary btn-shadow py-1 px-0"
                to={{
                  pathname: `${adminRoot}/rka/rkap-detail`,
                  state: { item },
                }}
              >
                <i className="iconsminds-right-1 font-weight-bold" />
                {item.budget_plan.budget_plan_no}
              </NavLink>
              <p className="mb-1 text-small w-20 w-xs-100">
                {item.project_title}
              </p>
              <p className="mb-1 text-muted text-small w-15 w-xs-100">
                <CurrencyFormat
                  prefix="Rp"
                  thousandSeparator={true}
                  displayType="text"
                  value={item.budget_plan.total}
                />
              </p>
              <p className="mb-1 text-muted text-small w-15 w-xs-100">
                <CurrencyFormat
                  prefix="Rp"
                  thousandSeparator={true}
                  displayType="text"
                  value={offerTotal}
                />
              </p>
              {item.contract_value ? (
                <p className="mb-1 text-muted text-small w-10 w-xs-100">
                  <CurrencyFormat
                    prefix="Rp"
                    thousandSeparator={true}
                    displayType="text"
                    value={item.contract_value}
                  />
                </p>
              ) : (
                <p
                  className="c-pointer mb-1 font-italic font-weight-bold text-primary text-small w-10 w-xs-100"
                  onClick={() => {
                    setShowContract(!showContract);
                    setShowBa(false);
                    setShowInvoice(false);
                  }}
                >
                  Input Kontrak
                </p>
              )}
              {item.ba_value ? (
                <p className="mb-1 text-muted text-small w-10 w-xs-100">
                  <CurrencyFormat
                    prefix="Rp"
                    thousandSeparator={true}
                    displayType="text"
                    value={item.ba_value}
                  />
                </p>
              ) : (
                <p
                  className="c-pointer mb-1 font-italic font-weight-bold text-primary text-small w-10 w-xs-100"
                  onClick={() => {
                    setShowContract(false);
                    setShowBa(!showBa);
                    setShowInvoice(false);
                  }}
                >
                  Input BA
                </p>
              )}
              {item.invoice_value ? (
                <p className="mb-1 text-muted text-small w-10 w-xs-100">
                  <CurrencyFormat
                    prefix="Rp"
                    thousandSeparator={true}
                    displayType="text"
                    value={item.invoice_value}
                  />
                </p>
              ) : (
                <p
                  className="c-pointer mb-1 font-italic font-weight-bold text-primary text-small w-10 w-xs-100"
                  onClick={() => {
                    setShowContract(false);
                    setShowBa(false);
                    setShowInvoice(!showInvoice);
                  }}
                >
                  Input Invoice
                </p>
              )}
            </CardBody>
            <div
              style={{
                position: "absolute",
                alignSelf: "center",
                right: 0,
              }}
            >
              <i
                className={`simple-icon-note text-primary float-right px-3 font-weight-bold c-pointer`}
                onClick={() => {
                  setShowEdit(!showEdit);
                  setShowContract(false);
                  setShowBa(false);
                  setShowInvoice(false);
                }}
              />
            </div>
          </div>
          {showEdit && (
            <Row className="mb-4">
              <Colxx className="mx-4">
                <p className="font-weight-bold">Perbaharui pekerjaan</p>
                <Form onSubmit={onEdit}>
                  <FormGroup>
                    <Label>Judul pekerjaan</Label>
                    <Input
                      required
                      name="project_title"
                      className="rounded-lg"
                      value={newValue.project_title}
                      onChange={(e) =>
                        setNewValue({
                          ...newValue,
                          project_title: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Nilai penawaran</Label>
                    <CurrencyFormat
                      required={true}
                      prefix="Rp"
                      thousandSeparator={true}
                      className="form-control"
                      value={newValue.offer_value}
                      onValueChange={(e) => {
                        const { value } = e;
                        const result = parseInt(value) ? parseInt(value) : 0;
                        setNewValue({ ...newValue, offer_value: result });
                      }}
                    />
                  </FormGroup>
                  {item.contract_value && (
                    <FormGroup>
                      <Label>Nilai kontrak</Label>
                      <CurrencyFormat
                        required={true}
                        prefix="Rp"
                        thousandSeparator={true}
                        className="form-control"
                        value={newValue.contract_value}
                        onValueChange={(e) => {
                          const { value } = e;
                          const result = parseInt(value) ? parseInt(value) : 0;
                          setNewValue({ ...newValue, contract_value: result });
                        }}
                      />
                    </FormGroup>
                  )}
                  {item.ba_value && (
                    <FormGroup>
                      <Label>Nilai BA</Label>
                      <CurrencyFormat
                        required={true}
                        prefix="Rp"
                        thousandSeparator={true}
                        className="form-control"
                        value={newValue.ba_value}
                        onValueChange={(e) => {
                          const { value } = e;
                          const result = parseInt(value) ? parseInt(value) : 0;
                          setNewValue({ ...newValue, ba_value: result });
                        }}
                      />
                    </FormGroup>
                  )}
                  {item.invoice_value && (
                    <FormGroup>
                      <Label>Nilai kontrak</Label>
                      <CurrencyFormat
                        required={true}
                        prefix="Rp"
                        thousandSeparator={true}
                        className="form-control"
                        value={newValue.invoice_value}
                        onValueChange={(e) => {
                          const { value } = e;
                          const result = parseInt(value) ? parseInt(value) : 0;
                          setNewValue({ ...newValue, invoice_value: result });
                        }}
                      />
                    </FormGroup>
                  )}
                  <div>
                    <Button
                      outline
                      color="primary btn-shadow mr-3"
                      onClick={() => {
                        setShowEdit(false);
                      }}
                    >
                      Batal
                    </Button>
                    <Button
                      color="primary btn-shadow"
                      onClick={() => {
                        onEdit(newValue);
                        setNewValue(item);
                      }}
                    >
                      Simpan perubahan
                    </Button>
                  </div>
                </Form>
              </Colxx>
            </Row>
          )}
          {showContract && !showEdit && (
            <Row>
              <Colxx className="mx-4">
                <p className="font-weight-bold">Perbaharui status kontrak</p>
                <Form onSubmit={onSubmit}>
                  <Row className="align-items-center mb-2">
                    <Colxx md="4" lg="2">
                      <Label>Tanggal kontrak</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <ReactDatePicker
                        required
                        selected={contract.date}
                        onChange={(date) => setContract({ ...contract, date })}
                        placeholderText="dd/MM/yyyy"
                        dateFormat="dd/MM/yyyy"
                      />
                    </Colxx>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Colxx md="4" lg="2">
                      <Label>No. kontrak</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <Input
                        placeholder="Masukkan no. kontrak"
                        required
                        onChange={(e) =>
                          setContract({
                            ...contract,
                            no: e.target.value,
                          })
                        }
                        value={contract.no}
                      />
                    </Colxx>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Colxx md="4" lg="2">
                      <Label>Nilai kontrak</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <CurrencyFormat
                        className="form-control"
                        prefix="Rp"
                        thousandSeparator={true}
                        placeholder="Masukkan nilai kontrak"
                        required={true}
                        onValueChange={(val) =>
                          setContract({
                            ...contract,
                            value: val.floatValue ? val.floatValue : 0,
                          })
                        }
                        value={contract.value}
                      />
                    </Colxx>
                  </Row>
                  <Row className="align-items-center mb-2 my-3">
                    <Colxx md="4" lg="2">
                      <Label>Dokumen pendukung</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <Button color="primary btn-shadow position-relative p-0">
                        <Input
                          type="file"
                          multiple
                          className="bg-warning position-absolute h-100 w-100"
                          style={{
                            opacity: 0,
                            cursor: "pointer",
                          }}
                          onChange={handleUpload}
                        />
                        <p className="px-4 py-2 my-auto">Unggah</p>
                      </Button>
                    </Colxx>
                    <Colxx xxs="12" className="mt-2">
                      {contract.files.map((item, index) => (
                        <div
                          key={index}
                          className="m-0 d-flex align-items-center"
                          style={{
                            backgroundColor:
                              (index + 1) % 2 === 0 ? "#FFF3E7" : "",
                          }}
                        >
                          <p className="font-weight-bold m-0 px-3 py-2 w-25">
                            {item.name}
                          </p>
                          <i
                            onClick={() => handleDelete(item.name)}
                            className="font-weight-bold simple-icon-trash"
                            style={{
                              fontSize: "1rem",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      ))}
                    </Colxx>
                    <Colxx xxs="12">
                      <div className="float-right">
                        <Button
                          type="button"
                          onClick={() => {
                            setShowContract(false);
                            setShowBa(false);
                            setShowInvoice(false);
                          }}
                          outline
                          color="primary btn-shadow mb-2 mt-2 mr-3"
                        >
                          Batal
                        </Button>
                        <Button
                          type="submit"
                          color="primary btn-shadow mb-2 mt-2"
                        >
                          Perbarui
                        </Button>
                      </div>
                    </Colxx>
                  </Row>
                </Form>
              </Colxx>
            </Row>
          )}
          {showBa && !showEdit && (
            <Row>
              <Colxx className="mx-4">
                <p className="font-weight-bold">Perbaharui status BA</p>
                <Form onSubmit={onSubmit}>
                  <Row className="align-items-center mb-2">
                    <Colxx md="4" lg="2">
                      <Label>Tanggal BA</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <ReactDatePicker
                        required
                        selected={ba.date}
                        onChange={(date) => setBa({ ...ba, date })}
                        placeholderText="dd/MM/yyyy"
                        dateFormat="dd/MM/yyyy"
                      />
                    </Colxx>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Colxx md="4" lg="2">
                      <Label>No. BA</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <Input
                        placeholder="Masukkan no. BA"
                        required
                        onChange={(e) => setBa({ ...ba, no: e.target.value })}
                        value={ba.no}
                      />
                    </Colxx>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Colxx md="4" lg="2">
                      <Label>Nilai BA</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <CurrencyFormat
                        className="form-control"
                        prefix="Rp"
                        thousandSeparator={true}
                        placeholder="Masukkan nilai kontrak"
                        required={true}
                        onValueChange={(val) =>
                          setBa({
                            ...ba,
                            value: val.floatValue ? val.floatValue : 0,
                          })
                        }
                        value={ba.value}
                      />
                    </Colxx>
                  </Row>
                  <Row className="align-items-center mb-2 my-3">
                    <Colxx md="4" lg="2">
                      <Label>Dokumen pendukung</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <Button color="primary btn-shadow position-relative p-0">
                        <Input
                          type="file"
                          multiple
                          className="bg-warning position-absolute h-100 w-100"
                          style={{
                            opacity: 0,
                            cursor: "pointer",
                          }}
                          onChange={handleUpload}
                        />
                        <p className="px-4 py-2 my-auto">Unggah</p>
                      </Button>
                    </Colxx>
                    <Colxx xxs="12" className="mt-2">
                      {ba.files.map((item, index) => (
                        <div
                          key={index}
                          className="m-0 d-flex align-items-center"
                          style={{
                            backgroundColor:
                              (index + 1) % 2 === 0 ? "#FFF3E7" : "",
                          }}
                        >
                          <p className="font-weight-bold m-0 px-3 py-2 w-25">
                            {item.name}
                          </p>
                          <i
                            onClick={() => handleDelete(item.name)}
                            className="font-weight-bold simple-icon-trash"
                            style={{
                              fontSize: "1rem",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      ))}
                    </Colxx>
                    <Colxx xxs="12">
                      <div className="float-right">
                        <Button
                          type="button"
                          onClick={() => {
                            setShowContract(false);
                            setShowBa(false);
                            setShowInvoice(false);
                          }}
                          outline
                          color="primary btn-shadow mb-2 mt-2 mr-3"
                        >
                          Batal
                        </Button>
                        <Button
                          type="submit"
                          color="primary btn-shadow mb-2 mt-2"
                        >
                          Perbarui
                        </Button>
                      </div>
                    </Colxx>
                  </Row>
                </Form>
              </Colxx>
            </Row>
          )}
          {showInvoice && !showEdit && (
            <Row>
              <Colxx className="mx-4">
                <p className="font-weight-bold">Perbaharui status Invoice</p>
                <Form onSubmit={onSubmit}>
                  <Row className="align-items-center mb-2">
                    <Colxx md="4" lg="2">
                      <Label>Tanggal Invoice</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <ReactDatePicker
                        required
                        selected={invoice.date}
                        onChange={(date) => setInvoice({ ...invoice, date })}
                        placeholderText="dd/MM/yyyy"
                        dateFormat="dd/MM/yyyy"
                      />
                    </Colxx>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Colxx md="4" lg="2">
                      <Label>No. Invoice</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <Input
                        placeholder="Masukkan no. Invoice"
                        required
                        onChange={(e) =>
                          setInvoice({ ...invoice, no: e.target.value })
                        }
                        value={invoice.no}
                      />
                    </Colxx>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Colxx md="4" lg="2">
                      <Label>Nilai Invoice</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <CurrencyFormat
                        className="form-control"
                        prefix="Rp"
                        thousandSeparator={true}
                        placeholder="Masukkan nilai kontrak"
                        required={true}
                        onValueChange={(val) =>
                          setInvoice({
                            ...invoice,
                            value: val.floatValue ? val.floatValue : 0,
                          })
                        }
                        value={invoice.value}
                      />
                    </Colxx>
                  </Row>
                  <Row className="align-items-center mb-2 my-3">
                    <Colxx md="4" lg="2">
                      <Label>Dokumen pendukung</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <Button color="primary btn-shadow position-relative p-0">
                        <Input
                          type="file"
                          multiple
                          className="bg-warning position-absolute h-100 w-100"
                          style={{
                            opacity: 0,
                            cursor: "pointer",
                          }}
                          onChange={handleUpload}
                        />
                        <p className="px-4 py-2 my-auto">Unggah</p>
                      </Button>
                    </Colxx>
                    <Colxx xxs="12" className="mt-2">
                      {invoice.files.map((item, index) => (
                        <div
                          key={index}
                          className="m-0 d-flex align-items-center"
                          style={{
                            backgroundColor:
                              (index + 1) % 2 === 0 ? "#FFF3E7" : "",
                          }}
                        >
                          <p className="font-weight-bold m-0 px-3 py-2 w-25">
                            {item.name}
                          </p>
                          <i
                            onClick={() => handleDelete(item.name)}
                            className="font-weight-bold simple-icon-trash"
                            style={{
                              fontSize: "1rem",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      ))}
                    </Colxx>
                    <Colxx xxs="12">
                      <div className="float-right">
                        <Button
                          type="button"
                          onClick={() => {
                            setShowContract(false);
                            setShowBa(false);
                            setShowInvoice(false);
                          }}
                          outline
                          color="primary btn-shadow mb-2 mt-2 mr-3"
                        >
                          Batal
                        </Button>
                        <Button
                          type="submit"
                          color="primary btn-shadow mb-2 mt-2"
                        >
                          Perbarui
                        </Button>
                      </div>
                    </Colxx>
                  </Row>
                </Form>
              </Colxx>
            </Row>
          )}
        </Card>
      </Colxx>
    </>
  );
};

export default React.memo(RkapListItem);

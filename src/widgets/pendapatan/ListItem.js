import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import {
  Card,
  CardBody,
  Input,
  Label,
  Form,
  Button,
  Row,
} from "reactstrap";
import { Colxx } from "components/common/CustomBootstrap";
import { Link } from "react-router-dom";
import { adminRoot } from "constants/defaultValues";
import EntryButton from "../common/EntryButton";
import UploadModal from "widgets/common/UploadModal";
import { NotificationManager } from "components/common/react-notifications";
import { editPendapatanItem } from "redux/actions";
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

const translateStatus = {
  Kontrak: "CONTRACT",
  BA: "BA",
  Invoice: "INVOICE",
};

const PendapatanListItem = ({
  item,
  onEdit,
  isImport = false,
  editPendapatanItemAction,
  loading,
  error,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [newValue, setNewValue] = useState(item);
  const [entryForm, setEntryForm] = useState({
    show: false,
    type: "",
    date: "",
    no: "",
    value: 0,
  });
  const [showUpload, setShowUpload] = useState({
    show: false,
    id: "",
  });

  const onSubmit = () => {
    editPendapatanItemAction(item.income_id, {
      ...entryForm,
      status: translateStatus[entryForm.type],
      activity_code: item.rab.rka.activity_code,
    });
  };

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
  }, [error]);

  return (
    <>
      <Colxx xxs="12">
        <Card className="card d-flex mb-3">
          <div className="d-flex flex-grow-1 min-width-zero">
            <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
              <Link
                className="mb-1 text-small w-15 w-xs-100 btn btn-primary btn-shadow py-1 px-0"
                to={{
                  pathname: `${adminRoot}/rka/pendapatan/detail`,
                  state: { income_id: item.income_id },
                }}
              >
                <i className="iconsminds-right-1 font-weight-bold" />
                {item.income_no}
              </Link>
              <p className="mb-1 text-small w-20 w-xs-100">
                {item.income_name}
              </p>
              <p className="mb-1 text-muted text-small w-15 w-xs-100">
                <CurrencyFormat
                  prefix="Rp"
                  thousandSeparator={true}
                  displayType="text"
                  value={item.rab ? item.rab.rab_value : 1000}
                />
              </p>
              <p className="mb-1 text-muted text-small w-15 w-xs-100">
                <CurrencyFormat
                  prefix="Rp"
                  thousandSeparator={true}
                  displayType="text"
                  value={item.offer_value}
                />
              </p>
              {item.contract_value !== 0 ? (
                <p className="mb-1 text-muted text-small w-10 w-xs-100">
                  <CurrencyFormat
                    prefix="Rp"
                    thousandSeparator={true}
                    displayType="text"
                    value={item.contract_value}
                  />
                </p>
              ) : (
                <EntryButton label="Input Kontrak" onClick={() => setEntryForm({
                  ...entryForm,
                  show: true,
                  type: "Kontrak",
                })} />
              )}
              {item.ba_value !== 0 ? (
                <p className="mb-1 text-muted text-small w-10 w-xs-100">
                  <CurrencyFormat
                    prefix="Rp"
                    thousandSeparator={true}
                    displayType="text"
                    value={item.ba_value}
                  />
                </p>
              ) : (
                <EntryButton label="Input BA" onClick={() => setEntryForm({
                  ...entryForm,
                  show: true,
                  type: "BA",
                })} />
              )}
              {item.invoice_value !== 0 ? (
                <p className="mb-1 text-muted text-small w-10 w-xs-100">
                  <CurrencyFormat
                    prefix="Rp"
                    thousandSeparator={true}
                    displayType="text"
                    value={item.invoice_value}
                  />
                </p>
              ) : (
                <EntryButton label="Input Invoice" onClick={() => setEntryForm({
                  ...entryForm,
                  show: true,
                  type: "Invoice",
                })} />
              )}
            </CardBody>
          </div>
          {entryForm.show && (
            <Row>
              <Colxx className="mx-4">
                <p className="font-weight-bold">Perbaharui status {entryForm.type}</p>
                <Form onSubmit={onSubmit}>
                  <Row className="align-items-center mb-2">
                    <Colxx md="4" lg="2">
                      <Label>Tanggal {entryForm.type}</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <ReactDatePicker
                        required
                        selected={entryForm.date}
                        onChange={(date) => setEntryForm({ ...entryForm, date })}
                        placeholderText="dd/MM/yyyy"
                        dateFormat="dd/MM/yyyy"
                      />
                    </Colxx>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Colxx md="4" lg="2">
                      <Label>No. {entryForm.type}</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <Input
                        placeholder={`Masukkan no. ${entryForm.type}`}
                        required
                        onChange={(e) =>
                          setEntryForm({
                            ...entryForm,
                            no: e.target.value,
                          })
                        }
                        value={entryForm.no}
                      />
                    </Colxx>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Colxx md="4" lg="2">
                      <Label>Nilai {entryForm.type}</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <CurrencyFormat
                        className="form-control"
                        prefix="Rp"
                        thousandSeparator={true}
                        placeholder={`Masukkan nilai ${entryForm.type}`}
                        required={true}
                        onValueChange={(val) =>
                          setEntryForm({
                            ...entryForm,
                            value: val.floatValue ? val.floatValue : 0,
                          })
                        }
                        value={entryForm.value}
                      />
                    </Colxx>
                  </Row>
                  <Row className="align-items-center mb-2 my-3">
                    <Colxx md="4" lg="2">
                      <Label>Dokumen pendukung</Label>
                    </Colxx>
                    <Colxx md="8" lg="6">
                      <Button
                        color="primary btn-shadow"
                        onClick={() => {
                          if (entryForm.no === "" && entryForm.value === 0) {
                            NotificationManager.warning("Mohon isi kelengkapan isian terlebih dahulu sebelum mengupload berkas!", "Peringatan", 3000, null, null, "");
                          } else {
                            setShowUpload({
                              show: true,
                              id: entryForm.no.split("/").join("-"),
                            })
                          }
                        }}
                      >
                        Unggah
                      </Button>
                    </Colxx>
                    <Colxx xxs="12">
                      <div className="float-right">
                        <Button
                          type="button"
                          onClick={() => setEntryForm({
                            show: false,
                            type: "",
                            date: "",
                            no: "",
                            value: ""
                          })}
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
      <UploadModal
        isOpen={showUpload.show}
        toggle={() => setShowUpload(!showUpload.show)}
        label={`Bukti transaksi ${entryForm.type}`}
        subLabel={`Silahkan unggah transaksi ${entryForm.type}`}
        fileTypes={["JPG", "PNG", "PDF"]}
        type="income"
        onClose={() => setShowUpload(false)}
        itemId={item.income_id}
        subItemId={showUpload.id}
      />
    </>
  );
};

const mapStateToProps = ({ pendapatan }) => {
  const { pendapatanItems, loading, error } = pendapatan;
  return { pendapatanItems, loading, error };
}
export default injectIntl(
  connect(mapStateToProps, {
    editPendapatanItemAction: editPendapatanItem,
  })(PendapatanListItem)
);
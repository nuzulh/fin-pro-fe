import { Colxx } from "components/common/CustomBootstrap";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import {
  Badge,
  Row,
  Card,
  CardBody,
  Label,
  Form,
  FormGroup,
  Button,
  Table,
} from "reactstrap";
import { getPersekotList, reportPersekotItem, approveItem, rejectItem } from "redux/actions";
import { getCurrentUser, getDateWithFormat } from "helpers/Utils";
import CurrencyFormat from "react-currency-format";
import { NotificationManager } from "components/common/react-notifications";
import { useHistory } from "react-router-dom";
import { statusColor, UserRole } from "constants/defaultValues";
import ActionModal from "widgets/dashboard/ActionModal";
import UploadModal from "widgets/common/UploadModal";

const PersekotDetailItem = ({
  getPersekotListAction,
  reportPersekotItemAction,
  loading,
  persekotItems,
  error,
  approveItemAction,
  rejectItemAction,
  pendingItem,
  actionLoading,
  actionError,
  state,
}) => {
  const user = getCurrentUser();
  const history = useHistory();
  const [showDetail, setShowDetail] = useState(true);
  const [actionType, setActionType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState(null);
  const [showUpload, setShowUpload] = useState({
    show: false,
    id: null,
  });
  const [total, setTotal] = useState({
    proposed: 0,
    realization: 0,
    balance: 0,
  });

  const setReportedData = (persekot_detail_realization, detail) => {
    const newDetails = details.map((x) => {
      if (x.persekot_detail_id === detail.persekot_detail_id) {
        return {
          ...x,
          persekot_detail_realization,
        };
      } else {
        return x;
      }
    })
    setDetails(newDetails);
  };

  useEffect(() => {
    getPersekotListAction(state.persekot_id, state.status);
  }, []);

  useEffect(() => {
    if (pendingItem) {
      NotificationManager.success(`Berhasil ${actionType} Persekot ${pendingItem.persekot_no}`, "Berhasil", 3000, null, null, "");
      setShowModal(false);
      history.goBack();
    }
  }, [pendingItem]);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
    if (actionError !== "") {
      NotificationManager.error(actionError, "Gagal", 3000, null, null, "");
    }
  }, [error, actionError]);

  useEffect(() => {
    if (persekotItems) {
      setDetails(persekotItems[0].persekot_detail);
    }
  }, [persekotItems]);

  useEffect(() => {
    if (details) {
      let proposed = 0;
      let realization = 0;
      let balance = 0;

      details.forEach((i) => {
        proposed = proposed + i.persekot_detail_value;
        realization = realization + i.persekot_detail_realization;
        balance = balance + (i.persekot_detail_value - i.persekot_detail_realization);
      });

      setTotal({ proposed, realization, balance });
    }
  }, [details]);

  return loading && persekotItems && details && persekotItems[0].rab ? (
    <>
      <Colxx xxs="12">
        <Row className="mx-1 mb-3 justify-content-between">
          <h6>No. {persekotItems[0].persekot_no}</h6>
          <div className="d-flex align-items-center">
            <h6 className="mr-3">
              Tanggal diajukan: {getDateWithFormat(persekotItems[0].created_date)}
            </h6>
            <h6>
              Status:{" "}
              <Badge
                pill
                color={statusColor[persekotItems[0].status]}
              >
                {persekotItems[0].status}
              </Badge>
            </h6>
          </div>
        </Row>
        <Form onSubmit={(e) => e.preventDefault()}>
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
                    <Label>Judul Persekot</Label>
                    <p className="pl-3">{persekotItems[0].persekot_name}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label>No. RAB</Label>
                    <p className="pl-3">{persekotItems[0].rab.rab_no}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Judul RAB</Label>
                    <p className="pl-3">{persekotItems[0].rab.rab_name}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Nilai RAB</Label>
                    <p className="pl-3">
                      <CurrencyFormat
                        className="font-weight-bold"
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType={"text"}
                        value={persekotItems[0].rab.rab_value}
                      />
                    </p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Nilai Persekot</Label>
                    <p className="pl-3">
                      <CurrencyFormat
                        className="font-weight-bold"
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType={"text"}
                        value={persekotItems[0].persekot_value}
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
                Rincian Persekot
              </h5>
              <Table className="w-100">
                <thead>
                  <tr>
                    <th width="5%">#</th>
                    <th width="20%">Paket pengadaan/Uraian</th>
                    <th width="10%">Jumlah Harga</th>
                    <th width="15%">Keterangan</th>
                    {["REPORTED", "APPROVED"].includes(persekotItems[0].status) && (
                      <>
                        <th width="20%">Realisasi</th>
                        <th width="20%">Selisih</th>
                        <th width="5%"></th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {persekotItems[0].persekot_detail && persekotItems[0].persekot_detail.map((detail, index) => (
                    <tr
                      key={index}
                      style={{
                        background: (index + 1) % 2 === 0 ? "#FFF3E7" : "",
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{detail.description}</td>
                      <td>
                        <CurrencyFormat
                          prefix="Rp"
                          thousandSeparator={true}
                          displayType="text"
                          value={detail.persekot_detail_value}
                        />
                      </td>
                      <td>{detail.category.category_name}</td>
                      {["REPORTED", "APPROVED"].includes(persekotItems[0].status) && details.length > 0 && (
                        <>
                          <td>
                            <CurrencyFormat
                              readOnly={persekotItems[0].status === "REPORTED"}
                              required={true}
                              thousandSeparator={true}
                              prefix={"Rp"}
                              className="form-control rounded-lg"
                              value={details.find((x) => x.persekot_detail_id === detail.persekot_detail_id).persekot_detail_realization}
                              onValueChange={(e) => {
                                const { value } = e;
                                const realization = parseInt(value)
                                  ? parseInt(value)
                                  : 0;
                                setReportedData(realization, detail);
                              }}
                            />
                          </td>
                          <td>
                            <CurrencyFormat
                              readOnly={true}
                              required={true}
                              thousandSeparator={true}
                              prefix={"Rp"}
                              className="form-control rounded-lg"
                              value={details.find((x) => x.persekot_detail_id === detail.persekot_detail_id).persekot_detail_value -
                                details.find((x) => x.persekot_detail_id === detail.persekot_detail_id).persekot_detail_realization}
                            />
                          </td>
                          <td>
                            <i
                              className={`${false
                                ? "simple-icon-folder"
                                : "iconsminds-upload-1"
                                } c-pointer font-weight-bold`}
                              style={{
                                fontWeight: "bold",
                                fontSize: "1.1rem",
                              }}
                              onClick={() => setShowUpload({
                                show: true,
                                id: detail.persekot_detail_id,
                              })}
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
              {["REPORTED", "APPROVED"].includes(persekotItems[0].status) ? (
                <>
                  <FormGroup>
                    <Label>Total biaya yang diajukan</Label>
                    <p className="pl-3">
                      <CurrencyFormat
                        className="font-weight-bold"
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType="text"
                        value={total.proposed}
                      />
                    </p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Total realisasi</Label>
                    <p className="pl-3">
                      <CurrencyFormat
                        className="font-weight-bold"
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType="text"
                        value={total.realization}
                      />
                    </p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Total selisih</Label>
                    <p className="pl-3">
                      <CurrencyFormat
                        className="font-weight-bold"
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType="text"
                        value={total.balance}
                      />
                    </p>
                  </FormGroup>
                </>
              ) : (
                <>
                  <Row>
                    <Colxx xxs="6">
                      <FormGroup>
                        <Label>PPN</Label>
                        <p className="pl-3">
                          <CurrencyFormat
                            className="font-weight-bold"
                            prefix="Rp"
                            thousandSeparator={true}
                            displayType={"text"}
                            value={persekotItems[0].ppn}
                          />
                        </p>
                      </FormGroup>
                    </Colxx>
                    <Colxx xxs="6">
                      <FormGroup>
                        <Label>PPH</Label>
                        <p className="pl-3">
                          <CurrencyFormat
                            className="font-weight-bold"
                            prefix="Rp"
                            thousandSeparator={true}
                            displayType={"text"}
                            value={persekotItems[0].pph}
                          />
                        </p>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <FormGroup>
                    <Label className="font-weight-bold">Total</Label>
                    <p className="pl-3">
                      <CurrencyFormat
                        className="font-weight-bold"
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType={"text"}
                        value={persekotItems[0].persekot_value}
                      />
                    </p>
                  </FormGroup>
                </>
              )}
              <Row>
                <Colxx xxs="6">
                  <FormGroup>
                    <Label>Dibuat oleh</Label>
                    <p className="pl-3">{persekotItems[0].created_by}</p>
                  </FormGroup>
                </Colxx>
                <Colxx xxs="6">
                  <FormGroup>
                    <Label>Departemen</Label>
                    <p className="pl-3">{persekotItems[0].department_name}</p>
                  </FormGroup>
                </Colxx>
              </Row>
              <FormGroup>
                <Label>Diajukan oleh</Label>
                <p className="pl-3">{persekotItems[0].created_by}</p>
              </FormGroup>
            </CardBody>
          </Card>
          {user.role === UserRole.STAFF && persekotItems[0].status === "APPROVED" ? (
            loading ? (
              <Button
                onClick={() => reportPersekotItemAction({
                  persekot_id: persekotItems[0].persekot_id,
                  persekot_realization: total.realization,
                  persekot_detail: details,
                }, history)}
                size="lg"
                color="primary w-100 btn-shadow"
              >
                Simpan
              </Button>
            ) : (
              <div className="loading position-relative" />
            )
          ) : (
            user.role === UserRole.DIREKTUR && persekotItems[0].status === "PROPOSED" ? (
              <div className="w-100 d-flex justify-content-end">
                <Button
                  onClick={() => {
                    setActionType("reject");
                    setShowModal(true);
                  }}
                  outline
                  size="lg"
                  color="primary btn-shadow mr-3"
                >
                  Tolak
                </Button>
                <Button
                  onClick={() => {
                    setActionType("approve");
                    setShowModal(true);
                  }}
                  size="lg"
                  color="primary btn-shadow"
                >
                  Setujui
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => history.goBack()}
                size="lg"
                color="primary w-100 btn-shadow"
              >
                Kembali ke halaman sebelumnya
              </Button>
            )
          )}
        </Form>
      </Colxx>
      <ActionModal
        isOpen={showModal}
        actionType={actionType}
        itemType="persekot"
        items={persekotItems}
        onAction={(items) => {
          items.map((x) => {
            if (actionType === "approve") {
              approveItemAction("persekot", "persekot_id", x.persekot_id);
            } else {
              rejectItemAction("persekot", "persekot_id", x.persekot_id, x.rejected_reason);
            }
          })
        }}
        onClose={() => setShowModal(false)}
        loading={actionLoading}
      />
      <UploadModal
        isOpen={showUpload.show}
        toggle={() => setShowUpload(!showUpload.show)}
        label="Bukti transaksi persekot"
        subLabel="Silahkan unggah transaksi persekot"
        fileTypes={["JPG", "PNG", "PDF"]}
        type="persekot"
        onClose={() => setShowUpload(false)}
        itemId={persekotItems[0].persekot_id}
        subItemId={showUpload.id}
      />
    </>
  ) : (
    <div className="loading" />
  );
};

const mapStateToProps = ({ persekot, dashboard }) => {
  return {
    persekotItems: persekot.persekotItems,
    loading: persekot.loading,
    error: persekot.error,
    pendingItem: dashboard.pendingItem,
    actionLoading: dashboard.loading,
    actionError: dashboard.error,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    getPersekotListAction: getPersekotList,
    reportPersekotItemAction: reportPersekotItem,
    approveItemAction: approveItem,
    rejectItemAction: rejectItem,
  })(PersekotDetailItem)
);
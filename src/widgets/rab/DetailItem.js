import { Colxx, Separator } from "components/common/CustomBootstrap";
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
import { getRabList, approveItem, rejectItem } from "redux/actions";
import { getCurrentUser, getDateWithFormat } from "helpers/Utils";
import CurrencyFormat from "react-currency-format";
import { useHistory } from "react-router-dom";
import { statusColor, UserRole } from "constants/defaultValues";
import ActionModal from "widgets/dashboard/ActionModal";
import { NotificationManager } from "components/common/react-notifications";

const RabListView = ({
  getRabListAction,
  rabItems,
  loading,
  error,
  approveItemAction,
  rejectItemAction,
  pendingItem,
  actionLoading,
  actionError,
  state,
}) => {
  const history = useHistory();
  const user = getCurrentUser();
  const [showDetail, setShowDetail] = useState(true);
  const [actionType, setActionType] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getRabListAction(state.rab_id);
  }, []);

  useEffect(() => {
    if (pendingItem) {
      NotificationManager.success(`Berhasil ${actionType} RAB ${pendingItem.rab_no}`, "Berhasil", 3000, null, null, "");
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

  return loading && rabItems && rabItems[0].rka ? (
    <>
      <Colxx xxs="12">
        <Row className="mx-1 mb-3 justify-content-between">
          <h6>No. {rabItems[0].rab_no}</h6>
          <div className="d-flex align-rabItemss-center">
            <h6 className="mr-3">
              Tanggal diajukan: {getDateWithFormat(rabItems[0].created_date)}
            </h6>
            <h6>
              Status:{" "}
              <Badge
                pill
                color={statusColor[rabItems[0].status]}
              >
                {rabItems[0].status}
              </Badge>
            </h6>
          </div>
        </Row>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Card className="mb-4">
            <CardBody>
              <div
                className="w-100 d-flex align-rabItemss-center justify-content-between"
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
                    <p className="pl-3">{rabItems[0].rab_name}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Kode Aktivitas</Label>
                    <p className="pl-3">{rabItems[0].rka.activity_code}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Estimasi Pendapatan</Label>
                    <p className="pl-3">
                      <CurrencyFormat
                        className="font-weight-bold"
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType={"text"}
                        value={rabItems[0].rka.rka_value}
                      />
                    </p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Rencana pengadaan yang diusulkan</Label>
                    <p className="pl-3">
                      <CurrencyFormat
                        className="font-weight-bold"
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType={"text"}
                        value={rabItems[0].rab_value}
                      />
                    </p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Sisa anggaran</Label>
                    <p className="pl-3">
                      <CurrencyFormat
                        className="font-weight-bold"
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType={"text"}
                        value={rabItems[0].rka.rka_value - rabItems[0].rab_value}
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
                Rincian RAB
              </h5>
              <Table className="w-100">
                <thead>
                  <tr>
                    <th width="5%">#</th>
                    <th width="40%">Paket pengadaan/Uraian</th>
                    <th width="30%">Jumlah Harga</th>
                    <th width="25%">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {rabItems[0].rab_detail && rabItems[0].rab_detail.map((detail, index) => (
                    <tr
                      key={index}
                      style={{
                        background: (index + 1) % 2 === 0 ? "#FFF3E7" : "",
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{detail.name}</td>
                      <td>
                        <CurrencyFormat
                          prefix="Rp"
                          thousandSeparator={true}
                          displayType="text"
                          value={detail.value}
                        />
                      </td>
                      <td>{detail.type}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <FormGroup>
                <Label>Subtotal</Label>
                <p className="pl-3">
                  <CurrencyFormat
                    className="font-weight-bold"
                    prefix="Rp"
                    thousandSeparator={true}
                    displayType={"text"}
                    value={rabItems[0].total_detail_value}
                  />
                </p>
              </FormGroup>
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
                        value={rabItems[0].ppn}
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
                        value={rabItems[0].pph}
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
                    value={rabItems[0].rab_value}
                  />
                </p>
              </FormGroup>
              <Row>
                <Colxx xxs="6">
                  <FormGroup>
                    <Label>Dibuat oleh</Label>
                    <p className="pl-3">{rabItems[0].created_by}</p>
                  </FormGroup>
                </Colxx>
                <Colxx xxs="6">
                  <FormGroup>
                    <Label>Departemen</Label>
                    <p className="pl-3">{rabItems[0].department_name}</p>
                  </FormGroup>
                </Colxx>
              </Row>
              <FormGroup>
                <Label>Diajukan oleh</Label>
                <p className="pl-3">{rabItems[0].created_by}</p>
              </FormGroup>
            </CardBody>
          </Card>
          {user.role === UserRole.DIREKTUR && rabItems[0].status === "PROPOSED" ? (
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
          )}
        </Form>
      </Colxx>
      <ActionModal
        isOpen={showModal}
        actionType={actionType}
        itemType="rab"
        items={rabItems}
        onAction={(items) => {
          items.map((x) => {
            if (actionType === "approve") {
              approveItemAction("rab", "rab_id", x.rab_id);
            } else {
              rejectItemAction("rab", "rab_id", x.rab_id, x.rejected_reason);
            }
          })
        }}
        onClose={() => setShowModal(false)}
        loading={actionLoading}
      />
    </>
  ) : (
    <div className="loading" />
  );
};

const mapStateToProps = ({ rab, dashboard }) => {
  return {
    rabItems: rab.rabItems,
    loading: rab.loading,
    error: rab.error,
    pendingItem: dashboard.pendingItem,
    actionLoading: dashboard.loading,
    actionError: dashboard.error,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    getRabListAction: getRabList,
    approveItemAction: approveItem,
    rejectItemAction: rejectItem,
  })(RabListView)
);
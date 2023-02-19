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
import { getRpbList, approveItem, rejectItem } from "redux/actions";
import { getCurrentUser, getDateWithFormat } from "helpers/Utils";
import CurrencyFormat from "react-currency-format";
import { useHistory } from "react-router-dom";
import { statusColor, UserRole } from "constants/defaultValues";
import ActionModal from "widgets/dashboard/ActionModal";
import { NotificationManager } from "components/common/react-notifications";

const RpbListView = ({
  getRpbListAction,
  rpbItems,
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
    getRpbListAction(state.pkm_id, state.status);
  }, []);

  useEffect(() => {
    if (pendingItem) {
      NotificationManager.success(`Berhasil ${actionType} RPB ${pendingItem.pkm_no}`, "Berhasil", 3000, null, null, "");
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

  return loading && rpbItems && rpbItems[0].pkm_draft && rpbItems[0].pkm_draft.rab ? (
    <>
      <Colxx xxs="12">
        <Row className="mx-1 mb-3 justify-content-between">
          <h6>No. {rpbItems[0].pkm_no}</h6>
          <div className="d-flex align-rpbItemss-center">
            <h6 className="mr-3">
              Tanggal diajukan: {getDateWithFormat(rpbItems[0].created_date)}
            </h6>
            <h6>
              Status:{" "}
              <Badge
                pill
                color={statusColor[rpbItems[0].status]}
              >
                {rpbItems[0].status}
              </Badge>
            </h6>
          </div>
        </Row>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Card className="mb-4">
            <CardBody>
              <div
                className="w-100 d-flex align-rpbItemss-center justify-content-between"
                style={{ cursor: "pointer" }}
                onClick={() => setShowDetail(!showDetail)}
              >
                <h5 className="font-weight-bold">Detail</h5>
                <i className="simple-icon-arrow-down font-weight-bold" />
              </div>
              {showDetail && (
                <>
                  <FormGroup className="mt-3">
                    <Label>Judul RPB</Label>
                    <p className="pl-3">{rpbItems[0].pkm_name}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label>No. RAB</Label>
                    <p className="pl-3">{rpbItems[0].pkm_draft.rab.rab_no}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Judul RAB</Label>
                    <p className="pl-3">{rpbItems[0].pkm_draft.rab.rab_name}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Nilai RAB</Label>
                    <p className="pl-3">
                      <CurrencyFormat
                        className="font-weight-bold"
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType={"text"}
                        value={rpbItems[0].pkm_draft.rab.rab_value}
                      />
                    </p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Nilai RPB</Label>
                    <p className="pl-3">
                      <CurrencyFormat
                        className="font-weight-bold"
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType={"text"}
                        value={rpbItems[0].pkm_value}
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
                Rincian Pengadaan Barang/Jasa
              </h5>
              <Table className="w-100">
                <thead>
                  <tr>
                    <th width="5%">#</th>
                    <th width="25%">Paket pengadaan/Uraian</th>
                    <th width="10%">Qty</th>
                    <th width="15%">Satuan</th>
                    <th width="20%">Harga Satuan</th>
                    <th width="20%">Jumlah Harga</th>
                    <th width="5%"></th>
                  </tr>
                </thead>
                <tbody>
                  {rpbItems[0].pkm_detail.map((detail, index) => (
                    <tr
                      key={index}
                      style={{
                        background: (index + 1) % 2 === 0 ? "#FFF3E7" : "",
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{detail.description}</td>
                      <td>{detail.pkm_quantity}</td>
                      <td>{detail.category.category_name}</td>
                      <td>
                        <CurrencyFormat
                          prefix="Rp"
                          thousandSeparator={true}
                          displayType="text"
                          value={detail.pkm_detail_price / detail.pkm_quantity}
                        />
                      </td>
                      <td>
                        <CurrencyFormat
                          prefix="Rp"
                          thousandSeparator={true}
                          displayType="text"
                          value={detail.pkm_detail_price}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <FormGroup>
                <Label>PPN</Label>
                <p className="pl-3">
                  <CurrencyFormat
                    className="font-weight-bold"
                    prefix="Rp"
                    thousandSeparator={true}
                    displayType={"text"}
                    value={rpbItems[0].pkm_draft.ppn}
                  />
                </p>
              </FormGroup>
              <FormGroup>
                <Label className="font-weight-bold">Total</Label>
                <p className="pl-3">
                  <CurrencyFormat
                    className="font-weight-bold"
                    prefix="Rp"
                    thousandSeparator={true}
                    displayType={"text"}
                    value={rpbItems[0].pkm_value}
                  />
                </p>
              </FormGroup>
              <Row>
                <Colxx xxs="6">
                  <FormGroup>
                    <Label>Dibuat oleh</Label>
                    <p className="pl-3">{rpbItems[0].created_by}</p>
                  </FormGroup>
                </Colxx>
                <Colxx xxs="6">
                  <FormGroup>
                    <Label>Departemen</Label>
                    <p className="pl-3">{rpbItems[0].department_name}</p>
                  </FormGroup>
                </Colxx>
              </Row>
              <FormGroup>
                <Label>Diajukan oleh</Label>
                <p className="pl-3">{rpbItems[0].created_by}</p>
              </FormGroup>
            </CardBody>
          </Card>
          {user.role === UserRole.DIREKTUR && rpbItems[0].status === "PROPOSED" ? (
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
        itemType="pkm"
        items={rpbItems}
        onAction={(items) => {
          items.map((x) => {
            if (actionType === "approve") {
              approveItemAction("pkm", "pkm_id", x.pkm_id);
            } else {
              rejectItemAction("pkm", "pkm_id", x.pkm_id, x.rejected_reason);
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

const mapStateToProps = ({ rpb, dashboard }) => {
  return {
    rpbItems: rpb.rpbItems,
    loading: rpb.loading,
    error: rpb.error,
    pendingItem: dashboard.pendingItem,
    actionLoading: dashboard.loading,
    actionError: dashboard.error,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    getRpbListAction: getRpbList,
    approveItemAction: approveItem,
    rejectItemAction: rejectItem,
  })(RpbListView)
);
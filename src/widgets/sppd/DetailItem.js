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
import { getSppdList } from "redux/actions";
import { getDateWithFormat } from "helpers/Utils";
import CurrencyFormat from "react-currency-format";
import { NotificationManager } from "components/common/react-notifications";
import { useHistory } from "react-router-dom";
import { statusColor } from "constants/defaultValues";
import UploadModal from "widgets/common/UploadModal";

const SppdDetailItem = ({
  getSppdListAction,
  sppdItems,
  loading,
  error,
  state,
}) => {
  const history = useHistory();
  const [showDetail, setShowDetail] = useState(true);
  const [showUpload, setShowUpload] = useState({
    show: false,
    id: "",
  });

  useEffect(() => {
    if (state.sppd_id) {
      getSppdListAction(state.sppd_id);
    }
  }, []);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
  }, [error]);

  return loading && sppdItems && sppdItems[0].rab ? (
    <>
      <Colxx xxs="12">
        <Row className="mx-1 mb-3 justify-content-between">
          <h6>No. {sppdItems[0].sppd_no}</h6>
          <div className="d-flex align-items-center">
            <h6 className="mr-3">
              Tanggal dibuat: {getDateWithFormat(sppdItems[0].created_date)}
            </h6>
            <h6>
              Status:{" "}
              <Badge
                pill
                color={statusColor[sppdItems[0].status]}
              >
                {sppdItems[0].status}
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
                    <Label>Judul Sppd</Label>
                    <p className="pl-3">{sppdItems[0].sppd_name}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label>No. RAB</Label>
                    <p className="pl-3">{sppdItems[0].rab.rab_no}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Judul RAB</Label>
                    <p className="pl-3">{sppdItems[0].rab.rab_name}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Nilai RAB</Label>
                    <p className="pl-3">
                      <CurrencyFormat
                        className="font-weight-bold"
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType={"text"}
                        value={sppdItems[0].rab.rab_value}
                      />
                    </p>
                  </FormGroup>
                  <FormGroup>
                    <Label>Nilai Sppd</Label>
                    <p className="pl-3">
                      <CurrencyFormat
                        className="font-weight-bold"
                        prefix="Rp"
                        thousandSeparator={true}
                        displayType={"text"}
                        value={sppdItems[0].sppd_value}
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
                Rincian SPPD
              </h5>
              <Table className="w-100">
                <thead>
                  <tr>
                    <th width="5%">#</th>
                    <th width="25%">Unit</th>
                    <th width="15%">Tgl. Berangkat</th>
                    <th width="15%">Tgl. Pulang</th>
                    <th width="18%">Nilai</th>
                    <th width="18%">Dept./PIC</th>
                    <th width="4%"></th>
                  </tr>
                </thead>
                <tbody>
                  {sppdItems[0].sppd_detail.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{row.unit}</td>
                      <td>{getDateWithFormat(row.departure_date)}</td>
                      <td>{getDateWithFormat(row.return_date)}</td>
                      <td>
                        <CurrencyFormat
                          thousandSeparator={true}
                          displayType="text"
                          prefix={"Rp"}
                          value={row.sppd_detail_value}
                        />
                      </td>
                      <td>{row.department}</td>
                      <td>
                        {loading ? (
                          <i
                            className={`${false
                              ? "simple-icon-folder"
                              : "iconsminds-upload-1"
                              } c-pointer font-weight-bold mr-3`}
                            style={{
                              fontSize: "1.1rem",
                            }}
                            onClick={() => setShowUpload({
                              show: true,
                              id: row.sppd_detail_id,
                            })}
                          />
                        ) : (
                          <div className="loading position-relative" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <FormGroup>
                <Label className="font-weight-bold">Total nilai rincian</Label>
                <p className="pl-3">
                  <CurrencyFormat
                    className="font-weight-bold"
                    prefix="Rp"
                    thousandSeparator={true}
                    displayType={"text"}
                    value={sppdItems[0].sppd_detail.map((x) => x.sppd_detail_value).reduce((a, b) => a + b)}
                  />
                </p>
              </FormGroup>
              <Row>
                <Colxx xxs="6">
                  <FormGroup>
                    <Label>Dibuat oleh</Label>
                    <p className="pl-3">{sppdItems[0].created_by}</p>
                  </FormGroup>
                </Colxx>
                <Colxx xxs="6">
                  <FormGroup>
                    <Label>Departemen</Label>
                    <p className="pl-3">{sppdItems[0].department_name}</p>
                  </FormGroup>
                </Colxx>
              </Row>
              <FormGroup>
                <Label>Diajukan oleh</Label>
                <p className="pl-3">{sppdItems[0].created_by}</p>
              </FormGroup>
            </CardBody>
          </Card>
          <Button
            onClick={() => history.goBack()}
            size="lg"
            color="primary w-100 btn-shadow"
          >
            Kembali ke halaman sebelumnya
          </Button>
        </Form>
      </Colxx>
      {sppdItems && (
        <UploadModal
          isOpen={showUpload.show}
          toggle={() => setShowUpload(!showUpload.show)}
          label="Bukti transaksi SPPD"
          subLabel="Silahkan unggah transaksi SPPD"
          fileTypes={["JPG", "PNG", "PDF"]}
          type="sppd"
          onClose={() => setShowUpload(false)}
          itemId={sppdItems[0].sppd_id}
          subItemId={showUpload.id}
        />
      )}
    </>
  ) : (
    <div className="loading" />
  );
};

const mapStateToProps = ({ sppd }) => {
  const { sppdItems, loading, error } = sppd;
  return { sppdItems, loading, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    getSppdListAction: getSppdList,
  })(SppdDetailItem)
);
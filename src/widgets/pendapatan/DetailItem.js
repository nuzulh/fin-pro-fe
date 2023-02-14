import PendapatanHistoryListItem from "./HistoryListItem";
import { Colxx } from "components/common/CustomBootstrap";
import { incomeColor } from "constants/defaultValues";
import { countTax, getDateWithFormat } from "helpers/Utils";
import React, { useEffect } from "react";
import CurrencyFormat from "react-currency-format";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Badge, Card, CardBody, FormGroup, Label, Row } from "reactstrap";
import { getPendapatanList } from "redux/actions";

const PendapatanDetailItem = ({
  getPendapatanListAction,
  pendapatanItems,
  loading,
  error,
  state,
}) => {
  useEffect(() => {
    getPendapatanListAction(state.income_id);
  }, []);

  return (
    loading && pendapatanItems && pendapatanItems[0] ? (
      <Colxx xss="12">
        <Row className="mx-1 mb-3 justify-content-between">
          <h6>No. {pendapatanItems[0].income_no}</h6>
          <div className="d-flex align-pendapatanItems[0]s-start">
            <h6>
              Status terkini:{" "}
              <Badge pill color={incomeColor[pendapatanItems[0].status]}>
                {pendapatanItems[0].status}
              </Badge>
            </h6>
          </div>
        </Row>
        <Row>
          <Colxx xxs="6 mb-4">
            <Card className="h-100">
              <CardBody>
                <p className="h6 font-weight-bold mb-4">Mengenai project ini</p>
                <FormGroup>
                  <Label>Judul pekerjaan</Label>
                  <p className="px-3">{pendapatanItems[0].income_name}</p>
                </FormGroup>
                <FormGroup>
                  <Label>Tanggal RAB</Label>
                  <p className="px-3">
                    {getDateWithFormat(pendapatanItems[0].rab.created_date)}
                  </p>
                </FormGroup>
                <FormGroup>
                  <Label>No. RAB</Label>
                  <p className="px-3">{pendapatanItems[0].rab.rab_no}</p>
                </FormGroup>
                <FormGroup>
                  <Label>Kode Aktivitas</Label>
                  <p className="px-3">
                    {pendapatanItems[0].rab.rka && pendapatanItems[0].rab.rka.activity_code}
                  </p>
                </FormGroup>
                <FormGroup>
                  <Label>No. Referensi</Label>
                  <p className="px-3">{pendapatanItems[0].reference_no}</p>
                </FormGroup>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xxs="6 mb-4">
            <Card className="h-100">
              <CardBody>
                <p className="h6 font-weight-bold mb-4">Pendapatan</p>
                <FormGroup>
                  <Label>Nilai RAB</Label>
                  <p className="px-3">
                    IDR
                    <CurrencyFormat
                      className="font-weight-bold px-3"
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={pendapatanItems[0].rab.rab_value}
                    />
                  </p>
                </FormGroup>
                <FormGroup>
                  <Label>Nilai Penawaran (Incl. PPN)</Label>
                  <p className="px-3">
                    IDR
                    <CurrencyFormat
                      className="font-weight-bold px-3"
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={pendapatanItems[0].offer_value + pendapatanItems[0].ppn}
                    />
                  </p>
                </FormGroup>
                <FormGroup>
                  <Label>Nilai Penawaran (Excl. PPN)</Label>
                  <p className="px-3">
                    IDR
                    <CurrencyFormat
                      className="font-weight-bold px-3"
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={pendapatanItems[0].offer_value}
                    />
                  </p>
                </FormGroup>
                <FormGroup>
                  <Label>No. Kontrak</Label>
                  <p className="px-3">
                    {pendapatanItems[0].contract_no ? pendapatanItems[0].contract_no : "-"}
                  </p>
                </FormGroup>
                <FormGroup>
                  <Label>Nilai Kontrak</Label>
                  <p className="px-3">
                    IDR
                    <CurrencyFormat
                      className="font-weight-bold px-3"
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={pendapatanItems[0].contract_value ? pendapatanItems[0].contract_value : "-"}
                    />
                  </p>
                </FormGroup>
                <FormGroup>
                  <Label>Nilai DPP Kontrak</Label>
                  <p className="px-3">
                    IDR
                    <CurrencyFormat
                      className="font-weight-bold px-3"
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={pendapatanItems[0].dpp_value ? pendapatanItems[0].dpp_value : "-"}
                    />
                  </p>
                </FormGroup>
                <FormGroup>
                  <Label>Nilai BA</Label>
                  <p className="px-3">
                    IDR
                    <CurrencyFormat
                      className="font-weight-bold px-3"
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={pendapatanItems[0].ba_value ? pendapatanItems[0].ba_value : "-"}
                    />
                  </p>
                </FormGroup>
                <FormGroup>
                  <Label>Nilai Invoice</Label>
                  <p className="px-3">
                    IDR
                    <CurrencyFormat
                      className="font-weight-bold px-3"
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={pendapatanItems[0].invoice_value ? pendapatanItems[0].invoice_value : "-"}
                    />
                  </p>
                </FormGroup>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xxs="12 p-0">
            <p className="px-4 h6 font-weight-bold mb-3">Riwayat project</p>
            <div className="d-none d-md-flex mb-2 mx-3">
              <div className="d-flex flex-grow-1 mx-4 min-width-zero">
                <div className="align-self-center w-100 d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                  <p className="mb-1 text-small text-muted w-30 w-xs-100">
                    Waktu update
                  </p>
                  <p className="mb-1 text-small text-muted w-50 w-xs-100">
                    Uraian update
                  </p>
                  <p className="mb-1 text-small text-muted w-20 w-xs-100">
                    Status setelah update
                  </p>
                  <p className="mb-1 text-small text-muted w-10 w-xs-100">
                    Dokumen pendukung
                  </p>
                </div>
              </div>
            </div>
            {pendapatanItems[0].income_history &&
              pendapatanItems[0].income_history
                .map((item, index) => (
                  <PendapatanHistoryListItem key={index} item={item} />
                ))}
          </Colxx>
        </Row>
      </Colxx>
    ) : (
      <div className="loading" />
    )
  );
};

const mapStateToProps = ({ pendapatan }) => {
  const { pendapatanItems, loading, error } = pendapatan;
  return { pendapatanItems, loading, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    getPendapatanListAction: getPendapatanList,
  })(PendapatanDetailItem)
);
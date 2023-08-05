import React, { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Button, Card, CardBody, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { getRabList } from "redux/actions";
import ItemNoForm from "widgets/common/ItemNoForm";
import Select from "react-select";
import CustomSelectInput from "components/common/CustomSelectInput";
import CurrencyFormat from "react-currency-format";
import { Colxx } from "components/common/CustomBootstrap";
import { countTax, getDateWithFormat } from "helpers/Utils";
import { NotificationManager } from "components/common/react-notifications";

const PendapatanForm = ({
  loading,
  getRabListAction,
  rabItems,
  rabLoading,
  rabError,
  onSubmit,
}) => {
  const [data, setData] = useState({
    income_no: "",
    income_name: "",
    reference_no: "",
    offer_value: 0,
    ppn: 0,
    rab_id: "",
    activity_code: "",
  });
  const [rabOptions, setRabOptions] = useState([]);
  const [selectedRab, setSelectedRab] = useState(null);
  const [ppnPercentage, setPpnPercentage] = useState(11);
  const [offerTotal, setOfferTotal] = useState(0);

  const selectRab = (e) => {
    const selected = rabItems
      .filter((x) => x.rab_id === e.value)
      .map((x) => ({
        ...x,
        key: x.rab_id,
        label: `${x.rab_no} - ${x.rab_name}`,
        value: x.rab_id,
      }))[0];
    setSelectedRab(selected);
    setData({ ...data, rab_id: selected.rab_id, activity_code: selected.rka.activity_code });
  };

  useEffect(() => {
    getRabListAction();
  }, []);

  useEffect(() => {
    if (rabItems) {
      const options = rabItems
        .filter((x) => x.status === "APPROVED")
        .map((item) => ({
          key: item.rab_id,
          label: `${item.rab_no} - ${item.rab_name}`,
          value: item.rab_id,
        }));
      setRabOptions(options);
    }
  }, [rabItems]);

  useEffect(() => {
    if (rabError !== "") {
      NotificationManager.error(rabError, "Gagal", 3000, null, null, "");
    }
  }, [rabError]);

  useEffect(() => {
    const ppn = countTax(ppnPercentage, data.offer_value);
    if (selectedRab && ppn + data.offer_value > selectedRab.rab_value) {
      NotificationManager.warning("Nilai penawaran melebihi nilai RAB!", "Peringatan", 3000, null, null, "");
    } else {
      setData({ ...data, ppn });
      setOfferTotal(ppn + data.offer_value);
    }
  }, [data.offer_value, ppnPercentage]);

  return (
    <Form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(data);
    }}>
      <ItemNoForm type="Project" onChange={(val) => setData({ ...data, income_no: val })} />
      <Card className="mb-4">
        <CardBody>
          <h5 className="mb-4 font-weight-bold">Detail</h5>
          <FormGroup>
            <Label>Judul Pekerjaan</Label>
            <Input
              required
              className="rounded-lg"
              value={data.income_name}
              onChange={(e) =>
                setData({ ...data, income_name: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label>Pilih RAB</Label>
            <Select
              components={{ Input: CustomSelectInput }}
              className="react-select"
              classNamePrefix="react-select"
              placeholder={rabLoading ? "Pilih" : "Loading..."}
              value={selectedRab ? selectedRab : ""}
              onChange={selectRab}
              options={rabOptions}
            />
          </FormGroup>
          <FormGroup>
            <Label>Tanggal RAB</Label>
            <Input
              required
              readOnly
              className="rounded-lg"
              value={rabLoading && selectedRab ? getDateWithFormat(selectedRab.created_date) : ""}
            />
          </FormGroup>
          <FormGroup>
            <Label>No. RAB</Label>
            <Input
              required
              readOnly
              className="rounded-lg"
              value={rabLoading && selectedRab ? selectedRab.rab_no : ""}
            />
          </FormGroup>
          <FormGroup>
            <Label>Kode aktivitas</Label>
            <Input
              required
              readOnly
              className="rounded-lg"
              value={rabLoading && selectedRab ? selectedRab.rka.activity_code : ""}
            />
          </FormGroup>
          <FormGroup>
            <Label>Nilai RAB</Label>
            <CurrencyFormat
              required={true}
              readOnly={true}
              thousandSeparator={true}
              prefix={"Rp"}
              className="form-control"
              value={rabLoading && selectedRab ? selectedRab.rab_value : 0}
            />
          </FormGroup>
          <FormGroup>
            <Label>No. Referensi</Label>
            <Input
              required
              className="rounded-lg"
              value={data.reference_no}
              onChange={(e) =>
                setData({ ...data, reference_no: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label>Nilai penawaran (Tanpa PPN)</Label>
            <CurrencyFormat
              required={true}
              thousandSeparator={true}
              prefix={"Rp"}
              className="form-control"
              value={data.offer_value}
              onValueChange={(e) => {
                const { value } = e;
                setData({
                  ...data,
                  offer_value: parseInt(value) ? parseInt(value) : 0,
                });
              }}
            />
          </FormGroup>
          <Row>
            <Colxx xxs="2">
              <FormGroup>
                <Label>PPN</Label>
                <CurrencyFormat
                  required={true}
                  suffix="%"
                  className="form-control"
                  value={ppnPercentage}
                  onValueChange={(e) => {
                    const { value } = e;
                    setPpnPercentage(value ? value : 0);
                  }}
                />
              </FormGroup>
            </Colxx>
            <Colxx xxs="10">
              <FormGroup>
                <Label>Nilai penawaran (Termasuk PPN)</Label>
                <CurrencyFormat
                  readOnly={true}
                  thousandSeparator={true}
                  prefix={"Rp"}
                  className="form-control"
                  value={offerTotal}
                />
              </FormGroup>
            </Colxx>
          </Row>
        </CardBody>
      </Card>
      {loading ? (
        <Button size="lg" color="primary w-100 btn-shadow">
          Simpan
        </Button>
      ) : (
        <div className="loading position-relative my-4" />
      )}
    </Form>
  );
};

const mapStateToProps = ({ pendapatan, rab }) => {
  const { pendapatanItems, loading, error } = pendapatan;
  const rabItems = rab.rabItems;
  const rabLoading = rab.loading;
  const rabError = rab.error;
  return { pendapatanItems, loading, error, rabItems, rabLoading, rabError };
};
export default injectIntl(
  connect(mapStateToProps, {
    getRabListAction: getRabList,
  })(PendapatanForm)
);

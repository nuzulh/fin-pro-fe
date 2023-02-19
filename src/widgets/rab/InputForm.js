import React, { useEffect, useState } from "react";
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
  Table,
  Row,
} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "components/common/CustomSelectInput";
import CurrencyFormat from "react-currency-format";
import { Colxx } from "components/common/CustomBootstrap";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import ItemNoForm from "widgets/common/ItemNoForm";
import { getRkaList } from "redux/actions";
import { evidenceList } from "constants/defaultValues";
import { countTax, getCurrentUser } from "helpers/Utils";
import { NotificationManager } from "components/common/react-notifications";

const RabForm = ({ getRkaListAction, rkaItems, loading, loading2, onSubmit }) => {
  const user = getCurrentUser();

  const [data, setData] = useState({
    rab_no: "",
    rab_name: "",
    rab_value: 0,
    sub_total: 0,
    rka_id: "",
    profit_estimation: 0,
    profit_percentage: 0,
    rab_detail: [],
  });
  const [rkaOptions, setRkaOptions] = useState([]);
  const [selectedRka, setSelectedRka] = useState(null);
  const [rows, setRows] = useState([1, 2]);
  const [selectedOption, setSelectedOption] = useState(
    rows.map((row) => {
      return {
        id: row,
        type: "",
        name: "",
        value: 0,
        ppn: 0,
        pph: 0,
        ppn_percentage: 0,
        pph_percentage: 0.0,
      };
    })
  );

  const selectRka = (e) => {
    const selected = rkaItems
      .filter((x) => x.rka_id === e.value)
      .map((x) => ({
        ...x,
        key: x.activity_code,
        label: x.activity_code,
        value: x.rka_id,
      }))[0];
    setSelectedRka(selected);
    setData({ ...data, rka_id: selected.rka_id });
  };

  const deleteRow = (row) => {
    if (rows.length > 1) {
      let newRows = [...rows];
      newRows.splice(rows.indexOf(row), 1);
      let newOption = selectedOption.filter((i) => i.id !== row);
      setRows(newRows);
      setSelectedOption(newOption);
    }
  };

  const addRow = () => {
    let newRows = [...rows];
    let newOption = [...selectedOption];
    if (newOption.length === 0) {
      (newRows = [1]),
        (newOption = [
          {
            id: 1,
            name: "",
            value: 0,
            type: "",
            ppn: 0,
            pph: 0,
            ppn_percentage: 0,
            pph_percentage: 0.0,
          },
        ]);
      setRows(newRows);
      setSelectedOption(newOption);
    } else {
      newRows.push(rows[rows.length - 1] + 1);
      newOption.push({
        id: newRows[newRows.length - 1],
        name: "",
        value: 0,
        type: "",
        ppn: 0,
        pph: 0,
        ppn_percentage: 0,
        pph_percentage: 0.0,
      });
      setRows(newRows);
      setSelectedOption(newOption);
    }
  };

  useEffect(() => {
    getRkaListAction();
  }, []);

  useEffect(() => {
    if (rkaItems) {
      const options = rkaItems.map((item) => ({
        key: item.activity_code,
        label: item.activity_code,
        value: item.rka_id,
      }));
      setRkaOptions(options);
    }
  }, [rkaItems]);

  useEffect(() => {
    if (selectedRka) {
      let total = 0;
      selectedOption.forEach((item) => {
        if (item.value !== "") {
          total += item.value;
          if (item.type === "PKM") total += countTax(item.ppn_percentage, item.value);
          if (item.type === "FEE_PROJECT") total += countTax(item.pph_percentage, item.value);
        }
      });
      const profit_estimation = selectedRka.rka_value - data.rab_value;
      const profit_percentage = ((profit_estimation / selectedRka.rka_value) * 100).toFixed(2);

      if (total > selectedRka.rka_value) {
        NotificationManager.warning("Nilai yang diajukan melebihi nilai RKA!", "Peringatan", 3000, null, null, "");
      } else {
        setData({
          ...data,
          profit_estimation,
          profit_percentage,
          rab_value: total,
        });
      }
    }
  }, [data.rab_value, selectedOption, selectedRka]);

  return (
    <Form onSubmit={(e) => {
      e.preventDefault();
      onSubmit({
        ...data,
        rab_detail: selectedOption,
      });
    }}>
      <ItemNoForm type="RAB" onChange={(val) => setData({ ...data, rab_no: val })} />
      <Card className="mb-4">
        <CardBody>
          <h5 className="font-weight-bold mb-4">Detail</h5>
          <FormGroup>
            <Label>Judul RAB</Label>
            <Input
              required
              className="rounded-lg"
              value={data.rab_name}
              onChange={(e) =>
                setData({ ...data, rab_name: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label>Kode aktivitas</Label>
            <Select
              components={{ Input: CustomSelectInput }}
              className="react-select"
              classNamePrefix="react-select"
              placeholder={loading ? "Pilih" : "Loading..."}
              value={selectedRka ? selectedRka : ""}
              onChange={selectRka}
              options={rkaOptions}
            />
          </FormGroup>
          <FormGroup>
            <Label>Estimasi pendapatan</Label>
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
                readOnly={true}
                thousandSeparator={true}
                prefix={"Rp"}
                className="form-control"
                value={loading && selectedRka ? selectedRka.rka_value : 0}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label>Rencana pengadaan yang diusulkan</Label>
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
                readOnly={true}
                thousandSeparator={true}
                prefix={"Rp"}
                className="form-control"
                value={data.rab_value}
              />
            </InputGroup>
          </FormGroup>
          <Row>
            <Colxx xxs="6">
              <FormGroup>
                <Label>Estimasi profit</Label>
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
                    readOnly={true}
                    thousandSeparator={true}
                    prefix={"Rp"}
                    className="form-control"
                    value={data.profit_estimation}
                  />
                </InputGroup>
              </FormGroup>
            </Colxx>
            <Colxx xxs="6">
              <FormGroup>
                <Label>Persentase profit</Label>
                <InputGroup>
                  <InputGroupAddon addonType="append">
                    <div
                      className="d-flex align-items-center px-3"
                      style={{
                        background: "#E0E7EC",
                      }}
                    >
                      %
                    </div>
                  </InputGroupAddon>
                  <CurrencyFormat
                    readOnly={true}
                    thousandSeparator={true}
                    suffix="%"
                    className="form-control"
                    value={data.profit_percentage}
                  />
                </InputGroup>
              </FormGroup>
            </Colxx>
          </Row>
        </CardBody>
      </Card>
      <Card className="mb-4">
        <CardBody>
          <h5 className="font-weight-bold text-center mb-4">Rincian RAB</h5>
          <Table className="w-100">
            <thead>
              <tr>
                <th width="2%">#</th>
                <th width="23%">Paket pengadaan/Uraian</th>
                <th width="20%">Jumlah Harga</th>
                <th width="15%">Keterangan</th>
                <th width="8%">PPN/PPh (%)</th>
                <th width="2%"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Input
                      required
                      className="rounded-lg"
                      value={
                        selectedOption.filter(
                          (option) => option.id === row
                        )[0].name
                      }
                      onChange={(e) => {
                        let newOption = selectedOption.map((option) => {
                          if (option.id === row) {
                            return {
                              ...option,
                              name: e.target.value,
                            };
                          } else {
                            return option;
                          }
                        });
                        setSelectedOption(newOption);
                      }}
                    />
                  </td>
                  <td>
                    <CurrencyFormat
                      required={true}
                      thousandSeparator={true}
                      prefix={"Rp"}
                      className="form-control"
                      value={
                        selectedOption.filter(
                          (option) => option.id === row
                        )[0].value
                      }
                      onValueChange={(e) => {
                        const { value } = e;
                        let newOption = selectedOption.map((option) => {
                          if (option.id === row) {
                            return {
                              ...option,
                              value: parseInt(value) ? parseInt(value) : 0,
                            };
                          } else {
                            return option;
                          }
                        });
                        setSelectedOption(newOption);
                      }}
                    />
                  </td>
                  <td>
                    <Select
                      components={{ Input: CustomSelectInput }}
                      className="react-select"
                      classNamePrefix="react-select"
                      placeholder="Pilih"
                      value={evidenceList.filter(
                        (item) =>
                          item.value === selectedOption[index].type
                      )}
                      onChange={(e) => {
                        let newOption = selectedOption.map((option) => {
                          if (option.id === row) {
                            return {
                              ...option,
                              type: e.value,
                            };
                          } else {
                            return option;
                          }
                        });
                        setSelectedOption(newOption);
                      }}
                      options={evidenceList}
                    />
                  </td>
                  <td>
                    {selectedOption.find((x) => x.id === row).type === "PKM" && (
                      <Input
                        type="number"
                        className="form-control pr-0 rounded-lg"
                        value={selectedOption.find((x) => x.id === row).ppn_percentage}
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                ppn_percentage: e.target.value,
                                ppn: countTax(e.target.value, option.value),
                              };
                            } else {
                              return option;
                            }
                          });
                          setSelectedOption(newOption);
                        }}
                      />
                    )}
                    {selectedOption.find((x) => x.id === row).type === "FEE_PROJECT" && (
                      <Input
                        type="number"
                        className="form-control pr-0 rounded-lg"
                        value={selectedOption.find((x) => x.id === row).pph_percentage}
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                pph_percentage: e.target.value,
                                pph: countTax(e.target.value, option.value),
                              };
                            } else {
                              return option;
                            }
                          });
                          setSelectedOption(newOption);
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <i
                      onClick={() => deleteRow(row)}
                      className="simple-icon-trash font-weight-bold c-pointer"
                      style={{ fontSize: "1.2rem" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button
            type="button"
            outline
            color="primary btn-shadow mb-4"
            onClick={addRow}
          >
            Tambah barang/jasa
          </Button>
          <FormGroup>
            <Label>Total</Label>
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
                readOnly={true}
                thousandSeparator={true}
                prefix={"Rp"}
                className="form-control"
                value={data.rab_value}
              />
            </InputGroup>
          </FormGroup>
          <Row>
            <Colxx xxs="6">
              <FormGroup>
                <Label>Dibuat oleh</Label>
                <Input readOnly className="rounded-lg" value={user.username} />
              </FormGroup>
            </Colxx>
            <Colxx xxs="6">
              <FormGroup>
                <Label>Departemen</Label>
                <Input
                  readOnly
                  className="rounded-lg"
                  value={user.department}
                />
              </FormGroup>
            </Colxx>
          </Row>
        </CardBody>
      </Card>
      {
        loading2 ? (
          <Button size="lg" color="primary w-100 btn-shadow">
            Ajukan
          </Button>
        ) : (
          <div className="loading position-relative" />
        )
      }
    </Form >
  );
};

const mapStateToProps = ({ rka }) => {
  const { rkaItems, loading } = rka;
  return { rkaItems, loading };
}
export default injectIntl(
  connect(mapStateToProps, {
    getRkaListAction: getRkaList,
  })(RabForm)
);
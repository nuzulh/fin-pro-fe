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
import CurrencyFormat from "react-currency-format";
import { Colxx } from "components/common/CustomBootstrap";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import ItemNoForm from "widgets/common/ItemNoForm";
import { getFeeList } from "redux/actions";
import { countTax, getCurrentUser } from "helpers/Utils";
import { NotificationManager } from "components/common/react-notifications";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import id from 'date-fns/locale/id';
import UploadModal from "widgets/common/UploadModal";

const FeeForm = ({
  getFeeListAction,
  feeItems,
  loading,
  loading2,
  onSubmit,
  uploadedItems,
}) => {
  const user = getCurrentUser();
  const location = useLocation();

  const [data, setData] = useState({
    fee_project_no: "",
    sub_total: 0,
    fee_project_value: 0,
    fee_project_detail: [],
  });
  const [rows, setRows] = useState([1, 2]);
  const [selectedOption, setSelectedOption] = useState(
    rows.map((row) => {
      return {
        id: row,
        unit: "",
        no_memo: "",
        fee_project_detail_id: uuidv4(),
        departure_date: "",
        return_date: "",
        fee_project_detail_value: 0,
        department: "",
      };
    })
  );
  const [showUpload, setShowUpload] = useState({
    show: false,
    id: "",
  });

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
            unit: "",
            no_memo: "",
            fee_project_detail_id: uuidv4(),
            departure_date: "",
            return_date: "",
            fee_project_detail_value: 0,
            department: "",
          },
        ]);
      setRows(newRows);
      setSelectedOption(newOption);
    } else {
      newRows.push(rows[rows.length - 1] + 1);
      newOption.push({
        id: newRows[newRows.length - 1],
        unit: "",
        no_memo: "",
        fee_project_detail_id: uuidv4(),
        departure_date: "",
        return_date: "",
        fee_project_detail_value: 0,
        department: "",
      });
      setRows(newRows);
      setSelectedOption(newOption);
    }
  };

  useEffect(() => {
    getFeeListAction(location.state.fee_project_id);
  }, []);

  useEffect(() => {
    if (uploadedItems) {
      setRows([...uploadedItems.map((_, i) => i + 1)]);
      setSelectedOption([...uploadedItems.map((x, i) => ({
        id: i + 1,
        unit: x["Unit"],
        no_memo: x["No. Memo"],
        fee_project_detail_id: uuidv4(),
        departure_date: Date.parse(x["Tgl. Berangkat"].includes("-")
          ? x["Tgl. Berangkat"] : x["Tgl. Berangkat"].split("/").reverse().join("-")),
        return_date: Date.parse(x["Tgl. Pulang"].includes("-")
          ? x["Tgl. Pulang"] : x["Tgl. Pulang"].split("/").reverse().join("-")),
        fee_project_detail_value: parseInt(x["Nilai"]),
        department: x["Dept./PIC"],
      }))]);
      setData({ ...data, fee_project_value: uploadedItems.map((x) => parseInt(x["Nilai"])).reduce((a, b) => a + b) })
    }
  }, [uploadedItems]);

  useEffect(() => {
    let sub_total = 0;
    selectedOption.forEach((item) => {
      if (item.fee_project_detail_value !== "") {
        sub_total += item.fee_project_detail_value;
      }
    });
    const total = sub_total;

    if (feeItems && total + feeItems[0].pph > feeItems[0].fee_project_value) {
      NotificationManager.warning("Nilai yang diajukan melebihi nilai Fee Project!", "Peringatan", 3000, null, null, "");
    } else {
      setData({
        ...data,
        sub_total,
        fee_project_value: total,
      });
    }
  }, [data.fee_project_value, selectedOption]);

  return (
    <>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...data,
          fee_project_id: feeItems[0].fee_project_id,
          fee_project_detail: selectedOption,
        });
      }}>
        <ItemNoForm type="Fee Project" onChange={(val) => setData({ ...data, fee_project_no: val })} />
        <Card className="mb-4">
          {loading && feeItems && feeItems[0].rab ? (
            <CardBody>
              <h5 className="font-weight-bold mb-4">Detail</h5>
              <FormGroup>
                <Label>Judul Fee Project</Label>
                <p className="pl-3">{feeItems[0].fee_project_name}</p>
              </FormGroup>
              <FormGroup>
                <Label>No. RAB</Label>
                <p className="pl-3">{feeItems[0].rab.rab_no}</p>
              </FormGroup>
              <FormGroup>
                <Label>Judul RAB</Label>
                <p className="pl-3">{feeItems[0].rab.rab_name}</p>
              </FormGroup>
              <FormGroup>
                <Label>Nilai RAB</Label>
                <p className="pl-3 font-weight-bold">
                  <CurrencyFormat
                    prefix="Rp"
                    thousandSeparator={true}
                    displayType="text"
                    value={feeItems[0].rab.rab_value}
                  />
                </p>
              </FormGroup>
              <FormGroup>
                <Label>Nilai Fee Project</Label>
                <p className="pl-3 font-weight-bold">
                  <CurrencyFormat
                    prefix="Rp"
                    thousandSeparator={true}
                    displayType="text"
                    value={feeItems[0].fee_project_value}
                  />
                </p>
              </FormGroup>
            </CardBody>
          ) : (
            <div className="loading position-relative my-4" />
          )}
        </Card>
        <Card className="mb-4">
          <CardBody>
            <h5 className="font-weight-bold text-center mb-4">
              Rincian Fee Project
            </h5>
            <Table className="w-100">
              <thead>
                <tr>
                  <th width="5%">#</th>
                  <th width="15%">Unit</th>
                  <th width="13%">No. Memo</th>
                  <th width="15%">Tgl. Berangkat</th>
                  <th width="15%">Tgl. Pulang</th>
                  <th width="18%">Nilai</th>
                  <th width="15%">Dept./PIC</th>
                  <th width="4%"></th>
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
                          )[0].unit
                        }
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                unit: e.target.value,
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
                      <Input
                        required
                        className="rounded-lg"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].no_memo
                        }
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                no_memo: e.target.value,
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
                      <ReactDatePicker
                        placeholderText="Pilih tanggal"
                        onChange={(date) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                departure_date: date,
                              };
                            } else {
                              return option;
                            }
                          });
                          setSelectedOption(newOption);
                        }}
                        selected={selectedOption.filter(
                          (option) => option.id === row
                        )[0].departure_date}
                        locale={id}
                        dateFormat="dd/MM/yyyy"
                      />
                    </td>
                    <td>
                      <ReactDatePicker
                        placeholderText="Pilih tanggal"
                        onChange={(date) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                return_date: date,
                              };
                            } else {
                              return option;
                            }
                          });
                          setSelectedOption(newOption);
                        }}
                        selected={selectedOption.filter(
                          (option) => option.id === row
                        )[0].return_date}
                        locale={id}
                        dateFormat="dd/MM/yyyy"
                      />
                    </td>
                    <td>
                      <CurrencyFormat
                        required={true}
                        thousandSeparator={true}
                        prefix={"Rp"}
                        className="form-control rounded-lg"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].fee_project_detail_value
                        }
                        onValueChange={(e) => {
                          const { value } = e;
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                fee_project_detail_value: parseInt(value) ? parseInt(value) : 0,
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
                      <Input
                        required
                        className="rounded-lg"
                        value={
                          selectedOption.filter(
                            (option) => option.id === row
                          )[0].department
                        }
                        onChange={(e) => {
                          let newOption = selectedOption.map((option) => {
                            if (option.id === row) {
                              return {
                                ...option,
                                department: e.target.value,
                              };
                            } else {
                              return option;
                            }
                          });
                          setSelectedOption(newOption);
                        }}
                      />
                    </td>
                    <td className="d-flex align-items-center">
                      {loading ? (
                        <i
                          className={`${false
                            ? "simple-icon-folder"
                            : "iconsminds-upload-1"
                            } c-pointer font-weight-bold mr-3`}
                          style={{
                            fontSize: "1.1rem",
                          }}
                          onClick={() => {
                            const chk = selectedOption.find((x) => x.id === row);
                            if (chk.unit !== "" && chk.no_memo && chk.departure_date !== "" && chk.return_date !== "" && chk.fee_project_detail_value !== 0 && chk.department !== "") {
                              setShowUpload({
                                show: true,
                                id: chk.fee_project_detail_id,
                              });
                            } else {
                              NotificationManager.warning("Mohon isi kelengkapan isian terlebih dahulu sebelum mengupload berkas!", "Peringatan", 3000, null, null, "");
                            }
                          }}
                        />
                      ) : (
                        <div className="loading position-relative" />
                      )}
                      <i
                        className={`simple-icon-trash c-pointer`}
                        style={{
                          fontSize: "1.1rem",
                        }}
                        onClick={() => deleteRow(row)}
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
              Tambah transaksi
            </Button>
            {loading && feeItems && feeItems[0] ? (
              <>
                <FormGroup>
                  <Label>Nilai PPh</Label>
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
                      value={feeItems[0].pph}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label>Total nilai rincian</Label>
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
                      value={data.fee_project_value + feeItems[0].pph}
                    />
                  </InputGroup>
                </FormGroup>
              </>
            ) : (
              <div className="loading position-relative" />
            )}
            <FormGroup>
              <Label>Dibuat oleh</Label>
              <Input readOnly className="rounded-lg" value={user.username} />
            </FormGroup>
          </CardBody>
        </Card>
        {loading2 ? (
          <Button size="lg" color="primary w-100 btn-shadow">
            Simpan
          </Button>
        ) : (
          <div className="loading position-relative" />
        )}
      </Form>
      {feeItems && (
        <UploadModal
          isOpen={showUpload.show}
          toggle={() => setShowUpload(!showUpload.show)}
          label="Bukti transaksi Fee Project"
          subLabel="Silahkan unggah transaksi Fee Project"
          fileTypes={["JPG", "PNG", "PDF"]}
          type="fee_project"
          onClose={() => setShowUpload(false)}
          itemId={feeItems[0].fee_project_id}
          subItemId={showUpload.id}
        />
      )}
    </>
  );
};

const mapStateToProps = ({ fee }) => {
  const { feeItems, loading } = fee;
  return { feeItems, loading };
}
export default injectIntl(
  connect(mapStateToProps, {
    getFeeListAction: getFeeList,
  })(FeeForm)
);
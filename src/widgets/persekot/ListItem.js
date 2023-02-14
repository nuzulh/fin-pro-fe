import React, { useState } from "react";
import {
  Card,
  CardBody,
  Badge,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  CustomInput,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { Colxx } from "components/common/CustomBootstrap";
import { getCurrentUser, getDateWithFormat } from "helpers/Utils";
import CurrencyFormat from "react-currency-format";
import { adminRoot, statusColor, UserRole } from "constants/defaultValues";

const PersekotListItem = ({
  item,
  isImport = false,
  editable = false,
  onEdit,
  handleCheckChange,
  isSelected,
  hiddenSelectbox = true,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [newValue, setNewValue] = useState(null);
  const [showNote, setShowNote] = useState(false);
  const user = getCurrentUser();

  return (
    <Colxx xxs="12">
      <Card className="card d-flex mb-3">
        <div>
          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            {isImport ? (
              <p className="mb-1 text-small w-15 w-xs-100">
                {item.persekot_no}
              </p>
            ) : (
              <NavLink
                className={`mb-1 text-small w-15 w-xs-100 btn btn-${statusColor[item.status]} btn-shadow py-1 px-0`}
                to={{
                  pathname: `${adminRoot}/rka/beban/biaya-operasional/persekot/${item.status === "DRAFTED" ? "add" : "detail"}`,
                  state: { persekot_id: item.persekot_id, status: item.status },
                }}
              >
                <i className="iconsminds-right-1 font-weight-bold" />
                {item.status === "DRAFTED" ? "Ajukan Persekot" : item.status === "APPROVED" && user.role === UserRole.STAFF ? "Buat Laporan" : item.persekot_no}
              </NavLink>
            )}
            <p className="mb-1 text-small w-20 w-xs-100">
              {item.persekot_name}
            </p>
            <p className="mb-1 text-small w-15 w-xs-100">
              <CurrencyFormat
                prefix="Rp"
                displayType="text"
                thousandSeparator={true}
                value={item.status === "DRAFTED" ? item.persekot_balance : item.persekot_value}
              />
            </p>
            <p className="mb-1 text-small w-10 w-xs-100">
              {item.proposed_by ? item.proposed_by : user.username}
            </p>
            <p className="mb-1 text-small w-10 w-xs-100">
              {getDateWithFormat(item.created_date)}
            </p>
            <div className="mb-1 text-small w-10 w-xs-100">
              {isImport ? (
                <i
                  style={{
                    fontSize: "1.1rem",
                  }}
                  className={
                    item.isValid
                      ? "simple-icon-check text-success align-self-center w-5 w-xs-100 font-weight-bold"
                      : "simple-icon-close text-danger align-self-center w-5 w-xs-100 font-weight-bold"
                  }
                />
              ) : (
                <Badge
                  pill
                  onClick={() => setShowNote(!showNote)}
                  className={item.status === "REJECTED" ? "c-pointer" : ""}
                  color={statusColor[item.status]}
                >
                  {item.status}
                </Badge>
              )}
            </div>
            <div
              hidden={!editable}
              style={{
                position: "absolute",
                alignSelf: "center",
                right: 0,
              }}
            >
              <i
                className={`simple-icon-note text-primary float-right px-3 font-weight-bold c-pointer`}
                onClick={() => {
                  setNewValue(item);
                  setShowEdit(!showEdit);
                }}
              />
            </div>
            <div
              hidden={hiddenSelectbox}
              style={{
                position: "absolute",
                alignSelf: "center",
                right: 0,
              }}>
              <div className="custom-control custom-checkbox align-self-center mr-4 p-0 my-0">
                <CustomInput
                  className="itemCheck mb-0"
                  type="checkbox"
                  id={`check_${item.persekot_id}`}
                  checked={isSelected}
                  onChange={(event) =>
                    handleCheckChange(event, item.persekot_id)
                  }
                  label=""
                />
              </div>
            </div>
          </CardBody>
          {item.status === "REJECTED" && showNote && (
            <div className="float-right px-4 pb-3">
              <p className="text-right">
                <strong>Catatan:</strong>
                <br />
                {item.rejected_reason}
              </p>
            </div>
          )}
          {showEdit && (
            <Row className="mb-4">
              <Colxx className="mx-4">
                <p className="font-weight-bold">Perbaharui Persekot</p>
                <Form onSubmit={onEdit}>
                  <FormGroup>
                    <Label>Judul Persekot</Label>
                    <Input
                      required
                      className="rounded-lg"
                      value={newValue.persekot_name}
                      onChange={(e) =>
                        setNewValue({
                          ...newValue,
                          persekot_name: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Nilai Persekot</Label>
                    <CurrencyFormat
                      thousandSeparator={true}
                      prefix={"Rp"}
                      className="form-control"
                      value={newValue.persekot_value}
                      onValueChange={(e) => {
                        const { value } = e;
                        setNewValue({
                          ...newValue,
                          persekot_value: parseInt(value) ? parseInt(value) : 0,
                          persekot_balance: parseInt((item.persekot_balance - item.persekot_value) + parseInt(value)),
                        });
                      }}
                    />
                  </FormGroup>
                  {item.status === "DRAFTED" && (
                    <FormGroup>
                      <Label>Saldo Persekot</Label>
                      <CurrencyFormat
                        readOnly={true}
                        thousandSeparator={true}
                        prefix={"Rp"}
                        className="form-control"
                        value={newValue.persekot_balance}
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
                      onClick={() => onEdit(newValue)}
                    >
                      Simpan perubahan
                    </Button>
                  </div>
                </Form>
              </Colxx>
            </Row>
          )}
        </div>
      </Card>
    </Colxx>
  );
};

export default React.memo(PersekotListItem);

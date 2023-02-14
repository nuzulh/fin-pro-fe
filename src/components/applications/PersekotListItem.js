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
} from "reactstrap";
import { NavLink } from "react-router-dom";

import { Colxx } from "../common/CustomBootstrap";
import { getDateWithFormat } from "helpers/Utils";
import { adminRoot } from "constants/defaultValues";
import CurrencyFormat from "react-currency-format";

const PersekotListItem = ({
  item,
  isImport = false,
  editable = false,
  onEdit,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [newValue, setNewValue] = useState(item);
  const [showNote, setShowNote] = useState(false);
  console.log(item);

  return (
    <Colxx xxs="12">
      <Card className="card d-flex mb-3">
        <div className="d-flex flex-grow-1 min-width-zero">
          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            {isImport ? (
              <p className="mb-1 text-small w-15 w-xs-100">{item.imprestNo}</p>
            ) : (
              <NavLink
                className={`mb-1 text-small w-15 w-xs-100 btn btn-shadow btn-${item.imprestNo ? !item.reported && item.status === "APPROVED" ? "success" : "primary" : "info"
                  } py-1 px-0`}
                to={{
                  pathname: `${adminRoot}/rka/beban/biaya-operasional/persekot-${item.status === "DRAFTED" ? "draft" : "detail"
                    }`,
                  state: { item },
                }}
              >
                <i className="iconsminds-right-1 font-weight-bold" />
                {item.imprestNo ? !item.reported && item.status === "APPROVED" ? "Buat laporan" : item.imprestNo : "Ajukan persekot"}
              </NavLink>
            )}
            <p className="mb-1 text-small w-20 w-xs-100">{item.imprestName}</p>
            <p className="mb-1 text-small w-15 w-xs-100">
              <CurrencyFormat
                prefix="Rp"
                thousandSeparator={true}
                displayType="text"
                value={
                  item.imprestTotal ? item.imprestTotal : item.imprestBalance
                }
              />
            </p>
            <p className="mb-1 text-small w-10 w-xs-100">{item.proposedBy}</p>
            <p className="mb-1 text-small w-10 w-xs-100">
              {getDateWithFormat(item.createdDate)}
            </p>
            <div className="w-10 w-xs-100">
              {item.status === "APPROVED" && (
                item.reported ? (
                  <Badge color="primary" pill>
                    REPORTED
                  </Badge>
                ) : (
                  <Badge color="success" pill>
                    APPROVED
                  </Badge>
                ))}
              {item.status === "PROPOSED" && (
                <Badge color="warning" pill>
                  PROPOSED
                </Badge>
              )}
              {item.status === "DRAFTED" && (
                <Badge color="info" pill>
                  DRAFTED
                </Badge>
              )}
              {item.status === "REJECTED" && (
                <Badge
                  color="danger"
                  pill
                  onClick={() => setShowNote(!showNote)}
                  className={"c-pointer"}
                >
                  REJECTED
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
                  setShowEdit(!showEdit);
                }}
              />
            </div>
          </CardBody>
        </div>
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
                    value={newValue.imprestName}
                    onChange={(e) =>
                      setNewValue({
                        ...newValue,
                        imprestName: e.target.value,
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
                    value={
                      newValue.status === "DRAFTED"
                        ? newValue.imprestBalance
                        : newValue.imprestTotal
                    }
                    onValueChange={(e) => {
                      const { value } = e;
                      if (newValue.status === "DRAFTED") {
                        setNewValue({
                          ...newValue,
                          imprestBalance: parseInt(value) ? parseInt(value) : 0,
                        });
                      } else {
                        setNewValue({
                          ...newValue,
                          imprestTotal: parseInt(value) ? parseInt(value) : 0,
                        });
                      }
                    }}
                  />
                </FormGroup>
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
                    onClick={async () => {
                      await onEdit(newValue);
                      setNewValue(item);
                    }}
                  >
                    Simpan perubahan
                  </Button>
                </div>
              </Form>
            </Colxx>
          </Row>
        )}
      </Card>
    </Colxx>
  );
};

export default React.memo(PersekotListItem);

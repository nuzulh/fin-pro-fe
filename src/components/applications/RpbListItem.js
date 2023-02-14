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
import { adminRoot } from "constants/defaultValues";
import { getDateWithFormat } from "helpers/Utils";
import CurrencyFormat from "react-currency-format";

const RpbListItem = ({ item, isImport = false, editable = false, onEdit }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [newValue, setNewValue] = useState(item);
  const [showNote, setShowNote] = useState(false);

  return (
    <Colxx xxs="12">
      <Card className="card d-flex mb-3">
        <div className="d-flex flex-grow-1 min-width-zero">
          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            {isImport ? (
              <p className="mb-1 text-small w-15 w-xs-100">
                {item.procurementNo}
              </p>
            ) : (
              <NavLink
                className={`mb-1 text-small w-15 w-xs-100 btn btn-${
                  item.procurementNo ? "primary" : "success"
                } btn-shadow py-1 px-0`}
                to={{
                  pathname: `${adminRoot}/rka/beban/prokurmen/rpb-${
                    item.status === "DRAFTED" ? "draft" : "detail"
                  }`,
                  state: { item },
                }}
              >
                <i className="iconsminds-right-1 font-weight-bold" />
                {item.procurementNo ? item.procurementNo : "Ajukan RPB"}
              </NavLink>
            )}
            <p className="mb-1 text-small w-20 w-xs-100">
              {item.procurementName}
            </p>
            <p className="mb-1 text-small w-15 w-xs-100">
              <CurrencyFormat
                prefix="Rp"
                displayType="text"
                thousandSeparator={true}
                value={item.total ? item.total : "-"}
              />
            </p>
            <p className="mb-1 text-small w-10 w-xs-100">{item.proposedBy}</p>
            <p className="mb-1 text-small w-10 w-xs-100">
              {getDateWithFormat(item.createdDate)}
            </p>
            <div className="mb-1 text-small w-10 w-xs-100">
              {item.status === "APPROVED" && (
                <Badge color="success" pill>
                  APPROVED
                </Badge>
              )}
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
              <p className="font-weight-bold">Perbaharui RAB</p>
              <Form onSubmit={onEdit}>
                <FormGroup>
                  <Label>Judul RPB</Label>
                  <Input
                    required
                    className="rounded-lg"
                    value={newValue.procurementName}
                    onChange={(e) =>
                      setNewValue({
                        ...newValue,
                        procurementName: e.target.value,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Nilai RPB</Label>
                  <CurrencyFormat
                    thousandSeparator={true}
                    prefix={"Rp"}
                    className="form-control"
                    value={newValue.total}
                    onValueChange={(e) => {
                      const { value } = e;
                      setNewValue({
                        ...newValue,
                        total: parseInt(value) ? parseInt(value) : 0,
                      });
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

export default React.memo(RpbListItem);

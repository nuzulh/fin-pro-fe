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
import { getCurrentUser, getDateWithFormat } from "helpers/Utils";
import { adminRoot } from "constants/defaultValues";
import CurrencyFormat from "react-currency-format";

const RabListItem = ({ item, isImport = false, editable = false, onEdit }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [newValue, setNewValue] = useState(item);
  const [showNote, setShowNote] = useState(false);
  const user = getCurrentUser();

  return (
    <Colxx xxs="12">
      <Card className="card d-flex mb-3">
        <div>
          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            {isImport ? (
              <p className="mb-1 text-small w-15 w-xs-100">
                {item.budgetPlanNo ? item.budgetPlanNo : item.budget_plan_no}
              </p>
            ) : (
              <NavLink
                className="mb-1 text-small w-15 w-xs-100 btn btn-primary btn-shadow py-1 px-0"
                to={{
                  pathname: `${adminRoot}/rka/beban/detail`,
                  state: { item },
                }}
              >
                <i className="iconsminds-right-1 font-weight-bold" />
                {item.budgetPlanNo ? item.budgetPlanNo : item.budget_plan_no}
              </NavLink>
            )}
            <p className="mb-1 text-small w-20 w-xs-100">
              {item.budgetPlanName
                ? item.budgetPlanName
                : item.budget_plan_name}
            </p>
            <p className="mb-1 text-small w-15 w-xs-100">
              <CurrencyFormat
                prefix="Rp"
                displayType="text"
                thousandSeparator={true}
                value={item.total}
              />
            </p>
            <p className="mb-1 text-small w-10 w-xs-100">
              {item.proposedBy ? item.proposedBy : user.username}
            </p>
            <p className="mb-1 text-small w-10 w-xs-100">
              {getDateWithFormat(item.createdDate)}
            </p>
            <div className="mb-1 text-small w-10 w-xs-100">
              {isImport ? (
                <i
                  style={{
                    fontSize: "1.1rem",
                  }}
                  className={
                    item.valid
                      ? "simple-icon-check text-success align-self-center w-5 w-xs-100 font-weight-bold"
                      : "simple-icon-close text-danger align-self-center w-5 w-xs-100 font-weight-bold"
                  }
                />
              ) : (
                <Badge
                  pill
                  onClick={() => setShowNote(!showNote)}
                  className={item.status === "REJECTED" ? "c-pointer" : ""}
                  color={
                    item.status === "APPROVED"
                      ? "success"
                      : item.status === "PROPOSED"
                      ? "warning"
                      : "danger"
                  }
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
                  setShowEdit(!showEdit);
                }}
              />
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
                <p className="font-weight-bold">Perbaharui RAB</p>
                <Form onSubmit={onEdit}>
                  <FormGroup>
                    <Label>Judul RAB</Label>
                    <Input
                      required
                      className="rounded-lg"
                      value={newValue.budgetPlanName}
                      onChange={(e) =>
                        setNewValue({
                          ...newValue,
                          budgetPlanName: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Nilai RAB</Label>
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
        </div>
      </Card>
    </Colxx>
  );
};

export default React.memo(RabListItem);

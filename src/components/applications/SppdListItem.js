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
import { adminRoot, servicePath2 } from "constants/defaultValues";
import axios from "axios";
import { NotificationManager } from "components/common/react-notifications";

const SppdListItem = ({ item, editable = false, onEdit }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [newValue, setNewValue] = useState(item);

  return (
    <Colxx xxs="12">
      <Card className="card d-flex mb-3">
        <div className="d-flex flex-grow-1 min-width-zero">
          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            <NavLink
              className={`mb-1 text-small w-15 w-xs-100 btn btn-${
                item.status === "APPROVED" ? "success" : "primary"
              } btn-shadow py-1 px-0`}
              to={{
                pathname: `${adminRoot}/rka/beban/biaya-operasional/sppd-${
                  item.status === "APPROVED" ? "draft" : "detail"
                }`,
                state: { item },
              }}
            >
              <i className="iconsminds-right-1 font-weight-bold" />
              {item.travelOrderNo
                ? item.travelOrderNo
                : item.travel_order_no
                ? item.travel_order_no
                : "Buat laporan"}
            </NavLink>
            <p className="mb-1 text-small w-20 w-xs-100">
              {item.travelOrderName
                ? item.travelOrderName.split("~~")[0]
                : item.travel_order_name}
            </p>
            <p className="mb-1 text-small w-15 w-xs-100">
              {item.budgetPlan
                ? item.budgetPlan.budgetPlanNo
                : item.budget_plan.budget_plan_no}
            </p>
            <p className="mb-1 text-small w-10 w-xs-100">
              {item.proposedBy ? item.proposedBy : item.maker}
            </p>
            <p className="mb-1 text-small w-10 w-xs-100">
              {getDateWithFormat(
                item.creationDate ? item.creationDate : item.creation_time
              )}
            </p>
          </CardBody>
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
        </div>
        {showEdit && (
          <Row className="mb-4">
            <Colxx className="mx-4">
              <p className="font-weight-bold">Perbaharui SPPD</p>
              <Form onSubmit={onEdit}>
                <FormGroup>
                  <Label>Judul SPPD</Label>
                  <Input
                    required
                    className="rounded-lg"
                    value={
                      newValue.travelOrderName
                        ? newValue.travelOrderName.split("~~")[0]
                        : newValue.travel_order_name
                    }
                    onChange={(e) => {
                      if (item.travelOrderName) {
                        setNewValue({
                          ...newValue,
                          travelOrderName: e.target.value,
                        });
                      } else {
                        setNewValue({
                          ...newValue,
                          travel_order_name: e.target.value,
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

export default React.memo(SppdListItem);

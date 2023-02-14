import React from "react";
import { Card, CardBody, Badge, CustomInput } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Colxx } from "../common/CustomBootstrap";
import { getDateWithFormat } from "helpers/Utils";
import { adminRoot } from "constants/defaultValues";
import CurrencyFormat from "react-currency-format";

const RpbListItemDashboard = ({ item, handleCheckChange, isSelected }) => {
  return (
    <Colxx xxs="12">
      <Card className="card d-flex mb-3">
        <div className="d-flex flex-grow-1 min-width-zero">
          <CardBody>
            <div className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
              <NavLink
                className="mb-1 text-small w-15 w-xs-100 btn btn-primary btn-shadow py-1 px-0"
                to={{
                  pathname: `${adminRoot}/dashboard/pending-details`,
                  state: {
                    payload: {
                      maintenance_id: item.maintenance_id,
                      reference_number: item.reference_number,
                      primary_code: item.primary_code,
                      menu_path: item.menu_path,
                    },
                  },
                }}
              >
                <i className="iconsminds-right-1 font-weight-bold" />
                {item.procurement_no}
              </NavLink>
              <p className="mb-1 text-small w-20 w-xs-100">
                {item.procurement_name}
              </p>
              <p className="mb-1 text-small w-15 w-xs-100">
                <CurrencyFormat
                  displayType="text"
                  thousandSeparator={true}
                  prefix="Rp"
                  value={item.procurement_total}
                />
              </p>
              <p className="mb-1 text-small w-10 w-xs-100">{item.maker}</p>
              <p className="mb-1 text-small w-10 w-xs-100">
                {getDateWithFormat(item.creation_time)}
              </p>
            </div>
          </CardBody>
          <div className="custom-control custom-checkbox align-self-center mx-4 p-0">
            <CustomInput
              className="itemCheck mb-0"
              type="checkbox"
              id={`check_${item.reference_number}`}
              checked={isSelected}
              onChange={(event) =>
                handleCheckChange(event, item.reference_number)
              }
              label=""
            />
          </div>
        </div>
      </Card>
    </Colxx>
  );
};

export default React.memo(RpbListItemDashboard);

import React, { useState } from "react";
import {
  Card,
  CardBody,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { Colxx } from "components/common/CustomBootstrap";
import { getCurrentUser, getDateWithFormat } from "helpers/Utils";
import CurrencyFormat from "react-currency-format";
import { adminRoot } from "constants/defaultValues";

const RabProgresListItem = ({ item }) => {
  const [showDetail, setShowDetail] = useState(false);
  const user = getCurrentUser();

  return (
    <Colxx xxs="12">
      <Card className="card d-flex mb-3">
        <div
          className="d-flex flex-grow-1 min-width-zero"
          onClick={() => setShowDetail(!showDetail)}
        >
          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            <NavLink
              className={`mb-1 text-small w-15 w-xs-100 btn btn-primary btn-shadow py-1 px-0`}
              to={{
                pathname: `${adminRoot}/rka/beban/rab/detail`,
                state: { rab_id: item.rab_id },
              }}
            >
              <i className="iconsminds-right-1 font-weight-bold" />
              {item.rab_no}
            </NavLink>
            <p className="mb-1 text-small w-20 w-xs-100">
              {item.rab_name}
            </p>
            <p className="mb-1 text-small w-15 w-xs-100">
              <CurrencyFormat
                prefix="Rp"
                displayType="text"
                thousandSeparator={true}
                value={item.rab_value}
              />
            </p>
            <p className="mb-1 text-small w-10 w-xs-100">
              {item.proposed_by ? item.proposed_by : user.username}
            </p>
            <p className="mb-1 text-small w-10 w-xs-100">
              {getDateWithFormat(item.created_date)}
            </p>
          </CardBody>
        </div>
        {showDetail && (
          <div className="d-flex align-items-end justify-content-between">
            <div className="mx-1 mb-3 align-self-start">
              <div className="mx-4 d-flex flex-column text-right">
                <span className="my-1">
                  <span>Estimasi Pendapatan: </span>
                  <strong>
                    <CurrencyFormat
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={123}
                    />
                  </strong>
                </span>
                <span className="my-1">
                  <span>Realisasi PA: </span>
                  <strong>
                    <CurrencyFormat
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={123}
                    />
                  </strong>
                </span>
                <span className="my-1">
                  <span>Realisasi PO: </span>
                  <strong>
                    <CurrencyFormat
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={123}
                    />
                  </strong>
                </span>
                <span className="my-1">
                  <span>Realisasi BA/Invoice: </span>
                  <strong>
                    <CurrencyFormat
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={123}
                    />
                  </strong>
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </Colxx>
  );
};

export default React.memo(RabProgresListItem);

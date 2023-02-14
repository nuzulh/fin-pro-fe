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
            <p className="mb-1 font-weight-bold w-15 w-xs-100">
              {item.rab_name}
            </p>
            <p className="mb-1 font-weight-bold w-15 w-xs-100">
              <CurrencyFormat
                prefix="Rp"
                displayType="text"
                thousandSeparator={true}
                value={item.rab_value}
              />
            </p>
            <i
              className={
                showDetail
                  ? "simple-icon-arrow-up text-primary align-self-center w-5 w-xs-100 font-weight-bold"
                  : "simple-icon-arrow-down text-primary align-self-center w-5 w-xs-100 font-weight-bold"
              }
            />
          </CardBody>
        </div>
        {showDetail && (
          <div className="d-flex align-items-end justify-content-between">
            <div className="mx-1 mb-3 align-self-end w-100">
              <div className="mx-4 d-flex flex-column text-right">
                <span className="my-1">
                  <span>Total Persekot Draft ({item.persekot_draft.length}): </span>
                  <strong>
                    <CurrencyFormat
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={[...item.persekot_draft.map((x) => x.persekot_balance)].length > 0 ? [...item.persekot_draft.map((x) => x.persekot_balance)].reduce((a, b) => a + b) : 0}
                    />
                  </strong>
                </span>
                <span className="my-1">
                  <span>Total Persekot ({item.persekot.length}): </span>
                  <strong>
                    <CurrencyFormat
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={[...item.persekot.map((x) => x.persekot_value)].length > 0 ? [...item.persekot.map((x) => x.persekot_value)].reduce((a, b) => a + b) : 0}
                    />
                  </strong>
                </span>
                <span className="my-1">
                  <span>Total RPB Draft ({item.pkm_draft.length}): </span>
                  <strong>
                    <CurrencyFormat
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={[...item.pkm_draft.map((x) => x.pkm_balance)].length > 0 ? [...item.pkm_draft.map((x) => x.pkm_balance)].reduce((a, b) => a + b) : 0}
                    />
                  </strong>
                </span>
                <span className="my-1">
                  <span>Total RPB ({item.pkm.length}): </span>
                  <strong>
                    <CurrencyFormat
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={[...item.pkm.map((x) => x.pkm_value)].length > 0 ? [...item.pkm.map((x) => x.pkm_value)].reduce((a, b) => a + b) : 0}
                    />
                  </strong>
                </span>
                <span className="my-1">
                  <span>Total SPPD ({item.sppd.length}): </span>
                  <strong>
                    <CurrencyFormat
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={[...item.sppd.map((x) => x.sppd_value)].length > 0 ? [...item.sppd.map((x) => x.sppd_value)].reduce((a, b) => a + b) : 0}
                    />
                  </strong>
                </span>
                <span className="my-1">
                  <span>Total Fee Project ({item.fee_project.length}): </span>
                  <strong>
                    <CurrencyFormat
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType="text"
                      value={[...item.fee_project.map((x) => x.fee_project_value)].length > 0 ? [...item.fee_project.map((x) => x.fee_project_value)].reduce((a, b) => a + b) : 0}
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

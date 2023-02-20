import React, { useState } from "react";
import {
  Card,
  CardBody,
  Row,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { Colxx, Separator } from "components/common/CustomBootstrap";
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
          <Colxx xxs="12" className="px-4 pb-3">
            <Separator className="mb-4" />
            <Row>
              <Colxx xxs="3">
                <h6 className="font-weight-bold">Persekot</h6>
                {item.persekot_draft.length > 0 && item.persekot_draft.map((x, i) => {
                  return x.persekot.map((y, j) => (
                    <div key={`${i}_${j}`} className="mb-2">
                      <strong>({j + 1})</strong>
                      <p className="m-0">Nilai: {y.persekot_value}</p>
                      <p className="m-0">Realisasi: {y.persekot_realization}</p>
                      <p className="m-0">Status: {y.status}</p>
                    </div>
                  ));
                })}
              </Colxx>
              <Colxx xxs="3">
                <h6 className="font-weight-bold">RPB</h6>
                {item.pkm_draft.length > 0 && item.pkm_draft.map((x, i) => {
                  return x.pkm.map((y, j) => (
                    <div key={`${i}_${j}`} className="mb-2">
                      <strong>({j + 1})</strong>
                      <p className="m-0">Nilai: {y.pkm_value}</p>
                      <p className="m-0">Status: {y.status}</p>
                    </div>
                  ));
                })}
              </Colxx>
              <Colxx xxs="3">
                <h6 className="font-weight-bold">SPPD</h6>
                {item.sppd.map((x, i) => (
                  <div key={i} className="mb-2">
                    <strong>({i + 1})</strong>
                    <p className="m-0">Nilai: {x.sppd_value}</p>
                    <p className="m-0">Status: {x.status}</p>
                  </div>
                ))}
              </Colxx>
              <Colxx xxs="3">
                <h6 className="font-weight-bold">Fee Project</h6>
                {item.fee_project.map((x, i) => (
                  <div key={i} className="mb-2">
                    <strong>({i + 1})</strong>
                    <p className="m-0">Nilai: {x.fee_project_value}</p>
                    <p className="m-0">Status: {x.status}</p>
                  </div>
                ))}
              </Colxx>
            </Row>
          </Colxx>
        )}
      </Card>
    </Colxx>
  );
};

export default React.memo(RabProgresListItem);

import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import React, { useEffect, useState } from "react";
import { Row } from "reactstrap";
import PendingCard from "widgets/dashboard/PendingCard";
import { getPendingCount } from "redux/actions";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { NotificationManager } from "components/common/react-notifications";
import { getCurrentUser } from "helpers/Utils";
import SwitchMenuButton from "widgets/common/SwitchMenuButton";
import BebanCharts from "widgets/dashboard/charts/beban";
import PendapatanCharts from "widgets/dashboard/charts/pendapatan";

const DashboardView = ({
  match,
  getPendingCountAction,
  pendingCountItem,
  loading,
  error
}) => {
  const user = getCurrentUser();
  const [isOpen1, setIsOpen1] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    getPendingCountAction();
  }, []);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
  }, [error]);

  return (
    <Row>
      <Colxx xxs="12">
        <div className="d-flex align-items-center">
          <h1>Halo, {user.username}</h1>
          <BreadcrumbContainer match={match} />
        </div>
        <Separator className="mb-4" />
        <div className="d-flex justify-content-between">
          <div>
            <h2 className="font-weight-bold">
              Overview {isOpen1 ? "Beban" : "Pendapatan"} Tahun
              <span className="text-primary"> {year}</span>
            </h2>
            <p>{isOpen1 ? "Beban" : "Pendapatan"} project MRO services PT. Cogindo DayaBersama</p>
          </div>
          <SwitchMenuButton
            open1={isOpen1}
            openedMenu={(val) => setIsOpen1(val)}
            label1="Beban"
            label2="Pendapatan"
            width={8}
            className="mb-2"
          />
          <Colxx lg="3" md="6" xxs="10" className="p-0">
            <div className="search-sm d-inline-block float-md-right mr-1 mb-1 align-top">
              <input
                name="keyword"
                id="search"
                placeholder="Tahun"
                defaultValue={year}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    setYear(e.target.value);
                  }
                }}
              />
            </div>
          </Colxx>
        </div>
        <Row>
          {isOpen1
            ? <BebanCharts year={year} />
            : <PendapatanCharts year={year} />}
        </Row>
        <Row>
          {loading && pendingCountItem ? (
            <>
              <PendingCard type="RAB" total={pendingCountItem.pending_rab} />
              <PendingCard type="RPB" total={pendingCountItem.pending_pkm} />
              <PendingCard type="PERSEKOT" total={pendingCountItem.pending_persekot} />
            </>
          ) : (
            <div className="loading position-relative mt-4" />
          )}
        </Row>
      </Colxx>
    </Row>
  );
};

const mapStateToProps = ({ dashboard }) => {
  const { pendingCountItem, loading, error } = dashboard;
  return { pendingCountItem, loading, error };
}
export default injectIntl(
  connect(mapStateToProps, {
    getPendingCountAction: getPendingCount,
  })(DashboardView)
);
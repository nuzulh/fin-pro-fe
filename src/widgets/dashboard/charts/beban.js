import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Colxx } from "components/common/CustomBootstrap";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  UncontrolledDropdown
} from "reactstrap";
import { getChartByYear, getChartOnYear } from "redux/actions";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { NotificationManager } from "components/common/react-notifications";
import { BarChart } from "components/charts";

const BebanCharts = ({
  year,
  getChartByYearAction,
  byYearLabels,
  byYearDatasets,
  getChartOnYearAction,
  onYearLabels,
  onYearDatasets,
  loading,
  error,
}) => {
  const [showMonthly, setShowMonthly] = useState(true);
  const [rangeYear, setRangeYear] = useState({
    from: year - 4,
    to: year,
  });

  useEffect(() => {
    if (showMonthly) {
      getChartOnYearAction("beban", year);
    } else {
      getChartByYearAction("beban", rangeYear.from, rangeYear.to);
    }
  }, [showMonthly, year]);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
  }, [error]);

  return (
    <>
      <Colxx xxs="12" className="mb-4">
        <Card className="h-100">
          <CardBody>
            <CardTitle className="d-flex align-items-center justify-content-between">
              <div className="d-flex">
                <Button
                  color={showMonthly ? "primary" : ""}
                  onClick={() => setShowMonthly(true)}
                >
                  Bulanan
                </Button>
                <Button
                  color={showMonthly ? "" : "primary"}
                  onClick={() => setShowMonthly(false)}
                >
                  Tahunan
                </Button>
              </div>
              {!showMonthly && (
                <div className="w-30 d-flex">
                  <Input
                    className="mx-2 rounded-lg"
                    type="number"
                    value={rangeYear.from}
                    onChange={(e) => {
                      if (e.target.value <= rangeYear.to) {
                        setRangeYear({ ...rangeYear, from: e.target.value });
                      }
                    }}
                  />
                  -
                  <Input
                    className="mx-2 rounded-lg"
                    type="number"
                    value={rangeYear.to}
                    onChange={(e) => {
                      if (e.target.value >= rangeYear.from) {
                        setRangeYear({ ...rangeYear, to: e.target.value });
                      }
                    }}
                  />
                  <Button
                    size="xs"
                    color="secondary btn-shadow"
                    className="align-self-center iconsminds-magnifi-glass"
                    onClick={() => getChartByYearAction("beban", rangeYear.from, rangeYear.to)}
                  >
                  </Button>
                </div>
              )}
            </CardTitle>
            <div className="chart-container">
              {loading ? (
                <BarChart data={{
                  labels: showMonthly ? onYearLabels : byYearLabels,
                  datasets: showMonthly ? onYearDatasets : byYearDatasets,
                }} />
              ) : (
                <div className="loading position-relative" />
              )}
            </div>
          </CardBody>
        </Card>
      </Colxx>
    </>
  );
};

const mapStateToProps = ({ chart }) => {
  const { byYearLabels, onYearLabels, onYearDatasets, byYearDatasets, loading, error } = chart;
  return { byYearLabels, onYearLabels, onYearDatasets, byYearDatasets, loading, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    getChartByYearAction: getChartByYear,
    getChartOnYearAction: getChartOnYear,
  })(BebanCharts)
);
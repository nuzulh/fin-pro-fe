import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const Persekot = React.lazy(() => import("../persekot"));
const PersekotReport = React.lazy(() => import("../persekot/report"));
const Sppd = React.lazy(() => import("../sppd"));
const FeeProject = React.lazy(() => import('../feeProject'));

const BiayaOperasionalRoutes = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/persekot`} />
      <Route
        path={`${match.url}/persekot`}
        render={(props) => <Persekot {...props} />}
      />
      <Route
        path={`${match.url}/laporan-persekot`}
        render={(props) => <PersekotReport {...props} />}
      />
      <Route
        path={`${match.url}/sppd`}
        render={(props) => <Sppd {...props} />}
      />
      <Route
        path={`${match.url}/fee-project`}
        render={(props) => <FeeProject {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense >
);

export default BiayaOperasionalRoutes;

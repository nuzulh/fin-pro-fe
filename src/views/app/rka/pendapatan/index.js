import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const PendapatanView = React.lazy(() => import("./view"));
const PendapatanAdd = React.lazy(() => import("./add"));
const PendapatanDetail = React.lazy(() => import("./detail"));

const Pendapatan = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
      <Route
        path={`${match.url}/view`}
        render={(props) => <PendapatanView {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={(props) => <PendapatanAdd {...props} />}
      />
      <Route
        path={`${match.url}/detail`}
        render={(props) => <PendapatanDetail {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);

export default Pendapatan;

import React, { Suspense } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";

const RkaView = React.lazy(() => import("./view"));
const RkaAdd = React.lazy(() => import("./add"));
const RkaImport = React.lazy(() => import("./import"));
const Pendapatan = React.lazy(() => import('./pendapatan'));
const BebanRoutes = React.lazy(() => import("./routes/beban"));

const RkaRoutes = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
      <Route
        path={`${match.url}/view`}
        render={(props) => <RkaView {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={(props) => <RkaAdd {...props} />}
      />
      <Route
        path={`${match.url}/import`}
        render={(props) => <RkaImport {...props} />}
      />
      <Route
        path={`${match.url}/pendapatan`}
        render={(props) => <Pendapatan {...props} />}
      />
      <Route
        path={`${match.url}/beban`}
        render={(props) => <BebanRoutes {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense >
);

export default RkaRoutes;

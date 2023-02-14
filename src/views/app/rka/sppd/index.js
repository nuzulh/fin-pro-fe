import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const SppdView = React.lazy(() => import("./view"));
const SppdAdd = React.lazy(() => import("./add"));
const SppdDetail = React.lazy(() => import("./detail"));

const Sppd = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
      <Route
        path={`${match.url}/view`}
        render={(props) => <SppdView {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={(props) => <SppdAdd {...props} />}
      />
      <Route
        path={`${match.url}/detail`}
        render={(props) => <SppdDetail {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);

export default Sppd;

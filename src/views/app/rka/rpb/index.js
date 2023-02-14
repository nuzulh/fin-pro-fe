import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const RpbView = React.lazy(() => import("./view"));
const RpbAdd = React.lazy(() => import("./add"));
const RpbDetail = React.lazy(() => import("./detail"));
const RpbImport = React.lazy(() => import("./import"));

const Rpb = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
      <Route
        path={`${match.url}/view`}
        render={(props) => <RpbView {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={(props) => <RpbAdd {...props} />}
      />
      <Route
        path={`${match.url}/detail`}
        render={(props) => <RpbDetail {...props} />}
      />
      <Route
        path={`${match.url}/import`}
        render={(props) => <RpbImport {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);

export default Rpb;

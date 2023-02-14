import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const RabView = React.lazy(() => import("./view"));
const RabAdd = React.lazy(() => import("./add"));
const RabDetail = React.lazy(() => import("./detail"));
const RabImport = React.lazy(() => import("./import"));

const Rab = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
      <Route
        path={`${match.url}/view`}
        render={(props) => <RabView {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={(props) => <RabAdd {...props} />}
      />
      <Route
        path={`${match.url}/detail`}
        render={(props) => <RabDetail {...props} />}
      />
      <Route
        path={`${match.url}/import`}
        render={(props) => <RabImport {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);

export default Rab;

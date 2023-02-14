import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const FeeProjectView = React.lazy(() => import("./view"));
const FeeProjectAdd = React.lazy(() => import("./add"));
const FeeProjectDetail = React.lazy(() => import("./detail"));

const FeeProject = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
      <Route
        path={`${match.url}/view`}
        render={(props) => <FeeProjectView {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={(props) => <FeeProjectAdd {...props} />}
      />
      <Route
        path={`${match.url}/detail`}
        render={(props) => <FeeProjectDetail {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);

export default FeeProject;

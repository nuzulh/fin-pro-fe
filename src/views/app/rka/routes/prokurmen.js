import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const Rpb = React.lazy(() => import("../rpb"));

const ProkurmenRoutes = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/rpb`} />
      <Route
        path={`${match.url}/rpb`}
        render={(props) => <Rpb {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense >
);

export default ProkurmenRoutes;

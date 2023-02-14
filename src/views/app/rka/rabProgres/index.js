import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const RabProgresView = React.lazy(() => import("./view"));

const RabProgres = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
      <Route
        path={`${match.url}/view`}
        render={(props) => <RabProgresView {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);

export default RabProgres;

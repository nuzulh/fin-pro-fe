import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const PersekotView = React.lazy(() => import("./view"));
const PersekotAdd = React.lazy(() => import("./add"));
const PersekotDetail = React.lazy(() => import("./detail"));
const PersekotImport = React.lazy(() => import("./import"));

const Persekot = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
      <Route
        path={`${match.url}/view`}
        render={(props) => <PersekotView {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={(props) => <PersekotAdd {...props} />}
      />
      <Route
        path={`${match.url}/detail`}
        render={(props) => <PersekotDetail {...props} />}
      />
      <Route
        path={`${match.url}/import`}
        render={(props) => <PersekotImport {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);

export default Persekot;

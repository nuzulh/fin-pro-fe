import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const DashboardView = React.lazy(() => import("./view"));
const RabPendingList = React.lazy(() => import("./pending/RabPendingList"));
const RpbPendingList = React.lazy(() => import("./pending/RpbPendingList"));
const PersekotPendingList = React.lazy(() => import("./pending/PersekotPendingList"));
const TargetSetting = React.lazy(() => import("./target"));

const Dashboard = ({ match }) => {
  return (
    <Suspense fallback={<div className="loading" />}>
      <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
        <Route
          path={`${match.url}/view`}
          render={(props) => <DashboardView {...props} />}
        />
        <Route
          path={`${match.url}/rab-pending`}
          render={(props) => <RabPendingList {...props} />}
        />
        <Route
          path={`${match.url}/rpb-pending`}
          render={(props) => <RpbPendingList {...props} />}
        />
        <Route
          path={`${match.url}/persekot-pending`}
          render={(props) => <PersekotPendingList {...props} />}
        />
        <Route
          path={`${match.url}/target`}
          render={(props) => <TargetSetting {...props} />}
        />
        <Redirect to="/error" />
      </Switch>
    </Suspense>
  );
};
export default Dashboard;

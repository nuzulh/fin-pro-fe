import React, { Suspense } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import AppLayout from "layout/AppLayout";
import { ProtectedRoute } from "helpers/authHelper";
import { UserRole } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";

const Dashboard = React.lazy(() => import("./dashboard"));
const RkaRoutes = React.lazy(() => import("./rka"));

const App = ({ match }) => {
  const user = getCurrentUser();
  return (
    <AppLayout>
      <div className="dashboard-wrapper">
        <Suspense fallback={<div className="loading" />}>
          <Switch>
            {user.role === 0 ? (
              <Redirect
                exact
                from={`${match.url}/`}
                to={`${match.url}/dashboard`}
              />
            ) : (
              <Redirect exact from={`${match.url}/`} to={`${match.url}/rka`} />
            )}
            <ProtectedRoute
              path={`${match.url}/dashboard`}
              roles={[UserRole.DIREKTUR]}
              component={(props) => <Dashboard {...props} />}
            />
            <ProtectedRoute
              path={`${match.url}/rka`}
              roles={[UserRole.STAFF, UserRole.DIREKTUR]}
              component={(props) => <RkaRoutes {...props} />}
            />
            <Redirect to="/error" />
          </Switch>
        </Suspense>
      </div>
    </AppLayout>
  );
};

const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(App));

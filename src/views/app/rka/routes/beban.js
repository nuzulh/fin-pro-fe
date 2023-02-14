import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const Rab = React.lazy(() => import("../rab"));
const RabProgres = React.lazy(() => import("../rabProgres"));
const BiayaOperasionalRoutes = React.lazy(() => import("./biayaOperasional"));
const ProkurmenRoutes = React.lazy(() => import("./prokurmen"));

const BebanRoutes = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/rab`} />
      <Route
        path={`${match.url}/rab`}
        render={(props) => <Rab {...props} />}
      />
      <Route
        path={`${match.url}/rab-progres`}
        render={(props) => <RabProgres {...props} />}
      />
      <Route
        path={`${match.url}/biaya-operasional`}
        render={(props) => <BiayaOperasionalRoutes {...props} />}
      />
      <Route
        path={`${match.url}/prokurmen`}
        render={(props) => <ProkurmenRoutes {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense >
);

export default BebanRoutes;

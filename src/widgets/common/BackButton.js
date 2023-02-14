import React from "react";
import { Button } from "reactstrap";

const BackButton = ({ history }) => (
  <Button color="primary btn-shadow mb-2" onClick={() => history.goBack()}>
    <i className="iconsminds-to-left font-weight-bold" /> Kembali
  </Button>
);

export default React.memo(BackButton);

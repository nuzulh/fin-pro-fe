import React from "react";
import { Button } from "reactstrap";

const ApproveButton = ({ disabled, onClick, className }) => {
  return (
    <Button
      color="primary btn-shadow"
      className={className}
      size="lg"
      disabled={disabled}
      onClick={onClick}
    >
      <i className="simple-icon-check mr-2 font-weight-bold" />
      Setujui
    </Button>
  );
};

export default React.memo(ApproveButton);
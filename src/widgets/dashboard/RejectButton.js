import React from "react";
import { Button } from "reactstrap";

const RejectButton = ({ disabled, onClick, className }) => {
  return (
    <Button
      outline
      className={className}
      color="primary btn-shadow"
      size="lg"
      disabled={disabled}
      onClick={onClick}
    >
      <i className="simple-icon-close mr-2 font-weight-bold" />
      Tolak
    </Button>
  );
};

export default React.memo(RejectButton);
import React from "react";

const EntryButton = ({ label, onClick }) => (
  <p
    className="c-pointer mb-1 font-italic font-weight-bold text-primary text-small w-10 w-xs-100"
    onClick={onClick}
  >
    {label}
  </p>
);

export default React.memo(EntryButton);
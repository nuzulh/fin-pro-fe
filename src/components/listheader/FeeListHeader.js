import React from "react";

const FeeListHeader = () => {
  return (
    <div className="d-none d-md-flex mb-2 w-100">
      <div className="d-flex flex-grow-1 mx-4 min-width-zero">
        <div className="align-self-center w-100 d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
          <p className="mb-1 text-muted text-small w-15 w-xs-100">
            No. Fee Project
          </p>
          <p className="mb-1 text-muted text-small w-20 w-xs-100">
            Judul Fee Project
          </p>
          <p className="mb-1 text-muted text-small w-15 w-xs-100">
            Nilai Fee Project
          </p>
          <p className="mb-1 text-muted text-small w-10 w-xs-100">Pengaju</p>
          <p className="mb-1 text-muted text-small w-10 w-xs-100">Dibuat</p>
          <p className="mb-1 text-muted text-small w-10 w-xs-100">Status</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FeeListHeader);

import React from "react";

const RkaListHeader = () => {
  return (
    <div className="d-none d-md-flex mb-2 w-100">
      <div className="d-flex flex-grow-1 mx-4 min-width-zero">
        <div className="align-self-center w-100 d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
          <p className="mb-1 text-muted text-small w-30 w-xs-100">
            Kode Aktivitas
          </p>
          <p className="mb-1 text-muted text-small w-25 w-xs-100">Unit Kerja</p>
          <p className="mb-1 text-muted text-small w-25 w-xs-100">
            Estimasi Pendapatan
          </p>
          <p className="mb-1 text-muted text-small w-20 w-xs-100">Dibuat</p>
          <div className="mx-2" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(RkaListHeader);

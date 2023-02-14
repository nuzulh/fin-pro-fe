import React from "react";

const PendapatanListHeader = () => {
  return (
    <div className="d-none d-md-flex mb-2 w-100">
      <div className="d-flex flex-grow-1 mx-4 min-width-zero">
        <div className="align-self-center w-100 d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
          <p className="mb-1 text-muted text-small w-15 w-xs-100">
            No. Pekerjaan
          </p>
          <p className="mb-1 text-muted text-small w-20 w-xs-100">
            Judul Pekerjaan
          </p>
          <p className="mb-1 text-muted text-small w-15 w-xs-100">
            Nilai RAB
          </p>
          <p className="mb-1 text-muted text-small w-15 w-xs-100">
            Nilai Penawaran (Incl. PPN)
          </p>
          <p className="mb-1 text-muted text-small w-10 w-xs-100">
            Nilai Kontrak
          </p>
          <p className="mb-1 text-muted text-small w-10 w-xs-100">
            Nilai BA
          </p>
          <p className="mb-1 text-muted text-small w-10 w-xs-100">
            Nilai Invoice
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PendapatanListHeader);

import { NotificationManager } from "components/common/react-notifications";
import { adminRoot } from "constants/defaultValues";
import { getCsvTemplate, getImportTemplate } from "helpers/Utils";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { importCsv } from "redux/actions";

const ImportModal = ({
  isOpen,
  toggle,
  onClose,
  label,
  type,
  importCsvAction,
  importItems,
  loading,
  error,
  redirectTo,
}) => {
  const history = useHistory();
  const [file, setFile] = useState(null);
  const [hover, setHover] = useState(false);

  const handleImport = (e) => {
    const tempFile = e.target.files[0];
    if (tempFile && tempFile.type === "text/csv") {
      setFile(e.target.files[0]);
    } else {
      NotificationManager.warning("Hanya dapat mengunggah file CSV!", "Peringatan", 3000, null, null, "");
    }
  }

  useEffect(() => {
    if (importItems) history.push(redirectTo, { importItems });
  }, [importItems]);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
  }, [error])

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      centered
      className="shadow-none"
      toggle={toggle}
    >
      <ModalHeader className="justify-content-center w-100">
        {label}
      </ModalHeader>
      <ModalBody>
        <FormGroup
          className="mb-4"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            height: "12rem",
            background: "#FFF3E7",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            border: hover ? "2px dashed #F37921" : "none",
          }}
        >
          <Input
            type="file"
            name="import_file"
            accept=".csv"
            className="position-absolute h-100 w-100"
            onChange={handleImport}
            style={{
              opacity: 0,
              cursor: hover ? "pointer" : "unset",
            }}
          />
          <div
            className="position-absolute d-flex flex-column align-items-center"
            style={{
              pointerEvents: "none",
            }}
          >
            {loading ? (
              <>
                <i className={`iconsminds-${file ? "yes" : "upload-1"} text-large text-primary`} />
                <Label className="h6 mt-2">
                  {file ? file.name : "No file chosen"}
                </Label>
                <p className="text-muted">
                  Drag and drop file .csv anda di sini atau klik area ini
                  untuk mengimpor file dari komputer Anda.
                </p>
              </>
            ) : (
              <>
                <div className="loading position-absolute mt-4" />
                <p className="text-muted">
                  Sedang menvalidasi data.
                  Mohon menunggu...
                </p>
              </>
            )}
          </div>
        </FormGroup>
        <div className="d-flex justify-content-between">
          <Button
            outline
            color="success"
            onClick={() => getCsvTemplate(type)}
          >
            <i className="iconsminds-download-1 font-weight-bold mr-2" />
            Unduh template
          </Button>
          <div>
            <Button
              outline
              color="primary mr-2"
              onClick={() => {
                setFile(null);
                onClose();
              }}
            >
              Batal
            </Button>
            <Button
              color="primary btn-shadow"
              disabled={file === null || !loading}
              onClick={() => importCsvAction(type, file)}
            >
              Import
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal >
  );
};

const mapStateToProps = ({ csvImport }) => {
  const { importItems, loading, error } = csvImport;
  return { importItems, loading, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    importCsvAction: importCsv,
  })(ImportModal)
);

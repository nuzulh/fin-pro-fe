import { NotificationManager } from "components/common/react-notifications";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { entryGetCsvTemplate, entryImportCsv, getCategoryList } from "redux/actions";
import Papa from "papaparse";

const EntryImportModal = ({
  isOpen,
  toggle,
  onClose,
  label,
  templateHeaders,
  type,
  onUploadedItems,
  entryGetCsvTemplateAction,
  entryImportCsvAction,
  entryHeaders,
  entryItems,
  entryTemplate,
  loading,
  error,
  getCategoryListAction,
  categoryLoading,
}) => {
  const [file, setFile] = useState(null);
  const [hover, setHover] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const templateBtnRef = useRef();

  const handleImport = (e) => {
    const tempFile = e.target.files[0];
    if (tempFile && tempFile.type === "text/csv") {
      setFile(e.target.files[0]);
      Papa.parse(tempFile, {
        header: true,
        delimiter: ";",
        skipEmptyLines: true,
        complete: function (result) {
          entryImportCsvAction(result.data);
        }
      })
    } else {
      NotificationManager.warning("Hanya dapat mengunggah file CSV!", "Peringatan", 3000, null, null, "");
    }
  };

  useEffect(() => {
    if (entryItems) {
      if (type === "PERSEKOT" || type === "PKM") {
        getCategoryListAction(type);
      }
    }
  }, [entryItems]);

  useEffect(() => {
    if (entryTemplate && isClicked) {
      templateBtnRef.current.link.click();
      setIsClicked(false);
    }
  }, [entryTemplate, isClicked]);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
  }, [error]);

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
            {loading && categoryLoading ? (
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
            onClick={() => {
              entryGetCsvTemplateAction(templateHeaders);
              setIsClicked(true);
            }}
          >
            <i className="iconsminds-download-1 font-weight-bold mr-2" />
            Unduh template
          </Button>
          {entryTemplate && (
            <CSVLink
              ref={templateBtnRef}
              hidden={true}
              headers={entryHeaders}
              data={entryTemplate}
              separator=";"
              filename={`${type}_IMPORT_TEMPLATE.csv`}
            />
          )}
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
              disabled={file === null || !loading || !categoryLoading}
              onClick={() => {
                if (entryItems) {
                  onUploadedItems(entryItems);
                  onClose();
                }
              }}
            >
              Import
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = ({ csvImport, category }) => {
  const { entryHeaders, entryItems, entryTemplate, loading, error } = csvImport;
  const categoryItems = category.categoryItems;
  const categoryLoading = category.loading;
  const categoryError = category.error;
  return {
    entryHeaders,
    entryItems,
    entryTemplate,
    loading,
    error,
    categoryItems,
    categoryLoading,
    categoryError,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    entryGetCsvTemplateAction: entryGetCsvTemplate,
    entryImportCsvAction: entryImportCsv,
    getCategoryListAction: getCategoryList,
  })(EntryImportModal)
);

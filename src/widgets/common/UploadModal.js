import axios from "axios";
import { Separator } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import { servicePath, servicePathFiles } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";
import React, { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import {
  Button,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalHeader
} from "reactstrap";
import { uploadFiles, getFiles, deleteFile } from "redux/upload/actions";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import "assets/pdf-viewer.css";

const UploadModal = ({
  isOpen,
  toggle,
  label,
  subLabel,
  fileTypes,
  type,
  itemId,
  subItemId,
  onClose,
  getFilesAction,
  uploadFilesAction,
  deleteFileAction,
  paths,
  loading,
  error,
}) => {
  const user = getCurrentUser();
  const [hover, setHover] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [img, setImg] = useState(null);
  const [pdfLink, setPdfLink] = useState(null);

  const handleUpload = (e) => {
    const files = Array.prototype.slice.call(e.target.files);
    setUploadedFiles([...files, ...uploadedFiles]);
  };

  const handleDelete = (fileName) => {
    setUploadedFiles([...uploadedFiles.filter((file) => {
      if (file.name) {
        return file.name !== fileName;
      } else {
        return file !== fileName;
      }
    })]);
    deleteFileAction(type, itemId, subItemId, fileName);
  };

  const save = () => {
    const data = new FormData();
    uploadedFiles.map((file) => {
      if (file.name) {
        data.append("files", file);
      }
    });
    uploadFilesAction(data, type, itemId, subItemId);
  };

  const showMedia = async (file) => {
    if (file.name) {
      if (file.type === "application/pdf") {
        setPdfLink(file);
      } else {
        setImg(file);
      }
    } else {
      if (file.endsWith(".pdf")) {
        setPdfLink(`${servicePathFiles}/${type}/${itemId}/${subItemId}/${file}`);
      } else {
        await axios
          .get(
            `${servicePathFiles}/${type}/${itemId}/${subItemId}/${file}`,
            {
              responseType: "blob",
              headers: { "X-Secured-With": user.token },
            }
          )
          .then((res) => {
            setImg(res.data);
          });
      }
    }
  };

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  useEffect(() => {
    if (subItemId && isOpen) {
      getFilesAction(type, itemId, subItemId);
    }
  }, [subItemId, isOpen]);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
    if (paths) {
      setUploadedFiles(paths);
      if (paths[0] && paths[0].includes("**")) {
        setUploadedFiles([...uploadedFiles.filter((x) => typeof (x) === "string"), ...paths.map((x) => x.replace("**", ""))]);
        NotificationManager.success("Berhasil mengunggah file", "Berhasil", 3000, null, null, "");
      }
    }
  }, [error, paths]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered
        size="lg"
        className="shadow-none"
      >
        <ModalHeader className="pt-4 pb-2">
          <p className="font-weight-bold h5">{label}</p>
          <p>{subLabel}</p>
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
              outline: hover ? "2px dashed #F37921" : "none",
            }}
          >
            <Input
              type="file"
              multiple
              name="files"
              accept=".jpg, .png, .pdf"
              className="position-absolute h-100 w-100"
              onChange={handleUpload}
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
                  <i className="iconsminds-upload-1 text-large text-primary" />
                  <p
                    className="text-muted text-center"
                    style={{
                      paddingLeft: "4rem",
                      paddingRight: "4rem",
                    }}
                  >
                    Drag and drop file anda di sini atau klik pada area ini
                    untuk mengunggah file. Tipe file yang dapat diunggah:{" "}
                    {fileTypes.join(", ")}
                  </p>
                </>
              ) : (
                <div className="loading" />
              )}
            </div>
          </FormGroup>
          <div className="d-flex flex-items-center justify-content-end">
            <Button
              outline
              color="primary mr-2"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              color="primary btn-shadow"
              onClick={save}
            >
              Simpan
            </Button>
          </div>
          <Separator className="my-4" />
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="m-0 d-flex align-items-center justify-content-between"
              style={{
                backgroundColor: (index + 1) % 2 === 0 ? "#FFF3E7" : "",
              }}
            >
              <p
                className="font-weight-bold m-0 px-3 py-2 c-pointer"
                onClick={() => showMedia(file)}
              >
                {file.name ? file.name : file}
              </p>
              <i
                onClick={() => handleDelete(file.name ? file.name : file)}
                className="font-weight-bold simple-icon-trash mr-3 p-2"
                style={{
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              />
            </div>
          ))}
        </ModalBody>
      </Modal>
      <Modal
        isOpen={pdfLink !== null}
        centered
        toggle={() => setPdfLink(null)}
        className="shadow-none modal-lg"
      >
        <Document
          file={pdfLink}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="loading" />}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <div className="d-flex justify-content-between p-3">
          <p className="float-left my-auto">
            Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
          </p>
          <div>
            <Button
              outline
              color="primary"
              className="mr-2 btn-shadow"
              onClick={() => window.open(pdfLink, "_blank")}
            >
              <i className="iconsminds-data-download" />
            </Button>
            <Button
              color="primary"
              className="mr-2 btn-shadow"
              disabled={pageNumber <= 1}
              onClick={previousPage}
            >
              Previous
            </Button>
            <Button
              color="primary"
              className="btn-shadow"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={img !== null}
        centered
        toggle={() => setImg(null)}
        className="shadow-none modal-lg"
      >
        <TransformWrapper
          defaultScale={1}
          defaultPositionX={1}
          defaultPositionY={1}
        >
          <TransformComponent>
            <img
              src={img ? URL.createObjectURL(img) : ""}
              alt="img"
              style={{
                width: "100%",
              }}
            />
          </TransformComponent>
        </TransformWrapper>
      </Modal>
    </>
  )
};

const mapStateToProps = ({ upload }) => {
  const { paths, loading, error } = upload;
  return { paths, loading, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    getFilesAction: getFiles,
    uploadFilesAction: uploadFiles,
    deleteFileAction: deleteFile,
  })(UploadModal)
);

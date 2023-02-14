import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Row } from "reactstrap";
import BackButton from "widgets/common/BackButton";
import RkaListView from "widgets/rka/ListView";
import { generateCsv, addRkaItem } from "redux/actions";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { NotificationManager } from "components/common/react-notifications";

const RkaImport = ({
  match,
  generateCsvAction,
  allImportItems,
  csvFile,
  csvKeys,
  error,
  addRkaItemAction,
  rkaLoading,
  rkaError,
}) => {
  const history = useHistory();
  const downloadCsv = useRef();
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (csvFile && isClicked) {
      downloadCsv.current.link.click();
      setIsClicked(false);
    };
    if (allImportItems === null) {
      history.goBack();
    }
  }, [csvFile, allImportItems]);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
    if (rkaError !== "") {
      NotificationManager.error(rkaError, "Gagal", 3000, null, null, "");
    }
  }, [error, rkaError]);

  return (
    <Row>
      <Colxx xxs="12">
        <Row>
          <Colxx xxs="12">
            <BackButton history={history} />
          </Colxx>
          <Colxx xxs="12" className="d-flex justify-content-between align-items-start">
            <div>
              <BreadcrumbContainer heading="menu.rka-import" match={match} />
            </div>
            <div>
              {csvFile && (
                <CSVLink
                  ref={downloadCsv}
                  hidden={true}
                  headers={csvKeys}
                  data={csvFile}
                  separator=";"
                  filename="RKA_IMPORT_CHECKED.csv"
                />
              )}
              <Button
                outline
                size="lg"
                color="primary mr-2"
                onClick={() => {
                  generateCsvAction("rka", csvKeys, allImportItems);
                  setIsClicked(true);
                }}
              >
                <i className="iconsminds-data-download mr-1" />
                Unduh CSV
              </Button>
              <Button
                color="primary btn-shadow mr-2"
                size="lg"
                disabled={!rkaLoading}
                onClick={() => addRkaItemAction(allImportItems, history)}
              >
                Simpan
              </Button>
            </div>
          </Colxx>
        </Row>
        <Separator className="mb-4" />
        <RkaListView importItems={allImportItems} />
      </Colxx>
    </Row>
  );
};

const mapStateToProps = ({ csvImport, rka }) => {
  const { allImportItems, csvKeys, csvFile, loading, error } = csvImport;
  const rkaItems = rka.rkaItems;
  const rkaLoading = rka.loading;
  const rkaError = rka.error;
  return { allImportItems, csvKeys, csvFile, loading, error, rkaItems, rkaLoading, rkaError };
};
export default injectIntl(
  connect(mapStateToProps, {
    generateCsvAction: generateCsv,
    addRkaItemAction: addRkaItem,
  })(RkaImport)
);
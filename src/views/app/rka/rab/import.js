import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Row } from "reactstrap";
import BackButton from "widgets/common/BackButton";
import RkaListView from "widgets/rab/ListView";
import { generateCsv, addRabItem } from "redux/actions";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { NotificationManager } from "components/common/react-notifications";

const RabImport = ({
  match,
  generateCsvAction,
  allImportItems,
  csvFile,
  csvKeys,
  error,
  addRabItemAction,
  rabLoading,
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
  }, [error]);

  return (
    <Row>
      <Colxx xxs="12">
        <Row>
          <Colxx xxs="12">
            <BackButton history={history} />
          </Colxx>
          <Colxx xxs="12" className="d-flex justify-content-between align-items-start">
            <div>
              <BreadcrumbContainer heading="menu.rab-import" match={match} />
            </div>
            <div>
              {csvFile && (
                <CSVLink
                  ref={downloadCsv}
                  hidden={true}
                  headers={csvKeys.map((x) => ({ label: x, key: x }))}
                  data={csvFile}
                  separator=";"
                  filename="RAB_IMPORT_CHECKED.csv"
                />
              )}
              <Button
                outline
                size="lg"
                color="primary mr-2"
                onClick={() => {
                  generateCsvAction("rab", csvKeys, allImportItems);
                  setIsClicked(true);
                }}
              >
                <i className="iconsminds-data-download mr-1" />
                Unduh CSV
              </Button>
              <Button
                color="primary btn-shadow mr-2"
                size="lg"
                disabled={!rabLoading}
                onClick={() => addRabItemAction(allImportItems, history)}
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

const mapStateToProps = ({ csvImport, rab }) => {
  const { allImportItems, csvKeys, csvFile, loading, error } = csvImport;
  const rabItems = rab.rabItems;
  const rabLoading = rab.loading;
  const rabError = rab.error;
  return { allImportItems, csvKeys, csvFile, loading, error, rabItems, rabLoading, rabError };
};
export default injectIntl(
  connect(mapStateToProps, {
    generateCsvAction: generateCsv,
    addRabItemAction: addRabItem,
  })(RabImport)
);
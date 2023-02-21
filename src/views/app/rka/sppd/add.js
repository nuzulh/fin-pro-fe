import { Colxx, Separator } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useState } from "react";
import { useEffect } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Row } from "reactstrap";
import { addSppdItem, editSppdItem } from "redux/actions";
import BackButton from "widgets/common/BackButton";
import EntryImportModal from "widgets/common/EntryImportModal";
import SppdForm from "widgets/sppd/InputForm";

const SppdAdd = ({ match, editSppdItemAction, loading, error }) => {
  const history = useHistory();
  const [showImport, setShowImport] = useState(false);
  const [uploadedItems, setUploadedItems] = useState(null);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
  }, [error]);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <BackButton history={history} />
        </Colxx>
        <Colxx xxs="12">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <BreadcrumbContainer heading="menu.sppd-add" match={match} />
            </div>
            <Button
              color="primary btn-shadow"
              size="lg"
              onClick={() => setShowImport(true)}
            >
              Import
            </Button>
          </div>
          <Separator className="mb-4" />
        </Colxx>
        <Colxx xss="12">
          <SppdForm
            onSubmit={(item) => {
              editSppdItemAction(item.sppd_id, item, true, history);
            }}
            uploadedItems={uploadedItems}
            loading2={loading}
          />
        </Colxx>
      </Row>
      <EntryImportModal
        isOpen={showImport}
        toggle={() => setShowImport(!showImport)}
        onClose={() => setShowImport(false)}
        label="Impor file SPPD"
        type="SPPD"
        onUploadedItems={(val) => setUploadedItems(val)}
        templateHeaders={[
          "Unit",
          "Tgl. Berangkat",
          "Tgl. Pulang",
          "Nilai",
          "Dept./PIC",
        ]}
      />
    </>
  )
};

const mapStateToProps = ({ sppd }) => {
  const { sppdItems, loading, error } = sppd;
  return { sppdItems, loading, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    addSppdItemAction: addSppdItem,
    editSppdItemAction: editSppdItem,
  })(SppdAdd)
);
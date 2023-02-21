import { Colxx, Separator } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useState } from "react";
import { useEffect } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Row } from "reactstrap";
import { addFeeItem, editFeeItem } from "redux/actions";
import BackButton from "widgets/common/BackButton";
import EntryImportModal from "widgets/common/EntryImportModal";
import FeeForm from "widgets/feeProject/InputForm";

const FeeAdd = ({ match, editFeeItemAction, loading, error }) => {
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
              <BreadcrumbContainer heading="menu.fee-project-add" match={match} />
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
          <FeeForm
            onSubmit={(item) => {
              editFeeItemAction(item.fee_project_id, item, true, history);
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
        label="Impor file Fee Project"
        type="FEE_PROJECT"
        onUploadedItems={(val) => setUploadedItems(val)}
        templateHeaders={[
          "Unit",
          "No. Memo",
          "Tgl. Berangkat",
          "Tgl. Pulang",
          "Nilai",
          "Dept./PIC",
        ]}
      />
    </>
  )
};

const mapStateToProps = ({ fee }) => {
  const { feeItems, loading, error } = fee;
  return { feeItems, loading, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    addFeeItemAction: addFeeItem,
    editFeeItemAction: editFeeItem,
  })(FeeAdd)
);
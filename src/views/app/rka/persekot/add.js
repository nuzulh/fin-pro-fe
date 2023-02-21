import { Colxx, Separator } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Row } from "reactstrap";
import { addPersekotItem } from "redux/actions";
import BackButton from "widgets/common/BackButton";
import EntryImportModal from "widgets/common/EntryImportModal";
import PersekotForm from "widgets/persekot/InputForm";

const PersekotAdd = ({ match, addPersekotItemAction, error }) => {
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
              <BreadcrumbContainer heading="menu.persekot-add" match={match} />
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
          <PersekotForm
            onSubmit={(item) => {
              let valid = true;
              item.persekot_detail.forEach((x) => x.category_id === -1 ? valid = false : null);
              if (valid) {
                addPersekotItemAction({
                  ...item,
                  persekot_draft_id: item.persekot_id,
                }, history);
              } else {
                NotificationManager.warning("Kategori harus diisi!", "Peringatan", 3000, null, null, "");
              }
            }}
            uploadedItems={uploadedItems}
          />
        </Colxx>
      </Row>
      <EntryImportModal
        isOpen={showImport}
        toggle={() => setShowImport(!showImport)}
        onClose={() => setShowImport(false)}
        label="Impor file Persekot"
        type="PERSEKOT"
        onUploadedItems={(val) => setUploadedItems(val)}
        templateHeaders={[
          "Uraian",
          "Kategori",
          "Nilai",
        ]}
      />
    </>
  )
};

const mapStateToProps = ({ persekot }) => {
  const { persekotItems, loading, error } = persekot;
  return { persekotItems, loading, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    addPersekotItemAction: addPersekotItem,
  })(PersekotAdd)
);
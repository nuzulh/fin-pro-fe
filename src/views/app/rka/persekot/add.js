import { Colxx, Separator } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import { adminRoot } from "constants/defaultValues";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Row } from "reactstrap";
import { addPersekotItem, editPersekotItem } from "redux/actions";
import BackButton from "widgets/common/BackButton";
import ImportModal from "widgets/common/ImportModal";
import PersekotForm from "widgets/persekot/InputForm";

const PersekotAdd = ({ match, addPersekotItemAction, editPersekotItemAction, loading, error }) => {
  const history = useHistory();
  const [showImport, setShowImport] = useState(false);

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
                if (item.persekot_id) {
                  addPersekotItemAction(item, history);
                } else {
                  addPersekotItemAction(item, history);
                }
              } else {
                NotificationManager.warning("Kategori harus diisi!", "Peringatan", 3000, null, null, "");
              }
            }}
            loading2={loading}
          />
        </Colxx>
      </Row>
      <ImportModal
        isOpen={showImport}
        toggle={() => setShowImport(!showImport)}
        onClose={() => setShowImport(false)}
        label="Impor file Persekot"
        type="persekot"
        redirectTo={`${adminRoot}/rka/beban/biaya-operasional/persekot/import`}
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
    editPersekotItemAction: editPersekotItem,
  })(PersekotAdd)
);
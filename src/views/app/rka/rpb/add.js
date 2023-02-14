import { Colxx, Separator } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import { adminRoot } from "constants/defaultValues";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Row } from "reactstrap";
import { addRpbItem } from "redux/actions";
import BackButton from "widgets/common/BackButton";
import ImportModal from "widgets/common/ImportModal";
import RpbForm from "widgets/rpb/InputForm";

const RpbAdd = ({ match, addRpbItemAction, loading, error }) => {
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
              <BreadcrumbContainer heading="menu.rpb-add" match={match} />
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
          <RpbForm
            onSubmit={(item) => {
              let valid = true;
              item.pkm_detail.forEach((x) => x.category_id === -1 ? valid = false : null);
              if (valid) {
                if (item.pkm_id) {
                  addRpbItemAction(item, history);
                } else {
                  addRpbItemAction(item, history);
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
        label="Impor file RPB"
        type="pkm"
        redirectTo={`${adminRoot}/rka/beban/prokurmen/rpb/import`}
      />
    </>
  )
};

const mapStateToProps = ({ rpb }) => {
  const { rpbItems, loading, error } = rpb;
  return { rpbItems, loading, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    addRpbItemAction: addRpbItem,
  })(RpbAdd)
);
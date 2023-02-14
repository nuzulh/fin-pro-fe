import { Colxx, Separator } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import { adminRoot } from "constants/defaultValues";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Row } from "reactstrap";
import { addRkaItem } from "redux/actions";
import BackButton from "widgets/common/BackButton";
import ImportModal from "widgets/common/ImportModal";
import RkaForm from "widgets/rka/InputForm";

const RkaAdd = ({ match, addRkaItemAction, loading, error }) => {
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
              <BreadcrumbContainer heading="menu.rka-add" match={match} />
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
          <RkaForm
            onSubmit={(item) => {
              addRkaItemAction(item, history);
            }}
            loading={loading}
          />
        </Colxx>
      </Row>
      <ImportModal
        isOpen={showImport}
        toggle={() => setShowImport(!showImport)}
        onClose={() => setShowImport(false)}
        label="Impor file RKA"
        type="rka"
        redirectTo={`${adminRoot}/rka/import`}
      />
    </>
  )
};

const mapStateToProps = ({ rka }) => {
  const { rkaItems, loading, error } = rka;
  return { rkaItems, loading, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    addRkaItemAction: addRkaItem,
  })(RkaAdd)
);
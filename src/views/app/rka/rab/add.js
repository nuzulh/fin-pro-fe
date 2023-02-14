import { Colxx, Separator } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import { adminRoot } from "constants/defaultValues";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Row } from "reactstrap";
import { addRabItem } from "redux/actions";
import BackButton from "widgets/common/BackButton";
import ImportModal from "widgets/common/ImportModal";
import RabForm from "widgets/rab/InputForm";

const RabAdd = ({ match, addRabItemAction, loading, error }) => {
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
              <BreadcrumbContainer heading="menu.rab-add" match={match} />
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
          <RabForm
            onSubmit={(item) => {
              addRabItemAction(item, history);
            }}
            loading2={loading}
          />
        </Colxx>
      </Row>
      <ImportModal
        isOpen={showImport}
        toggle={() => setShowImport(!showImport)}
        onClose={() => setShowImport(false)}
        label="Impor file RAB"
        type="rab"
        redirectTo={`${adminRoot}/rka/beban/rab/import`}
      />
    </>
  )
};

const mapStateToProps = ({ rab }) => {
  const { rabItems, loading, error } = rab;
  return { rabItems, loading, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    addRabItemAction: addRabItem,
  })(RabAdd)
);
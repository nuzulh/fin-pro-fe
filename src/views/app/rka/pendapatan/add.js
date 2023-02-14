import { Colxx, Separator } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useEffect } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Row } from "reactstrap";
import { addPendapatanItem } from "redux/actions";
import BackButton from "widgets/common/BackButton";
import PendapatanForm from "widgets/pendapatan/InputForm";

const PendapatanAdd = ({ match, addPendapatanItemAction, loading, error }) => {
  const history = useHistory();

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
          <BreadcrumbContainer heading="menu.pekerjaan-add" match={match} />
          <Separator className="mb-4" />
        </Colxx>
        <Colxx xss="12">
          <PendapatanForm
            onSubmit={(item) => {
              addPendapatanItemAction(item, history);
            }}
            loading={loading}
          />
        </Colxx>
      </Row>
    </>
  )
};

const mapStateToProps = ({ pendapatan }) => {
  const { pendapatanItems, loading, error } = pendapatan;
  return { pendapatanItems, loading, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    addPendapatanItemAction: addPendapatanItem,
  })(PendapatanAdd)
);
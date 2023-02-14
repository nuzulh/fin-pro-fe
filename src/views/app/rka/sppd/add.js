import { Colxx, Separator } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useEffect } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Row } from "reactstrap";
import { addSppdItem, editSppdItem } from "redux/actions";
import BackButton from "widgets/common/BackButton";
import SppdForm from "widgets/sppd/InputForm";

const SppdAdd = ({ match, editSppdItemAction, loading, error }) => {
  const history = useHistory();

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
  }, [error]);

  return (
    <Row>
      <Colxx xxs="12">
        <BackButton history={history} />
      </Colxx>
      <Colxx xxs="12">
        <BreadcrumbContainer heading="menu.sppd-add" match={match} />
        <Separator className="mb-4" />
      </Colxx>
      <Colxx xss="12">
        <SppdForm
          onSubmit={(item) => {
            editSppdItemAction(item.sppd_id, item, true, history);
          }}
          loading2={loading}
        />
      </Colxx>
    </Row>
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
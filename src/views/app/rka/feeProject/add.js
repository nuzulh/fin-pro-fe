import { Colxx, Separator } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useEffect } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Row } from "reactstrap";
import { addFeeItem, editFeeItem } from "redux/actions";
import BackButton from "widgets/common/BackButton";
import FeeForm from "widgets/feeProject/InputForm";

const FeeAdd = ({ match, editFeeItemAction, loading, error }) => {
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
        <BreadcrumbContainer heading="menu.fee-project-add" match={match} />
        <Separator className="mb-4" />
      </Colxx>
      <Colxx xss="12">
        <FeeForm
          onSubmit={(item) => {
            editFeeItemAction(item.fee_project_id, item, true, history);
          }}
          loading2={loading}
        />
      </Colxx>
    </Row>
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
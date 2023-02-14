import { Colxx } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Row } from "reactstrap";
import BackButton from "widgets/common/BackButton";
import TargetForm from "widgets/dashboard/TargetForm";
import { addTargetItem } from "redux/actions";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { NotificationManager } from "components/common/react-notifications";

const TargetSetting = ({
  match,
  addTargetItemAction,
  loading,
  error,
}) => {
  const history = useHistory();

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
  }, [error])

  return (
    <Row>
      <Colxx xxs="12">
        <BackButton history={history} />
        <div>
          <BreadcrumbContainer heading="menu.target-setting" match={match} />
        </div>
      </Colxx>
      <Colxx xxs="12">
        <TargetForm
          loading={loading}
          onSubmit={(val) => addTargetItemAction(val, history)}
        />
      </Colxx>
    </Row>
  );
};

const mapStateToProps = ({ dashboard }) => {
  const { targetItem, loading, error } = dashboard;
  return { targetItem, loading, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    addTargetItemAction: addTargetItem,
  })(TargetSetting)
);
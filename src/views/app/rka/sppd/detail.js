import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useHistory, useLocation } from "react-router-dom";
import { Row } from "reactstrap";
import BackButton from "widgets/common/BackButton";
import SppdDetailItem from "widgets/sppd/DetailItem";

const SppdDetail = ({ match }) => {
  const history = useHistory();
  const state = useLocation().state;

  return (
    <Row>
      <Colxx xxs="12">
        <BackButton history={history} />
      </Colxx>
      <Colxx xxs="12">
        <BreadcrumbContainer heading="menu.sppd-detail" match={match} />
        <Separator className="mb-4" />
      </Colxx>
      <SppdDetailItem state={state} />
    </Row>
  );
};

export default SppdDetail;
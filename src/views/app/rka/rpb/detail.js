import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useHistory, useLocation } from "react-router-dom";
import { Row } from "reactstrap";
import BackButton from "widgets/common/BackButton";
import RpbDetailItem from "widgets/rpb/DetailItem";

const RpbDetail = ({ match }) => {
  const history = useHistory();
  const state = useLocation().state;

  return (
    <Row>
      <Colxx xxs="12">
        <BackButton history={history} />
      </Colxx>
      <Colxx xxs="12">
        <BreadcrumbContainer heading="menu.rpb-detail" match={match} />
        <Separator className="mb-4" />
      </Colxx>
      <RpbDetailItem state={state} />
    </Row>
  );
};

export default RpbDetail;
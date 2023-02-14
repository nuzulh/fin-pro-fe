import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useHistory, useLocation } from "react-router-dom";
import { Row } from "reactstrap";
import BackButton from "widgets/common/BackButton";
import PendapatanDetailItem from "widgets/pendapatan/DetailItem";

const PendapatanDetail = ({ match }) => {
  const history = useHistory();
  const state = useLocation().state;

  return (
    <Row>
      <Colxx xxs="12">
        <BackButton history={history} />
      </Colxx>
      <Colxx xxs="12">
        <BreadcrumbContainer heading="menu.pekerjaan-detail" match={match} />
        <Separator className="mb-4" />
      </Colxx>
      <PendapatanDetailItem state={state} />
    </Row>
  );
};

export default PendapatanDetail;
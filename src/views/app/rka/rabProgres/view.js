import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { Row } from "reactstrap";
import RabProgresListView from "widgets/rabProgres/ListView";

const RabProgresView = ({ match }) => {
  return (
    <Row>
      <Colxx xxs="12">
        <Row>
          <Colxx xxs="12">
            <BreadcrumbContainer heading="menu.rab-progres" match={match} />
          </Colxx>
        </Row>
        <Separator className="mb-4" />
        <RabProgresListView />
      </Colxx>
    </Row>
  );
};

export default RabProgresView;
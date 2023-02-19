import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { Link } from "react-router-dom";
import { Button, Row } from "reactstrap";
import RpbListView from "widgets/rpb/ListView";

const RpbView = ({ match }) => {
  return (
    <Row>
      <Colxx xxs="12">
        <Row>
          <Colxx xxs="12">
            <BreadcrumbContainer heading="menu.rpb" match={match} />
          </Colxx>
        </Row>
        <Separator className="mb-4" />
        <RpbListView columns={["DRAFTED", "PROPOSED", "APPROVED", "REJECTED"]} />
      </Colxx>
    </Row>
  );
};

export default RpbView;
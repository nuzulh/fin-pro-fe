import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { Link } from "react-router-dom";
import { Button, Row } from "reactstrap";
import RabListView from "widgets/rab/ListView";

const RabView = ({ match }) => {
  return (
    <Row>
      <Colxx xxs="12">
        <Row>
          <Colxx xxs="12" className="d-flex justify-content-between">
            <div>
              <BreadcrumbContainer heading="menu.rab" match={match} />
            </div>
            <Link to="add">
              <Button color="primary btn-shadow" size="lg">
                Buat RAB baru
              </Button>
            </Link>
          </Colxx>
        </Row>
        <Separator className="mb-4" />
        <RabListView />
      </Colxx>
    </Row>
  );
};

export default RabView;
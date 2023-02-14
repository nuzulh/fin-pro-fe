import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { Link } from "react-router-dom";
import { Button, Row } from "reactstrap";
import PersekotListView from "widgets/persekot/ListView";

const PersekotView = ({ match }) => {
  return (
    <Row>
      <Colxx xxs="12">
        <Row>
          <Colxx xxs="12" className="d-flex justify-content-between">
            <div>
              <BreadcrumbContainer heading="menu.persekot" match={match} />
            </div>
            <Link to="add">
              <Button color="primary btn-shadow" size="lg">
                Buat Persekot baru
              </Button>
            </Link>
          </Colxx>
        </Row>
        <Separator className="mb-4" />
        <PersekotListView columns={["DRAFTED", "PROPOSED", "REJECTED"]} />
      </Colxx>
    </Row>
  );
};

export default PersekotView;
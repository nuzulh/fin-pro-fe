import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { Row } from "reactstrap";
import SppdListView from "widgets/sppd/ListView";

const SppdView = ({ match }) => {
  return (
    <Row>
      <Colxx xxs="12">
        <Row>
          <Colxx xxs="12">
            <BreadcrumbContainer heading="menu.sppd" match={match} />
          </Colxx>
        </Row>
        <Separator className="mb-4" />
        <SppdListView columns={["APPROVED", "REPORTED"]} />
      </Colxx>
    </Row>
  );
};

export default SppdView;
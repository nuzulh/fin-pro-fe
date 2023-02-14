import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { Row } from "reactstrap";
import FeeProjectListView from "widgets/feeProject/ListView";

const FeeProjectView = ({ match }) => {
  return (
    <Row>
      <Colxx xxs="12">
        <Row>
          <Colxx xxs="12">
            <BreadcrumbContainer heading="menu.fee-project" match={match} />
          </Colxx>
        </Row>
        <Separator className="mb-4" />
        <FeeProjectListView columns={["APPROVED", "REPORTED"]} />
      </Colxx>
    </Row>
  );
};

export default FeeProjectView;
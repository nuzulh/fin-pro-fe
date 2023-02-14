import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { Row } from "reactstrap";
import PersekotListView from "widgets/persekot/ListView";

const PersekotReport = ({ match }) => {
  return (
    <Row>
      <Colxx xxs="12">
        <Row>
          <Colxx xxs="12">
            <BreadcrumbContainer heading="menu.laporan-persekot" match={match} />
          </Colxx>
        </Row>
        <Separator className="mb-4" />
        <PersekotListView columns={["APPROVED", "REPORTED"]} />
      </Colxx>
    </Row>
  );
};

export default PersekotReport;
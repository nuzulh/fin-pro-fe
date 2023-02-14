import { Colxx, Separator } from "components/common/CustomBootstrap";
import { adminRoot } from "constants/defaultValues";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Row } from "reactstrap";
import SwitchMenuButton from "widgets/common/SwitchMenuButton";
import PendapatanListView from "widgets/pendapatan/ListView";

const PendapatanView = ({ match }) => {
  const history = useHistory();
  const [isOpen1, setIsOpen1] = useState(false);

  useEffect(() => {
    if (isOpen1) history.push(`${adminRoot}/rka`);
  }, [isOpen1]);

  return (
    <Row>
      <Colxx xxs="12">
        <Row>
          <Colxx xxs="12" className="d-flex justify-content-between align-items-start">
            <div>
              <BreadcrumbContainer heading="menu.pendapatan" match={match} />
            </div>
            <Link to="add">
              <Button color="primary btn-shadow" size="lg">
                Tambah pekerjaan
              </Button>
            </Link>
          </Colxx>
        </Row>
        <Separator className="mb-4" />
        <SwitchMenuButton
          label1="Beban"
          label2="Pendapatan"
          open1={isOpen1}
          width={9}
          openedMenu={(val) => setIsOpen1(val)}
          className="mb-4"
        />
        <PendapatanListView />
      </Colxx>
    </Row>
  );
};

export default PendapatanView;
import { Colxx, Separator } from "components/common/CustomBootstrap";
import { adminRoot } from "constants/defaultValues";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Row } from "reactstrap";
import SwitchMenuButton from "widgets/common/SwitchMenuButton";
import RkaListView from "widgets/rka/ListView";

const RkaView = ({ match }) => {
  const history = useHistory();
  const [isOpen1, setIsOpen1] = useState(true);

  useEffect(() => {
    if (!isOpen1) history.push(`${adminRoot}/rka/pendapatan`);
  }, [isOpen1]);

  return (
    <Row>
      <Colxx xxs="12">
        <Row>
          <Colxx xxs="12" className="d-flex justify-content-between align-items-start">
            <div>
              <BreadcrumbContainer heading="menu.rka" match={match} />
            </div>
            <Link to="add">
              <Button color="primary btn-shadow" size="lg">
                Buat RKA baru
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
        <RkaListView />
      </Colxx>
    </Row>
  );
};

export default RkaView;
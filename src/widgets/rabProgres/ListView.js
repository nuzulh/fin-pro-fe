import { Colxx } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import RabListHeader from "components/listheader/RabListHeader";
import Pagination from "containers/pages/Pagination";
import { slicePage } from "helpers/Utils";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Row } from "reactstrap";
import { getRabProgresList, getRabListSearch } from "redux/actions";
import SearchOptions from "widgets/common/SearchOptions";
import ListItem from "./ListItem";

const RabProgresListView = ({
  getRabProgresListAction,
  getRabListSearchAction,
  rabItems,
  totalPage,
  pageSize,
  loading,
  error,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageItems, setPageItems] = useState([]);

  useEffect(() => {
    getRabProgresListAction();
  }, []);

  useEffect(() => {
    if (rabItems) {
      const items = slicePage(rabItems.filter((x) => x.status === "APPROVED"), currentPage, pageSize);
      setPageItems(items);
    } else {
      getRabProgresListAction();
    }
  }, [rabItems, currentPage]);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
  }, [error]);

  return (
    <Row>
      <Colxx xxs="12">
        <SearchOptions
          placeholder="Cari"
          onSearch={(val) => getRabListSearchAction(val)}
        />
        {/* <RabListHeader /> */}
        <Row>
          {loading ? (
            pageItems.map((item, index) => (
              <ListItem
                key={index}
                item={item}
              />
            ))
          ) : (
            <div className="loading" />
          )}
          <Pagination
            totalPage={totalPage}
            currentPage={currentPage}
            onChangePage={(i) => setCurrentPage(i)}
          />
        </Row>
      </Colxx>
    </Row>
  );
};

const mapStateToProps = ({ rab }) => {
  const { rabItems, loading, totalPage, pageSize, error } = rab;
  return { rabItems, loading, totalPage, pageSize, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    getRabProgresListAction: getRabProgresList,
    getRabListSearchAction: getRabListSearch,
  })(RabProgresListView)
);
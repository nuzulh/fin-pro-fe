import { Colxx } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import FeeListHeader from "components/listheader/FeeListHeader";
import Pagination from "containers/pages/Pagination";
import { slicePage } from "helpers/Utils";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Row } from "reactstrap";
import { getFeeList, getFeeListSearch, editFeeItem } from "redux/actions";
import SearchOptions from "widgets/common/SearchOptions";
import ListItem from "./ListItem";

const FeeListView = ({
  getFeeListAction,
  getFeeListSearchAction,
  editFeeItemAction,
  feeItems,
  loading,
  error,
  pageSize,
  totalPage,
  columns,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageItems, setPageItems] = useState([]);

  useEffect(() => {
    getFeeListAction();
  }, []);

  useEffect(() => {
    if (feeItems) {
      const items = slicePage(feeItems, currentPage, pageSize);
      setPageItems(items);
    } else {
      getFeeListAction();
    }
  }, [feeItems, currentPage]);

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
          onSearch={(val) => getFeeListSearchAction(val)}
          columns={columns}
        />
        <FeeListHeader />
        <Row>
          {loading ? (
            pageItems.map((item, index) => (
              <ListItem
                key={index}
                item={item}
                editable={false}
                onEdit={(val) => editFeeItemAction(item.fee_project_id, val, false)}
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

const mapStateToProps = ({ fee }) => {
  const { feeItems, loading, pageSize, totalPage, searchKeyword, error } = fee;
  return { feeItems, loading, pageSize, totalPage, searchKeyword, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    getFeeListAction: getFeeList,
    getFeeListSearchAction: getFeeListSearch,
    editFeeItemAction: editFeeItem,
  })(FeeListView)
);
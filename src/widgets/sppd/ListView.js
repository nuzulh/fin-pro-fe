import { Colxx } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import SppdListHeader from "components/listheader/SppdListHeader";
import Pagination from "containers/pages/Pagination";
import { slicePage } from "helpers/Utils";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Row } from "reactstrap";
import { getSppdList, getSppdListSearch, editSppdItem } from "redux/actions";
import SearchOptions from "widgets/common/SearchOptions";
import ListItem from "./ListItem";

const SppdListView = ({
  getSppdListAction,
  getSppdListSearchAction,
  editSppdItemAction,
  sppdItems,
  loading,
  error,
  pageSize,
  totalPage,
  columns,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageItems, setPageItems] = useState([]);

  useEffect(() => {
    getSppdListAction();
  }, []);

  useEffect(() => {
    if (sppdItems) {
      const items = slicePage(sppdItems, currentPage, pageSize);
      setPageItems(items);
    } else {
      getSppdListAction();
    }
  }, [sppdItems, currentPage]);

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
          onSearch={(val) => getSppdListSearchAction(val)}
          columns={columns}
        />
        <SppdListHeader />
        <Row>
          {loading ? (
            pageItems.map((item, index) => (
              <ListItem
                key={index}
                item={item}
                editable={true}
                onEdit={(val) => editSppdItemAction(item.sppd_id, val, false)}
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

const mapStateToProps = ({ sppd }) => {
  const { sppdItems, loading, pageSize, totalPage, searchKeyword, error } = sppd;
  return { sppdItems, loading, pageSize, totalPage, searchKeyword, error };
};
export default injectIntl(
  connect(mapStateToProps, {
    getSppdListAction: getSppdList,
    getSppdListSearchAction: getSppdListSearch,
    editSppdItemAction: editSppdItem,
  })(SppdListView)
);
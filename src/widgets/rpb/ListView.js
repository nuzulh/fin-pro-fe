import { Colxx } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import RpbListHeader from "components/listheader/RpbListHeader";
import Pagination from "containers/pages/Pagination";
import { slicePage } from "helpers/Utils";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Row } from "reactstrap";
import { getRpbList, getRpbListSearch, editRpbItem } from "redux/actions";
import SearchOptions from "widgets/common/SearchOptions";
import ListItem from "./ListItem";

const RpbListView = ({
  getRpbListAction,
  getRpbListSearchAction,
  editRpbItemAction,
  rpbItems,
  loading,
  error,
  pageSize,
  totalPage,
  totalPageImport,
  columns,
  importItems,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageItems, setPageItems] = useState([]);

  useEffect(() => {
    getRpbListAction();
  }, []);

  useEffect(() => {
    if (importItems) {
      const items = slicePage(importItems, currentPage, pageSize);
      setPageItems(items);
    } else {
      if (rpbItems) {
        const items = slicePage(rpbItems, currentPage, pageSize);
        setPageItems(items);
      } else {
        getRpbListAction();
      }
    }
  }, [rpbItems, currentPage]);

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
          onSearch={(val) => getRpbListSearchAction(val)}
          columns={columns}
        />
        <RpbListHeader />
        <Row>
          {loading ? (
            pageItems.map((item, index) => (
              <ListItem
                key={index}
                item={item}
                isImport={importItems !== undefined}
                editable={false}
                onEdit={(val) => editRpbItemAction(item.pkm_id, val)}
              />
            ))
          ) : (
            <div className="loading" />
          )}
          <Pagination
            totalPage={importItems ? totalPageImport : totalPage}
            currentPage={currentPage}
            onChangePage={(i) => setCurrentPage(i)}
          />
        </Row>
      </Colxx>
    </Row>
  );
};

const mapStateToProps = ({ rpb, csvImport }) => {
  const { rpbItems, loading, pageSize, totalPage, searchKeyword, error } = rpb;
  const totalPageImport = csvImport.totalPage;
  return { rpbItems, loading, pageSize, totalPage, searchKeyword, error, totalPageImport };
};
export default injectIntl(
  connect(mapStateToProps, {
    getRpbListAction: getRpbList,
    getRpbListSearchAction: getRpbListSearch,
    editRpbItemAction: editRpbItem,
  })(RpbListView)
);
import { Colxx } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import PersekotListHeader from "components/listheader/PersekotListHeader";
import Pagination from "containers/pages/Pagination";
import { slicePage } from "helpers/Utils";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Row } from "reactstrap";
import { getPersekotList, getPersekotListSearch, editPersekotItem } from "redux/actions";
import SearchOptions from "widgets/common/SearchOptions";
import ListItem from "./ListItem";

const PersekotListView = ({
  getPersekotListAction,
  getPersekotListSearchAction,
  editPersekotItemAction,
  persekotItems,
  loading,
  error,
  pageSize,
  totalPageImport,
  columns,
  importItems,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageItems, setPageItems] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isDraft, setIsDraft] = useState(window.location.toString().split("/").pop() === "view");

  useEffect(() => {
    getPersekotListAction(null, isDraft ? "DRAFTED" : null);
  }, []);

  useEffect(() => {
    if (importItems) {
      const items = slicePage(importItems, currentPage, pageSize);
      setPageItems(items);
    } else {
      if (persekotItems) {
        const items = slicePage(persekotItems.filter((x) => columns.includes(x.status)), currentPage, pageSize);
        const total = Math.ceil(persekotItems.filter((x) => columns.includes(x.status)).length / pageSize);
        setTotalPage(total);
        setPageItems(items);
      } else {
        getPersekotListAction(null, isDraft ? "DRAFTED" : null);
      }
    }
  }, [persekotItems, currentPage]);

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
          onSearch={(val) => getPersekotListSearchAction(val)}
          columns={columns}
        />
        <PersekotListHeader isDraft={isDraft} />
        <Row>
          {loading ? (
            pageItems.map((item, index) => (
              <ListItem
                key={index}
                item={item}
                isImport={importItems !== undefined}
                editable={false}
                onEdit={(val) => editPersekotItemAction(item.persekot_id, val)}
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

const mapStateToProps = ({ persekot, csvImport }) => {
  const { persekotItems, loading, pageSize, searchKeyword, error } = persekot;
  const totalPageImport = csvImport.totalPage;
  return { persekotItems, loading, pageSize, searchKeyword, error, totalPageImport };
};
export default injectIntl(
  connect(mapStateToProps, {
    getPersekotListAction: getPersekotList,
    getPersekotListSearchAction: getPersekotListSearch,
    editPersekotItemAction: editPersekotItem,
  })(PersekotListView)
);
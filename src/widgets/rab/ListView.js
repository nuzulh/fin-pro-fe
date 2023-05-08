import { Colxx } from "components/common/CustomBootstrap";
import { NotificationManager } from "components/common/react-notifications";
import RabListHeader from "components/listheader/RabListHeader";
import Pagination from "containers/pages/Pagination";
import { slicePage } from "helpers/Utils";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Row } from "reactstrap";
import { getRabList, getRabListSearch, editRabItem } from "redux/actions";
import SearchOptions from "widgets/common/SearchOptions";
import ListItem from "./ListItem";

const RabListView = ({
  getRabListAction,
  getRabListSearchAction,
  editRabItemAction,
  rabItems,
  loading,
  error,
  totalPage,
  totalPageImport,
  pageSize,
  importItems,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageItems, setPageItems] = useState([]);

  useEffect(() => {
    getRabListAction();
  }, []);

  useEffect(() => {
    if (importItems) {
      const items = slicePage(importItems, currentPage, pageSize);
      setPageItems(items);
    } else {
      if (rabItems) {
        const items = slicePage(rabItems, currentPage, pageSize);
        setPageItems(items);
      } else {
        getRabListAction();
      }
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
          columns={["PROPOSED", "APPROVED", "REJECTED"]}
        />
        <RabListHeader />
        <Row>
          {loading ? (
            pageItems.map((item, index) => (
              <ListItem
                key={index}
                item={item}
                isImport={importItems !== undefined}
                editable={false}
                onEdit={(val) => editRabItemAction(item.rab_id, val)}
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

const mapStateToProps = ({ rab, csvImport }) => {
  const { rabItems, loading, totalPage, pageSize, searchKeyword, error } = rab;
  const totalPageImport = csvImport.totalPage;
  return { rabItems, loading, totalPage, pageSize, searchKeyword, error, totalPageImport };
};
export default injectIntl(
  connect(mapStateToProps, {
    getRabListAction: getRabList,
    getRabListSearchAction: getRabListSearch,
    editRabItemAction: editRabItem,
  })(RabListView)
);
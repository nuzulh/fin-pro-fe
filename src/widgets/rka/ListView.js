import { Colxx } from "components/common/CustomBootstrap";
import RkaListHeader from "components/listheader/RkaListHeader";
import Pagination from "containers/pages/Pagination";
import { slicePage } from "helpers/Utils";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Row } from "reactstrap";
import { getRkaList, getRkaListSearch, editRkaItem } from "redux/actions";
import SearchOptions from "widgets/common/SearchOptions";
import ListItem from "./ListItem";

const RkaListView = ({
  getRkaListAction,
  getRkaListSearchAction,
  editRkaItemAction,
  rkaItems,
  loading,
  totalPage,
  totalPageImport,
  pageSize,
  importItems,
  editSuccess,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageItems, setPageItems] = useState([]);

  useEffect(() => {
    getRkaListAction();
  }, []);

  useEffect(() => {
    if (importItems) {
      const items = slicePage(importItems, currentPage, pageSize);
      setPageItems(items);
    } else {
      if (rkaItems) {
        const items = slicePage(rkaItems, currentPage, pageSize);
        setPageItems(items);
      } else {
        getRkaListAction();
      }
    }
  }, [rkaItems, importItems, currentPage]);

  useEffect(() => {
    if (editSuccess) getRkaListAction();
  }, [editSuccess]);

  return (
    <Row>
      <Colxx xxs="12">
        <SearchOptions
          placeholder="Cari"
          onSearch={(val) => getRkaListSearchAction(val)}
        />
        <RkaListHeader />
        <Row>
          {importItems || loading ? (
            pageItems.map((item, index) => (
              <ListItem
                key={index}
                item={item}
                isImport={importItems !== undefined}
                onEdit={(val) => editRkaItemAction(item.rka_id, val)}
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

const mapStateToProps = ({ rka, csvImport }) => {
  const { rkaItems, loading, totalPage, pageSize, searchKeyword, editSuccess, } = rka;
  const totalPageImport = csvImport.totalPage;
  return { rkaItems, loading, totalPage, pageSize, searchKeyword, editSuccess, totalPageImport };
};
export default injectIntl(
  connect(mapStateToProps, {
    getRkaListAction: getRkaList,
    getRkaListSearchAction: getRkaListSearch,
    editRkaItemAction: editRkaItem,
  })(RkaListView)
);
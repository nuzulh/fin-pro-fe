import { Colxx } from "components/common/CustomBootstrap";
import PendapatanListHeader from "components/listheader/PendapatanListHeader";
import Pagination from "containers/pages/Pagination";
import { slicePage } from "helpers/Utils";
import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Row } from "reactstrap";
import { getPendapatanList, getPendapatanListSearch } from "redux/actions";
import SearchOptions from "widgets/common/SearchOptions";
import ListItem from "./ListItem";

const PendapatanListView = ({
  getPendapatanListAction,
  getPendapatanListSearchAction,
  pendapatanItems,
  loading,
  totalPage,
  pageSize,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageItems, setPageItems] = useState([]);

  useEffect(() => {
    getPendapatanListAction();
  }, []);

  useEffect(() => {
    if (pendapatanItems) {
      const items = slicePage(pendapatanItems, currentPage, pageSize);
      setPageItems(items);
    } else {
      getPendapatanListAction();
    }
  }, [pendapatanItems, currentPage]);

  return (
    <Row>
      <Colxx xxs="12">
        <SearchOptions
          placeholder="Cari"
          onSearch={(val) => getPendapatanListSearchAction(val)}
        />
        <PendapatanListHeader />
        <Row>
          {loading ? (
            pageItems.map((item, index) => (
              <ListItem
                key={index}
                item={item}
                onEdit={() => { }}
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

const mapStateToProps = ({ pendapatan }) => {
  const { pendapatanItems, loading, totalPage, pageSize, searchKeyword } = pendapatan;
  return { pendapatanItems, loading, totalPage, pageSize, searchKeyword };
};
export default injectIntl(
  connect(mapStateToProps, {
    getPendapatanListAction: getPendapatanList,
    getPendapatanListSearchAction: getPendapatanListSearch,
  })(PendapatanListView)
);
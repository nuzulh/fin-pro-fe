import PersekotListHeader from "components/listheader/PersekotListHeader";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import PersekotListItem from "widgets/persekot/ListItem";
import { approveItem, rejectItem, getPersekotList, getPersekotListSearch } from "redux/actions";
import { useEffect, useState } from "react";
import { NotificationManager } from "components/common/react-notifications";
import { CustomInput, Row } from "reactstrap";
import { Colxx, Separator } from "components/common/CustomBootstrap";
import BreadcrumbContainer from "containers/navs/Breadcrumb";
import { useHistory } from "react-router-dom";
import BackButton from "widgets/common/BackButton";
import { getIndex } from "helpers/Utils";
import SearchOptions from "widgets/common/SearchOptions";
import ApproveButton from "widgets/dashboard/ApproveButton";
import RejectButton from "widgets/dashboard/RejectButton";
import SwitchMenuButton from "widgets/common/SwitchMenuButton";
import ActionModal from "widgets/dashboard/ActionModal";

const PersekotPendingList = ({
  match,
  approveItemAction,
  rejectItemAction,
  getPersekotListAction,
  getPersekotListSearchAction,
  pendingItem,
  loading,
  error,
  persekotItems,
  persekotLoading,
  persekotError
}) => {
  const history = useHistory();

  const [lastChecked, setLastChecked] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewHistory, setViewHistory] = useState(false);
  const [actionType, setActionType] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleCheckChange = (event, id) => {
    if (lastChecked == null) {
      setLastChecked(id);
    }

    let selectedList = Object.assign([], selectedItems);
    if (selectedList.includes(id)) {
      selectedList = selectedList.filter((x) => x !== id);
    } else {
      selectedList.push(id);
    }
    setSelectedItems(selectedList);

    if (event.shiftKey) {
      let items = persekotItems;
      const start = getIndex(id, items, "persekot_id");
      const end = getIndex(lastChecked, items, "persekot_id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedList.push(
        ...items.map((item) => {
          return item.persekot_id;
        })
      );
      selectedList = Array.from(new Set(selectedList));
      setSelectedItems(selectedList);
    }
  };

  const handleChangeSelectAll = () => {
    if (persekotLoading) {
      if (selectedItems.length >= persekotItems.filter((x) => x.status === "PROPOSED").length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(persekotItems.filter((x) => x.status === "PROPOSED").map((x) => x.persekot_id));
      }
    }
  };

  useEffect(() => {
    getPersekotListAction();
  }, []);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
    if (persekotError !== "") {
      NotificationManager.error(persekotError, "Gagal", 3000, null, null, "");
    }
  }, [error, persekotError]);

  useEffect(() => {
    if (pendingItem) {
      NotificationManager.success(`Berhasil ${actionType} Persekot ${pendingItem.persekot_no}`, "Berhasil", 3000, null, null, "");
      setShowModal(false);
      getPersekotListAction();
    }
  }, [pendingItem]);

  return (
    <>
      <Row>
        <Colxx xss="12">
          <BackButton history={history} />
        </Colxx>
        <Colxx xxs="12">
          <BreadcrumbContainer heading="menu.persekot-pending" match={match} />
          <Separator className="mb-4" />
        </Colxx>
        <Colxx xss="12">
          {persekotLoading && persekotItems ? (
            <>
              <Row>
                <Colxx xxs="12" className="d-flex flex-col justify-content-between mb-3">
                  <SwitchMenuButton
                    label1="Riwayat"
                    label2="Menunggu persetujuan"
                    open1={viewHistory}
                    openedMenu={setViewHistory}
                    width={12}
                  />
                  <div>
                    {loading ? (
                      <>
                        <RejectButton
                          className="mr-3"
                          disabled={selectedItems.length < 1}
                          onClick={() => {
                            setActionType("reject");
                            setShowModal(true);
                          }}
                        />
                        <ApproveButton
                          disabled={selectedItems.length < 1}
                          onClick={() => {
                            setActionType("approve");
                            setShowModal(true);
                          }}
                        />
                      </>
                    ) : (
                      <div className="loading position-relative" />
                    )}
                  </div>
                </Colxx>
                <Colxx xxs="8">
                  <SearchOptions
                    placeholder="Cari"
                    columns={viewHistory ? ["APPROVED", "REJECTED", "REPORTED"] : null}
                    onSearch={(val) => getPersekotListSearchAction(val)}
                  />
                </Colxx>
                <Colxx xxs="4">
                  <div
                    hidden={viewHistory}
                    className="btn btn-primary btn-lg pr-3 pl-4 mr-2 float-right check-button check-all"
                    onClick={() => handleChangeSelectAll()}
                  >
                    <CustomInput
                      className="custom-checkbox mb-0 d-inline-block mx-auto"
                      type="checkbox"
                      id="checkAll"
                      checked={selectedItems.length >= persekotItems.length}
                      onChange={() => handleChangeSelectAll()}
                      label={
                        <span
                          className={`custom-control-label ${selectedItems.length > 0 &&
                            selectedItems.length < persekotItems.length
                            ? "indeterminate"
                            : ""
                            }`}
                        />
                      }
                    />
                  </div>
                </Colxx>
              </Row>
              <PersekotListHeader />
              <Row>
                {viewHistory ? (
                  persekotItems.filter((x) =>
                    x.status !== "PROPOSED" &&
                    x.status !== "DRAFTED" &&
                    x.status !== "PENDING"
                  ).map((item, index) => (
                    <PersekotListItem
                      key={index}
                      item={item}
                      handleCheckChange={handleCheckChange}
                      isSelected={
                        persekotLoading
                          ? selectedItems.includes(item.persekot_id)
                          : false
                      }
                    />
                  ))
                ) : (
                  persekotItems.filter((x) => x.status === "PROPOSED").map((item, index) => (
                    <PersekotListItem
                      key={index}
                      item={item}
                      hiddenSelectbox={viewHistory}
                      handleCheckChange={handleCheckChange}
                      isSelected={
                        persekotLoading
                          ? selectedItems.includes(item.persekot_id)
                          : false
                      }
                    />
                  ))
                )}
              </Row>
            </>
          ) : (
            <div className="loading" />
          )}
        </Colxx>
      </Row>
      <ActionModal
        isOpen={showModal}
        actionType={actionType}
        itemType="persekot"
        items={selectedItems.map((id) => persekotItems.filter((x) => x.persekot_id === id)[0])}
        onAction={(items) => {
          items.map((x) => {
            if (actionType === "approve") {
              approveItemAction("persekot", "persekot_id", x.persekot_id);
            } else {
              rejectItemAction("persekot", "persekot_id", x.persekot_id, x.rejected_reason);
            }
          });
          setSelectedItems([]);
        }}
        onClose={() => setShowModal(false)}
        loading={loading}
      />
    </>
  );
};

const mapStateToProps = ({ dashboard, persekot }) => {
  return {
    pendingItem: dashboard.pendingItem,
    loading: dashboard.loading,
    error: dashboard.error,
    persekotItems: persekot.persekotItems,
    persekotLoading: persekot.loading,
    persekotError: persekot.error,
  };
}
export default injectIntl(
  connect(mapStateToProps, {
    approveItemAction: approveItem,
    rejectItemAction: rejectItem,
    getPersekotListAction: getPersekotList,
    getPersekotListSearchAction: getPersekotListSearch,
  })(PersekotPendingList)
);
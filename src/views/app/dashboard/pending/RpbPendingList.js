import RpbListHeader from "components/listheader/RpbListHeader";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import RpbListItem from "widgets/rpb/ListItem";
import { approveItem, rejectItem, getRpbList, getRpbListSearch } from "redux/actions";
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

const RpbPendingList = ({
  match,
  approveItemAction,
  rejectItemAction,
  getRpbListAction,
  getRpbListSearchAction,
  pendingItem,
  loading,
  error,
  rpbItems,
  rpbLoading,
  rpbError
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
      let items = rpbItems;
      const start = getIndex(id, items, "pkm_id");
      const end = getIndex(lastChecked, items, "pkm_id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedList.push(
        ...items.map((item) => {
          return item.pkm_id;
        })
      );
      selectedList = Array.from(new Set(selectedList));
      setSelectedItems(selectedList);
    }
  };

  const handleChangeSelectAll = () => {
    if (rpbLoading) {
      if (selectedItems.length >= rpbItems.filter((x) => x.status === "PROPOSED").length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(rpbItems.filter((x) => x.status === "PROPOSED").map((x) => x.pkm_id));
      }
    }
  };

  useEffect(() => {
    getRpbListAction();
  }, []);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
    if (rpbError !== "") {
      NotificationManager.error(rpbError, "Gagal", 3000, null, null, "");
    }
  }, [error, rpbError]);

  useEffect(() => {
    if (pendingItem) {
      NotificationManager.success(`Berhasil ${actionType} RPB ${pendingItem.pkm_no}`, "Berhasil", 3000, null, null, "");
      setShowModal(false);
      getRpbListAction();
    }
  }, [pendingItem]);

  return (
    <>
      <Row>
        <Colxx xss="12">
          <BackButton history={history} />
        </Colxx>
        <Colxx xxs="12">
          <BreadcrumbContainer heading="menu.rpb-pending" match={match} />
          <Separator className="mb-4" />
        </Colxx>
        <Colxx xss="12">
          {rpbLoading && rpbItems ? (
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
                    onSearch={(val) => getRpbListSearchAction(val)}
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
                      checked={selectedItems.length >= rpbItems.length}
                      onChange={() => handleChangeSelectAll()}
                      label={
                        <span
                          className={`custom-control-label ${selectedItems.length > 0 &&
                            selectedItems.length < rpbItems.length
                            ? "indeterminate"
                            : ""
                            }`}
                        />
                      }
                    />
                  </div>
                </Colxx>
              </Row>
              <RpbListHeader />
              <Row>
                {viewHistory ? (
                  rpbItems.filter((x) =>
                    x.status !== "PROPOSED" &&
                    x.status !== "DRAFTED" &&
                    x.status !== "PENDING"
                  ).map((item, index) => (
                    <RpbListItem
                      key={index}
                      item={item}
                      handleCheckChange={handleCheckChange}
                      isSelected={
                        rpbLoading
                          ? selectedItems.includes(item.pkm_id)
                          : false
                      }
                    />
                  ))
                ) : (
                  rpbItems.filter((x) => x.status === "PROPOSED").map((item, index) => (
                    <RpbListItem
                      key={index}
                      item={item}
                      hiddenSelectbox={viewHistory}
                      handleCheckChange={handleCheckChange}
                      isSelected={
                        rpbLoading
                          ? selectedItems.includes(item.pkm_id)
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
        itemType="pkm"
        items={selectedItems.map((id) => rpbItems.filter((x) => x.pkm_id === id)[0])}
        onAction={(items) => {
          items.map((x) => {
            if (actionType === "approve") {
              approveItemAction("pkm", "pkm_id", x.pkm_id);
            } else {
              rejectItemAction("pkm", "pkm_id", x.pkm_id, x.rejected_reason);
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

const mapStateToProps = ({ dashboard, rpb }) => {
  return {
    pendingItem: dashboard.pendingItem,
    loading: dashboard.loading,
    error: dashboard.error,
    rpbItems: rpb.rpbItems,
    rpbLoading: rpb.loading,
    rpbError: rpb.error,
  };
}
export default injectIntl(
  connect(mapStateToProps, {
    approveItemAction: approveItem,
    rejectItemAction: rejectItem,
    getRpbListAction: getRpbList,
    getRpbListSearchAction: getRpbListSearch,
  })(RpbPendingList)
);
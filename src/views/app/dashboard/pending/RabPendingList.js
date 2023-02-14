import RabListHeader from "components/listheader/RabListHeader";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import RabListItem from "widgets/rab/ListItem";
import { approveItem, rejectItem, getRabList, getRabListSearch } from "redux/actions";
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

const RabPendingList = ({
  match,
  approveItemAction,
  rejectItemAction,
  getRabListAction,
  getRabListSearchAction,
  pendingItem,
  loading,
  error,
  rabItems,
  rabLoading,
  rabError
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
      let items = rabItems;
      const start = getIndex(id, items, "rab_id");
      const end = getIndex(lastChecked, items, "rab_id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedList.push(
        ...items.map((item) => {
          return item.rab_id;
        })
      );
      selectedList = Array.from(new Set(selectedList));
      setSelectedItems(selectedList);
    }
  };

  const handleChangeSelectAll = () => {
    if (rabLoading) {
      if (selectedItems.length >= rabItems.filter((x) => x.status === "PROPOSED").length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(rabItems.filter((x) => x.status === "PROPOSED").map((x) => x.rab_id));
      }
    }
  };

  useEffect(() => {
    getRabListAction();
  }, []);

  useEffect(() => {
    if (pendingItem) {
      NotificationManager.success(`Berhasil ${actionType} RAB ${pendingItem.rab_no}`, "Berhasil", 3000, null, null, "");
      setShowModal(false);
      getRabListAction();
    }
  }, [pendingItem]);

  useEffect(() => {
    if (error !== "") {
      NotificationManager.error(error, "Gagal", 3000, null, null, "");
    }
    if (rabError !== "") {
      NotificationManager.error(rabError, "Gagal", 3000, null, null, "");
    }
  }, [error, rabError]);

  return (
    <>
      <Row>
        <Colxx xss="12">
          <BackButton history={history} />
        </Colxx>
        <Colxx xxs="12">
          <BreadcrumbContainer heading="menu.rab-pending" match={match} />
          <Separator className="mb-4" />
        </Colxx>
        <Colxx xss="12">
          {rabLoading && rabItems ? (
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
                  <div hidden={viewHistory}>
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
                    columns={viewHistory ? ["APPROVED", "REJECTED"] : null}
                    onSearch={(val) => getRabListSearchAction(val)}
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
                      checked={selectedItems.length >= rabItems.length}
                      onChange={() => handleChangeSelectAll()}
                      label={
                        <span
                          className={`custom-control-label ${selectedItems.length > 0 &&
                            selectedItems.length < rabItems.length
                            ? "indeterminate"
                            : ""
                            }`}
                        />
                      }
                    />
                  </div>
                </Colxx>
              </Row>
              {viewHistory ? (
                <>
                  <RabListHeader />
                  <Row>
                    {rabItems.filter((x) => x.status !== "PROPOSED").map((item, index) => (
                      <RabListItem
                        key={index}
                        item={item}
                        handleCheckChange={handleCheckChange}
                        isSelected={
                          rabLoading
                            ? selectedItems.includes(item.rab_id)
                            : false
                        }
                      />
                    ))}
                  </Row>
                </>
              ) : (
                <>
                  <RabListHeader isPendingItems={true} />
                  <Row>
                    {rabItems.filter((x) => x.status === "PROPOSED").map((item, index) => (
                      <RabListItem
                        key={index}
                        item={item}
                        hiddenSelectbox={viewHistory}
                        handleCheckChange={handleCheckChange}
                        isSelected={
                          rabLoading
                            ? selectedItems.includes(item.rab_id)
                            : false
                        }
                      />
                    ))}
                  </Row>
                </>
              )}
            </>
          ) : (
            <div className="loading" />
          )}
        </Colxx>
      </Row>
      <ActionModal
        isOpen={showModal}
        actionType={actionType}
        itemType="rab"
        items={selectedItems.map((id) => rabItems.filter((x) => x.rab_id === id)[0])}
        onAction={(items) => {
          items.map((x) => {
            if (actionType === "approve") {
              approveItemAction("rab", "rab_id", x.rab_id);
            } else {
              rejectItemAction("rab", "rab_id", x.rab_id, x.rejected_reason);
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

const mapStateToProps = ({ dashboard, rab }) => {
  return {
    pendingItem: dashboard.pendingItem,
    loading: dashboard.loading,
    error: dashboard.error,
    rabItems: rab.rabItems,
    rabLoading: rab.loading,
    rabError: rab.error,
  };
}
export default injectIntl(
  connect(mapStateToProps, {
    approveItemAction: approveItem,
    rejectItemAction: rejectItem,
    getRabListAction: getRabList,
    getRabListSearchAction: getRabListSearch,
  })(RabPendingList)
);
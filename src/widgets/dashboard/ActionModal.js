import { Separator } from "components/common/CustomBootstrap";
import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { Button, Input, Modal, ModalBody, ModalFooter } from "reactstrap";

const ActionModal = ({ isOpen, actionType, itemType, items, onAction, onClose, loading }) => {
  const [newItems, setNewItems] = useState(null);

  useEffect(() => {
    const temp = items.map((x) => ({ ...x, rejected_reason: "" }));
    setNewItems(temp);
  }, [items]);

  return (
    <Modal isOpen={isOpen}>
      <ModalBody>
        <h4 className="font-weight-bold">
          Yakin {actionType} {itemType} berikut?
        </h4>
        {newItems && newItems.map((item, index) => (
          <div key={index}>
            <div className="my-3">
              <Separator className="my-2" />
              <div className="d-flex">
                <p className="w-15 mb-2">Judul</p>
                <p className="font-weight-bold m-0">
                  {item[`${itemType}_name`]}
                </p>
              </div>
              <div className="d-flex">
                <p className="w-15 mb-2">Nomor</p>
                <p className="font-weight-bold m-0">
                  {item[`${itemType}_no`]}
                </p>
              </div>
              <div className="d-flex">
                <p className="w-15 mb-2">Nilai</p>
                <CurrencyFormat
                  displayType="text"
                  prefix="Rp"
                  className="font-weight-bold"
                  thousandSeparator={true}
                  value={item[`${itemType}_value`]}
                />
              </div>
              {actionType === "reject" && (
                <>
                  <p className="">Catatan: </p>
                  <Input
                    type="textarea"
                    value={newItems.find((x) => x[`${itemType}_id`] === item[`${itemType}_id`]).rejected_reason}
                    onChange={(e) => {
                      const temp = newItems.map((x) => {
                        if (x[`${itemType}_id`] === item[`${itemType}_id`]) {
                          return {
                            ...x,
                            rejected_reason: e.target.value,
                          }
                        } else {
                          return x;
                        }
                      });
                      setNewItems(temp);
                    }}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button
          disabled={!loading}
          outline
          color="primary"
          onClick={onClose}
        >
          Batal
        </Button>
        <Button
          disabled={!loading}
          color="primary"
          onClick={() => {
            onAction(newItems);
          }}
        >
          {actionType === "approve" ? "Setujui" : "Tolak"}
        </Button>
        {!loading && <div className="loading position-absolute" />}
      </ModalFooter>
    </Modal>
  );
};

export default React.memo(ActionModal);
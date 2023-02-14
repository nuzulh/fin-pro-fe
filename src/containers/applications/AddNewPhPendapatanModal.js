import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { addPhPendapatanItem, getPhPendapatanList } from 'redux/actions';
import CurrencyFormat from 'react-currency-format';
import { nanoid } from 'nanoid';

const initialState = {
  id: '',
  product_name: '',
  brand_name: '',
  quantity: 1,
  price: 0,
  tax: 0,
  total: 0,
  formatted_price: '',
};

const AddNewPhPendapatanModal = ({
  modalOpen,
  toggleModal,
  addPhPendapatanItemAction,
  getPhPendapatanListAction,
}) => {
  const [state, setState] = useState(initialState);

  const addNewItem = () => {
    const newItem = {
      id: nanoid(),
      product_name: state.product_name,
      brand_name: state.brand_name,
      quantity: state.quantity,
      price: state.price,
      tax: state.tax,
      total: state.total,
    };
    addPhPendapatanItemAction(newItem);
    toggleModal();
    getPhPendapatanListAction();
    setState(initialState);
  };

  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="ph-pendapatan.add-new-title" />
      </ModalHeader>
      <ModalBody>
        <Label className="mt-4">
          <IntlMessages id="ph-pendapatan.name" />
        </Label>
        <Input
          type="text"
          defaultValue={state.product_name}
          onChange={(event) =>
            setState({ ...state, product_name: event.target.value })
          }
        />
        <Label className="mt-4">
          <IntlMessages id="ph-pendapatan.brand" />
        </Label>
        <Input
          type="text"
          defaultValue={state.brand_name}
          onChange={(event) =>
            setState({ ...state, brand_name: event.target.value })
          }
        />
        <Label className="mt-4">
          <IntlMessages id="ph-pendapatan.quantity" />
        </Label>
        <Input
          type="number"
          defaultValue={state.quantity}
          onChange={(event) => {
            if (event.target.value) {
              setState({ ...state, quantity: parseInt(event.target.value) });
            }
          }}
        />
        <Label className="mt-4">
          <IntlMessages id="ph-pendapatan.price" />
        </Label>
        <CurrencyFormat
          className="form-control"
          value={state.price}
          thousandSeparator={true}
          prefix={'Rp'}
          suffix={',00'}
          onValueChange={(values) => {
            const { formattedValue, value } = values;
            const total = parseInt(value) * state.quantity;
            const tax = total * 0.1;
            const priceTax = total + tax;
            if (value) {
              setState({
                ...state,
                tax: tax,
                total: priceTax,
                price: parseInt(value),
                formatted_price: formattedValue,
              });
            }
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" outline onClick={toggleModal}>
          <IntlMessages id="ph-pendapatan.cancel" />
        </Button>
        <Button color="success" onClick={addNewItem}>
          <IntlMessages id="ph-pendapatan.submit" />
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ pendapatanApp }) => {
  return pendapatanApp;
};
export default connect(mapStateToProps, {
  addPhPendapatanItemAction: addPhPendapatanItem,
  getPhPendapatanListAction: getPhPendapatanList,
})(AddNewPhPendapatanModal);

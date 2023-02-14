import {
  FEE_GET_LIST,
  FEE_GET_LIST_SUCCESS,
  FEE_GET_LIST_ERROR,
  FEE_GET_LIST_WITH_FILTER,
  FEE_GET_LIST_WITH_ORDER,
  FEE_GET_LIST_SEARCH,
  FEE_ADD_ITEM,
  FEE_ADD_ITEM_SUCCESS,
  FEE_ADD_ITEM_ERROR,
  FEE_EDIT_ITEM,
  FEE_EDIT_ITEM_SUCCESS,
  FEE_EDIT_ITEM_ERROR,
} from "../actions";

export const getFeeList = (fee_project_id) => ({
  type: FEE_GET_LIST,
  payload: fee_project_id,
});

export const getFeeListSuccess = (items) => ({
  type: FEE_GET_LIST_SUCCESS,
  payload: items,
});

export const getFeeListError = (error) => ({
  type: FEE_GET_LIST_ERROR,
  payload: error,
});

export const getFeeListWithFilter = (column, value) => ({
  type: FEE_GET_LIST_WITH_FILTER,
  payload: { column, value },
});

export const getFeeListWithOrder = (column) => ({
  type: FEE_GET_LIST_WITH_ORDER,
  payload: column,
});

export const getFeeListSearch = (keyword) => ({
  type: FEE_GET_LIST_SEARCH,
  payload: keyword,
});

export const addFeeItem = (item, history) => ({
  type: FEE_ADD_ITEM,
  payload: { item, history },
});

export const addFeeItemSuccess = (items) => ({
  type: FEE_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addFeeItemError = (error) => ({
  type: FEE_ADD_ITEM_ERROR,
  payload: error,
});

export const editFeeItem = (id, item, isReport, history) => ({
  type: FEE_EDIT_ITEM,
  payload: { id, item, isReport, history },
});

export const editFeeItemSuccess = (items) => ({
  type: FEE_EDIT_ITEM_SUCCESS,
  payload: items,
});

export const editFeeItemError = (error) => ({
  type: FEE_EDIT_ITEM_ERROR,
  payload: error,
});

import {
  PENDAPATAN_GET_LIST,
  PENDAPATAN_GET_LIST_SUCCESS,
  PENDAPATAN_GET_LIST_ERROR,
  PENDAPATAN_GET_LIST_WITH_FILTER,
  PENDAPATAN_GET_LIST_WITH_ORDER,
  PENDAPATAN_GET_LIST_SEARCH,
  PENDAPATAN_ADD_ITEM,
  PENDAPATAN_ADD_ITEM_SUCCESS,
  PENDAPATAN_ADD_ITEM_ERROR,
  PENDAPATAN_EDIT_ITEM,
  PENDAPATAN_EDIT_ITEM_SUCCESS,
  PENDAPATAN_EDIT_ITEM_ERROR,
} from "../actions";

export const getPendapatanList = (pendapatan_id) => ({
  type: PENDAPATAN_GET_LIST,
  payload: pendapatan_id,
});

export const getPendapatanListSuccess = (items) => ({
  type: PENDAPATAN_GET_LIST_SUCCESS,
  payload: items,
});

export const getPendapatanListError = (error) => ({
  type: PENDAPATAN_GET_LIST_ERROR,
  payload: error,
});

export const getPendapatanListWithFilter = (column, value) => ({
  type: PENDAPATAN_GET_LIST_WITH_FILTER,
  payload: { column, value },
});

export const getPendapatanListWithOrder = (column) => ({
  type: PENDAPATAN_GET_LIST_WITH_ORDER,
  payload: column,
});

export const getPendapatanListSearch = (keyword) => ({
  type: PENDAPATAN_GET_LIST_SEARCH,
  payload: keyword,
});

export const addPendapatanItem = (item, history) => ({
  type: PENDAPATAN_ADD_ITEM,
  payload: { item, history },
});

export const addPendapatanItemSuccess = (items) => ({
  type: PENDAPATAN_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addPendapatanItemError = (error) => ({
  type: PENDAPATAN_ADD_ITEM_ERROR,
  payload: error,
});

export const editPendapatanItem = (id, item) => ({
  type: PENDAPATAN_EDIT_ITEM,
  payload: { id, item },
});

export const editPendapatanItemSuccess = (items) => ({
  type: PENDAPATAN_EDIT_ITEM_SUCCESS,
  payload: items,
});

export const editPendapatanItemError = (error) => ({
  type: PENDAPATAN_EDIT_ITEM_ERROR,
  payload: error,
});

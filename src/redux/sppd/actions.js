import {
  SPPD_GET_LIST,
  SPPD_GET_LIST_SUCCESS,
  SPPD_GET_LIST_ERROR,
  SPPD_GET_LIST_WITH_FILTER,
  SPPD_GET_LIST_WITH_ORDER,
  SPPD_GET_LIST_SEARCH,
  SPPD_ADD_ITEM,
  SPPD_ADD_ITEM_SUCCESS,
  SPPD_ADD_ITEM_ERROR,
  SPPD_EDIT_ITEM,
  SPPD_EDIT_ITEM_SUCCESS,
  SPPD_EDIT_ITEM_ERROR,
} from "../actions";

export const getSppdList = (sppd_id) => ({
  type: SPPD_GET_LIST,
  payload: sppd_id,
});

export const getSppdListSuccess = (items) => ({
  type: SPPD_GET_LIST_SUCCESS,
  payload: items,
});

export const getSppdListError = (error) => ({
  type: SPPD_GET_LIST_ERROR,
  payload: error,
});

export const getSppdListWithFilter = (column, value) => ({
  type: SPPD_GET_LIST_WITH_FILTER,
  payload: { column, value },
});

export const getSppdListWithOrder = (column) => ({
  type: SPPD_GET_LIST_WITH_ORDER,
  payload: column,
});

export const getSppdListSearch = (keyword) => ({
  type: SPPD_GET_LIST_SEARCH,
  payload: keyword,
});

export const addSppdItem = (item, history) => ({
  type: SPPD_ADD_ITEM,
  payload: { item, history },
});

export const addSppdItemSuccess = (items) => ({
  type: SPPD_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addSppdItemError = (error) => ({
  type: SPPD_ADD_ITEM_ERROR,
  payload: error,
});

export const editSppdItem = (id, item, isReport, history) => ({
  type: SPPD_EDIT_ITEM,
  payload: { id, item, isReport, history },
});

export const editSppdItemSuccess = (items) => ({
  type: SPPD_EDIT_ITEM_SUCCESS,
  payload: items,
});

export const editSppdItemError = (error) => ({
  type: SPPD_EDIT_ITEM_ERROR,
  payload: error,
});

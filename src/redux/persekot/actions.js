import {
  PERSEKOT_GET_LIST,
  PERSEKOT_GET_LIST_SUCCESS,
  PERSEKOT_GET_LIST_ERROR,
  PERSEKOT_GET_LIST_WITH_FILTER,
  PERSEKOT_GET_LIST_WITH_ORDER,
  PERSEKOT_GET_LIST_SEARCH,
  PERSEKOT_ADD_ITEM,
  PERSEKOT_ADD_ITEM_SUCCESS,
  PERSEKOT_ADD_ITEM_ERROR,
  PERSEKOT_EDIT_ITEM,
  PERSEKOT_EDIT_ITEM_SUCCESS,
  PERSEKOT_EDIT_ITEM_ERROR,
  PERSEKOT_REPORT_ITEM,
  PERSEKOT_REPORT_ITEM_SUCCESS,
  PERSEKOT_REPORT_ITEM_ERROR,
} from "../actions";

export const getPersekotList = (persekot_id, status) => ({
  type: PERSEKOT_GET_LIST,
  payload: { persekot_id, status },
});

export const getPersekotListSuccess = (items) => ({
  type: PERSEKOT_GET_LIST_SUCCESS,
  payload: items,
});

export const getPersekotListError = (error) => ({
  type: PERSEKOT_GET_LIST_ERROR,
  payload: error,
});

export const getPersekotListWithFilter = (column, value) => ({
  type: PERSEKOT_GET_LIST_WITH_FILTER,
  payload: { column, value },
});

export const getPersekotListWithOrder = (column) => ({
  type: PERSEKOT_GET_LIST_WITH_ORDER,
  payload: column,
});

export const getPersekotListSearch = (keyword) => ({
  type: PERSEKOT_GET_LIST_SEARCH,
  payload: keyword,
});

export const addPersekotItem = (item, history) => ({
  type: PERSEKOT_ADD_ITEM,
  payload: { item, history },
});

export const addPersekotItemSuccess = (items) => ({
  type: PERSEKOT_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addPersekotItemError = (error) => ({
  type: PERSEKOT_ADD_ITEM_ERROR,
  payload: error,
});

export const editPersekotItem = (id, item) => ({
  type: PERSEKOT_EDIT_ITEM,
  payload: { id, item },
});

export const editPersekotItemSuccess = (items) => ({
  type: PERSEKOT_EDIT_ITEM_SUCCESS,
  payload: items,
});

export const editPersekotItemError = (error) => ({
  type: PERSEKOT_EDIT_ITEM_ERROR,
  payload: error,
});

export const reportPersekotItem = (item, history) => ({
  type: PERSEKOT_REPORT_ITEM,
  payload: { item, history },
});

export const reportPersekotItemSuccess = (items) => ({
  type: PERSEKOT_REPORT_ITEM_SUCCESS,
  payload: items,
});

export const reportPersekotItemError = (error) => ({
  type: PERSEKOT_REPORT_ITEM_ERROR,
  payload: error,
});

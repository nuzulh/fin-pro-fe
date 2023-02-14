import {
  RPB_GET_LIST,
  RPB_GET_LIST_SUCCESS,
  RPB_GET_LIST_ERROR,
  RPB_GET_LIST_WITH_FILTER,
  RPB_GET_LIST_WITH_ORDER,
  RPB_GET_LIST_SEARCH,
  RPB_ADD_ITEM,
  RPB_ADD_ITEM_SUCCESS,
  RPB_ADD_ITEM_ERROR,
  RPB_EDIT_ITEM,
  RPB_EDIT_ITEM_SUCCESS,
  RPB_EDIT_ITEM_ERROR,
} from "../actions";

export const getRpbList = (pkm_id, status) => ({
  type: RPB_GET_LIST,
  payload: { pkm_id, status },
});

export const getRpbListSuccess = (items) => ({
  type: RPB_GET_LIST_SUCCESS,
  payload: items,
});

export const getRpbListError = (error) => ({
  type: RPB_GET_LIST_ERROR,
  payload: error,
});

export const getRpbListWithFilter = (column, value) => ({
  type: RPB_GET_LIST_WITH_FILTER,
  payload: { column, value },
});

export const getRpbListWithOrder = (column) => ({
  type: RPB_GET_LIST_WITH_ORDER,
  payload: column,
});

export const getRpbListSearch = (keyword) => ({
  type: RPB_GET_LIST_SEARCH,
  payload: keyword,
});

export const addRpbItem = (item, history) => ({
  type: RPB_ADD_ITEM,
  payload: { item, history },
});

export const addRpbItemSuccess = (items) => ({
  type: RPB_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addRpbItemError = (error) => ({
  type: RPB_ADD_ITEM_ERROR,
  payload: error,
});

export const editRpbItem = (id, item) => ({
  type: RPB_EDIT_ITEM,
  payload: { id, item },
});

export const editRpbItemSuccess = (items) => ({
  type: RPB_EDIT_ITEM_SUCCESS,
  payload: items,
});

export const editRpbItemError = (error) => ({
  type: RPB_EDIT_ITEM_ERROR,
  payload: error,
});

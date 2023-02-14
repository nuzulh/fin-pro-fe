import {
  RKA_GET_LIST,
  RKA_GET_LIST_SUCCESS,
  RKA_GET_LIST_ERROR,
  RKA_GET_LIST_WITH_FILTER,
  RKA_GET_LIST_WITH_ORDER,
  RKA_GET_LIST_SEARCH,
  RKA_ADD_ITEM,
  RKA_ADD_ITEM_SUCCESS,
  RKA_ADD_ITEM_ERROR,
  RKA_EDIT_ITEM,
  RKA_EDIT_ITEM_SUCCESS,
  RKA_EDIT_ITEM_ERROR,
} from "../actions";

export const getRkaList = () => ({
  type: RKA_GET_LIST,
});

export const getRkaListSuccess = (items) => ({
  type: RKA_GET_LIST_SUCCESS,
  payload: items,
});

export const getRkaListError = (error) => ({
  type: RKA_GET_LIST_ERROR,
  payload: error,
});

export const getRkaListWithFilter = (column, value) => ({
  type: RKA_GET_LIST_WITH_FILTER,
  payload: { column, value },
});

export const getRkaListWithOrder = (column) => ({
  type: RKA_GET_LIST_WITH_ORDER,
  payload: column,
});

export const getRkaListSearch = (keyword) => ({
  type: RKA_GET_LIST_SEARCH,
  payload: keyword,
});

export const addRkaItem = (item, history) => ({
  type: RKA_ADD_ITEM,
  payload: { item, history },
});

export const addRkaItemSuccess = (items) => ({
  type: RKA_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addRkaItemError = (error) => ({
  type: RKA_ADD_ITEM_ERROR,
  payload: error,
});

export const editRkaItem = (id, item) => ({
  type: RKA_EDIT_ITEM,
  payload: { id, item },
});

export const editRkaItemSuccess = (items) => ({
  type: RKA_EDIT_ITEM_SUCCESS,
  payload: items,
});

export const editRkaItemError = (error) => ({
  type: RKA_EDIT_ITEM_ERROR,
  payload: error,
});

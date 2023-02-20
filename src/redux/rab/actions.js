import {
  RAB_GET_LIST,
  RAB_GET_LIST_SUCCESS,
  RAB_GET_LIST_ERROR,
  RAB_GET_LIST_WITH_FILTER,
  RAB_GET_LIST_WITH_ORDER,
  RAB_GET_LIST_SEARCH,
  RAB_ADD_ITEM,
  RAB_ADD_ITEM_SUCCESS,
  RAB_ADD_ITEM_ERROR,
  RAB_EDIT_ITEM,
  RAB_EDIT_ITEM_SUCCESS,
  RAB_EDIT_ITEM_ERROR,
  RAB_PROGRES_GET_LIST,
  RAB_PROGRES_GET_LIST_SUCCESS,
  RAB_PROGRES_GET_LIST_ERROR,
  RAB_SUMMARY_EXPORT,
  RAB_SUMMARY_EXPORT_SUCCESS,
  RAB_SUMMARY_EXPORT_ERROR,
} from "../actions";

export const getRabList = (rab_id) => ({
  type: RAB_GET_LIST,
  payload: rab_id,
});

export const getRabListSuccess = (items) => ({
  type: RAB_GET_LIST_SUCCESS,
  payload: items,
});

export const getRabListError = (error) => ({
  type: RAB_GET_LIST_ERROR,
  payload: error,
});

export const getRabListWithFilter = (column, value) => ({
  type: RAB_GET_LIST_WITH_FILTER,
  payload: { column, value },
});

export const getRabListWithOrder = (column) => ({
  type: RAB_GET_LIST_WITH_ORDER,
  payload: column,
});

export const getRabListSearch = (keyword) => ({
  type: RAB_GET_LIST_SEARCH,
  payload: keyword,
});

export const addRabItem = (item, history) => ({
  type: RAB_ADD_ITEM,
  payload: { item, history },
});

export const addRabItemSuccess = (items) => ({
  type: RAB_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addRabItemError = (error) => ({
  type: RAB_ADD_ITEM_ERROR,
  payload: error,
});

export const editRabItem = (id, item) => ({
  type: RAB_EDIT_ITEM,
  payload: { id, item },
});

export const editRabItemSuccess = (items) => ({
  type: RAB_EDIT_ITEM_SUCCESS,
  payload: items,
});

export const editRabItemError = (error) => ({
  type: RAB_EDIT_ITEM_ERROR,
  payload: error,
});

export const getRabProgresList = () => ({
  type: RAB_PROGRES_GET_LIST,
});

export const getRabProgresListSuccess = (items) => ({
  type: RAB_PROGRES_GET_LIST_SUCCESS,
  payload: items,
});

export const getRabProgresListError = (error) => ({
  type: RAB_PROGRES_GET_LIST_ERROR,
  payload: error,
});

export const exportRabSummary = (headers) => ({
  type: RAB_SUMMARY_EXPORT,
  payload: headers,
});

export const exportRabSummarySuccess = (items) => ({
  type: RAB_SUMMARY_EXPORT_SUCCESS,
  payload: items,
});

export const exportRabSummaryError = (error) => ({
  type: RAB_SUMMARY_EXPORT_ERROR,
  payload: error,
});

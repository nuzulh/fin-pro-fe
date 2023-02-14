import {
  APPROVE_ITEM,
  APPROVE_ITEM_SUCCESS,
  APPROVE_ITEM_ERROR,
  REJECT_ITEM,
  REJECT_ITEM_SUCCESS,
  REJECT_ITEM_ERROR,
  DASHBOARD_GET_PENDING_COUNT,
  DASHBOARD_GET_PENDING_COUNT_SUCCESS,
  DASHBOARD_GET_PENDING_COUNT_ERROR,
  TARGET_ADD_ITEM,
  TARGET_ADD_ITEM_SUCCESS,
  TARGET_ADD_ITEM_ERROR,
} from "../actions";

export const approveItem = (type, key, value) => ({
  type: APPROVE_ITEM,
  payload: { type, key, value },
});

export const approveItemSuccess = (item) => ({
  type: APPROVE_ITEM_SUCCESS,
  payload: item,
});

export const approveItemError = (error) => ({
  type: APPROVE_ITEM_ERROR,
  payload: error,
});

export const rejectItem = (type, key, value, reason) => ({
  type: REJECT_ITEM,
  payload: { type, key, value, reason },
});

export const rejectItemSuccess = (item) => ({
  type: REJECT_ITEM_SUCCESS,
  payload: item,
});

export const rejectItemError = (error) => ({
  type: REJECT_ITEM_ERROR,
  payload: error,
});

export const getPendingCount = () => ({
  type: DASHBOARD_GET_PENDING_COUNT,
});

export const getPendingCountSuccess = (item) => ({
  type: DASHBOARD_GET_PENDING_COUNT_SUCCESS,
  payload: item,
});

export const getPendingCountError = (error) => ({
  type: DASHBOARD_GET_PENDING_COUNT_ERROR,
  payload: error,
});

export const addTargetItem = (item, history) => ({
  type: TARGET_ADD_ITEM,
  payload: { item, history },
});

export const addTargetItemSuccess = (item) => ({
  type: TARGET_ADD_ITEM_SUCCESS,
  payload: item,
});

export const addTargetItemError = (error) => ({
  type: TARGET_ADD_ITEM_ERROR,
  payload: error,
});

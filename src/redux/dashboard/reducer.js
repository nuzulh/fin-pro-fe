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

const INIT_STATE = {
  pendingItem: null,
  pendingCountItem: null,
  targetItem: null,
  error: "",
  loading: true,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case APPROVE_ITEM:
      return {
        ...state,
        error: "",
        loading: false,
      };

    case APPROVE_ITEM_SUCCESS:
      return {
        ...state,
        pendingItem: action.payload,
        loading: true,
      };

    case APPROVE_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    case REJECT_ITEM:
      return {
        ...state,
        error: "",
        loading: false,
      };

    case REJECT_ITEM_SUCCESS:
      return {
        ...state,
        pendingItem: action.payload,
        loading: true,
      };

    case REJECT_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    case DASHBOARD_GET_PENDING_COUNT:
      return {
        ...state,
        error: "",
        loading: false,
      };

    case DASHBOARD_GET_PENDING_COUNT_SUCCESS:
      return {
        ...state,
        pendingCountItem: action.payload,
        loading: true,
      };

    case DASHBOARD_GET_PENDING_COUNT_ERROR:
      return { ...state, loading: true, error: action.payload };

    case TARGET_ADD_ITEM:
      return {
        ...state,
        loading: false,
      };

    case TARGET_ADD_ITEM_SUCCESS:
      return {
        ...state,
        targetItem: action.payload,
        loading: true,
      };

    case TARGET_ADD_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    default:
      return { ...state, error: "" };
  }
};

import {
  CATEGORY_GET_LIST,
  CATEGORY_GET_LIST_SUCCESS,
  CATEGORY_GET_LIST_ERROR,
  CATEGORY_ADD_ITEM,
  CATEGORY_ADD_ITEM_SUCCESS,
  CATEGORY_ADD_ITEM_ERROR,
} from "../actions";

const INIT_STATE = {
  categoryItems: null,
  error: "",
  loading: true,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CATEGORY_GET_LIST:
      return {
        ...state,
        loading: false,
        error: "",
      };

    case CATEGORY_GET_LIST_SUCCESS:
      return {
        ...state,
        loading: true,
        categoryItems: action.payload,
      };

    case CATEGORY_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case CATEGORY_ADD_ITEM:
      return { ...state, loading: false };

    case CATEGORY_ADD_ITEM_SUCCESS:
      return {
        ...state,
        loading: true,
        categoryItems: action.payload,
      };

    case CATEGORY_ADD_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    default:
      return { ...state };
  }
};

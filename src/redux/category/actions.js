import {
  CATEGORY_GET_LIST,
  CATEGORY_GET_LIST_SUCCESS,
  CATEGORY_GET_LIST_ERROR,
  CATEGORY_ADD_ITEM,
  CATEGORY_ADD_ITEM_SUCCESS,
  CATEGORY_ADD_ITEM_ERROR,
} from "../actions";

export const getCategoryList = (type) => ({
  type: CATEGORY_GET_LIST,
  payload: type,
});

export const getCategoryListSuccess = (items) => ({
  type: CATEGORY_GET_LIST_SUCCESS,
  payload: items,
});

export const getCategoryListError = (error) => ({
  type: CATEGORY_GET_LIST_ERROR,
  payload: error,
});

export const addCategoryItem = (item) => ({
  type: CATEGORY_ADD_ITEM,
  payload: item,
});

export const addCategoryItemSuccess = (items) => ({
  type: CATEGORY_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addCategoryItemError = (error) => ({
  type: CATEGORY_ADD_ITEM_ERROR,
  payload: error,
});
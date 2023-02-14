import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  CATEGORY_GET_LIST,
  CATEGORY_ADD_ITEM,
} from "redux/actions";
import {
  getCategoryListSuccess,
  getCategoryListError,
  addCategoryItemSuccess,
  addCategoryItemError,
} from "./actions";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";

const getCategoryListRequest = async (type) => {
  const user = getCurrentUser();
  if (type) {
    return await axios
      .get(`${servicePath}/category?category_type=${type}`, {
        headers: {
          "X-Secured-With": user.token,
        }
      })
      .then((res) => res.data)
      .catch((err) => err.response);
  }
  return await axios
    .get(`${servicePath}/category`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* getCategoryList({ payload }) {
  try {
    const res = yield call(getCategoryListRequest, payload);
    if (!res.data.error) {
      yield put(getCategoryListSuccess(res.data));
    } else {
      yield put(getCategoryListError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getCategoryListError(error.toString()));
  }
}

const addCategoryItemRequest = async (item) => {
  const user = getCurrentUser();
  return await axios
    .post(`${servicePath}/category`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* addCategoryItem({ payload }) {
  try {
    const res = yield call(addCategoryItemRequest, payload);
    if (!res.data.error) {
      const items = yield call(getCategoryListRequest, payload.category_type);
      yield put(addCategoryItemSuccess(items.data));
    } else {
      yield put(addCategoryItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(addCategoryItemError(error.toString()));
  }
}

export function* watchGetList() {
  yield takeEvery(CATEGORY_GET_LIST, getCategoryList);
}

export function* watchAddItem() {
  yield takeEvery(CATEGORY_ADD_ITEM, addCategoryItem);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
  ]);
}

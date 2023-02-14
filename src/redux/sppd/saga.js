import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  SPPD_GET_LIST,
  SPPD_ADD_ITEM,
  SPPD_EDIT_ITEM,
} from "redux/actions";
import {
  getSppdListSuccess,
  getSppdListError,
  addSppdItemSuccess,
  addSppdItemError,
  editSppdItemSuccess,
  editSppdItemError,
} from "./actions";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";

const getSppdListRequest = async (sppd_id) => {
  const user = getCurrentUser();
  if (sppd_id) {
    return await axios
      .get(`${servicePath}/sppd?sppd_id=${sppd_id}`, {
        headers: {
          "X-Secured-With": user.token,
        }
      })
      .then((res) => res.data)
      .catch((err) => err.response);
  }
  return await axios
    .get(`${servicePath}/sppd`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* getSppdList({ payload }) {
  try {
    const res = yield call(getSppdListRequest, payload);
    if (!res.data.error) {
      if (payload) {
        yield put(getSppdListSuccess([res.data]));
      } else {
        yield put(getSppdListSuccess(res.data));
      }
    } else {
      yield put(getSppdListError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getSppdListError(error.toString()));
  }
}

const addSppdItemRequest = async (item) => {
  const user = getCurrentUser();
  return await axios
    .post(`${servicePath}/sppd`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* addSppdItem({ payload }) {
  const { item, history } = payload;
  try {
    const res = yield call(addSppdItemRequest, item);
    if (!res.data.error) {
      const items = yield call(getSppdListRequest);
      yield put(addSppdItemSuccess(items.data));
      history.goBack();
    } else {
      yield put(addSppdItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(addSppdItemError(error.toString()));
  }
}

const editSppdItemRequest = async (id, item, isReport) => {
  const user = getCurrentUser();
  return await axios
    .patch(`${servicePath}/sppd${isReport ? "/report" : ""}?sppd_id=${id}`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* editSppdItem({ payload }) {
  const { id, item, isReport, history } = payload;
  try {
    const res = yield call(editSppdItemRequest, id, item, isReport);
    if (!res.data.error) {
      const items = yield call(getSppdListRequest);
      yield put(editSppdItemSuccess(items.data));
      if (history) history.goBack();
    } else {
      yield put(editSppdItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(editSppdItemError(error.toString()));
  }
}

export function* watchGetList() {
  yield takeEvery(SPPD_GET_LIST, getSppdList);
}

export function* watchAddItem() {
  yield takeEvery(SPPD_ADD_ITEM, addSppdItem);
}

export function* watchEditItem() {
  yield takeEvery(SPPD_EDIT_ITEM, editSppdItem);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchEditItem),
  ]);
}

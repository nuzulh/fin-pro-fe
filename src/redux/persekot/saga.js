import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  PERSEKOT_GET_LIST,
  PERSEKOT_ADD_ITEM,
  PERSEKOT_EDIT_ITEM,
  PERSEKOT_REPORT_ITEM,
} from "redux/actions";
import {
  getPersekotListSuccess,
  getPersekotListError,
  addPersekotItemSuccess,
  addPersekotItemError,
  editPersekotItemSuccess,
  editPersekotItemError,
  reportPersekotItemSuccess,
  reportPersekotItemError,
} from "./actions";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";

const getPersekotListRequest = async (persekot_id, status) => {
  const user = getCurrentUser();
  if (persekot_id) {
    return await axios
      .get(`${servicePath}/persekot?persekot_id=${persekot_id}&status=${status}`, {
        headers: {
          "X-Secured-With": user.token,
        }
      })
      .then((res) => res.data)
      .catch((err) => err.response);
  }
  return await axios
    .get(`${servicePath}/persekot`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* getPersekotList({ payload }) {
  const { persekot_id, status } = payload;
  try {
    const res = yield call(getPersekotListRequest, persekot_id, status);
    if (!res.data.error) {
      if (persekot_id) {
        yield put(getPersekotListSuccess([res.data]));
      } else {
        yield put(getPersekotListSuccess(res.data));
      }
    } else {
      yield put(getPersekotListError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getPersekotListError(error.toString()));
  }
}

const addPersekotItemRequest = async (item) => {
  const user = getCurrentUser();
  return await axios
    .post(`${servicePath}/persekot${item.persekot_no ? "" : "/import/save"}`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* addPersekotItem({ payload }) {
  const { item, history } = payload;
  try {
    const res = yield call(addPersekotItemRequest, item);
    if (!res.data.error) {
      const items = yield call(getPersekotListRequest);
      yield put(addPersekotItemSuccess(items.data));
      if (history) history.goBack();
    } else {
      yield put(addPersekotItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(addPersekotItemError(error.toString()));
  }
}

const editPersekotItemRequest = async (id, item) => {
  const user = getCurrentUser();
  return await axios
    .patch(`${servicePath}/persekot?persekot_id=${id}`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* editPersekotItem({ payload }) {
  const { id, item } = payload;
  try {
    const res = yield call(editPersekotItemRequest, id, item);
    if (!res.data.error) {
      const items = yield call(getPersekotListRequest);
      yield put(editPersekotItemSuccess(items.data));
    } else {
      yield put(editPersekotItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(editPersekotItemError(error.toString()));
  }
}

const reportPersekotItemRequest = async (item) => {
  const user = getCurrentUser();
  return await axios
    .patch(`${servicePath}/persekot/report`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* reportPersekotItem({ payload }) {
  const { item, history } = payload;
  try {
    const res = yield call(reportPersekotItemRequest, item);
    if (!res.data.error) {
      const items = yield call(getPersekotListRequest);
      yield put(reportPersekotItemSuccess(items.data));
      if (history) history.goBack();
    } else {
      yield put(reportPersekotItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(reportPersekotItemError(error.toString()));
  }
}

export function* watchGetList() {
  yield takeEvery(PERSEKOT_GET_LIST, getPersekotList);
}

export function* watchAddItem() {
  yield takeEvery(PERSEKOT_ADD_ITEM, addPersekotItem);
}

export function* watchEditItem() {
  yield takeEvery(PERSEKOT_EDIT_ITEM, editPersekotItem);
}

export function* watchReportItem() {
  yield takeEvery(PERSEKOT_REPORT_ITEM, reportPersekotItem);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchEditItem),
    fork(watchReportItem),
  ]);
}

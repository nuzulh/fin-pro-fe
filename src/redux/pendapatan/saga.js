import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  PENDAPATAN_GET_LIST,
  PENDAPATAN_ADD_ITEM,
  PENDAPATAN_EDIT_ITEM,
} from "redux/actions";
import {
  getPendapatanListSuccess,
  getPendapatanListError,
  addPendapatanItemSuccess,
  addPendapatanItemError,
  editPendapatanItemSuccess,
  editPendapatanItemError,
} from "./actions";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";

const getPendapatanListRequest = async (pendapatan_id) => {
  const user = getCurrentUser();
  return await axios
    .get(`${servicePath}/income${pendapatan_id ? `?income_id=${pendapatan_id}` : ""}`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* getPendapatanList({ payload }) {
  try {
    const res = yield call(getPendapatanListRequest, payload);
    if (!res.data.error) {
      if (payload) {
        yield put(getPendapatanListSuccess([res.data]));
      } else {
        yield put(getPendapatanListSuccess(res.data));
      }
    } else {
      yield put(getPendapatanListError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getPendapatanListError(error.toString()));
  }
}

const addPendapatanItemRequest = async (item) => {
  const user = getCurrentUser();
  return await axios
    .post(`${servicePath}/income`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* addPendapatanItem({ payload }) {
  const { item, history } = payload;
  try {
    const res = yield call(addPendapatanItemRequest, item);
    if (!res.data.error) {
      const items = yield call(getPendapatanListRequest);
      yield put(addPendapatanItemSuccess(items.data));
      if (history) history.goBack();
    } else {
      yield put(addPendapatanItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(addPendapatanItemError(error.toString()));
  }
}

const editPendapatanItemRequest = async (id, item) => {
  const user = getCurrentUser();
  return await axios
    .patch(`${servicePath}/income?income_id=${id}`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* editPendapatanItem({ payload }) {
  const { id, item } = payload;
  try {
    const res = yield call(editPendapatanItemRequest, id, item);
    if (!res.data.error) {
      const items = yield call(getPendapatanListRequest);
      yield put(editPendapatanItemSuccess(items.data));
    } else {
      yield put(editPendapatanItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(editPendapatanItemError(error.toString()));
  }
}

export function* watchGetList() {
  yield takeEvery(PENDAPATAN_GET_LIST, getPendapatanList);
}

export function* watchAddItem() {
  yield takeEvery(PENDAPATAN_ADD_ITEM, addPendapatanItem);
}

export function* watchEditItem() {
  yield takeEvery(PENDAPATAN_EDIT_ITEM, editPendapatanItem);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchEditItem),
  ]);
}

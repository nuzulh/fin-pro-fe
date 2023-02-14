import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  RPB_GET_LIST,
  RPB_ADD_ITEM,
  RPB_EDIT_ITEM,
} from "redux/actions";
import {
  getRpbListSuccess,
  getRpbListError,
  addRpbItemSuccess,
  addRpbItemError,
  editRpbItemSuccess,
  editRpbItemError,
} from "./actions";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";

const getRpbListRequest = async (pkm_id, status) => {
  const user = getCurrentUser();
  if (pkm_id) {
    return await axios
      .get(`${servicePath}/pkm?pkm_id=${pkm_id}&status=${status}`, {
        headers: {
          "X-Secured-With": user.token,
        }
      })
      .then((res) => res.data)
      .catch((err) => err.response);
  }
  return await axios
    .get(`${servicePath}/pkm`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* getRpbList({ payload }) {
  const { pkm_id, status } = payload;
  try {
    const res = yield call(getRpbListRequest, pkm_id, status);
    if (!res.data.error) {
      if (pkm_id) {
        yield put(getRpbListSuccess([res.data]));
      } else {
        yield put(getRpbListSuccess(res.data));
      }
    } else {
      yield put(getRpbListError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getRpbListError(error.toString()));
  }
}

const addRpbItemRequest = async (item) => {
  const user = getCurrentUser();
  return await axios
    .post(`${servicePath}/pkm${item.pkm_no ? "" : "/import/save"}`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* addRpbItem({ payload }) {
  const { item, history } = payload;
  try {
    const res = yield call(addRpbItemRequest, item);
    if (!res.data.error) {
      const items = yield call(getRpbListRequest);
      yield put(addRpbItemSuccess(items));
      if (history) history.goBack();
    } else {
      yield put(addRpbItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(addRpbItemError(error.toString()));
  }
}

const editRpbItemRequest = async (id, item) => {
  const user = getCurrentUser();
  return await axios
    .patch(`${servicePath}/pkm?pkm_id=${id}`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* editRpbItem({ payload }) {
  const { id, item } = payload;
  try {
    const res = yield call(editRpbItemRequest, id, item);
    if (!res.data.error) {
      const items = yield call(getRpbListRequest);
      yield put(editRpbItemSuccess(items.data));
    } else {
      yield put(editRpbItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(editRpbItemError(error.toString()));
  }
}

export function* watchGetList() {
  yield takeEvery(RPB_GET_LIST, getRpbList);
}

export function* watchAddItem() {
  yield takeEvery(RPB_ADD_ITEM, addRpbItem);
}

export function* watchEditItem() {
  yield takeEvery(RPB_EDIT_ITEM, editRpbItem);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchEditItem),
  ]);
}

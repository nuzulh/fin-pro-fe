import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  APPROVE_ITEM,
  REJECT_ITEM,
  DASHBOARD_GET_PENDING_COUNT,
  TARGET_ADD_ITEM,
} from "redux/actions";
import {
  approveItemSuccess,
  approveItemError,
  rejectItemSuccess,
  rejectItemError,
  getPendingCountSuccess,
  getPendingCountError,
  addTargetItemSuccess,
  addTargetItemError,
} from "./actions";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";

const approveItemRequest = async (type, key, value) => {
  const user = getCurrentUser();
  return await axios
    .post(`${servicePath}/dashboard/${type}/approve?${key}=${value}`, null, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* approveItem({ payload }) {
  const { type, key, value } = payload;
  try {
    const res = yield call(approveItemRequest, type, key, value);
    if (!res.data.error) {
      yield put(approveItemSuccess(res.data));
      yield put(approveItemSuccess(null));
    } else {
      yield put(approveItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(approveItemError(error.toString()));
  }
}

const rejectItemRequest = async (type, key, value, reason) => {
  const user = getCurrentUser();
  return await axios
    .post(`${servicePath}/dashboard/${type}/reject?${key}=${value}`, {
      rejected_reason: reason,
    }, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* rejectItem({ payload }) {
  const { type, key, value, reason } = payload;
  try {
    const res = yield call(rejectItemRequest, type, key, value, reason);
    if (!res.data.error) {
      yield put(rejectItemSuccess(res.data));
      yield put(rejectItemSuccess(null));
    } else {
      yield put(rejectItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(rejectItemError(error.toString()));
  }
}

const getPendingCountRequest = async () => {
  const user = getCurrentUser();
  return await axios
    .get(`${servicePath}/dashboard`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* getPendingCount() {
  try {
    const res = yield call(getPendingCountRequest);
    if (!res.data.error) {
      yield put(getPendingCountSuccess(res.data));
    } else {
      yield put(getPendingCountError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getPendingCountError(error.toString()));
  }
}

const addTargetItemRequest = async (item) => {
  const user = getCurrentUser();
  return await axios
    .post(`${servicePath}/income/target`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* addTargetItem({ payload }) {
  const { item, history } = payload;
  try {
    const res = yield call(addTargetItemRequest, item);
    if (!res.data.error) {
      yield put(addTargetItemSuccess(res.data));
      if (history) history.goBack();
    } else {
      yield put(addTargetItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(addTargetItemError(error.toString()));
  }
}

export function* watchApproveItem() {
  yield takeEvery(APPROVE_ITEM, approveItem);
}

export function* watchRejectItem() {
  yield takeEvery(REJECT_ITEM, rejectItem);
}

export function* watchGetPendingCount() {
  yield takeEvery(DASHBOARD_GET_PENDING_COUNT, getPendingCount);
}

export function* watchAddTargetItem() {
  yield takeEvery(TARGET_ADD_ITEM, addTargetItem);
}

export default function* rootSaga() {
  yield all([
    fork(watchApproveItem),
    fork(watchRejectItem),
    fork(watchGetPendingCount),
    fork(watchAddTargetItem),
  ]);
}

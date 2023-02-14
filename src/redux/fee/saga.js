import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  FEE_GET_LIST,
  FEE_ADD_ITEM,
  FEE_EDIT_ITEM,
} from "redux/actions";
import {
  getFeeListSuccess,
  getFeeListError,
  addFeeItemSuccess,
  addFeeItemError,
  editFeeItemSuccess,
  editFeeItemError,
} from "./actions";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";

const getFeeListRequest = async (fee_project_id) => {
  const user = getCurrentUser();
  if (fee_project_id) {
    return await axios
      .get(`${servicePath}/fee_project?fee_project_id=${fee_project_id}`, {
        headers: {
          "X-Secured-With": user.token,
        }
      })
      .then((res) => res.data)
      .catch((err) => err.response);
  }
  return await axios
    .get(`${servicePath}/fee_project`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* getFeeList({ payload }) {
  try {
    const res = yield call(getFeeListRequest, payload);
    if (!res.data.error) {
      if (payload) {
        yield put(getFeeListSuccess([res.data]));
      } else {
        yield put(getFeeListSuccess(res.data));
      }
    } else {
      yield put(getFeeListError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getFeeListError(error.toString()));
  }
}

const addFeeItemRequest = async (item) => {
  const user = getCurrentUser();
  return await axios
    .post(`${servicePath}/fee_project`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* addFeeItem({ payload }) {
  const { item, history } = payload;
  try {
    const res = yield call(addFeeItemRequest, item);
    if (!res.data.error) {
      const items = yield call(getFeeListRequest);
      yield put(addFeeItemSuccess(items));
      history.goBack();
    } else {
      yield put(addFeeItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(addFeeItemError(error.toString()));
  }
}

const editFeeItemRequest = async (id, item, isReport) => {
  const user = getCurrentUser();
  return await axios
    .patch(`${servicePath}/fee_project${isReport ? "/report" : ""}?fee_project_id=${id}`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* editFeeItem({ payload }) {
  const { id, item, isReport, history } = payload;
  try {
    const res = yield call(editFeeItemRequest, id, item, isReport);
    if (!res.data.error) {
      const items = yield call(getFeeListRequest);
      yield put(editFeeItemSuccess(items.data));
      if (history) history.goBack();
    } else {
      yield put(editFeeItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(editFeeItemError(error.toString()));
  }
}

export function* watchGetList() {
  yield takeEvery(FEE_GET_LIST, getFeeList);
}

export function* watchAddItem() {
  yield takeEvery(FEE_ADD_ITEM, addFeeItem);
}

export function* watchEditItem() {
  yield takeEvery(FEE_EDIT_ITEM, editFeeItem);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchEditItem),
  ]);
}

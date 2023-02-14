import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  RAB_GET_LIST,
  RAB_ADD_ITEM,
  RAB_EDIT_ITEM,
  RAB_PROGRES_GET_LIST,
} from "redux/actions";
import {
  getRabListSuccess,
  getRabListError,
  addRabItemSuccess,
  addRabItemError,
  editRabItemSuccess,
  editRabItemError,
  getRabProgresListSuccess,
  getRabProgresListError,
} from "./actions";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";

const getRabListRequest = async (rab_id) => {
  const user = getCurrentUser();
  if (rab_id) {
    return await axios
      .get(`${servicePath}/rab?rab_id=${rab_id}`, {
        headers: {
          "X-Secured-With": user.token,
        }
      })
      .then((res) => res.data)
      .catch((err) => err.response);
  }
  return await axios
    .get(`${servicePath}/rab`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* getRabList({ payload }) {
  try {
    const res = yield call(getRabListRequest, payload);
    if (!res.data.error) {
      if (payload) {
        yield put(getRabListSuccess([res.data]));
      } else {
        yield put(getRabListSuccess(res.data));
      }
    } else {
      yield put(getRabListError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getRabListError(error.toString()));
  }
}

const addRabItemRequest = async (item) => {
  const user = getCurrentUser();
  return await axios
    .post(`${servicePath}/rab${item.rab_no ? "" : "/import/save"}`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* addRabItem({ payload }) {
  const { item, history } = payload;
  try {
    const res = yield call(addRabItemRequest, item);
    if (!res.data.error) {
      const items = yield call(getRabListRequest);
      yield put(addRabItemSuccess(items.data));
      if (history) history.goBack();
    } else {
      yield put(addRabItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(addRabItemError(error.toString()));
  }
}

const editRabItemRequest = async (id, item) => {
  const user = getCurrentUser();
  return await axios
    .patch(`${servicePath}/rab?rab_id=${id}`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* editRabItem({ payload }) {
  const { id, item } = payload;
  try {
    const res = yield call(editRabItemRequest, id, item);
    if (!res.data.error) {
      const items = yield call(getRabListRequest);
      yield put(editRabItemSuccess(items.data));
    } else {
      yield put(editRabItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(editRabItemError(error.toString()));
  }
}

const getRabProgresListRequest = async () => {
  const user = getCurrentUser();
  return await axios
    .get(`${servicePath}/rab/progress`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* getRabProgresList() {
  try {
    const res = yield call(getRabProgresListRequest);
    if (!res.data.error) {
      const items = yield call(getRabListRequest);
      yield put(getRabProgresListSuccess(items.data));
    } else {
      yield put(getRabProgresListError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getRabProgresListError(error.toString()));
  }
}

export function* watchGetList() {
  yield takeEvery(RAB_GET_LIST, getRabList);
}

export function* watchAddItem() {
  yield takeEvery(RAB_ADD_ITEM, addRabItem);
}

export function* watchEditItem() {
  yield takeEvery(RAB_EDIT_ITEM, editRabItem);
}

export function* watchGetProgresList() {
  yield takeEvery(RAB_PROGRES_GET_LIST, getRabProgresList);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchEditItem),
    fork(watchGetProgresList),
  ]);
}

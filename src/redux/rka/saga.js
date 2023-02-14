import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  RKA_GET_LIST,
  RKA_ADD_ITEM,
  RKA_EDIT_ITEM,
} from "redux/actions";
import {
  getRkaListSuccess,
  getRkaListError,
  addRkaItemSuccess,
  addRkaItemError,
  editRkaItemSuccess,
  editRkaItemError,
} from "./actions";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";

const getRkaListRequest = async () => {
  const user = getCurrentUser();
  return await axios
    .get(`${servicePath}/rka`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* getRkaList() {
  try {
    const res = yield call(getRkaListRequest);
    if (!res.data.error) {
      yield put(getRkaListSuccess(res.data));
    } else {
      yield put(getRkaListError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getRkaListError(error.toString()));
  }
}

const addRkaItemRequest = async (item) => {
  const user = getCurrentUser();
  return await axios
    .post(`${servicePath}/rka${item.unit ? "" : "/import/save"}`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* addRkaItem({ payload }) {
  const { item, history } = payload;
  try {
    const res = yield call(addRkaItemRequest, item);
    if (!res.data.error) {
      const items = yield call(getRkaListRequest);
      yield put(addRkaItemSuccess(items.data));
      if (history) history.goBack();
    } else {
      yield put(addRkaItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(addRkaItemError(error.toString()));
  }
}

const editRkaItemRequest = async (id, item) => {
  const user = getCurrentUser();
  return await axios
    .patch(`${servicePath}/rka?rka_id=${id}`, item, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* editRkaItem({ payload }) {
  const { id, item } = payload;
  try {
    const res = yield call(editRkaItemRequest, id, item);
    if (!res.data.error) {
      const items = yield call(getRkaListRequest);
      yield put(editRkaItemSuccess(items.data));
    } else {
      yield put(editRkaItemError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(editRkaItemError(error.toString()));
  }
}

export function* watchGetList() {
  yield takeEvery(RKA_GET_LIST, getRkaList);
}

export function* watchAddItem() {
  yield takeEvery(RKA_ADD_ITEM, addRkaItem);
}

export function* watchEditItem() {
  yield takeEvery(RKA_EDIT_ITEM, editRkaItem);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchEditItem),
  ]);
}

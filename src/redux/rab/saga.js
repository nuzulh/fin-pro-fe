import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  RAB_GET_LIST,
  RAB_ADD_ITEM,
  RAB_EDIT_ITEM,
  RAB_PROGRES_GET_LIST,
  RAB_SUMMARY_EXPORT,
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
  exportRabSummarySuccess,
  exportRabSummaryError,
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
      yield put(getRabProgresListSuccess(res.data));
    } else {
      yield put(getRabProgresListError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getRabProgresListError(error.toString()));
  }
}

const exportRabSummaryRequest = async () => {
  const user = getCurrentUser();
  return await axios
    .get(`${servicePath}/rab/progress/export`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* exportRabSummary({ payload }) {
  try {
    const res = yield call(exportRabSummaryRequest);
    if (!res.data.error) {
      const items = res.data;
      const summary = items.map((item, index) => {
        let temp = {};
        temp[`${payload[0]}`] = index + 1;
        temp[`${payload[1]}`] = item.rab_no;
        temp[`${payload[2]}`] = item.rab_name;
        temp[`${payload[3]}`] = item.rab_value;
        temp[`${payload[4]}`] = item.persekot_value;
        temp[`${payload[5]}`] = item.persekot_lpj_value;
        temp[`${payload[6]}`] = item.sppd_value;
        temp[`${payload[7]}`] = item.fee_project_value;
        temp[`${payload[8]}`] = item.pkm_value;
        temp[`${payload[9]}`] = item.persekot_value + item.persekot_lpj_value + item.sppd_value + item.fee_project_value + item.pkm_value;
        temp[`${payload[10]}`] = item.rab_value - (item.persekot_value + item.persekot_lpj_value + item.sppd_value + item.fee_project_value + item.pkm_value);

        return temp;
      });
      yield put(exportRabSummarySuccess(summary));
    } else {
      yield put(exportRabSummaryError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(exportRabSummaryError(error.toString()));
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

export function* watchSummaryExport() {
  yield takeEvery(RAB_SUMMARY_EXPORT, exportRabSummary);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchEditItem),
    fork(watchGetProgresList),
    fork(watchSummaryExport),
  ]);
}

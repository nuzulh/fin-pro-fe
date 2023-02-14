import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  CHART_BY_YEAR_GET,
  CHART_ON_YEAR_GET,
} from "redux/actions";
import {
  getChartByYearSuccess,
  getChartByYearError,
  getChartOnYearSuccess,
  getChartOnYearError,
} from "./actions";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";

const getChartByYearRequest = async (type, from, to) => {
  const user = getCurrentUser();
  return await axios
    .get(`${servicePath}/dashboard/${type}/by-year?from=${from}&to=${to}`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* getChartByYear({ payload }) {
  const { type, from, to } = payload;
  try {
    const res = yield call(getChartByYearRequest, type, from, to);
    if (!res.data.error) {
      yield put(getChartByYearSuccess(res.data));
    } else {
      yield put(getChartByYearError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getChartByYearError(error.toString()));
  }
}

const getChartOnYearRequest = async (type, year) => {
  const user = getCurrentUser();
  return await axios
    .get(`${servicePath}/dashboard/${type}/year?year=${year}`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* getChartOnYear({ payload }) {
  const { type, year } = payload;
  try {
    const res = yield call(getChartOnYearRequest, type, year);
    if (!res.data.error) {
      yield put(getChartOnYearSuccess(res.data));
    } else {
      yield put(getChartOnYearError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getChartOnYearError(error.toString()));
  }
}

export function* watchGetByYear() {
  yield takeEvery(CHART_BY_YEAR_GET, getChartByYear);
}

export function* watchGetOnYear() {
  yield takeEvery(CHART_ON_YEAR_GET, getChartOnYear);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetByYear),
    fork(watchGetOnYear),
  ]);
}

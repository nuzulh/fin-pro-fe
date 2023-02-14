import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { UPLOAD_FILES, GET_FILES, DELETE_FILE } from "redux/actions";
import {
  uploadFilesSuccess,
  uploadFilesError,
  getFilesSuccess,
  getFilesError,
  deleteFileSuccess,
  deleteFileError,
} from "./actions";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";

const getFilesRequest = async (type, id, sub_id) => {
  const user = getCurrentUser();
  return await axios.get(
    `${servicePath}/files/${type}/${id}/${sub_id}`, {
    headers: {
      "X-Secured-With": user.token,
    },
  })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* getFiles({ payload }) {
  const { type, id, sub_id } = payload;
  try {
    const res = yield call(getFilesRequest, type, id, sub_id);
    if (!res.data.error) {
      yield put(getFilesSuccess(res.data));
    } else {
      yield put(getFilesError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(getFilesError(error.toString()));
  }
}

const uploadFilesRequest = async (files, type, id, sub_id) => {
  const user = getCurrentUser();
  return await axios.post(
    `${servicePath}/files/${type}/${id}/${sub_id}`, files, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-Secured-With": user.token,
    },
  })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* uploadFiles({ payload }) {
  const { files, type, id, sub_id } = payload;
  try {
    const res = yield call(uploadFilesRequest, files, type, id, sub_id);
    if (!res.data.error) {
      yield put(uploadFilesSuccess(res.data));
      yield call(getFilesRequest, type, id, sub_id);
    } else {
      yield put(uploadFilesError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(uploadFilesError(error.toString()));
  }
}

const deleteFileRequest = async (type, id, sub_id, fileName) => {
  const user = getCurrentUser();
  return await axios.delete(
    `${servicePath}/files/${type}/${id}/${sub_id}/${fileName}`, {
    headers: {
      "X-Secured-With": user.token,
    },
  })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* deleteFile({ payload }) {
  const { type, id, sub_id, fileName } = payload;
  try {
    const res = yield call(deleteFileRequest, type, id, sub_id, fileName);
    if (!res.error) {
      yield put(deleteFileSuccess(true));
    } else {
      yield put(deleteFileError(res.errorMessage));
    }
  } catch (error) {
    yield put(deleteFileError(error.toString()));
  }
}

export function* watchUploadFiles() {
  yield takeEvery(UPLOAD_FILES, uploadFiles);
}

export function* watchGetFiles() {
  yield takeEvery(GET_FILES, getFiles);
}

export function* watchDeleteFile() {
  yield takeEvery(DELETE_FILE, deleteFile);
}

export default function* rootSaga() {
  yield all([
    fork(watchUploadFiles),
    fork(watchGetFiles),
    fork(watchDeleteFile),
  ]);
}

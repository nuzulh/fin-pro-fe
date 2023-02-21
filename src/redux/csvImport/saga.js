import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  CSV_IMPORT,
  CSV_GENERATE,
  CSV_ENTRY_IMPORT,
} from "redux/actions";
import {
  importCsvSuccess,
  importCsvError,
  generateCsvSuccess,
  generateCsvError,
  entryImportCsvSuccess,
  entryImportCsvError,
} from "./actions";
import { getCategoryListSuccess } from "redux/actions";
import axios from "axios";
import { servicePath } from "constants/defaultValues";
import { getCurrentUser } from "helpers/Utils";

const importCsvRequest = async (type, file) => {
  const user = getCurrentUser();
  const data = new FormData();
  data.append("files", file);
  return await axios.post(
    `${servicePath}/${type}/import`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-Secured-With": user.token,
    },
  })
    .then((res) => res.data)
    .catch((err) => err.response);
};

function* importCsv({ payload }) {
  const { type, file } = payload;
  try {
    const res = yield call(importCsvRequest, type, file);
    if (!res.data.error) {
      yield put(importCsvSuccess(res.data, res.csv_key));
    } else {
      yield put(importCsvError(res.data.errorMessage));
    }
  } catch (error) {
    yield put(importCsvError(error.toString()));
  }
}

const generateCsvRequest = (type, csvKeys, items) => {
  const newItems = items.map((item) => {
    const oldKeys = [...Object.keys(item)];
    const newDetailKeys = [];
    csvKeys.map((key) => {
      if (parseInt(key.split(" ").pop())) {
        let x = key.replace(` ${key.split(" ").pop()}`, "");
        if (!newDetailKeys.includes(x)) {
          newDetailKeys.push(x);
        }
      }
    });
    let temp = {};
    csvKeys.map((key, index) => {
      if (key === "message") {
        temp["message"] = item.message.map((x) => x.errorMessage).join(", ");
      } else if (key === "isValid") {
        temp["isValid"] = item.isValid;
      } else {
        if (parseInt(key.split(" ").pop())) {
          const details = item[`${type}_detail`];
          const detailKeys = [...Object.keys(details[0])];
          detailKeys.map((x, j) => {
            for (let i = 0; i < details.length; i++) {
              temp[`${newDetailKeys[j]} ${i + 1}`] = details[i][x];
            }
          });
        } else {
          temp[`${key}`] = item[oldKeys[index]];
        }
      }
    });
    return temp;
  });
  return newItems;
};

function* generateCsv({ payload }) {
  const { type, csvKeys, items } = payload;
  try {
    const file = yield call(generateCsvRequest, type, csvKeys, items);
    yield put(generateCsvSuccess(file));
  } catch (error) {
    yield put(generateCsvError(error.toString()));
  }
}

const entryImportCsvRequest = async (items) => {
  const user = getCurrentUser();
  const categories = await axios
    .get(`${servicePath}/category`, {
      headers: {
        "X-Secured-With": user.token,
      }
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data.errorMessage);
  const allCategories = categories.map((x) => x.category_name);

  const persekotCategories = [...new Set(items.map((x) => x["Kategori"]))]
  if (persekotCategories[0] !== undefined) {
    persekotCategories.map(async (name) => {
      if (!allCategories.includes(name)) {
        await axios.post(`${servicePath}/category`, {
          category_name: name,
          category_type: "PERSEKOT",
        }, {
          headers: { "X-Secured-With": user.token },
        });
      }
    });
  }

  const rpbCategories = [...new Set(items.map((x) => x["Satuan"]))]
  if (rpbCategories[0] !== undefined) {
    rpbCategories.map(async (name) => {
      if (!allCategories.includes(name)) {
        await axios.post(`${servicePath}/category`, {
          category_name: name,
          category_type: "PKM",
        }, {
          headers: { "X-Secured-With": user.token },
        });
      }
    });
  }

  return items;
};

function* entryImportCsv({ payload }) {
  try {
    const entryItems = yield call(entryImportCsvRequest, payload);
    yield put(entryImportCsvSuccess(entryItems));
  } catch (error) {
    yield put(entryImportCsvError(error.toString()));
  }
}

export function* watchImportCsv() {
  yield takeEvery(CSV_IMPORT, importCsv);
}

export function* watchGenerateCsv() {
  yield takeEvery(CSV_GENERATE, generateCsv);
}

export function* watchEntryImportCsv() {
  yield takeEvery(CSV_ENTRY_IMPORT, entryImportCsv);
}

export default function* rootSaga() {
  yield all([
    fork(watchImportCsv),
    fork(watchGenerateCsv),
    fork(watchEntryImportCsv),
  ]);
}

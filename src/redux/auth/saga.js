import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  adminRoot,
  currentUser,
  defaultLocale,
  servicePath,
  UserRole,
} from "constants/defaultValues";
import { setCurrentUser } from "helpers/Utils";
import {
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} from "../actions";

import {
  loginUserSuccess,
  loginUserError,
  registerUserSuccess,
  registerUserError,
  forgotPasswordSuccess,
  forgotPasswordError,
  resetPasswordSuccess,
  resetPasswordError,
} from "./actions";
import axios from "data/API";

export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, loginWithUsername);
}

const loginWithUsernameAsync = async (username, password) => {
  return await axios
    .post(`${servicePath}/auth/login`, { username, password })
    .then((res) => res.data.data)
    .catch((err) => err.response);
};

function* loginWithUsername({ payload }) {
  const { username, password } = payload.user;
  const { history } = payload;
  try {
    const loginUser = yield call(
      loginWithUsernameAsync,
      username,
      password,
    );
    if (!loginUser.error) {
      const item = {
        username: loginUser.username,
        token: loginUser.token,
        role: UserRole[loginUser.role],
        department: loginUser.department,
      };
      setCurrentUser(item);
      yield put(loginUserSuccess(item));
      history.push(adminRoot);
    } else {
      yield put(loginUserError(loginUser.errorMessage));
    }
  } catch (error) {
    yield put(loginUserError(error.toString()));
  }
}

export function* watchRegisterUser() {
  yield takeEvery(REGISTER_USER, registerWithUsername);
}

const registerWithUsernameAsync = async (
  email,
  password,
  username,
  phoneNumber,
  role
) =>
  await API.post("authentication/register", {
    email,
    password,
    username,
    phone_number: phoneNumber,
    role,
  })
    .then((user) => user.data)
    .catch((error) => error);

function* registerWithUsername({ payload }) {
  const { email, password, username, phoneNumber } = payload.user;
  const { history } = payload;
  const role = "spv";
  try {
    const registerUser = yield call(
      registerWithUsernameAsync,
      email,
      password,
      username,
      phoneNumber,
      role
    );
    const userRole = UserRole[registerUser.output_schema.role];

    if (
      registerUser.error_schema.error_message.english === "Success Register"
    ) {
      const item = {
        username: registerUser.output_schema.username,
        role: userRole,
        ...currentUser,
      };
      yield put(registerUserSuccess(item));
      history.push(adminRoot);
    } else {
      if (defaultLocale === "id") {
        yield put(
          registerUserError(registerUser.error_schema.error_message.bahasa)
        );
      } else {
        yield put(
          registerUserError(registerUser.error_schema.error_message.english)
        );
      }
    }
  } catch (error) {
    yield put(registerUserError(error));
  }
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logout);
}

const logoutRequest = async (history) => {
  history.push(adminRoot);
};

function* logout({ payload }) {
  const { history } = payload;
  localStorage.removeItem("ph_temp");
  localStorage.clear();
  setCurrentUser();
  yield call(logoutRequest, history);
}

export function* watchForgotPassword() {
  yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const forgotPasswordAsync = async (email) => {
  // eslint-disable-next-line no-return-await
  return await auth
    .sendPasswordResetEmail(email)
    .then((user) => user)
    .catch((error) => error);
};

function* forgotPassword({ payload }) {
  const { email } = payload.forgotUserMail;
  try {
    const forgotPasswordStatus = yield call(forgotPasswordAsync, email);
    if (!forgotPasswordStatus) {
      yield put(forgotPasswordSuccess("success"));
    } else {
      yield put(forgotPasswordError(forgotPasswordStatus.message));
    }
  } catch (error) {
    yield put(forgotPasswordError(error));
  }
}

export function* watchResetPassword() {
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

const resetPasswordAsync = async (resetPasswordCode, newPassword) => {
  return await auth
    .confirmPasswordReset(resetPasswordCode, newPassword)
    .then((user) => user)
    .catch((error) => error);
};

function* resetPassword({ payload }) {
  const { newPassword, resetPasswordCode } = payload;
  try {
    const resetPasswordStatus = yield call(
      resetPasswordAsync,
      resetPasswordCode,
      newPassword
    );
    if (!resetPasswordStatus) {
      yield put(resetPasswordSuccess("success"));
    } else {
      yield put(resetPasswordError(resetPasswordStatus.message));
    }
  } catch (error) {
    yield put(resetPasswordError(error));
  }
}

export default function* rootSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser),
    fork(watchRegisterUser),
    fork(watchForgotPassword),
    fork(watchResetPassword),
  ]);
}

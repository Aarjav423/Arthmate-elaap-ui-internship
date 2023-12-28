import { takeLatest, call, put } from "redux-saga/effects";
import { updateProfile, updatePreLoaderWatcher } from "../actions/user";
import {
  loginApi,
  createUserApi,
  userListApi,
  toggleUserStatusApi, 
  updateUserAPI, 
  resetPasswordAPI,
  searchUserAPI
} from "../apis/user";
import { saveToStorage } from "../util/localstorage";
import setAuthToken from "../util/setAuthToken";

export function* loginEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const { data } = yield call(loginApi, action.payload);
    // store data to localStorage
    Object.keys(data).forEach((key) => {
      saveToStorage("auth", true);
      saveToStorage(key, data[key]);
    });
    const { user } = data;
    const selectedPartner =
      user.type === "company"
        ? { id: user.usercompany, code: user.usercompanyname }
        : null;
    saveToStorage("selectedPartner", selectedPartner);
    setAuthToken(JSON.parse(localStorage.getItem("token")));
    // update the reducer
    yield put(updateProfile(user));
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* createUserEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(createUserApi, action.payload); // store data to localStorage
    Object.keys(data).forEach((key) => {
      saveToStorage(key, data[key]);
    });
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* userListEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(userListApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* toggleUserStatusEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(toggleUserStatusApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* resetPasswordEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(resetPasswordAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateUserEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateUserAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* searchUserEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(searchUserAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateUserWatcherSaga() {
  yield takeLatest("UPDATE_USER", updateUserEffectSaga);
}

export function* loginWatcherSaga() {
  yield takeLatest("LOGIN_WATCHER", loginEffectSaga);
}

export function* createUserWatcherSaga() {
  yield takeLatest("CREATE_USER_WATCHER", createUserEffectSaga);
}

export function* userListWatcherSaga() {
  yield takeLatest("USER_LIST_WATCHER", userListEffectSaga);
}

export function* toggleUserStatusWatcherSaga() {
  yield takeLatest("TOGGLE_USER_STATUS", toggleUserStatusEffectSaga);
}

export function* resetPasswordWatcherSaga() {
  yield takeLatest("RESET_PASSWORD", resetPasswordEffectSaga);
}

export function* searchUserWatcherSaga() {
  yield takeLatest("SEARCH_USER", searchUserEffectSaga);
}
import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";

import {
  getAllTokenAPI,
  updateTokenByIdApi,
  updateTokenStatusApi,
  deleteTokenByIdApi,
  getTokenByCompanyApi
} from "../apis/token";
import {saveToStorage} from "../util/localstorage";

/** saga worker that is responsible for the side effects */
export function* getAllTokenEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getAllTokenAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getAllTokenWatcherSaga() {
  yield takeLatest("GET_TOKEN", getAllTokenEffectSaga);
}

export function* updateTokenEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(updateTokenByIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateTokenWatcherSaga() {
  yield takeLatest("UPDATE_TOKEN", updateTokenEffectSaga);
}

export function* deleteTokenByIdEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(deleteTokenByIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* deleteTokenByIdWatcherSaga() {
  yield takeLatest("DELETE_TOKEN", deleteTokenByIdEffectSaga);
}

export function* updateTokenStatusEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(updateTokenStatusApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateTokenStatusWatcherSaga() {
  yield takeLatest("UPDATE_TOKEN_STATUS", updateTokenStatusEffectSaga);
}

export function* getTokenByCompanyEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getTokenByCompanyApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getTokenByCompanyWatcherSaga() {
  yield takeLatest("GET_TOKEN_BY_COMPANY", getTokenByCompanyEffectSaga);
}

import { takeLatest, call, put } from "redux-saga/effects";
import {
  addCompanyApi,
  getAllCompaniesApi,
  getAllCoLenderCompaniesApi,
  getCompanyByIdApi,
  getAllLocCompaniesApi
} from "../apis/company";
import { updatePreLoaderWatcher } from "../actions/user";

export function* addCompanyEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(addCompanyApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addCompanyWatcherSaga() {
  yield takeLatest("ADD_COMPANY_WATCHER", addCompanyEffectSaga);
}

export function* getAllCompaniesEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getAllCompaniesApi);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getAllCompaniesWatcherSaga() {
  yield takeLatest("GET_ALL_COMPANIES_WATCHER", getAllCompaniesEffectSaga);
}

export function* getAllLocCompaniesEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getAllLocCompaniesApi);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getAllLocCompaniesWatcherSaga() {
  yield takeLatest("GET_ALL_LOC_COMPANIES_WATCHER", getAllLocCompaniesEffectSaga);
}

export function* getAllCoLenderCompaniesEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getAllCoLenderCompaniesApi);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getAllCoLenderCompaniesWatcherSaga() {
  yield takeLatest("GET_ALL_CO_LENDER_COMPANIES_WATCHER", getAllCoLenderCompaniesEffectSaga);
}

export function* getCompanyByIdEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getCompanyByIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getCompanyByIdWatcherSaga() {
  yield takeLatest("GET_COMPANY_BY_ID_WATCHER", getCompanyByIdEffectSaga);
}

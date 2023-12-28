import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";
import {
  getSubventionReportsAPI,
  generateSubventionReportAPI,
  downloadSubventionReportAPI
} from "../apis/subventionReport";

export function* getSubventionReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getSubventionReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getSubventionReportsWatcherSaga() {
  yield takeLatest(
    "GET_SUBVENTION_REPORTS",
    getSubventionReportsEffectSaga
  );
}

export function* generateSubventionReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(generateSubventionReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateSubventionReportsWatcherSaga() {
  yield takeLatest(
    "GENERATE_SUBVENTION_REPORT",
    generateSubventionReportsEffectSaga
  );
}

export function* downloadSubventionReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(downloadSubventionReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadSubventionReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_SUBVENTION_REPORT",
    downloadSubventionReportsEffectSaga
  );
}

import { updatePreLoaderWatcher } from "actions/user";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  getReportRequests,
  generateReportRequest,
  downloadReportRequestFile
} from "../apis/reportRequests";

// watcher saga to get report requests
export function* getReportRequestsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getReportRequests, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getReportRequestsWatcherSaga() {
  yield takeLatest(
    "GET_REPORT_REQUESTS",
    getReportRequestsEffectSaga
  );
}

// watcher saga to generate report request
export function* generateReportRequestEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(generateReportRequest, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateReportRequestWatcherSaga() {
  yield takeLatest(
    "GENERATE_REPORT_REQUEST",
    generateReportRequestEffectSaga
  );
}

// watcher saga to download report file
export function* downloadReportRequestFileEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(downloadReportRequestFile, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadReportRequestFileWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_REPORT_REQUEST",
    downloadReportRequestFileEffectSaga
  );
}

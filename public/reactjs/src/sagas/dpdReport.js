import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";
import {
  getDPDReportsAPI,
  generateDPDReportAPI,
  downloadDPDReportAPI
} from "../apis/dpdReport";

export function* getDPDReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getDPDReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getDPDReportsWatcherSaga() {
  yield takeLatest(
    "GET_DPD_REPORT",
    getDPDReportsEffectSaga
  );
}

export function* generateDPDReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(generateDPDReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateDPDReportsWatcherSaga() {
  yield takeLatest(
    "GENERATE_DPD_REPORT",
    generateDPDReportsEffectSaga
  );
}

export function* downloadDPDReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(downloadDPDReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadDPDReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_DPD_REPORT",
    downloadDPDReportsEffectSaga
  );
}

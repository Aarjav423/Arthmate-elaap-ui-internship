import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";
import {
  getRepaymentReportsAPI,
  generateRepaymentReportAPI,
  downloadRepaymentReportAPI
} from "../apis/repaymentReports";

export function* getRepaymentReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getRepaymentReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getRepaymentReportsWatcherSaga() {
  yield takeLatest("GET_REPAYMENT_REPORTS", getRepaymentReportsEffectSaga);
}

export function* generateRepaymentReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(generateRepaymentReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateRepaymentReportsWatcherSaga() {
  yield takeLatest(
    "GENERATE_REPAYMENT_REPORT",
    generateRepaymentReportsEffectSaga
  );
}

export function* downloadRepaymentReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(downloadRepaymentReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadRepaymentReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_REPAYMENT_REPORT",
    downloadRepaymentReportsEffectSaga
  );
}

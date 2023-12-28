import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";
import {
  getRepaymentDueReportsAPI,
  generateRepaymentDueReportAPI,
  downloadRepaymentDueReportAPI
} from "../apis/repaymentDueReports";

export function* getRepaymentDueReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getRepaymentDueReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getRepaymentDueReportsWatcherSaga() {
  yield takeLatest(
    "GET_REPAYMENT_DUE_REPORTS",
    getRepaymentDueReportsEffectSaga
  );
}

export function* generateRepaymentDueReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(generateRepaymentDueReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateRepaymentDueReportsWatcherSaga() {
  yield takeLatest(
    "GENERATE_REPAYMENT_DUE_REPORT",
    generateRepaymentDueReportsEffectSaga
  );
}

export function* downloadRepaymentDueReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(downloadRepaymentDueReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadRepaymentDueReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_REPAYMENT_DUE_REPORT",
    downloadRepaymentDueReportsEffectSaga
  );
}

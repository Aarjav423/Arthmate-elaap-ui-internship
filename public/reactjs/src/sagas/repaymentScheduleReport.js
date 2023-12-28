import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";
import {
  getRepaymentScheduleReportsAPI,
  generateRepaymentScheduleReportAPI,
  downloadRepaymentScheduleReportAPI
} from "../apis/repaymentScheduleReport";

export function* getRepaymentScheduleReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getRepaymentScheduleReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getRepaymentScheduleReportsWatcherSaga() {
  yield takeLatest(
    "GET_REPAYMENT_SCHEDULE_REPORTS",
    getRepaymentScheduleReportsEffectSaga
  );
}

export function* generateRepaymentScheduleReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(generateRepaymentScheduleReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateRepaymentScheduleReportsWatcherSaga() {
  yield takeLatest(
    "GENERATE_REPAYMENT_SCHEDULE_REPORT",
    generateRepaymentScheduleReportsEffectSaga
  );
}

export function* downloadRepaymentScheduleReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(downloadRepaymentScheduleReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadRepaymentScheduleReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_REPAYMENT_SCHEDULE_REPORT",
    downloadRepaymentScheduleReportsEffectSaga
  );
}

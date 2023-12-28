import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import {
  getDailyCollectionReportsAPI,
  downloadDailyCollectionReportAPI,
  downloadDailyLeadReportAPI,
  downloadDailyLoanReportAPI,
  getDailyLeadReportsAPI,
  getDailyLoanReportsAPI
} from "../apis/dailyCollectionReport";

export function* getDailyCollectionReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getDailyCollectionReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getDailyCollectionReportsWatcherSaga() {
  yield takeLatest(
    "GET_DAILY_COLLECTION_REPORT",
    getDailyCollectionReportsEffectSaga
  );
}

export function* getDailyLeadReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getDailyLeadReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getDailyLeadReportsWatcherSaga() {
  yield takeLatest(
    "GET_DAILY_LEAD_REPORT",
    getDailyLeadReportsEffectSaga
  );
}

export function* getDailyLoanReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getDailyLoanReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getDailyLoanReportsWatcherSaga() {
  yield takeLatest(
    "GET_DAILY_LOAN_REPORT",
    getDailyLoanReportsEffectSaga
  );
}

export function* downloadDailyCollectionReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      downloadDailyCollectionReportAPI,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadDailyCollectionReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_DAILY_COLLECTION_REPORT",
    downloadDailyCollectionReportsEffectSaga
  );
}

export function* downloadDailyLeadReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      downloadDailyLeadReportAPI,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadDailyLeadReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_DAILY_LEAD_REPORT",
    downloadDailyLeadReportsEffectSaga
  );
}

export function* downloadDailyLoanReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      downloadDailyLoanReportAPI,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadDailyLoanReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_DAILY_LOAN_REPORT",
    downloadDailyLoanReportsEffectSaga
  );
}

import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";
import {
  getInstallmentAndRepaymentReportsAPI,
  generateInstallmentAndRepaymentReportAPI,
  downloadInstallmentAndRepaymentReportAPI
} from "../apis/installmentAndRepaymentReport";

export function* getInstallmentAndRepaymentReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getInstallmentAndRepaymentReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getInstallmentAndRepaymentReportsWatcherSaga() {
  yield takeLatest(
    "GET_INSTALLMENT_AND_REPAYMENT_REPORT",
    getInstallmentAndRepaymentReportsEffectSaga
  );
}

export function* generateInstallmentAndRepaymentReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(generateInstallmentAndRepaymentReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateInstallmentAndRepaymentReportsWatcherSaga() {
  yield takeLatest(
    "GENERATE_INSTALLMENT_AND_REPAYMENT_REPORT",
    generateInstallmentAndRepaymentReportsEffectSaga
  );
}

export function* downloadInstallmentAndRepaymentReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(downloadInstallmentAndRepaymentReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadInstallmentAndRepaymentReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_INSTALLMENT_AND_REPAYMENT_REPORT",
    downloadInstallmentAndRepaymentReportsEffectSaga
  );
}

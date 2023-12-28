import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";
import {
  getMonthlyInsuranceBillingReportsAPI,
  generateMonthlyInsuranceBillingReportAPI,
  downloadMonthlyInsuranceBillingReportAPI
} from "../apis/insuranceBillingReport";

export function* getMonthlyInsuranceBillingReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getMonthlyInsuranceBillingReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getMonthlyInsuranceBillingReportsWatcherSaga() {
  yield takeLatest(
    "GET_INSURANCE_BILLING_REPORT",
    getMonthlyInsuranceBillingReportsEffectSaga
  );
}

export function* generateMonthlyInsuranceBillingReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(generateMonthlyInsuranceBillingReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateMonthlyInsuranceBillingReportsWatcherSaga() {
  yield takeLatest(
    "GENERATE_INSURANCE_BILLING_REPORT",
    generateMonthlyInsuranceBillingReportsEffectSaga
  );
}

export function* downloadMonthlyInsuranceBillingReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(downloadMonthlyInsuranceBillingReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadMonthlyInsuranceBillingReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_INSURANCE_BILLING_REPORT",
    downloadMonthlyInsuranceBillingReportsEffectSaga
  );
}

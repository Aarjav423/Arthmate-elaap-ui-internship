import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";
import {
  getkycComplianceReportsAPI,
  generatekycComplianceReportAPI,
  downloadkycComplianceReportAPI
} from "../apis/kycComplianceReports";

export function* getKycComplianceReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getkycComplianceReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getKycComplianceReportsWatcherSaga() {
  yield takeLatest(
    "GET_KYC_COMPLIANCE_REPORTS",
    getKycComplianceReportsEffectSaga
  );
}

export function* generateKycComplianceReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(generatekycComplianceReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateKycComplianceReportsWatcherSaga() {
  yield takeLatest(
    "GENERATE_KYC_COMPLIANCE_REPORT",
    generateKycComplianceReportsEffectSaga
  );
}

export function* downloadKycComplianceReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(downloadkycComplianceReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadKycComplianceReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_KYC_COMPLIANCE_REPORT",
    downloadKycComplianceReportsEffectSaga
  );
}

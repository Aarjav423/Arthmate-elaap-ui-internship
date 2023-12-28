import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import {
  getReporstsAPI,
  getReportsAPI,
  generateReporstsAPI,
  generateReportsAPI,
  downloadReporstsAPI,
  downloadReportsAPI,
  getZipFIlesAPI,
  getZipFIleAPI,
  downloadColenderLoansReportsAPI,
  generateRefundReportAPI,
  getRefundReportAPI,
  downloadRefundReportAPI,
  generateInsuranceReportAPI,
  getInsuranceReportAPI,
  downloadInsuranceReportAPI,
  getCibilReportAPI,
  downloadCibilReportAPI,
  generateDisbursementFailureReportAPI,
  getDisbursementFailureReportAPI,
  downloadDisbursementFailureReportAPI
} from "../apis/reports";

export function* getReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getReporstsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getReportsWatcherSaga() {
  yield takeLatest("GET_REPORTS", getReportsEffectSaga);
}

export function* generateReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(generateReporstsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateReportsWatcherSaga() {
  yield takeLatest("GENERATE_REPORTS", generateReportsEffectSaga);
}

export function* generateRefundReportEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(generateRefundReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateRefundReportWatcherSaga() {
  yield takeLatest(
    "GENERATE_REFUND_REPORT_WATCHER",
    generateRefundReportEffectSaga
  );
}

export function* getRefundReportEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getRefundReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getRefundReportWatcherSaga() {
  yield takeLatest("GET_REFUND_REPORT_WATCHER", getRefundReportEffectSaga);
}

export function* downloadRefundReportEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(downloadRefundReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadRefundReportWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_REFUND_REPORT_WATCHER",
    downloadRefundReportEffectSaga
  );
}

// Insurance report generate, list, download sagas
export function* generateInsuranceReportEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(generateInsuranceReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateInsuranceReportWatcherSaga() {
  yield takeLatest(
    "GENERATE_INSURANCE_REPORT_WATCHER",
    generateInsuranceReportEffectSaga
  );
}

export function* getInsuranceReportEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getInsuranceReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getInsuranceReportWatcherSaga() {
  yield takeLatest(
    "GET_INSURANCE_REPORT_WATCHER",
    getInsuranceReportEffectSaga
  );
}

export function* downloadInsuranceReportEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(downloadInsuranceReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadInsuranceReportWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_INSURANCE_REPORT_WATCHER",
    downloadInsuranceReportEffectSaga
  );
}

// CIBIL report Get & download sagas
export function* getCibilReportEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getCibilReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getCibilReportWatcherSaga() {
  yield takeLatest("GET_CIBIL_REPORT_WATCHER", getCibilReportEffectSaga);
}

export function* downloadCibilReportEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(downloadCibilReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadCibilReportWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_CIBIL_REPORT_WATCHER",
    downloadCibilReportEffectSaga
  );
}

// Disbursement failure report generate, list, download sagas
export function* generateDisbursementFailureReportEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      generateDisbursementFailureReportAPI,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateDisbursementFailureReportWatcherSaga() {
  yield takeLatest(
    "GENERATE_DISBURSEMENT_FAILURE_REPORT_WATCHER",
    generateDisbursementFailureReportEffectSaga
  );
}

export function* getDisbursementFailureReportEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      getDisbursementFailureReportAPI,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getDisbursementFailureReportWatcherSaga() {
  yield takeLatest(
    "GET_DISBURSEMENT_FAILURE_REPORT_WATCHER",
    getDisbursementFailureReportEffectSaga
  );
}

export function* downloadDisbursementFailureReportEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      downloadDisbursementFailureReportAPI,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadDisbursementFailureReportWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_DISBURSEMENT_FAILURE_REPORT_WATCHER",
    downloadDisbursementFailureReportEffectSaga
  );
}

export function* downloadReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(downloadReporstsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadReportsWatcherSaga() {
  yield takeLatest("DOWNLOAD_REPORTS", downloadReportsEffectSaga);
}

export function* getCoLendersReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getCoLendersReportsWatcherSaga() {
  yield takeLatest("GET_CO_LENDER_REPORTS", getCoLendersReportsEffectSaga);
}

export function* generateEscrowReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(generateReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* generateEscrowReportsWatcherSaga() {
  yield takeLatest(
    "GENERATE_CO_LENDER_REPORTS",
    generateEscrowReportsEffectSaga
  );
}

export function* downloadCoLenderReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(downloadReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadCoLenderReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_CO_LENDER_REPORTS",
    downloadCoLenderReportsEffectSaga
  );
}

export function* downloadCoLenderLoansReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      downloadColenderLoansReportsAPI,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadCoLenderLoansReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_CO_LENDER_LOANS_REPORTS",
    downloadCoLenderLoansReportsEffectSaga
  );
}

export function* getZipFilesEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getZipFIlesAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getZipFilesWatcherSaga() {
  yield takeLatest("GET_ZIP_FILES", getZipFilesEffectSaga);
}

export function* getZipFileEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getZipFIleAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getZipFileWatcherSaga() {
  yield takeLatest("GET_ZIP_FILE", getZipFileEffectSaga);
}

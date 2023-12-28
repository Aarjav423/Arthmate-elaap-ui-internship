import { takeLatest, call, put } from "redux-saga/effects";
import {
  productTypeListApi,
  colendersListApi,
  createColenderApi,
  getColenderApi,
  putColenderApi,
  toggleStatusApi,
  newColenderIdApi,
  getColenderRepaymentScheduleApi,
  getColenderTransactionHistoryApi,
  utrUploadApi,
  fileUploadApprovalApi,
  getUTRfiles,
  updateStatusApi,
  colenderRepaymentListApi,
  colenderSummaryPopupApi,
  colenderDisburseApi,
  colenderMarkAsPaidApi,
  downloadAllDocumentApi
} from "../apis/colenders";
import { updatePreLoaderWatcher } from "../actions/user";

export function* productTypeListEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(productTypeListApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* productTypeListWatcherSaga() {
  yield takeLatest("PRODUCT_TYPE_LIST_WATCHER", productTypeListEffectSaga);
}

export function* colendersListEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(colendersListApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* colendersListWatcherSaga() {
  yield takeLatest("COLENDERS_LIST_WATCHER", colendersListEffectSaga);
}

export function* createColenderEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(createColenderApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* createColenderWatcherSaga() {
  yield takeLatest("CREATE_COLENDER_WATCHER", createColenderEffectSaga);
}

export function* getColenderEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getColenderApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getColenderWatcherSaga() {
  yield takeLatest("GET_COLENDER_WATCHER", getColenderEffectSaga);
}

export function* putColenderEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(putColenderApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* putColenderWatcherSaga() {
  yield takeLatest("PUT_COLENDER_WATCHER", putColenderEffectSaga);
}

export function* toggleStatusEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(toggleStatusApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* toggleStatusWatcherSaga() {
  yield takeLatest("TOGGLE_STATUS", toggleStatusEffectSaga);
}

export function* newColenderIdEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(newColenderIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* newColenderIdWatcherSaga() {
  yield takeLatest("NEW_COLENDER_ID_WATCHER", newColenderIdEffectSaga);
}

export function* getColenderRepaymentScheduleEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      getColenderRepaymentScheduleApi,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getColenderTransactionHistoryEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      getColenderTransactionHistoryApi,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getColenderRepaymentScheduleWatcherSaga() {
  yield takeLatest(
    "GET_COLENDER_REPAYMENT_SCHEDULE_WATCHER",
    getColenderRepaymentScheduleEffectSaga
  );
}

export function* getColenderTransactionHistoryWatcherSaga() {
  yield takeLatest(
    "GET_COLENDER_TRANSACTION_HISTORY_WATCHER",
    getColenderTransactionHistoryEffectSaga
  );
}

export function* utrUploadEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(utrUploadApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* utrUploadWatcherSaga() {
  yield takeLatest("UTR_UPLOAD_WATCHER", utrUploadEffectSaga);
}

export function* fileUploadApprovalEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(fileUploadApprovalApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* fileUploadApprovalWatcherSaga() {
  yield takeLatest("POST_FILE_UPLOAD_APPROVAL", fileUploadApprovalEffectSaga);
}

export function* getUTRfilesEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getUTRfiles, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getUTRfilesWatcherSaga() {
  yield takeLatest("GET_UTR_FILES_WATCHER", getUTRfilesEffectSaga);
}

export function* updateStatusEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateStatusApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateStatusWatcherSaga() {
  yield takeLatest("UPDATE_STATUS_WATCHER", updateStatusEffectSaga);
}

export function* colenderRepaymentListEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(colenderRepaymentListApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* colenderRepaymentWatcherSaga() {
  yield takeLatest("COLENDER_REPAYMENT_LIST_WATCHER", colenderRepaymentListEffectSaga);
}

export function* colenderSummaryPopupEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(colenderSummaryPopupApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* colenderSummaryPopupWatcherSaga() {
  yield takeLatest("COLENDER_SUMMARY_POPUP_WATCHER", colenderSummaryPopupEffectSaga);
}

export function* colenderDisburseEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(colenderDisburseApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* colenderDisburseWatcherSaga() {
  yield takeLatest("COLENDER_DISBURSE_WATCHER", colenderDisburseEffectSaga);
}

export function* colenderMarkAsPaidEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(colenderMarkAsPaidApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* colenderMarkAsPaidWatcherSaga() {
  yield takeLatest("COLENDER_MARK_AS_PAID_WATCHER", colenderMarkAsPaidEffectSaga);
}

export function* downloadAllDocumentEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(downloadAllDocumentApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadAllDocumentWatcherSaga() {
  yield takeLatest("DOWNLOAD_ALL_DOCUMENT", downloadAllDocumentEffectSaga);
}
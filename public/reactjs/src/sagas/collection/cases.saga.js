import { takeLatest, call, put } from "redux-saga/effects";
import {
  assignCollectionCasesApi,
  getCollectionCaseByIdApi,
  getCollectionCasesApi,
  getCaseSourcingPartnerApi,
  getCaseCollHistoryByIdApi,
  getCaseCollPaymentDataByIdApi,
  getCollectionCasesAssignApi,
  getCollectionCaseLmsIdApi,
  getCollectionCaseCollIdsApi,
  getCollectionCaseSelectedApi,
  viewLoanDocumentLogsApi,
  deAssignCollectionCasesApi

} from "apis/collection/cases.api";

export function* getCollectionCasesEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const response = yield call(getCollectionCasesApi, action.payload);
    yield put({
      type: "GET_COLLECTION_CASE_DATA_WATCHER",
      payload: response?.data?.results,
    });
    action.resolve(response.data);
  } catch (e) {
    console.log("Error", e);
    action.reject(e);
  }
}

export function* getCollectionCaseByIdEffectSaga(action) {
  try {
    const response = yield call(getCollectionCaseByIdApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    console.log("Error", e);
    action.reject(e);
  }
}

export function* assignCollectionCasesEffectSaga(action) {
  try {
    const response = yield call(assignCollectionCasesApi, action.payload);
    yield put({
      type: "UPDATE_COLLECTION_CASE_DATA_WATCHER",
      payload: response?.data?.data,
    });
    action.resolve(response.data);
  } catch (e) {
    console.log("Error", e);
    action.reject(e);
  }
}

export function* DeAssignCollectionCasesEffectSaga(action) {
  try {
    const response = yield call(deAssignCollectionCasesApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    console.log("Error", e);
    action.reject(e);
  }
}

export function* getCaseCollHistoryByIdEffectSaga(action) {
  try {
    const response = yield call(getCaseCollHistoryByIdApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    console.log("Error", e);
    action.reject(e);
  }
}

export function* getCaseCollPaymentDataByIdEffectSaga(action) {
  try {
    const response = yield call(getCaseCollPaymentDataByIdApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    console.log("Error", e);
    action.reject(e);
  }
}

export function* getCollectionCasesWatcherSaga() {
  yield takeLatest("GET_COLL_CASES_LIST", getCollectionCasesEffectSaga);
}
export function* getCollectionCaseByIdWatcherSaga() {
  yield takeLatest("GET_COLL_CASE_BY_ID", getCollectionCaseByIdEffectSaga);
}
export function* assignCollectionCasesWatcherSaga() {
  yield takeLatest("ASSIGN_COLL_CASES", assignCollectionCasesEffectSaga);
}

export function* deAssignCollectionCasesWatcherSaga() {
  yield takeLatest("DE_ASSIGN_COLL_CASES", DeAssignCollectionCasesEffectSaga);
}

export function* getCaseSourcingPartnerWatcherEffectSaga(action) {
  try {
    const response = yield call(getCaseSourcingPartnerApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getCaseSourcingPartnerWatcherSaga() {
  yield takeLatest(
    "GET_CASE_SOURCING_PARTNER",
    getCaseSourcingPartnerWatcherEffectSaga
  );
}

export function* getCollectionCaseLmsIdWatcherEffectSaga(action) {
  try {
    const response = yield call(getCollectionCaseLmsIdApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getCollectionCaseCollIdsWatcherEffectSaga(action) {
  try {
    const response = yield call(getCollectionCaseCollIdsApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getCollectionCaseLmsIdWatcherSaga() {
  yield takeLatest(
    "GET_COLLECTION_CASE_LMS_ID",
    getCollectionCaseLmsIdWatcherEffectSaga
  );
}

export function* getCollectionCaseCollIdsWatcherSaga() {
  yield takeLatest(
    "GET_COLLECTION_CASE_COLL_IDs",
    getCollectionCaseCollIdsWatcherEffectSaga
  );
}

export function* getCollectionCaseSelectedWatcherSaga() {
  yield takeLatest(
    "GET_COLLECTION_CASE_SELECTED",
    getCollectionCaseSelectedWatcherEffectSaga
  );
}


export function* getCollectionCasesAssignEffectSaga(action) {
  try {
    const response = yield call(getCollectionCasesAssignApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getCollectionCaseAssignWatcherSaga() {
  yield takeLatest(
    "GET_COLLECTION_CASES_ASSIGN",
    getCollectionCasesAssignEffectSaga
  );
}

export function* getCollectionCaseSelectedWatcherEffectSaga(action) {
  try {
    const response = yield call(getCollectionCaseSelectedApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}




export function* getCaseCollHistoryByIdWatcherSaga() {
  yield takeLatest("GET_COLL_HISTORY_BY_ID", getCaseCollHistoryByIdEffectSaga);
}

export function* getCaseCollPaymentDataByIdWatcherSaga() {
  yield takeLatest("GET_COLL_CASE_PAYMENT_BY_ID", getCaseCollPaymentDataByIdEffectSaga);
}


export function* viewCaseLoanDocumentLogsWatcherEffectSaga(action) {
  try {
    const response = yield call(viewLoanDocumentLogsApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* viewCaseLoanDocumentLogsWatcherSaga() {
  yield takeLatest(
    "CASE_VIEW_LOAN_DOCUMENT_LOGS",
    viewCaseLoanDocumentLogsWatcherEffectSaga
  );
}

import { takeLatest, call, put } from "redux-saga/effects";
import {
  getLeadDetailApi,
  loanRequestFormPostApi,
  loanRequestFormPutApi,
  getLoanRequestDataApi,
  loanRequestByLoanIdApi,
  getActivityLogApi,
  getLeadDetailByIdApi,
  downloadCibilReportApi,
  getLeadDataByLoanAppIdApi,
  deleteLeadApi,
  leadManualReviewApi,
  getLeadDataByLoanIdApi,
  updateLeadDataByLoanIdApi,
  settlementRequestApi,
  settlementDecisionApi,
  updateLeadSectionApi,
} from "../apis/loanRequest";
import { updatePreLoaderWatcher } from "../actions/user";
export function* leadDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
   
    const { data } = yield call(getLeadDetailApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}



export function* getLeadDetailApiWatcherSaga() {
  yield takeLatest(
    "GET_LEAD_DATA_EXPORT_WATCHER",
    leadDetailsEffectSaga
  );
}
export function* loanRequestFormPostEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(loanRequestFormPostApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* loanRequestFormWatcherSaga() {
  yield takeLatest(
    "LOAN_REQUEST_FORM_POST_WATCHER",
    loanRequestFormPostEffectSaga
  );
}

export function* loanRequestFormPutEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(loanRequestFormPutApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* loanRequestFormPutWatcherSaga() {
  yield takeLatest(
    "LOAN_REQUEST_FORM_PUT_WATCHER",
    loanRequestFormPutEffectSaga
  );
}

export function* getLoanRequestDataEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getLoanRequestDataApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getLoanRequestDataWatcherSaga() {
  yield takeLatest(
    "GET_LOAN_REQUEST_DATA_WATCHER",
    getLoanRequestDataEffectSaga
  );
}

export function* getLoanRequestByLoanIdEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(loanRequestByLoanIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getLoanRequestByLoanIdWatcherSaga() {
  yield takeLatest(
    "GET_LOAN_REQUEST_BY_LOAN_ID_WATCHER",
    getLoanRequestByLoanIdEffectSaga
  );
}

export function* getActivityLogEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getActivityLogApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getActivityLogWatcherSaga() {
  yield takeLatest("GET_ACTIVITY_LOG_JSON_WATCHER", getActivityLogEffectSaga);
}

export function* leadDetailsByIdEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getLeadDetailByIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* leadDetailsByIdWatcherSaga() {
  yield takeLatest("GET_LEAD_DETAILS_BYID_WATCHER", leadDetailsByIdEffectSaga);
}

export function* updateLeadSectionSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateLeadSectionApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
} 

export function* leadSectionUpdateSaga(){
  yield takeLatest("UPDATE_LEAD_SECTION_STATUS", updateLeadSectionSaga)
}

export function* downloadCibilReportSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(downloadCibilReportApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadCibilReportLoanWatcherSaga() {
  yield takeLatest("DOWNLOAD_CIBIL_REPORT", downloadCibilReportSaga);
}

export function* getLeadDataByLoanAppIdEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getLeadDataByLoanAppIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getLeadDataByLoanAppIdWatcherSaga() {
  yield takeLatest(
    "GET_LEAD_DATA_BY_LOAN_APP_ID_WATCHER",
    getLeadDataByLoanAppIdEffectSaga
  );
}
export function* deleteLeadEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(deleteLeadApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* deleteLeadWatcherSaga() {
  yield takeLatest("DELETE_LEAD", deleteLeadEffectSaga);
}

export function* leadManualReviewEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(leadManualReviewApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* leadManualReviewWatcherSaga() {
  yield takeLatest("LEAD_MANUAL_REVIEW", leadManualReviewEffectSaga);
}

export function* settlementRequestEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(settlementRequestApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* settlementRequestWatcherSaga() {
  yield takeLatest("SETTLEMENT_REQUEST_TRANCHES", settlementRequestEffectSaga);
}

export function* settlementDecisionEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(settlementDecisionApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* settlementDecisionWatcherSaga() {
  yield takeLatest("SETTLEMENT_DECISION", settlementDecisionEffectSaga);
}

///saga to get document parsed data from lead
export function* getLeadDataByLoanIdEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getLeadDataByLoanIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getLeadDataByLoanIdWatcherSaga() {
  yield takeLatest(
    "GET_LEAD_DATA_BY_LOAN_ID_WATCHER",
    getLeadDataByLoanIdEffectSaga
  );
}

///saga to update document parsed data from lead
export function* updateLeadDataByLoanIdEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateLeadDataByLoanIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateLeadDataByLoanIdWatcherSaga() {
  yield takeLatest(
    "UPDATE_LEAD_DATA_BY_LOAN_ID_WATCHER",
    updateLeadDataByLoanIdEffectSaga
  );
}
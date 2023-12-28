
import { takeLatest, call, put } from "redux-saga/effects";
import { createLoanIDApi, getBookLoanAPI,updateLoanIDApi,getMsmeLoanDocumentsApi, getGstStatusIDApi,postLoanDetailsApi} from  "./../apis/bookLoan.api"
import { updatePreLoaderWatcher } from "../../actions/user";

export function* createLoanIDEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(createLoanIDApi, action.payload);
      action.resolve(data);
    } catch (e) {
      action.reject(e);
    }
  }
  
  export function* createLoanIDWatcherSaga() {
    yield takeLatest("CREATE_LOANID", createLoanIDEffectSaga);
  }

  export function* updateLoanIDEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(updateLoanIDApi, action.payload);
      action.resolve(data);
    } catch (e) {
      action.reject(e);
    }
  }
  
  export function* updateLoanIDWatcherSaga() {
    yield takeLatest("UPDATE_LOANID", updateLoanIDEffectSaga);
  }

export function* getBookLoanEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(getBookLoanAPI, action.payload);
      yield put(updatePreLoaderWatcher(false));
      action.resolve(data);
    } catch (e) {
      yield put(updatePreLoaderWatcher(false));
      action.reject(e);

    }
  }
  
  export function* getBookLoanWatcherSaga() {
    yield takeLatest("GET_BOOK_LOAN_DETAILS", getBookLoanEffectSaga);
  }

  export function* postLoanDetailsEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(postLoanDetailsApi, action.payload);
      yield put(updatePreLoaderWatcher(false));
      action.resolve(data);
    } catch (e) {
      yield put(updatePreLoaderWatcher(false));
      action.reject(e);

    }
  }
  
  export function* postLoanDetailsWatcherSaga() {
    yield takeLatest("POST_LOAN_DETAILS", postLoanDetailsEffectSaga);
  }

  export function* getMsmeLoanDocumentsEffectSaga(action) {
    try {
      const response = yield call(getMsmeLoanDocumentsApi, action.payload);
      action.resolve(response.data);
    } catch (e) {
      action.reject(e);
    }
  }
  export function* getMsmeLoanDocumentsWatcherSaga() {
    yield takeLatest("FETCH_MSME_LOAN_DOCUMENT", getMsmeLoanDocumentsEffectSaga);
  }


  export function* getGstStatusIDEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(getGstStatusIDApi, action.payload);
      action.resolve(data);
    } catch (e) {
      action.reject(e);
    }
  }
  
  export function* getGstStatusIDWatcherSaga() {
    yield takeLatest("GST_ID_STATUS", getGstStatusIDEffectSaga);
  }
  
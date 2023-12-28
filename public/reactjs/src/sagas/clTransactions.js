import { takeLatest, call, put } from "redux-saga/effects";
import {
  GetLoanDataApi,
  AddLoanTransactionApi,
  getDisbursmentDataApi,
} from "../apis/clTransactions";
import { updatePreLoaderWatcher } from "../actions/user";

export function* getLoanDataEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(GetLoanDataApi, action.payload);
    yield put(updatePreLoaderWatcher(true));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  };
};

export function* getLoanDataWatcherSaga() {
  yield takeLatest("GET_LOAN_DATA", getLoanDataEffectSaga);
};

export function* addLoanTransactionEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(false));
    const { data } = yield call(AddLoanTransactionApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  };
};

export function* addLoanTransactionWatcherSaga() {
  yield takeLatest("ADD_LOAN_TRANSACTION", addLoanTransactionEffectSaga);
};

export function* getDisbursmentDataEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(false));
    const { data } = yield call(getDisbursmentDataApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  };
};

export function* getDisbursmentDataWatcherSaga() {
  yield takeLatest("GET_DISBURSMENT_DATA_WATCHER", getDisbursmentDataEffectSaga);
};
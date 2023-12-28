import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import { getTransactionDetails , geteNachTransactionDetailApi } from "../apis/enachTransaction";

export function* transactionDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getTransactionDetails, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* transactionDetailsWatcherSaga() {
  yield takeLatest("GET_TRANSACTION_DETAIL", transactionDetailsEffectSaga);
}

export function* enachDetailsTransactionEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(geteNachTransactionDetailApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* enachTransactionDetailsWatcherSaga() {
  yield takeLatest(
    "GET_ENACH_DETAILS_NACH_TRANSACTION",
    enachDetailsTransactionEffectSaga
  );
}

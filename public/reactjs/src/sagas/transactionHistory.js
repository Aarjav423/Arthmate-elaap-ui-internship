import { takeLatest, call, put } from "redux-saga/effects";
import {
  transactionHistoryListApi,
  drawDownRequestListApi,
  drawDownRequestDetailsApi,
  rejectDrawDownRequestApi
} from "../apis/transactionHistory";
import { updatePreLoaderWatcher } from "../actions/user";

export function* transactionHistoryListEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(transactionHistoryListApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* transactionHistoryListWatcherSaga() {
  yield takeLatest(
    "TRANSACTION_HISTORY_LIST_WATCHER",
    transactionHistoryListEffectSaga
  );
}



export function* drawDownRequestListEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(drawDownRequestListApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* drawDownRequestListWatcherSaga() {
  yield takeLatest(
    "DRAWDOWN_REQUEST_LIST_WATCHER",
    drawDownRequestListEffectSaga
  );
}

export function* drawDownRequestDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(drawDownRequestDetailsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* drawDownRequestDetailsWatcherSaga() {
  yield takeLatest(
    "DRAWDOWN_REQUEST_DETAILS_WATCHER",
    drawDownRequestDetailsEffectSaga
  );
}

export function* rejectDrawDownRequestEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(rejectDrawDownRequestApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* rejectDrawDownRequestWatcherSaga() {
  yield takeLatest(
    "REJECT_DRAWDOWN_REQUEST",
    rejectDrawDownRequestEffectSaga
  );
}
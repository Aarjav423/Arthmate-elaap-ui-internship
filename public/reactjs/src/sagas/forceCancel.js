import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";

import { getForceCancelLoanApi, postForceCancelLoanApi } from '../apis/forceCancel';

export function* getForceCancelEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getForceCancelLoanApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getForceCancelWatcherSaga() {
  yield takeLatest('FORCE_CANCEL_GET_WATCHER', getForceCancelEffectSaga);
}

export function* postForceCancelEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(postForceCancelLoanApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* postForceCancelWatcherSaga() {
  yield takeLatest('FORCE_CANCEL_POST_WATCHER', postForceCancelEffectSaga);
}
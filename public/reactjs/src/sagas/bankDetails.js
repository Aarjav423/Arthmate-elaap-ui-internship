import { takeLatest, call, put } from "redux-saga/effects";
import { accountHolderListApi, addAccountHolderApi,editAccountHolderApi } from "../apis/bankDetails";
import { updatePreLoaderWatcher } from "../actions/user";

export function* accountHolderListEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(accountHolderListApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* accountHolderListWatcherSaga() {
  yield takeLatest("ACCOUNT_HOLDER_LIST_WATCHER", accountHolderListEffectSaga);
}



export function* addAccountHolderEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(addAccountHolderApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addAccountHolderWatcherSaga() {
  yield takeLatest("ADD_ACCOUNT_HOLDER_WATCHER", addAccountHolderEffectSaga);
}

export function* editAccountHolderEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(editAccountHolderApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* editAccountHolderWatcherSaga() {
  yield takeLatest("EDIT_ACCOUNT_HOLDER_WATCHER", editAccountHolderEffectSaga);
}
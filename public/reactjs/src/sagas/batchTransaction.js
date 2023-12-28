import { takeLatest, call, put } from "redux-saga/effects";
import {
  getBatchTransactionDataApi,
  uploadPresentmentFileApi,
  downloadPresentmentFileApi
} from "../apis/batchTransaction";
import { updatePreLoaderWatcher } from "../actions/user";

export function* getBatchTransactionDataEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getBatchTransactionDataApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getBatchTransactionDataWatcherSaga(action) {
  yield takeLatest("BATCH_TRANSACTION_DATA", getBatchTransactionDataEffectSaga);
}

export function* uploadPresentmentFileEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(uploadPresentmentFileApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* uploadPresentmentFileWatcherSaga(action) {
  yield takeLatest("UPLOAD_PRESENTMENT_FILE", uploadPresentmentFileEffectSaga);
}

export function* downloadPresentmentFileEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(downloadPresentmentFileApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadPresentmentFileWatcherSaga(action) {
  yield takeLatest("DOWNLOAD_PRESENTMENT_FILE", downloadPresentmentFileEffectSaga);
}
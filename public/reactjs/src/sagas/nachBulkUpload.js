import { takeLatest, call, put } from "redux-saga/effects";
import {
  getBulkUploadDataApi,
  uploadBulkFileApi,
  downloadBulkUploadFileApi
} from "../apis/nachBulkUpload";
import { updatePreLoaderWatcher } from "../actions/user";

export function* getBulkUploadDataEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getBulkUploadDataApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getBulkUploadDataWatcherSaga(action) {
  yield takeLatest("BULK_UPLOAD_DATA", getBulkUploadDataEffectSaga);
}

export function* uploadBulkFileEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(uploadBulkFileApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* uploadBulkFileWatcherSaga(action) {
  yield takeLatest("UPLOAD_BULK_FILE", uploadBulkFileEffectSaga);
}

export function* downloadBulkUploadFileEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(downloadBulkUploadFileApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadBulkUploadFileWatcherSaga(action) {
  yield takeLatest("DOWNLOAD_BULK_UPLOAD_FILE", downloadBulkUploadFileEffectSaga);
}
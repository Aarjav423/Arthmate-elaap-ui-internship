import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";
import {
  getCkycReportsAPI,
  generateCkycReportAPI,
  downloadCkycReportAPI,
  ckycUploadApi,
  getckycTextFilesApi,
  downloadckycTextFilesApi
} from "../apis/ckycReport";


// watcher saga to get all ckyc reports lists on reports page 
export function* getCkycReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getCkycReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}
export function* getCkycReportsWatcherSaga() {
  yield takeLatest(
    "GET_CKYC_REPORTS",
    getCkycReportsEffectSaga
  );
}

//watcher saga to generate ckyc reports entry on reports page
export function* generateCkycReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(generateCkycReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}
export function* generateCkycReportsWatcherSaga() {
  yield takeLatest(
    "GENERATE_CKYC_REPORT",
    generateCkycReportsEffectSaga
  );
}

//watcher saga to download ckyc zip file when clicking on download icon
export function* downloadCkycReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(downloadCkycReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadCkycReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_CKYC_REPORT",
    downloadCkycReportsEffectSaga
  );
}


export function* ckycUploadEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(ckycUploadApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* ckycUploadWatcherSaga() {
  yield takeLatest("CKYC_UPLOAD_WATCHER", ckycUploadEffectSaga);
}

export function* getCkycUploadEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getckycTextFilesApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getCkycTextFilesWatcherSaga() {
  yield takeLatest("GET_CKYC_UPLOADED_FILE", getCkycUploadEffectSaga);
}
//this EffectSaga used to download the  UTR report
export function* downloadCkycFileReportsEffectSaga(action) {
  try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(downloadckycTextFilesApi, action.payload);
      yield put(updatePreLoaderWatcher(false));
      action.resolve(data);
  } catch (e) {
      yield put(updatePreLoaderWatcher(false));
      action.reject(e);
  }
}

//this WatcherSaga used to download the  ckyc text file
export function* downloadCkycFileReportsWatcherSaga() {
  yield takeLatest(
      "DOWNLOAD_CKYC_TEXT_FILE",
      downloadCkycFileReportsEffectSaga
  );
}
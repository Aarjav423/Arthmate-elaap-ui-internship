import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";
import {
  getScreenReportsAPI,
  generateScreenReportAPI,
  downloadScreenReportAPI
} from "../apis/screenReport";


// watcher saga to get all ckyc reports lists on reports page 
export function* getScreenReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getScreenReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}
export function* getScreenReportsWatcherSaga() {
  yield takeLatest("GET_SCREEN_REPORTS",getScreenReportsEffectSaga);
}

//watcher saga to generate ckyc reports entry on reports page
export function* generateScreenReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(generateScreenReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}
export function* generateScreenReportsWatcherSaga() {
  yield takeLatest("GENERATE_SCREEN_REPORT", generateScreenReportsEffectSaga);
}

//watcher saga to download ckyc zip file when clicking on download icon
export function* downloadScreenReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(downloadScreenReportAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadScreenReportsWatcherSaga() {
  yield takeLatest("DOWNLOAD_SCREEN_REPORT",downloadScreenReportsEffectSaga);
}

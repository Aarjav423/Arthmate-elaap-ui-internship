import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";
import {
 getLocDrawdownReports,
 generateLocDrawdownReport,
 downloadLocDrawdownReport
} from "../apis/locDrawdownReport";


// watcher saga to get all drawdown reports lists on reports page 
export function* getLocDrawDownReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getLocDrawdownReports, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}
export function* getLocDrawdownReportsWatcherSaga() {
  yield takeLatest(
    "GET_LOC_DRAWDOWN_REPORTS",
    getLocDrawDownReportsEffectSaga
  );
}

//watcher saga to generate Loc Drawdown reports entry on reports page
export function* generateLocDrawdownReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(generateLocDrawdownReport, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}
export function* generateLocDrawdownReportsWatcherSaga() {
  yield takeLatest(
    "GENERATE_LOC_DRAWDOWN_REPORTS",
    generateLocDrawdownReportsEffectSaga
  );
}

//watcher saga to download Loc Drawdown file when clicking on download icon
export function* downloadLocDrawdownReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(downloadLocDrawdownReport, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadLocDrawdownReportWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_LOC_DRAWDOWN_REPORTS",
    downloadLocDrawdownReportsEffectSaga
  );
}

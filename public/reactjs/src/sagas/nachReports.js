import { takeLatest, call, put } from "redux-saga/effects";
import { getNachReportDataApi, downloadNachReportFileApi } from "../apis/nachReports";
import { updatePreLoaderWatcher } from "../actions/user";

export function* getNachReportDataEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getNachReportDataApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getNachReportDataWatcherSaga(action) {
  yield takeLatest("GET_NACH_REPORT_DATA", getNachReportDataEffectSaga);
}

export function* downloadNachReportFileEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(downloadNachReportFileApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadNachReportFileWatcherSaga(action) {
  yield takeLatest("DOWNLOAD_NACH_REPORT_FILE", downloadNachReportFileEffectSaga);
}
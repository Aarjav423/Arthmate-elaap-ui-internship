import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";
import {
  getMonthlyCollectionReportsAPI,
  downloadMonthlyCollectionReportAPI,
  getServiceUsageReportsAPI,
  downloadServiceUsageAPI
} from "../apis/monthlyCollectionReport";

export function* getMonthlyCollectionReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getMonthlyCollectionReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getMonthlyCollectionReportsWatcherSaga() {
  yield takeLatest(
    "GET_MONTHLY_COLLECTION_REPORT",
    getMonthlyCollectionReportsEffectSaga
  );
}

export function* downloadMonthlyCollectionReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(
      downloadMonthlyCollectionReportAPI,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadMonthlyCollectionReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_MONTHLY_COLLECTION_REPORT",
    downloadMonthlyCollectionReportsEffectSaga
  );
}

export function* getServiceUsageReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getServiceUsageReportsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}
export function* getServiceUsageReportsWatcherSaga() {
  yield takeLatest(
    "GET_SERVICE_USAGE_REPORTS",
    getServiceUsageReportsEffectSaga
  );
}

export function* downloadServiceUsageReportsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(downloadServiceUsageAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* downloadServiceUsageReportsWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_SERVICE_USAGE_REPORT",
    downloadServiceUsageReportsEffectSaga
  );
}


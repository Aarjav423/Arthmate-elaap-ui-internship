import { updatePreLoaderWatcher } from "../actions/user";
import {takeLatest, call, put} from "redux-saga/effects";
import { getStatusChangeLogsAPI } from "../apis/statusLogs";

export function* getStatusChangeLogsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
      const {data} = yield call(getStatusChangeLogsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getStatusChangeLogsWatcherSaga() {
  yield takeLatest(
    "STATUS_LOGS",
    getStatusChangeLogsEffectSaga
  );
}

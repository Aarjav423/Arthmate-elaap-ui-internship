import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import { validationListApi } from "../apis/validations";

export function* validationsListEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(validationListApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* validationsListWatcherSaga() {
  yield takeLatest("VALIDATIONS_LIST_WATCHER", validationsListEffectSaga);
}

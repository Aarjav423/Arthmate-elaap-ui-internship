import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import { updateAScoreDataAPI, getAScoreDataAPI } from "../apis/aScoreData";

export function* getAScoreDataEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getAScoreDataAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getAScoreDataWatcherSaga() {
  yield takeLatest("GET_A_SCORE_DATA", getAScoreDataEffectSaga);
}

export function* updateAScoreDataEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateAScoreDataAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateAScoreDataWatcherSaga() {
  yield takeLatest("UPDATE_A_SCORE_DATA", updateAScoreDataEffectSaga);
}

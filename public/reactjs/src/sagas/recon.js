import { updatePreLoaderWatcher } from "../actions/user";
import { takeLatest, call, put } from "redux-saga/effects";
import { getReconDetails } from "../apis/recon";


export function* getReconDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getReconDetails, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getReconDetailsWatcherSaga() {
  yield takeLatest("GET_RECON_DETAILS", getReconDetailsEffectSaga);
}

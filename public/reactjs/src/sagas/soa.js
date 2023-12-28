import { updatePreLoaderWatcher } from "../actions/user";
import { takeLatest, call, put } from "redux-saga/effects";
import { getSoaDetails , getSoaRequest, downloadSoaRequest } from "../apis/soa";



export function* getSoaDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getSoaDetails, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

  export function* getSoaDetailsWatcherSaga() {
  yield takeLatest("GET_SOA_DETAILS", getSoaDetailsEffectSaga);
}

export function* getSoaRequestEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getSoaRequest, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

  export function* getSoaRequestWatcherSaga() {
  yield takeLatest("GET_SOA_REQUEST", getSoaRequestEffectSaga);
}


export function* downloadSoaRequestEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(downloadSoaRequest, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

  export function* downloadSoaRequestWatcherSaga() {
  yield takeLatest("DOWNLOAD_SOA_REQUEST", downloadSoaRequestEffectSaga);
}
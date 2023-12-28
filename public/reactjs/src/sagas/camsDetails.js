import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import {
  updateCamsDetailsAPI,
  getCamsDetailsAPI,
  submitCamsDetailsAPI,
  getSelectorDetailsAPI,
  postSelectorDetailsAPI,
  postSelectorColenderDetailsAPI,
  getSelectorDetailsDataAPI,
  getUdhyamRegistrationDetailsAPI,
  getBreDetailsAPI,
  runCreditEngineAPI,
  getCamsDataApi,
  updateCamsDataAPi,
  getCamDetailsAPI,
} from "../apis/camsDetails";

export function* submitCamsDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(submitCamsDetailsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* submitCamsDetailsWatcherSaga() {
  yield takeLatest("CAMS_DETAILS", submitCamsDetailsEffectSaga);
}

export function* getCamsDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getCamsDetailsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getCamsDetailsWatcherSaga() {
  yield takeLatest("GET_CAMS_DETAILS", getCamsDetailsEffectSaga);
}

export function* getBreDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getBreDetailsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getBreDetailsWatcherSaga() {
  yield takeLatest("GET_BRE_DETAILS", getBreDetailsEffectSaga);
}

export function* runCreditEngineEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(runCreditEngineAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* runCreditEngineWatcherSaga() {
  yield takeLatest("RUN_CREDIT_ENGINE", runCreditEngineEffectSaga);
}

export function* getSelectorDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getSelectorDetailsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getSelectorDetailsWatcherSaga() {
  yield takeLatest("GET_SELECTOR_DETAILS", getSelectorDetailsEffectSaga);
}

export function* getSelectorDetailsDataEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getSelectorDetailsDataAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getSelectorDetailsDataWatcherSaga() {
  yield takeLatest("SELECTOR_BY_ID_WATCHER", getSelectorDetailsDataEffectSaga);
}

export function* submitSelectorDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(postSelectorDetailsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* submitSelectorDetailsWatcherSaga() {
  yield takeLatest("POST_SELECTOR_DETAILS", submitSelectorDetailsEffectSaga);
}

export function* submitSelectorColenderDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(postSelectorColenderDetailsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* submitSelectorColenderDetailsWatcherSaga() {
  yield takeLatest(
    "POST_SELECTOR_COLENDER_DETAILS",
    submitSelectorColenderDetailsEffectSaga
  );
}

export function* updateCamsDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateCamsDetailsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateCamsDetailsWatcherSaga() {
  yield takeLatest("UPDATE_CAMS_DETAILS", updateCamsDetailsEffectSaga);
}

//
export function* getUdhyamRegistrationDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      getUdhyamRegistrationDetailsAPI,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getUdhyamRegistrationDetailsWatcherSaga() {
  yield takeLatest(
    "GET_UDHYAM_REGISTRATION_DETAILS",
    getUdhyamRegistrationDetailsEffectSaga
  );
}




export function* getCamsDataEffectSaga(action) {
  console.log("getCamsDataEffectSaga")
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getCamsDataApi, action.payload);

    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {

    console.log(e, "errorrrrrr")
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getCamsDataWatcherSaga() {
  yield takeLatest('GET_CAMS_DATA', getCamsDataEffectSaga);
}

export function* updateCamsDataEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateCamsDataAPi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateCamsDataWatcherSaga() {
  yield takeLatest('UPDATE_CAMS_DATA', updateCamsDataEffectSaga);
}

export function* getCamDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getCamDetailsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getCamDetailsWatcherSaga() {
  yield takeLatest('GET_CAM_DETAILS', getCamDetailsEffectSaga);
}
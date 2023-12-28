import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import {
  getChargeTypesAPI,
  applychargeAPI,
  getChargeAPI
} from "../apis/charges";

export function* getChargeTypesEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getChargeTypesAPI);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getChargeTypesWatcherSaga() {
  yield takeLatest("GET_CHARGE_TYPES", getChargeTypesEffectSaga);
}

export function* applyChargeEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(applychargeAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* applyChargeWatcherSaga() {
  yield takeLatest("APPLY_CHARGE", applyChargeEffectSaga);
}

export function* getChargeWatcherSaga() {
  yield takeLatest("GET_CHARGE", getChargeEffectSaga);
}
export function* getChargeEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getChargeAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

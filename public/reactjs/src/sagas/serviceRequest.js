import { updatePreLoaderWatcher } from "../actions/user";
import {
  getServiceRequestApi,
  putServiceRequestActionApi,
  getForeclosureOfferRequestApi,
  getWaiverRequestApi,
  getWaiverRequestLoanApi
} from "../apis/serviceRequest";
import { takeLatest, call, put } from "redux-saga/effects";

export function* getServiceRequestEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getServiceRequestApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getServiceRequestWatcherSaga() {
  yield takeLatest("GET_FORECLOSURE_REQUEST", getServiceRequestEffectSaga);
}

export function* getForeclosureOfferRequestEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getForeclosureOfferRequestApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getForeclosureOfferRequestWatcherSaga() {
  yield takeLatest(
    "GET_FORECLOSURE_OFFER_REQUEST",
    getForeclosureOfferRequestEffectSaga
  );
}

export function* getWaiverRequestEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getWaiverRequestApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getWaiverRequestWatcherSaga() {
  yield takeLatest("GET_WAIVER_REQUEST", getWaiverRequestEffectSaga);
}

export function* getWaiverRequestLoanEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getWaiverRequestLoanApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getWaiverRequestLoanWatcherSaga() {
  yield takeLatest("GET_WAIVER_REQUEST_LOAN", getWaiverRequestLoanEffectSaga);
}

export function* putServiceRequestActionEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(putServiceRequestActionApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* putServiceRequestActionWatcherSaga() {
  yield takeLatest("SERVICE_REQUEST_ACTION", putServiceRequestActionEffectSaga);
}

import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import {
  createWaiverRequestApi,
  getWaiverRequestDetailsApi,
  getWaiverRequestDetailsByLoanApi,
  getWaiverRequestDetailsByReqIdApi,
  updateWaiverRequestStatusApi
} from "../apis/waiverRequest";

export function* createWaiverRequestEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(createWaiverRequestApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* createWaiverRequestWatcherSaga() {
  yield takeLatest("CREATE_WAIVER_REQUEST", createWaiverRequestEffectSaga);
}

export function* getWaiverRequestDetailsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getWaiverRequestDetailsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getWaiverRequestDetailsWatcherSaga() {
  yield takeLatest(
    "GET_WAIVER_REQUEST_DETAILS",
    getWaiverRequestDetailsEffectSaga
  );
}

export function* getWaiverRequestDetailsByLoanEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getWaiverRequestDetailsByLoanApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getWaiverRequestDetailsByLoanWatcherSaga() {
  yield takeLatest(
    "GET_WAIVER_REQUEST_BY_LOAN_DETAILS",
    getWaiverRequestDetailsByLoanEffectSaga
  );
}

export function* getWaiverRequestDetailsByReqIdEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      getWaiverRequestDetailsByReqIdApi,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getWaiverRequestDetailsByReqIdWatcherSaga() {
  yield takeLatest(
    "GET_WAIVER_REQUEST_DETAILS_BY_REQ_ID",
    getWaiverRequestDetailsByReqIdEffectSaga
  );
}

export function* updateWaiverRequestStatusEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateWaiverRequestStatusApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateWaiverRequestStatusWatcherSaga() {
  yield takeLatest(
    "UPDATE_WAIVER_REQUEST_STATUS",
    updateWaiverRequestStatusEffectSaga
  );
}

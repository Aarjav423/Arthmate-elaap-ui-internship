import { takeLatest, call, put } from "redux-saga/effects";
import {
  addDisburseConfigChannelApi,
  getAllDisburseConfigChannelApi,
  updateDisburseConfigChannelApi,
  updateDisburseConfigChannelStatusApi,
  deleteDisburseConfigChannelByIdApi,
  getDisburseConfigChannelBy_CID_PIDApi,
  addColenderDisburseConfigChannelApi
} from "../apis/DisbursementConfigChannel";
import { updatePreLoaderWatcher } from "../actions/user";

export function* addDisbursementChannelConfigEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(addDisburseConfigChannelApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addDisburseConfigChannelWatcherSaga() {
  yield takeLatest(
    "ADD_DISBURSEMENT_CONFIG_CHANNEL",
    addDisbursementChannelConfigEffectSaga
  );
}

export function* getAllDisburseConfigChannelEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getAllDisburseConfigChannelApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getAllDisburseConfigChannelWatcherSaga() {
  yield takeLatest(
    "GET_ALL_DISBURSEMENT_CONFIG_CHANNEL",
    getAllDisburseConfigChannelEffectSaga
  );
}

export function* getDisburseConfigChannelByCIDPIDEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      getDisburseConfigChannelBy_CID_PIDApi,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getDisburseConfigChannelByCIDPIDWatcherSaga() {
  yield takeLatest(
    "GET_DISBURSEMENT_CONFIG_CHANNEL_BY_CID_PID",
    getDisburseConfigChannelByCIDPIDEffectSaga
  );
}

export function* updateDisburseConfigChannelEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateDisburseConfigChannelApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateDisburseConfigChannelWatcherSaga() {
  yield takeLatest(
    "UPDATE_DISBURSEMENT_CONFIG_CHANNEL",
    updateDisburseConfigChannelEffectSaga
  );
}

export function* updateDisburseConfigChannelStatusEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      updateDisburseConfigChannelStatusApi,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateDisburseConfigChannelStatusWatcherSaga() {
  yield takeLatest(
    "UPDATE_DISBURSEMENT_CONFIG_CHANNEL_STATUS",
    updateDisburseConfigChannelStatusEffectSaga
  );
}

export function* deleteDisburseConfigChannelByIdEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      deleteDisburseConfigChannelByIdApi,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* deleteDisburseConfigChannelByIdWatcherSaga() {
  yield takeLatest(
    "DELETE_DISBURSEMENT_CONFIG_CHANNEL_BYID",
    deleteDisburseConfigChannelByIdEffectSaga
  );
}

export function* addColenderDisbursementChannelConfigEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      addColenderDisburseConfigChannelApi,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addColenderDisburseConfigChannelWatcherSaga() {
  yield takeLatest(
    "ADD_COLENDER_DISBURSEMENT_CONFIG_CHANNEL",
    addColenderDisbursementChannelConfigEffectSaga
  );
}

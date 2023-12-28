import {takeLatest, call, put} from "redux-saga/effects";

import {
  createBroadcastEventApi,
  getBroadcastEventByCompanyIdApi,
  updateBroadcastEventApi,
  createSubscriptionEventApi,
  getSubscriptionEventByCompanyIdApi,
  updateSubscriptionEventApi,
  updateBroadcastStatusEventApi
  

} from "../apis/pubsub";

import {updatePreLoaderWatcher} from "../actions/user";

export function* getBroadcastEventByCompanyIdApiEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getBroadcastEventByCompanyIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getBroadcastEventByCompanyIdWatcherSaga() {
  yield takeLatest(
    "BROADCAST_LIST_WATCHER",
    getBroadcastEventByCompanyIdApiEffectSaga
  );
}

export function* createBroadcastEventEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(createBroadcastEventApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* createBroadcastEventWatcherSaga() {
  yield takeLatest(
    "CREATE_BROADCAST_EVENT_WATCHER",
    createBroadcastEventEffectSaga
  );
}

export function* updateBroadcastEventEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(updateBroadcastEventApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateBroadcastEventWatcherSaga() {
  yield takeLatest(
    "UPDATE_BROADCAST_EVENT_WATCHER",
    updateBroadcastEventEffectSaga
  );
}

export function* updateBroadcastEventStatusEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(updateBroadcastStatusEventApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateBroadcastEventStatusWatcherSaga() {
  yield takeLatest(
    "UPDATE_BROADCAST_EVENT_STATUS_WATCHER",
    updateBroadcastEventStatusEffectSaga
  );
}

/* saga for sunscription event */

export function* getSubscriptionEventByCompanyIdApiEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(
      getSubscriptionEventByCompanyIdApi,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getSubscriptionEventByCompanyIdWatcherSaga() {
  yield takeLatest(
    "SUBSCRIPTION_LIST_WATCHER",
    getSubscriptionEventByCompanyIdApiEffectSaga
  );
}

export function* createSubscriptionEventEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(createSubscriptionEventApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* createSubscriptionEventWatcherSaga() {
  yield takeLatest(
    "CREATE_SUBSCRIPTION_EVENT_WATCHER",
    createSubscriptionEventEffectSaga
  );
}

export function* updateSubscriptionEventEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(updateSubscriptionEventApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateSubscriptionEventWatcherSaga() {
  yield takeLatest(
    "UPDATE_SUBSCRIPTION_EVENT_WATCHER",
    updateSubscriptionEventEffectSaga
  );
}



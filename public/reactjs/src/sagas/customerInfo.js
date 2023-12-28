import { takeLatest, call, put } from "redux-saga/effects";
import {
  getCustomerDataApi,
  getCustomerDocsApi,
  viewCustomerDocsApi,
  getCustomerDetailsApi
} from "../apis/customer";
import { updatePreLoaderWatcher } from "../actions/user";

export function* getCustomerDataEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(getCustomerDataApi, action.payload);
      yield put(updatePreLoaderWatcher(false));
      action.resolve(data);
    } catch (e) {
      yield put(updatePreLoaderWatcher(false));
      action.reject(e);
    }
  }
  
  export function* getCustomerDataWatcherSaga() {
    yield takeLatest(
      "GET_CUSTOMER_DATA_WATCHER",
      getCustomerDataEffectSaga
    );
  }

  export function* getCustomerDocsEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(getCustomerDocsApi, action.payload);
      yield put(updatePreLoaderWatcher(false));
      action.resolve(data);
    } catch (e) {
      yield put(updatePreLoaderWatcher(false));
      action.reject(e);
    }
  }

  export function* getCustomerDocsWatcherSaga() {
    yield takeLatest("GET_CUSTOMER_DOCS_WATCHER", getCustomerDocsEffectSaga);
  }

  export function* viewCustomerDocsEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(viewCustomerDocsApi, action.payload);
      yield put(updatePreLoaderWatcher(false));
      action.resolve(data);
    } catch (e) {
      yield put(updatePreLoaderWatcher(false));
      action.reject(e);
    }
  }

  export function* viewCustomerDocsWatcherSaga() {
    yield takeLatest("VIEW_CUSTOMER_DOCS_WATCHER", viewCustomerDocsEffectSaga);
  }

  export function* getCustomerDetailsEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(getCustomerDetailsApi, action.payload);
      yield put(updatePreLoaderWatcher(false));
      action.resolve(data);
    } catch (e) {
      yield put(updatePreLoaderWatcher(false));
      action.reject(e);
    }
  }
  
  export function* getCustomerDetailsWatcherSaga() {
    yield takeLatest(
      "GET_CUSTOMER_DETAILS_WATCHER",
      getCustomerDetailsEffectSaga
    );
  }



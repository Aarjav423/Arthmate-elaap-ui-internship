import { takeLatest, call, put } from "redux-saga/effects";
import {
  addServiceApi,
  getAllServicesApi,
  getServiceInvoiceApi,
  toggleServiceStatusApi,
  editServiceApi,
  getCompanyServicesApi,
  toggleCompanyServicesApi,
  getServicesPCByCompanyApi,
  getServiceByIdApi,
} from "../apis/services";
import { updatePreLoaderWatcher } from "../actions/user";

export function* addServiceWatcherEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(addServiceApi, action.payload, action.file);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addServiceWatcherSaga() {
  yield takeLatest("ADD_SERVICE_WATCHER", addServiceWatcherEffectSaga);
}

export function* getAllServicesEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getAllServicesApi);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getAllServicesWatcherSaga() {
  yield takeLatest("GET_ALL_SERVICES_WATCHER", getAllServicesEffectSaga);
}

export function* getServiceInvoiceEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getServiceInvoiceApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getServiceInvoiceWatcherSaga() {
  yield takeLatest("GET_SERVICE_INVOICE_WATCHER", getServiceInvoiceEffectSaga);
}

// Toggle service status
export function* toggleServiceStatusEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    let { data } = yield call(toggleServiceStatusApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* toggleServiceStatusWatcherSaga() {
  yield takeLatest("TOGGLE_SERVICE_STATUS_WATCHER", toggleServiceStatusEffectSaga);
}

export function* editServiceEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    let { data } = yield call(editServiceApi, action.payload, action.file);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* editServiceWatcherSaga() {
  yield takeLatest("EDIT_SERVICE_WATCHER", editServiceEffectSaga);
}

export function* getCompanyServicesEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getCompanyServicesApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getCompanyServicesWatcherSaga() {
  yield takeLatest("GET_COMPANY_SERVICES_WATCHER", getCompanyServicesEffectSaga);
}

export function* toggleCompanyServicesEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(toggleCompanyServicesApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* toggleCompanyServicesWatcherSaga() {
  yield takeLatest("TOGGLE_COMPANY_SERVICES_WATCHER", toggleCompanyServicesEffectSaga);
}

export function* getServicesPCByCompanyEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getServicesPCByCompanyApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getServicesPCByCompanyWatcherSaga() {
  yield takeLatest("GET_SERVICES_POSTMAN_COLLECTION_BY_COMPANY_WATCHER", getServicesPCByCompanyEffectSaga);
}

export function* getServiceByIdEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getServiceByIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getServiceByIdWatcherSaga() {
  yield takeLatest("GET_SERVICE_BY_ID_WATCHER", getServiceByIdEffectSaga);
}

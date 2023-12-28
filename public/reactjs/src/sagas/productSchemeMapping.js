import { updatePreLoaderWatcher } from "../actions/user";
import { takeLatest, call, put } from "redux-saga/effects";
import {
  getAllProductRequest,
  getAllProductSchemeMapping,
  getAllProductScheme,
  toggleProductSchemeStatusApi,
  getAllSchemeListApi,
  productSchemeMappedApi,
  getAllActiveProductRequest
} from "../apis/productSchemeMapping";

export function* getAllProductRequestEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getAllProductRequest, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getAllProductRequestWatcherSaga() {
  yield takeLatest("GET_ALL_PRODUCT_REQUEST", getAllProductRequestEffectSaga);
}

export function* getAllActiveProductRequestEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getAllActiveProductRequest, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getAllActiveProductRequestWatcherSaga() {
  yield takeLatest("GET_ALL_ACTIVE_PRODUCTS", getAllActiveProductRequestEffectSaga);
}

export function* getAllProductSchemeMappingEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getAllProductSchemeMapping, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getAllProductSchemeMappingWatcherSaga() {
  yield takeLatest(
    "GET_ALL_PRODUCT_SCHEME_MAPPING",
    getAllProductSchemeMappingEffectSaga
  );
}

export function* getAllProductSchemeEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getAllProductScheme, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getAllProductSchemeWatcherSaga() {
  yield takeLatest("GET_ALL_SCHEME", getAllProductSchemeEffectSaga);
}

export function* toggleProductSchemeStatusEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    let { data } = yield call(toggleProductSchemeStatusApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* toggleProductSchemeStatusWatcherSaga() {
  yield takeLatest(
    "UPDATE_TOGGLE_PRODUCT_SCHEME_STATUS",
    toggleProductSchemeStatusEffectSaga
  );
}

export function* getAllSchemesListEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    let { data } = yield call(getAllSchemeListApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getAllSchemesListWatcherSaga() {
  yield takeLatest("GET_ALL_SCHEMES_LIST", getAllSchemesListEffectSaga);
}

export function* productSchemeMappedEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    let { data } = yield call(productSchemeMappedApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* productSchemeMappedWatcherSaga() {
  yield takeLatest("PRODUCT_SCHEME_MAPPED", productSchemeMappedEffectSaga);
}

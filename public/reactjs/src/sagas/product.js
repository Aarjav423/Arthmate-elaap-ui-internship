import { takeLatest, call, put } from "redux-saga/effects";
import {
  createProductApi,
  getAllProductByCompanyIdApi,
  getAllProductByLocCompanyIdApi,
  toggleProductStatusApi,
  getPostmanCollectionLoanBookApi,
  getProductByIdApi,
  getProductByCompanyApi,
  companyProductIdAPI,
  createProductWithConfigApi
} from "../apis/product";
import { updateProductListWatcher } from "../actions/product";
import { updatePreLoaderWatcher } from "../actions/user";

export function* createProductEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(createProductApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* createProductWatcherSaga() {
  yield takeLatest("CREATE_PRODUCT", createProductEffectSaga);
}

export function* getAllProductByCompanyIdEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const { data } = yield call(getAllProductByCompanyIdApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getAllProductByCompanyIdWatcherSaga() {
  yield takeLatest(
    "GET_ALL_PRODUCT_BY_COMPANY_ID_WATCHER",
    getAllProductByCompanyIdEffectSaga
  );
}

export function* getAllProductByLocCompanyIdEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const { data } = yield call(getAllProductByLocCompanyIdApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getAllProductByLocCompanyIdWatcherSaga() {
  yield takeLatest(
    "GET_ALL_PRODUCT_BY_LOC_COMPANY_ID_WATCHER",
    getAllProductByLocCompanyIdEffectSaga
  );
}

export function* toggleProductStatusEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(toggleProductStatusApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* toggleProductStatusWatcherSaga() {
  yield takeLatest("TOGGLE_PRODUCT_STATUS", toggleProductStatusEffectSaga);
}

export function* getPostmanCollectionLoanBookEffectSaga(action) {
  //  data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(
      getPostmanCollectionLoanBookApi,
      action.payload
    );
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getPostmanCollectionLoanBookWatcherSaga() {
  yield takeLatest(
    "POSTMAN_COLLECTION_LOANBOOK_WATCHER",
    getPostmanCollectionLoanBookEffectSaga
  );
}

export function* getProductByIdEffectSaga(action) {
  //  data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getProductByIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getProductByIdWatcherSaga() {
  yield takeLatest("PRODUCT_BY_ID_WATCHER", getProductByIdEffectSaga);
}

export function* companyProductIdEffectSaga(action) {
  //  data is obtained after axios call is resolved
  try {
    const { data } = yield call(companyProductIdAPI, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}
export function* companyProductIdWatcherSaga() {
  yield takeLatest(
    "GET_PRODUCT_BY_COMPANY_AND_PRODUCT_WATCHER",
    companyProductIdEffectSaga
  );
}

export function* getProductByCompanyEffectSaga(action) {
  //  data is obtained after axios call is resolved
  try {
    const { data } = yield call(getProductByCompanyApi, action.payload);
    action.resolve(data);
    yield put(updateProductListWatcher(data));
  } catch (e) {
    action.reject(e);
  }
}

export function* getProductByCompanyWatcherSaga() {
  yield takeLatest(
    "GET_PRODUCT_BY_COMPANY_WATCHER",
    getProductByCompanyEffectSaga
  );
}

export function* createProductWithConfigEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(createProductWithConfigApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* createProductWithConfigWatcherSaga() {
  yield takeLatest(
    "CREATE_PRODUCT_WITH_CONFIG",
    createProductWithConfigEffectSaga
  );
}

import { takeLatest, call, put } from "redux-saga/effects";
import {
  getLoanDocsApi,
  getProductDetailsApi,
  getDocDetailsApi,
  uploadLoanDocumentsApi,
  uploadLoanDocumentsXmlJsonApi,
  viewDocsApi,
  uploadDrawDownDocumentsApi,
  getDrawDownDocsApi,
  getLoanDocumentsApi,
} from "../apis/loanDocuments";
import { updatePreLoaderWatcher } from "../actions/user";

export function* getLoanDocsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getLoanDocsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getProductDetailsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const { data } = yield call(getProductDetailsApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getDocDetailsEffectSaga(action) {
  try {
    const { data } = yield call(getDocDetailsApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getLoanDocsWatcherSaga() {
  yield takeLatest("GET_LOAN_DOCS_WATCHER", getLoanDocsEffectSaga);
}

export function* getProductDetailsWatcherSaga() {
  yield takeLatest("GET_PRODUCT_DETAILS_WATCHER", getProductDetailsEffectSaga);
}

export function* getDocDetailsWatcherSaga() {
  yield takeLatest("GET_DOC_DETAILS_WATCHER", getDocDetailsEffectSaga);
}

export function* getDrawDownDocsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getDrawDownDocsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getDrawDownDocsWatcherSaga() {
  yield takeLatest("GET_DRAWDOWN_DOCS_WATCHER", getDrawDownDocsEffectSaga);
}

export function* uploadLoanDocumentsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));

    const { data } = yield call(uploadLoanDocumentsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* uploadLoanDocumentsXmlJsonEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(uploadLoanDocumentsXmlJsonApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* uploadLoanDocumentsWatcherSaga() {
  yield takeLatest(
    "UPLOAD_LOAN_DOCUMENTS_WATCHER",
    uploadLoanDocumentsEffectSaga
  );
}

export function* uploadLoanDocumentsXmlJsonWatcherSaga() {
  yield takeLatest(
    "UPLOAD_LOAN_DOCUMENTS_XML_JSON_WATCHER",
    uploadLoanDocumentsXmlJsonEffectSaga
  );
}

export function* uploadDrawDownDocumentsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(uploadDrawDownDocumentsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* uploadDrawDownDocumentsWatcherSaga() {
  yield takeLatest(
    "UPLOAD_DRAWDOWN_DOCUMENTS_WATCHER",
    uploadDrawDownDocumentsEffectSaga
  );
}

export function* viewDocsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(viewDocsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* viewDocsWatcherSaga() {
  yield takeLatest("VIEW_DOCS_WATCHER", viewDocsEffectSaga);
}

export function* getLoanDocumentsWatcherEffectSaga(action) {
  try {
    const response = yield call(getLoanDocumentsApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getLoanDocumentsWatcherSaga() {
  yield takeLatest(
    "FETCH_LOAN_DOCUMENT",
    getLoanDocumentsWatcherEffectSaga
  );
}

import { takeLatest, call, put } from "redux-saga/effects";
import {
  addAnchorApi,
  anchorListApi,
  viewAnchorDetailsApi,
  viewAnchorDocsApi,
  uploadAnchorDocsApi,
  fetchAnchorDocsApi
} from "../apis/addAnchor";
import { updatePreLoaderWatcher } from "../actions/user";

export function* addAnchorEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(addAnchorApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}
export function* anchorListEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(anchorListApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addAnchorWatcherSaga() {
  yield takeLatest("ADD_ANCHOR_WATCHER", addAnchorEffectSaga);
}
export function* anchorListWatcherSaga() {
  yield takeLatest("ANCHOR_LIST_WATCHER", anchorListEffectSaga);
}
export function* viewAnchorDetailsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(viewAnchorDetailsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* viewAnchorDetailsWatcherSaga() {
  yield takeLatest("VIEW_ANCHOR_DETAILS_WATCHER", viewAnchorDetailsEffectSaga);
}

//////
export function* viewAnchorDocsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(viewAnchorDocsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* viewAnchorDocsWatcherSaga() {
  yield takeLatest("VIEW_ANCHOR_DOCS_WATCHER", viewAnchorDocsEffectSaga);
}

export function* uploadAnchorDocsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(uploadAnchorDocsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* uploadAnchorDocsWatcherSaga() {
  yield takeLatest("UPLOAD_ANCHOR_DOC_WATCHER", uploadAnchorDocsEffectSaga);
}

export function* fetchAnchorDocsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(fetchAnchorDocsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* fetchAnchorDocsWatcherSaga() {
  yield takeLatest("FETCH_ANCHOR_DOCS_WATCHER", fetchAnchorDocsEffectSaga);
}

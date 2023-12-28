import { takeLatest, call, put } from "redux-saga/effects";
import {
  addPartnerApi,
  partnerListApi,
  viewPartnerDetailsApi,
  viewPartDocsApi,
  uploadPartDocsApi,
  fetchPartDocsApi
} from "../apis/addPartner";
import { updatePreLoaderWatcher } from "../actions/user";

export function* addPartnerEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(addPartnerApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}
export function* partnerListEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(partnerListApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addPartnerWatcherSaga() {
  yield takeLatest("ADD_PARTNER_WATCHER", addPartnerEffectSaga);
}
export function* partnerListWatcherSaga() {
  yield takeLatest("PARTNER_LIST_WATCHER", partnerListEffectSaga);
}
export function* viewPartnerDetailsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(viewPartnerDetailsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* viewPartnerDetailsWatcherSaga() {
  yield takeLatest(
    "VIEW_PARTNER_DETAILS_WATCHER",
    viewPartnerDetailsEffectSaga
  );
}

//////
export function* viewPartDocsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(viewPartDocsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* viewPartDocsWatcherSaga() {
  yield takeLatest("VIEW_PART_DOCS_WATCHER", viewPartDocsEffectSaga);
}
//////

export function* uploadPartDocsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(uploadPartDocsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* uploadPartDocsWatcherSaga() {
  yield takeLatest("UPLOAD_PART_DOC_WATCHER", uploadPartDocsEffectSaga);
}

export function* fetchPartDocsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(fetchPartDocsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* fetchPartDocsWatcherSaga() {
  yield takeLatest("FETCH_PART_DOCS_WATCHER", fetchPartDocsEffectSaga);
}

import { takeLatest, call, put } from 'redux-saga/effects';
import { getForeClosureLoanApi, addForeClosureLoanApi, getForceCloseLoanApi, addForceCloseLoanApi, getForeClosureRequestDetail, updateForeClosureRequestStatus, getForeClosureOfferRequestDetail } from '../apis/foreClosureRequest';
import { updatePreLoaderWatcher } from '../actions/user';
export function* getForeclosureOfferEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getForeClosureLoanApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getForeclosureOfferWatcherSaga() {
  yield takeLatest('FORECLOSURE_REQUEST_GET_WATCHER', getForeclosureOfferEffectSaga);
}

export function* addForeclosureOfferEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(addForeClosureLoanApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addForeclosureOfferWatcherSaga() {
  yield takeLatest('FORECLOSURE_REQUEST_POST_WATCHER', addForeclosureOfferEffectSaga);
}

//watcher to get foreclosure details
export function* getForeClosureDetailsByRequestIdSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getForeClosureRequestDetail, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getForeClosureDetailsByRequestIdWatcherSaga() {
  yield takeLatest('GET_FORECLOSURE_REQUEST_DETAILS_BY_REQ_ID', getForeClosureDetailsByRequestIdSaga);
}

//watcher to approve foreclosure
export function* updateForeClosureRequestSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateForeClosureRequestStatus, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateForeClosureRequestSagaIdWatcherSaga() {
  yield takeLatest('UPDATE_FORECLOSURE_REQUEST_APPROVE_STATUS', updateForeClosureRequestSaga);
}

export function* getForeclosureOfferRequestEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getForeClosureOfferRequestDetail, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getForeclosureOffersRequestsWatcherSaga() {
  yield takeLatest('GET_FORECLOSURE_OFFER_REQUEST_WATCHER', getForeclosureOfferRequestEffectSaga);
}

export function* getForceCloseEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getForceCloseLoanApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getForceCloseWatcherSaga() {
  yield takeLatest('FORCE_CLOSE_GET_WATCHER', getForceCloseEffectSaga);
}

export function* addForceCloseEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(addForceCloseLoanApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addForceCloseWatcherSaga() {
  yield takeLatest('FORCE_CLOSE_POST_WATCHER', addForceCloseEffectSaga);
}

import { updatePreLoaderWatcher } from '../actions/user';
import { takeLatest, call, put } from 'redux-saga/effects';
import { getRefundDetails, initiateRefundApi, initiateExcessRefundApi } from '../apis/refund';

export function* getRefundDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getRefundDetails, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getRefundDetailsWatcherSaga() {
  yield takeLatest('GET_REFUND_DETAILS', getRefundDetailsEffectSaga);
}

export function* initiateRefundEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(initiateRefundApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* initiateRefundWatcherSaga() {
  yield takeLatest('INITIATE_REFUND', initiateRefundEffectSaga);
}

export function* initiateExcessRefundEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(initiateExcessRefundApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* initiateExcessRefundWatcherSaga() {
  yield takeLatest('INITIATE_EXCESS_REFUND', initiateExcessRefundEffectSaga);
}

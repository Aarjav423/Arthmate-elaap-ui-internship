import { takeLatest, call, put } from 'redux-saga/effects';
import { updatePreLoaderWatcher } from '../actions/user';
import { postTDSRefundRequestApi } from '../apis/TdsRefundRequest';

export function* getTdsRefundEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(postTDSRefundRequestApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getTdsRefundRequestWatcherSaga() {
  yield takeLatest('POST_TDS_REFUND_REQUESTS', getTdsRefundEffectSaga);
}

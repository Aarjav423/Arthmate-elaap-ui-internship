import { takeLatest, call, put } from "redux-saga/effects";
import {
  repaymentV2FormPostApi,
} from "../apis/repaymentV2";
import { updatePreLoaderWatcher } from "../actions/user";


export function* repaymentV2FormPostEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(repaymentV2FormPostApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* repaymentV2FormPostWatcherSaga() {
  yield takeLatest(
    "REPAYMENTV2_FORM_POST_WATCHER",
    repaymentV2FormPostEffectSaga
  );
}

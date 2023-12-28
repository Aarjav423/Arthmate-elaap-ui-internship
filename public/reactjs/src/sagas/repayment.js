import { takeLatest, call, put } from "redux-saga/effects";
import {
  repaymentFormPostApi,
} from "../apis/repayment";
import { updatePreLoaderWatcher } from "../actions/user";


export function* repaymentFormPostEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(repaymentFormPostApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* repaymentFormPostWatcherSaga() {
  yield takeLatest(
    "REPAYMENT_FORM_POST_WATCHER",
    repaymentFormPostEffectSaga
  );
}

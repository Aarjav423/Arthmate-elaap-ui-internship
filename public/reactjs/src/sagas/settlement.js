import { updatePreLoaderWatcher } from "../actions/user";
import { takeLatest, call, put } from "redux-saga/effects";
import { getSettlementetails } from "../apis/settlementRequest";

export function* getSettlementRequestEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getSettlementetails, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

  export function* getSettlementRequestWatcherSaga() {
  yield takeLatest("GET_SETTLEMENT_REQUEST", getSettlementRequestEffectSaga);
}
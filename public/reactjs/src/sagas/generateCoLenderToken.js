import { takeLatest, call } from "redux-saga/effects";
import { getCoLenderTokenApi } from "../apis/generateCoLenderToken";

// Generate access token for partners
export function* getCoLenderTokenEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const { data } = yield call(getCoLenderTokenApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getCoLenderTokenWatcherSaga() {
  yield takeLatest("GET_CO_LENDER_TOKEN_WATCHER", getCoLenderTokenEffectSaga);
}

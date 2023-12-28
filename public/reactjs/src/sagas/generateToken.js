import { takeLatest, call } from "redux-saga/effects";
import { getTokenApi } from "../apis/generateToken";

// Generate access token for partners
export function* getTokenEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const { data } = yield call(getTokenApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getTokenWatcherSaga() {
  yield takeLatest("GET_TOKEN_WATCHER", getTokenEffectSaga);
}

import { takeLatest, call, put } from "redux-saga/effects";
import { recalibrateSanction } from "../apis/recalibrateSanction";

export function* recalibrateSanctionEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(recalibrateSanction, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* recalibrateSanctionWatcherSaga() {
  yield takeLatest("RECALIBRATE_SANCTION", recalibrateSanctionEffectSaga);
}

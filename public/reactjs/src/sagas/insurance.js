import {takeLatest, call, put} from "redux-saga/effects";
import {calculateInsurancePremiumApi} from "../apis/insurance";
import {updatePreLoaderWatcher} from "../actions/user";

export function* calculateInsurancePremiumEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(calculateInsurancePremiumApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* calculateInsurancePremiumWatcherSaga() {
  yield takeLatest(
    "CALCULATE_INSURANCE_PREMIUM_WATCHER",
    calculateInsurancePremiumEffectSaga
  );
}

import { takeLatest, call } from "redux-saga/effects";
import { getLocationPincodesApi } from "../../apis/collection/location.api";

export function* getLocationPincodesEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const response = yield call(getLocationPincodesApi, action.data);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getLocationPincodesWatcherSaga() {
  yield takeLatest("FETCH_LOCATION_PINCODES", getLocationPincodesEffectSaga);
}

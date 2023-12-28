import {takeLatest, call, put} from "redux-saga/effects";
import {updatePreLoaderWatcher} from "../actions/user";
import { getInsurancePolicyAPI } from "../apis/downloadInsurancePolicy";

export function* getInsurancePolicyEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getInsurancePolicyAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getInsurancePolicyWatcherSaga() {
  yield takeLatest(
    "DOWNLOAD_INSURANCE_POLICY",
    getInsurancePolicyEffectSaga
  );
}

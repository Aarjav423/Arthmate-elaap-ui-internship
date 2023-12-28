import { takeLatest, call, put } from "redux-saga/effects";
import {
  getCompanies
} from "../apis/partnerAnalytics";
import { updatePreLoaderWatcher } from "../actions/user";

export function* fetchCompaniesEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const { data } = yield call(getCompanies, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* fetchCompaniesWatcherSaga(action) {
  // data is obtained after axios call is resolved
  yield takeLatest(
    "FETCH_COMPANIES",
    fetchCompaniesEffectSaga
  );
}

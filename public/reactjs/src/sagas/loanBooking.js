import { takeLatest, call, put } from "redux-saga/effects";
import {
  fetchLoanschemaCustomeIdApi,
  getAllLoanBookingTemplateApi,
} from "../apis/loanBooking";
import { updatePreLoaderWatcher } from "../actions/user";

export function* fetchLoanSchemaCustomIdEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(fetchLoanschemaCustomeIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* fetchLoanSchemaCustomeDataWatcherSaga() {
  yield takeLatest(
    "FETCH_LOAN_SCHEMA_CUSTOM_DATA",
    fetchLoanSchemaCustomIdEffectSaga
  );
}

export function* getLoanBookingTemplateEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getAllLoanBookingTemplateApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getAllLoanBookingTemplateWatcherSaga() {
  yield takeLatest(
    "GET_ALL_LOAN_BOOKING_TEMPLATES_WATCHER",
    getLoanBookingTemplateEffectSaga
  );
}

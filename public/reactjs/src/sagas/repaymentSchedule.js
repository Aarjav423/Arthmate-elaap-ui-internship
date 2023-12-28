import { takeLatest, call, put } from "redux-saga/effects";
import {
  repaymentScheduleForLocApi,
  repaymentScheduleFormPostApi,
  repaymentScheduleListApi,
  repaymentScheduleRaiseDueApi
} from "../apis/repaymentSchedule";
import { updatePreLoaderWatcher } from "../actions/user";

export function* repaymentScheduleFormPostEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(repaymentScheduleFormPostApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* repaymentScheduleFormPostWatcherSaga() {
  yield takeLatest(
    "REPAYMENT_SCHEDULE_FORM_POST_WATCHER",
    repaymentScheduleFormPostEffectSaga
  );
}

export function* repaymentScheduleListEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(repaymentScheduleListApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* repaymentScheduleListWatcherSaga() {
  yield takeLatest(
    "REPAYMENT_SCHEDULE_LIST_WATCHER",
    repaymentScheduleListEffectSaga
  );
}
export function* repaymentScheduleForLocEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(repaymentScheduleForLocApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* repaymentScheduleForLocWatcherSaga() {
  yield takeLatest(
    "REPAYMENT_SCHEDULE_FOR_LOC",
    repaymentScheduleForLocEffectSaga
  );
}

export function* repaymentScheduleForRaiseDueEffectSaga(action) {
  try {
    //yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(repaymentScheduleRaiseDueApi, action.payload);
    //yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    //yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}
export function* repaymentScheduleForRaiseDueWatcherSaga() {
  yield takeLatest(
    "REPAYMENT_SCHEDULE_FOR_RAISE_DUE_WATCHER",
    repaymentScheduleForRaiseDueEffectSaga
  );
}

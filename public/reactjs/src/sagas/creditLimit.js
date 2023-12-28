import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import { setCreditLimit, updateCreditLimit } from "../apis/creditLimit";

export function* setCreditLimitEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(setCreditLimit, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* setCreditLimitWatcherSaga() {
  yield takeLatest("SET_CREDIT_LIMIT", setCreditLimitEffectSaga);
}

export function* updateCreditLimitEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateCreditLimit, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateCreditLimitWatcherSaga() {
  yield takeLatest("UPDATE_CREDIT_LIMIT", updateCreditLimitEffectSaga);
}

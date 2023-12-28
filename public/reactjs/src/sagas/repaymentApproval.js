import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import {
  approveRepayments,
  getPendingRepaymentList
} from "../apis/repaymentApproval";

export function* getPendingRepaymentListEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getPendingRepaymentList, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getPendingRepaymentListWatcherSaga() {
  yield takeLatest(
    "GET_PENDING_REPAYMENT_LIST",
    getPendingRepaymentListEffectSaga
  );
}
export function* approveRepaymentsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(approveRepayments, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* approveRepaymentsWatcherSaga() {
  yield takeLatest("APPROVE_REPAYMENTS", approveRepaymentsEffectSaga);
}

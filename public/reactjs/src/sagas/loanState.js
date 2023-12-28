import { takeLatest, call } from "redux-saga/effects";
import { getLoanStateByLoanIdApi } from "../apis/loanState";
import { saveToStorage } from "../util/localstorage";

export function* getLoanStateByLoanIdEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const { data } = yield call(getLoanStateByLoanIdApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}
export function* getLoanStateByLoanIdWatcherSaga() {
  yield takeLatest(
    "GET_LOAN_STATE_BY_LOAN_ID_WATCHER",
    getLoanStateByLoanIdEffectSaga
  );
}

import { takeLatest, call, put } from "redux-saga/effects";
import {
  getAllDisburseConfigChannelApi,
  addDisbursementChannelApi,
  deleteDisbursementChannelApi,
  onboardDisbursementChannelApi,
  updateDisbursementChannelApi,
  compositeDisbursementAPI,
  processDrawdownAPI,
  getLoanByStatusAPI,
  getLoanByStatusApiForLoc,
  compositeDrawdownApi,
  batchDisbursementApi,
  fetchBankDetailsApi,
  fetchSchemeDetailsApi,
  updateDrawdownRequestApi,
  calculateNetDrawDownAmountApi
} from "../apis/compositeDisbursement";
import { updatePreLoaderWatcher } from "../actions/user";

export function* getListDisbursementChannelEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getAllDisburseConfigChannelApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getListDisbursementChannelWatcherSaga() {
  yield takeLatest(
    "GET_LIST_DISBURSEMENT_CHANNEL",
    getListDisbursementChannelEffectSaga
  );
}

export function* addDisbursementChannelEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(addDisbursementChannelApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addDisbursementChannelWatcherSaga() {
  yield takeLatest("ADD_TOPUP_DISBURSEMENT", addDisbursementChannelEffectSaga);
}

export function* deleteDisbursementChannelEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(deleteDisbursementChannelApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* deleteDisbursementChannelWatcherSaga() {
  yield takeLatest(
    "DELETE_DISBURSEMENT_CHANNEL",
    deleteDisbursementChannelEffectSaga
  );
}

export function* updateDisbursementChannelEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateDisbursementChannelApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateDisbursementChannelWatcherSaga() {
  yield takeLatest(
    "UPDATE_DISBURSEMENT_CHANNEL",
    updateDisbursementChannelEffectSaga
  );
}

export function* onboardDisbursementChannelEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(onboardDisbursementChannelApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* onboardDisbursementChannelWatcherSaga() {
  yield takeLatest(
    "ONBOARD_DISBURSEMENT_CHANNEL",
    onboardDisbursementChannelEffectSaga
  );
}

export function* compositeDisbursementEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(compositeDisbursementAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* compositeDisbursementWatcherSaga() {
  yield takeLatest("COMPOSITE_DISBURSEMENT", compositeDisbursementEffectSaga);
}

// VALIDATE-DRAWDOWN-SAGA

export function* processDrawdownPfEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(processDrawdownAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* processDrawdownPfWatcherSaga() {
  yield takeLatest("PROCESS_DRAWDOWN_PF", processDrawdownPfEffectSaga);
}

export function* getLoanByStatusEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getLoanByStatusAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getLoanByStatusWatcherSaga() {
  yield takeLatest("GET_LOAN_BY_STATUS", getLoanByStatusEffectSaga);
}
export function* getLoanByStatusForLocEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getLoanByStatusApiForLoc, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getLoanByStatusForLocWatcherSaga() {
  yield takeLatest("GET_UNPROCESSED_REQUEST", getLoanByStatusForLocEffectSaga);
}
export function* compositeDrawdownEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(compositeDrawdownApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* compositeDrawdownWatcherSaga() {
  yield takeLatest("COMPOSITE_DRAWDOWN", compositeDrawdownEffectSaga);
}

//
export function* batchDisbursementEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(batchDisbursementApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* batchDisbursementWatcherWatcherSaga() {
  yield takeLatest("BATCH_DISBURSEMENT", batchDisbursementEffectSaga);
}
//

export function* fetchBankDetailsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(fetchBankDetailsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* fetchBankDetailsWatcherSaga() {
  yield takeLatest("FETCH_BANK_DETAILS", fetchBankDetailsEffectSaga);
}

export function* fetchSchemeDetailsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(fetchSchemeDetailsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* fetchSchemeDetailsWatcherSaga() {
  yield takeLatest("FETCH_SCHEME_DETAILS", fetchSchemeDetailsEffectSaga);
}

export function* updateDrawdownRequestEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateDrawdownRequestApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateDrawdownRequestWatcherSaga() {
  yield takeLatest("UPDATE_DRAWDOWN_REQUEST", updateDrawdownRequestEffectSaga);
}

export function* calculateNetDrawDownAmountEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(calculateNetDrawDownAmountApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* calculateNetDrawDownAmountWatcherSaga() {
  yield takeLatest("CALCULATE_NET_DRAWDOWN_AMOUNT", calculateNetDrawDownAmountEffectSaga);
}
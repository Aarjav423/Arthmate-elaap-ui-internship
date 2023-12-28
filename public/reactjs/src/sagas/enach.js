import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import { getEmiData, createSubscriptionApi,submitForNachPresentation,getNachDetailsApi ,
  getSingleNachDetailApi , getNachTransactionDetailApi ,postNachCreatePresentmentApi ,
  getNachGeneratedTokenApi , getNachMandatePurpose  ,getNachHoldRegistrationApi ,
  getNachRevokeRegistrationApi, cancelNachRegistrationApi, getNachLiveBankDetailsApi,
  getLoanDetailsNachApi } from "../apis/enach";

export function* getEmiDataEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getEmiData, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getEmiDataWatcherSaga() {
  yield takeLatest("GET_EMI_DATA", getEmiDataEffectSaga);
}
export function* submitForNachPresentationEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(submitForNachPresentation, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* submitForNachPresentationWatcherSaga() {
  yield takeLatest(
    "SUBMIT_FOR_NACH_PRESENTATION",
    submitForNachPresentationEffectSaga
  );
}

export function* nachDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getNachDetailsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* nachDetailsWatcherSaga() {
  yield takeLatest(
    "GET_NACH_DETAILS",
    nachDetailsEffectSaga
  );
}

export function* nachHoldRegistrationEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getNachHoldRegistrationApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* nachHoldRegistrationWatcherSaga() {
  yield takeLatest(
    "NACH_HOLD_REGISTRATION",
    nachHoldRegistrationEffectSaga
  );
}

export function* nachRevokeRegistrationEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getNachRevokeRegistrationApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* nachRevokeRegistrationWatcherSaga() {
  yield takeLatest(
    "NACH_REVOKE_REGISTRATION",
    nachRevokeRegistrationEffectSaga
  );
}

export function* cancelNachRegistrationEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(cancelNachRegistrationApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* cancelNachRegistrationWatcherSaga() {
  yield takeLatest(
      "CANCEL_NACH_REGISTRATION",
      cancelNachRegistrationEffectSaga
  );
}

export function* createSubscriptionEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(createSubscriptionApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* nachSingleDetailEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getSingleNachDetailApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* createSubscriptionWatcherSaga() {
  yield takeLatest(
    "CREATE_SUBSCRIPTION",
    createSubscriptionEffectSaga
  );
}
export function* nachRowDetailWatcherSaga() {
  yield takeLatest(
    "GET_ROW_NACH_DETAIL",
    nachSingleDetailEffectSaga
  );
}

export function* getMandatePurposeEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getNachMandatePurpose, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function*  getMandatePurposeWatcherSaga() {
  yield takeLatest(
    "GET_NACH_PURPOSE_DETAIL",
    getMandatePurposeEffectSaga
  );
}

export function* nachTransactionDetailEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getNachTransactionDetailApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* nachTransactionDetailWatcherSaga() {
  yield takeLatest(
    "GET_NACH_TRANSACTION_DETAIL",
    nachTransactionDetailEffectSaga
  );
}

export function* nachCreatePresentmentEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(postNachCreatePresentmentApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* nachCreatePresentmentWatcherSaga() {
  yield takeLatest(
    "POST_NACH_PRESENTMENT_DETAIL",
    nachCreatePresentmentEffectSaga
  );
}
 
export function* nachGetGeneratedTokenEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getNachGeneratedTokenApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* nachGenerateTokenWatcherSaga() {
  yield takeLatest(
    "GET_NACH_GENERATE_TOKEN",
    nachGetGeneratedTokenEffectSaga
  );
}

export function* nachLiveBankDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getNachLiveBankDetailsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* nachLiveBankDetailsWatcherSaga() {
  yield takeLatest(
    "GET_NACH_LIVE_BANK_DETAILS",
    nachLiveBankDetailsEffectSaga
  );
}

export function* getLoanDetailsNachEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getLoanDetailsNachApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getLoanDetailsNachWatcherSaga() {
  yield takeLatest(
    "GET_LOAN_DETAILS_NACH",
    getLoanDetailsNachEffectSaga
  );
}

import { takeLatest, call, put } from "redux-saga/effects";
import {
  addloanSchemaApi,
  getLoanSchemaByCompanyIdApi,
  updateLoanSchemaApi,
  loadTemplateEnumsApi
} from "../apis/loanSchema";
import { updatePreLoaderWatcher } from "../actions/user";

export function* addLoanSchemaEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(addloanSchemaApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addLoanSchemaWatcherSaga() {
  yield takeLatest("ADD_LOAN_SCHEMA", addLoanSchemaEffectSaga);
}

export function* getLoanSchemaByCompanyIdEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const { data } = yield call(getLoanSchemaByCompanyIdApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getLoanSchemaByCompanyIdWatcherSaga() {
  yield takeLatest(
    "GET_LOAN_SCHEMA_BY_COMPANY_ID_WATCHER",
    getLoanSchemaByCompanyIdEffectSaga
  );
}

export function* updateLoanSchemaEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const { data } = yield call(updateLoanSchemaApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* updateLoanSchemaWatcherSaga() {
  yield takeLatest("UPDATE_LOAN_SCHEMA_WATCHER", updateLoanSchemaEffectSaga);
}

export function* loadTemplateEffectSaga(action) {
  try {
    const { data } = yield call(loadTemplateEnumsApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}
export function* loadTemplateWatcherSaga() {
  yield takeLatest("LOAD_TEMPLATE_ENUMS_WATCHER", loadTemplateEffectSaga);
}

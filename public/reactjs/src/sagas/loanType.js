import {takeLatest, call, put} from "redux-saga/effects";
import {
  addLoanTypeApi,
  getLoanTemplateNamesApi,
  addLoanTemplateNamesApi,
  getLoanTypeApi,
  tempXlsxToJsonApi,
  getDefaultTemplatesApi,
  getSchemaTemplatesApi,
  updateCustomTemplatesApi,
  getCompanyLoanSchemaApi,
  addLoanDocTemplateApi
} from "../apis/loanType";
import {updatePreLoaderWatcher} from "../actions/user";
import {updateSchemaListWatcher} from "../actions/loanType";

// MULTIPLE
export function* tempXlsxToJsonEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(tempXlsxToJsonApi, action.payload, action.id);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* tempXlsxToJsonWatcherSaga() {
  yield takeLatest("TEMP_XLSX_TO_JSON", tempXlsxToJsonEffectSaga);
}

export function* addLoanTypeEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(addLoanTypeApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addLoanTypeWatcherSaga() {
  yield takeLatest("ADD_LOAN_TYPE", addLoanTypeEffectSaga);
}

export function* getLoanTemplateNamesEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getLoanTemplateNamesApi);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getLoanTemplateNamesWatcherSaga() {
  yield takeLatest("LOAN_TEMPLATE_NAMES", getLoanTemplateNamesEffectSaga);
}

export function* addLoanTemplateNamesEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(addLoanTemplateNamesApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getLoanTypeEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getLoanTypeApi);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getDefaultTemplatesEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(getDefaultTemplatesApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* addLoanTemplateNamesWatcherSaga() {
  yield takeLatest("ADD_LOAN_TEMPLATE_NAMES", addLoanTemplateNamesEffectSaga);
}

export function* getLoanTypeWatcherSaga() {
  yield takeLatest("GET_LOAN_TYPE", getLoanTypeEffectSaga);
}

export function* getDefaultTemplatesWatcherSaga() {
  yield takeLatest(
    "GET_DEFAULT_TEMPLATES_WATCHER",
    getDefaultTemplatesEffectSaga
  );
}

export function* getCompanyLoanSchemaEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(getCompanyLoanSchemaApi, action.payload);
    action.resolve(data);
    yield put(updateSchemaListWatcher(data));
  } catch (e) {
    action.reject(e);
  }
}

export function* getCompanyLoanSchemaWatcherSaga() {
  yield takeLatest(
    "GET_COMPANY_LOAN_SCHEMA_WATCHER",
    getCompanyLoanSchemaEffectSaga
  );
}

export function* addLoanDocTemplateEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(addLoanDocTemplateApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addLoanDocTemplateWatcherSaga() {
  yield takeLatest("ADD_LOAN_DOC_TEMPLATE", addLoanDocTemplateEffectSaga);
}

export function* getSchemaTemplatesEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(getSchemaTemplatesApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getSchemaTemplatesWatcherSaga() {
  yield takeLatest(
    "GET_SCHEMA_TEMPLATES_WATCHER",
    getSchemaTemplatesEffectSaga
  );
}

export function* updateCustomTemplatesEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(updateCustomTemplatesApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* updateCustomTemplatesWatcherSaga() {
  yield takeLatest(
    "UPDTAE_CUSTOM_TEMPLATES_WATCHER",
    updateCustomTemplatesEffectSaga
  );
}

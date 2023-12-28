import { takeLatest, call, put } from 'redux-saga/effects';
import { getBorrowerDetailApi, addBorrowerInfoSingleApi, loanDisbursementApi, getBorrowerDetailByIdApi, borrowerinfoCommonUpdatetApi, getAcceptBorrowerDetailByIdApi, updateDaApprovalApi, updateBorrowerInfoApi, updateBankDetailsApi, updateUMRNDetailsApi, updateMiscDetailsApi, getCustomerIdApi ,updateMarkRepoApi} from '../apis/borrowerInfo';
import { updatePreLoaderWatcher } from '../actions/user';

export function* borrowerDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const filter = action?.payload?.searchData;
    delete action.payload["searchData"];
    const { data } = yield call(getBorrowerDetailApi, action.payload);
    if (filter?.isLoanQueue) {
      yield put({
        type: "GET_BORROWER_DATA_WATCHER",
        payload: { filter: filter, data: data }
      });
    }
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* borrowerDetailsWatcherSaga() {
  yield takeLatest("GET_BORROWER_DETAILS_WATCHER", borrowerDetailsEffectSaga);
}

export function* addBorrowerInfoSingleEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(addBorrowerInfoSingleApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* addBorrowerInfoSingleWatcherSaga() {
  yield takeLatest(
    "ADD_BORROWER_INFO_SINGLE_WATCHER",
    addBorrowerInfoSingleEffectSaga
  );
}

export function* loanDisbursementEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(loanDisbursementApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* loanDisbursementWatcherSaga() {
  yield takeLatest("LOAN_DISBURSEMENT_WATCHER", loanDisbursementEffectSaga);
}

export function* borrowerDetailsByIdEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getBorrowerDetailByIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* borrowerDetailsByIdWatcherSaga() {
  yield takeLatest(
    "GET_BORROWER_DETAILS_BYID_WATCHER",
    borrowerDetailsByIdEffectSaga
  );
}

export function* acceptBorrowerDetailsByIdEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getAcceptBorrowerDetailByIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* borrowerAcceptDetailsByIdWatcherSaga() {
  yield takeLatest(
    "GET_ACCEPT_BORROWER_DETAILS_BYID_WATCHER",
    acceptBorrowerDetailsByIdEffectSaga
  );
}

export function* updateBorrowerInfoCommonUncommonEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(borrowerinfoCommonUpdatetApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateBorrowerInfoCommonUncommonWatcherSaga() {
  yield takeLatest(
    "UPDATE_BORROWERINFO_COMMON_UNCOMMON_WATCHER",
    updateBorrowerInfoCommonUncommonEffectSaga
  );
}

export function* updateBorrowerInfoEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateBorrowerInfoApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateBorrowerInfoWatcherSaga() {
  yield takeLatest(
    "UPDATE_BORROWER_INFO_WATCHER",
    updateBorrowerInfoEffectSaga
  );
}

export function* updateDaApprovalEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateDaApprovalApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateDaApprovalWatcherSaga() {
  yield takeLatest("UPDATE_DA_APPROVAL_WATCHER", updateDaApprovalEffectSaga);
}

export function* updateBankDetailsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateBankDetailsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateBankDetailsWatcherSaga() {
  yield takeLatest("UPDATE_BANK_DETAILS", updateBankDetailsEffectSaga);
}

export function* updateMiscDetailsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateMiscDetailsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateMiscDetailsWatcherSaga() {
  yield takeLatest("UPDATE_MISC_DETAILS", updateMiscDetailsEffectSaga);
}

export function* updateUMRNDetailsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateUMRNDetailsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateUMRNDetailsWatcherSaga() {
  yield takeLatest("UPDATE_UMRN_DETAILS", updateUMRNDetailsEffectSaga);
}

export function* getCustomerIdEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getCustomerIdApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getCustomerIdWatcherSaga() {
  yield takeLatest('GET_CUSTOMER_ID', getCustomerIdEffectSaga);
}

export function* updateMarkRepoEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateMarkRepoApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateMarkRepoWatcherSaga() {
  yield takeLatest("UPDATE_MARK_REPO", updateMarkRepoEffectSaga);
}


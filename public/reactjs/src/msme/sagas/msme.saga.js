// import all sagas here
import { takeLatest, call, put } from "redux-saga/effects";

import {
  postMsmeApplicantDetailsApi,
  patchMsmeDetailsApi,
  getMsmeCompaniesApi,
  putMsmeSaveDraftApi,
  getMsmeProductByCompanyIdApi,
  getMsmeSubmissionStatusApi,
  patchMsmeDocDeleteApi,
  subSectionDeleteApi,
  postEsignRequestApi,
  updateLeadDeviationApi,
  ammendOfferApi,
  verifyAadhaarOtpApi,
  getBicDataApi,
} from "../apis/msme.api";
import { updatePreLoaderWatcher } from "../../actions/user";

export function* postMsmeApplicantDetailsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(postMsmeApplicantDetailsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* postMsmeApplicantDetailsWatcherSaga() {
  yield takeLatest(
    "POST_MSME_APPLICANT_DETAILS",
    postMsmeApplicantDetailsEffectSaga
  );
}

export function* patchMsmeDetailsEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(patchMsmeDetailsApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* patchMsmeDetailsWatcherSaga() {
  yield takeLatest("PATCH_MSME_DETAILS", patchMsmeDetailsEffectSaga);
}

export function* putMsmeSaveDraftEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(putMsmeSaveDraftApi, action.payload);
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}
export function* getMsmeCompaniesEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getMsmeCompaniesApi);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* putMsmeSaveDraftWatcherSaga() {
  yield takeLatest("PUT_MSME_SAVE_DRAFT", putMsmeSaveDraftEffectSaga);
}

export function* getMsmeCompaniesWatcherSaga() {
  yield takeLatest("GET_MSME_COMPANIES_WATCHER", getMsmeCompaniesEffectSaga);
}

export function* getMsmeProductByCompanyIdEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const { data } = yield call(getMsmeProductByCompanyIdApi, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getMsmeProductByCompanyIdWatcherSaga() {
  yield takeLatest(
    "GET_MSME_PRODUCT_BY_COMPANY_ID_WATCHER",
    getMsmeProductByCompanyIdEffectSaga
  );
}

export function* getMsmeSubmissionStatusEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getMsmeSubmissionStatusApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getMsmeSubmissionStatusWatcherSaga() {
  yield takeLatest("GET_MSME_SUBMISSION_STATUS_WATCHER", getMsmeSubmissionStatusEffectSaga);
}

export function* patchMsmeDocDeleteEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(patchMsmeDocDeleteApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
  }
}

export function* patchMsmeDocDeleteWatcherSaga() {
  yield takeLatest(
    "MSME_DOC_DELETE",
    patchMsmeDocDeleteEffectSaga
  );
}

export function* getBicDataEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getBicDataApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getBicDataWatcherSaga() {
  yield takeLatest(
    "GET_MSME_BIC_DATA",
    getBicDataEffectSaga
  );
}

export function* subSectionDeleteEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(subSectionDeleteApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
  }
}

export function* subSectionDeleteWatcherSaga() {
  yield takeLatest(
    "SUB_SECTION_DELETE",
    subSectionDeleteEffectSaga
  );
}

export function* postEsignRequestEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(postEsignRequestApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* postEsignRequestWatcherSaga() {
  yield takeLatest(
    "POST_ESIGN_REQUEST",
    postEsignRequestEffectSaga
  );
}

export function* updateLeadDeviationEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateLeadDeviationApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updateLeadDeviationWatcherSaga() {
  yield takeLatest("UPDATE_LEAD_DEVIATION", updateLeadDeviationEffectSaga);
}

export function* ammendOfferAPIEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(ammendOfferApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* ammendAPIOfferWatcherSaga() {
  yield takeLatest("AMMEND_OFFER_API", ammendOfferAPIEffectSaga);
}
export function* verifyAadhaarOtpEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(verifyAadhaarOtpApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function*  verifyAadhaarOtpWatcherSaga() {
  yield takeLatest("VERIFY_AADHAAR_OTP", verifyAadhaarOtpEffectSaga);
}

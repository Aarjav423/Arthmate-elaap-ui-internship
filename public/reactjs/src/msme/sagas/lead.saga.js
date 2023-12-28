import { takeLatest, call, put } from "redux-saga/effects";
import {
  getMsmeActivityLogsApi,
  getMsmeLeadReviewDetailsApi,
  updateLeadDetailsApi,
  commentdetailsApi,
  getLeadStatusApi,
  getLeadOfferApi,
  getCalculateFeesAndChargesWatcherApi,
  postAadhaarOtpApi,
  createMsmeActivityLogApi
} from "../apis/lead.api";

export function* getMsmeLeadReviewDetailsEffectSaga(action) {
  try {
    const response = yield call(getMsmeLeadReviewDetailsApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getMsmeDetailsWatcherSaga() {
  yield takeLatest(
    "GET_MSME_LEAD_REVIEW_DETAILS",
    getMsmeLeadReviewDetailsEffectSaga
  );
}

export function* getMsmeActivityLogsEffectSaga(action) {
  try {
    const response = yield call(getMsmeActivityLogsApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getMsmeActivityLogsWatcherSaga() {
  yield takeLatest("GET_MSME_ACTIVITY_LOGS", getMsmeActivityLogsEffectSaga);
}

export function* updateLeadDetailsEffectSaga(action) {
  try {
    const response = yield call(updateLeadDetailsApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* updateLeadDetailsWatcherSaga() {
  yield takeLatest("UPDATE_MSME_LEAD_STATUS", updateLeadDetailsEffectSaga);
}
export function* commentdetailEffectSaga(action) {
  try {
    const response = yield call(commentdetailsApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}
export function* commentDetailsWatcherSaga() {
  yield takeLatest("COMMENT_UPDATE_MSME_DETAILS", commentdetailEffectSaga);
}

export function* getLeadStatusEffectSaga(action) {
  try {
    const response = yield call(getLeadStatusApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}
export function* getLeadStatusWatcherSaga() {
  yield takeLatest("FETCH_LEAD_STATUS", getLeadStatusEffectSaga);
}

export function* getLeadOfferEffectSaga(action) {
  try {
    const response = yield call(getLeadOfferApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getLeadOfferWatcherSaga(){
  yield takeLatest("FETCH_LEAD_OFFER", getLeadOfferEffectSaga)
}

export function* getCalculateFeesAndChargesWatcherEffectSaga(action) {
  try {
    const response = yield call(getCalculateFeesAndChargesWatcherApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* postAadhaarOtpEffectSaga(action) {
  try {
    const response = yield call(postAadhaarOtpApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getCalculateFeesAndChargesWatcherWatcherSaga(){
  yield takeLatest("FETCH_FEES_AND_CHARGES_DETAILS", getCalculateFeesAndChargesWatcherEffectSaga)
}

export function* postAadhaarOtpWatcherSaga(){
  yield takeLatest("POST_AADHAAR_OTP", postAadhaarOtpEffectSaga)
}

export function* createMsmeActivityLogEffectSaga(action) {
  try {
    const response = yield call(createMsmeActivityLogApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* createMsmeActivityLogWatcherSaga(){
  yield takeLatest("CREATE_MSME_ACTIVITY_LOG", createMsmeActivityLogEffectSaga)
}
import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../../actions/user";
import { getLeadSectionStatusApi } from "./../apis/status.api";

export function* getLeadSectionStatusEffectSaga(action) {
  try {
    const response = yield call(getLeadSectionStatusApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}
export function* getLeadSectionStatusWatcherSaga() {
  yield takeLatest("GET_LEAD_SECTION_STATUS", getLeadSectionStatusEffectSaga);
}

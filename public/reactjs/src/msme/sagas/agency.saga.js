
import { takeLatest, call, put } from "redux-saga/effects";
import {
  getMsmeAgenciesApi
} from "../apis/agency.api";

export function* getMsmeAgencyEffectSaga(action) {
    // data is obtained after axios call is resolved
    try {
      const response = yield call(getMsmeAgenciesApi, action.data);
      yield put({
        type: "GET_MSME_AGENCIES_DATA_WATCHER",
        payload: response?.data?.data,
      });
      action.resolve(response.data);
    } catch (e) {
      action.reject(e);
    }
  }

export function* getMsmeAgenciesWatcherSaga() {
    yield takeLatest("GET_MSME_AGENCIES_LIST", getMsmeAgencyEffectSaga);
  }
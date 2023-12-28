import { takeLatest, call, put } from "redux-saga/effects";
import {
  getDashboardCaseOverviewApi,
  getDashboardFosSummaryApi,
  getDepositionDataApi,
} from "../../apis/collection/dashboard.api";

export function* getDashboardFosSummaryEffectSaga(action) {
  try {
    const response = yield call(getDashboardFosSummaryApi, action.data);
    action.resolve(response.data);
  } catch (e) {
    console.log("Error", e);
    action.reject(e);
  }
}

export function* getDashboardFosSummaryWatcherSaga() {
  yield takeLatest(
    "GET_DASHBOARD_FOS_USER_SUMMARY",
    getDashboardFosSummaryEffectSaga
  );
}

export function* getDepositionDataWatcherEffectSaga(action) {
  try {
    const response = yield call(getDepositionDataApi, action.payload);
    action.resolve(response.data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getDepositionDataWatcherSaga() {
  yield takeLatest("GET_DEPOSITION_DATA", getDepositionDataWatcherEffectSaga);
}


export function* getDashboardCaseOverviewEffectSaga(action) {
    try {
        const response = yield call(getDashboardCaseOverviewApi, action.payload);
        action.resolve(response.data);
    } catch (e) {
        console.log("Error", e);
        action.reject(e);
    }
}

export function* getDashboardCaseOverviewWatcherSaga() {
  yield takeLatest("GET_DASHBOARD_CASE_OVERVIEW", getDashboardCaseOverviewEffectSaga);
}
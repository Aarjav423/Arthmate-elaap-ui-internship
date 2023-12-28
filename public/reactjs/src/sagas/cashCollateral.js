import { takeLatest, call, put } from "redux-saga/effects";
import {cashCollateralApi , disburseWithheldAmountApi} from "../apis/cashCollateral" 
import { updatePreLoaderWatcher } from "../actions/user";

export function* cashCollateralEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(cashCollateralApi, action.payload);
      yield put(updatePreLoaderWatcher(false));
      action.resolve(data);
    } catch (e) {
      yield put(updatePreLoaderWatcher(false));
      action.reject(e);
    }
  }
  
  export function* cashCollateralWatcherSaga() {
    yield takeLatest("CASH_COLLATERAL_DETAILS", cashCollateralEffectSaga);
  }

  export function* disburseWithheldAmountEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(disburseWithheldAmountApi, action.payload);
      yield put(updatePreLoaderWatcher(false));
      action.resolve(data);
    } catch (e) {
      yield put(updatePreLoaderWatcher(false));
      action.reject(e);
    }
  }
  
  export function* disburseWithheldAmountWatcherSaga() {
    yield takeLatest("DISBURSE_WITHHELD_AMOUNT", disburseWithheldAmountEffectSaga);
  }
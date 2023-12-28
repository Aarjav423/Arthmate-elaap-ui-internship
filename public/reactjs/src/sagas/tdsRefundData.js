import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import { getTdsRefundDataApi, updateTdsRefundApi , getRefundDataDetailsApi} from "../apis/tdsRefunds";

export function* getTdsRefundDataEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(getTdsRefundDataApi, action.payload);
      yield put(updatePreLoaderWatcher(false));
      action.resolve(data);
    } catch (e) {
      yield put(updatePreLoaderWatcher(false));
      action.reject(e);
    }
  }
  
  export function* getTdsRefundDataWatcherSaga() {
    yield takeLatest(
      "GET_TDS_REFUND_DATA",
      getTdsRefundDataEffectSaga
    );
  }

  export function* updateTDSRefundStatusEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(updateTdsRefundApi, action.payload);
      yield put(updatePreLoaderWatcher(false));
      action.resolve(data);
    } catch (e) {
      yield put(updatePreLoaderWatcher(false));
      action.reject(e);
    }
  }
  
  export function* updateTDSRefundWatcherSaga() {
    yield takeLatest("UPDATE_TDS_REFUND_STATUS", updateTDSRefundStatusEffectSaga);
  }


  export function* getRefundDataDetailsEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(getRefundDataDetailsApi, action.payload);
      yield put(updatePreLoaderWatcher(false));
      action.resolve(data);
    } catch (e) {
      yield put(updatePreLoaderWatcher(false));
      action.reject(e);
    }
  }
  
  export function* getTdsRefundDataDetailsWatcherSaga() {
    yield takeLatest(
      "GET_REFUND_LOANID_DETAILS",
      getRefundDataDetailsEffectSaga
    );
  }





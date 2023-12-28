import {takeLatest, call, put} from "redux-saga/effects";
import {getAllDisburseChannelMasterApi} from "../apis/disbursementChannelMaster";
import {updatePreLoaderWatcher} from "../actions/user";

export function* getListDisbursementChannelMasterEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const {data} = yield call(getAllDisburseChannelMasterApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getListDisbursementChannelMasterWatcherSaga() {
  yield takeLatest(
    "ALL_DISBURSEMENT_CHANNEL_MASTER",
    getListDisbursementChannelMasterEffectSaga
  );
}

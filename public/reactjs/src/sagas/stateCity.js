import { takeLatest, call, put } from "redux-saga/effects";
import { stateCityApi } from "../apis/stateCity";
import { stateCityWatcher } from '../actions/stateCity';

export function* stateCityEffectSaga(action) {
    try {
        const { data } = yield call(stateCityApi, action.payload);
        action.resolve(data);
        yield put({ type: 'STAE_CITY_DATA_WATCHER', payload: data });
    } catch (e) {
        action.reject(e);
    };
};

export function* stateCityWatcherSaga() {
    yield takeLatest("STAE_CITY_WATCHER", stateCityEffectSaga);
};

import { takeLatest, call, put } from "redux-saga/effects";

export function* setAlertEffectSaga(action) {
    try {
        yield put({ type: 'UPDATE_ALEART', payload: action.payload });
        action.resolve(action.payload);
    } catch (e) {
        action.reject(e);
    };
};

export function* setAlertWatcherSaga() {
    yield takeLatest("SET_ALERT_POPUP", setAlertEffectSaga);
};
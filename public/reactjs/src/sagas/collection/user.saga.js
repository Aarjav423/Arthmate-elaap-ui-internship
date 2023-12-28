import { takeLatest, call, put } from "redux-saga/effects";
import {
  addFosUserApi,
  getFosUsersApi,
  getFosUserApi,
  updateFosUserApi,
} from "../../apis/collection/user.api";

export function* getFosUsersEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const response = yield call(getFosUsersApi, action.data);
    if (action.data.pagination === "false") {
      yield put({
        type: "GET_ACTIVE_FOS_USERS_DATA_WATCHER",
        payload: response?.data
      })
    } else {
      yield put({
        type: "GET_FOS_USERS_DATA_WATCHER",
        payload: response?.data?.results,
      });
    }
    action.resolve(response.data);
  } catch (e) {
    console.log("Error", e);
    action.reject(e);
  }
}
export function* getFosUsersWatcherSaga() {
  yield takeLatest("GET_FOS_USERS", getFosUsersEffectSaga);
}

export function* getFosUserEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const response = yield call(getFosUserApi, action.data);

    action.resolve(response.data);
  } catch (e) {
    console.log("Error", e);
    action.reject(e);
  }
}

export function* getFosUserWatcherSaga() {
  yield takeLatest("GET_FOS_USER", getFosUserEffectSaga);
}



export function* addFosUserEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const response = yield call(addFosUserApi, action.data);

    yield put({
      type: "ADD_FOS_USER_DATA_WATCHER",
      payload: response.data?.data,
    });

    yield put({
      type: "ADD_ACTIVE_FOS_USER_DATA_WATCHER",
      payload: response.data?.data,
    })

    action.resolve(response.data);
  } catch (e) {
    console.log("Error", e);
    action.reject(e);
  }
}

export function* addFosUserWatcherSaga() {
  yield takeLatest("ADD_FOS_USER", addFosUserEffectSaga);
}

export function* updateFosUserEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const response = yield call(updateFosUserApi, action.data);

    yield put({
      type: "UPDATE_FOS_USER_DATA_WATCHER",
      payload: response.data?.data,
    });

    yield put({
      type: "UPDATE_ACTIVE_FOS_USER_DATA_WATCHER",
      payload: response.data?.data,
    })

    action.resolve(response.data);
  } catch (e) {
    console.log("Error", e);
    action.reject(e);
  }
}

export function* updateFosUserWatcherSaga() {
  yield takeLatest("UPDATE_FOS_USER", updateFosUserEffectSaga);
}

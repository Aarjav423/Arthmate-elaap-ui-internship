import {takeLatest, call} from "redux-saga/effects";
import {
  fetchRoleMetrix,
  addDesignation,
  addDepartment,
  addRole,
  fetchRole,
  fetchDepartment,
  fetchDesignation
} from "../apis/roleMetrix";
import {saveToStorage} from "../util/localstorage";
import { updateRoleAPI } from "../apis/roleMetrix";

/** saga worker that is responsible for the side effects */
export function* getRoleMetrixEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(fetchRoleMetrix, action.payload);
    saveToStorage("roleMetrix", data);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* addDesignationEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(addDesignation, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* addDepartmentEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(addDepartment, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* addRoleEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(addRole, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getRoleEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(fetchRole);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getDepartmentEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(fetchDepartment);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getDesignationEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(fetchDesignation);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}
export function* updateRoleEffectSaga(action) {
  try {
    const {data} = yield call(updateRoleAPI, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getRoleMetrixWatcherSaga() {
  yield takeLatest("GET_ROLE_METRIX", getRoleMetrixEffectSaga);
}

export function* addDesignationWatcherSaga() {
  yield takeLatest("ADD_DESIGNATION", addDesignationEffectSaga);
}

export function* addDepartmentWatcherSaga() {
  yield takeLatest("ADD_DEPARTMENT", addDepartmentEffectSaga);
}

export function* addRoleWatcherSaga() {
  yield takeLatest("ADD_ROLE", addRoleEffectSaga);
}

export function* getRoleWatcherSaga() {
  yield takeLatest("GET_ROLE", getRoleEffectSaga);
}

export function* getDepartmentWatcherSaga() {
  yield takeLatest("GET_DEPARTMENT", getDepartmentEffectSaga);
}

export function* getDesignationWatcherSaga() {
  yield takeLatest("GET_DESIGNATION", getDesignationEffectSaga);
}

export function* updateRoleWatcherSaga() {
  yield takeLatest("UPDATE_ROLE", updateRoleEffectSaga);
}

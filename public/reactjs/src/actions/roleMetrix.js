export function addDesignationWatcher(data, resolve, reject) {
  return {
    type: "ADD_DESIGNATION",
    payload: data,
    resolve,
    reject
  };
}

export function addDepartmentWatcher(data, resolve, reject) {
  return {
    type: "ADD_DEPARTMENT",
    payload: data,
    resolve,
    reject
  };
}

export function addRoleWatcher(data, resolve, reject) {
  return {
    type: "ADD_ROLE",
    payload: data,
    resolve,
    reject
  };
}

export function getRoleWatcher(resolve, reject) {
  return {
    type: "GET_ROLE",
    resolve,
    reject
  };
}
export function updateRoleWatcher(data,resolve, reject) {
  return {
    type: "UPDATE_ROLE",
    payload: data,
    resolve,
    reject
  };
}

export function getDepartmentWatcher(resolve, reject) {
  return {
    type: "GET_DEPARTMENT",
    resolve,
    reject
  };
}

export function getDesignationWatcher(resolve, reject) {
  return {
    type: "GET_DESIGNATION",
    resolve,
    reject
  };
}

export function getFosUsersWatcher(data, resolve, reject) {
  return {
    type: "GET_FOS_USERS",
    data,
    resolve,
    reject,
  };
}

export function getFosUserWatcher(data, resolve, reject) {
  return {
    type: "GET_FOS_USER",
    data,
    resolve,
    reject,
  };
}

export function addFosUserWatcher(data, resolve, reject) {
  return {
    type: "ADD_FOS_USER",
    data,
    resolve,
    reject,
  };
}

export function updateFosUserWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_FOS_USER",
    data,
    resolve,
    reject,
  };
}


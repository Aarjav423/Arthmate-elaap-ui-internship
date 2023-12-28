export function loginWatcher(authParams, resolve, reject) {
  return {
    type: "LOGIN_WATCHER",
    payload: authParams,
    resolve,
    reject,
  };
}

export function createUserWatcher(authParams, resolve, reject) {
  return {
    type: "CREATE_USER_WATCHER",
    payload: authParams,
    resolve,
    reject,
  };
}

export function userListWatcher(data, resolve, reject) {
  return {
    type: "USER_LIST_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function toggleUserStatusWatcher(data, resolve, reject) {
  return {
    type: "TOGGLE_USER_STATUS",
    payload: data,
    resolve,
    reject,
  };
}

export function updateUserWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_USER",
    payload: data,
    resolve,
    reject,
  };
}

export const updatePreLoaderWatcher = (payload) => ({
  type: "UPDATE_PRE_LOADER_WATCHER",
  payload,
});

export function updateProfile(payload) {
  return { type: "UPDATE_PROFILE", payload };
}

export function resetPassword(payload, resolve, reject) {
  return {
    payload: payload,
    type: "RESET_PASSWORD",
    resolve,
    reject
  };
}

export function searchUser(payload, resolve, reject) {
  return {
    payload: payload,
    type: "SEARCH_USER",
    resolve,
    reject
  };
}
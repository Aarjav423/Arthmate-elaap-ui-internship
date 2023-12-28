/* broadcast event actions */
export function createBroadcastEventWatcher(data, resolve, reject) {
  return {
    type: "CREATE_BROADCAST_EVENT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function broadcastEventListWatcher(data, resolve, reject) {
  return {
    type: "BROADCAST_LIST_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function updateBroadcastEventWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_BROADCAST_EVENT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function updateBroadcastEventStatusWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_BROADCAST_EVENT_STATUS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

/* subscription actions */
export function createSubscriptionEventWatcher(data, resolve, reject) {
  return {
    type: "CREATE_SUBSCRIPTION_EVENT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function subscriptionEventListWatcher(data, resolve, reject) {
  return {
    type: "SUBSCRIPTION_LIST_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function updateSubscriptionEventWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_SUBSCRIPTION_EVENT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}


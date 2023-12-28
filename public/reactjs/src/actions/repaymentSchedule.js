export function repaymentScheduleFormPostWatcher(data, resolve, reject) {
  return {
    type: "REPAYMENT_SCHEDULE_FORM_POST_WATCHER",
    payload: data,
    resolve,
    reject
  };
}
export function repaymentScheduleListWatcher(data, resolve, reject) {
  return {
    type: "REPAYMENT_SCHEDULE_LIST_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function repaymentScheduleForLocWatcher(data, resolve, reject) {
  return {
    type: "REPAYMENT_SCHEDULE_FOR_LOC",
    payload: data,
    resolve,
    reject
  };
}

export function repaymentScheduleForRaiseDueWatcher(data, resolve, reject) {
  return {
    type: "REPAYMENT_SCHEDULE_FOR_RAISE_DUE_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

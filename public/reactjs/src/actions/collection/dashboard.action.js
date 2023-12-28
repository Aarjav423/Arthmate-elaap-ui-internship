
export function getDashboardFosSummaryWatcher(data, resolve, reject) {
  return {
    type: "GET_DASHBOARD_FOS_USER_SUMMARY",
    data,
    resolve,
    reject,
  };
}


export function getDepositionDataWatcher(payload, resolve, reject) {
  return {
    type: "GET_DEPOSITION_DATA",
    payload,
    resolve,
    reject,
  };
}

export function getDashboardCaseOverviewWatcher(payload, resolve, reject) {
  return {
    type: "GET_DASHBOARD_CASE_OVERVIEW",
    payload,
    resolve,
    reject,
  };
}

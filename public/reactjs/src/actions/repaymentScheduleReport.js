export function getRepaymentScheduleReportsWatcher(data, resolve, reject) {
  return {
    type: "GET_REPAYMENT_SCHEDULE_REPORTS",
    payload: data,
    resolve,
    reject
  };
}

export function generateRepaymentScheduleReportsWatcher(data, resolve, reject) {
  return {
    type: "GENERATE_REPAYMENT_SCHEDULE_REPORT",
    payload: data,
    resolve,
    reject
  };
}

export function downloadRepaymentScheduleReportWatcher(data, resolve, reject) {
  return {
    type: "DOWNLOAD_REPAYMENT_SCHEDULE_REPORT",
    payload: data,
    resolve,
    reject
  };
}

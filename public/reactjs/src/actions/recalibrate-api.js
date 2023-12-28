export function recalibrateSanctionWatcher(data, resolve, reject) {
  return {
    type: "RECALIBRATE_SANCTION",
    payload: data,
    resolve,
    reject
  };
}

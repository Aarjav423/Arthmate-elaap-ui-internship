export function calculatePremiumWatcher(data, resolve, reject) {
  return {
    type: "CALCULATE_INSURANCE_PREMIUM_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

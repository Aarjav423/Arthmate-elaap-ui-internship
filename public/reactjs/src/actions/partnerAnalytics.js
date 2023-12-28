export function getCompaniesWatcher(payload,resolve, reject) {
    return {
      type: "FETCH_COMPANIES",
      payload,
      resolve,
      reject,
    };
}
  
export function getLeadSectionStatusWatcher(data, resolve, reject) {
  return {
    type: "GET_LEAD_SECTION_STATUS",
    payload: data,
    resolve,
    reject,
  };
}

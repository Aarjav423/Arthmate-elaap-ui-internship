export const statusLogsWatcher = (data, resolve, reject) => {
  return {
    type: "STATUS_LOGS",
    payload: data,
    resolve,
    reject,
  };
};

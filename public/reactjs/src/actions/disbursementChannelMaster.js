export function getAllActiveDisbursementChannelMaster(data, resolve, reject) {
  return {
    type: "ALL_DISBURSEMENT_CHANNEL_MASTER",
    payload: data,
    resolve,
    reject
  };
}

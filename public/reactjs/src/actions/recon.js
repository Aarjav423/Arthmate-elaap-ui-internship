export function getReconDetails(data, resolve, reject) {
  return {
    type: "GET_RECON_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

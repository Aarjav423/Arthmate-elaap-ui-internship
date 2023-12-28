export function getLocationPincodes(data, resolve, reject) {
  return {
    type: "FETCH_LOCATION_PINCODES",
    data,
    resolve,
    reject,
  };
}

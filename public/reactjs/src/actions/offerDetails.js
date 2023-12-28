export function getOfferDetailsWatcher(data, resolve, reject) {
  return {
    type: "GET_OFFER_DETAILS",
    payload: data,
    resolve,
    reject
  };
}

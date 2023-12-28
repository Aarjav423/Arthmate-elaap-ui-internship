export function getAScoreDataWatcher(data, resolve, reject) {
  return {
    type: "GET_A_SCORE_DATA",
    payload: data,
    resolve,
    reject
  };
}

export function updateAScoreDataWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_A_SCORE_DATA",
    payload: data,
    resolve,
    reject
  };
}

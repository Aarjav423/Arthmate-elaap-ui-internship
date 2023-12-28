export function sendEnhancedReviewWatcher(data, resolve, reject) {
  return {
    type: "SEND_ENHANCED_REVIEW_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

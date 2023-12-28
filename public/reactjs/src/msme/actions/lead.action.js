export function getMsmeLeadReviewDetailsWatcher(payload, resolve, reject) {
  return {
    type: "GET_MSME_LEAD_REVIEW_DETAILS",
    payload,
    resolve,
    reject,
  };
}

export function updateLeadDetailsWatcher(payload, resolve, reject) {
  return {
    type: "UPDATE_MSME_LEAD_STATUS",
    payload,
    resolve,
    reject,
  };
}
export function getMsmeActivityLogsWatcher(payload, resolve, reject) {
  return {
    type: "GET_MSME_ACTIVITY_LOGS",
    payload,
    resolve,
    reject,
  };
}

export function commentDetailsWatcher(payload, resolve, reject) {
  return {
    type: "COMMENT_UPDATE_MSME_DETAILS",
    payload,
    resolve,
    reject,
  };
}

export function getLeadStatusWatcher(payload, resolve, reject) {
  return {
    type: "FETCH_LEAD_STATUS",
    payload,
    resolve,
    reject,
  };
}

export function getLeadOfferWcher(payload, resolve, reject) {
  return {
    type: "FETCH_LEAD_OFFER",
    payload,
    resolve,
    reject,
  };
}

export function getCalculateFeesAndChargesWatcher(payload, resolve, reject) {
  return {
    type: "FETCH_FEES_AND_CHARGES_DETAILS",
    payload,
    resolve,
    reject,
  };
}

export function postAadhaarOtpWcher(payload, resolve, reject) {
  return {
    type: "POST_AADHAAR_OTP",
    payload,
    resolve,
    reject,
  };
}

export function createMsmeActivityLogWatcher(payload,resolve,reject){
  return {
    type:'CREATE_MSME_ACTIVITY_LOG',
    payload,
    resolve,
    reject
  }
}

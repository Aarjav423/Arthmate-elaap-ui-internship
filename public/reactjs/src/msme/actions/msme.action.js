// import all actions here

export function postMsmeApplicantDetailsWatcher(payload, resolve, reject) {
  return {
    type: "POST_MSME_APPLICANT_DETAILS",
    payload,
    resolve,
    reject,
  };
}

export function patchMsmeDetailsWatcher(payload, resolve, reject) {
  return {
    type: "PATCH_MSME_DETAILS",
    payload,
    resolve,
    reject,
  };
}
export function putMsmeDraftSaverWatcher(payload, resolve, reject) {
  return {
    type: "PUT_MSME_SAVE_DRAFT",
    payload,
    resolve,
    reject,
  };
}

export function getMsmeCompaniesWatcher(resolve, reject) {
  return {
    type: "GET_MSME_COMPANIES_WATCHER",
    resolve,
    reject,
  };
}

export function getMsmeProductByCompanyIDWatcher(data, resolve, reject) {
  return {
    type: "GET_MSME_PRODUCT_BY_COMPANY_ID_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function getMsmeSubmissionStatusWatcher(data, resolve, reject) {
  return {
    type: "GET_MSME_SUBMISSION_STATUS_WATCHER",
    payload: data,
    resolve,
    reject,
  };
}

export function patchMsmeDocDeleteWatcher(payload, resolve, reject) {
  return {
    type: "MSME_DOC_DELETE",
    payload,
    resolve,
    reject,
  };
}

export function subSectionDeleteWatcher(payload, resolve, reject) {
  return {
    type: "SUB_SECTION_DELETE",
    payload,
    resolve,
    reject,
  };
}

export function updateLeadDeviationWatcher(payload, resolve, reject ) {
  return {
    type:"UPDATE_LEAD_DEVIATION",
    payload,
    resolve,
    reject
  }
}

export function ammendOfferAPIWatcher(payload, resolve, reject) {
  return {
    type:"AMMEND_OFFER_API",
    payload,
    resolve,
    reject
  }
}
export function verifyAadhaarOtpWatcher(payload, resolve, reject ) {
  return {
    type:"VERIFY_AADHAAR_OTP",
    payload,
    resolve,
    reject
  }
}

export function postEsignRequestWatcher(payload, resolve, reject ) {
  return {
    type:"POST_ESIGN_REQUEST",
    payload,
    resolve,
    reject
  }
}

export function getBicDataWatcher(payload, resolve, reject) {
  return {
    type: "GET_MSME_BIC_DATA",
    payload,
    resolve,
    reject
  }
}

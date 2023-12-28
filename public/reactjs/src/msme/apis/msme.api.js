import axios from "axios";
import { BASE_URL } from "../../constants/apiUrls";

export function postMsmeApplicantDetailsApi(payload) {
    return axios.post(`${BASE_URL}msme/applicant-details`, payload);
}

export function patchMsmeDetailsApi(payload) {
    return axios.post(`${BASE_URL}msme/section-details`, payload);
}
export function putMsmeSaveDraftApi(payload) {
    return axios.post(`${BASE_URL}msme/save-draft`, payload);
    }

export function getMsmeCompaniesApi(){
    return axios.get(`${BASE_URL}msme/company`)
}

export function getMsmeProductByCompanyIdApi(payload) {
    return axios.get(`${BASE_URL}${"get_products_by_msme_company_id"}/${payload}`);
}

export function getMsmeSubmissionStatusApi(payload) {
    return axios.get(`${BASE_URL}msme/lead/submission-status/${payload.loan_app_id}/code/${payload.codeId}/sequence/${payload.sequenceId}?company_id=${payload.company_id}&&product_id=${payload.product_id}&&userId=${payload.userId}`, payload);
}

export function patchMsmeDocDeleteApi(payload) {
    return axios.post(`${BASE_URL}msme/delete-docs`, payload);
}

export function getBicDataApi(payload) {
    return axios.post(`${BASE_URL}msme/get-BIC-data/${payload.loanAppId}`,payload);
}

export function subSectionDeleteApi(payload) {
    return axios.delete(`${BASE_URL}msme/lead/${payload.loan_app_id}/section/${payload.section_code}/subsection/${payload.sub_section_code}`, {data:payload});
}

export function postEsignRequestApi(payload) {
    return axios.post(`${BASE_URL}msme/create-esign-request`, payload);
}

export function updateLeadDeviationApi(payload) {
    return axios.put(`${BASE_URL}msme/update-lead-deviation`,payload);
}

export function ammendOfferApi(payload) {
    return axios.post(`${BASE_URL}msme/ammend-offer-api`,payload);
}
export function verifyAadhaarOtpApi(payload) {
    return axios.post(`${BASE_URL}msme/leads/aadhaarCheck`,payload);
}


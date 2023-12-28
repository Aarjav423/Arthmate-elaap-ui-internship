import { keyValuePairs } from 'util/helper';
import { bookLoansFormJsonFields } from './bookLoansFormJson';
const BOOK_LOAN_FORM_JSON = bookLoansFormJsonFields();
const BOOK_LOAN_OBJECT = keyValuePairs(BOOK_LOAN_FORM_JSON, 'field');

const mapFields = () => {
  const fieldMaps = {};
  for (let object of BOOK_LOAN_FORM_JSON) {
    fieldMaps[object.field] = `${object.type}_vl_${object.field}`;
  }

  return fieldMaps; // Return the array of matching objects
};

const fieldsMapJson = mapFields();

export const primaryApplicantMapping = (loanDetailsData) => {
  let data = {};
  let purposeOfLoan = loanDetailsData['purpose_of_loan'];
  let obj_purpose_of_loan = BOOK_LOAN_OBJECT['purpose_of_loan']?.options?.find((item) => item.value === purposeOfLoan);
  if (obj_purpose_of_loan) {
    purposeOfLoan = obj_purpose_of_loan.label;
  }

  data = {
    ...data,
    lead_status: loanDetailsData['lead_status'],
    company_id: loanDetailsData['company_id'],
    product_id: loanDetailsData['product_id'],
    loan_app_id: loanDetailsData["loan_app_id"],
    address_same: loanDetailsData['primary_applicant']['address_same'],
    [fieldsMapJson['partner_loan_app_id']]: loanDetailsData['partner_loan_app_id'],
    [fieldsMapJson['partner_borrower_id']]: loanDetailsData['partner_borrower_id'],
    [fieldsMapJson['requested_loan_amount']]: loanDetailsData['loan_amount'],
    [fieldsMapJson['age']]: loanDetailsData['primary_applicant']['age'],
    [fieldsMapJson['tenure_in_months']]: loanDetailsData['loan_tenure'],
    [fieldsMapJson['interest_rate']]: loanDetailsData['loan_interest_rate'],
    [fieldsMapJson['purpose_of_loan']]: purposeOfLoan,
    [fieldsMapJson['first_name']]: loanDetailsData['primary_applicant']['first_name'],
    [fieldsMapJson['middle_name']]: loanDetailsData['primary_applicant']['middle_name'],
    [fieldsMapJson['last_name']]: loanDetailsData['primary_applicant']['last_name'],
    [fieldsMapJson['gender']]: loanDetailsData['primary_applicant']['gender'],
    [fieldsMapJson['mobile_number']]: loanDetailsData['primary_applicant']['appl_phone'],
    [fieldsMapJson['date_of_birth']]: loanDetailsData['primary_applicant']['dob'],
    [fieldsMapJson['email']]: loanDetailsData['primary_applicant']['email_id'],
    [fieldsMapJson['father_full_name']]: loanDetailsData['primary_applicant']['father_name'],
    [fieldsMapJson['curr_addr_ln1']]: loanDetailsData['primary_applicant']['resi_addr_ln1'],
    [fieldsMapJson['curr_addr_ln2']]: loanDetailsData['primary_applicant']['resi_addr_ln2'],
    [fieldsMapJson['curr_addr_city']]: loanDetailsData['primary_applicant']['city'],
    [fieldsMapJson['curr_addr_state']]: loanDetailsData['primary_applicant']['state'],
    [fieldsMapJson['curr_addr_pincode']]: loanDetailsData['primary_applicant']['pincode'],
    [fieldsMapJson['per_addr_ln1']]: loanDetailsData['primary_applicant']['per_addr_ln1'],
    [fieldsMapJson['per_addr_ln2']]: loanDetailsData['primary_applicant']['per_addr_ln2'],
    [fieldsMapJson['per_addr_city']]: loanDetailsData['primary_applicant']['per_city'],
    [fieldsMapJson['per_addr_state']]: loanDetailsData['primary_applicant']['per_state'],
    [fieldsMapJson['per_addr_pincode']]: loanDetailsData['primary_applicant']['per_pincode'],
    [fieldsMapJson['aadhaar_value']]: loanDetailsData['primary_applicant']['aadhar_card_num'],
    [fieldsMapJson['pan_value']]: loanDetailsData['primary_applicant']['appl_pan'],
  };

  return data;
};

export const entityDetailsMapping = (loanDetailsData) => {
  let data = {};

  data = {
    ...data,
    udyam_vintage: loanDetailsData['entity_details']['udyam_vintage'],
    udyam_vintage_flag: loanDetailsData['entity_details']['udyam_vintage_flag'],
    udyam_hit_count: loanDetailsData['entity_details']['udyam_hit_count'],
    gst_vintage: loanDetailsData['entity_details']['gst_vintage'],
    gst_vintage_flag: loanDetailsData['entity_details']['gst_vintage_flag'],
    string_vl_select_entity_type: loanDetailsData['entity_details']['entity_type'],
    string_vl_entity_name_value: loanDetailsData['entity_details']['entity_name'],
    address_same: loanDetailsData['entity_details']['address_same'],
    date_vl_doi_value: loanDetailsData['entity_details']['date_of_incorporation'],
    string_vl_comm_addr_ln1: loanDetailsData['entity_details']['com_addr_ln1'],
    string_vl_comm_addr_ln2: loanDetailsData['entity_details']['com_addr_ln2'],
    string_vl_comm_addr_city: loanDetailsData['entity_details']['com_city'],
    string_vl_comm_addr_state: loanDetailsData['entity_details']['com_state'],
    pincode_vl_comm_addr_pincode: loanDetailsData['entity_details']['com_pincode'],
    string_vl_reg_addr_ln1: loanDetailsData['entity_details']['res_addr_ln1'],
    string_vl_reg_addr_ln2: loanDetailsData['entity_details']['res_addr_ln2'],
    string_vl_reg_addr_city: loanDetailsData['entity_details']['res_city'],
    string_vl_reg_addr_state: loanDetailsData['entity_details']['res_state'],
    pincode_vl_reg_addr_pincode: loanDetailsData['entity_details']['res_pincode'],
    [`pan_vl_${loanDetailsData['entity_details']['entity_type'] === 'Private Limited' ? 'entity_kyc_pvtLtd_pan' : loanDetailsData['entity_details']['entity_type'] === 'Partnership' || loanDetailsData['entity_details']['entity_type'] === 'Society' || loanDetailsData['entity_details']['entity_type'] === 'Trust' ? 'entity_kyc_partnerShip_pan' : ''}`]: loanDetailsData['entity_details']['pan_no'],
    [`string_vl_${loanDetailsData['entity_details']['entity_type'] === 'Private Limited' ? 'entity_kyc_pvtLtd_urc' : loanDetailsData['entity_details']['entity_type'] === 'Partnership' ? 'entity_kyc_partnerShip_urc' : 'entity_kyc_proprietor_urc'}`]: loanDetailsData['entity_details']['urc_no'],
    [`string_vl_entity_kyc_pvtLtd_cin_llpin`]: loanDetailsData['entity_details']['cin_no'],
    [`string_vl_gstin_value`]: loanDetailsData['entity_details']['gst_no'],
  };

  return data;
};

export const coApplicantsMapping = (loanDetailsData) => {
  let data = [];

  for (let i = 0; i < loanDetailsData['co_applicant_details'].length; i++) {
    const coApplicant = loanDetailsData['co_applicant_details'][i];
    let temp = {};
    for (let key in coApplicant) {
      temp = {
        ...temp,
        [fieldsMapJson[key]]: coApplicant[key],
      };
    }

    temp = {
      ...temp,
      _id: coApplicant['_id'],
      borrower_id: coApplicant && coApplicant['borrower_id'] ? coApplicant['borrower_id'] : null,
      address_same: coApplicant['address_same'],
      [fieldsMapJson['cb_resi_addr_ln1']]: coApplicant['cb_resi_addr_ln1'],
      [fieldsMapJson['cb_resi_addr_ln2']]: coApplicant['cb_resi_addr_ln1'],
      [fieldsMapJson['cb_city']]: coApplicant['cb_city'],
      [fieldsMapJson['cb_state']]: coApplicant['cb_state'],
      [fieldsMapJson['cb_pincode']]: coApplicant['cb_pincode'],
      [fieldsMapJson['cb_per_addr_ln1']]: coApplicant['cb_per_addr_ln1'],
      [fieldsMapJson['cb_per_city']]: coApplicant['cb_per_city'],
      [fieldsMapJson['cb_per_state']]: coApplicant['cb_per_state'],
      [fieldsMapJson['cb_aadhaar']]: coApplicant['cb_aadhaar'],
      [fieldsMapJson['cb_father_name']]: coApplicant['cb_father_name'],
      [fieldsMapJson['cb_mobile']]: coApplicant['cb_mobile'],
    };

    data.push(temp);
  }

  return data;
};

export const guarantorDetailsMapping = (loanDetailsData) => {
  let data = [];

  for (let i = 0; i < loanDetailsData['guarantor_details'].length; i++) {
    const guarantor = loanDetailsData['guarantor_details'][i];
    let temp = {};
    for (let key in guarantor) {
      if (key != 'gua_age') {
        temp = {
          ...temp,
          [fieldsMapJson[key]]: guarantor[key],
        };
      }
    }

    temp = {
      ...temp,
      _id: guarantor['_id'],
      borrower_id: guarantor && guarantor['borrower_id'] ? guarantor['borrower_id'] : null,
      address_same: guarantor['address_same'],
      [fieldsMapJson['gua_pan']]: guarantor['gua_pan'],
      [fieldsMapJson['gua_aadhaar']]: guarantor['gua_aadhaar'],
      [fieldsMapJson['gua_dob']]: guarantor['gua_dob'],
      [fieldsMapJson['gua_gender']]: guarantor['gua_gender'],
      [fieldsMapJson['gua_fname']]: guarantor['gua_fname'],
      [fieldsMapJson['gua_mname']]: guarantor['gua_mname'],
      [fieldsMapJson['gua_lname']]: guarantor['gua_lname'],
      [fieldsMapJson['gua_pan']]: guarantor['gua_pan'],
      [fieldsMapJson['gua_resi_addr_ln1']]: guarantor['gua_resi_addr_ln1'],
      [fieldsMapJson['gua_resi_addr_ln2']]: guarantor['gua_resi_addr_ln1'],
      [fieldsMapJson['gua_city']]: guarantor['gua_city'],
      [fieldsMapJson['gua_state']]: guarantor['gua_state'],
      [fieldsMapJson['gua_pincode']]: guarantor['gua_pincode'],
      [fieldsMapJson['guarantor_aadhar']]: guarantor['gua_aadhar'],
      [fieldsMapJson['gua_per_addr_ln1']]: guarantor['gua_per_addr_ln1'],
      [fieldsMapJson['gua_per_addr_ln2']]: guarantor['gua_per_addr_ln2'],
      [fieldsMapJson['gua_per_city']]: guarantor['gua_per_city'],
      [fieldsMapJson['gua_per_state']]: guarantor['gua_per_state'],
      [fieldsMapJson['gua_per_pincode']]: guarantor['gua_per_pincode'],
      [fieldsMapJson['gua_aadhaar']]: guarantor['gua_aadhaar'],
      [fieldsMapJson['gua_father_name']]: guarantor['gua_father_name'],
      [fieldsMapJson['gua_mobile']]: guarantor['gua_mobile'],
      [fieldsMapJson['guarantor_email']]: guarantor['gua_email'],
    };

    data.push(temp);
  }

  return data;
};

export const financialDocumentsMapping = (loanDetailsData) => {
  let data = {
    string_vl_borro_bank_name: loanDetailsData['financial_documents']?.borro_bank_name,
    number_vl_borro_bank_acc_num: loanDetailsData['financial_documents']?.borro_bank_acc_num,
    string_vl_borro_bank_type: loanDetailsData['financial_documents']?.borro_bank_type,
  };

  return data;
};

export const additionalDocumentsMapping = (loanDetailsData) => {
  let data = {};

  data = {
    ...data,
    additonal_document_comment: loanDetailsData['additional_documents']?.['addi_docs_comment'] ?? null,
  };

  return data;
};

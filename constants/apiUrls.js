const BASE_URL = `${process.env.SERVER_URL}`;
const USER_URL = `${BASE_URL}api/user`;
const LIST_COMPANIES = `${BASE_URL}api/company`;
const MSME_LIST_COMPANIES = `${BASE_URL}api/msme-company`
const LIST_LOC_COMPANIES = `${BASE_URL}api/loc-company`;
const COLENDER_COMPANIES = `${BASE_URL}api/co-lender-company`;
const GET_ROLE_METRIX = `${BASE_URL}api/access_metrix`;
const ADD_PARTNER = `${BASE_URL}api/partner`;
const PARTNER_LIST = `${BASE_URL}api/company`;
const PARTNER_DETAILS = `${BASE_URL}api/company`;

const ADD_ANCHOR = `${BASE_URL}api/anchor`;
const ANCHOR_LIST = `${BASE_URL}api/anchor`;
const ANCHOR_DETAILS = `${BASE_URL}api/anchor`;

const GET_ROLE = `${BASE_URL}api/role`;
const GET_DEPARTMENT = `${BASE_URL}api/department`;
const GET_DESIGNATION = `${BASE_URL}api/designation`;
const LOGIN_USER = `${BASE_URL}api/loginuser`;
const LOAN_TYPE = `${BASE_URL}api/default_loan_type`;
const LOAN_TEMPLATE = `${BASE_URL}api/loan_template`;
const DEFAULT_TEMPLATES = `${BASE_URL}api/loan_default_templates`;
const LOAN_SCHEMA = `${BASE_URL}api/loanschema`;
const LOAN_SCHEMA_UPDATE = `${BASE_URL}api/loan_schema`;
const TOKENS = `${BASE_URL}api/tokens`;
const LOAN_SCHEMA_BY_COMPANY = `${BASE_URL}api/getLoanschemaByCompanyId`;
const PRODUCT_DUE_CONFIG = `${BASE_URL}api/product_dues`;
const PRODUCT = `${BASE_URL}api/product`;
const DOCS_MAPPING = `${BASE_URL}api/loan-document-mapping`;
const PRODUCTS = `${BASE_URL}api/products`;
const POSTMAN_COLLECTION_LOANBOOK = `${BASE_URL}api/postman/loanbook`;
const PRODUCT_BY_COMPANY = `${BASE_URL}api/get_products_by_company_id`;
const PRODUCT_BY_MSME_COMPANY = `${BASE_URL}api/get_products_by_msme_company_id`;
const PRODUCT_BY_LOC_COMPANY = `${BASE_URL}api/get_products_by_loc_company_id`;
const DISBURSEMENTCHANNEL = `${BASE_URL}api/disbursement-config`;
const DISBURSEMENTCHANNEL_COLENDER = `${BASE_URL}api/disbursement-config-colender`;
const DISBURSEMENTCHANNELCONFIG = `${BASE_URL}api/config_disbursement-channel`;
const DISBURSEMENTCHANNELLIST = `${BASE_URL}api/disbursement_config_list`;
const SERVICES = `${BASE_URL}api/service`;
const FETCH_LOAN_SCHEMA_DATA_URL = `${BASE_URL}api/fetch_loan_template_data`;
const GET_ALL_TEMPLATES = `${BASE_URL}api/get_loan_template_product_wise`;
const LOAN_REQUEST = `${BASE_URL}api/lead`;
const LOAN_REQUEST_EXPORT = `${BASE_URL}api/downloadleadrecords`;
const CIBILREPORTDOWNLOAD = `${BASE_URL}api/lead-cibil-report`;
const GET_BORROWER_DETAILS_URL = `${BASE_URL}api/borrowerrecords`;
const BORROWER_INFO = `${BASE_URL}api/loan`;
const DA_APPROVAL = `${BASE_URL}api/da-approval`;
const LOAN_DISBURSEMENT = `${BASE_URL}api/disbursement`;
const GET_BORROWER_DETAILS = `${BASE_URL}api/loandetails`;
const BORROWER_INFO_STATUS = `${BASE_URL}api/borrowerinfostatusupdate`;
const LOAN_DOCUMENT = `${BASE_URL}api/loandocument`;
const DRAWDOWN_DOCUMENT = `${BASE_URL}api/drawdown-document`;
const LOAN_DOCUMENT_XML_PARSER = `${BASE_URL}api/kyc/loandocument/parser`;
const LOAN_DOCUMENTFETCH = `${BASE_URL}api/loan_docs`;
const FETCH_DRAWDOWN_DOCUMENT = `${BASE_URL}api/drawdown-docs`;
const SERVICE_INVOICE = `${BASE_URL}api/service_invoice`;
const COMPANY_SERVICES = `${BASE_URL}api/company_services`;
const LOANDOC_TEMPLATE = `${BASE_URL}api/loandoc_template`;
const STATE_CITY_URL = `https://raw.githubusercontent.com/mithunsasidharan/India-Pincode-Lookup/master/pincodes.json`;
const GET_LOAN_DATA_URL = `${BASE_URL}api/loan`;
const ADD_LOAN_TXN_URL = `${BASE_URL}api/loantransactions`;
const REPAYMENT_SCHEDULE = `${BASE_URL}api/repayment_schedule`;
const UPDATE_DEFAULT_TEMPLATE = `${BASE_URL}api/default_loan_template`;
const SCHEMA_TEMPLATES = `${BASE_URL}api/loan_schema_template`;
const VIEW_LOAN_DOCUMENT = `${BASE_URL}api/view_loan_document`;
const VIEW_PART_DOCUMENT = `${BASE_URL}api/view-partner-document`;
const UPLOAD_PART_DOCUMENT = `${BASE_URL}api/partner-document`;
const FETCH_PART_DOCUMENT = `${BASE_URL}api/partner-document`;

const VIEW_ANCHOR_DOCUMENT = `${BASE_URL}api/view-anchor-document`;
const UPLOAD_ANCHOR_DOCUMENT = `${BASE_URL}api/anchor-document`;
const FETCH_ANCHOR_DOCUMENT = `${BASE_URL}api/anchor-document`;

const TRANSACTION_HISTORY_LIST = `${BASE_URL}api/transaction_history_list`;
const DISBURSEMENT_RECORD = `${BASE_URL}api/disbursement_record`;
const BROADCAST_EVENT = `${BASE_URL}api/broadcast_event_master`;
const SUBSCRIBE_EVENT = `${BASE_URL}api/subscribe_event`;
const ONBOARD_DISBURSEMENT = `${BASE_URL}api/disbursement-channel-master`;
const TOPUP_DISBURSEMENT = `${BASE_URL}api/topup-disbursement-channel`;
const DISBUREMENT_CHANNEL_MASTER = `${BASE_URL}api/disbursement-channel-master`;
const DISBUREMENT_CHANNEL_CONFIG = `${BASE_URL}api/disbursement-channel-config`;
const GET_REPORTS = `${BASE_URL}api/disbursement_reports`;
const GENERATE_REPORTS = `${BASE_URL}api/disbursement-report`;
const DOWNLOAD_REPORTS = `${BASE_URL}api/download-disbursement-report`;
const GET_CO_LENDER_REPORTS = `${BASE_URL}api/co-lender-disbursement-reports`;
const GENERATE_CO_LENDER_REPORTS = `${BASE_URL}api/co-lender-escrow-disbursement-report`;
const DOWNLOAD_CO_LENDER_REPORTS = `${BASE_URL}api/co-lender-download-disbursement-report`;
const DOWNLOAD_CO_LENDER_LOANS_REPORTS = `${BASE_URL}api/co-lender-loans-report`;
const GET_BORROWER_REPORTS = `${BASE_URL}api/borrower-disbursement-reports`;
const GENERATE_BORROWER_REPORTS = `${BASE_URL}api/borrower-disbursement-report`;
const DOWNLOAD_BORROWER_REPORTS = `${BASE_URL}api/borrower-download-disbursement-report`;
const DOWNLOAD_UTR_REPORTS = `${BASE_URL}api/download-processed-bank-files`;
const GET_REPAYMENT_REPORTS = `${BASE_URL}api/repayment_reports`;
const GENERATE_REPAYMENT_REPORTS = `${BASE_URL}api/repayment-report`;
const DOWNLOAD_REPAYMENT_REPORTS = `${BASE_URL}api/download-repayment-report`;
const GET_KYC_COMPLIANCE_REPORTS = `${BASE_URL}api/kyc_compliance_reports`;
const GENERATE_KYC_COMPLIANCE_REPORT = `${BASE_URL}api/kyc-compliance-report`;
const DOWNLOAD_KYC_COMPLIANCE_REPORTS = `${BASE_URL}api/download-kyc-compliance-report`;
const GET_REPAYMENT_DUE_REPORTS = `${BASE_URL}api/repayment_due_reports`;
const GENERATE_REPAYMENT_DUE_REPORTS = `${BASE_URL}api/repayment-due-report`;
const DOWNLOAD_REPAYMENT_DUE_REPORTS = `${BASE_URL}api/download-repayment-due-report`;
const GET_SUBVENTION_REPORTS = `${BASE_URL}api/subvention-invoice-report`;
const GENERATE_SUBVENTION_REPORT = `${BASE_URL}api/subvention-invoice-report`;
const DOWNLOAD_SUBVENTION_REPORT = `${BASE_URL}api/download-subvention-invoice-report`;
const GET_COLLATERAL_LIST = `${BASE_URL}api/collateral/list`;
const GET_COLLATERAL_RECORD = `${BASE_URL}api/collateral_record`;
const UPDATE_COLLATERAL_RECORD = `${BASE_URL}api/collateral_details`;
const GET_DISBURSAL_APPROVED_RECORD = `${BASE_URL}api/get-loans-by-status`;
const COMPOSIT_DISBURSEMENT = `${BASE_URL}api/composite_disbursement`;
const PROCESS_DRAWDOWN_PF = `${BASE_URL}api/process-drawdown-pf`;
const SET_CREDIT_LIMIT = `${BASE_URL}api/credit-limit`;
const GET_DPD_REPORT = `${BASE_URL}api/dpd-report`;
const DOWNLOAD_DPD_REPORT = `${BASE_URL}api/download-dpd-report`;
const GENERATE_DPD_REPORT = `${BASE_URL}api/dpd-report`;
const GET_EMI_DATA = `${BASE_URL}api/emi-data`;
const SUBMIT_FOR_NACH_PRESENTATION = `${BASE_URL}api/nach-presentation`;
const GET_NACH_DETAILS = `${BASE_URL}api/enach-details`;
const NACH_HOLD_REGISTRATION = `${BASE_URL}api/nach-suspend-registration`;
const NACH_CANCEL_REGISTRATION = `${BASE_URL}api/nach-cancel-registration`
const NACH_REVOKE_REGISTRATION = `${BASE_URL}api/nach-revoke-suspend-registration`;
const CREATE_SUBSCRIPTION = `${BASE_URL}api/create-subscription`;
const GET_ROW_NACH_DETAIL = `${BASE_URL}api/enach-detail-by-requestId`;
const GET_TRANSACTION_DETAIL = `${BASE_URL}api/nach-transaction-details`;
const POST_NACH_PRESENTMENT_DETAIL = `${BASE_URL}api/enach-create-presentment`;
const GET_NACH_GENERATE_TOKEN = `${BASE_URL}api/enach-get-generated-token`;
const GET_NACH_TRANSACTION_DETAIL = `${BASE_URL}api/enach-transaction-details`;
const GET_NACH_PURPOSE_DETAIL = `${BASE_URL}api/enach-purpose`;
const GET_NACH_LIVE_BANK_DETAILS = `${BASE_URL}api/nach-live-bank-status`;
const GET_LOAN_DETAILS_NACH = `${BASE_URL}api/loan-details-nach`;
const REPAYMENT_V2 = `${BASE_URL}api/repayment-record-v2`;
const GET_PENDING_REPAYMENT_LIST = `${BASE_URL}api/pending-repayment-records`;
const APPROVE_REPAYMENTS = `${BASE_URL}api/repayment-approve`;
const GET_PRODUCT_TYPES = `${BASE_URL}api/product-type`;
const GET_RECON_DETAILS = `${BASE_URL}api/recon-details`;
const GET_FORECLOSURE_REQUEST_WATCHER = `${BASE_URL}api/foreclosure-requests`;
const GET_COLENDER_PROFILE = `${BASE_URL}api/co-lender-profile`;
const GET_COLENDER_REPAYMENT_LIST = `${BASE_URL}api/co-lender-repayment-list`;
const GET_COLENDER_SUMMARY = `${BASE_URL}api/co-lend-transaction`;
const UPDATE_SUMMARY_STAGE = `${BASE_URL}api/update-summary-stage`;
const UPDATE_PAID_STAGE = `${BASE_URL}api/co-lend-repayment-utr`;
const UTR_UPLOAD_REQUEST = `${BASE_URL}api/bank-file-details-dump`;
const FILE_UPLOAD_APPROVAL = `${BASE_URL}api/file-upload-approval-submit`;
const GET_UTR_FILES = `${BASE_URL}api/bank-file-details`;
const GET_COLENDER_NEW_COLENDER_ID = `${BASE_URL}api/co-lender-profile-newcolenderid`;
const GET_FORECLOSURE_REQUEST = `${BASE_URL}api/foreclosure-requests`;
const SERVICE_REQUEST_ACTION = `${BASE_URL}api/foreclosure-approve`;
const TOKEN_DETAILS = `${BASE_URL}api/token`;
const GET_COLENDERS_PRODUCTS = `${BASE_URL}api/co-lenders-product`;
const GET_COLENDERS_LOANS = `${BASE_URL}api/co-lender-loan-search`;
const GET_CBI_LOANS = `${BASE_URL}api/cbi-loan-search`;
const GET_LOAN_DETAILS = `${BASE_URL}api/fetch-loan-details`;
const GET_LEAD_DETAILS = `${BASE_URL}api/fetch-lead-details`;
const GET_CKYC_DETAILS = `${BASE_URL}api/fetch-ckyc-details`;
const GET_BULK_APPOVAL_FILES = `${BASE_URL}api/file-upload-approval-search`;
const GET_CBI_DETAILS = `${BASE_URL}api/fetch-cbi-loan`;
const UPDATE_LOAN_STATUS = `${BASE_URL}api/co-lender-loan-decision`;
const GET_INSTALLMENT_AND_REPAYMENT_REPORT = `${BASE_URL}api/installment-repayment-recon-report`;
const GENERATE_INSTALLMENT_AND_REPAYMENT_REPORT = `${BASE_URL}api/installment-repayment-recon-report`;
const DOWNLOAD_INSTALLMENT_AND_REPAYMENT_REPORT = `${BASE_URL}api/download-installment-repayment-recon-report`;
const GET_COLENDER_REPAYMENT_SCHEDULE = `${BASE_URL}api/co-lender-repayment-schedule`;
const GET_COLENDER_TRANSACTION_HISTORY = `${BASE_URL}api/co-lender-transaction-history`;
const FETCH_COMPANIES = `${BASE_URL}api/analytics/companies`;
const GET_INSURANCE_BILLING_REPORT = `${BASE_URL}api/insurance-billing-report`;
const GENERATE_INSURANCE_BILLING_REPORT = `${BASE_URL}api/insurance-billing-report`;
const DOWNLOAD_INSURANCE_BILLING_REPORT = `${BASE_URL}api/download-insurance-billing-report`;
const UPDATE_BANK_DETAILS = `${BASE_URL}api/bank-details`;
const UPDATE_MISC_DETAILS = `${BASE_URL}api/borrower-misc-data`;
const UPDATE_UMRN_DETAILS = `${BASE_URL}api/loan_nach`;
const UPDATE_MARK_REPO = `${BASE_URL}api/mark_repo`;
const UPDATE_CUSTOM_TEMPLATE = `${BASE_URL}api/custom_loan_template`;
const REPAYMENT_SCHEDULE_FOR_LOC = `${BASE_URL}api/loc-repayment-schedule`;
const GET_UNPROCESSED_REQUEST = `${BASE_URL}api/unprocessed-requests`;
const COMPOSITE_DRAWDOWN = `${BASE_URL}api/composite_drawdown`;
const BATCH_DISBURSEMENT = `${BASE_URL}api/record-drawdown-request`;
const FETCH_BANK_DETAILS = `${BASE_URL}api/bank-details`;
const FETCH_SCHEME_DETAILS = `${BASE_URL}api/product-scheme`;
const UPDATE_DRAWDOWN_REQUEST = `${BASE_URL}api/update-record-drawdown-request`;
const CALCULATE_NET_DRAWDOWN_AMOUNT = `${BASE_URL}api/calculate-net-drawdown-amount`;
const GET_REFUND_DETAILS = `${BASE_URL}api/refund-details`;
const DELETE_LEAD = `${BASE_URL}api/lead-soft-delete`;
const LEAD_MANUAL_REVIEW = `${BASE_URL}api/lead-status-decission`;
const SETTLEMENT_REQUEST_TRANCHES = `${BASE_URL}api/settlement-request`;
const SETTLEMENT_DECISION = `${BASE_URL}api/settlement-request`;
const INITIATE_REFUND = `${BASE_URL}api/initiate-interest-refund`;
const INITIATE_EXCESS_REFUND = `${BASE_URL}api/initiate-excess-refund`;
const UPDATE_TDS_REFUND = `${BASE_URL}api/tds_refund`;
const GET_REPAYMENT_SCHEDULE_REPORTS = `${BASE_URL}api/repayment_schedule_reports`;
const GENERATE_REPAYMENT_SCHEDULE_REPORTS = `${BASE_URL}api/repayment-schedule-report`;
const DOWNLOAD_REPAYMENT_SCHEDULE_REPORTS = `${BASE_URL}api/download-repayment-schedule-report`;
const GET_ACCESS_METRIX = `${BASE_URL}api/access_metrix`;
const ADD_ROLE_METRIX = `${BASE_URL}api/access_metrix`;
const UPDATE_ROLE_METRIX = `${BASE_URL}api/access_metrix`;
const GENERATE_CKYC_REPORT = `${BASE_URL}api/ckyc_report`;
const DOWNLOAD_CKYC_REPORT = `${BASE_URL}api/download_ckyc_report`;
const GET_CKYC_REPORTS = `${BASE_URL}api/ckyc_report`;
const GENERATE_SCREEN_REPORT = `${BASE_URL}api/screen-report`;
const DOWNLOAD_SCREEN_REPORT = `${BASE_URL}api/download-screen-report`;
const GET_SCREEN_REPORTS = `${BASE_URL}api/screen-reports`;
const UPDATE_USER = `${BASE_URL}api/user`;
const UPDATE_ROLE = `${BASE_URL}api/role`;
const CAMS_DETAILS = `${BASE_URL}api/cams-details`;
const OFFER_DETAILS = `${BASE_URL}api/offer-details-data`;
const GET_CAMS_DETAILS = `${BASE_URL}api/cams-details`;
const GET_CAM_DETAILS = `${BASE_URL}api/cam-details`;
const GET_BRE_DETAILS = `${BASE_URL}api/fetch-bre-details`;
const RUN_CREDIT_ENGINE = `${BASE_URL}api/run-credit-engine`;
const GET_A_SCORE_DATA = `${BASE_URL}api/a-score-request`;
const UPDATE_A_SCORE_DATA = `${BASE_URL}api/a-score-request`;

const GET_SELECTOR_DETAILS = `${BASE_URL}api/lead`;
const SELECTOR_BY_ID_WATCHER = `${BASE_URL}api/selector-basic-details`;
const POST_SELECTOR_DETAILS = `${BASE_URL}api/selector-details`;
const POST_SELECTOR_COLENDER_DETAILS = `${BASE_URL}api/selector-response`;
const UPDATE_CAMS_DETAILS = `${BASE_URL}api/cams-details`;
const GET_ZIP_FILES = `${BASE_URL}api/cbi/data`;
const DOWNLOAD_ZIP_FILE = `${BASE_URL}api/cbi/data/download`;
const RECALIBRATE_SANCTION = `${BASE_URL}api/recalibrate-sanction`;
const ADD_COLLATERAL_RECORD = `${BASE_URL}api/collateral_details`;
const GET_CHARGE_TYPES = `${BASE_URL}api/charge-types`;
const APPLY_CHARGE = `${BASE_URL}api/charges`;
const DOWNLOAD_SERVICE_USAGE_REPORT = `${BASE_URL}api/download-service-usage-report`;
const GET_SERVICE_USAGE_REPORT = `${BASE_URL}api/service-usage-report`;
const GET_MONTHLY_COLLECTION_REPORT = `${BASE_URL}api/monthly-collection-report`;
const DOWNLOAD_MONTHLY_COLLECTION_REPORT = `${BASE_URL}api/download-monthly-collection-report`;
const CALCULATE_INSURANCE_PREMIUM = `${BASE_URL}api/insurance-premium-calculation`;
const STATUS_LOGS = `${BASE_URL}api/status-logs`;
const DOWNLOAD_INSURANCE_POLICY = `${BASE_URL}api/insurance-policy`;
const GET_DAILY_COLLECTION_REPORT = `${BASE_URL}api/daily-collection-report`;
const GET_DAILY_LEAD_REPORT = `${BASE_URL}api/lead-report`;
const GET_DAILY_LOAN_REPORT = `${BASE_URL}api/loan-report`;
const DOWNLOAD_DAILY_COLLECTION_REPORT = `${BASE_URL}api/download-daily-collection-report`;
const DOWNLOAD_DAILY_LEAD_REPORT = `${BASE_URL}api/lead-reports`;
const DOWNLOAD_DAILY_LOAN_REPORT = `${BASE_URL}api/loan-reports`;
const RESET_PASSWORD = `${BASE_URL}api/resetpassword`;
const CKYC_UPLOAD_REQUEST = `${BASE_URL}api/ckyc-file-dump`;
const GET_CKYC_UPLOADED_FILE = `${BASE_URL}api/ckyc-file-details`;
const DOWNLOAD_CKYC_UPLOADED_FILE = `${BASE_URL}api/download-processed-ckyc-files`;
const GET_CHARGE = `${BASE_URL}api/charges`;
const WAIVER_REQUEST_URL = `${BASE_URL}api/waiver-request`;
const FORECLOSURE_URL = `${BASE_URL}api/v2/foreclosure-request`;
const FORCE_CLOSE_URL = `${BASE_URL}api/force-close-request`;
const FORCE_CANCEL_URL = `${BASE_URL}api/force-cancel`;
const COLENDER_DISBURSEMENT_CHANNEL_CONFIG_URL = `${BASE_URL}api/config-colender-disbursement-channel`;
const WAIVER_REQUEST_DETAILS_BY_ID_URL = `${BASE_URL}api/waiver-details`;
const GET_FORECLOSURE_OFFER_REQUEST = `${BASE_URL}api/foreclosure-offer-requests`;
const GET_WAIVER_REQUEST = `${BASE_URL}api/waiver-requests`;
const GET_WAIVER_REQUEST_LOAN = `${BASE_URL}api/waiver-requests-loan`;
const WAIVER_REQUEST_DETAILS_BY_REQ_ID_URL = `${BASE_URL}api/waiver-request-details`;
const WAIVER_REQUEST_STATUS_UPDATE_URL = `${BASE_URL}api/waiver-request-status`;
const LOC_REPORTS = `${BASE_URL}api/loc-drawdown-report`;
const DOWNLOAD_LOC_REPORTS = `${BASE_URL}api/download-loc-drawdown-report`;
const GET_LOC_REPORTS = `${BASE_URL}api/loc-drawdown-reports`;
const FORECLOSURE_REQUEST_DETAILS_BY_REQ_ID = `${BASE_URL}api/v2/foreclosure-offer-request`;
const UPDATE_FORECLOSURE_REQUEST_STATUS = `${BASE_URL}api/v2/foreclosure-request/conclusion`;
const CO_LENDER_TOKENS = `${BASE_URL}api/token-co-lenders`;
const GET_LEAD_DEATILS_BY_LOAN_ID = `${BASE_URL}api/kyc-document-data`;
const GET_CO_LENDER_REPAYMENT_REPORTS = `${BASE_URL}api/co-lender-repayment-report`;
const DOWNLOAD_CO_LENDER_REPAYMENT_SUMMARY = `${BASE_URL}api/download-co-lender-repayment-summary`;
const DOWNLOAD_ALL_DOCUMENT = `${BASE_URL}api/download-all-document`;

const LOAD_TEMPLATE_ENUMS = `${BASE_URL}api/enum_fields`;
const FORECLOSURE_OFFERS_REQUESTS = `${BASE_URL}api/v2/foreclosure-offers-requests`;
const DRAWDOWN_REQUEST_LIST = `${BASE_URL}api/loc-drawdown-request`;
const REJECT_DRAWDOWN_REQUEST = `${BASE_URL}api/reject-record-drawdown-request`;
const GET_LOAN_STATE_BY_LOAN_ID = `${BASE_URL}api/loan-state`;
const GET_SOA_DETAILS = `${BASE_URL}api/soa-request`;
const GET_SOA_REQUEST = `${BASE_URL}api/soa-request/generate`;
const DOWNLOAD_SOA_REQUEST = `${BASE_URL}api/soa-request/download`;
const REFUND_TRANSACTION_REPORT = `${BASE_URL}api/refund-transaction-report`;
const GENERATE_REFUND_REPORT = `${BASE_URL}api/generate-refund-transaction-report`;
const DOWNLOAD_REFUND_REPORT = `${BASE_URL}api/download-refund-report`;

const INSURANCE_TRANSACTION_REPORT = `${BASE_URL}api/insurance-transaction-report`;
const GENERATE_INSURANCE_REPORT = `${BASE_URL}api/generate-insurance-transaction-report`;
const DOWNLOAD_INSURANCE_REPORT = `${BASE_URL}api/download-insurance-report`;

const CIBIL_TRANSACTION_REPORT = `${BASE_URL}api/cibil-transaction-report`;
const DOWNLOAD_CIBIL_TRANSACTION_REPORT = `${BASE_URL}api/download-cibil-transaction-report`;

const DOWNLOAD_P2P_REPORTS = `${BASE_URL}api/p2p-download-report`;
const GENERATE_P2P_REPORTS = `${BASE_URL}api/p2p-report`;
const GET_P2P_REPORTS = `${BASE_URL}api/p2p-reports`;
const SEARCH_USER = `${BASE_URL}api/usersearch`;
const SETTLEMENT_REQUEST = `${BASE_URL}api/settlement-request`;
const INTEREST_RATE_SCHEME = `${BASE_URL}api/scheme`;
const GET_BANK_ACCOUNT_HOLDER_NAMES = `${BASE_URL}api/bank-details`;
const UPDATE_TOGGLE_PRODUCT_SCHEME_STATUS = `${BASE_URL}api/product-scheme`;
const GET_ALL_ACTIVE_PRODUCTS = `${BASE_URL}api/product-scheme/active`;
const GET_ALL_PRODUCT_REQUEST = `${BASE_URL}api/product-scheme/products/all`;
const GET_ALL_PRODUCT_SCHEME_MAPPING = `${BASE_URL}api/product-scheme`;
const GET_ALL_PRODUCT_SCHEME = `${BASE_URL}api/product-scheme/scheme`;
const GET_ALL_SCHEMES_LIST = `${BASE_URL}api/scheme`;
const PRODUCT_SCHEME_MAPPED = `${BASE_URL}api/product-scheme`;
const LIST_DISBURSEMENT_INPROGRESS_REPORT = `${BASE_URL}api/disbursement-inprogress-report`;
const GENERATE_DISBURSEMENT_INPROGRESS_REPORT = `${BASE_URL}api/generate-disbursement-inprogress-report`;
const DOWNLOAD_DISBURSEMENT_INPROGRESS_REPORT = `${BASE_URL}api/download-disbursement-inprogress-report`;
const CASH_COLLATERAL_DETAILS = `${BASE_URL}api/cash-collateral`;
const POST_DISBURSE_WITHHELD_AMOUNT = `${BASE_URL}api/v2/disburse_withheld_amount`;
const URC_PARSED_DETAILS = `${BASE_URL}api/udhyam-aadhar-OCR-data`;
const OPERATION_BULK_UPLOAD = `${BASE_URL}api/repayment-file`;
const GET_FOS_USERS = `${BASE_URL}api/collection/users`;
const ADD_FOS_USER = `${BASE_URL}api/collection/user`;
const UPDATE_FOS_USER = `${BASE_URL}api/collection/user`;
const GET_LOCATION = `${BASE_URL}api/collection/location`;
const GET_COLL_CASES_LIST = `${BASE_URL}api/collection/cases`;
const GET_COLL_CASE_BY_ID = `${BASE_URL}api/collection/cases`;
const ASSIGN_COLL_CASES = `${BASE_URL}api/collection/assign-cases`;
const DE_ASSIGN_COLL_CASES = `${BASE_URL}api/collection/deassign-cases`;
const GET_DASHBOARD_FOS_USER = `${BASE_URL}api/collection/dashboard`;
const GET_DASHBOARD_CASE_OVERVIEW = `${BASE_URL}api/collection/dashboard/overview`;
const GET_AGENCIES_LIST = `${BASE_URL}api/collection/agencies`;
const CREATE_COLLECTION_AGENCY = `${BASE_URL}api/collection/agency`;
const UPDATE_COLLECTION_AGENCY = `${BASE_URL}api/collection/agency`;
const GET_DEPOSITION_DATA = `${BASE_URL}api/collection/dashboard/graph`;
const GET_CASE_SOURCING_PARTNER = `${BASE_URL}api/collection/cases/companies`;
const GET_COLL_HISTORY_BY_ID = `${BASE_URL}api/collection/cases/history`;
const GET_COLL_CASE_PAYMENT_BY_ID = `${BASE_URL}api/collection/cases/payment`;
const GET_COLLECTION_CASES_ASSIGN = `${BASE_URL}api/collection/cases/assigned`;
const GET_COLLECTION_CASE_LMS_ID = `${BASE_URL}api/collection/cases/lms-id`;
const GET_COLLECTION_CASE_COLL_ID = `${BASE_URL}api/collection/cases/coll-id`;
const GET_COLLECTION_CASE_SELECTED = `${BASE_URL}api/collection/cases/select`;
const CASE_VIEW_LOAN_DOCUMENT_LOGS = `${BASE_URL}api/collection/view-document-logs`;
const GET_COLLECTION_BANK_DETAILS = `${BASE_URL}api/collection-bank-details`;
const REPORT_REQUEST = `${BASE_URL}api/report-request`;
const VALIDATIONS_LIST_WATCHER = `${BASE_URL}api/validation-checks`;
const CUSTOMER_DATA = `${BASE_URL}api/customer`;
const CUSTOMER_DOCS = `${BASE_URL}api/user-loan-document`;
const VIEW_CUSTOMER_DOC = `${BASE_URL}api/view-customer-doc`;
const GET_CUSTOMER_DETAILS = `${BASE_URL}api/customer-profile`;
const FETCH_LOAN_DOCUMENT = `${BASE_URL}api/loandocument`;
const GET_ENACH_DETAILS_NACH_TRANSACTION = `${BASE_URL}api/enach-transaction-details`;
const BATCH_TRANSACTION_DATA = `${BASE_URL}api/batch-transaction-data`;
const UPLOAD_PRESENTMENT_FILE = `${BASE_URL}api/upload-nach-presentment-file`;
const DOWNLOAD_PRESENTMENT_FILE = `${BASE_URL}api/download-nach-presentment-file`;
const POST_MSME_APPLICANT_DETAILS = `${BASE_URL}api/msme/applicant-details`;
const MSME_DOC_DELETE = `${BASE_URL}api/msme/delete-docs`;
const GET_MSME_BIC_DATA = `${BASE_URL}api/msme/get-BIC-data`;
const CREATE_LOANID = `${BASE_URL}api/msme/lead`
const POST_ESIGN_REQUEST = `${BASE_URL}api/msme/create-esign-request`;
const GET_BOOK_LOAN_DETAILS = `${BASE_URL}api/msme/lead`
const POST_LOAN_DETAILS = `${BASE_URL}api/msme/loan`
const GET_CUSTOMER_ID = `${BASE_URL}api/get-customer-id`;
const BULK_UPLOAD_DATA = `${BASE_URL}api/get-bulk-upload-data`;
const UPLOAD_BULK_FILE = `${BASE_URL}api/upload-bulk-file`;
const DOWNLOAD_BULK_UPLOAD_FILE = `${BASE_URL}api/download-bulk-upload-file`;
const GET_NACH_REPORT_DATA = `${BASE_URL}api/get-nach-report-data`;
const DOWNLOAD_NACH_REPORT_FILE = `${BASE_URL}api/download-nach-report-file`;
const GET_MSME_LEADS = `${BASE_URL}api/msme/lead`;
const FETCH_FEES_AND_CHARGES_DETAILS = `${BASE_URL}api/msme/loan/calculateFeesAndCharges`;
const PATCH_MSME_SECTION_DETAILS = `${BASE_URL}api/msme/lead`;
const GET_MSME_ACTIVITY_LOGS = `${BASE_URL}api/msme/activity-logs`
const PUT_MSME_SAVE_DRAFT = `${BASE_URL}api/msme/lead`;
const PATCH_MSME_COMMENT_DETAILS = `${BASE_URL}api/msme/activity-logs`;
const GET_MSME_SUBMISSION_STATUS_WATCHER = `${BASE_URL}api/msme/lead/submission-status`;
const GET_LEAD_SECTION_STATUS = `${BASE_URL}api/msme/leads/section-status`
const GST_ID_STATUS = `${BASE_URL}api/msme/lead/gstin`;
const UPDATE_LEAD_DEVIATION = `${BASE_URL}api/msme/lead`;
const UPDATE_SCETION_KYC = `${BASE_URL}api/msme/leads`;
const AMMEND_OFFER_API = `${BASE_URL}api/msme/amend-offer`;
const SEND_MSME_AADHAAR_OTP = `${BASE_URL}api/msme/leads/okyc-aadhar-otp`;
const GET_CAMS_DATA = `${BASE_URL}api/msme/leads/cams/`
const POST_TDS_REFUND_REQUESTS = `${BASE_URL}api/tds_refund`;
const UPDATE_CAMS_DATA = `${BASE_URL}api/msme/leads/cams/`
const VERIFY_AADHAAR_OTP = `${BASE_URL}api/msme/leads/aadhaarCheck`
const GET_TDS_REFUND_DATA = `${BASE_URL}api/refund`;
const GET_REFUND_LOANID_DETAILS = `${BASE_URL}api/v2/refund-details`;

module.exports = {
  POST_TDS_REFUND_REQUESTS,
  DOWNLOAD_SERVICE_USAGE_REPORT,
  DOWNLOAD_CO_LENDER_LOANS_REPORTS,
  DA_APPROVAL,
  GET_SERVICE_USAGE_REPORT,
  GET_BORROWER_REPORTS,
  CIBILREPORTDOWNLOAD,
  GENERATE_BORROWER_REPORTS,
  DOWNLOAD_BORROWER_REPORTS,
  DOWNLOAD_UTR_REPORTS,
  GET_CO_LENDER_REPORTS,
  DOWNLOAD_CO_LENDER_REPORTS,
  GENERATE_CO_LENDER_REPORTS,
  BASE_URL,
  USER_URL,
  DOCS_MAPPING,
  GET_ROLE_METRIX,
  LIST_COMPANIES,
  LIST_LOC_COMPANIES,
  ADD_PARTNER,
  PARTNER_LIST,
  GET_ROLE,
  GET_DEPARTMENT,
  GET_DESIGNATION,
  LOGIN_USER,
  LOAN_TYPE,
  LOAN_TEMPLATE,
  LOAN_SCHEMA,
  DEFAULT_TEMPLATES,
  LOAN_SCHEMA_BY_COMPANY,
  PRODUCT_DUE_CONFIG,
  PRODUCT,
  PRODUCTS,
  PRODUCT_BY_COMPANY,
  PRODUCT_BY_LOC_COMPANY,
  TOKENS,
  POSTMAN_COLLECTION_LOANBOOK,
  DISBURSEMENTCHANNEL,
  DISBURSEMENTCHANNELCONFIG,
  DISBURSEMENTCHANNELLIST,
  SERVICES,
  FETCH_LOAN_SCHEMA_DATA_URL,
  GET_ALL_TEMPLATES,
  LOAN_REQUEST,
  GET_BORROWER_DETAILS_URL,
  BORROWER_INFO,
  LOAN_DISBURSEMENT,
  GET_BORROWER_DETAILS,
  BORROWER_INFO_STATUS,
  LOAN_DOCUMENT,
  DRAWDOWN_DOCUMENT,
  LOAN_DOCUMENTFETCH,
  FETCH_DRAWDOWN_DOCUMENT,
  SERVICE_INVOICE,
  COMPANY_SERVICES,
  LOANDOC_TEMPLATE,
  STATE_CITY_URL,
  GET_LOAN_DATA_URL,
  ADD_LOAN_TXN_URL,
  REPAYMENT_SCHEDULE,
  LOAN_SCHEMA_UPDATE,
  UPDATE_DEFAULT_TEMPLATE,
  SCHEMA_TEMPLATES,
  VIEW_LOAN_DOCUMENT,
  VIEW_PART_DOCUMENT,
  UPLOAD_PART_DOCUMENT,
  TRANSACTION_HISTORY_LIST,
  DISBURSEMENT_RECORD,
  BROADCAST_EVENT,
  SUBSCRIBE_EVENT,
  COLENDER_COMPANIES,
  ONBOARD_DISBURSEMENT,
  TOPUP_DISBURSEMENT,
  DISBUREMENT_CHANNEL_MASTER,
  DISBUREMENT_CHANNEL_CONFIG,
  GET_REPORTS,
  GENERATE_REPORTS,
  DOWNLOAD_REPORTS,
  GET_REPAYMENT_REPORTS,
  GENERATE_REPAYMENT_REPORTS,
  DOWNLOAD_REPAYMENT_REPORTS,
  GET_KYC_COMPLIANCE_REPORTS,
  GENERATE_KYC_COMPLIANCE_REPORT,
  DOWNLOAD_KYC_COMPLIANCE_REPORTS,
  GET_REPAYMENT_DUE_REPORTS,
  GENERATE_REPAYMENT_DUE_REPORTS,
  DOWNLOAD_REPAYMENT_DUE_REPORTS,
  GET_SUBVENTION_REPORTS,
  GENERATE_SUBVENTION_REPORT,
  DOWNLOAD_SUBVENTION_REPORT,
  GET_COLLATERAL_LIST,
  GET_COLLATERAL_RECORD,
  UPDATE_COLLATERAL_RECORD,
  GET_DISBURSAL_APPROVED_RECORD,
  COMPOSIT_DISBURSEMENT,
  SET_CREDIT_LIMIT,
  GET_EMI_DATA,
  SUBMIT_FOR_NACH_PRESENTATION,
  GET_DPD_REPORT,
  DOWNLOAD_DPD_REPORT,
  GENERATE_DPD_REPORT,
  REPAYMENT_V2,
  GET_PENDING_REPAYMENT_LIST,
  APPROVE_REPAYMENTS,
  GET_PRODUCT_TYPES,
  GET_RECON_DETAILS,
  GET_FORECLOSURE_REQUEST_WATCHER,
  GET_COLENDER_PROFILE,
  GET_FORECLOSURE_REQUEST,
  SERVICE_REQUEST_ACTION,
  TOKEN_DETAILS,
  GET_COLENDERS_PRODUCTS,
  GET_COLENDERS_LOANS,
  GET_COLENDER_NEW_COLENDER_ID,
  GET_INSTALLMENT_AND_REPAYMENT_REPORT,
  GENERATE_INSTALLMENT_AND_REPAYMENT_REPORT,
  DOWNLOAD_INSTALLMENT_AND_REPAYMENT_REPORT,
  GET_COLENDER_REPAYMENT_SCHEDULE,
  GET_COLENDER_TRANSACTION_HISTORY,
  FETCH_COMPANIES,
  GET_INSURANCE_BILLING_REPORT,
  GENERATE_INSURANCE_BILLING_REPORT,
  DOWNLOAD_INSURANCE_BILLING_REPORT,
  UPDATE_BANK_DETAILS,
  UPDATE_MISC_DETAILS,
  UPDATE_UMRN_DETAILS,
  UPDATE_CUSTOM_TEMPLATE,
  REPAYMENT_SCHEDULE_FOR_LOC,
  GET_UNPROCESSED_REQUEST,
  COMPOSITE_DRAWDOWN,
  BATCH_DISBURSEMENT,
  FETCH_BANK_DETAILS,
  FETCH_SCHEME_DETAILS,
  UPDATE_DRAWDOWN_REQUEST,
  CALCULATE_NET_DRAWDOWN_AMOUNT,
  GET_REFUND_DETAILS,
  DELETE_LEAD,
  LEAD_MANUAL_REVIEW,
  SETTLEMENT_REQUEST_TRANCHES,
  SETTLEMENT_DECISION,
  INITIATE_REFUND,
  INITIATE_EXCESS_REFUND,
  UPDATE_TDS_REFUND,
  GET_REPAYMENT_SCHEDULE_REPORTS,
  GENERATE_REPAYMENT_SCHEDULE_REPORTS,
  DOWNLOAD_REPAYMENT_SCHEDULE_REPORTS,
  UTR_UPLOAD_REQUEST,
  GET_UTR_FILES,
  LOAN_DOCUMENT_XML_PARSER,
  GET_ACCESS_METRIX,
  ADD_ROLE_METRIX,
  UPDATE_ROLE_METRIX,
  GENERATE_CKYC_REPORT,
  DOWNLOAD_CKYC_REPORT,
  GET_CKYC_REPORTS,
  GENERATE_SCREEN_REPORT,
  DOWNLOAD_SCREEN_REPORT,
  GET_SCREEN_REPORTS,
  UPDATE_ROLE,
  UPDATE_USER,
  CAMS_DETAILS,
  GET_CAMS_DETAILS,
  GET_CAM_DETAILS,
  GET_BRE_DETAILS,
  RUN_CREDIT_ENGINE,
  GET_A_SCORE_DATA,
  UPDATE_A_SCORE_DATA,
  UPDATE_CAMS_DETAILS,
  OFFER_DETAILS,
  GET_ZIP_FILES,
  DOWNLOAD_ZIP_FILE,
  ADD_COLLATERAL_RECORD,
  RECALIBRATE_SANCTION,
  GET_CBI_LOANS,
  GET_CBI_DETAILS,
  GET_CHARGE_TYPES,
  APPLY_CHARGE,
  UPDATE_LOAN_STATUS,
  GET_MONTHLY_COLLECTION_REPORT,
  DOWNLOAD_MONTHLY_COLLECTION_REPORT,
  CALCULATE_INSURANCE_PREMIUM,
  STATUS_LOGS,
  GET_DAILY_COLLECTION_REPORT,
  GET_DAILY_LEAD_REPORT,
  GET_DAILY_LOAN_REPORT,
  DOWNLOAD_DAILY_COLLECTION_REPORT,
  RESET_PASSWORD,
  CKYC_UPLOAD_REQUEST,
  GET_CKYC_UPLOADED_FILE,
  DOWNLOAD_CKYC_UPLOADED_FILE,
  GET_SELECTOR_DETAILS,
  POST_SELECTOR_DETAILS,
  POST_SELECTOR_COLENDER_DETAILS,
  SELECTOR_BY_ID_WATCHER,
  LOAN_REQUEST_EXPORT,
  GET_CHARGE,
  WAIVER_REQUEST_URL,
  FORECLOSURE_URL,
  FORCE_CLOSE_URL,
  FORCE_CANCEL_URL,
  COLENDER_DISBURSEMENT_CHANNEL_CONFIG_URL,
  WAIVER_REQUEST_DETAILS_BY_ID_URL,
  DISBURSEMENTCHANNEL_COLENDER,
  GET_FORECLOSURE_OFFER_REQUEST,
  GET_WAIVER_REQUEST,
  WAIVER_REQUEST_DETAILS_BY_REQ_ID_URL,
  WAIVER_REQUEST_STATUS_UPDATE_URL,
  GET_BULK_APPOVAL_FILES,
  FILE_UPLOAD_APPROVAL,
  LOC_REPORTS,
  DOWNLOAD_LOC_REPORTS,
  GET_LOC_REPORTS,
  FORECLOSURE_REQUEST_DETAILS_BY_REQ_ID,
  UPDATE_FORECLOSURE_REQUEST_STATUS,
  CO_LENDER_TOKENS,
  GET_LEAD_DEATILS_BY_LOAN_ID,
  GET_LOAN_DETAILS,
  GET_LEAD_DETAILS,
  GET_CKYC_DETAILS,
  LOAD_TEMPLATE_ENUMS,
  FORECLOSURE_OFFERS_REQUESTS,
  GET_CO_LENDER_REPAYMENT_REPORTS,
  DOWNLOAD_CO_LENDER_REPAYMENT_SUMMARY,
  DOWNLOAD_ALL_DOCUMENT,
  DOWNLOAD_DAILY_LEAD_REPORT,
  DOWNLOAD_DAILY_LOAN_REPORT,
  DRAWDOWN_REQUEST_LIST,
  GET_WAIVER_REQUEST_LOAN,
  GET_LOAN_STATE_BY_LOAN_ID,
  GET_COLENDER_REPAYMENT_LIST,
  GET_COLENDER_SUMMARY,
  UPDATE_SUMMARY_STAGE,
  UPDATE_PAID_STAGE,
  GET_SOA_DETAILS,
  GET_SOA_REQUEST,
  DOWNLOAD_SOA_REQUEST,
  REFUND_TRANSACTION_REPORT,
  GENERATE_REFUND_REPORT,
  DOWNLOAD_REFUND_REPORT,
  DOWNLOAD_P2P_REPORTS,
  GENERATE_P2P_REPORTS,
  GET_P2P_REPORTS,
  SEARCH_USER,
  SETTLEMENT_REQUEST,
  INSURANCE_TRANSACTION_REPORT,
  GENERATE_INSURANCE_REPORT,
  DOWNLOAD_INSURANCE_REPORT,
  GET_BANK_ACCOUNT_HOLDER_NAMES,
  INTEREST_RATE_SCHEME,
  CIBIL_TRANSACTION_REPORT,
  DOWNLOAD_CIBIL_TRANSACTION_REPORT,
  PROCESS_DRAWDOWN_PF,
  UPDATE_TOGGLE_PRODUCT_SCHEME_STATUS,
  GET_ALL_ACTIVE_PRODUCTS,
  GET_ALL_PRODUCT_REQUEST,
  GET_ALL_PRODUCT_SCHEME_MAPPING,
  GET_ALL_PRODUCT_SCHEME,
  GET_ALL_SCHEMES_LIST,
  PRODUCT_SCHEME_MAPPED,
  LIST_DISBURSEMENT_INPROGRESS_REPORT,
  GENERATE_DISBURSEMENT_INPROGRESS_REPORT,
  DOWNLOAD_DISBURSEMENT_INPROGRESS_REPORT,
  PARTNER_DETAILS,
  CASH_COLLATERAL_DETAILS,
  POST_DISBURSE_WITHHELD_AMOUNT,
  URC_PARSED_DETAILS,
  FETCH_PART_DOCUMENT,
  OPERATION_BULK_UPLOAD,
  ADD_ANCHOR,
  ANCHOR_LIST,
  ANCHOR_DETAILS,
  VIEW_ANCHOR_DOCUMENT,
  UPLOAD_ANCHOR_DOCUMENT,
  FETCH_ANCHOR_DOCUMENT,
  GET_FOS_USERS,
  ADD_FOS_USER,
  UPDATE_FOS_USER,
  GET_LOCATION,
  GET_COLL_CASES_LIST,
  GET_COLL_CASE_BY_ID,
  ASSIGN_COLL_CASES,
  DE_ASSIGN_COLL_CASES,
  GET_DASHBOARD_FOS_USER,
  GET_AGENCIES_LIST,
  CREATE_COLLECTION_AGENCY,
  UPDATE_COLLECTION_AGENCY,
  GET_DEPOSITION_DATA,
  GET_CASE_SOURCING_PARTNER,
  GET_DASHBOARD_CASE_OVERVIEW,
  GET_COLL_HISTORY_BY_ID,
  GET_COLL_CASE_PAYMENT_BY_ID,
  GET_COLLECTION_CASES_ASSIGN,
  GET_COLLECTION_CASE_LMS_ID,
  CASE_VIEW_LOAN_DOCUMENT_LOGS,
  REJECT_DRAWDOWN_REQUEST,
  GET_NACH_DETAILS,
  NACH_HOLD_REGISTRATION,
  NACH_REVOKE_REGISTRATION,
  CREATE_SUBSCRIPTION,
  GET_ROW_NACH_DETAIL,
  GET_TRANSACTION_DETAIL,
  GET_NACH_PURPOSE_DETAIL,
  GET_NACH_TRANSACTION_DETAIL,
  POST_NACH_PRESENTMENT_DETAIL,
  GET_NACH_GENERATE_TOKEN,
  GET_COLLECTION_BANK_DETAILS,
  REPORT_REQUEST,
  VALIDATIONS_LIST_WATCHER,
  CUSTOMER_DATA,
  CUSTOMER_DOCS,
  VIEW_CUSTOMER_DOC,
  GET_CUSTOMER_DETAILS,
  FETCH_LOAN_DOCUMENT,
  GET_COLLECTION_CASE_COLL_ID,
  GET_COLLECTION_CASE_SELECTED,
  GET_ENACH_DETAILS_NACH_TRANSACTION,
  BATCH_TRANSACTION_DATA,
  UPLOAD_PRESENTMENT_FILE,
  DOWNLOAD_PRESENTMENT_FILE,
  POST_MSME_APPLICANT_DETAILS,
  MSME_DOC_DELETE,
  GET_MSME_BIC_DATA,
  NACH_CANCEL_REGISTRATION,
  GET_CUSTOMER_ID,
  BULK_UPLOAD_DATA,
  UPLOAD_BULK_FILE,
  DOWNLOAD_BULK_UPLOAD_FILE,
  GET_NACH_REPORT_DATA,
  DOWNLOAD_NACH_REPORT_FILE,
  GET_MSME_LEADS,
  CREATE_LOANID,
  GET_BOOK_LOAN_DETAILS,
  POST_LOAN_DETAILS,
  PATCH_MSME_SECTION_DETAILS,
  GET_MSME_ACTIVITY_LOGS,
  PUT_MSME_SAVE_DRAFT,
  PATCH_MSME_COMMENT_DETAILS,
  MSME_LIST_COMPANIES,
  PRODUCT_BY_MSME_COMPANY,
  GET_MSME_SUBMISSION_STATUS_WATCHER,
  GET_LEAD_SECTION_STATUS,
  GST_ID_STATUS,
  UPDATE_LEAD_DEVIATION,
  UPDATE_SCETION_KYC,
  AMMEND_OFFER_API,
  FETCH_FEES_AND_CHARGES_DETAILS,
  SEND_MSME_AADHAAR_OTP,
  GET_CAMS_DATA,
  UPDATE_CAMS_DATA,
  VERIFY_AADHAAR_OTP,
  GET_NACH_LIVE_BANK_DETAILS,
  POST_ESIGN_REQUEST,
  GET_TDS_REFUND_DATA,
  GET_LOAN_DETAILS_NACH,
  UPDATE_MARK_REPO,
  GET_REFUND_LOANID_DETAILS,
};

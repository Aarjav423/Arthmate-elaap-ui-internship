"use strict";

function includeAllRoutes(app, passport) {
  require("./force-cancel-api")(app);
  require("./tds-refund-request-api")(app);
  require("./msme")(app);
  require("./enach-transaction-api")(app);
  require("./enachTransaction-api")(app);
  require("./collection")(app);
  require("./customer-api.js")(app);
  require('./batch-transaction-api.js')(app);
  require("./tds-refund-api")(app);
  require("./repayment-approval-api")(app);
  require("./collection-bank-account-master-api")(app);
  require("./bank-details-api")(app);
  require("./partner-analytics")(app);
  require("./company-api")(app);
  require("./partner-api")(app);
  require("./role-metrix-api")(app);
  require("./user-api")(app);
  require("./co-lender-repayment-schedule-api")(app);
  require("./co-lender-transaction-history-api")(app);
  require("./product-type-api")(app);
  require("./co-lender-profile-api")(app);
  require("./validation-api")(app);
  require("./loan-type-api")(app);
  require("./loan-schema-api")(app);
  require("./product-due-config-api")(app);
  require("./product-scheme-mapping-api")(app);
  require("./product-api")(app);
  require("./disbursement-channel-config-api")(app);
  require("./generate-token-api")(app);
  require("./postman-api")(app);
  require("./service-api")(app);
  require("./loan-request-api")(app);
  require("./loan-booking-api")(app);
  require("./borrowerinfo-api")(app);
  require("./loan-details-api")(app);
  require("./loan-documents-api")(app);
  require("./company-service-api")(app);
  require("./state-city-api")(app);
  require("./cl-transaction-api")(app);
  require("./repayment-schedule-api")(app);
  require("./repayment-api")(app);
  require("./transaction-history-api")(app);
  require("./enhanced-review-api")(app);
  require("./pubsub-broadcast-api.js")(app);
  require("./compositeDisbursement-api")(app);
  require("./pubsub-subscribe-api")(app);
  require("./disbursement-channel-master-api")(app);
  require("./reports-api")(app);
  require("./repayment-due-reports-api")(app);
  require("./repayment-reports-api")(app);
  require("./kyc-compliance-report-api")(app);
  require("./collateral-api")(app);
  require("./subvention-report-api")(app);
  require("./enach-api.js")(app);
  require("./credit-limit-api")(app);
  require("./dpd-report-api")(app);
  require("./repaymentV2-api")(app);
  require("./recon")(app);
  require("./service-request")(app);
  require("./token-api")(app);
  require("./installment-and-repayment-report")(app);
  require("./insurance-billing-report-api")(app);
  require("./refund-api")(app);
  require("./repayment-schedule-reports-api")(app);
  require("./Kyc/kyc-api")(app);
  require("./access-metrix-api")(app);
  require("./cams-api")(app);
  require("./a-score-api")(app);
  require("./offer-details-api")(app);
  require("./recalibrate-sanction-api")(app);
  require("./charges-api")(app);
  require("./monthly-collection-report-api")(app);
  require("./daily-collection-report-api")(app);
  require("./insurance-api")(app);
  require("./status-logs-api")(app);
  require("./screen-report-api")(app);
  require("./ckyc-bulk-upload.js")(app);
  require("./waiver-request-api.js")(app);
  require("./foreclosure/v2/foreclosure-api")(app);
  require("./co-lender-token-api.js")(app);
  require("./fetch-enum-fields-api")(app);
  require("./colending/co-lender-report-api")(app);
  require("./loan-states-api")(app);
  require("./soa-api")(app);
  require("./settlement-api")(app);
  require("./interest-rate-scheme-api")(app);
  require("./partnerdocument-api")(app);
  require("./anchor-api")(app);
  require("./views")(app);
  require("./cash-collateral-api")(app);
  require("./operation-bulk-upload-api")(app);
  require("./nach-bulk-upload-api")(app);
  require("./nach-reports-api")(app);
  /*require everything above this*/
}

module.exports = function (app, passport) {
  includeAllRoutes(app, passport);
};

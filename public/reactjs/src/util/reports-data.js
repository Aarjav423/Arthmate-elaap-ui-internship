import { storedList } from "./localstorage";
import { checkAccessTags } from "./uam";
const user = storedList("user");
const isTagged =
  process.env.REACT_APP_BUILD_VERSION > 1
    ? user?.access_metrix_tags?.length
    : false;

export const reportsList = [
  {
    id: 1,
    report_category: "KYC compliance",
    report_name: "KYC_compliance_report",
    description: "Report of kyc compliance data",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_KYC_compliance_report_read",
          "tag_KYC_compliance_report_read_write"
        ])
      : false
  },
  {
    id: 2,
    report_category: "Disbursement",
    report_name: "Disbursement_transactions_report",
    description: "Report of disbursement data",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_Disbursement_transactions_report_read",
          "tag_Disbursement_transactions_report_read_write"
        ])
      : false
  },
  {
    id: 3,
    report_category: "Repayment",
    report_name: "Repayment_report",
    description: "Report of repayment data",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_Repayment_report_read",
          "tag_Repayment_report_read_write"
        ])
      : false
  },
  {
    id: 4,
    report_category: "Repayment due",
    report_name: "Repayment_due_report",
    description: "Report of repayment due",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_Repayment_due_report_read",
          "tag_Repayment_due_report_read_write"
        ])
      : false
  },
  {
    id: 5,
    report_category: "Subvention invoice",
    report_name: "Subvention_invoice_report",
    description: "Report of subvention invoice",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_Subvention_invoice_report_read",
          "tag_Subvention_invoice_report_read_write"
        ])
      : false
  },
  {
    id: 6,
    report_category: "DPD Report",
    report_name: "DPD_report",
    description: "Report DPD",
    disabled: isTagged
      ? !checkAccessTags(["tag_DPD_report_read", "tag_DPD_report_read_write"])
      : false
  },
  {
    id: 7,
    report_category: "Installment and repayment recon report",
    report_name: "Installment_and_repayment_recon_report",
    description: "Report for Installments and repayments",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_Installment_and_repayment_recon_report_read",
          "tag_Installment_and_repayment_recon_report_read_write"
        ])
      : false
  },
  {
    id: 8,
    report_category: "Monthly insurance billing report",
    report_name: "Monthly_insurance_billing_report",
    description: "Report for monthly insurance billing",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_Monthly_insurance_billing_report_read",
          "tag_Monthly_insurance_billing_report_read_write"
        ])
      : false
  },
  {
    id: 9,
    report_category: "Repayment schedule report",
    report_name: "Repayment_schedule_report",
    description: "Report for repayment schedule",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_Repayment_schedule_report_read",
          "tag_Repayment_schedule_report_read_write"
        ])
      : false
  },
  {
    id: 10,
    report_category: "CKYC",
    report_name: "CKYC_upload_&_update",
    description: "For CKYC upload and update",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_CKYC_upload_and_update_report_read",
          "tag_CKYC_upload_and_update_report_read_write"
        ])
      : false
  },
  {
    id: 11,
    report_category: "Collections",
    report_name: "Monthly_collections_report",
    description:
      "Monthly report of active loans with EMI due in the upcoming month.",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_Monthly_collection_report_read",
          "tag_Monthly_collection_report_read_write"
        ])
      : false
  },
  {
    id: 12,
    report_category: "Collections",
    report_name: "Daily_collections_report",
    description:
      "Daily report of active loans with EMI due in the upcoming month.",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_daily_collection_report_read",
          "tag_daily_collection_report_read_write"
        ])
      : false
  },
  {
    id: 13,
    report_category: "Screening compliance",
    report_name: "Screening_report",
    description: "Screening cases status.",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_Screening_report_read",
          "tag_Screening_report_read_write"
        ])
      : false
  },
  {
    id: 14,
    report_category: "Service Usage Monthly Report",
    report_name: "Service_usage_report",
    description: "APIs monthly service usage report",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_service_usage_report_read",
          "tag_service_usage_report_read_write"
        ])
      : false
  },
  {
    id: 15,
    report_category: "Drawdown",
    report_name: "LOC_drawdown",
    description: "Report for LOC drawdown",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_LOC_drawdown_read",
          "tag_LOC_drawdown_read_write"
        ])
      : false
  },
  {
    id: 16,
    report_category: "LOC Due Report",
    report_name: "LOC_due_report",
    description: "Due, DPD, payments report for LOC/SCF products",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_LOC_due_report_read",
          "tag_LOC_due_report_read_write"
        ])
      : false
  },
  {
    id: 17,
    report_category: "Lead Report",
    report_name: "Lead_report",
    description: "Daily reports of Lead in the system",
    disabled: isTagged
      ? !checkAccessTags(["tag_lead_report_read", "tag_lead_report_read_write"])
      : false
  },
  {
    id: 18,
    report_category: "Loan Report",
    report_name: "Loan_report",
    description: "Daily reports of Loan in the system",
    disabled: isTagged
      ? !checkAccessTags(["tag_loan_report_read", "tag_loan_report_read_write"])
      : false
  },
  {
    id: 19,
    report_category: "Refund Report",
    report_name: "Refund_report",
    description: "Daily reports of refund transactions in the system",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_refund_report_read",
          "tag_refund_report_read_write"
        ])
      : false
  },
  {
    id: 20,
    report_category: "Insurance Report",
    report_name: "Insurance_report",
    description: "Daily reports of insurance recorded while loan punch",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_insurance_report_read",
          "tag_insurance_report_read_write"
        ])
      : false
  },
  {
    id: 21,
    report_category: "Bureau Report",
    report_name: "Bureau_report",
    description: "bureau report",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_bureau_report_read",
          "tag_bureau_report_read_write"
        ])
      : false
  },
  {
    id: 22,
    report_category: "Disbursement_inprogress_Report",
    report_name: "Disbursement_inprogress_Report",
    description: "reports of disbursement Inprogress data",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_report_disbursement_inprogress_read",
          "tag_report_disbursement_inprogress_read_write"
        ])
      : false
  },
  {
    id: 23,
    report_category: "Enach Subscription Report",
    report_name: "Enach_subscription_report",
    description: "reports of Enach Subscription data",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_report_enach_subscription_read",
          "tag_report_enach_subscription_read_write"
        ])
      : false
  }
];

export const monthMapping = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec"
};

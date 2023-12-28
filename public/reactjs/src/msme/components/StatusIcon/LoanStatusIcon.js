import { LoanStatusList } from "msme/config/LoanStatus"
import React from "react";

const LoanStatusIcon = ({ status }) => {
  const styles = useStyles();

  const handleStatusCss = (status) => {
    let content;

    switch (status) {
      case LoanStatusList.open.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
      case LoanStatusList.batch.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--utility-success-50, #008042)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.manual.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.kyc_data_approved.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.credit_approved.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.co_lender_approval_pending.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.disbursal_approved.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.disbursal_pending.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.disbursement_initiated.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.disbursed.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.rejected.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.cancelled.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.line_in_use.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.expired.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.disbursed.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.manual.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
        case LoanStatusList.foreclosed.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
      default:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--utility-warning-20, #DB8400)",
          color: "var(--utility-warning-20, #DB8400)",
          background: "var(--utility-warning-0, #FFF5E6)",
        };
        break;
    }
    return content;
  };
  return <div style={handleStatusCss(status)}>{LoanStatusList[status] ? LoanStatusList[status]?.label : status}</div>;
};

const useStyles = () => {
  return {
    statusStyle: {
      fontFamily: "Montserrat-Medium",
      fontSize: "12px",
      display: "flex",
      padding: "2px 8px",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "4px",
    },
  };
};

export default LoanStatusIcon;

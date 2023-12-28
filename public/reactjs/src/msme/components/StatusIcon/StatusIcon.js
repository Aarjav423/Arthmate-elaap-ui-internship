import { LeadStatus } from "../../config/LeadStatus";
import React from "react";

const StatusIcon = ({ status }) => {
  const styles = useStyles();

  const handleStatusCss = (status) => {
    let content;

    switch (status) {
      case LeadStatus.lead_deviation.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--primary-50, #475BD8)",
          color: "var(--primary-50, #475BD8)",
          background: "var(--primary-0, #EDEFFB)",
        };
        break;
      case LeadStatus.approved.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--utility-success-50, #008042)",
          color: "var(--utility-success-50, #008042)",
          background: "var(--utility-success-0, #EEFFF7)",
        };
        break;
      case LeadStatus.active.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--utility-success-50, #008042)",
          color: "var(--utility-success-50, #008042)",
          background: "var(--utility-success-0, #EEFFF7)",
        };
        break;
      case LeadStatus.in_progress.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--utility-warning-20, #DB8400)",
          color: "var(--utility-warning-20, #DB8400)",
          background: "var(--utility-warning-0, #FFF5E6)",
        };
        break;
      case LeadStatus.pending.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--utility-warning-20, #DB8400)",
          color: "var(--utility-warning-20, #DB8400)",
          background: "var(--utility-warning-0, #FFF5E6)",
        };
        break;
      case LeadStatus.in_review.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--utility-warning-20, #DB8400)",
          color: "var(--utility-warning-20, #DB8400)",
          background: "var(--utility-warning-0, #FFF5E6)",
        };
        break;
      case LeadStatus.rejected.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--utility-danger-30, #B30000)",
          color: "var(--utility-danger-30, #B30000)",
          background: "var(--utility-danger-0, #FFECEC)",
        };
        break;
      case LeadStatus.draft.value:
        content = {
          ...styles.statusStyle,
          border: "1px solid var(--neutrals-neutral-80, #4B4D57)",
          color: "1px solid var(--neutrals-neutral-80, #4B4D57)",
          background: "var(--neutrals-neutral-10, #E5E5E8)",
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
  return <div style={handleStatusCss(status)}>{LeadStatus[status] ? LeadStatus[status]?.label : status}</div>;
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
      whiteSpace: "nowrap"
    },
  };
};

export default StatusIcon;

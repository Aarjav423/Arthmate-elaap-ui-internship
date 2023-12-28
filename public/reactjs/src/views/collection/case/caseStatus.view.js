import * as React from "react";
import { useState, useEffect } from "react";
import { convertIntoINR } from "util/collection/helper";
export default function CaseStatus(props) {
  const styles = {
    container: {
      display: "grid",
      gridTemplateRows: "24% 36% 36%",
      marginTop: "30px",
      overflowX: "auto",
      boxSizing: "border-box",
      border: "1px solid #E1E1E1",
      borderRadius: "36px",
      marginLeft: "25px",
      padding: "16px",
      fontFamily: "Montserrat-Regular-SemiBold",
    },
    heading: {
      paddingTop: "2%",
      paddingLeft: "3%",
      display: "flex",
      alignItems: "center",
      fontFamily: "Montserrat-Regular",
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "24px",
      letterSpacing: "-0.25px",
      textAlign: "left",
      color: "#1C1C1C",
    },
    textContainer: {
      paddingTop: "3%",
      paddingLeft: "3%",
      display: "grid",
      gridTemplateColumns: "35% 35% 30%",
    },
    upperText: {
      fontFamily: "Montserrat-Regular",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "24px",
      letterSpacing: "-0.25px",
      textAlign: "left",
      color: "#414141",
      marginBottom: "0",
    },
    lowerText: {
      fontFamily: "Montserrat-Regular",
      fontSize: "14px",
      fontWeight: "700",
      lineHeight: "24px",
      letterSpacing: "-0.25px",
      textAlign: "left",
      color: "#414141",
    },
    rupeeSign: {
      fontFamily: "Open Sans Regular",
    },
  };

  return (
    <div style={styles.container}>
      <div>
        <p style={styles.heading}>Collection Status</p>
      </div>
      <div style={styles.textContainer}>
        <div style={{display: props.status=="open"?"none":"initial"}}>
          <p style={styles.upperText}>Paid Amount</p>
          <p style={styles.lowerText}>
            <span style={styles.rupeeSign}>₹</span>{" "}
            {convertIntoINR(props.paid_amount)}
          </p>
        </div>
        <div>
          <p style={styles.upperText}>Unpaid Amount</p>
          <p style={styles.lowerText}>
            <span style={styles.rupeeSign}>₹</span>{" "}
            {convertIntoINR(props.unpaid_amount)}
          </p>
        </div>
        <div style={{display: props.status!="ongoing"?"none":"initial"}}>
          <p style={styles.upperText}>Case Deposition Status</p>
          <p style={styles.lowerText}>{props.case_status.replace('_', ' ').toUpperCase()}</p>
        </div>
        <div>
          <p style={styles.upperText}>Last Visit</p>
          <p style={styles.lowerText}>{props.last_visit}</p>
        </div>
        <div>
          <p style={styles.upperText}>Follow Up Date</p>
          <p style={styles.lowerText}>{props.follow_up_date}</p>
        </div>
      </div>
    </div>
  );
}

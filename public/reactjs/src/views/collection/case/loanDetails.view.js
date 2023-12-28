import * as React from "react";
import { useState, useEffect } from "react";
import InfoPopup from "./infoPopup.view";
import { convertIntoINR } from "util/collection/helper";

export default function LoanDetails(props) {
  const styles = {
    container: {
      display: "grid",
      gridTemplateRows: "50% 50%",
      backgroundColor: "#FAFAFA",
      borderRadius: "16px",
      width: "96%",
      maxWidth: "90vw",
      margin: "0 auto",
      paddingBottom: "2%",
      overflowX: "auto",
      boxSizing: "border-box",
      minWidth: "510px",
      fontFamily: "Montserrat-Regular-SemiBold",
      marginBottom: "10px",
    },
    rowStyle: {
      display: "grid",
      gridTemplateColumns: "26% 26% 26% 22%",
      paddingTop: "4%",
      paddingLeft: "5%",
    },
    upperText: {
      fontFamily: "Montserrat-Regular",
      fontSize: "14px",
      fontWeight: "600",
      lineHeight: "17px",
      letterSpacing: "0em",
      textAlign: "left",
      color: "#424242",
    },
    lowerText: {
      fontFamily: "Montserrat-Regular",
      fontSize: "14px",
      fontWeight: "500",
      lineHeight: "17px",
      letterSpacing: "0em",
      textAlign: "left",
      color: "#424242",
    },
    rupeeSign: {
      fontFamily: "Open Sans Regular",
    },
    infoContainer: {
      display: "grid",
      gridTemplateRows: "repeat(2, 1fr)",
      gridTemplateColumns: "52% 48%",
      paddingLeft: "18px",
      paddingTop: "12px",
      height: "121px",
    },
    infoColumn: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
    },
    infoPopupUpperText: {
      fontFamily: "Montserrat-Regular",
      fontSize: "12px",
      fontWeight: "500",
      lineHeight: "15px",
      letterSpacing: "0em",
      textAlign: "left",
      marginBottom: "0",
    },
    infoPopupLowerText: {
      fontFamily: "Montserrat-Regular",
      fontSize: "14px",
      fontWeight: "500",
      lineHeight: "17px",
      letterSpacing: "0em",
      textAlign: "left",
      marginTop: "0",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.rowStyle}>
        <div>
          <p style={styles.upperText}>Loan App ID</p>
          <p style={styles.lowerText}>{props.loan_app_id}</p>
        </div>
        <div>
          <p style={styles.upperText}>Sanction Amount</p>
          <p style={styles.lowerText}>
            <span style={styles.rupeeSign}>₹</span>{" "}
            {convertIntoINR(props.sanction_amount)}
          </p>
        </div>
        <div>
          <p style={styles.upperText}>Insurance Amount</p>
          <p style={styles.lowerText}>
            <span style={styles.rupeeSign}>₹</span>{" "}
            {convertIntoINR(props.insurance_amount)}
          </p>
        </div>
        <div>
          <p style={styles.upperText}>Tenure</p>
          <p style={styles.lowerText}>{props.tenure} months</p>
        </div>
      </div>
      <div style={styles.rowStyle}>
        <div>
          <p style={styles.upperText}>First Inst. Date</p>
          <p style={styles.lowerText}>{props.first_inst_date}</p>
        </div>
        <div>
          <p style={styles.upperText}>Overdue Days</p>
          <p style={styles.lowerText}>{props.overdue_days} Days</p>
        </div>
        <div>
          <p style={styles.upperText}>
            Total Outstanding{" "}
            <InfoPopup
              content={
                <div style={styles.infoContainer}>
                  <div style={styles.infoColumn}>
                    <p style={styles.infoPopupUpperText}>
                      Current Interest Due
                    </p>
                    <p style={styles.infoPopupLowerText}>
                      <span style={styles.rupeeSign}>₹</span>{" "}
                      {convertIntoINR(props.current_instalment_due)}
                    </p>
                  </div>
                  <div style={styles.infoColumn}>
                    <p style={styles.infoPopupUpperText}>
                      Current Principal Due
                    </p>
                    <p style={styles.infoPopupLowerText}>
                      <span style={styles.rupeeSign}>₹</span>{" "}
                      {convertIntoINR(props.current_principal_due)}
                    </p>
                  </div>
                  <div style={styles.infoColumn}>
                    <p style={styles.infoPopupUpperText}>
                      Current Late Payment Interest
                    </p>
                    <p style={styles.infoPopupLowerText}>
                      <span style={styles.rupeeSign}>₹</span>{" "}
                      {convertIntoINR(props.current_late_payment_interest)}
                    </p>
                  </div>
                  <div style={styles.infoColumn}>
                    <p style={styles.infoPopupUpperText}>Charge Amount + GST</p>
                    <p style={styles.infoPopupLowerText}>
                      <span style={styles.rupeeSign}>₹</span>{" "}
                      {convertIntoINR(props.charge_amount_and_gst)}
                    </p>
                  </div>
                </div>
              }
            />
          </p>
          <p style={styles.lowerText}>
            <span style={styles.rupeeSign}>₹</span>{" "}
            {convertIntoINR(props.total_outstanding)}
          </p>
        </div>
      </div>
      {/* <div style={styles.rowStyle}>
        <div>
          <p style={styles.upperText}>Total Amount Paid</p>
          <p style={styles.lowerText}>
            <span style={styles.rupeeSign}>₹</span>{" "}
            {convertIntoINR(props.total_amount_paid)}
          </p>
        </div>
        <div>
          <p style={styles.upperText}>Total Amount Waived</p>
          <p style={styles.lowerText}>
            <span style={styles.rupeeSign}>₹</span>{" "}
            {convertIntoINR(props.total_amount_waived)}
          </p>
        </div>
        <div>
          <p style={styles.upperText}>Total GST Paid</p>
          <p style={styles.lowerText}>
            <span style={styles.rupeeSign}>₹</span>{" "}
            {convertIntoINR(props.total_gst_paid)}
          </p>
        </div>
        <div>
          <p style={styles.upperText}>Total GST Reversed</p>
          <p style={styles.lowerText}>
            <span style={styles.rupeeSign}>₹</span>{" "}
            {convertIntoINR(props.total_gst_reversed)}
          </p>
        </div>
      </div> */}
    </div>
  );
}

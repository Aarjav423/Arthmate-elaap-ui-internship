import * as React from "react";
import { useState, useEffect } from "react";

export default function ProfileDetails(props) {
  const styles = {
    container: {
      marginTop: "30px",
      display: "grid",
      gridTemplateRows: "58% 42%",
      border: "1px solid #E1E1E1",
      borderRadius: "36px",
      marginLeft: "25px",
      overflowX: "auto",
      boxSizing: "border-box",
    },
    roundBackground: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "60px",
      height: "60px",
      backgroundColor: "#DFEEF6",
      marginLeft: "5%",
      borderRadius: "50%",
      fontFamily: "Montserrat-Regular",
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "46px",
      letterSpacing: "-0.25px",
      color: "#454545",
    },
    name: {
      fontFamily: "Montserrat-Regular",
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "24px",
      letterSpacing: "-0.25px",
      color: "#1C1C1C",
      textAlign: "left",
    },
    upperRow: {
      display: "flex",
      flexDirection: "row",
      paddingTop: "10%",
    },
    lowerRow: {
      padding: "5%",
      display: "flex",
      justifyContent: "space-between",
    },
    upperText: {
      fontFamily: "Montserrat-Regular",
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "24px",
      letterSpacing: "-0.25px",
      textAlign: "left",
      color: "#414141",
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.upperRow}>
        <div style={styles.roundBackground}>{props.short_name}</div>
        <div style={{ marginLeft: "21px" }}>
          <p style={styles.name}>{props.full_name}</p>
          <p style={styles.upperText}>+91 {props.contact_number}</p>
        </div>
      </div>
      <div style={styles.lowerRow}>
        <div style={styles.upperText}>
          Sourcing partner
          <div style={styles.lowerText}>{props.sourcing_partner}</div>
        </div>

        <div style={styles.upperText}>
          Loan ID
          <div style={styles.lowerText}>{props.loan_id}</div>
        </div>
      </div>
    </div>
  );
}

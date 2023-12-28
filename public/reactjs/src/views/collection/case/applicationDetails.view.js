import React, { useState } from "react";

const styles = {
  applicationDetailsBox: {
    display: "grid",
    gridTemplateRows: "50% 50%",
    backgroundColor: "#fafafa",
    borderRadius: "0 0 16px 16px",
    width: "96%",
    maxWidth: "90vw",
    margin: "0 auto",
    paddingBottom: "3%",
    overflowX: "auto",
    boxSizing: "border-box",
    minWidth: "510px",
    marginBottom: "10px",
  },
  tabRow: {
    display: "flex",
    borderBottom: "2px solid #dbdbdb",
    paddingLeft: "12px",
    paddingTop: "6px",
    backgroundColor: "#fafafa",
    borderRadius: "16px 16px 0 0",
    margin: "0 auto",
    width: "96%",
    maxWidth: "90vw",
    minWidth: "510px",
  },
  upperText: {
    fontFamily: "Montserrat-Regular",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "17px",
    letterSpacing: "0em",
    textAlign: "left",
    color: "#424242",
  },
  lowerText: {
    fontFamily: "Montserrat-Regular",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "17px",
    letterSpacing: "0em",
    textAlign: "left",
    color: "#424242",
  },
  dataRow: {
    display: "grid",
    gridTemplateColumns: "25% 25% 25% 25%",
    paddingTop: "4%",
    paddingLeft: "3%",
  },
  coappRow: {
    display: "grid",
    gridTemplateColumns: "25% 25% 25% 25%",
    paddingTop: "4%",
    paddingLeft: "3%",
  },
  tab: {
    textAlign: "center",
    padding: "12px",
    marginRight: "10px",
    cursor: "pointer",
    position: "relative",
  },
  tabSpan: {
    display: "inline-block",
    position: "relative",
  },
  tabSpanBefore: {
    content: '""',
    position: "absolute",
    top: "35px",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "2px",
    backgroundColor: "blue",
    transform: "scaleX(0)",
    transformOrigin: "bottom left",
    transition: "transform 0.2s ease-in-out",
  },
  tabHover: {
    color: "blue",
  },
  activeTabSpanBefore: {
    transform: "scaleX(1)",
  },
  activeTab: {
    color: "blue",
  },
  tabContent: {
    marginTop: "16px",
  },
};

export default function ApplicationDetails(props) {
  const [activeTab, setActiveTab] = useState("borrower");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const isReferenceDataEmpty = () => {
    return props.refs.every((ref) => Object.keys(ref).length === 0);
  };

  return (
    <div>
      <div style={styles.tabRow}>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "borrower" && styles.activeTab),
          }}
          onClick={() => handleTabClick("borrower")}
        >
          <span style={styles.tabSpan}>
            Borrower Details
            <span
              style={{
                ...styles.tabSpanBefore,
                ...(activeTab === "borrower" && styles.activeTabSpanBefore),
              }}
            ></span>
          </span>
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "coapplicant" && styles.activeTab),
          }}
          onClick={() => handleTabClick("coapplicant")}
        >
          <span style={styles.tabSpan}>
            Co-Applicant Details
            <span
              style={{
                ...styles.tabSpanBefore,
                ...(activeTab === "coapplicant" && styles.activeTabSpanBefore),
              }}
            ></span>
          </span>
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "reference" && styles.activeTab),
          }}
          onClick={() => handleTabClick("reference")}
        >
          <span style={styles.tabSpan}>
            Reference Details
            <span
              style={{
                ...styles.tabSpanBefore,
                ...(activeTab === "reference" && styles.activeTabSpanBefore),
              }}
            ></span>
          </span>
        </div>
      </div>
      <div style={styles.applicationDetailsBox}>
        {activeTab === "borrower" && (
          <div>
            <div style={styles.dataRow}>
              <div>
                <p style={styles.upperText}>Loan ID</p>
                <p style={styles.lowerText}>{props.loan_id}</p>
              </div>
              <div>
                <p style={styles.upperText}>Customer ID</p>
                <p style={styles.lowerText}>{props.customer_id}</p>
              </div>
              <div>
                <p style={styles.upperText}>Borrower Name</p>
                <p style={styles.lowerText}>{props.borrower_name}</p>
              </div>
              <div>
                <p style={styles.upperText}>Contact Number</p>
                <p style={styles.lowerText}>{props.contact_number}</p>
              </div>
            </div>
            <div style={styles.dataRow}>
              <div>
                <p style={styles.upperText}>Gender</p>
                <p style={styles.lowerText}>{props.gender}</p>
              </div>
              <div>
                <p style={styles.upperText}>City</p>
                <p style={styles.lowerText}>{props.city}</p>
              </div>
              <div>
                <p style={styles.upperText}>State</p>
                <p style={styles.lowerText}>{props.state}</p>
              </div>
              <div>
                <p style={styles.upperText}>Pincode</p>
                <p style={styles.lowerText}>{props.pincode}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "coapplicant" && (
          <div>
            {Object.keys(props.coapplicant_details).length > 0 ? (
              <div style={styles.coappRow}>
                <div>
                  <p style={styles.upperText}>Name</p>
                  <p style={styles.lowerText}>
                    {props.coapplicant_details.name}
                  </p>
                </div>
                <div>
                  <p style={styles.upperText}>Contact Number</p>
                  <p style={styles.lowerText}>
                    {props.coapplicant_details.mobile_no}
                  </p>
                </div>
                <div>
                  <p style={styles.upperText}>Address</p>
                  <p style={styles.lowerText}>
                    {props.coapplicant_details.address}
                  </p>
                </div>
                <div>
                  <p style={styles.upperText}>Relation With Applicant</p>
                  <p style={styles.lowerText}>
                    {props.coapplicant_details.relation_with_applicant}
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ textAlign: "center", marginTop: "50px" }}>
                No co-applicant details found
              </p>
            )}
          </div>
        )}
        {activeTab === "reference" && (
          <div>
            {props.refs.length > 0 && !isReferenceDataEmpty() ? (
              props.refs.map((ref, index) => (
                <div style={styles.coappRow} key={index}>
                  <div>
                    <p style={styles.upperText}>Name</p>
                    <p style={styles.lowerText}>{ref.name}</p>
                  </div>
                  <div>
                    <p style={styles.upperText}>Contact Number</p>
                    <p style={styles.lowerText}>{ref.mobile_no}</p>
                  </div>
                  <div>
                    <p style={styles.upperText}>Address</p>
                    <p style={styles.lowerText}>{ref.address}</p>
                  </div>
                  <div>
                    <p style={styles.upperText}>Relation With Applicant</p>
                    <p style={styles.lowerText}>{ref.relation_with_borrower}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", marginTop: "50px" }}>
                No reference details found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";

const CurrentDue = (props) => {
  const { data } = props;
  const getVal = (value) => {
    if (value?.$numberDecimal !== undefined) {
      return parseFloat(value.$numberDecimal.toString());
    } else if (typeof value === "object") {
      return parseFloat(value.toString());
    }
    return value;
  };
  return (
    <>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EDEDED",
          borderRadius: "8px",
          marginLeft: "25px",
          marginRight: "20px",
          padding: "16px",
          fontFamily: "Montserrat-SemiBold",
          marginTop: "25px"
        }}
      >
        <h4
          style={{
            fontSize: "18px",
            lineHeight: "150%",
            fontFamily: "Montserrat-SemiBold",
            color: "#141519"
          }}
        >
          Current Due
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "25% 25% 25% 25%",
            marginTop: "24px",
            width: "100%"
          }}
        >
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }}>
            PRINCIPAL
            <div
              style={{
                color: "black",
                fontFamily: "Montserrat-Medium",
                fontSize: "16px"
              }}
            >
              {data?.principal_due||data?.principal_due===0 ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(data?.principal_due)): "NA"}
            </div>
          </div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }}>
            INTEREST
            <div
              style={{
                color: "black",
                fontFamily: "Montserrat-Medium",
                fontSize: "16px",
                maxWidth: "150px"
              }}
            >
              {data?.interest_due||data?.interest_due===0 ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(data?.interest_due)): "NA"}
            </div>
          </div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }}>
            LPI
            <div
              style={{
                color: "black",
                fontFamily: "Montserrat-Medium",
                fontSize: "16px",
                maxWidth: "150px"
              }}
            >
              {data?.lpi_due||data?.lpi_due===0 ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(data?.lpi_due)): "NA"}
            </div>
          </div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }}>
            CHARGES
            <div
              style={{
                color: "black",
                fontFamily: "Montserrat-Medium",
                fontSize: "16px",
                maxWidth: "150px"
              }}
            >
              {data?.charges_due||data?.charges_due===0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(data?.charges_due)):"NA"}
            </div>
          </div>
          <div
            style={{
              fontFamily: "Montserrat-Regular",
              fontSize: "12px",
              marginTop: "24px"
            }}
          >
            GST
            <div
              style={{
                color: "black",
                fontFamily: "Montserrat-Medium",
                fontSize: "16px",
                maxWidth: "150px"
              }}
            >
              {data?.gst_due||data?.gst_due===0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(data?.gst_due)):"NA"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentDue;

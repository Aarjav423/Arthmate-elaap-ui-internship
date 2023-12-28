import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import WaiverRequestDetails from "../../ServiceRequest/WaiverRequestDetails";
import WaiverRequestForm from "../WaiverRequestForm";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import "react-sdk/dist/styles/_fonts.scss";

const style = {
  position: "fixed",
  align: "right",
  zIndex: "9999",
  top: "5%",
  left: "15%",
  marginRight: "20px",
  transform: "translate(1, 2)",
  width: "95%",
  height: "100%",
  overflow: "auto",
  minHeight: "20%",
  bgcolor: "background.paper",
  border: "1px solid #ccc",
  boxShadow: 5,
  p: 2,
  backgroundColor: "#fff"
};

export default function WaiverDetailsPopup(props) {
  const {
    open,
    onModalClose,
    title,
    openDialog,
    handleClose,
    company_id,
    product_id,
    loan_id,
    request_id,
    type,
    isForSingleLoan,
    accessTags,
    ...other
  } = props;

  return (
    <>
      {openDialog ? (
        <FormPopup
          heading={type === "details" ? "Waiver Service Request" : "New Waiver Service Request"}
          onClose={handleClose}
          isOpen={openDialog}
          customHeaderStyle={{
            fontFamily: "Montserrat-Bold",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: "150%",
            color: "#303030",
            paddingLeft: "16px"
          }}
          customStyles={{
            width: "fit-content",
            maxWidth: "70%",
            maxHeight: "90%",
            overflowY: "auto"
          }}
        >

          {type === "details" ? (
            <WaiverRequestDetails
              company_id={company_id}
              product_id={product_id}
              loan_id={loan_id}
              request_id={request_id}
              isPropBased={true}
              isForSingleLoan={isForSingleLoan}
              accessTags={accessTags}
              handleClose={handleClose}
            />
          ) : null}
          {type === "addnew" ? (
            <WaiverRequestForm
              company_id={company_id}
              product_id={product_id}
              loan_id={loan_id}
              isPropBased={true}
            />
          ) : null}
        
        </FormPopup>
      ) : null}
    </>
  );
}

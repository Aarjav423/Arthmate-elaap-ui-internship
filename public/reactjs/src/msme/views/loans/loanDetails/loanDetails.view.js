import React, { useState } from "react";
import TabButton from "react-sdk/dist/components/TabButton";
import "./loanDetails.css";
import Details from "./details/details.view";
import Repayment from "./repayment/repayment.view";
import SanctionLenderLoan from "../sanctionAndLender/sanctionLenderLoan.view";
export default function LoanDetails() {
  const [detailsType, setDetailsType] = useState("loan details");
  const handleLoanDetailsClick = () => {
    console.log("loan details is clicked");
  };
  const handleDocumentsClick = () => {
    // console.log('documents is clicked');
  };
  const handleSlLbaClick = () => {
    // console.log('sl & lba is clicked');
  };
  const handleRepaymentScheduleClick = () => {
    // console.log('documents is clicked');
  };
  const handleBatchChangePage = (event, newPage) => {
    setBatchPage(event);
  };

  const changeActiveTab = (tabName) => {
    const tabClickHandlers = {
      "loan details": handleLoanDetailsClick,
      documents: handleDocumentsClick,
      "sl & lba": handleSlLbaClick,
      "repayment schedule": handleRepaymentScheduleClick,
    };
    const tabClickHandler = tabClickHandlers[tabName];
    if (tabClickHandler) {
      tabClickHandler();
    }
  };
  const handleSetTabValue = (e) => {
    let stageName = e.target.value.toLowerCase();
    changeActiveTab(stageName);
  };
  return (
    <React.Fragment>
      <div className="loan-details-container">
        {["Loan Details", "Documents", "SL & LBA", "Repayment Schedule"].map(
          (template, index) => {
            return (
              <TabButton
                label={template}
                isDisabled={false}
                key={index}
                onClick={handleSetTabValue}
                selected={
                  template.toLowerCase() === detailsType.toLowerCase()
                    ? true
                    : false
                }
                setSelectedOption={setDetailsType}
              />
            );
          }
        )}
        {detailsType === "loan details" && <Details />}
        {detailsType == "sl & lba" && <SanctionLenderLoan/>}  
        {detailsType == "repayment schedule" && <Repayment/>}  
      </div>
    </React.Fragment>
  );
}

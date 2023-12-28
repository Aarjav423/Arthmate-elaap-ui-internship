import React, { useState, useEffect } from "react";
import "./styles.css";
import { useDispatch } from "react-redux";
import FormPopUp from "react-sdk/dist/components/Popup/FormPopup";
import Button from "react-sdk/dist/components/Button";
import { storedList } from "../util/localstorage";
import { initiateRefundWatcher } from "../actions/refund";
import { AlertBox } from "../components/AlertBox";

export default function InterestRefundRequestPopup({
  handleClose,
  company,
  product,
  data,
}) {
  const user = storedList("user");
  const dispatch = useDispatch();

  const [isopen, setIsOpen] = useState(true);
  const [isDisburstOpen, setIsDisburstOpen] = useState(false);
  const [remarks, setRemarks] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [loanStatus, setLoanStatus] = useState([])

  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  const [alert, setAlert] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);

  const refundStatus = [
    {label: "Total Request", value: remarks.length},
    {label: "Successful Request", value: successCount},
    {label: "Failed Request", value: failedCount},
  ]

  useEffect(() => {
    if (!isAlertOpen) {
      handleAlertClose();
    }
  }, [isAlertOpen]);

  useEffect(() => {
    const isFormFilled = remarks.length > 0;
    setIsDisabled(!isFormFilled);
  }, [remarks]);

  const infoIconStyle = {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    backgroundColor: '#3498db',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
  };

  const showAlert = (msg, type) => {
    setIsAlertOpen(true);
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const removeTag = (i) => {
    const newRemarks = [...remarks];
    newRemarks.splice(i, 1);
    setRemarks(newRemarks);
  };
  const inputKeyDown = (e) => {
    const val = e.target.value.trim();
    if ((e.key === "Enter" || e.key === " " || e.key === ",") && val) {
      const newEntries = val.split("\n").map((entry) => entry.trim()).filter(Boolean);
  
      if (newEntries.length === 0) {
        return;
      }
  
      const uniqueEntries = Array.from(new Set([...remarks, ...newEntries]));
  
      setRemarks(uniqueEntries);
      e.target.value = null;
    } else if (e.key === "Backspace" && !val) {
      const newRemarks = [...remarks];
      newRemarks.pop();
    setRemarks(newRemarks);
    }
  };

  const customStatus = (status) => {
    if(status == 'Open'){
      return 'Not Initiated'
    } else {
      return status.replace("_",` `);
    }
  }

  const handleSubmit = async () => {
    setLoanStatus([]);
    toggleModal();
    let success = 0;
    let failed = 0;
    for (let i = 0; i < remarks.length; i++) {
      const loanId = remarks[i];
      const matchingLoan = data.find((loan) => loan.id === loanId);
        const payload = {
            loan_id: loanId,
            refund_amount: matchingLoan.refund_amount,
            user_id: user._id,
            company_id: company,
            product_id: product,
          };

        if(matchingLoan && matchingLoan.status !== 'Processed' && matchingLoan.status !== 'In_Progress'){
          await new Promise((resolve, reject) => {
            dispatch(initiateRefundWatcher(payload, resolve, reject));
          })
            .then((response) => {
              success += 1;
              let status = {
                loan_id: loanId,
                status: 'Initiated',
                info: response.response?.data?.message || "Refund initiated succesfully"
              }
              setLoanStatus(prevoius => [
                ...prevoius,
                status
              ])
            })
            .catch((error) => {
              failed += 1;
              let status = {
                loan_id: loanId,
                status: 'Failed',
                info: error?.response?.data?.message
              }
              setLoanStatus(prevoius => [
                ...prevoius,
                status
              ])
            })
        } else {
          failed += 1;
          let status = {
            loan_id: loanId,
            status: 'Failed',
            info: `Loan is already ${customStatus(matchingLoan.status)}`
          }
          setLoanStatus(prevoius => [
            ...prevoius,
            status
          ])
        }
      setSuccessCount(success);
      setFailedCount(failed)
    }
  }; 

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setIsDisburstOpen(!isModalVisible);
    setIsOpen(isModalVisible);
  };

  const windowOnClick = (event) => {
    if (event.target === modalRef.current) {
      toggleModal();
    }
  }; 

  return (
    <>
      
      {isModalVisible && (
        <FormPopUp
        heading={"Refund Progress"}
        isOpen={isDisburstOpen}
        onClose={handleClose}
        customStyles={{
          width: "70%",
          minHeight: "50%",
          maxHeight: "100%",
          display: "flex",
          flexDirection: "column",
          float: "right",
        }}>
        <div onClick={windowOnClick}>
            <table className="ir-status-table">
              {refundStatus.map((status, index) => (
                <tr key={index}>
                  <td style={{fontWeight: 'bold'}}>{status.label}</td>
                  <td>{status.value}</td>
                </tr>
              ))}
            </table>
            <div className="ir-wrapper">
            <table className="ir-model-table">
              <thead>
                <tr className="ir-model-table-head">
                  <th>Loan ID</th>
                  <th>Status</th>
                  <th>Info</th>
                </tr>
              </thead>
              <tbody>
              {loanStatus.map((status) => (
                <tr key={status.loan_id} className="ir-model-table-body">
                  <td>{status.loan_id}</td>
                  <td>{status.status}</td>
                  <td>{status.info}</td>
                </tr>
              ))}
              </tbody>
            </table>
            </div>
        </div>
        </FormPopUp>
      )}
     
     {!isModalVisible && (
      <FormPopUp
        heading={"Initiate Refund"}
        isOpen={isopen}
        onClose={handleClose}
        customStyles={{
          position: "fixed",
          width: "30%",
          height: "100%",
          maxHeight: "100%",
          marginLeft: "35%",
          paddingTop: "2%",
          display: "flex",
          flexDirection: "column",
          float: "right",
        }}
      >
        <div
          style={{
            color: "var(--neutrals-neutral-60, #767888)",
            fontFamily: "Montserrat-Medium",
            fontSize: "18px",
            fontStyle: "normal",
            marginTop: "5%",
            fontWeight: "500",
            lineHeight: "150%",
          }}
        >
          Enter loan ID’s for refund initiation process, you can enter
          multiple loan ID’s.
        </div>

        <div
          className="input-tag"
          style={{ marginTop: "10%", height: "25vh", overflowY: "auto" }}
        >
          <ul className="input-tag__tags">
          {remarks.map((tag, i) => (
              <li key={tag}>
                {tag}
                <button type="button" onClick={() => removeTag(i)}>
                  +
                </button>
              </li>
            ))}
            <li className="input-tag__tags__input">
             
                <textarea
                  rows={3}
                  placeholder={remarks.length === 0 ? "Enter Loan ID*" : ""}
                  onKeyDown={inputKeyDown}
                  style={{border:"none",marginTop:"15px",marginRight:"55%",resize:"none",overflow:"hidden",width:"100%",height:"100%"}}
                />
                
             
            </li>
          </ul>
        </div>

        <div
          style={{
            width: "90%",
            display: "flex",
            bottom: "4vh",
            position: "absolute",
          }}
        >
          <Button
            id="cancel"
            label="Cancel"
            buttonType="secondary"
            onClick={handleClose}
            customStyle={{
              width: "49%",
              marginRight: "2%",
              color: "rgb(71, 91, 216)",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #475BD8",
              backgroundColor: "white",
              boxShadow: "none",
            }}
          />
          <Button
            id="submit"
            label="Submit"
            buttonType="secondary"
            onClick={handleSubmit}
            isDisabled={isDisabled}
            customStyle={{
              borderRadius: "8px",
              width: "49%",
              fontSize: "16px",
              backgroundColor: isDisabled ? "#E5E5E8" : "#475BD8",
              color: isDisabled ? "#C0C1C8" : "#FFFFFF",
            }}
          />
        </div>
      </FormPopUp>
     )}
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
    </>
  );
}

import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button/Button";
import { useHistory, useLocation } from "react-router-dom";
import { repaymentScheduleFormPostWatcher } from "../../actions/repaymentSchedule";
import { AlertBox } from "../../components/AlertBox";
import Box from "@mui/material/Box";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import "react-sdk/dist/styles/_fonts.scss"

export default function RepaymentScheduleDemographics(props) {
  const { openPopup, setOpenPopup, data } = props;
  const history = useHistory();
  const [repaymentScheduleJson, setRepaymentScheduleJson] = useState("");
  const [loanId, setLoanId] = useState(data?.loan_id);
  const [borrowerId, setBorrowerId] = useState(data?.borrower_id);
  const [partnerLoanAppId, setPartnerAppLoanId] = useState(data?.partner_loan_app_id);
  const [partnerBorrowerId, setPartnerBorrowerId] = useState(data?.partner_borrower_id);
  const [companyId, setCompanyId] = useState("");
  const [productId, setProductId] = useState("");
  const [repaymentPopup,setRepaymentPopup]=useState(openPopup);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    setLoanId(data?.loan_id);
    setProductId(data?.product_id);
    setCompanyId(data?.company_id);
    setBorrowerId(data?.borrower_id);
    setPartnerAppLoanId(data?.partner_loan_app_id);
    setPartnerBorrowerId(data?.partner_borrower_id);
  }, [data]);


  const customStyle = {
    height: "5.5vh", width: "1005", maxWidth: "100%", paddingTop: "0.8%", marginTop: "4%",backgroundColor:"#F4F4F4",fontSize:"0.65vw"
  }
  const modalStyle = {
    width: "28%", height: "100%", maxHeight: "100%", marginLeft: "36%", paddingTop: "2%",marginRight:"1%"
  }
  const customStyle1 = {
    height: "100%", width: "100%", maxWidth: "100%", paddingTop: "0.8%",fontSize:"130%",fontFamily:"Montserrat-Regular"
  }
  const headerStyle={marginBottom:"5%", fontSize:"1.3vw",width:"26vw"}
  const isJsonString = str => {
    try {
      JSON.parse(str);
    } catch (e) {
      showAlert("Please enter valid repayment schedule json!", "error");
      return false;
    }
    return true;
  };

  const handleSubmitRepayment = () => {
    if (!isJsonString(repaymentScheduleJson)) return false;
    const postData = {
      company_id: companyId,
      product_id: productId,
      loan_id: loanId,
      partner_loan_app_id: partnerLoanAppId,
      borrower_id: borrowerId,
      partner_borrower_id: partnerBorrowerId,
      repayment_schedule_json: JSON.parse(
        repaymentScheduleJson.replace(/\n|\r/g, "")
      )
    };
    dispatch(
      repaymentScheduleFormPostWatcher(
        postData,
        result => {
          setRepaymentScheduleJson("");
          setRepaymentPopup(false);
          return showAlert(result.message, "success");
        },
        error => {
          if (error?.response?.data.message) {
            return showAlert(error.response?.data.message, "error");
          }
          const displayError = error.response?.data?.data.body.details;
          return showAlert(displayError, "error");
        }
      )
    );
  };

  const handleAlertClose = () => {
    setAlert(false);
    setAlertMessage("");
    setSeverity("");
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      if (type=="success")
      {
        handleClose();
      }
      handleAlertClose();
    }, 4000);
  };
  const handleBackToLoanQueue = () => {
    const url = "/admin/lending/loan_queue";
    history.push(url);
  };
  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      {openPopup &&repaymentPopup&& data ? (
        <FormPopup
          heading="Upload Repayment Schedule"
          open={openPopup}
          isOpen={openPopup}
          onClose={handleClose}
          customStyles={modalStyle}
          customHeaderStyle={headerStyle}
        >


          <InputBox
            label="Loan ID"
            id={'loanId'}
            isDisabled={true}
            initialValue={loanId}
            customClass={customStyle}
            customInputClass={customStyle1}

          />



          <InputBox
            label="Borrower ID"
            id={'borrowerId'}
            initialValue={borrowerId}
            isDisabled={true}
            customClass={customStyle}
            customInputClass={customStyle1}

          />
          <InputBox
            label="Partner Loan App Id"
            id={'partnerLoanAppId'}
            initialValue={partnerLoanAppId}
            isDisabled={true}
            customClass={customStyle}
            customInputClass={customStyle1}

          />
          <InputBox
            label="Partner Borrower ID"
            id={'partnerBorrowerId'}
            initialValue={partnerBorrowerId}
            isDisabled={true}
            customClass={customStyle}
            customInputClass={customStyle1}

          />
          {" "}
          <Box
            sx={{
              width: "100%",
              maxWidth: '100%',
              marginTop:"3.5%"
            }}
          >
            <TextField
              fullWidth
              id="outlined-basic"
              label="Repayment Schedule Json"
              placeholder="Enter Repayment Schedule Json"
              size="string"
              rows={15}
              multiline
              required
              autoFocus
              value={repaymentScheduleJson}
              onChange={event => {
                setRepaymentScheduleJson(event.target.value);
              }}
              inputProps={{
                style: {
                  height: "32vh", marginTop: "2%",fontFamily:"Montserrat-Regular",fontSize:"0.87vw"
                },
              }}
              InputLabelProps={{
                style: {
                  fontSize:"92%",fontFamily:"Montserrat-Regular"
                },
              }}

            />{" "}
          </Box>
          <div style={{ display: "flex", paddingTop: "2%", marginTop: "5%" }}>
            <Button
              id='cancel'
              label='Cancel'
              buttonType="secondary"
              onClick={(handleClose)}
              customStyle={{ borderRadius:"8px",width:"13.2vw",height:"4.8vh",fontSize:"0.87vw",paddingLeft:"1vh",paddingRight:"1vh",backgroundColor:"#FFF",color:"#475BD8",paddingTop:"1vh",paddingBottom:"1vh",border:"1px solid #475BD8"}}

            />
            <Button id='submit' label='Submit' buttonType='primary' onClick={handleSubmitRepayment} customStyle={{ borderRadius:"8px",width:"13.2vw",height:"4.8vh",fontSize:"0.87vw",paddingLeft:"1vh",paddingRight:"1vh",paddingTop:"1vh",paddingBottom:"1vh"}} />
          </div>
        </FormPopup>) : (
        <div></div>
      )}
    </>
  );
}
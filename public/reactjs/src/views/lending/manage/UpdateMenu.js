import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import {
  updateBankDetailsWatcher,
  updateUMRNDetailsWatcher
} from "../../../actions/borrowerInfo";
import { AlertBox } from "../../../components/AlertBox";
import { validateData } from "../../../util/validation";
import { LoanPatchUI } from "./LoanPatchUI";
import { MiscDataPatchUI } from "./MiscDataPatchUI";
import { updateStatusWatcher } from "../../../actions/colenders.js";
import { useParams } from "react-router-dom";
import { storedList } from "../../../util/localstorage";
import { checkAccessTags } from "../../../util/uam";
import axios from "axios";
import CustomInputBox from "react-sdk/dist/components/InputBox/InputBox";
import CustomFormPopup from "react-sdk/dist/components/Popup/FormPopup";
import CustomButton from "react-sdk/dist/components/Button/Button";


const inputBoxCss = {
  marginTop: "10px",
  width: "252px",
  marginLeft: "-5px",
  zIndex: 1,
}

const inputCss = {
     display:"flex",
     margin:"10px 10px 16px 10px"
}
const inputBoxCssMain ={
  marginTop: "10px",
  width: "232px",
  marginLeft: "-5px",
  zIndex: 1,
  minHeight: "60px"
}

const inputCssBankDetail = {
  height: "56px", 
  width: "337px",
 padding: "5px 15px 10px 10px", 
 maxWidth : "none"
}
const { getCbiLoansDetails } = require("../../../apis/colenders");
const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};


function MyComponent() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  return <div>ID: {id}</div>;
}


export default function UpdateMenu(props) {
  const data = props?.data;
  const [anchorEl, setAnchorEl] = useState(false);
  const [loan_id, setLoanId] = useState("");
  const [editBankDetails, setEditBankDetails] = useState(false);
  const [editNACHDetails, setEditNACHDetails] = useState(false);
  const [errors, setErrors] = useState({});
  const [openLoanPatchUi, setOpenLoanPatchUI] = useState(false);
  const [editMiscellaneousData, setEditMiscellaneousData] = useState(false);
  const [borro_bank_name, setBorro_bank_name] = useState();
  const [borro_bank_acc_num, setBorro_bank_acc_num] = useState();
  const [borro_bank_ifsc, setBorro_bank_ifsc] = useState();
  const [borro_bank_account_holder_name, setBorro_bank_account_holder_name] =
    useState();
  const [borro_bank_account_type, setBorro_bank_account_type] = useState();
  const [bene_bank_name, setBene_bank_name] = useState();
  const [bene_bank_acc_num, setBene_bank_acc_num] = useState();
  const [bene_bank_ifsc, setBene_bank_ifsc] = useState();
  const [bene_bank_account_holder_name, setBene_bank_account_holder_name] =
    useState();
  const [bene_bank_account_type, setBene_bank_account_type] = useState();
  const [umrn, setUmrn] = useState();
  const [mandate_ref_no, setMandate_ref_no] = useState();
  const [nach_amount, setNach_amount] = useState();
  const [nach_registration_status, setNach_registration_status] = useState();
  const [nach_status_desc, setNach_status_desc] = useState();
  const [nach_account_holder_name, setNach_account_holder_name] = useState();
  const [nach_account_num, setNach_account_num] = useState();
  const [nach_ifsc, setNach_ifsc] = useState();
  const [nach_start, setNach_start] = useState();
  const [nach_end, setNach_end] = useState();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const user = storedList("user");
  const [option, setOption] = useState([]);
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
        ? true
        : false
      : false;
  const dispatch = useDispatch();


  const updateNACH = () => {
    const payload = {
      company_id: data?.company_id,
      product_id: data?.product_id,
      loan_id: loan_id,
      umrn: umrn,
      mandate_ref_no,
      nach_amount,
      nach_registration_status,
      nach_status_desc,
      nach_account_holder_name,
      nach_account_num,
      nach_ifsc,
      nach_start,
      nach_end
    };
    if (!umrn) delete payload.umrn;
    if (!mandate_ref_no) delete payload.mandate_ref_no;
    if (!nach_amount) delete payload.nach_amount;
    if (!nach_registration_status) delete payload.nach_registration_status;
    if (!nach_status_desc) delete payload.nach_status_desc;
    if (!nach_account_holder_name) delete payload.nach_account_holder_name;
    if (!nach_account_num) delete payload.nach_account_num;
    if (!nach_ifsc) delete payload.nach_ifsc;
    if (!nach_start) delete payload.nach_start;
    if (!nach_end) delete payload.nach_end;


    dispatch(
      updateUMRNDetailsWatcher(
        payload,
        (result) => {
          showAlert(result.message, "success");
          location.reload();
          handleClose();
        },
        (error) => {
          showAlert(error?.response?.data?.message, "error");
        }
      )
    );
  };


  const updateClear = () => {
    setErrors({});
    setBorro_bank_name("");
    setBorro_bank_acc_num("");
    setBorro_bank_ifsc("");
    setBorro_bank_account_holder_name("");
    setBorro_bank_account_type("");
    setBene_bank_name("");
    setBene_bank_acc_num("");
    setBene_bank_ifsc("");
    setBene_bank_account_holder_name("");
    setBene_bank_account_type("");
    setUmrn("");
    setMandate_ref_no("");
    setNach_amount("");
    setNach_registration_status("");
    setNach_status_desc("");
    setNach_account_holder_name("");
    setNach_account_num("");
    setNach_ifsc("");
    setNach_start("");
    setNach_end("");
  };


  const handleInputChange = (field, validationType, setValue) => (event) => {
    const { value } = event;
    setValue(value);
    setErrors({
      ...errors,
      [field + "Error"]: !validateData(validationType, value)
    });
    if (field === "nach_ifsc") {
      setErrors({
        ...errors,
        [field + "Error"]:
          value === "" ? false : !validateData(validationType, value)
      });
    }
  };


  const updateBankDetails = () => {
    const payload = {
      company_id: data?.company_id,
      product_id: data?.product_id,
      loan_id: loan_id,
      bene_bank_name: bene_bank_name,
      bene_bank_acc_num: bene_bank_acc_num,
      bene_bank_ifsc: bene_bank_ifsc,
      bene_bank_account_holder_name: bene_bank_account_holder_name,
      bene_bank_account_type: bene_bank_account_type
    };


    let errorsObject = {};
    if (!bene_bank_name || bene_bank_name === "")
      errorsObject.bene_bank_nameError = true;
    if (!bene_bank_acc_num || bene_bank_acc_num === "")
      errorsObject.bene_bank_acc_numError = true;
    if (!bene_bank_ifsc || bene_bank_ifsc === "")
      errorsObject.bene_bank_ifscError = true;
    if (!bene_bank_account_holder_name || bene_bank_account_holder_name === "")
      errorsObject.bene_bank_account_holder_nameError = true;
    if (!bene_bank_account_type || bene_bank_account_type === "")
      errorsObject.bene_bank_account_typeError = true;


    setErrors({ ...errors, ...errorsObject });


    if (
      errorsObject.bene_bank_nameError ||
      errorsObject.bene_bank_acc_numError ||
      errorsObject.bene_bank_ifscError ||
      errorsObject.bene_bank_account_holder_nameError ||
      errorsObject.bene_bank_account_typeError
    ) {
      return showAlert("Few columns are missing", "error");
    } else if (
      bene_bank_account_type !== "Savings" &&
      bene_bank_account_type !== "Current"
    ) {
      return showAlert(
        "Incorrect enum value for field bene_bank_account_type, possible values could be Current,Savings",
        "error"
      );
    }


    if (borro_bank_name || borro_bank_name !== "")
      payload.borro_bank_name = borro_bank_name;
    if (borro_bank_acc_num || borro_bank_acc_num !== "")
      payload.borro_bank_acc_num = borro_bank_acc_num;
    if (borro_bank_ifsc || borro_bank_ifsc !== "")
      payload.borro_bank_ifsc = borro_bank_ifsc;
    if (borro_bank_account_type || borro_bank_account_type !== "")
      payload.borro_bank_account_type = borro_bank_account_type;
    if (borro_bank_account_holder_name || borro_bank_account_holder_name !== "")
      payload.borro_bank_account_holder_name = borro_bank_account_holder_name;


    dispatch(
      updateBankDetailsWatcher(
        payload,
        (result) => {
          showAlert(result.message, "success");
          location.reload();
          handleClose();
        },
        (error) => {
          showAlert(error?.response?.data?.message, "error");
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
      handleAlertClose();
    }, 3000);
  };


  const handleClick = (event) => {
    setLoanId(data?.loan_id);
    setBorro_bank_name(data?.borro_bank_name);
    setBorro_bank_acc_num(data?.borro_bank_acc_num);
    setBorro_bank_ifsc(data?.borro_bank_ifsc);
    setBorro_bank_account_holder_name(data?.borro_bank_account_holder_name);
    setBorro_bank_account_type(data?.borro_bank_account_type);
    setBene_bank_name(data?.bene_bank_name);
    setBene_bank_acc_num(data?.bene_bank_acc_num);
    setBene_bank_ifsc(data?.bene_bank_ifsc);
    setBene_bank_account_holder_name(data?.bene_bank_account_holder_name);
    setBene_bank_account_type(data?.bene_bank_account_type);
    setUmrn(data?.umrn);
    setMandate_ref_no(data?.mandate_ref_no);
    setNach_amount(data?.nach_amount);
    setNach_registration_status(data?.nach_registration_status);
    setNach_status_desc(data?.nach_status_desc);
    setNach_account_holder_name(data?.nach_account_holder_name);
    setNach_account_num(data?.nach_account_num);
    setNach_ifsc(data?.nach_ifsc);
    setNach_start(data?.nach_start);
    setNach_end(data?.nach_end);
    setAnchorEl(event.currentTarget);
  };


  const handleCLoseLoanPatchUi = () => {
    setOpenLoanPatchUI(false);
  };


  const handleCloseMiscDataPatchUi = () => {
    setEditMiscellaneousData(false);
    location.reload();
  };


  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl(false);
    setEditNACHDetails(false);
    setEditBankDetails(false);
    setEditMiscellaneousData(false);
    setErrors({});
  };
  useEffect(() => {
    if (data) {
      if (data.stage <= 2 || data.stage === 211 || data.stage === 212) {
        setOption(prevArray => [...prevArray, { "label": "Bank details", "value": "Bank details" }]);
      }
      if (data.stage <= 4 || data.stage === 31 || data.stage === 32 || data.stage === 211 || data.stage === 212) {
        setOption(prevArray => [...prevArray, { "label": "NACH", "value": "NACH" }]);
      }
      if (data.stage <= 2) {
        setOption(prevArray => [...prevArray, { "label": "Update loan details", "value": "Update loan details" }]);
      }
      if (data.stage <= 2) {
        setOption(prevArray => [...prevArray, { "label": "Update miscellaneous data", "value": "Update miscellaneous data" }]);
      }
    }
  }, [data]);

  const [openPopup, setOpenPopup] = useState(true);
  const handleCLose = () => {
    openPopup ? setOpenPopup(false) : setOpenPopup(true);
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
      {openLoanPatchUi ? (
        <>
          <LoanPatchUI
            open={openLoanPatchUi}
            handleClose={handleCLoseLoanPatchUi}
            data={data}
            showAlert={showAlert}
          />
        </>
      ) : null}
      {
        editBankDetails && openPopup ?
          (
            <CustomFormPopup onClose={handleCLose} heading="Update bank details" isOpen={openPopup} customStyles={{width: "fit-content", display: "flex", flexDirection: "column" , height: "fit-content"}}>
           <div style={{
             display: "grid",
             gridTemplateColumns: "repeat(4, 1fr)",
             width:"fit-content",
             marginLeft:"-0.625rem",
             marginTop:"14px",
             marginRight: "5px"
	           }} >
                     <div style={inputCss}>
                <CustomInputBox
                        initialValue={loan_id}
                        label="Loan id"
                        key = "Loan id"
                        onClick={
                          (event) => {
                            setLoanId(event.value);
                          }
                        }
                        isDrawdown={false}
                        customDropdownClass={inputBoxCss}
                      customClass= {inputCssBankDetail}
                        />
                </div>
                <div 
                      style={inputCss}
	                      >             <CustomInputBox
                    key = "Borrower bank name empty"

                    initialValue={borro_bank_name}
                    label="Borrower bank name"
                    onClick={
                      handleInputChange(
                        "borro_bank_name",
                        "string",
                        setBorro_bank_name
                      )
                    }
                    isDrawdown={false}
                    customDropdownClass={inputBoxCss}
                  customClass= {inputCssBankDetail}
                    />
                </div>
                <div 
                      style={inputCss}
	                      >
                <CustomInputBox
                                  key = "Borrower bank acc num empty"
                                  initialValue={borro_bank_acc_num}
                                  label="Borrower bank acc num"
                                  onClick={
                                    handleInputChange(
                                      "borro_bank_acc_num",
                                      "number",
                                      setBorro_bank_acc_num
                                    )
                                  }
                                  isDrawdown={false}
                                  customDropdownClass={inputBoxCss}
                                customClass= {inputCssBankDetail}
                                  />


                </div>
                <div 
                      style={inputCss}
	                      >
                <CustomInputBox
                 key = "borrower bank ifsc empty"
                 initialValue={borro_bank_ifsc}
                 label="borrower bank ifsc"
                 error={errors?.borro_bank_ifscError}
                 helperText="Please enter valid borro_bank_ifsc"
                 onClick={
                   handleInputChange(
                     "borro_bank_ifsc",
                     "ifsc",
                     setBorro_bank_ifsc
                   )
                 }
                 isDrawdown={false}
                 customDropdownClass={inputBoxCss}
                customClass= {inputCssBankDetail}
                 />


                </div>
                <div 
                      style={inputCss}
	                      >
                                   <CustomInputBox
                                   key ="borrower bank account holder name empty"
                                   initialValue={borro_bank_account_holder_name}
                                   label="borrower bank account holder name"
                                   onClick={
                                     handleInputChange(
                                       "borro_bank_account_holder_name",
                                       "string",
                                       setBorro_bank_account_holder_name
                                     )
                                   }
                                   isDrawdown={false}
                                   customDropdownClass={inputBoxCss}
                                  customClass= {inputCssBankDetail}
                                 />
                </div>
                <div 
                      style={inputCss}
	                      >
                                   <CustomInputBox
                                   key ="borrower bank account type empty"
                                   initialValue={borro_bank_account_type}
                                   label="borrower bank account type"
                                   onClick={
                                     handleInputChange(
                                       "borro_bank_account_type",
                                       "string",
                                       setBorro_bank_account_type
                                     )
                                   }
                                   isDrawdown={false}
                                   customDropdownClass={inputBoxCss}
                                  customClass= {inputCssBankDetail}
                                 />

                </div>
                <div 
                      style={inputCss}
	                      >
                                 <CustomInputBox
                                 key = "beneficiary bank name empty"
                                 initialValue={bene_bank_name}
                                 label="beneficiary bank name"
                                 error={errors?.bene_bank_nameError}
                                 helperText="Please enter valid bene_bank_name"
                                 onClick={
                                   handleInputChange(
                                     "bene_bank_name",
                                     "string",
                                     setBene_bank_name
                                   )
                                 }
                                 isDrawdown={false}
                                 customDropdownClass={inputBoxCss}
                                customClass= {inputCssBankDetail}
                               />

                </div>
                <div 
                      style={inputCss}
	                      >
                                    <CustomInputBox
                                    key = "beneficiary bank acc num empty"
                                    initialValue={bene_bank_acc_num}
                                    label="beneficiary bank acc num"
                                    error={errors?.bene_bank_acc_numError}
                                    helperText="Please enter valid bene_bank_acc_num"
                                    onClick={
                                      handleInputChange(
                                        "bene_bank_acc_num",
                                        "string",
                                        setBene_bank_acc_num
                                      )
                                    }
                                    isDrawdown={false}
                                    customDropdownClass={inputBoxCss}
                                  customClass= {inputCssBankDetail}
                                  />


                </div>
             
              
                <div 
                      style={inputCss}
	                      >
                 <CustomInputBox
                 key = "beneficiary bank ifsc empty"
                    initialValue={bene_bank_ifsc}
                    label="beneficiary bank ifsc"
                    error={errors?.bene_bank_ifscError}
                    helperText="Please enter valid bene_bank_ifsc"
                    onClick={
                      handleInputChange(
                        "bene_bank_ifsc",
                        "ifsc",
                        setBene_bank_ifsc
                      )
                    }
                    isDrawdown={false}
                    customDropdownClass={inputBoxCss}
                  customClass= {inputCssBankDetail}                  />

                </div>
                <div 
                      style={inputCss}
	                      >
                                 <CustomInputBox
                                 key= "beneficiary bank account holder name emptyy"
                                 initialValue={bene_bank_account_holder_name}
                                 label="beneficiary bank account holder name"
                                 error={errors?.bene_bank_account_holder_nameError}
                                 helperText="Please enter valid bene_bank_account_holder_name"
                                 onClick={
                                   handleInputChange(
                                     "bene_bank_account_holder_name",
                                     "string",
                                     setBene_bank_account_holder_name
                                   )
                                 }
                                 isDrawdown={false}
                                 customDropdownClass={inputBoxCss}
                                customClass= {inputCssBankDetail}                               />
                </div>
                <div 
                      style={inputCss}
	                      >
                                   <CustomInputBox
                                   key= "beneficiary bank account type empty"
                                   initialValue={bene_bank_account_type}
                                   label="beneficiary bank account type"
                                   error={errors?.bene_bank_account_typeError}
                                   helperText="Please enter valid bene_bank_account_type"
                                   onClick={
                                     handleInputChange(
                                       "bene_bank_account_type",
                                       "string",
                                       setBene_bank_account_type
                                     )
                                   }
                                   isDrawdown={false}
                                   customDropdownClass={inputBoxCss}
                                  customClass= {inputCssBankDetail}
                                 />
 
                </div>
            


              </div>
              <div style={{ display: "flex", marginLeft: "0px", marginTop: "30px", justifyContent:"flex-end", width: "100%" }}>
               <div style={{flexDirection: "row", display: "flex"}}>
               <CustomButton label="Update" buttonType="primary" customStyle={{ height: "42px", fontSize: "14px", padding: "8px", width: "85px" }} onClick={updateBankDetails} />
                <CustomButton label="Clear" buttonType="secondary" customStyle={{ color: "red", border: "1px solid red", height: "42px", fontSize: "14px", fontWeight: "600", padding: "8px", width: "85px", marginRight: "15px" }} onClick={updateClear} />
               </div>


              </div>
            </CustomFormPopup>
          ) : null}




      {editNACHDetails && openPopup ? (
        
        <CustomFormPopup onClose={handleCLose} heading="Update bank details" isOpen={openPopup} customStyles={{width: "fit-content", display: "flex", flexDirection: "column" , height: "fit-content"}}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          width:"fit-content",
          marginLeft:"-0.625rem",
          marginTop:"14px"
          }} >
                     <div style={inputCss}>
              
              <CustomInputBox
              key = "UMRN empty"
              initialValue={umrn}
              label="UMRN"
              onClick={(event) => setUmrn(event.value)}
              isDrawdown={false}
              customDropdownClass={inputBoxCss}
              customClass= {inputCssBankDetail}            />
            </div>
            <div style={inputCss}>

              <CustomInputBox
              key = "Mandate ref no empty"
              initialValue={mandate_ref_no}
              label="Mandate ref no"
              onClick={(event) => setMandate_ref_no(event.value)}
              isDrawdown={false}
              customDropdownClass={inputBoxCss}
              customClass= {inputCssBankDetail}            />
                 </div>
                 <div style={inputCss}>
              <CustomInputBox
              key = "Nach amount empty"
              initialValue={nach_amount}
              label="Nach amount"
              error={errors?.nach_amountError}
              helperText="Please enter valid nach_amount"
              onClick={handleInputChange(
                "nach_amount",
                "float",
                setNach_amount
              )}
              isDrawdown={false}
              customDropdownClass={inputBoxCss}
              customClass= {inputCssBankDetail}            />
                                 </div>
                                 <div style={inputCss}>

              <CustomInputBox
              initialValue={nach_registration_status}
              key ="Nach registration status empty"
              label="Nach registration status"
              onClick={(event) =>
                setNach_registration_status(event.value)}
              isDrawdown={false}
              customDropdownClass={inputBoxCss}
              customClass= {inputCssBankDetail}            />
                </div>

                <div style={inputCss}>              
              <CustomInputBox
              initialValue={nach_status_desc}
              key = "nach status desc empty" 
              label="nach status desc"
              onClick={(event) => setNach_status_desc(event.value)}
              isDrawdown={false}
              customDropdownClass={inputBoxCss}
              customClass= {inputCssBankDetail}            />
            </div>
            <div style={inputCss}>

              <CustomInputBox
              key = "Nach account holder name empty"
              initialValue={nach_account_holder_name}
              label="Nach account holder name"
              onClick={(event) =>
                setNach_account_holder_name(event.value)
              }
              isDrawdown={false}
              customDropdownClass={inputBoxCss}
              customClass= {inputCssBankDetail}            />
              </div>
    
              <div style={inputCss}>

              <CustomInputBox
              initialValue={nach_account_num}
              key = "Nach account num empty"
              label="Nach account num"
              onClick={(event) => setNach_account_num(event.value)}
              isDrawdown={false}
              customDropdownClass={inputBoxCss}
              customClass= {inputCssBankDetail}            />
              </div>
              <div style={inputCss}>

              <CustomInputBox
              initialValue={nach_ifsc}
              key = "Nach ifsc empty"
              label="Nach ifsc"
              error={errors?.nach_ifscError}
              helperText="Please enter valid nach_ifsc"
              onClick={handleInputChange(
                "nach_ifsc",
                "ifsc",
                setNach_ifsc
              )}
              isDrawdown={false}
              customDropdownClass={inputBoxCss}
              customClass= {inputCssBankDetail}            />
              
    
                
              </div>
              <div style={inputCss}>
              
              <CustomInputBox
              key = "Nach start start"
              initialValue={nach_start}
              label="Nach start"
              error={errors?.nach_startError}
              helperText="Please enter valid nach_start"
              onClick={handleInputChange(
                "nach_start",
                "date",
                setNach_start
              )}
              isDrawdown={false}
              customDropdownClass={inputBoxCss}
              customClass= {inputCssBankDetail}            />
            </div>
            <div style={inputCss}>

              <CustomInputBox
              key = "Nach end empty"
              initialValue={nach_end}
              label="Nach end"
              error={errors?.nach_endError}
              helperText="Please enter valid nach_end"
              onClick={handleInputChange("nach_end", "date", setNach_end)}
              isDrawdown={false}
              customDropdownClass={inputBoxCss}
              customClass= {inputCssBankDetail}            />
          
                
              </div>
            

              </div>
              <div style={{ display: "flex", marginLeft: "0px", marginTop: "30px", justifyContent:"flex-end", width: "100%" }}>
               <div style={{flexDirection: "row", display: "flex"}}>
               <CustomButton label="Update" buttonType="primary" customStyle={{ height: "42px", fontSize: "14px", padding: "8px", width: "85px" }} onClick={updateNACH} />
            <CustomButton label="Clear" buttonType="secondary" customStyle={{ color: "red", border: "1px solid red", height: "42px", fontSize: "14px", fontWeight: "600", padding: "8px", width: "85px" ,marginRight: "15px"}} onClick={updateClear} />
               </div>
               </div>
        </CustomFormPopup>
      ) : null}


      {editMiscellaneousData ? (
        <>
          <MiscDataPatchUI
            open={editMiscellaneousData}
            handleClose={handleCloseMiscDataPatchUi}
            data={data}
            showAlert={showAlert}
          />
        </>
      ) : null}
      {checkAccessTags([
        "tag_loan_details_read_write",
        "tag_loan_queue_read_write",
        "tag_loan_details_btn_update"
      ]) ? (
        <div>
          <CustomInputBox
            label="Update"
            options={option}
            onClick={(event) => {
              handleClick(event);
              if (event.value === "Bank details") {
                setOpenPopup(true);
                setEditNACHDetails(false);
                setEditBankDetails(true);
                setOpenLoanPatchUI(false);
                setEditMiscellaneousData(false);
              }
              if (event.value === "NACH") {
                setOpenPopup(true);
                setEditNACHDetails(true);
                setEditBankDetails(false);
                setOpenLoanPatchUI(false);
                setEditMiscellaneousData(false);
              }
              if (event.value === "Update loan details") {
                setEditNACHDetails(false);
                setEditBankDetails(false);
                setOpenLoanPatchUI(true);
                setEditMiscellaneousData(false);
              }
              if (event.value === "Update miscellaneous data") {
                setEditNACHDetails(false);
                setEditBankDetails(false);
                setOpenLoanPatchUI(false);
                setEditMiscellaneousData(true);
              }
            }}
            isDrawdown={true}
            customDropdownClass={option.length === 1 ?  inputBoxCssMain : inputBoxCss}
            customClass={{ height: "50px", width: "140px", marginRight: "8px", padding: "5px 15px 10px 10px" }}
          />


          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button"
            }}
            anchorEl={anchorEl}
            open={anchorEl}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            {data.stage <= 2 || data.stage === 211 || data.stage === 212 ? (
              <MenuItem
                onClick={() => {
                  setEditNACHDetails(false);
                  setEditBankDetails(true);
                  setOpenLoanPatchUI(false);
                  setEditMiscellaneousData(false);
                }}
              >
                Bank details
              </MenuItem>
            ) : null}
            {data.stage <= 4 || data.stage === 31 || data.stage === 32 || data.stage === 211 || data.stage === 212 ? (
              <MenuItem
                onClick={() => {
                  setEditNACHDetails(true);
                  setEditBankDetails(false);
                  setOpenLoanPatchUI(false);
                  setEditMiscellaneousData(false);
                }}
              >
                NACH
              </MenuItem>
            ) : null}
            {data.stage <= 2 ? (
              <MenuItem
                onClick={() => {
                  setEditNACHDetails(false);
                  setEditBankDetails(false);
                  setOpenLoanPatchUI(true);
                  setEditMiscellaneousData(false);
                }}
              >
                Update loan details
              </MenuItem>
            ) : null}
            {data.stage <= 2 ? (
              <MenuItem
                onClick={() => {
                  setEditNACHDetails(false);
                  setEditBankDetails(false);
                  setOpenLoanPatchUI(false);
                  setEditMiscellaneousData(true);
                }}
              >
                Update miscellaneous data
              </MenuItem>
            ) : null}
          </Menu>
        </div>
      ) : null}
    </>
  );
}




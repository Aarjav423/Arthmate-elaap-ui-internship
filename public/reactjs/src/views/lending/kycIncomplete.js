import * as React from "react";
import { useParams, useHistory } from "react-router-dom";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { AlertBox } from "../../components/AlertBox";
import { styled } from "@material-ui/core/styles";
import moment from "moment";
import { useState, useEffect } from "react";
import { storedList } from "../../util/localstorage";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getLeadDataByLoanIdWatcher, updateLeadDataByLoanIdWatcher } from "../../actions/loanRequest"
import Slide from '@mui/material/Slide';
import {
  updateBorrowerInfoCommonUncommonWatcher
} from "../../actions/borrowerInfo";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button/Button";
import "react-sdk/dist/styles/_fonts.scss";

const user = storedList("user");

const reasonCode = [
  {
    id: 'K01',
    label: 'Correct Document',
  },
  {
    id: 'K02',
    label: 'Incorrect Document',
  },
  {
    id: 'K03',
    label: 'Incorrect Pan',
  },
  {
    id: 'K04',
    label: 'Incorrect Aadhaar',
  },
];

export default function KycIncompleteScreen(props) {
  const params = useParams();
  const defaultErrors = {
    pan_numberError: false,
    aadhaar_numberError: false,
    aadhaar_pincodeError: false,
    aadhaarDobError: false,
    panDobError: false
  };

  const history = useHistory();
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#5e72e4",
      color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      color: theme.palette.common.black,
    },
  }));

  const user = storedList("user");
  const [alert, setAlert] = useState(false);
  const [documentQueue, setDocumentQueue] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [errors, setErrors] = useState(defaultErrors)
  const [panDob, setPanDob] = useState("")
  const [aadhaarDOB, setAadhaarDob] = useState("")
  const [isCkyc, setIsCkyc] = useState('')
  const [pan_number, set_pan_number] = useState('')
  const [pan_father_middle_name, set_pan_father_middle_name] = useState('')
  const [pan_first_name, set_pan_first_name] = useState('')
  const [pan_last_name, set_pan_last_name] = useState('')
  const [pan_middle_name, set_pan_middle_name] = useState('')
  const [pan_father_name, set_pan_father_name] = useState('')
  const [pan_father_last_name, set_pan_father_last_name] = useState('')
  const [aadhaar_number, set_aadhaar_number] = useState('')
  const [aadhaar_first_name, set_aadhaar_first_name] = useState('')
  const [aadhaar_last_name, set_aadhaar_last_name] = useState('')
  const [aadhaar_middle_name, set_aadhaar_middle_name] = useState('')
  const [aadhaar_pincode, set_aadhaar_pincode] = useState('')
  const [leadData, setLeadData] = useState('')
  const [checkForManual, setCheckForMAnual] = useState("")
  const [open, setOpen] = useState(false);
  const [reuploadOpen, setReuploadOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [reuploadDocuments, setReuploadDocuments] = useState({ pan: false, aadhaar: false })
  const [aadhaarCheckBox, setAadhaarCheckBox] = useState(false)
  const [panCheckBox, setPanCheckBox] = useState(false)
  const [reason, setReason] = useState("");
  const [selectReasonComment, setSelectReasonComment] = useState("");
  const [kycDetail, setKycDetails] = useState({
    pan_number: pan_number,
    pan_dob: panDob,
    pan_first_name: pan_father_middle_name,
    pan_last_name: pan_last_name,
    pan_middle_name: pan_middle_name,
    pan_father_name: pan_father_name,
    pan_father_middle_name: pan_father_middle_name,
    pan_father_last_name: pan_father_last_name,
    aadhaar_number: aadhaar_number,
    aadhaar_dob: aadhaarDOB,
    aadhaar_first_name: aadhaar_first_name,
    aadhaar_last_name: aadhaar_last_name,
    aadhaar_middle_name: aadhaar_middle_name,
    aadhaar_pincode: aadhaar_pincode,
    isCkyc: ""
  })
  const [kycRejectBody, setKycRejectBody] = useState({
    partner_loan_app_id: "",
    partner_borrower_id: "",
    loan_app_id: "",
    borrower_id: "",
    status: "",
    reason: "",
    remarks: "",
    company_id: "",
    product_id: "",
    loan_id: ""
  })

  const dispatch = useDispatch();
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      setAlert(false);
      closePopupHandler();
      props.reSearchFilter()
      //window.location.reload();
    }, 2500);
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  useEffect(() => {
    fetchLeadData()
  }, [])

  const fetchLeadData = () => {
    const payload = {
      company_id: props.row_data.company_id,
      product_id: props.row_data.product_id,
      loan_id: props.row_data.loan_id
    };

    new Promise((resolve, reject) => {
      dispatch(getLeadDataByLoanIdWatcher(payload, resolve, reject));
    })
      .then((response) => {
        const data = response.data[0]
        verificationButtons(data.compliances)
        setLeadData(data)
        setCheckForMAnual(data?.compliances?.manual_kyc)
        setAadhaarDob(data?.aadhaar_dob)
        set_aadhaar_first_name(data?.aadhaar_fname)
        set_aadhaar_last_name(data?.aadhaar_lname)
        set_aadhaar_middle_name(data?.aadhaar_mname)
        set_aadhaar_number(data?.parsed_aadhaar_number)
        set_aadhaar_pincode(data?.aadhaar_pincode)
        setPanDob(data?.pan_dob)
        set_pan_number(data?.parsed_pan_number)
        set_pan_father_last_name(data?.pan_father_lname)
        set_pan_father_middle_name(data?.pan_father_mname)
        set_pan_first_name(data?.pan_fname)
        set_pan_last_name(data?.pan_lname)
        set_pan_father_name(data?.pan_father_fname)
        set_pan_middle_name(data?.pan_mname)

      })
      .catch((error) => {
        showAlert(error.response.data.message, "error")
      });
  };

  useEffect(() => {
    kycDetail.aadhaar_dob = leadData?.aadhaar_dob
    kycDetail.aadhaar_first_name = leadData?.aadhaar_fname
    kycDetail.aadhaar_last_name = leadData?.aadhaar_lname
    kycDetail.aadhaar_middle_name = leadData?.aadhaar_mname
    kycDetail.aadhaar_number = leadData?.parsed_aadhaar_number
    kycDetail.aadhaar_pincode = leadData?.aadhaar_pincode

    kycDetail.pan_first_name = leadData?.pan_fname
    kycDetail.pan_middle_name = leadData?.pan_mname
    kycDetail.pan_last_name = leadData?.pan_lname
    kycDetail.pan_dob = leadData?.pan_dob
    kycDetail.pan_father_name = leadData?.pan_father_fname
    kycDetail.pan_father_middle_name = leadData?.pan_father_mname
    kycDetail.pan_father_last_name = leadData?.pan_father_lname
    kycDetail.pan_number = leadData?.parsed_pan_number

  }, [leadData])


  const handleClear = () => {

    setAadhaarDob("")
    set_aadhaar_first_name("")
    set_aadhaar_last_name("")
    set_aadhaar_middle_name("")
    set_aadhaar_number("")
    set_aadhaar_pincode("")

    kycDetail.aadhaar_dob = ""
    kycDetail.aadhaar_first_name = ""
    kycDetail.aadhaar_last_name = ""
    kycDetail.aadhaar_middle_name = ""
    kycDetail.aadhaar_number = ""
    kycDetail.aadhaar_pincode = ""


    setPanDob('')
    set_pan_number("")
    set_pan_father_last_name("")
    set_pan_father_middle_name("")
    set_pan_first_name("")
    set_pan_last_name("")
    set_pan_father_name("")
    set_pan_middle_name("")


    kycDetail.pan_dob = ""
    kycDetail.pan_father_last_name = ""
    kycDetail.pan_father_middle_name = ""
    kycDetail.pan_first_name = ""
    kycDetail.pan_last_name = ""
    kycDetail.pan_middle_name = ""
    kycDetail.pan_number = ""

  }

  const verificationButtons = (data) => {
    let respArray = [
      {
        name: "ckyc_search",
        value: data?.ckyc_search || "NA",
        label: "CKYC Search"
      },
      {
        name: "ckyc_match",
        value: data?.ckyc_match || "NA",
        label: "CKYC Match"
      },
      {
        name: "aadhaar_match",
        value: data?.aadhaar_match || "NA",
        label: "Aadhaar Match"
      },
      {
        name: "aadhaar_verified",
        value: data?.aadhaar_verified || "NA",
        label: "Aadhaar Verified"
      },
      {
        name: "pan_match",
        value: data?.pan_match || "NA",
        label: "Pan Match"
      },
      {
        name: "pan_verified",
        value: data?.pan_verified || "NA",
        label: "Pan Verified"
      }
    ];
    setDocumentQueue(respArray)
  }



  const handleOnChange = async (value, label) => {

    if (label == 'pan_number') {
      kycDetail.pan_number = value
      set_pan_number(value)
      if (value) {
        let regex = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
        const isValidated = regex.test(value);
        setErrors({
          ...errors,
          [label + "Error"]: !isValidated,
        });
      } else {
        setErrors({
          ...errors,
          [label + "Error"]: false,
        });
      }

    } else if (label == 'aadhaar_number') {
      kycDetail.aadhaar_number = value
      set_aadhaar_number(value)
      if (value) {
        let regex = new RegExp(/^[0-9X]{8}[0-9]{4}$/);
        let isValidated = regex.test(value);
        setErrors({
          ...errors,
          [label + "Error"]: !isValidated,
        });
      } else {
        setErrors({
          ...errors,
          [label + "Error"]: false,
        });
      }
    } else if (label == 'panDob') {
      kycDetail.pan_dob = moment(value).format('YYYY-MM-DD')
      if (value) {
        setErrors({
          ...errors,
          [label + "Error"]: false,
        });
      }
    } else if (label == 'aadhaarDob') {
      kycDetail.aadhaar_dob = moment(value).format('YYYY-MM-DD')
      if (value) {
        setErrors({
          ...errors,
          [label + "Error"]: false,
        });
      }
    } else if (label == 'aadhaar_pincode') {
      set_aadhaar_pincode(value)
      kycDetail.aadhaar_pincode = value
      if (value) {
        let regex = new RegExp(/^\d{6}$/);
        const isValidated = regex.test(value);
        setErrors({
          ...errors,
          [label + "Error"]: !isValidated,
        });
      } else {
        setErrors({
          ...errors,
          [label + "Error"]: false,
        });
      }
    } else if (label == "is_ckyc") {
      setEnableSubmit(true)
      setIsCkyc(value)
      kycDetail.isCkyc = value
    } else if (label == "selectReason") {
      setReason(value)
    } else if (label == "selectReasonComment") {
      setSelectReasonComment(value)
    } else {
      value = value.replace(/[^A-Za-z]/gi, "");

      if (label == "aadhaar_first_name") {
        set_aadhaar_first_name(value)
        kycDetail.aadhaar_first_name = value
      } else if (label == "aadhaar_last_name") {
        set_aadhaar_last_name(value)
        kycDetail.aadhaar_last_name = value
      } else if (label == "aadhaar_middle_name") {
        set_aadhaar_middle_name(value)
        kycDetail.aadhaar_middle_name = value
      }
      else if (label == "pan_first_name") {
        set_pan_first_name(value)
        kycDetail.pan_first_name = value
      } else if (label == "pan_last_name") {
        set_pan_last_name(value)
        kycDetail.pan_last_name = value
      } else if (label == "pan_middle_name") {
        set_pan_middle_name(value)
        kycDetail.pan_middle_name = value
      }
      else if (label == "pan_father_name") {
        set_pan_father_name(value)
        kycDetail.pan_father_name = value
      } else if (label == "pan_father_middle_name") {
        set_pan_father_middle_name(value)
        kycDetail.pan_father_middle_name = value
      } else if (label == "pan_father_last_name") {
        set_pan_father_last_name(value)
        kycDetail.pan_father_last_name = value
      }

    }
  }


  const handleSubmit = () => {
    let checkError = false
    for (let key in errors) {
      if (errors[key] == true) {
        checkError = true
      }
    }

    if (checkError) {
      showAlert("Please input a valid data", "error")
    } else if (kycDetail.isCkyc == '') {
      showAlert("Please select the appropriate ckyc option", "error")
    }
    else {
      setOpen(true);
    }
  }



  const handleClose = (value) => {
    if (value == "yes") {
      kycDetail.company_id = props.row_data.company_id
      kycDetail.partner_loan_app_id = props.row_data.partner_loan_app_id
      kycDetail.product_id = props.row_data.product_id
      kycDetail.loan_id = props.row_data.loan_id
      kycDetail.reason = reason
      kycDetail.comment = selectReasonComment
      new Promise((resolve, reject) => {
        dispatch(updateLeadDataByLoanIdWatcher(kycDetail, resolve, reject));
      })
        .then((response) => {
          setApproveOpen(false);
          showAlert(response.message, "success")
        })
        .catch((error) => {
          setApproveOpen(false);
          showAlert(error.response.data.message, "error");
        });
    }
    else if (value == "reject") {
      kycRejectBody.partner_loan_app_id = props.row_data.partner_loan_app_id
      kycRejectBody.partner_borrower_id = props.row_data.partner_borrower_id
      kycRejectBody.loan_app_id = props.row_data.loan_app_id
      kycRejectBody.borrower_id = props.row_data.borrower_id
      kycRejectBody.status = "rejected"
      kycRejectBody.reason = reason.id
      kycRejectBody.remarks = selectReasonComment !== "" ? selectReasonComment : reason.label
      kycRejectBody.company_id = props.row_data.company_id
      kycRejectBody.product_id = props.row_data.product_id
      kycRejectBody.loan_id = props.row_data.loan_id
      new Promise((resolve, reject) => {
        dispatch(updateBorrowerInfoCommonUncommonWatcher(kycRejectBody, resolve, reject));
      })
        .then((response) => {
          setRejectOpen(false);
          showAlert(response.message, "success")
        })
        .catch((error) => {
          setReuploadOpen(false);
          setApproveOpen(false);
          setRejectOpen(false);
          setOpen(false);
          if (error.response?.data?.message) {
            showAlert(error.response.data.message, "error");
          } else if (error.response?.data?.errorData?.body?.details)
            showAlert(error.response.data.errorData.body.details, "error");
          else showAlert("Error while updating loan", "error");
        });
    } else if (value == "reupload") {
      kycDetail.company_id = props.row_data.company_id
      kycDetail.product_id = props.row_data.product_id
      kycDetail.loan_id = props.row_data.loan_id
      kycDetail.reupload = true
      kycDetail.partner_loan_app_id = props.row_data.partner_loan_app_id
      kycDetail.reuploadDocuments = reuploadDocuments
      new Promise((resolve, reject) => {
        dispatch(updateLeadDataByLoanIdWatcher(kycDetail, resolve, reject));
      })
        .then((response) => {
          setReuploadOpen(false);
          showAlert(response.message, "success")

        })
        .catch((error) => {
          setReuploadOpen(false);
          showAlert(error.response.data.message, "error");

        });

    } else {
      setOpen(false);
      setApproveOpen(false);
      setRejectOpen(false);
      setReuploadOpen(false);
      closePopupHandler();
    }

  };

  function closePopupHandler() {
    props.setKycPopUp();
  }

  function getComplianceDetails() {
    const complianceDetails = [];

    for (let i = 0; i < Math.ceil(documentQueue.length / 4); i++) {
      const complianceDetailsRow = [];

      for (let j = 0; (j < 4); j++) {
        let idx = i*4 + j;
        if (documentQueue[idx]) {
          const data = documentQueue[idx];
          let color;
          let bgColor;
          let label = data.value === 'NA' ? `${data.label} N/A` : data.label;

          if (data.value === 'Y') {
            color = "#008042";
            bgColor = "rgba(230, 255, 243, 0.70)";
          }
          else if (data.value === 'N') {
            color = "#B30000";
            bgColor = "#FFE6E6";
          }
          else if (data.value === 'NA') {
            color = "#DB8400";
            bgColor = "#FFF5E6";
          }
          complianceDetailsRow.push(getComplianceBadge(color, bgColor, label, idx));
        } else {
          complianceDetailsRow.push(getComplianceBadge(null, null, null, idx));
        }
      }
      
      complianceDetails.push(
        <div
          id={`compliance-details-row-${i}`}
          key={`complianceDetailsRow${i}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            width: "100%"
          }}
        >
          {complianceDetailsRow}
        </div>
      )
    }
    return complianceDetails;
  }

  function getComplianceBadge(color, bgColor, label, idx) {
    return label
    ? (
      <div
        id={`compliance-details-badge-${idx}`}
        key={`compliance-details-badge-${idx}`}
        style={{
          display: "flex",
          padding: "2px 8px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "4px",
          backgroundColor: bgColor,
          width: "25%"
        }}
      >
        <span
          style={{
            color: color,
            textAlign: "center",
            fontFamily: "Montserrat-Medium",
            fontSize: "12px",
            fontWeight: "500",
            lineHeight: "150%"
          }}
        >
          {label}
        </span>
      </div>
    )
    : (
      <div
        key={`compliance-details-badge-${idx}`}
        style={{
          display: "flex",
          padding: "2px 8px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "4px",
          width: "25%"
        }}
      ></div>
    )
  }

  const styleButton = {
    display: "flex",
    width: "50%",
    padding: "13px 44px",
    borderRadius: "8px",
    height: "48px",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: "150%",
    flex: "1 0 0"
  };

  const stylePopupHeader = {
    color: "#303030",
    fontFamily: "Montserrat-Bold",
    fontSize: "24px",
    fontWeight: "700",
    lineHeight: "150%",
    width: "94%"
  };

  const stylePopup = {
    display: "flex",
    flexDirection: "column",
    gap: "44px",
    width: "36%",
    height: "100%",
    padding: "24px",
    marginLeft: "35%",
    borderRadius: "8px",
    background: "#FFF"
  };

  const stylePopupChild = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "92%",
    gap: "24px",
    overflowY: "auto",
    overflowX: "hidden"
  };

  const styleInputBox = {
    display: "flex",
    width: "48%",
    maxWidth: "none",
    height: "56px",
    color: "#141519",
    fontFamily: "Montserrat-Regular",
    fontSize: "16px",
    fontWeight: "400"
  };

  const styleInputBoxChild = {
    minWidth: "100%"
  };

  const styleRadioCheckboxInput = {
    height: "16px",
    width: "16px",
    verticalAlign: "middle"
  };

  const styleRadioCheckboxLabel = {
    marginLeft: "8px",
    color: "#141519",
    fontFamily: "Montserrat-Regular",
    fontSize: "14px",
    fontWeight: "500",
    lineHeight: "150%"
  };

  return (
    <>

      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={() => setAlert(false)}
        />
      ) : null}

      <FormPopup
        heading="KYC Incomplete"
        isOpen={true}
        onClose={closePopupHandler}
        customHeaderStyle={stylePopupHeader}
        customStyles={stylePopup}
        customStyles1={{ ...stylePopupChild, width: "95%" }}
      >
        <div
          id="compliance-details"
          style={{
            width: "98%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px"
          }}
        >
          {documentQueue ? getComplianceDetails() : null}
        </div>
        <div
          id="pan-details"
          style={{
            width: "98%",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            alignItems: "flex-start"
          }}
        >
          <div
            style={{
              width: "100%",
              color: "#141519",
              fontFamily: "Montserrat-Semibold",
              fontSize: "18px",
              fontWeight: "600",
              lineHeight: "150%"
            }}
          >
            PAN Details
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "16px"
            }}
          >
            <InputBox
              id="pan-details-pan-number"
              label="PAN Number"
              initialValue={pan_number || ""}
              error={errors.pan_numberError}
              helperText={
                errors.pan_numberError
                  ? "Enter valid Pan Number"
                  : ""
              }
              onClick={(event) => {
                handleOnChange(event.value.toUpperCase(), 'pan_number')
              }}
              customClass={styleInputBox}
              customInputClass={styleInputBoxChild}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
              PopperProps={{
                style: { zIndex: 1000000 }
              }}
                label={"DOB"}
                placeholder={"DOB"}
                id="pan_dob"
                value={panDob || null}
                onChange={(date) => {
                  setPanDob(moment(date).format('YYYY-MM-DD'))
                  handleOnChange(date, 'panDob')
                }}
                renderInput={(params) => <TextField {...params}
                  error={errors.panDobError}
                  helperText={
                    errors.panDobError
                      ? "Enter valid Pan DOB"
                      : ""
                  }
                  style={{ width: "48%" }}
                />}
              />
            </LocalizationProvider>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "16px"
            }}
          >
            <InputBox
              id="pan-details-first-name"
              label="First Name"
              initialValue={pan_first_name || ""}
              onClick={(event) => {
                handleOnChange(event.value, 'pan_first_name')
              }}
              customClass={styleInputBox}
              customInputClass={styleInputBoxChild}
            />
            <InputBox
              id="pan-details-middle-name"
              label="Middle Name"
              initialValue={pan_middle_name || ""}
              onClick={(event) => {
                handleOnChange(event.value, 'pan_middle_name')
              }}
              customClass={styleInputBox}
              customInputClass={styleInputBoxChild}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "16px"
            }}
          >
            <InputBox
              id="pan-details-last-name"
              label="Last Name"
              initialValue={pan_last_name || ""}
              onClick={(event) => {
                handleOnChange(event.value, 'pan_last_name')
              }}
              customClass={styleInputBox}
              customInputClass={styleInputBoxChild}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "16px"
            }}
          >
            <InputBox
              id="pan-details-fathers-first-name"
              label="Father’s First Name"
              initialValue={pan_father_name || ""}
              onClick={(event) => {
                handleOnChange(event.value, 'pan_father_name')
              }}
              customClass={styleInputBox}
              customInputClass={styleInputBoxChild}
            />
            <InputBox
              id="pan-details-fathers-middle-name"
              label="Father’s Middle Name"
              initialValue={pan_father_middle_name || ""}
              onClick={(event) => {
                handleOnChange(event.value, 'pan_father_middle_name')
              }}
              customClass={styleInputBox}
              customInputClass={styleInputBoxChild}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "16px"
            }}
          >
            <InputBox
              id="pan-details-fathers-last-name"
              label="Father’s Last Name"
              value={pan_father_last_name || ""}
              onClick={(event) => {
                handleOnChange(event.value, 'pan_father_last_name')
              }}
              customClass={styleInputBox}
              customInputClass={styleInputBoxChild}
            />
          </div>
        </div>
        <div
          id="aadhaar-details"
          style={{
            width: "98%",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            alignItems: "flex-start"
          }}
        >
          <div
            style={{
              width: "100%",
              color: "#141519",
              fontFamily: "Montserrat-Semibold",
              fontSize: "18px",
              fontWeight: "600",
              lineHeight: "150%"
            }}
          >
            Aadhaar Details
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "16px"
            }}
          >
            <InputBox
              id="aadhaar-details-aadhaar-number"
              label="Aadhaar Number"
              initialValue={aadhaar_number || ""}
              error={errors.aadhaar_numberError}
              helperText={
                errors.aadhaar_numberError
                  ? "Enter valid Aadhaar Number"
                  : ""
              }
              onClick={(event) => {
                handleOnChange(event.value.toUpperCase(), 'aadhaar_number')
              }}
              customClass={styleInputBox}
              customInputClass={styleInputBoxChild}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
              PopperProps={{
                style: { zIndex: 1000000 }
              }}
                label={"DOB"}
                placeholder={"DOB"}
                id="aadhaar_dob"
                value={aadhaarDOB || null}
                onChange={(date) => {
                  setAadhaarDob(date)
                  handleOnChange(date, 'aadhaarDob')
                }}
                renderInput={(params) => <TextField {...params}
                  error={errors.aadhaarDobError}
                  helperText={
                    errors.aadhaarDobError
                      ? "Enter valid Aadhaar DOB"
                      : ""
                  }
                  style={{ width: "48%" }}
                />}
              />
            </LocalizationProvider>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "16px"
            }}
          >
            <InputBox
              id="aadhaar-details-pincode"
              label="Pincode"
              initialValue={aadhaar_pincode || ""}
              error={errors.aadhaar_pincodeError}
              helperText={
                errors.aadhaar_pincodeError
                  ? "Enter valid Pincode"
                  : ""
              }
              onClick={(event) => {
                handleOnChange(event.value, 'aadhaar_pincode')
              }}
              customClass={styleInputBox}
              customInputClass={styleInputBoxChild}
            />
            <InputBox
              id="aadhaar-details-first-name"
              label="First Name"
              initialValue={aadhaar_first_name || ""}
              onClick={(event) => {
                handleOnChange(event.value, 'aadhaar_first_name')
              }}
              customClass={styleInputBox}
              customInputClass={styleInputBoxChild}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "16px"
            }}
          >
            <InputBox
              id="aadhaar-details-middle-name"
              label="Middle Name"
              initialValue={aadhaar_middle_name || ""}
              onClick={(event) => {
                handleOnChange(event.value, 'aadhaar_middle_name')
              }}
              customClass={styleInputBox}
              customInputClass={styleInputBoxChild}
            />
            <InputBox
              id="aadhaar-details-last-name"
              label="Last Name"
              initialValue={aadhaar_last_name || ""}
              onClick={(event) => {
                handleOnChange(event.value, 'aadhaar_last_name')
              }}
              customClass={styleInputBox}
              customInputClass={styleInputBoxChild}
            />
          </div>
        </div>
        <div
          id="ckyc-required"
          style={{
            width: "98%",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <div
            id="ckyc-required-question"
            style={{
              width: "100%",
              color: "#141519",
              fontFamily: "Montserrat-Semibold",
              fontSize: "18px",
              fontWeight: "600",
              lineHeight: "150%"
            }}
          >
            Is CKYC required for this case?
          </div>
          <div
            id="ckyc-required-input"
            style={{
              width: "100%",
              display: "flex",
              height: "24px",
              gap: "24px"
            }}
          >
            <div>
              <input
                id="ckyc-required-input-1"
                type="radio"
                name="is_ckyc_required"
                value={1}
                onChange={(event) => {
                  handleOnChange(event.target.value, 'is_ckyc')
                }}
                style={styleRadioCheckboxInput}
              />
              <label
                htmlFor="ckyc-required-input-1"
                style={styleRadioCheckboxLabel}
              >
                Yes
              </label>
            </div>
            <div>
              <input
                id="ckyc-required-input-0"
                type="radio"
                name="is_ckyc_required"
                value={0}
                onChange={(event) => {
                  handleOnChange(event.target.value, 'is_ckyc')
                }}
                style={styleRadioCheckboxInput}
              />
              <label
                htmlFor="ckyc-required-input-0"
                style={styleRadioCheckboxLabel}
              >
                No
              </label>
            </div>
          </div>
        </div>

        <div
          style={{
            width: "98%",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Button
            id="re-upload-btn"
            label="Re-upload"
            buttonType="link-button"
            onClick={() => setReuploadOpen(true)}
            customStyle={{
              fontFamily: "Montserrat-Regular",
              fontWeight: "600",
              color: "#475BD8",
              boxShadow: "none"
            }}
          />
        </div>

        <div
          style={{
            width: "98%",
            display: "flex",
            justifyContent: "space-evenly",
            paddingBottom: "8px"
          }}
        >
          <Button
            id="kyc-incomplete-reject-button"
            buttonType="secondary"
            label="Reject"
            onClick={() => setRejectOpen(true)}
            customStyle={{
              ...styleButton,
              color: "#C00",
              border: "1px solid #C00",
              boxShadow: "none"
            }}
          />
          <Button
            id="kyc-incomplete-approve-button"
            buttonType="primary"
            label="Approve"
            onClick={() => setApproveOpen(true)}
            isDisabled={checkForManual == "DC" || checkForManual == "DNC" ? true : (enableSubmit ? false : true)}
            customStyle={styleButton}
          />
        </div>
      </FormPopup>

      {/* FormPopup for re-upload */}
      {reuploadOpen
      ? (
        <FormPopup
          isOpen={true}
          onClose={() => { setReuploadOpen(false) }}
          heading="Select Re-Upload Document"
          customHeaderStyle={stylePopupHeader}
          customStyles={stylePopup}
          customStyles1={stylePopupChild}
        >
          <div
            id="re-upload-document-checkboxes"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}
          >
            <div
              id="re-upload-document-input-aadhaar"
              style={{height: "24px"}}
            >
              <input
                id="re-upload-document-aadhaar"
                name="re-upload-document-types"
                type="checkbox"
                checked={aadhaarCheckBox}
                value="reupload_aadhaar_card"
                onChange={(event) => {
                  setAadhaarCheckBox(!aadhaarCheckBox);
                  reuploadDocuments.aadhaar = !reuploadDocuments.aadhaar;
                }}
                style={styleRadioCheckboxInput}
              />
              <label 
                htmlFor="re-upload-document-aadhaar"
                style={styleRadioCheckboxLabel}
              >
                Aadhaar Card
              </label>
            </div>
            <div 
              id="re-upload-document-input-pan"
              style={{height: "24px"}}
            >
              <input
                id="re-upload-document-pan"
                name="re-upload-document-types"
                type="checkbox"
                checked={panCheckBox}
                value="reupload_pan_card"
                onChange={(event) => {
                  setPanCheckBox(!panCheckBox);
                  reuploadDocuments.pan = !reuploadDocuments.pan;
                }}
                style={styleRadioCheckboxInput}
              />
              <label
                htmlFor="re-upload-document-pan"
                style={styleRadioCheckboxLabel}
              >
                Pan Card
              </label>
            </div>
          </div>
          <div
            id="re-upload-document-action-btns"
            style={{
              display: "flex",
              width: "98%",
              paddingBottom: "8px"
            }}
          >
            <Button
              id="re-upload-btn-back"
              label="Back"
              buttonType="secondary"
              onClick={() => { setReuploadOpen(false) }}
              customStyle={{
                ...styleButton,
                color: "#475BD8",
                border: "1px solid #475BD8",
                boxShadow: "none"
              }}
            />
            <Button
              id="re-upload-btn-submit"
              label="Submit"
              buttonType="primary"
              onClick={() => { handleClose("reupload") }}
              isDisabled={!aadhaarCheckBox && !panCheckBox}
              customStyle={styleButton}
            />
          </div>
        </FormPopup>
      ) : null}

      {/* FormPopup for reject */}
      {rejectOpen
      ? (
        <FormPopup
          id="kyc-reject-popup"
          isOpen={true}
          heading="Reject Confirmation"
          onClose={() => {
            setRejectOpen(false);
            setReason("")
            setSelectReasonComment("")
          }}
          customHeaderStyle={stylePopupHeader}
          customStyles={stylePopup}
          customStyles1={stylePopupChild}
        >
          <div
            id="kyc-reject-reason-inputs"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "32px"
            }}
          >
            <InputBox
              id="kyc-reject-reason-input-dropdown"
              label="Select Reason"
              isDrawdown={true}
              options={reasonCode}
              onClick={(reason) => setReason(reason)}
              customClass={{
                ...styleInputBox,
                minWidth: "100%"
              }}
              customDropdownClass={{
                marginTop: "8px",
                zIndex: "3",
                marginRight: "-8px"
              }}
            />
            <TextField
              sx={{
                width: "100%",
                color: "#141519",
                fontFamily: "Montserrat-Regular",
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "150%"
              }}
              id="outlined-basic"
              label="Comment"
              variant="outlined"
              type="text"
              placeholder="Comment"
              multiline={true}
              minRows={6}
              size="medium"
              onChange={(event) => setSelectReasonComment(event.target.value)}
            />
          </div>
          <div
            id="kyc-reject-action-btns"
            style={{
              display: "flex",
              paddingBottom: "8px"
            }}
          >
            <Button
              id="kyc-reject-action-btn-cancel"
              label="Cancel"
              buttonType="secondary"
              onClick={() => {
                setRejectOpen(false);
                setReason("")
                setSelectReasonComment("")
              }}
              customStyle={{
                ...styleButton,
                color: "#475BD8",
                border: "1px solid #475BD8",
                boxShadow: "none"
              }}
            />
            <Button
              id="kyc-reject-action-btn-reject"
              label="Reject"
              buttonType="secondary"
              customStyle={{
                ...styleButton,
                color: reason == "" ? "#C00" : "#FFF",
                backgroundColor: reason == "" ? "#FFF" : "#C00",
                border: "1px solid #C00",
                boxShadow: "none"
              }}
              onClick={() => { handleClose("reject") }}
              isDisabled={reason == ""}
            />
          </div>
        </FormPopup>
      ) : null}

      {/* FormPopup for approve */}
      {approveOpen
      ? (
        <FormPopup
          id="kyc-approve-popup"
          isOpen={true}
          heading="Approve Confirmation"
          onClose={() => {
            setApproveOpen(false);
            setReason("")
            setSelectReasonComment("")
          }}
          customHeaderStyle={stylePopupHeader}
          customStyles={stylePopup}
          customStyles1={stylePopupChild}
        >
          <div
            id="kyc-approve-reason-inputs"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "32px"
            }}
          >
            <InputBox
              id="kyc-approve-reason-input-dropdown"
              label="Select Reason"
              isDrawdown={true}
              options={reasonCode}
              onClick={(reason) => setReason(reason)}
              customClass={{
                ...styleInputBox,
                minWidth: "100%"
              }}
              customDropdownClass={{
                marginTop: "8px",
                zIndex: "3",
                marginRight: "-8px"
              }}
            />
            <TextField
              sx={{
                width: "100%",
                color: "#141519",
                fontFamily: "Montserrat-Regular",
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "150%"
              }}
              id="outlined-basic"
              label="Comment"
              variant="outlined"
              type="text"
              placeholder="Comment"
              multiline={true}
              minRows={6}
              size="medium"
              onChange={(event) => setSelectReasonComment(event.target.value)}
            />
          </div>
          <div
            id="kyc-approve-action-btns"
            style={{
              display: "flex",
              paddingBottom: "8px"
            }}
          >
            <Button
              id="kyc-approve-action-btn-cancel"
              label="Cancel"
              buttonType="secondary"
              customStyle={{
                ...styleButton,
                color: "#475BD8",
                border: "1px solid #475BD8",
                boxShadow: "none"
              }}
              onClick={() => {
                setApproveOpen(false);
                setReason("")
                setSelectReasonComment("")
              }}
            />
            <Button
              id="kyc-approve-action-btn-approve"
              label="Approve"
              buttonType="primary"
              customStyle={styleButton}
              onClick={() => { handleClose("yes") }}
              isDisabled={reason == ""}
            />
          </div>
        </FormPopup>
      ) : null}


      {/*
        
        {open ? <Dialog
          open={open}
          TransitionComponent={Transition}
          aria-describedby="alert-dialog-slide-description"
          >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-descriptions">
              This case will be treated as KYC complete. Please confirm
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose("no")}>Cancel</Button>
            <Button onClick={() => handleClose("yes")}>OK</Button>
          </DialogActions>
        </Dialog > : null}   
      </Grid> */}
    </>
  );
}


import React, { useEffect, useState, Component } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import "./view.css";
import CustomizeTemplates from "../loanSchema/templateTabs";
import Accordion from "react-sdk/dist/components/Accordion/Accordion";
import Table from "react-sdk/dist/components/Table/Table";
import Button from "react-sdk/dist/components/Button/Button";
import Img from "../lending/images/download-button.svg";
import imgH from "../lending/images/download-button-hover.svg";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import { makeStyles, styled } from "@material-ui/core/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import moment from "moment";
import { AlertBox } from "../../components/AlertBox";
import {
  repaymentScheduleForLocWatcher,
  repaymentScheduleListWatcher
} from "../../actions/repaymentSchedule";
import {
  getCamsDetailsWatcher,
  submitCamsDetailsWatcher,
  getBreDetailsWatcher,
  runCreditEngineWatcher
} from "../../actions/camsDetails";
import { useParams, useHistory } from 'react-router-dom';
//import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import CamsDemographicCard from "../lending/CamsDemographicCard";
import { ConfirmationPopup } from "../lending/ConfirmationPopup";
import { checkAccessTags } from "../../util/uam";
import { validateData } from "../../util/validation";
import { storedList } from "../../util/localstorage";
import { camsFormJsonFields } from "../lending/camsFormJson";
import SelectorDemographicCard from "../lending/SelectorDemographicCard";
import { loanDetailsJson } from "./loanDetailsJson";
import { downloadAllDocumentWatcher, updateStatusWatcher } from "../../actions/colenders.js";
import { getProductByIdWatcher } from "../../actions/product";
import LoanDocList from "../lending/loanDocuments.js";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from "@mui/material/Tooltip";
import StatementOfAccount from 'views/lending/statementOfAccount';
import Preloader from "../../components/custom/preLoader";
import leftArrowSign from "./icons/leftArrow.svg"	
import rightArrowSign from "./icons/rightArrow.svg"
import downArrowSign from "./icons/downArrow.svg"	
import "react-sdk/dist/styles/_fonts.scss"
import TickCircle from "../../assets/img/tick-circle.svg";
import LeadLoanLineImage from "../lending/images/newleadloanscreen.svg"
const user = storedList("user");
const { getLoanDetails, getLeadDetails, getCkycDetails } = require("../../apis/colenders");
const { getCbiLoansDetails } = require("../../apis/colenders");
import CamsSection from 'msme/views/loans/loanCreation/camsSection';
import { getOfferDetailsWatcher } from "../../actions/offerDetails";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5e72e4",
    color: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.black
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const viewColendingApproval = () => {
  const isLoading = useSelector(state => state.profile.loading);
  const [selectedTab, setSelectedTab] = useState("");
  const [showRepaymentSchedule, setShowRepaymentSchedule] = useState(false);
  const [showCamsDetails, setShowCamsDetails] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showLoanDetails, setShowLoanDetails] = useState(false);
  const [showCreditEngine, setShowCreditEngine] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState("");
  const [repaymentScheduleList, setRepaymentScheduleList] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [payloadData, setPayloadData] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const user = storedList("user");
  const [isCamsDetailsAvailable, setIsCamsDetailsAvailable] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedLoanDetails, setIsLoadedLoanDetails] = useState(true);
  const [editable, setEditable] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [errors, setErrors] = useState([]);
  const [repaymentScheduleAlert, setRepaymentScheduleAlert] = useState(false);
  const [repaymentScheduleAlertMessage, setRepaymentScheduleAlertMessage] = useState("");
  const [camsAlert, setCamsAlert] = useState(false);
  const [camsAlertMessage, setCamsAlertMessage] = useState("");
  const [loansAlert, setLoansAlert] = useState(false);
  const [loansAlertMessage, setLoansAlertMessage] = useState("");
  const history = useHistory();
  const [isLoanDetailsAvailable, setIsLoanDetailsAvailable] = useState(false);
  const [payloadDataLoanDetails, setPayloadDataLoanDetails] = useState("");
  const [errorsLoanDetails, setErrorsLoanDetails] = useState([]);
  const [editableLoanDetails, setEditableLoanDetails] = useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [disableHold, setDisableHold] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [remarks, setRemarks] = React.useState("");
  const [rejectRemarks, setRejectRemarks] = React.useState("");
  const [SendToRemarks, setSendToRemarks] = React.useState("");
  const [approveRemarks, setApproveRemarks] = React.useState("");
  const [statementOfAccount, setStatementOfAccount] = useState(false);
  const [loanData, setLoanData] = useState({});
  const [cbiLoanData, setCbiLoanData]= useState({});
  const [showCreditEngineButton,setShowCreditEngineButton] = useState(false);
  const [breDetails, setBreDetails] = useState([]);
  const [newArray, setNewArray] =useState();
  const [newCamArray,setNewCamArray] =useState();
  const [syncStatus , setSyncStatus] = useState({
    maker:[],
    checker1:[],
    checker2:[]
  })
  const [hold , setHold] = useState(false);
const [initialArrowSign, setInitialArrowSign] = useState(leftArrowSign)	
const [rejectOpen, setRejectOpen] = useState(false);
const[sendToOpen ,setSendToOpen] = useState(false)	
const [approveOpen, setApproveOpen] = useState(false);	
const [showHelp, setShowHelp] = useState(false);
const[auditArray,setauditArray]=useState([]);
  const statusToDisplay = {
    "GO" : "Approved",
    "NOGO" : "Rejected"
  }
  let statusValue = "";
  const commentstyle = "*"
  const [isListOpen, setIsListOpen] = useState(false);
  const [loanDetails,setLoanDetails] = useState()
  const [breData,setBreData] = useState([])
  const [productData,setProductData] = useState({})
  const [leadStatus, setLeadStatus] = useState('');
  const [emiAmount,setEmiAmount] = useState('');

  const toggleList = () => {
    setIsListOpen(!isListOpen);
  };
 
function getUserRole(user) {
  if (user.userroles.includes("maker")) {
    return "maker";
  } else if (user.userroles.includes("checker1")) {
    return "checker1";
  } else if (user.userroles.includes("checker2")) {
    return "checker2";
  } else {
    return "No role found";
  }
}

const userRole = getUserRole(user);

 const isHoldStatus = syncStatus.maker.some(
  (statusObj) => statusObj.status === 'Hold'
);

const isApprovedOrRejectedStatus = syncStatus.maker.some(
  (statusObj) => statusObj.status === 'Approved' || statusObj.status === 'Rejected' 
);

 const isHoldStatusChecker1 = syncStatus.checker1.some(
  (statusObj) => statusObj.status === 'Hold',
);

const isApprovedOrRejectedStatusChcker1 = syncStatus.checker1.some(
  (statusObj) => statusObj.status==="Request_Sent"
);

  const {
    loan_id,
    product,
    loan_schema_id,
    company_id,
    product_id,
    loan_app_id,
    co_lender_id
  } = useParams();

  const [loanId, setLoanId] = useState(loan_id);
  const [companyId, setCompanyId] = useState(company_id);
  const [productId, setProductId] = useState(product_id);
  const [fetchColenderSchedule, setFetchColenderSchedule] = useState(0);
  const [selectedOption, setSelectedOption] = useState("AFIPL");

  const handleDropdownChange = (event, value) => {
    setSelectedOption(event.value);
    setFetchColenderSchedule(1);
  }

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const dispatch = useDispatch();

  const handleChangePage = (event, newPage) => {
    setPage(event);
    const firstPage = event * rowsPerPage;
    const lastPage = event * rowsPerPage + rowsPerPage;
    const data = responseData.slice(firstPage, lastPage);
    setRepaymentScheduleList(data);
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };


  const handleSignChange = () => {	
    setInitialArrowSign(initialArrowSign === leftArrowSign ? rightArrowSign : leftArrowSign);	
    setShowHelp(initialArrowSign === leftArrowSign);	
  };	
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
    gap: "24px"	
  };

  const containerStyle = {	
    marginRight:"5px",
    minHeight:"650px",
    marginTop:"40px",
    borderLeft:"3px solid #F1F1F3",	
    width: initialArrowSign === rightArrowSign ? "300px" : "auto",	
  };
  
  useEffect(() => {
    return () => {
      handleAlertClose();
    };
  }, []);

  useEffect(() => {
    var sampleArray =[];
  if (isLoadedLoanDetails) {
    sampleArray = Object.keys(headersLoanDetails).map((item) => {
      const field_names = loanDetailsJson().slice(
        headersLoanDetails[item][0],
        headersLoanDetails[item][1]
      );
        if (item === "Loan Summary") {
        return {
          title: (
            <div style={{display:"flex",width:"100%",justifyContent:"space-between"}}>
              <div>{item}</div>
              <div  style={{display:"flex",float:"right"}} >
              <Button label="View statement of Account" 
              onClick={handleClick} 
              buttonType='secondary' 
              customStyle={{ backgroundColor: "#FFF",borderColor:"#FFF",
            color: "#475BD8", height:"33px", width:"100%",borderRadius:"4px",padding:"2px 20px",fontSize:"14px",boxShadow:"none"}}
            /></div>
            </div>
          ),
          data: field_names.map((field) => ({
                  body: field.title.toUpperCase() === "CBI SANCTIONED AMOUNT" || field.title.toUpperCase() === "ARTHMATE SANCTIONED AMOUNT"
            ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payloadDataLoanDetails[field.name])
            : payloadDataLoanDetails[field.name] === "" || !payloadDataLoanDetails[field.name]
            ? "NA"
            : field.title=="Arthmate Approval Date" ? moment(payloadDataLoanDetails[field.name]).format("DD-MM-YYYY") : payloadDataLoanDetails[field.name] ,
            head: `${field.title.toUpperCase()}`
          }))
        };
      } else {
        return {
          title: item,
          data: field_names.map((field) => ({
            body: field.title.toUpperCase() === "NET DISBUR AMT" || field.title.toUpperCase() === "GST ON PF AMT"|| field.title.toUpperCase() === "PROCESSING FEES AMT"
            ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payloadDataLoanDetails[field.name])
            : payloadDataLoanDetails[field.name] === "" || !payloadDataLoanDetails[field.name]
            ? "NA"
            : payloadDataLoanDetails[field.name],
            head: `${field.title.toUpperCase()}`
          }))
        };
      }
    });
    setNewArray(sampleArray);
  }
}, [isLoadedLoanDetails, payloadDataLoanDetails]);

useEffect(() => {
    var sampleCamsArray =[]
  if (isLoaded) {
    sampleCamsArray = Object.keys(headers).map((item) => {
      const field_names = camsFormJsonFields().slice(
        headers[item][0],
        headers[item][1]
      );
      return {
        title:item,
        data : field_names.map(field=>({
          body: payloadData ? payloadData[field.name] === "" || !payloadData[field.name] ? "NA" :  payloadData[field.name]  : null,
          head: `${field.title.toUpperCase()}`
        }))
      }
    }
    );
    setNewCamArray(sampleCamsArray);
  }
}, [isLoaded, payloadData]);

  const handleAlertClose = () => {
    setRepaymentScheduleAlert(false);
    setRepaymentScheduleAlertMessage("");
    setCamsAlert(false);
    setCamsAlertMessage("");
    setLoansAlert(false);
    setLoansAlertMessage("");
    setAlert(false);
    setAlertMessage("");
    setSeverity("");
  };


  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_colend_cases_read", "tag_loan_details_btn_colend_action"
      ])
    )
      if (selectedOption === "Co-Lender") {
        fetchColenderRepaymentScheduleList();
      }
      else fetchRepaymentScheduleList();

  }, [selectedOption]);

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_colend_cases_read", "tag_loan_details_btn_colend_action"
      ])
    )
      fetchCamsDetails();
    if (!isTagged) fetchCamsDetails();

    if (product?.isLoc) fetchRepaymentScheduleListForLoc();
    else {
      if (selectedOption === "Co-Lender") {
        fetchColenderRepaymentScheduleList();
      }
      else fetchRepaymentScheduleList();
    }
      handleLoanDetails()
      fetchProductDetails()
      response();
  }, []);

 const fetchProductDetails = () => {
  new Promise((resolve, reject) => {
    dispatch(getProductByIdWatcher(product_id, resolve, reject));
  })
    .then(response => {
      setProductData(response)
    })
    .catch((error) => {
    });
 }

  const fetchColenderRepaymentScheduleList = () => {
    const payload = {
      loan_id: loan_id,
      company_id: company_id,
      product_id: product_id,
      page: page,
      limit: rowsPerPage,
      repayment_schedule_switch: "true"
    };
    new Promise((resolve, reject) => {
      dispatch(repaymentScheduleListWatcher(payload, resolve, reject));
    })
      .then(response => {
        if (response.data?.count > 0) {
          setShowRepaymentSchedule(true);
          setShowCamsDetails(false);
          setShowDocuments(false)
          setShowLoanDetails(false)
          setResponseData(response.data.rows);
          setRepaymentScheduleList(response.data.rows.slice(0, rowsPerPage));
          setCount(response.data.count);
          setNoData(false);
        } else {
          setRepaymentScheduleList([]); // Clear the existing data
          setShowRepaymentSchedule(true);
          setShowCamsDetails(false);
          setShowDocuments(false)
          setShowLoanDetails(false)
          setRepaymentScheduleAlert(true)
          setRepaymentScheduleAlertMessage(error?.response?.data?.message || "No data available")
          setCount(0)
          setPage(0)
          setSeverity("error")
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
        }
      })
      .catch(error => {
        setShowRepaymentSchedule(true);
        setShowCamsDetails(false);
        setShowDocuments(false)
        setShowLoanDetails(false)
        setRepaymentScheduleAlert(true)
        setRepaymentScheduleAlertMessage(error?.response?.data?.message || "No data available")
        setCount(0)
        setPage(0)
        setSeverity("error")
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  const fetchRepaymentScheduleList = () => {
    const payload = {
      loan_id: loan_id,
      company_id: company_id,
      product_id: product_id,
      page: page,
      limit: rowsPerPage,
    };
    new Promise((resolve, reject) => {
      dispatch(repaymentScheduleListWatcher(payload, resolve, reject));
    })
      .then(response => {
        if (response.data?.count > 0) {
          setResponseData(response.data.rows);
          setRepaymentScheduleList(response.data.rows.slice(0, rowsPerPage));
          setEmiAmount(response.data.rows[0].emi_amount)
          setCount(response.data.count);
          setNoData(false);
          if (fetchColenderSchedule === 1) {
            setShowRepaymentSchedule(true);
            setShowCamsDetails(false);
            setShowDocuments(false)
            setShowLoanDetails(false)
          }
          setFetchColenderSchedule(0);
        }
        if (
          response.data?.count === 0 &&
          response.data?.count !== undefined
        ) {
          setRepaymentScheduleList([])
          setShowRepaymentSchedule(true);
          setShowCamsDetails(false);
          setShowDocuments(false)
          setShowLoanDetails(false)
          setRepaymentScheduleAlert(true)
          setRepaymentScheduleAlertMessage(error?.response?.data?.message || "No data available")
          setSeverity("error")
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
        }
      })
      .catch(error => {
        setShowRepaymentSchedule(true);
        setShowCamsDetails(false);
        setShowDocuments(false)
        setShowLoanDetails(false)
        setRepaymentScheduleAlert(true)
        setRepaymentScheduleAlertMessage(error?.response?.data?.message || "No data available")
        setSeverity("error")
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  const fetchRepaymentScheduleListForLoc = () => {
    const payload = {
      loan_id: loan_id,
      company_id: company_id,
      product_id: product_id,
    };
    new Promise((resolve, reject) => {
      dispatch(repaymentScheduleForLocWatcher(payload, resolve, reject));
    })
      .then(response => {
        if (response?.count > 0) {
          setResponseData(response.rows);
          setRepaymentScheduleList(response.rows.slice(0, rowsPerPage));
          setCount(response.count);
          setNoData(false);
        }
        if (
          response.data?.count === 0 &&
          response.data?.count !== undefined
        ) {
          setNoData(true);
          setRepaymentScheduleList([])
        }
      })
      .catch(error => {
        setRepaymentScheduleAlert(true)
        setRepaymentScheduleAlertMessage(error?.response?.data?.message || "no data available")
        setSeverity("error")
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  const handleRepaymentSchedule = () => {
    setShowRepaymentSchedule(true);
    setShowCamsDetails(false);
    setShowDocuments(false)
    setShowLoanDetails(false)
    setShowCreditEngine(false);
    setShowCreditEngineButton(false)
  }

  const handleCamsDetails = () => {
    setShowCamsDetails(true);
    setShowRepaymentSchedule(false);
    setShowDocuments(false)
    setShowLoanDetails(false)
    setShowCreditEngine(false);
    setShowCreditEngineButton(false)
  }

  const handleDocuments = () => {
    setShowDocuments(true)
    setShowCamsDetails(false);
    setShowRepaymentSchedule(false);
    setShowLoanDetails(false)
    setShowCreditEngine(false);
    setShowCreditEngineButton(false)
  }

  const keysToInclude = [
    "customer_type_ntc" ,
     "program_type",
     "business_entity_type",
     "age",
     "sanction_amount",
     "tenure",
     "avg_banking_turnover_6_months",
     "business_vintage_overall",
     "bureau_score",
     "abb",
     "bounces_in_three_month",
     "txn_avg",
     "emi_amount",
     "monthly_income",
     "emi_obligation",
     "residence_vintage",
     "foir",
     "emi_allowed",
     "offered_amount",
     "offered_int_rate"
  ]

  const keysToDisplay = {
    "customer_type_ntc" : "CUSTOMER VINTAGE",
    "business_vintage_overall": "BUSINESS VINTAGE",
    "abb" : "AVG BANK BALANCE",
    "bounces_in_three_month":"CHEQUE RETURN/EMI BOUNCE",
    "txn_avg":"TRANSACTION AVG",
    "emi_allowed":"EMI Allowed",
    "offered_amount":"Offered Loan Amount",
    "offered_int_rate":"Offered Interest Rate"
  }

  const hoverInfo = {
    "customer_type_ntc" : {value: "Customer vintage is derived from bureau"} ,
     "program_type":{value:"Program type for the case is sent by sourcing partner"},
     "business_entity_type":{value:"Business Entity type is derived from Udhyam Registration Certificate"},
     "age":{value:"Age of the customer is derived from date of birth of the borrower"},
     "sanction_amount":{formula: (
      loanDetails?.program_type ==="Banking" ? "PV((Interest Rate/12),Loan Tenure, EMI Allowed))" :
      loanDetails?.program_type ==="Transaction" ? "txn_avg*3" :
      loanDetails?.program_type ==="Income"? "PV((Interest Rate/12),Loan Tenure, EMI Allowed)" : "NA"
      ),
      calculation:(
        loanDetails?.program_type ==="Banking" ? `PV((${loanDetails?.loan_int_rate} /12),${loanDetails?.tenure}, ${loanDetails?.emi_allowed}))` :
        loanDetails?.program_type ==="Transaction" ? `${loanDetails?.txn_avg}*3` :
        loanDetails?.program_type ==="Income"? `PV((${loanDetails?.loan_int_rate} /12),${loanDetails?.tenure}, ${loanDetails?.emi_allowed}))` : "NA"
        )
      },
     "tenure":{value:"Tenure is selected by the customer"},
     "avg_banking_turnover_6_months":{value:"Average Banking turnover is average of all credits in the bank statement for last 6 months"},
     "business_vintage_overall":{value:"Business Vintage is calculated as business commencement date received from Udhyam Registration Certificate"},
     "bureau_score":{value:"Bureau Score is received from CIBIL"},
     "abb":{value:"Average Bank balance is calculated as average of total bank balance of borrower in last 6 months. The value is derived from ScoreMe banking parser."},
     "bounces_in_three_month":{value:"Cheque return/EMI bounce is derived using borrowers bank statement. The value is derived from ScoreMe banking parser."},
     "txn_avg":{value:"Transaction average is average of summation of transaction amount for last 6 months"},
     "emi_amount":{
      formula:"[P x R x (1+R)^N]/[(1+R)^N-1]",
      calculation:`[${loanDetails?.sanction_amount} x ${loanDetails?.loan_int_rate} x (1+${loanDetails?.loan_int_rate})^${loanDetails?.tenure}]/[(1+${loanDetails?.loan_int_rate})^${loanDetails?.tenure}-1]`},
     "monthly_income":{value:"Annual Income/12"},
     "emi_obligation":{value:"EMI obligation is derived from bureau report basis the borrowers existing loan emi’s"},
     "residence_vintage":{value:"This is derived basis customer declaration"},
     "foir":{value:"((Monthly EMI + Monthly Obligation)/Monthly Income) * 100"},
     "emi_allowed":{formula: (
      loanDetails?.program_type ==="Banking" ? "Average Bank Balance/1.2" :
      loanDetails?.program_type ==="Income"? "(Monthly business income * FOIR) - EMI Obligation" : "NA"
      ),
      calculation: (
        loanDetails?.program_type ==="Banking" ? `${productData?.is_msme_automation_flag === "Y" ? payloadData?.average_balance?.$numberDecimal : loanDetails?.abb}/1.2` :
        loanDetails?.program_type ==="Income"? `(${loanDetails?.monthly_income} * ${loanDetails?.foir}) - ${loanDetails?.emi_obligation}` : "NA"
        )
      },
     "offered_amount":{value:"This is applicable in case of non-fldg cases"},
     "offered_int_rate":{value:"This is applicable in case of non-fldg cases"}
  }

  const formulaTODisplay = {
    "Age limit Check" : "(Age should be between 21 and 60 years)",
    "Ticket Size Check":"(sanction_amount >= 50000 and sanction_amount <= 5000000)",
    "Tenure Month Check":"(tenure >= 3 and tenure <= 36)",
    "Average banking turnover for last 6 months Check":(loanDetails?.program_type === "Banking") ? "(avg_banking_turnover_6_months >= 25000)" : "NA",
    "Business vintage in months Check":"(business_vintage_overall >= 12)",
    "Bureau Score Check":(loanDetails?.customer_type_ntc ==="ETC") ? "(bureau_score >= 675)" : (loanDetails?.customer_type_ntc ==="NTC") ? "(bureau_score >= -1 and bureau_score <= 300)" : "NA",
    "Bureau Score Applicant Check" : (loanDetails?.customer_type_ntc ==="ETC") ? "(bureau_score >= 675)" : (loanDetails?.customer_type_ntc ==="NTC") ? "(bureau_score >= -1 and bureau_score <= 300)" : "NA",
    "ABB check":"(abb > 10000)",
    "Cheque return/ EMI bounce check":"(bounces_in_three_month <= 2)",
    "Credit Limit Assessment":(loanDetails?.program_type === "Banking") ? "(Average Bank Balance >= (1.2 * EMI Amount))" :
    (loanDetails?.program_type === "Transactions") ? "(Sanction Amount <= (3 * Average Transaction))" :
    (loanDetails?.program_type === "Income" && loanDetails?.customer_type_ntc ==="ETC") ? "(EMI Amount <= (0.75 * Monthly Income) - EMI Obligation)" :
    (loanDetails?.program_type === "Income" && loanDetails?.customer_type_ntc ==="NTC") ? "(EMI Amount < (0.50 * Monthly Income) - EMI Obligation)" :"NA",
    "Residence Vintage":"(residence_vintage >= 12)",
    "foir Check": (loanDetails?.customer_type_ntc ==="ETC") ? "(foir < 75)" : (loanDetails?.customer_type_ntc ==="NTC") ? "(foir < 50)" : "NA",
    "Program type check":`${loanDetails?.program_type}`,
    "Offered Loan Amount":"(sanction_amount <= (offered_amount + 15))",
    "Offered Interest Rate":"(Except below everthing is acceptable (offered_int_rate <= (loan_int_rate - 0.0005)) || (offered_int_rate >= (loan_int_rate + 0.0005)))",
    "Written-off Applicant Check": "(written_off_settled_flag < 1)",
    "90+ dpd in last 24 months Applicant Check": "(dpd_in_last_24_months <= 90)",
    "SMA FLAG Applicant Check":"(SMA_Flag_last_24m < 1)"
  }

  const calculationTODisplay = {
    "Age limit Check" : `${loanDetails?.age} > 21 and ${loanDetails?.age} < 60`,
    "Ticket Size Check":`${loanDetails?.sanction_amount} >= 50000 and ${loanDetails?.sanction_amount} <= 5000000`,
    "Tenure Month Check":`${loanDetails?.tenure} >= 3 and ${loanDetails?.tenure} <= 36`,
    "Average banking turnover for last 6 months Check":(loanDetails?.program_type === "Banking") ? `${loanDetails?.avg_banking_turnover_6_months} >= 25000` : "NA",
    "Business vintage in months Check":`${loanDetails?.business_vintage_overall} >= 12`,
    "Bureau Score Check":(loanDetails?.customer_type_ntc ==="ETC") ? `${loanDetails?.bureau_score} >= 675` : (loanDetails?.customer_type_ntc ==="NTC") ? `${loanDetails?.bureau_score} >= -1 and ${loanDetails?.bureau_score} <= 300` : "NA",
    "Bureau Score Applicant Check":(loanDetails?.customer_type_ntc ==="ETC") ? `${loanDetails?.bureau_score} >= 675` : (loanDetails?.customer_type_ntc ==="NTC") ? `${loanDetails?.bureau_score} >= -1 and ${loanDetails?.bureau_score} <= 300` : "NA",
    "ABB check":`${loanDetails?.abb} > 10000`,
    "Cheque return/ EMI bounce check":`${loanDetails?.bounces_in_three_month} <= 2`,
    "Credit Limit Assessment":(loanDetails?.program_type === "Banking") ? `${loanDetails?.abb} >= (1.2 * ${loanDetails?.emi_amount})` :
    (loanDetails?.program_type === "Transactions") ? `${loanDetails?.sanction_amount} <= (3 * ${loanDetails?.txn_avg}) `:
    (loanDetails?.program_type === "Income" && loanDetails?.customer_type_ntc ==="ETC") ? `${loanDetails?.emi_amount} <= (0.75 * ${loanDetails?.monthly_income}) - ${loanDetails?.emi_obligation}` :
    (loanDetails?.program_type === "Income" && loanDetails?.customer_type_ntc ==="NTC") ? `${loanDetails?.emi_amount} < (0.50 * ${loanDetails?.monthly_income}) - ${loanDetails?.emi_obligation}` :"NA",
    "Residence Vintage":`${loanDetails?.residence_vintage} >= 12`,
    "foir Check": (loanDetails?.customer_type_ntc ==="ETC") ? `${loanDetails?.foir} < 75` : (loanDetails?.customer_type_ntc ==="NTC") ? `${loanDetails?.foir} < 50` : "NA",
    "Program type check":"NA",
    "Offered Loan Amount":`${loanDetails?.sanction_amount} <= ${loanDetails?.offered_amount} + 15`,
    "Offered Interest Rate":`${loanDetails?.offered_int_rate} <= (${loanDetails?.loan_int_rate} - 0.0005) || ${loanDetails?.offered_int_rate} >= (${loanDetails?.loan_int_rate} + 0.0005)`,
    "Written-off Applicant Check": `${payloadData?.written_off_settled_flag_br?.$numberDecimal ?? "NA"} < 1`,
    "90+ dpd in last 24 months Applicant Check": `${payloadData?.dpd_in_last_24_months_br?.$numberDecimal ?? "NA"} <= 90`,
    "SMA FLAG Applicant Check":`${payloadData?.SMA_Flag_last_24m_br?? "NA"} < 1`
  }
  const customDecision = {fontSize: "16px",marginLeft:"30px",fontWeight: "400",fontFamily: "Montserrat-Regular",color: "var(--neutral-60, #767888)",display:"flex",flexDirection:"row"}
  
  const handleCreditEngine = () => {
    if(!cbiLoanData?.bre_status){
      setShowCreditEngineButton(true)
    }
    else{
      setShowCreditEngine(true);
      fetchBreDetails(cbiLoanData?.bre_result_url)
    }
    setShowDocuments(false)
    setShowCamsDetails(false);
    setShowRepaymentSchedule(false);
    setShowLoanDetails(false)
  }


  const handleSetBreData = async (cbiData) => {
    let revisedData = loanDetails
    let foir = ((Number(payloadData?.itr_turnover_fy1?.$numberDecimal)/12)/ (Number(payloadData?.curren_emi_br?.$numberDecimal))) === (Infinity|| NaN) ? "NA" : ((Number(payloadData?.itr_turnover_fy1?.$numberDecimal)/12)/ Number(payloadData?.curren_emi_br?.$numberDecimal))
    const LeadDetails = await getLeadDetails(loan_app_id);
    const LeadDetailsData = LeadDetails.data
    if(productData?.is_msme_automation_flag === "Y" && Object.keys(productData).length > 0) {
      revisedData={...loanDetails,
        bureau_score:payloadData?.bureau_score_br?.$numberDecimal ?? "NA",
        abb:payloadData?.average_balance?.$numberDecimal ?? "NA",
        bounces_in_three_month:payloadData?.inward_bounce_amount_last_3m?.$numberDecimal ?? "NA",
        txn_avg:payloadData?.tot_pos_upi_last_6m?.$numberDecimal ?? "NA",
        monthly_income:(Number(payloadData?.itr_turnover_fy1?.$numberDecimal)/12).toFixed(2) ?? "NA",
        emi_obligation:payloadData?.curren_emi_br?.$numberDecimal ?? "NA",
        avg_banking_turnover_6_months : payloadData?.avg_monthly_credits_last_6m?.$numberDecimal ?? "NA",
        foir : foir ?? "NA",
        emi_amount:emiAmount ?? "NA",
        customer_type_ntc : payloadData?.bureau_score_br?.$numberDecimal < 300 ? "NTC" : "ETC",
        business_entity_type : LeadDetailsData?.entity_details?.entity_type ?? "NA",
        business_vintage_overall : monthsDifference(LeadDetailsData?.entity_details?.date_of_incorporation)?? "NA",
      }
      setLoanDetails(revisedData)
    }
    setBreData([{title:(
      <div style={{display:"flex",flexDirection:"column",marginBottom:"16px"}}>
        <div style={{display: "flex",color: "#008042",fontFamily: "Montserrat-Semibold",fontSize: "16px",alignSelf: "stretch",fontStyle: "normal",alignItems:'center'}}>
          <img
            style={{ marginLeft: "0px",marginRight: "8px",marginTop: "0px",height:"24px",width:"24px" }}
            alt="icon"
            src={TickCircle}
            className="menuIcon"
          />
          <div>OVERALL DECISION - &quot;{statusToDisplay[cbiData?.bre_status?.toUpperCase()].toUpperCase()}&quot;</div>
        </div>
         <div style={{display:"flex",flexDirection:"row",gap:"44px"}}>
              <div style={customDecision}>Generated by:<div style={{fontFamily: "Montserrat-Medium",fontWeight: "500",color:"#141519",marginLeft:"5px"}}> {cbiData?.bre_generated_by ? cbiData.bre_generated_by : "NA" }</div></div>
              <div style={customDecision}>Date & Time:<div style={{fontFamily: "Montserrat-Medium",fontWeight: "500",color:"#141519",marginLeft:"5px"}}>{cbiData?.bre_exe_date ? moment(cbiData?.bre_exe_date).format("YYYY-MM-DD , hh:mm A") : "NA"}</div></div>
          </div>
      </div>
    ),data : keysToInclude.map((key) => ({
      head: (<div style={{fontSize:"12px",fontFamily: "Montserrat-Regular",fontWeight: "400",color:"var(--neutral-neutral-60, #6B6F80)"}} >{(keysToDisplay[key] ? keysToDisplay[key] : key).toUpperCase().replace(/_+/g, " ")} </div>),
      body: (<div style={{fontSize:"16px",fontFamily: "Montserrat-Medium",fontWeight: "500",color:"var(--neutral-neutral-100, #141519)"}}>{revisedData[key] ? revisedData[key] : "NA"}</div>),
      iconHoverData : (
        <div style={{fontSize:"12px",fontWeight: "400",fontFamily: "Montserrat-Regular",maxWidth:"300px",height:"fit-content",color: "var(--neutrals-black, #151515)"}}>
          {hoverInfo[key]?.value}
          {hoverInfo[key]?.formula ? (
            <div style={{display:"flex",flexDirection:"column"}}>
              <div style={{fontFamily: "Montserrat-Semibold"}}>Formula</div>
              <div>{hoverInfo[key]?.formula}</div>
            </div>
          ) : null}
          {hoverInfo[key]?.calculation ? (
            <div style={{display:"flex",flexDirection:"column"}}>
              <div style={{fontFamily: "Montserrat-Semibold"}}>Calculation</div>
             <div>{hoverInfo[key]?.calculation}</div>
            </div>
          ) : null}
        </div>
      )
    }))
  }]
    )
  }


  const runCreditEngine = () => {
    let data = {
      loan_id : loan_id,
      loan_app_id : loan_app_id,
      bre_exe_date : new Date(),
      bre_generated_by : user.username,
    }
    new Promise((resolve, reject) => {
      dispatch(runCreditEngineWatcher(data, resolve, reject));
    })
      .then((response) => {
          fetchBreDetails(response),
          setShowCreditEngine(true),
        setShowCreditEngineButton(false)
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message,"error")
      });
  };

  const fetchBreDetails = (s3_url) => {
    let data = {
      s3_url: s3_url
    }
    let cbiData= null;
    new Promise((resolve, reject) => {
      dispatch(getBreDetailsWatcher(data, resolve, reject));
    })
      .then(async (response) => {
        await getCbiLoansDetails(loan_id).then((response) => {
        setCbiLoanData(response.data),
        cbiData = response.data
      }
        )
        if(response){
        setBreDetails(response)
        handleSetBreData(cbiData)
      }
        else {
          setBreDetails([])
        }
      })
      .catch((error) => {
        setBreDetails([])
        showAlert(error?.response?.data?.message,"error")
      });
  };

  const downloadAllDocument = () => {
    let data = {
      loan_id: loan_id,
      user_id: user._id,
      company_id: company_id,
      product_id: product_id,
    }
    new Promise((resolve, reject) => {
      dispatch(downloadAllDocumentWatcher(data, resolve, reject));
    })
      .then((response) => {
        window.open(response,'_blank');
      })
      .catch((error) => {
        showAlert(error.response.data.message, "error");
      });
  };

  const calculateAge = (dob) => {
    const birthdate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const month = today.getMonth() - birthdate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return age;
  }

  function monthsDifference(dateString) {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    const diffMonths = (currentDate.getFullYear() - givenDate.getFullYear()) * 12 +
      (currentDate.getMonth() - givenDate.getMonth());
    return diffMonths;
  }

  const handleLoanDetails = async value => {
    let offerDetails = {}
    await getCbiLoansDetails(loan_id).then((response) => {
      setSyncStatus({
        ...syncStatus,
        ...response.data.sync_status
      })
      setauditArray(response?.data?.combined_maker_checker);
    setCbiLoanData(response.data)})
    const response = await getLoanDetails(
      loan_id
    );

    new Promise((resolve, reject) => {
      dispatch(getOfferDetailsWatcher( { loan_app_id: loan_app_id, company_id: company_id, product_id: product_id }, resolve, reject));
    })
      .then((response) => {
        offerDetails(response.data);
      })
      .catch((error) => {
      });

    const data = response.data;
    const LeadDetails = await getLeadDetails(loan_app_id);
    const LeadDetailsData = LeadDetails.data
    const CkycDetails = await getCkycDetails(loan_app_id);
    const CkycDetailsData = CkycDetails.data
    let age = calculateAge(LeadDetailsData.dob)
    setLeadStatus(LeadDetailsData.lead_status);
    if(data){
    data.customer_type_ntc = data?.customer_type_ntc ? data.customer_type_ntc === "Yes"? "NTC": "ETC": "NA";
    data.emi_allowed = data?.emi_allowed ? data.emi_allowed : "NA";
    data.loan_int_rate = data?.loan_int_rate ? data.loan_int_rate : "NA";
    data.tenure = data?.tenure ? data.tenure : "NA";
    data.txn_avg = data?.txn_avg ? data.txn_avg : "NA";
    data.sanction_amount = data?.sanction_amount ? data.sanction_amount : "NA";
    data.abb = data?.program_type === "Banking" ? (data?.abb ? data.abb : "NA") : "NA";
    data.monthly_income = data?.monthly_income ? data.monthly_income : "NA";
    data.foir = data?.foir ? data.foir : "NA";
    data.emi_obligation = data?.emi_obligation ? data.emi_obligation : "NA";
    data.avg_banking_turnover_6_months = data?.program_type === "Banking" ? (data?.avg_banking_turnover_6_months ? data.avg_banking_turnover_6_months : "NA") : "NA";
    data.bounces_in_three_month = data?.program_type === "Banking" ? (data?.bounces_in_three_month ? data.bounces_in_three_month : "NA") : "NA";
    }
    if(offerDetails?.program_type){
      data.program_type = offerDetails?.program_type ?? "NA"
    }
    setLoanDetails({...data, age: age})
    let customdata = {
      ...data,
      type_of_addr: LeadDetailsData.type_of_addr,
      resi_addr_ln1: LeadDetailsData.resi_addr_ln1,
      city: LeadDetailsData.city,
      state: LeadDetailsData.state,
      pincode: LeadDetailsData.pincode,
      appl_pan: LeadDetailsData.appl_pan,
      dob: LeadDetailsData.dob,
      Age: age ? age : "",
      father_fname: `${LeadDetailsData.father_fname ? LeadDetailsData.father_fname : ""} ${LeadDetailsData.father_mname ? LeadDetailsData.father_mname : ""} ${LeadDetailsData.father_lname ? LeadDetailsData.father_lname : ""}`,
      ckyc_number: CkycDetailsData[0]?.ckyc_number ? CkycDetailsData[0]?.ckyc_number : "",
      cbi_sanctioned_amount: 0.8 * data.sanction_amount ? 0.8 * data.sanction_amount : ""
    }
    setPayloadDataLoanDetails(customdata);
    setIsLoanDetailsAvailable(true)
    setShowLoanDetails(true)
    setShowRepaymentSchedule(false);
    setShowDocuments(false)
    setShowCamsDetails(false);
    setShowCreditEngine(false);
    setShowCreditEngineButton(false);
    if (!data) {
      setLoansAlert(true);
      setLoansAlertMessage("No data found for this loan_id")
      setSeverity("error")
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
  }


  const getVal = value => {
    if (value?.$numberDecimal !== undefined) {
      return parseFloat(value.$numberDecimal.toString());
    } else if (typeof value === "object") {
      return parseFloat(value.toString());
    }
    return value;
  };

  const headers = {
    "P&L": [0, 10],
    "Balance sheet": [10, 29],
    "Bank statement": [29, 56],
    Bureau: [56, 77],
    GST: [77, 106],
    ITR: [106, 115],
    "Business document/Loan application": [115, 131],
    "Transaction data": [131, 139],
    "FSA/Banking": [139, 147],
    Derived: [147, 149],
    "Other Details": [149, 159],
    "Udhyam Registration": [159, 183]
  };

  const headersLoanDetails = {
    "Customer Information": [0, 12],
    "Loan Summary": [12, 16],
    "Loan Detail": [16, 30],
    "Business Details": [30, 46],
    "Bureau Details": [46, 48]
  }

  const fetchCamsDetails = () => {
    new Promise((resolve, reject) => {
      dispatch(getCamsDetailsWatcher({ loan_app_id }, resolve, reject));
    })
      .then((response) => {
        setPayloadData(response.data);
        setIsCamsDetailsAvailable(true);
        setIsLoaded(true);
        if (response.data?.status === "confirmed") {
          setEditable(false);
        }
        if (response.data?.status === "open") {
          setShowEditButton(true);
          setEditable(false);
        }
      })
      .catch((error) => {
        setCamsAlert(true);
        setCamsAlertMessage(error?.response?.data?.message)
        setSeverity("error");
        setIsCamsDetailsAvailable(false);
        setIsLoaded(true);
        setEditable(true);
        setTimeout(() => {
          handleAlertClose();
        }, 3000);
      });
  };

  const handleClear = () => {
    const payload = {};
    setErrors([]);
    camsFormJsonFields().map((field) => {
      payload[field.name] = "";
    });
    setPayloadData(payload);
    setButtonTitle("Save");
    setShowEditButton(false);
    setEditable(true);
    setIsCamsDetailsAvailable(true);
  };

  const handleConfirmed = () => {
    payloadData.loan_app_id = loan_app_id;
    payloadData.company_id = company_id;
    payloadData.product_id = product_id;
    payloadData.user_id = user._id;
    payloadData.status = buttonTitle === "Save" ? "open" : "confirmed";

    new Promise((resolve, reject) => {
      dispatch(submitCamsDetailsWatcher(payloadData, resolve, reject));
    })
      .then((response) => {
        if (buttonTitle === "Submit") {
          setTimeout(() => {
            history.push("/admin/co_lending/co_lender_cases");
          }, 3000);
          setCamsAlert(true)
          setCamsAlertMessage(response?.message || "submitted")
          setSeverity("success")
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
        } else {
          setCamsAlert(true)
          setCamsAlertMessage(response?.message || "saved")
          setSeverity("success")
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
        }
      })
      .catch((error) => {
        setCamsAlert(true)
        setCamsAlertMessage(error?.response?.data?.message)
        setSeverity("error")
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  const handleSubmitAndSave = () => {
    if (errors.length) {
      setCamsAlert(true)
      setCamsAlertMessage("Please provide valid data")
      setSeverity("error")
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
      return;
    }

    if (buttonTitle === "Save") {
      setButtonTitle("Submit");
      setShowEditButton(true);
      setEditable(false);
      handleConfirmed();
    }
    if (buttonTitle === "Submit") setOpenPopup(true);
  };

  const handleEdit = () => {
    setEditable(true);
    setButtonTitle("Save");
    setShowEditButton(false);
  };

  const change = (event, field) => {
    const tempValueStorage = payloadData;
    tempValueStorage[field.name] = event.target.value;
    let validation = validateData(field.Type, event.target.value);
    if (validation || event.target.value === "") {
      const removeErrorFields = [];
      setPayloadData(tempValueStorage);
      errors?.forEach((error) => {
        if (error !== field.name) {
          removeErrorFields.push(error);
        }
      });
      setErrors(removeErrorFields);
    } else {
      const fieldName = field.name;
      const fieldNames = errors;
      fieldNames.push(fieldName);
      setErrors(Array.from(new Set(fieldNames)));
    }
  };

  const changeLoanDetails = (event, field) => {
    const tempValueStorage = payloadDataLoanDetails;
    tempValueStorage[field.name] = event.target.value;
    let validation = validateData(field.Type, event.target.value);
    if (validation || event.target.value === "") {
      const removeErrorFields = [];
      setPayloadDataLoanDetails(tempValueStorage);
      errors?.forEach((error) => {
        if (error !== field.name) {
          removeErrorFields.push(error);
        }
      });
      setErrorsLoanDetails(removeErrorFields);
    } else {
      const fieldName = field.name;
      const fieldNames = errors;
      fieldNames.push(fieldName);
      setErrorsLoanDetails(Array.from(new Set(fieldNames)));
    }
  };

  const [expanded, setExpanded] = useState(0);
  const handleChange = panel => {
    expanded !== panel ? setExpanded(panel) : setExpanded(false);
  };

  const response = async () =>
    await getCbiLoansDetails(loan_id).then((response) => {
      statusValue = response.data?.status;
      if (
        response.data?.status?.toUpperCase() === "APPROVED" ||
        response.data?.status?.toUpperCase() === "REJECTED"
      ) {
        setIsDisabled(true);
        setDisableHold(true);
      }
      if (
        (userRole === 'checker1') && (isApprovedOrRejectedStatusChcker1)
      ) {
        setIsDisabled(true);
        setDisableHold(true);
      }
      if (response.data?.status?.toUpperCase() === "HOLD") {
        setDisableHold(true);
      }
    });

  const handleDecision = (status, remarks) => {
    setOpen(false);
    setRejectOpen(false);
    setApproveOpen(false);
    setSendToOpen(false);
    const payload = {
      status: status,
      loan_id: loan_id,
      remarks: remarks,
      user_id: user._id,
    };
    new Promise((resolve, reject) => {
      dispatch(updateStatusWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setLoansAlert(true)
        setLoansAlertMessage(`Loan ${status} Successfully`)
        setSeverity("success")
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
        handleLoanDetails();
        if (
          (userRole === 'checker1') && (isApprovedOrRejectedStatusChcker1)
        ) {
          setIsDisabled(true);
          setDisableHold(true);
        }

        else if (
          status.toUpperCase() === "APPROVED" ||
          status.toUpperCase() === "REJECTED"
        ) {
          setIsDisabled(true);
          setDisableHold(true);
        }
       
       else if (status.toUpperCase() === "HOLD") {
          setDisableHold(true);
        }
      })
      .catch((error) => {
        setLoansAlert(true)
        setLoansAlertMessage(error.response.data.message)
        setSeverity("error")
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  const handleStatusCss = (status) => {
    let content;
    switch (status) {
        case 'Approved':
            content = { display: "flex",width:"fit-content", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-success-50, #008042)", color: "var(--utility-success-50, #008042)", background: "var(--utility-success-0, #EEFFF7)" }
            break;
        default:
            content = {}
            break;
    }
    return content
}

  const sampleData = repaymentScheduleList.map((item, index)  => ({
    "INST. NO.":`${item.emi_no}`,
    "LOAN ID": item.loan_id,
    "SUB LOAN ID": product?.isLoc ? (
                            `${item?.sub_loan_id}`
                        ) : "",
    "AMOUNT DUE": new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(item?.emi_amount)),
    "PRINCIPAL": new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(item?.prin)),
    "INTEREST": new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(item?.int_amount)),
    "DUE DATE": moment(item?.due_date).format("DD-MM-YYYY")
  }));

  const tableCss = {fontSize:"14px",fontFamily: "Montserrat-Medium",fontWeight: "500",color:"var(--neutral-neutral-100, #161719)"}
  const tableColumnCss = {fontFamily:"Montserrat-Semibold",fontSize:"14px",fontWeight:"600",color:"var(--neutral-60, #767888)"}

  var bre_data =  breDetails.length ?  breDetails?.map((item, index)  => ({
   "RULE ID": <div style={tableCss}> {item["rule-code"] ? item["rule-code"] : "NA"} </div>,
   "RULE DESCRIPTION":<div style={tableCss}>{item["rule-description"] ? item["rule-description"] : "NA"}</div>,
   "FORMULA":<div style={tableCss}>{formulaTODisplay[item["rule-description"]] ? formulaTODisplay[item["rule-description"]] : "NA"}</div>,
   "CALCULATION":<div style={tableCss}>{calculationTODisplay[item["rule-description"]] ? calculationTODisplay[item["rule-description"]] : "NA"}</div>,
   "STATUS" : <div style={handleStatusCss(statusToDisplay[item["action"]?.toUpperCase()])}>{item["action"] ? statusToDisplay[item["action"]?.toUpperCase()] : "NA"}</div>
  })) : [];

  const handleCloseSubmit = () => {
    handleDecision("Approved", "");
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleCloseHold = () => {
    setOpen(true);
    setStatus("Hold");
  };
  const handleCloseReject = () => {
    setRejectOpen(true);
    setStatus("Rejected");
  };

  const handleCloseSendTo = () => {
    setSendToOpen(true);
    setStatus("Request_Sent");
  };
  const handleCloseApprove = () => {
    setApproveOpen(true);
    setStatus("Approved");
    
  };
  const handleClick = () => {
    setLoanData({
      loan_id: loan_id,
      company_id: company_id,
      product_id: product_id
    });
    setStatementOfAccount(true);
  }

  const handleClose = (message, type) => {
    if (message) {
      showAlert(message, type);
    }
  };

  const isRemarksEmpty = remarks.trim() === '';
  const isRejectRemarksEmpty = rejectRemarks.trim() === '';
  const isApproveRemarksEmpty = approveRemarks.trim() === '';
  const isSendToRemarksEmpty = SendToRemarks.trim() === '';

  const OnHoldButton= ()=>(
    <Button 
          label='Hold' 
          buttonType='secondary' 
          customStyle={{
            width:"101px",
            height:"41px",
            fontSize:"12px",
            borderRadius:"26px",
            boxShadow:"none",
            marginTop:"10px",
            borderColor:disableHold ||
              statusValue.toUpperCase() === "APPROVED" ||
              statusValue.toUpperCase() === "REJECTED" ||
              statusValue.toUpperCase() === "HOLD"
              ? "#FFF"
              : "#FFF",
          backgroundColor:
            disableHold ||
              statusValue.toUpperCase() === "APPROVED" ||
              statusValue.toUpperCase() === "REJECTED" ||
              statusValue.toUpperCase() === "HOLD"
              ? "#FFF"
              : "#FFF",
            cursor: disableHold ||
              statusValue.toUpperCase() === "APPROVED" ||
              statusValue.toUpperCase() === "REJECTED" ||
              statusValue.toUpperCase() === "HOLD"
              ? "not-allowed"
              : "pointer",
          color: "#475BD8",
          marginRight: "0px"}} 
          onClick={handleCloseHold}
          isDisabled={disableHold}
      />
  )
  const OnRejectButton = () =>(
    <Button 
          label='Reject' 
          buttonType='secondary' 
          customStyle={{
            width:"101px",
            height:"41px",
            fontSize:"12px",
            borderRadius:"26px",
            marginTop:"10px",
            boxShadow:"none",
          borderColor:isDisabled ||
              statusValue.toUpperCase() === "APPROVED" ||
              statusValue.toUpperCase() === "REJECTED"
              ? "#D84747"
              : "#D84747",
              cursor: isDisabled ||
              statusValue.toUpperCase() === "APPROVED" ||
              statusValue.toUpperCase() === "REJECTED" ||
              statusValue.toUpperCase() === "Request_Sent"
              ? "not-allowed"
              : "pointer",
          backgroundColor:
            isDisabled ||
              statusValue.toUpperCase() === "APPROVED" ||
              statusValue.toUpperCase() === "REJECTED"
              ? "#FFF"
              : "#FFF",
          color: "#D84747",
          marginRight: ""}} 
          onClick={handleCloseReject}
          isDisabled={isDisabled}
      />
  )

  const OnApproveButton = () => {
    let buttonRadius = "26px";
    let buttonMarginRight="40px"
    let backgroundColorIs="#008042"
  
    if (userRole === 'checker1') {
      buttonRadius = "26px 0px 0px 26px";
      buttonMarginRight ="3px"
      backgroundColorIs="#008042"
    }
  
    return (
      <Button 
        label='Approve' 
        buttonType='secondary' 
        customStyle={{
          width: "101px",
          height: "41px",
          fontSize: "12px",
          marginTop:"10px",
          boxShadow:"none",
          borderRadius: buttonRadius,
          borderColor: isDisabled ||
            statusValue.toUpperCase() === "APPROVED" ||
            statusValue.toUpperCase() === "REJECTED"
            ? backgroundColorIs
            : backgroundColorIs,
            cursor: isDisabled ||
              statusValue.toUpperCase() === "APPROVED" ||
              statusValue.toUpperCase() === "REJECTED" ||
              statusValue.toUpperCase() === "Request_Sent"
              ? "not-allowed"
              : "pointer",
          backgroundColor: isDisabled ||
            statusValue.toUpperCase() === "APPROVED" ||
            statusValue.toUpperCase() === "REJECTED"
            ? backgroundColorIs
            : backgroundColorIs,
          color: "#FFF",
          marginRight: buttonMarginRight,
        }} 
        onClick={handleCloseApprove}
        isDisabled={isDisabled}
      />
    );
  }
  

  const renderMoreOptions = () => (
    <div>
    {userRole === 'maker' &&
      <div style={{display:"flex", flexDirection:"row",float:"right"}}>
      {isApprovedOrRejectedStatus ? null : (
        <>
        {isHoldStatus  ? null :
          <OnHoldButton/>
        }
       <OnRejectButton/>
       <OnApproveButton/>
          </>
          )
        }
      </div>}
      

        {/* condition for checker1 */}
      {userRole === 'checker1' &&
      <div style={{display:"flex", flexDirection:"row",float:"right"}}>
      {(!isApprovedOrRejectedStatus) ? null : (
        <>
        {((!isApprovedOrRejectedStatus) && isHoldStatusChecker1) ? null :
          <OnHoldButton/>
        }
        <OnRejectButton/>

        <OnApproveButton/>
          <div>
        <Button 
          label='' 
          imageButton={downArrowSign}
          imageButtonHover={downArrowSign}
          iconButton='btn-secondary-download-button'
          buttonType='secondary' 
          customStyle={{
            width:"51px",
            height:"41px",
            fontSize:"12px",
            borderRadius:"0px 26px 26px 0px",
            padding:"2px",
            marginTop:"10px",
            boxShadow:"none",
          borderColor:isDisabled ||
              statusValue.toUpperCase() === "APPROVED" ||
              statusValue.toUpperCase() === "REJECTED"
              ? "#008042"
              : "#008042",
          backgroundColor:
            isDisabled ||
              statusValue.toUpperCase() === "APPROVED" ||
              statusValue.toUpperCase() === "REJECTED"
              ? "#008042"
              : "#008042",
              cursor: isDisabled ||
              statusValue.toUpperCase() === "APPROVED" ||
              statusValue.toUpperCase() === "REJECTED" ||
              statusValue.toUpperCase() === "HOLD"
              ? "not-allowed"
              : "pointer",
          color: "#D84747",
          marginRight: "25px"}} 
          onClick={toggleList}
          isDisabled={isDisabled}
      />
          {isListOpen && !isApprovedOrRejectedStatusChcker1  && (
        <ul onClick={handleCloseSendTo} style={{listStyleType:"none" , height:"52px" , borderColor:"#EDEEF2" , border:"1px solid #EDEEF2" , borderRadius:"8px" , display:"flex" , justifyContent:"center" , alignItems:"center" , cursor:"pointer" , boxShadow:"0px 2px 8px 0px rgba(0, 0, 0, 0.15)" , padding:"16px" , marginRight:"25px", position:"absolute"  ,right:initialArrowSign === rightArrowSign ? "24.5%" : "2.5%", marginTop:"4px"}}>
          <li>Send to Checker 2</li>
        </ul>
      )}

      </div>
          </>
          )
        }
      </div>}

       {/* condition for checker1 */}
       {userRole === 'checker2' &&
      <div style={{display:"flex", flexDirection:"row",float:"right"}}>
      {((!isApprovedOrRejectedStatusChcker1) || (!isApprovedOrRejectedStatus))? null : (
          <>
        <OnHoldButton/>
        <OnRejectButton/>
        <OnApproveButton/>
          </>
          )
        }
      </div>}

      <div style={{alignItems:"center"}}>
        {open ? (
        <FormPopup
          heading="Remarks"
          isOpen={open}
          onClose={handleCancel}
          customHeaderStyle={stylePopupHeader}
          customStyles={stylePopup}
          customStyles1={stylePopupChild}
        >
        <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "32px"
            }}
          >
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
              label={<div>Reason<span style={{ color: "red" }}>{commentstyle}</span></div>}
              variant="outlined"
              type="text"
              placeholder="Comment"
              multiline={true}
              minRows={6}
              size="medium"
              value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
            }}

            />
          </div>
          <div
            style={{
              display: "flex",
              paddingBottom: "8px"
            }}
          >
            <Button
              label="Cancel"
              buttonType="secondary"
              onClick={() => {
                setOpen(false)
                setRemarks("")
              }}
              customStyle={{
                ...styleButton,
                color: "#475BD8",
                border: "1px solid #475BD8",
                boxShadow: "none"
              }}
            />
            <Button
              label="Submit"
              buttonType="secondary"
              customStyle={{
                ...styleButton,
                color:  "#FFF" ,
                backgroundColor:  "#C00" ,
                border: "none",
                boxShadow: "none"
              }}
              isDisabled={isRemarksEmpty}
              onClick={() => handleDecision(status, remarks)}
            />
          </div>
        </FormPopup>
      ) : (
        <div></div>
      )}
      </div>
    </div>
  );

  const handleBackArrow = (event) => {
    window.open(
      `/admin/co_lending/co_lender_cases`,
      "_self"
    );
  }

  const changeActiveTab = (tabName) => {
  const tabClickHandlers = {
    'loan details': handleLoanDetails,
    'documents': handleDocuments,
    'cams details': handleCamsDetails,
    'repayment schedule': handleRepaymentSchedule,
    'bre': handleCreditEngine,
  };
  const tabClickHandler = tabClickHandlers[tabName];
  
  if (tabClickHandler) {
    tabClickHandler();
  }
};

const popupContainerStyles = {
    position: "fixed",
    top: "50%",
    right: 0, 
    transform: "translateY(-50%)",
    overflow:"hidden",
    width:"27%" ,
    maxWidth:"27%",
    zIndex: 100000000,
    marginLeft:"23%",
    maxHeight:"100%",
    height:"100%"
  };

const containerStyleImg = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '53vh',
    borderRadius: "35px",
    marginLeft: "15%",
    marginRight: "25%",
    marginTop: "60px",
    gap:"80px"
};

const imageStyle = {
  marginTop: "5vh",
  width: '100%',
  maxWidth: '400px',
  height: 'auto',
};

  return (
    <>
      {statementOfAccount ? (
        <div >
          <StatementOfAccount
            data={loanData}
            onModalClose={handleClose}
            openDialog={statementOfAccount}
            setOpenDialog={setStatementOfAccount}
          />
        </div>
      ) : null}
      <div    style={showRepaymentSchedule ? null : { display: "grid", gridTemplateColumns: "1fr auto" , overflow:"auto" }}>
      {rejectOpen
      ? (
        <FormPopup
          isOpen={true}
          heading="Reject"
          onClose={() => {
            setRejectOpen(false);
            setRejectRemarks("")
          }}
          customHeaderStyle={stylePopupHeader}
          customStyles={stylePopup}
          customStyles1={stylePopupChild}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "32px"
            }}
          >
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
              label={<div>Comment<span style={{ color: "red" }}>{commentstyle}</span></div>}
              variant="outlined"
              type="text"
              placeholder="Comment"
              multiline={true}
              minRows={6}
              size="medium"
              value={rejectRemarks}
            onChange={(e) => {
              setRejectRemarks(e.target.value);
            }}

            />
          </div>
          <div
            style={{
              display: "flex",
              paddingBottom: "8px"
            }}
          >
            <Button
              label="Cancel"
              buttonType="secondary"
              onClick={() => {
                setRejectOpen(false);
                setRejectRemarks("")
              }}
              customStyle={{
                ...styleButton,
                color: "#475BD8",
                border: "1px solid #475BD8",
                boxShadow: "none"
              }}
            />
            <Button
              label="Reject"
              buttonType="secondary"
              customStyle={{
                ...styleButton,
                color:  "#FFF" ,
                backgroundColor:  "#C00" ,
                border: "none",
                boxShadow: "none"
              }}
              isDisabled={isRejectRemarksEmpty}
              onClick={() => handleDecision(status, rejectRemarks)}
            />
          </div>
        </FormPopup>
      ) : null}
      {approveOpen
      ? (
        <FormPopup
          isOpen={true}
          heading="Approve"
          onClose={() => {
            setApproveOpen(false);
            setApproveRemarks("");
          }}
          customHeaderStyle={stylePopupHeader}
          customStyles={stylePopup}
          customStyles1={stylePopupChild}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "32px"
            }}
          >
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
              label={<div>Comment<span style={{ color: "red" }}>{commentstyle}</span></div>}
              variant="outlined"
              type="text"
              placeholder="Comment"
              multiline={true}
              minRows={6}
              size="medium"
              value={approveRemarks}
            onChange={(e) => {
              setApproveRemarks(e.target.value);
            }}
            />
          </div>
          <div
            style={{
              display: "flex",
              paddingBottom: "8px"
            }}
          >
            <Button
              label="Cancel"
              buttonType="secondary"
              onClick={() => {
                setApproveOpen(false);
                setApproveRemarks("");
              }}
              customStyle={{
                ...styleButton,
                color: "#475BD8",
                border: "1px solid #475BD8",
                boxShadow: "none"
              }}
            />
            <Button
              label="Approve"
              buttonType="primary"
              customStyle={{
                ...styleButton,
                color:  "#FFF" ,
                backgroundColor:  "#475BD8" ,
                boxShadow: "none"
              }}
              isDisabled={isApproveRemarksEmpty}
              onClick={() => handleDecision(status, approveRemarks)}
            />
          </div>
        </FormPopup>
      ) : null}
      {sendToOpen
      ? (
        <FormPopup
          isOpen={true}
          heading="Send to Checker 2"
          onClose={() => {
            setSendToOpen(false);
            setSendToRemarks("")
          }}
          customHeaderStyle={stylePopupHeader}
          customStyles={stylePopup}
          customStyles1={stylePopupChild}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "32px"
            }}
          >
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
              label={<div>Comment<span style={{ color: "red" }}>{commentstyle}</span></div>}
              variant="outlined"
              type="text"
              placeholder="Comment"
              multiline={true}
              minRows={6}
              size="medium"
              value={SendToRemarks}
            onChange={(e) => {
              setSendToRemarks(e.target.value);
            }}
              
            />
          </div>
          <div
            style={{
              display: "flex",
              paddingBottom: "8px"
            }}
          >
            <Button
              label="Cancel"
              buttonType="secondary"
              onClick={() => {
                setSendToOpen(false);
            setSendToRemarks("")
              }}
              customStyle={{
                ...styleButton,
                color: "#475BD8",
                border: "1px solid #475BD8",
                boxShadow: "none",
                 fontSize:"14px"
              }}
            />
            <Button
              label="Submit"
              buttonType="secondary"
              customStyle={{
                ...styleButton,
                color:  "#FFF" ,
                backgroundColor:  "#475BD8" ,
                border: "none",
                boxShadow: "none" , 
                fontSize:"14px"
              }}
              isDisabled={isSendToRemarksEmpty}
              onClick={() => handleDecision(status, SendToRemarks)}
            />
          </div>
        </FormPopup>
      ) : null}

      
  <div style={{marginBottom:"100px"}} >   
      <div>
        <div>
          <CustomizeTemplates
                  marginLeft="24px"
                  templatesdata={['Loan Details','Documents','BRE','Cams Details','Repayment Schedule']}
                  initialState = {'Loan Details'}
                  onIndexChange={changeActiveTab}
          />
        </div>
        <div style={{display:"flex",float:"right" , marginRight:"209px"}}>
        {showRepaymentSchedule === true ? (
        <InputBox 
          label='Repayment Schedule Type'
          customClass={{height:"55px",width:"220px",marginRight:"-182px"}}
          customDropdownClass={{zIndex:1,marginTop:"8px",width:"220px",minHeight:"100px"}}
          isDrawdown={true}
          options={[ {"label":"AFIPL","value":"AFIPL"},
          {"label":"Co-Lender","value":"Co-Lender"}]}
          onClick={handleDropdownChange}
          initialValue={'AFIPL'}
        />
        ) : null}
      </div>
      {showRepaymentSchedule ?
        <>
          {repaymentScheduleAlert ? (
            <AlertBox
              severity={severity}
              msg={repaymentScheduleAlertMessage}
              onClose={handleAlertClose}
            />
          ) : null}
          <div style={{marginTop:"80px"}}>
            <Table customStyle={{marginLeft:"24px" ,width:"97%" ,display:"grid" ,gridTemplateColumns:"10% 19% 9% 16% 15% 15% 14%"}}
            
          columns={[
            { id: 'INST. NO.', label: 'INST. NO.' },
            { id: 'LOAN ID', label: 'LOAN ID' },
            product?.isLoc ? (
                     { id: 'SUB LOAN ID', label: 'SUB LOAN ID' }
                    ) : "",
           
            { id: 'AMOUNT DUE', label: 'AMOUNT DUE' },
            { id: 'PRINCIPAL', label: 'PRINCIPAL' },
            { id: 'INTEREST', label: 'INTEREST' },
            {id:'DUE DATE', label:'DUE DATE'}
             ]} data={sampleData} />
            <Pagination itemsPerPage={10} totalItems={count} rowsPerPageOptions={[10]} onPageChange={handleChangePage}/>
            </div>
        </>
        : null}

      <div>
      {noData ? (
        <AlertBox
          severity={"error"}
          msg={"No data found for this Loan Id! "}
          onClose={handleAlertClose}
        />
      ) : null}
      </div>
     <div>
     {showCamsDetails ? (
        <>
         {productData.is_msme_automation_flag === "Y" ? <CamsSection leadStatus={leadStatus} companyId={companyId} productId={productId} loanAppId={loan_app_id} isMsme={true}/> : 
         <>
          {camsAlert ? (
            <AlertBox
              severity={severity}
              msg={camsAlertMessage}
              onClose={handleAlertClose}
            />
          ) : null}
          {showEditButton ? (
            <Grid display={"flex"} justifyContent={"end"}>
              <Grid item>
                <Button onClick={handleEdit} label='Edit details' buttonType='primary'/>
              </Grid>
            </Grid>
          ) : null}
          {openPopup ? (
            <ConfirmationPopup
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
              header={"Submit details"}
              confirmationMessage={"After submit you cannot edit the details."}
              handleConfirmed={handleConfirmed}
              yes={"Yes"}
              no={"No"}
            />
          ) : null}
          <Accordion accordionData={newCamArray}
	           customClass={{marginLeft:"24px",marginTop:"60px", width:"96%"}}/>
          <Grid
            className="mt-5"
            style={{ justifyContent: "center", cursor: "pointer" }}
            xs={12}
            container
            spacing={2}
            sx={{ margin: 0 }}
          >
          </Grid>
          </>
        }
        </>
      ) : null}
     </div>

            {/* <div>
            {showLoanDetails ? renderMoreOptions() : null}
            </div> */}

            <div>
            {showLoanDetails ? (
        <>
          {loansAlert ? (
            <AlertBox
              severity={severity}
              msg={loansAlertMessage}
              onClose={handleAlertClose}
            />
          ) : null}
          <Accordion accordionData={newArray}
	           customClass={{marginLeft:"24px",marginTop:"40px", width:initialArrowSign === rightArrowSign ? "95%" : "96%",display:"flex",flexDirection:"column"}}/>
        </>
      ) : null}
            </div>
            <div>
            {showDocuments ? (
          <div>
            <div style={{marginTop: "0px", marginRight: "25px", float: "right" }}>
              <Button label=' Download Documents'
                customStyle={{height:"40px",width:"100%",borderRadius:"26px",fontSize:"12px",border: "1px solid #475BD8",color: "#475BD8",
        fontFamily:"Montserrat-Regular",padding:"10px 24px",backgroundColor:"#FFF"}}
                onClick={downloadAllDocument}
                imageButton={Img} imageButtonHover={imgH} iconButton="btn-secondary-download-button"
                buttonType='secondary'/>
            </div>
            <div style={{marginTop: "50px"}}>
              <LoanDocList />
            </div>
          </div>
      ) : null}
            </div>

            <div style={{margin:"40px 24px 24px 24px"}}>
            {showCreditEngine ? (
          <>
          <Accordion accordionData={breData} customAccordionCell={{marginBottom:"24px"}}/>
          <div style={{marginTop:"30px"}}>
            <Table customStyle={{width:"100%",height:"auto",display: "grid",gridTemplateColumns: "8% 28% 28% 25% 11%",overflowX: "hidden",marginLeft:"0px"}}
            customCellCss={{width:"fit-content",marginLeft:"5px"}}
          columns={[
            { id: 'RULE ID', label: (<div style={tableColumnCss}>RULE ID</div>) },
            { id: 'RULE DESCRIPTION', label: (<div style={tableColumnCss}>RULE DESCRIPTION</div>) },
            {id:'FORMULA',label: (<div style={tableColumnCss}>FORMULA</div>)},
            {id:'CALCULATION',label: (<div style={tableColumnCss}>CALCULATION</div>)},
            { id: 'STATUS', label: (<div style={tableColumnCss}>STATUS</div>)}
             ]} data={bre_data} />
          </div>
          </>
      ): null}
            </div>
            <div>
            {showCreditEngineButton ? (
              <>
              {alert ? (
                <AlertBox
                  severity={severity}
                  msg={alertMessage}
                  onClose={handleAlertClose}
                />
              ) : null}
            <div style={containerStyleImg}>
              <div><img src={LeadLoanLineImage} alt="Lead Image" style={imageStyle} /></div>
              <div>
                <Button
                label='Run BRE'
                onClick={runCreditEngine}
                buttonType='primary'
                customStyle={{height: "56px", padding: "13px 44px", borderRadius: "8px", fontSize: "16px" }}
                />
              </div>
           </div>
           </> 
      ) : null}
            </div>

            <div style={{marginTop:"10px"}}>
            {showLoanDetails ? renderMoreOptions() : null}
            </div>
      </div>
      </div>
        {showLoanDetails ?
      <div style={containerStyle}>
      <div>
        <span style={{ cursor: "pointer" , marginLeft:"-22px" }} onClick={handleSignChange}>
        <img style={{width:"44px" , height:"44px" , background:"white" , borderRadius:"25px" ,padding:"10px" , boxShadow:"0px 2px 8px 0px rgba(0, 0, 0, 0.15)"}} src={initialArrowSign} alt="svg icon" />
        </span>
      </div>
      {showHelp && <div style={{color: "#9EA2B3" , padding:"20px" , marginTop:"18px"}}>
      <div style={{fontSize:"12px",fontFamily:"Montserrat-SemiBold"}}>AUDIT LOG</div>
      <div> 
               { auditArray.map((item)=>(
                <>
                  <div style={{marginTop:"24px" , color:"#161719", fontSize:"16px" , fontFamily:"Montserrat-SemiBold"}}>{item?.status==="Request_Sent" ? "Send to checker 2" :item?.status}</div>
                  <div style={{marginTop:"6px" , fontSize:"14px" , fontFamily:"Montserrat-Medium"}}> <span style={{color:"#161719"}}>Name: </span> <span style={{color:"#767888"}}> {item?.updated_by}</span>  </div>
                  <div style={{marginTop:"6px", fontSize:"14px", fontFamily:"Montserrat-Medium"}}> <span style={{color:"#161719"}}>Role: </span> <span style={{color:"#767888"}}>{item.role.charAt(0).toUpperCase() + item.role.slice(1)}</span> </div>
                  <div style={{marginTop:"6px", fontSize:"14px", fontFamily:"Montserrat-Medium"}}> <span style={{color:"#161719"}}>Date & Time: </span>  <span style={{color:"#767888"}}>{moment(item?.updated_at).format("DD-MM-YYYY, hh:mm A")}</span> </div>
                  <div style={{marginTop:"6px", fontSize:"14px", fontFamily:"Montserrat-Medium"}}> <span style={{color:"#161719" }}>Comment: </span><span style={{color:"#767888"}}>{item?.comment}</span></div>
                  </>
                ))}
      </div>
      </div>
      }
    </div> : null}
    </div>
      {isLoading && <Preloader />}
    </>
  )
}

export default viewColendingApproval

import React, { useEffect, useState } from 'react';
import Table from "react-sdk/dist/components/Table/Table"
import "react-sdk/dist/styles/_fonts.scss";
import Accordian from "react-sdk/dist/components/Accordion/Accordion";
import CustomInputBox from "react-sdk/dist/components/InputBox/InputBox"
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import { useParams } from 'react-router-dom';
import { storedList } from "../../util/localstorage";
import {
    singleNachDetailWatcher,
    enachTransactionHistotryWatcher,
    nachHoldRegistrationWatcher,
    nachRevokeRegistrationWatcher,
    cancelNachRegistrationWatcher
} from "../../actions/enach";
import { useDispatch } from "react-redux";
import InfoIcon from '../../assets/img/info-circle.svg'
import { AlertBox } from "../../components/CustomAlertbox";
import { checkAccessTags } from "../../util/uam";
import moment from "moment";
import PresentmentCreation from './PresentmentPopupComponent';
import Tooltip , { tooltipClasses }  from "@mui/material/Tooltip";
import { styled } from '@mui/material/styles';
import ConfirmationPopup from "react-sdk/dist/components/Popup/ConfirmationPopup";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'white',
    color: "black",
    maxWidth: 180,
    fontSize:"12px",
    border: '1px solid #e5efe8',
    padding:"10px",
    fontFamily: "Montserrat-Regular" ,
    boxShadow: theme.shadows[2]
  },
}));
const user = storedList("user");

const headingCSS = {
color: "var(--neutral-neutral-100, #141519)",
fontFamily: "Montserrat-Regular",
fontSize: "18px",
fontStyle: "normal",
fontWeight: "600",
lineHeight: "150%",
marginLeft: "24px",
marginTop : "40px"
}
const inputBoxCss = {
    marginTop: "10px",
    width: "328px",
    marginLeft: "-208px",
    zIndex: 1,
    minHeight : "168px",
    color: "var(--neutral-neutral-100, #141519)"
  }


const ensachSubscription = () => {
  const dispatch = useDispatch();
    const [ singleNachDetail , setSingleNachDetail] = useState([]);
const { request_id } = useParams();
const [alert, setAlert] = useState(false);
const [alertMessage, setAlertMessage] = useState("");
const [severity, setSeverity] = useState("");
const [company, setCompany] = useState(null);
const [companyUser, setCompanyUser] = useState(false);
const [txnData , setTxnData] = useState([]);
const [nachStatus , setNachStatus] = useState("");
const [selectedStatus, setStatus] = useState("");
const [page, setPage] = useState(1);
const [count, setCount] = useState("");
const [rowstxnHistoryPerPage, setRowsTxnHistoryPerPage] = useState(10);
const [isOpen , setIsOpen] = useState(false);
const [company_id_subscription , setCompany_id_subscription] = useState("");
const [registrationId ,setRegistrationId] = useState("");
const [presentmentData, setPresentmentData] = useState({
  scheduledOndate : null,
  amount : null,
  remark : "",
  UMRN : "",
  subscriptionId : ""
 })
const [openExitPopup , setOpenExitPopup] = useState(false);
const [isCancelled,setIsCancelled] = useState(false)


const handleHoldRegistration =() => {
  const payload = {
      user_id: user?._id,
      company_id: user?.value,
      registrationId: registrationId
  };
  new Promise((resolve, reject) => {
      dispatch(nachHoldRegistrationWatcher(payload, resolve, reject));
  }).then(() => {
      showAlert( "Your registration has been updated to on hold successfully", "success");
      fetchSingleNachDetail(page, rowstxnHistoryPerPage)
  }).catch((error) => {
      showAlert(error?.response?.data?.message || "Error occurred during updating registration to hold", "error");
  });
}

const handleRevokeRegistration =() => {
  const payload = {
      user_id: user?._id,
      company_id: user?.value,
      registrationId: registrationId
  };
  new Promise((resolve, reject) => {
      dispatch(nachRevokeRegistrationWatcher(payload, resolve, reject));
  }).then(() => {
      showAlert("Your suspension has been revoked successfully", "success");
      fetchSingleNachDetail(page, rowstxnHistoryPerPage)
  }).catch((error) => {
      showAlert(error?.response?.data?.message || "Error occurred during revoking suspension", "error");
  });
}

const isTagged =
process.env.REACT_APP_BUILD_VERSION > 1
    ? user?.access_metrix_tags?.length
    : false;

    const statusMappings = {
        "NEW" : "In Progress",
        "null" : "In Progress",
        "F" : "Failed",
        "I" :"In Progress",
        "S" : "Success",
        "open": "Open",
        "mandate_initiated": "In Progress",
        "callback_fail": "Failed",
        "amend_initiated": "Amend In Progress",
        "amend_success": "Amend In Progress",
        "amend_fail": "On Hold",
        "cancel_initiated": "Cancellation In Progress",
        "cancel_success": "Cancelled",
        "cancel_fail": "Cancellation In Progress",
        "fail": "Failed",
        "rejected": "Failed",
        // "duplicate": ?(not yet decided)
        "success": "In Progress",
        "callback_success": "In Progress",
        "suspend": "On Hold",
        "active": "Active",
        "cancel" : "Cancelled",
        "amend_requested": "Amend In Progress",
        "cancel_requested": "Cancellation In Progress",
        "expired": "Expired",
    }
    
      const handleStatusCss = (status) => {
        let content;
        switch (status) {
            case 'Open':
                content = { display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--primary-50, #475BD8)", color: "var(--primary-50, #475BD8)", background: "var(--primary-0, #EDEFFB)" }
                break;
            case 'Success':
                content = { display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-success-50, #008042)", color: "var(--utility-success-50, #008042)", background: "var(--utility-success-0, #EEFFF7)" }
                break;
            case 'In Progress':
                content = { display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-warning-20, #DB8400)", color: "var(--utility-warning-20, #DB8400)", background: "var(--utility-warning-0, #FFF5E6)" }
                break;
            case 'Cancelled':
                content = { display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-danger-30, #B30000)", color: "var(--utility-danger-30, #B30000)", background: "var(--utility-danger-0, #FFECEC)" }
                break;
            case 'On Hold':
                content = { display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-warning-20, #DB8400)", color: "var(--utility-warning-20, #DB8400)", background: "var(--utility-warning-0, #FFF5E6)" }
                break;
            case 'Failed':
                content = { display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-danger-30, #B30000)", color: "var(--utility-danger-30, #B30000)", background: "var(--utility-danger-0, #FFECEC)" }
                break;
            case 'Amend In Progress':
                content = { display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-warning-20, #DB8400)", color: "var(--utility-warning-20, #DB8400)", background: "var(--utility-warning-0, #FFF5E6)" }
                break;
            case 'Cancellation In Progress':
                content = { textAlign:"center", display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-danger-30, #B30000)", color: "var(--utility-danger-30, #B30000)", background: "var(--utility-danger-0, #FFECEC)" }
                break;
            default:
                content = {}
                break;
        }
        return content
    }


    const handleTopStatusCss = (status) => {
      let content;
      switch (status) {
          case 'Open':
              content = {width:"fit-content", height:"40px", display: "flex", padding: "8px 22px", justifyContent: "center", alignItems: "center", borderRadius: "8px", border: "1px solid var(--primary-50, #475BD8)", color: "var(--primary-50, #475BD8)", background: "var(--primary-0, #EDEFFB)", fontWeight: "600" }
              break;
          case 'Active':
              content = {width:"fit-content", height:"40px", display: "flex", padding: "8px 22px", justifyContent: "center", alignItems: "center", borderRadius: "8px", border: "1px solid var(--utility-success-50, #008042)", color: "var(--utility-success-50, #008042)", background: "var(--utility-success-0, #EEFFF7)", fontWeight: "600" }
              break;
          case 'In Progress':
              content = {width:"fit-content", height:"40px", display: "flex", padding: "8px 22px", justifyContent: "center", alignItems: "center", borderRadius: "8px", border: "1px solid var(--utility-warning-20, #DB8400)", color: "var(--utility-warning-20, #DB8400)", background: "var(--utility-warning-0, #FFF5E6)", fontWeight: "600" }
              break;
          case 'Cancelled':
              content = {width:"fit-content", height:"40px", display: "flex", padding: "8px 22px", justifyContent: "center", alignItems: "center", borderRadius: "8px", border: "1px solid var(--utility-danger-30, #B30000)", color: "var(--utility-danger-30, #B30000)", background: "var(--utility-danger-0, #FFECEC)", fontWeight: "600" }
              break;
          case 'On Hold':
              content = {width:"fit-content", height:"40px", display: "flex", padding: "8px 22px", justifyContent: "center", alignItems: "center", borderRadius: "8px", border: "1px solid var(--utility-warning-20, #DB8400)", color: "var(--utility-warning-20, #DB8400)", background: "var(--utility-warning-0, #FFF5E6)", fontWeight: "600" }
              break;
          case 'Failed':
              content = {width:"fit-content", height:"40px", display: "flex", padding: "8px 22px", justifyContent: "center", alignItems: "center", borderRadius: "8px", border: "1px solid var(--utility-danger-30, #B30000)", color: "var(--utility-danger-30, #B30000)", background: "var(--utility-danger-0, #FFECEC)", fontWeight: "600" }
              break;
          case 'Amend In Progress':
              content = {width:"fit-content", height:"40px", display: "flex", padding: "8px 22px", justifyContent: "center", alignItems: "center", borderRadius: "8px", border: "1px solid var(--utility-warning-20, #DB8400)", color: "var(--utility-warning-20, #DB8400)", background: "var(--utility-warning-0, #FFF5E6)", fontWeight: "600" }
              break;
          case 'Cancellation In Progress':
              content = { height:"40px", display: "flex", padding: "8px 22px", justifyContent: "center", alignItems: "center", borderRadius: "8px", border: "1px solid var(--utility-danger-30, #B30000)", color: "var(--utility-danger-30, #B30000)", background: "var(--utility-danger-0, #FFECEC)", fontWeight: "600" }
              break;
          case 'Expired':
              content = {width:"fit-content", height:"40px", display: "flex", padding: "8px 22px", justifyContent: "center", alignItems: "center", borderRadius: "8px", border: "1px solid var(--utility-danger-30, #B30000)", color: "var(--utility-danger-30, #B30000)", background: "var(--utility-danger-0, #FFECEC)", fontWeight: "600" }
              break;
          default:
              content = {}
              break;
      }
      return content
  }

    function containsCompanyTitle(array) {
        return array.some(obj => obj.title.toUpperCase() === 'COMPANY');
    }
    const showAlert = (msg, type) => {
        setAlert(true);
        setSeverity(type);
        setAlertMessage(msg);
        setTimeout(() => {
            handleAlertClose();
        }, 3000);
    };
    const handleAlertClose = () => {
        setAlert(false);
        setSeverity("");
        setAlertMessage("");
    };

    useEffect(() => {
        if (containsCompanyTitle(user.role_metrix)) {
            setCompany({ label: user.company_name, value: user.company_id })
            setCompanyUser(containsCompanyTitle(user.role_metrix))
        }
        fetchSingleNachDetail(page, rowstxnHistoryPerPage)
    }, [ rowstxnHistoryPerPage ,page ]);
    
    const fetchSingleNachDetail = (page ,rowstxnHistoryPerPage) => {
        const payload = {
          searchBy : request_id,
          user_id: user._id,
          companyId: user?.company_id, 
          page :page,
          rows_per_page : rowstxnHistoryPerPage,
        };
        new Promise((resolve, reject) => {
            dispatch(singleNachDetailWatcher(payload, resolve, reject));
        }).then(response => {
              setRegistrationId(response?.data?.requestId);
              setPresentmentData((prevState) => ({
                ...prevState,
                UMRN: response?.data?.mndtId,
                subscriptionId: response?.data?.requestId
              }));
              setCompany_id_subscription(response?.data?.companyId);
              setNachStatus(response?.data?.status);
              setIsCancelled(response.data.status.indexOf("cancel") > -1 || response.data.status === "open")
              setSingleNachDetail([
                  {
                    title: "Registration Info",
                    data:[
                      {
                        head: "REGISTRATION ID",
                        body : response?.data?.requestId
                      },
                      {
                        head: "EXTERNAL REFERENCE NUMBER",
                        body : response?.data?.externalRefNum
                      },
                    ]
                  },
                  {
                    title: "Customer Details",
                    data:[
                      {
                        head: "NAME",
                        body : response?.data?.customerName
                      },
                      {
                        head: "EMAIL",
                        body : response?.data?.customerEmailId
                      },
                      {
                        head: "PHONE",
                        body : response?.data?.customerMobileNo
                      },
                    ]
                  },
                  {
                    title: "Registration Details",
                    data:[
                      {
                        head: "REFERENCE ID",
                        body : response?.data?.requestId
                      },
                      {
                        head: "UMRN",
                        body : response?.data?.mndtId ? response?.data?.mndtId :"NA"
                      },
                      {
                        head: "CREATED ON",
                        body :  (moment(response?.data?.createdAt).format("DD-MM-YYYY"))
                      },
                      {
                        head: "APPROVED AT",
                        body :  (moment(response?.data?.updatedDate).format("DD-MM-YYYY"))
                      },
                      {
                        head: "AMOUNT",
                        body :  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(response?.data?.amount || 0)
                      },
                      {
                        head: "AMOUNT TYPE",
                        body : response?.data?.amountType.replace(/_/g, ' ').toLowerCase()[0].toUpperCase() + response?.data?.amountType.replace(/_/g, ' ').toLowerCase().slice(1) 
                      },
                      {
                        head: "FREQUENCY",
                        body : response?.data?.emiFrequency.toLowerCase()[0].toUpperCase() + response?.data?.emiFrequency.toLowerCase().slice(1) 
                      },
                      {
                        head: "START DATE",
                        body :  (moment(response?.data?.startDate).format("DD-MM-YYYY"))
                      },
                      {
                        head: "END DATE",
                        body : response?.data?.endDate ? moment(response?.data?.endDate).format("DD-MM-YYYY") : "NA"
                      },
                      {
                        head: "REMARK",
                        body : response?.data?.statusDesc || "NA" 
                      },
                    ]
                  }
                ]);
            })
            .catch((error) => {
                showAlert(error?.response?.data?.message || "Error while fetching registration details", "error");
                setSingleNachDetail(null)
            });
            new Promise((resolve, reject) => {
              dispatch(enachTransactionHistotryWatcher(payload, resolve, reject));
          }).then(response => {
                setTxnData(response?.data["data-lst"].map((item , index) => ({
                    presentment_txn_id : item?.presentment_txn_id,
                    "TXN ID": <div style={{wordBreak:"break-word"}}>{item?.presentment_txn_id}</div>,
                    "CREATED ON":   (moment(item?.created_at).format("DD-MM-YYYY")),
                    "SCHEDULED ON": (moment(item?.scheduled_on).format("DD-MM-YYYY")),
                    "AMOUNT":  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item?.amount || 0),
                    "TXN DATE & TIME":  item?.txn_utr_datetime ? moment(item?.txn_utr_datetime).format("DD-MM-YYYY") + ", "  +item?.created_at.slice(11, 16) : "NA",
                    "TXN REF NO.": item?.txn_utr_number ? item?.txn_utr_number : "NA",
                    "STATUS" : <div style={{display :"flex", height: "fit-content"}}>
                    <div style={handleStatusCss(statusMappings[item?.txn_status] ? statusMappings[item?.txn_status]   :  "In Progress")}>{statusMappings[item?.txn_status] || "In Progress"}</div>
                   {item?.txn_status === "F" && item?.txn_error_msg && item?.txn_error_msg !== ""?
                   <div>
                    <HtmlTooltip
                            title={item?.txn_error_msg}
                    >
                    <img style={{position:"relative",marginLeft: "16px", marginTop:"4px"}} alt="icon" src={InfoIcon} className="menuIcon" /> 
                    </HtmlTooltip>
                   </div> : null
                   }
                    </div>
                })));
                setCount(response?.count)
              }).catch((error) => {
                  showAlert(error?.response?.data?.message || "Error while fetching transaction details", "error");
              });        
    }

    const ActionMenu = (selectedStatus) => {
      let options;
      switch (selectedStatus) {
          case 'Open':
              options = []
              break;
          case 'In Progress':
              options = []
              break;
          case 'Active':
              options = [{ "label": "Create Presentment", "value": "Create Presentment" }, 
              { "label": "Hold Registration", "value": "Hold Registration" },
              { "label": "Cancel Registration", "value": "Cancel Registration" },
              ] 

              break;
          case 'Amend In Progress':
              options = []
              break;
          case 'Cancelled':
              options = []
              break;
          case 'Cancellation In Progress':
              options = []
              break;
          case 'On Hold':
              options = [{ "label": "Release", "value": "Release" },
                        { "label": "Cancel Registration", "value": "Cancel Registration" }]
              break;
          case 'Failed':
              options = []
              break;
          case 'Expired':
              options = []
              break;
          default:
              options = []
              break;
      }
      return options;
    }
    
  const handleChangePageTxnHistory = (event, newPageTxnHistory) => {
    setPage(event +1);
  };
  const handleAction = (action) =>{
    if (action === "Create Presentment") {
      isTagged ? checkAccessTags(["tag_nach_create_presentment_rw", "tag_nach_portal_subscriptions_rw"]) ? setIsOpen(true) : false : false;
    } else if (action === "Cancel Registration" ) {
      isTagged ? checkAccessTags(["tag_nach_cancel_subscription_rw", "tag_nach_portal_subscriptions_rw"]) ? setOpenExitPopup(true) : false : false;
    } else if (action === "Hold Registration" ) {
      isTagged ? checkAccessTags(["tag_nach_suspend_subscription_rw", "tag_nach_portal_subscriptions_rw"]) ? handleHoldRegistration() : false : false;
    } else if (action === "Release") {
      isTagged ? checkAccessTags(["tag_nach_revoke_suspension_rw", "tag_nach_portal_subscriptions_rw"]) ? handleRevokeRegistration() : false : false;
    } else {
        return null
    }
  };

  const handleCancelRegistration =() => {
      const payload = {
        user_id: user?._id,
        company_id: user?.value,
        registrationId: registrationId
      };
    new Promise((resolve, reject) => {
        dispatch(cancelNachRegistrationWatcher(payload, resolve, reject));
    }).then(() => {
        showAlert( "Your registration has been cancelled successfully", "success");
        fetchSingleNachDetail(page, rowstxnHistoryPerPage)
    }).catch(() => {
        showAlert("Error occurred during registration status update", "error");
    });
    }

  const handleCloseConfirmationPopup=() =>{
    setOpenExitPopup(false);
  }

  const handleConfirmed = () => {
    setOpenExitPopup(false);
    handleCancelRegistration()
  }

  return (
    <div>
        {openExitPopup ? (
            <ConfirmationPopup
                isOpen={openExitPopup}
                onClose={handleCloseConfirmationPopup}
                heading={"Cancel?"}
                confirmationMessage={"Are you sure? You want to cancel the registration."}
                customStyles={{width:"543px",height:"195px"}}
                customYesButtonStyle={{color:"white",backgroundColor:"#475BD8",borderRadius:"8px",width:"47%",fontFamily:"Montserrat-Bold",border:"1px solid rgb(71, 91, 216)",marginTop:"20px"}}
                customNoButtonStyle={{color:"#475BD8",backgroundColor:"white",borderRadius:"8px",width:"47%",marginLeft:"3%",fontFamily:"Montserrat-Bold",border:"1px solid rgb(71, 91, 216)",marginTop:"20px"}}
                handleConfirmed={handleConfirmed}
                yes={"Yes"}
                no={"No"}
            />
        ) : null}
         { isOpen ? 
    <PresentmentCreation  
    isOpen ={isOpen}
    setIsOpen = {setIsOpen}
    presentmentData = {presentmentData}
    setPresentmentData = {setPresentmentData}
    company_id_subscription = {company_id_subscription}
    page={page}
    rowstxnHistoryPerPage={rowstxnHistoryPerPage}
    reload={fetchSingleNachDetail}
   />
   : null }
       {alert ? (
        <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
        />
    ) : null}
            <div style ={{width:"97%" , marginLeft: "24px", justifyContent: "space-between", display:"flex"}}>
                     <div style={handleTopStatusCss(statusMappings[nachStatus])}>{statusMappings[nachStatus]}</div>
             <CustomInputBox
              label= "Action"
              options={ActionMenu(statusMappings[nachStatus])}
              onClick={(event) => {
                setStatus(event.value);
                handleAction(event.value)
              }}
              isDrawdown={( statusMappings[nachStatus] === "Active" || statusMappings[nachStatus] === "On Hold")}
              isDisabled={( statusMappings[nachStatus] === "Active" || statusMappings[nachStatus] === "On Hold") ? false : true}
              customDropdownClass={inputBoxCss}
              customClass={{ height: "49px", width: "130px", padding: "5px 15px 10px 10px" }}
            />
            </div>
      {singleNachDetail?.length > 0 ?  <Accordian customAccordionCell={{width :"350px"}} custumHeaderStyle={{marginBottom:"10px"}} accordionData={singleNachDetail} customValueClass ={{color: "var(--neutral-neutral-100, #141519)" , fontWeight:"600"}} customClass={{width : "97%" , marginLeft:"24px"}} /> : null}
        <div style ={headingCSS}>
            Transactions
        </div>
         <Table
      customStyle={{fontFamily:"Montserrat-Medium" , width: "97%",height:"fit-content" ,marginLeft: "24px",display:"grid", gridTemplateColumns:"22% 13% 13% 13% 14% 13% 9%", overflowX:"hidden"}}
      data={txnData}
      columns={[
        {id: "TXN ID",label: "TXN ID"},
        {id: "CREATED ON",label: "CREATED ON"},
        {id: "SCHEDULED ON",label: "SCHEDULED ON"},
        {id: "AMOUNT",label: "AMOUNT"},
        {id: "TXN DATE & TIME",label: "TXN DATE & TIME"},
        {id: "TXN REF NO.",label: "TXN REF NO."},
        {id: "STATUS", label: "STATUS", }
        ]}
      rowClickFunction={txn_id => window.open(`/admin/transactions-details/${txn_id}`)}
      rowClickValue={"presentment_txn_id"}
    />
          <Pagination 
          itemsPerPage={rowstxnHistoryPerPage} 
          totalItems={count} 
          rowsPerPageOptions={[10, 20, 30]} 
          onPageChange={handleChangePageTxnHistory} 
          showOptions={true}
          setRowLimit={setRowsTxnHistoryPerPage}
          />
    </div>
  )
}

export default ensachSubscription

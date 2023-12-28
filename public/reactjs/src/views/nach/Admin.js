import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import "../colendingLoans/view.css";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import { verifyDateAfter1800 } from "../../util/helper";
import moment from "moment";
import Button from 'react-sdk/dist/components/Button';
import Table from 'react-sdk/dist/components/Table';
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import { storedList , saveToStorage} from "../../util/localstorage";
import SelectCompany from "../../components/Company/SelectCompany";
import CustomDatePicker from "../../components/DatePicker/datePickerCustom";
import { nachDetailsWatcher } from "../../actions/enach";
import Pagination from "react-sdk/dist/components/Pagination/Pagination"
import { Link } from 'react-router-dom';
import "react-sdk/dist/styles/_fonts.scss";
import List from "react-sdk/dist/components/List/List"
import ListItem from "react-sdk/dist/components/ListItem/ListItem"
import { AlertBox } from "../../components/CustomAlertbox";
import LeadLoanLineImage from "../lending/images/newleadloanscreen.svg"
import { checkAccessTags } from "../../util/uam";
import Enach from "./subscriptionDetail";
import { useHistory } from "react-router-dom";
import FormPopUp from "react-sdk/dist/components/Popup/FormPopup";
import CreatePresentmentPopup from '../lending/createSettlementOffer';
import ConfirmationPopup from "react-sdk/dist/components/Popup/ConfirmationPopup";
import { validateData } from "../../util/validation";
import PresentmentCreation from './PresentmentPopupComponent';
import ToogleButton from "react-sdk/dist/components/ToogleButton/ToogleButton";
import SubscribeEventPopup from "./SubscribeEventPopup";
import TokenGenPopup from "./TokenGenPopup"
// const helper = require("../../../../../utils/helper");
var jwt = require("jsonwebtoken");
import { enachGenerateTokenWatcher } from "../../../src/actions/enach";


const user = storedList("user");
const generateToken = (obj, expiresIn) => {
    obj.environment = process?.env?.REACT_APP_ENVIRONMENT;
    return jwt.sign(obj, process?.env?.REACT_APP_SECRET_KEY,{expiresIn});
  };

const Admin = () => {

    const dispatch = useDispatch();
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [customDate, setCustomDate] = useState(true);
    const [company, setCompany] = useState(user?.type === 'company' ? { label: user?.company_name, value: user?.company_id } : "");
    const [nachDetails, setNachDetails] = useState([]);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [page, setPage] = useState(0);
    const [count, setCount] = useState("");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [status, setStatus] = useState("");
    const [showActionList, setShowActionList] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [companyUser, setCompanyUser] = useState(user?.type === 'company');
    const [searchBy, setSearchBy] = useState("");
    const [isOpen , setIsOpen] = useState(false);
    const [oneRowData , setOneRowData] = useState({});
    const [openExitPopup , setOpenExitPopup] = useState(false);
    const [openSubscribeEventPopup, setOpenSubscribeEventPopup] = useState(false);
    const [openTokenGenPopup , setOpenTokenGenPopup] = useState(false);
   const [subscribeEventData, setSubscribeEventData] = useState({
    event : null,
    callBackURL : null,
    securityKey : null,
    eventError : false,
    callBackURLError : false,
    securityKeyError : false
   });
    const [toogleOpen, setToogleOpen] = useState(false);
    const [token , setToken] = useState("")
    const handleClickDetails = (request_id) => {
            isTagged ? checkAccessTags([
                "tag_nach_portal_subscriptions_r",
                "tag_nach_portal_subscriptions_rw"
            ]) ? window.open(`/admin/nach/subscription_detail/${request_id}`) : null
            : false
    };
    
    const isTagged =
        process.env.REACT_APP_BUILD_VERSION > 1
            ? user?.access_metrix_tags?.length
            : false;

    useEffect(() => {
        setNachDetails([{
            'NAME': "NA",
            'EMAIL': "NA",
            'ROLE': "NA",
            'NACH ACCESS': "NA",
        },
    ]);

        // if (company)
        //     fetchNachDetails(page, rowsPerPage)
    }, [page, rowsPerPage]);

    const statusToDisplay = [
        { label: "Open", value: ["open"] },
        { label: "In Progress", value: ["mandate_initiated", "callback_success", "success"] },
        { label: "Active", value: ["active"] },
        { label: "On Hold", value: ["suspend", "amend_fail"] },
        { label: "Amend In Progress", value: ["amend_initiated", "amend_success"] },
        { label: "Cancellation In Progress", value: ["cancel_initiated", "cancel_fail"] },
        { label: "Cancelled", value: ["cancel_success"] },
        { label: "Failed", value: ["callback_fail", "fail", "rejected"] }
    ]

    const statusMappings = {
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

    const handleChangePage = (event, newPage) => {
        setPage(event);
    };

    const inputBoxCss = {
        marginTop: "8px",
        width: "290px",
        maxHeight: "none",
        minHeight: "330px",
        zIndex: 1
    }

    const statusInputBoxCss = {
        marginTop: "8px",
        width: "240px",
        maxHeight: "none",
        minHeight: "320px",
        zIndex: 1
    }


    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '53vh',
        backgroundColor: '#F5F7FF',
        borderRadius: "35px",
        marginLeft: "15%",
        marginRight: "25%",
        marginTop: "80px"
    };

    const imageStyle = {
        marginTop: "5vh",
        width: '100%',
        maxWidth: '400px',
        height: 'auto',
    };

    const handleStatusCss = (status) => {
        let content;
        switch (status) {
            case 'Open':
                content = { display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--primary-50, #475BD8)", color: "var(--primary-50, #475BD8)", background: "var(--primary-0, #EDEFFB)" }
                break;
            case 'Active':
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
                content = { display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-danger-30, #B30000)", color: "var(--utility-danger-30, #B30000)", background: "var(--utility-danger-0, #FFECEC)" }
                break;
            default:
                content = {}
                break;
        }
        return content
    }

    const fetchNachDetails = (page, rowsPerPage) => {
        const payload = {
            status: status,
            rows_per_page: rowsPerPage,
            page: page,
            user_id: user._id,
            fromDate: fromDate,
            toDate: toDate,
            companyId: company?.value,
            searchBy: searchBy
        };
        new Promise((resolve, reject) => {
            dispatch(nachDetailsWatcher(payload, resolve, reject));
        })
        // { id: 'NAME', label: 'NAME' },
        // { id: 'EMAIL', label: 'EMAIL' },
        // { id: 'ROLE', label: 'ROLE' },
        // { id: 'NAME', label: 'NAME' },
        // { id: 'NACH ACCESS.', label: 'NACH ACCESS.' },

            .then(response => {
                setNachDetails(response?.enachDetails.map((item, index) => ({
                    'NAME': item.request_id,
                    'EMAIL': item?.reference_number,
                    'ROLE': item?.mandate_id,
                    'NACH ACCESS': item?.customer_name,
                })));
                setCount(response.count)
                setPage(response.page)
            })
            .catch((error) => {
                showAlert(error?.response?.data?.message || "Error while fetching details", "error");
                setNachDetails([])
            });
    }

    const handleStatus = (event) => {
        setStatus(event.value);
    }

    const handleActionClick = (row, event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const top = rect.bottom + window.scrollY;
        const left = rect.left + window.scrollX;
        setPopupPosition({ top, left });
        setSelectedStatus(row?.STATUS?.props?.children)
        setShowActionList(!showActionList);
        setOneRowData(row);
        setPresentmentData((prevState) => ({
            ...prevState,
            UMRN: row.UMRN,
            subscriptionId: row["AM SUBS ID"].props.children
          }));
    
    }

    const handleCallback = () => {
        setShowActionList(!showActionList);
    }

    const handleSubscribe = () => {
        setOpenSubscribeEventPopup(true);
    }
const handleTokenGen = () => {
    const payload = {
        user_id: user._id,
        company_id: company?.value ? company?.value  : user?.company_id,
    };
    if(typeof company?.value !== "undefined" || user?.company_id !== null){
        new Promise((resolve, reject) => {
            dispatch(enachGenerateTokenWatcher(payload, resolve, reject));
        })
            .then(response => {
              setToken(response);
            })
            .catch((error) => {
                showAlert(error?.response?.data?.message || "Error while creating token", "error");
            });
      
        setOpenTokenGenPopup(true);
    
    }
    else{
        showAlert("Please select company", "error");
    }
}

      const handleClose=() =>{
        setOpenExitPopup(false);
      }
      const handleConfirmed = () => {
        setOpenExitPopup(false);
      };
      const toogleClickFunction =() => {
        // setToogleOpen(!toogleOpen);
      }

    return (
        <>
        { openTokenGenPopup ? 
       <TokenGenPopup
       isOpen ={openTokenGenPopup}
       setIsOpen = {setOpenTokenGenPopup}
       token = {token}
    //    subscribeEventData = {subscribeEventData}
    //    setSubscribeEventData = {setSubscribeEventData}   
       />
: null }
        { openSubscribeEventPopup ? 
       <SubscribeEventPopup 
       isOpen ={openSubscribeEventPopup}
       setIsOpen = {setOpenSubscribeEventPopup}
       subscribeEventData = {subscribeEventData}
       setSubscribeEventData = {setSubscribeEventData}   
       />
: null }

         <div style={{ margin: "0px 24px 24px 24px" }}>
            {alert ? (
                <AlertBox
                    severity={severity}
                    msg={alertMessage}
                    onClose={handleAlertClose}
                />
            ) : null}
            <div style={{ display: "flex", flexDirection: "row", gap: "16px", marginBottom: "20px" , justifyContent:"space-between"}}>
            <div style={{width : "400px" ,display: "flex"}}>
                <SelectCompany
                    placeholder="Company"
                    company={company}
                    onCompanyChange={value => {
                        setCompany(value);
                    }}
                    isDisabled={companyUser}
                    customStyle={inputBoxCss}
                    height="56px"
                    width="200px"
                />
                <Button
                    buttonType='primary'
                    label='Search'
                    isDisabled={
                        isTagged
                        ? !checkAccessTags([
                            "tag_nach_portal_admin_read_write"
                        ]) : false
                    }
                    customStyle={{ width: "145px", height: "52px", padding: "13px 44px", borderRadius: "8px", fontSize: "16px", marginLeft:"16px"}}
                    // onClick={}
                />
                </div>
                <div style={{width : "367px",display: "flex"}}>
                <Button
                    buttonType='secondary'
                    label='Token Gen Key'
                    isDisabled={
                        isTagged
                        ? !checkAccessTags([
                            "tag_nach_portal_admin_read_write","tag_operations_bulk_upload_read"
                        ]) : false
                    }
                    customStyle={{ width: "171px", height: "52px", padding: "13px 5px", borderRadius: "8px", fontSize: "16px" }}
                    onClick={() => handleTokenGen()}
                />
                <Button
                    buttonType='primary'
                    label='Subscribe Event'
                    isDisabled={
                        isTagged
                        ? !checkAccessTags([
                            "tag_nach_portal_admin_read_write",
                        ]) : false
                    }
                    customStyle={{ width: "182px", height: "52px", padding: "0px 10px", borderRadius: "8px", fontSize: "16px" }}
                    onClick={() =>  handleSubscribe()}
                />
                </div>
            </div>
            
            {/* <Table
            customStyle={{marginLeft:"0px" ,width:"100%" ,display :"grid" ,gridTemplateColumns:"25% 25% 32% 5%"}}
                        columns={[
                            { id: 'NAME', label: 'NAME' },
                            { id: 'EMAIL', label: 'EMAIL' },
                            { id: 'ROLE', label: 'ROLE' },
                            { id: 'NACH ACCESS.', label: 'NACH ACCESS.' ,
                         format : row => (
                            <>
                            <ToogleButton isDisabled={true}  initialState ={true} onClick={toogleClickFunction}/>
                            </>
                         )
                        },
                        ]}
                        data={nachDetails}
                        // actions={{ handleActionClick }}
                        // handleActionClick={handleActionClick}
                        // rowClickFunction={handleClickDetails}
                    />
                                        <Pagination
                        itemsPerPage={rowsPerPage}
                        totalItems={count}
                        rowsPerPageOptions={[10, 20, 30]}
                        onPageChange={handleChangePage}
                        showOptions={true}
                        setRowLimit={setRowsPerPage} /> */}

            {<div style={containerStyle}>
                <div>
                    <img src={LeadLoanLineImage} alt="Lead Image" style={imageStyle} />
                </div>
                <h2 style={{ fontSize: "27px", lineHeight: "52px", fontFamily: "Montserrat-SemiBold", padding: "30px" }}>Kindly fill the above fields to get started</h2>
            </div>}
        </div>
        </>
    )
}
export default Admin;


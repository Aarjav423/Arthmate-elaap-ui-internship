import React, { useEffect, useState } from 'react';
import { useDispatch,useSelector } from "react-redux";
import "../colendingLoans/view.css";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import { verifyDateAfter1800 } from "../../util/helper";
import moment from "moment";
import Button from 'react-sdk/dist/components/Button';
import Table from 'react-sdk/dist/components/Table';
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import { storedList} from "../../util/localstorage";
import SelectCompany from "../../components/Company/SelectCompany";
import CustomDatePicker from "../../components/DatePicker/datePickerCustom";
import { nachDetailsWatcher  ,getMandatePurposeWatcher ,nachHoldRegistrationWatcher ,
    nachRevokeRegistrationWatcher, cancelNachRegistrationWatcher, fetchNachLiveBankDetails} from "../../actions/enach";
import Pagination from "react-sdk/dist/components/Pagination/Pagination"
import "react-sdk/dist/styles/_fonts.scss";
import List from "react-sdk/dist/components/List/List"
import ListItem from "react-sdk/dist/components/ListItem/ListItem"
import { AlertBox } from "../../components/CustomAlertbox";
import LeadLoanLineImage from "../lending/images/newleadloanscreen.svg"
import { checkAccessTags } from "../../util/uam";
import ConfirmationPopup from "react-sdk/dist/components/Popup/ConfirmationPopup";
import PresentmentCreation from './PresentmentPopupComponent';
import CreateSubscription from './createSubscription';
import Preloader from "../../components/custom/preLoader";

const user = storedList("user");

const subscription = () => {

    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.profile.loading);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [customDate, setCustomDate] = useState(true);
    const [company, setCompany] = useState(user?.type === 'company' ? { label: user?.company_name, value: user?.company_id } : "");
    const [nachDetails, setNachDetails] = useState([]);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [page, setPage] = useState(1);
    const [count, setCount] = useState("");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [status, setStatus] = useState("");
    const [showActionList, setShowActionList] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [companyUser, setCompanyUser] = useState(user?.type === 'company');
    const [searchBy, setSearchBy] = useState("");
    const [createSubscription,setCreateSubscription] = useState(false);
    const [isOpen , setIsOpen] = useState(false);
    const [oneRowData , setOneRowData] = useState({});
    const [openExitPopup , setOpenExitPopup] = useState(false);
    const [data,setData] = useState("");
    const [link,setLink] = useState("");
    const [company_id_subscription , setCompany_id_subscription] = useState("");
    const [mandatePurpose ,setMandatePurpose] = useState(null);
    const [registrationId ,setRegistrationId] = useState("");
    const [liveBankDetails , setLiveBankDetails] = useState({});
    const [searchKey, setSearchKey] = useState("");
   const [presentmentData, setPresentmentData] = useState({
    scheduledOndate : null,
    amount : null,
    remark : "",
    UMRN : "",
    subscriptionId : ""
   })

    const handleClickDetails = (request_id) => {
            isTagged ? checkAccessTags([
                "tag_nach_portal_subscriptions_r",
                "tag_nach_portal_subscriptions_rw"
            ]) ? window.open(`/admin/registration-details/${request_id}`) : null
            : false
    };

    const handleRevokeRegistration =() => {
        const payload = {
            user_id: user?._id,
            company_id: user?.value,
            registrationId: registrationId
        };
        new Promise((resolve, reject) => {
            dispatch(nachRevokeRegistrationWatcher(payload, resolve, reject));
        }).then(() => {
            showAlert( "Your suspension has been revoked successfully", "success");
            handleSearch()
        }).catch((error) => {
            showAlert(error?.response?.data?.message || "Error occurred during revoking suspension", "error");
        });
      }
    
    const isTagged =
        process.env.REACT_APP_BUILD_VERSION > 1
            ? user?.access_metrix_tags?.length
            : false;

    useEffect(() => {
        const payload = {
            user_id: user?._id,
            company_id: company?.value,
        };
        new Promise((resolve, reject) => {
            dispatch(getMandatePurposeWatcher(payload, resolve, reject));
        })
            .then(response => {
                const modifiedMandatePurpose = response.map(item => ({ id: item?.value, label: item?.value,  value: item?.key }));
                setMandatePurpose(modifiedMandatePurpose)
           })
            .catch((error) => {
                showAlert(error?.response?.data?.message || "Error while fetching mandate purposes", "error");
                setMandatePurpose([])
            });

        fetchLiveBankDetails();
    }, []);

    useEffect(() => {
        let filterPage = page;
        if (searchBy) filterPage = 1;
        fetchNachDetails(filterPage, rowsPerPage);
    }, [page, rowsPerPage, searchBy]);

    const fetchLiveBankDetails = () => {
        const payload = {
            user_id: user._id,
            company_id: company?.value,
        };
        new Promise((resolve, reject) => {
            dispatch(fetchNachLiveBankDetails(payload, resolve, reject));
        })
            .then(response => {
                const liveBankDetails = response?.data;
                setLiveBankDetails(liveBankDetails);

           })
            .catch((error) => {
                showAlert(error?.response?.data?.message || "Error while fetching live bank details", "error");
            });
    }

    const statusMappings = JSON.parse(process?.env?.REACT_APP_ENACH_STATUS_MAPPINGS)

    const uniqueValues = [...new Set(Object.values(statusMappings))];

    const statusToDisplay = uniqueValues?.map((value) => ({
    label: value,
    value: Object.keys(statusMappings).filter((key) => statusMappings[key] === value),
    }));

    const showAlert = (msg, type,data,link) => {
        setSeverity(type);
        setAlertMessage(msg);
        setData(data);
        setLink(link);
        setAlert(true);
        if(data || link) {
            fetchNachDetails(1, rowsPerPage);
        }
        if(!data || !link) {
        setTimeout(() => {
            handleAlertClose();
        }, 3000);
    }
    };

    const handleAlertClose = () => {
        setAlert(false);
        setSeverity("");
        setAlertMessage("");
        setData("");
        setLink("");
    };
   const handleCreatePresent =(event) => {
    setIsOpen(true) ;
   }
    const handleChangePage = (event, newPage) => {
        setPage(event +1);
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
                content = { fontFamily:"Montserrat-Medium" , fontSize:"12px", display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--primary-50, #475BD8)", color: "var(--primary-50, #475BD8)", background: "var(--primary-0, #EDEFFB)" }
                break;
            case 'Active':
                content = { fontFamily:"Montserrat-Medium" , fontSize:"12px", display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-success-50, #008042)", color: "var(--utility-success-50, #008042)", background: "var(--utility-success-0, #EEFFF7)" }
                break;
            case 'In Progress':
                content = { fontFamily:"Montserrat-Medium" , fontSize:"12px", display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-warning-20, #DB8400)", color: "var(--utility-warning-20, #DB8400)", background: "var(--utility-warning-0, #FFF5E6)" }
                break;
            case 'Cancelled':
                content = { fontFamily:"Montserrat-Medium" , fontSize:"12px", display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-danger-30, #B30000)", color: "var(--utility-danger-30, #B30000)", background: "var(--utility-danger-0, #FFECEC)" }
                break;
            case 'On Hold':
                content = { fontFamily:"Montserrat-Medium" , fontSize:"12px", display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-warning-20, #DB8400)", color: "var(--utility-warning-20, #DB8400)", background: "var(--utility-warning-0, #FFF5E6)" }
                break;
            case 'Failed':
                content = { fontFamily:"Montserrat-Medium" , fontSize:"12px", display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-danger-30, #B30000)", color: "var(--utility-danger-30, #B30000)", background: "var(--utility-danger-0, #FFECEC)" }
                break;
            case 'Amend In Progress':
                content = { fontFamily:"Montserrat-Medium" , fontSize:"12px", display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-warning-20, #DB8400)", color: "var(--utility-warning-20, #DB8400)", background: "var(--utility-warning-0, #FFF5E6)" }
                break;
            case 'Cancellation In Progress':
                content = { fontFamily:"Montserrat-Medium" , fontSize:"12px", display: "flex", padding: "1px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-danger-30, #B30000)", color: "var(--utility-danger-30, #B30000)", background: "var(--utility-danger-0, #FFECEC)",textAlign:"center",width:"130px", marginBottom: "10px"}
                break;
            case 'Expired':
                content = { fontFamily:"Montserrat-Medium" , fontSize:"12px", display: "flex", padding: "2px 8px", justifyContent: "center", alignItems: "center", borderRadius: "4px", border: "1px solid var(--utility-danger-30, #B30000)", color: "var(--utility-danger-30, #B30000)", background: "var(--utility-danger-0, #FFECEC)" }
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
            company_id: company?.value,
            searchBy: searchBy
        };
        new Promise((resolve, reject) => {
            dispatch(nachDetailsWatcher(payload, resolve, reject));
        })
            .then(response => {
                setNachDetails(response?.enachDetailsData.map((item, index) => ({
                    "company_id_subscription" :item?.companyId,
                    'REGISTRATION ID': item?.requestId,
                    'EXT REF NUMBER': item?.externalRefNum,
                    'UMRN': item?.mndtId,
                    'NAME': item?.customerName,
                    'MOBILE NO.': item?.customerMobileNo,
                    'MAX AMOUNT': item?.amount ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item?.amount) : "NA",
                    'CREATED ON': moment(item?.createdAt).format("DD-MM-YYYY"),
                    'STATUS': <div style={handleStatusCss(statusMappings[item?.status])}>{statusMappings[item?.status]}</div>
                })));
                setCount(response?.count)
                setPage(response?.page)
                if (!response?.count) showAlert("No data found", "error");
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
      if (isTagged && checkAccessTags(["tag_nach_portal_subscriptions_rw"])) {
        const rect = event.currentTarget.getBoundingClientRect();
        const top = rect.bottom  + storedList("scrollY" + window.location.pathname) ;
        const left = rect.left + window.scrollX;
        setPopupPosition({ top, left });
        setSelectedStatus(row?.STATUS?.props?.children)
        setShowActionList(!showActionList);
        setOneRowData(row);
        setPresentmentData((prevState) => ({
            ...prevState,
            UMRN: row.UMRN,
            subscriptionId: row["REGISTRATION ID"]
          }));
          setRegistrationId(row["REGISTRATION ID"]);
          setCompany_id_subscription(row?.company_id_subscription);
      }
    }

    const handleCallback = () => {
        setShowActionList(!showActionList);
    }

    const handleSearch = () => {
        setShowActionList(prevState => !prevState)
        fetchNachDetails(1, rowsPerPage);
    }

    const handleCreateSubscription = ()=> {
         setCreateSubscription(true)
    }

    const handleClose = ()=> {
        setCreateSubscription(false)
    }

    function ActionMenu() {
        let options;
        switch (selectedStatus) {
            case 'Open':
                options = []
                break;
            case 'In Progress':
                options = []
                break;
            case 'Active':
                options = ["Create Presentment", "Hold Registration", "Cancel Registration"]
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
                options = ["Release", "Cancel Registration"]
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

  const handleHoldRegistration =() => {
    const payload = {
        user_id: user?._id,
        company_id: user?.value,
        registrationId: registrationId
    };
    new Promise((resolve, reject) => {
        dispatch(nachHoldRegistrationWatcher(payload, resolve, reject));
    }).then(() => {
        showAlert("Your registration has been updated to on hold successfully", "success");
        handleSearch()
    }).catch((error) => {
        showAlert(error?.response?.data?.message || "Error occurred during updating registration to hold", "error");
    });
  }

 const handleAction = (event,action) =>{
    if (!isTagged && !checkAccessTags(["tag_nach_create_presentment_rw", "tag_nach_portal_subscriptions_rw"])) {
        return null;
    }
    if (action === "Create Presentment") {
        handleCreatePresent(event)
    } else if (action === "Cancel Registration") {
        setOpenExitPopup(true)
    } else if (action === "Hold Registration") {
        handleHoldRegistration()
    } else if (action === "Release") {
        handleRevokeRegistration()
    } else {
        return null
    }
  }

    return (
        <>
            {showActionList ? (
                <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "self-start" }}>
                    {options?.length > 0 ? (
                        <List
                            open={showActionList}
                            noScroll={true}
                            handleCallback={handleCallback}
                            customStyle={{
                                position: 'absolute',
                                width: "240px", height: "fit-content",
                                top: `${popupPosition.top - 65}px`,
                                left: `${popupPosition.left - 400}px`,
                                zIndex: 1
                            }}
                        >
                            {options.map((option, index) => (
                                <ListItem
                                    key={index}
                                    disabled={false}
                                    onClick={(event) =>{handleAction(event,option)}}
                                >
                                    {option}
                                </ListItem>
                            ))}
                        </List>
                    ) : null}
                </div>
            ) : null}
        </>
    )}

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
            handleSearch()
        }).catch(() => {
            showAlert("Error occurred during cancellation of registration", "error");
        });
    }
  const handleCloseConfirmationPopup=() =>{
    setOpenExitPopup(false);
  }

  const handleConfirmed = () => {
    setOpenExitPopup(false);
    handleCancelRegistration()
      setShowActionList(prevState => !prevState)
  };

    return (
        <>
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
   />
   : null }
         <div style={{ margin: "0px 24px 24px 24px" }}>
            {alert ? (
                <AlertBox
                    severity={severity}
                    msg={alertMessage}
                    onClose={handleAlertClose}
                    data={data}
                    link={link}
                />
            ) : null}
            <div style={{ display: "flex", flexDirection: "row", gap: "16px", marginBottom: "20px" }}>
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
                <CustomDatePicker
                    placeholder="Duration"
                    width="200px"
                    onDateChange={date => {
                        if (date.state === "custom") {
                            setCustomDate(false);
                            setFromDate("");
                            setToDate("");
                        } else {
                            setCustomDate(true);
                            setFromDate(date.fromDate);
                            setToDate(date.toDate);
                        }
                    }}
                />
                {!customDate ? (
                    <BasicDatePicker
                        placeholder="From date"
                        value={fromDate || null}
                        onDateChange={date => {
                            setFromDate(
                                verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                                    ? moment(date).format("YYYY-MM-DD")
                                    : date
                            );
                        }}
                        style={{ width: "200px", borderRadius: "8px" }}
                    />
                ) : null}
                {!customDate ? (
                    <BasicDatePicker
                        placeholder={"To date"}
                        value={toDate || null}
                        onDateChange={date => {
                            setToDate(
                                verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                                    ? moment(date).format("YYYY-MM-DD")
                                    : date
                            );
                            if (date === null) {
                            }
                        }}
                        style={{ width: "200px", borderRadius: "8px" }}
                    />
                ) : null}
                <InputBox
                    label="Select Status"
                    isDrawdown={true}
                    options={statusToDisplay}
                    onClick={(event) => handleStatus(event)}
                    customClass={{ width: "200px", height: "58px" }}
                    customDropdownClass={statusInputBoxCss}
                />
                <Button
                    buttonType='primary'
                    label='Search'
                    isDisabled={isTagged
                        ? !checkAccessTags([
                            "tag_nach_portal_subscriptions_r",
                            "tag_nach_portal_subscriptions_rw"
                        ]) : false}
                    customStyle={{ width: "145px", height: "56px", padding: "13px 44px", borderRadius: "8px", fontSize: "16px" }}
                    onClick={() => {
                        if (searchBy) {
                            setSearchBy("");
                            setSearchKey("");
                        } else {
                            fetchNachDetails(1, rowsPerPage);
                        }
                    }}
                />
            </div>
            <div style={{ fontSize: "18px", fontFamily: "Montserrat-Regular", fontWeight: 400, lineHeight: "150%", color: "#212E57" }}>
                Or Search by a Reg ID, UMRN, Ext Ref No.
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "21px" }} >
                <InputBox
                    label='Search by Reg ID, UMRN, Ext Ref No.'
                    initialValue={searchKey}
                    isDrawdown={false}
                    onClick={(event) => {
                        if(event.target && searchKey) {
                            setSearchBy(searchKey);
                        } else {
                            setSearchKey(event.value);
                            if (event.value === "") setSearchBy("");
                        }
                    }}
                    isSearch={true}
                    customClass={{ width: "357px", maxWidth: "none", height: "56px", borderRadius: "72px", fontFamily: "Montserrat-Regular" }}
                    customInputClass={{ maxWidth: "none", width: "330px", marginLeft: "5px" }}
                />
                <Button
                    label='Create Registration'
                    buttonType='primary'
                    isDisabled={isTagged
                        ? !checkAccessTags([
                            "tag_nach_portal_subscriptions_rw",
                            "tag_nach_create_subscription_rw"
                        ]) : false}
                    onClick={handleCreateSubscription}
                    customStyle={{ width: "216px", height: "48px", padding: "13px 24px", fontSize: "16px", borderRadius: "8px" }}
                />
            </div>
            {!(nachDetails.length) && <div style={containerStyle}>
                <div>
                    <img src={LeadLoanLineImage} alt="Lead Image" style={imageStyle} />
                </div>
                <h2 style={{ fontSize: "27px", lineHeight: "48px", fontFamily: "Montserrat-SemiBold", padding: "30px" }}>Kindly fill the above fields to get started</h2>
            </div>}
            {createSubscription ? (
                <CreateSubscription
                  openDialog= {createSubscription}
                  onModalClose={handleClose}
                  showAlert= {showAlert}
                  mandatePurpose = {mandatePurpose}
                  liveBankDetails = {liveBankDetails}
                />
            ):null}
            {nachDetails.length ? (
                <div style={{ marginBottom: "40px"  }}>
                    <ActionMenu />
                    <Table
                     customStyle={{  display:"grid" , gridTemplateColumns:"1% 16% 15% 15% 10% 10% 10% 10% 8% 0%" , height:"64px" ,overflowX: "hidden" ,overflowY: "hidden", fontFamily: 'Montserrat-Medium'}}
                        columns={[
                            { id: 'REGISTRATION ID', label: 'REGISTRATION ID' },
                            { id: 'EXT REF NUMBER', label: 'EXT REF NUMBER' },
                            { id: 'UMRN', label: 'UMRN' },
                            { id: 'NAME', label: 'NAME' },
                            { id: 'MOBILE NO.', label: 'MOBILE NO.' },
                            { id: 'MAX AMOUNT', label: 'MAX AMOUNT' },
                            { id: 'CREATED ON', label: 'CREATED ON' },
                            { id: 'STATUS', label: 'STATUS' }
                        ]}
                        data={nachDetails}
                        actions={{ handleActionClick }}
                        handleActionClick={handleActionClick}
                        rowClickFunction={handleClickDetails}
                        rowClickValue = {"REGISTRATION ID"}
                    />
                    <Pagination
                        itemsPerPage={rowsPerPage}
                        totalItems={count}
                        rowsPerPageOptions={[10, 20, 30]}
                        onPageChange={handleChangePage}
                        showOptions={true}
                        setRowLimit={setRowsPerPage} />
                </div>
            ) : null}
            {isLoading && <Preloader />}
        </div>
        </>
    )
}
export default subscription;



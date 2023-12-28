import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ClockIcon from "../../../../views/lending/images/clock-icon.svg"
import shieldIcon from "../../../images/shield-tick.svg"
import Clock from "../../../../assets/img/clock.svg";
import { getLeadDetailsByIdWatcher, updateLeadSectionWatcher } from "../../../../actions/loanRequest";
import { getBookLoanDetailsWatcher } from '../../../actions/bookLoan.action';
import { getOfferDetailsWatcher } from "../../../../actions/offerDetails";
import { OfferGenerate } from "../../../components/msme.component";
import { LeadStatus } from "../../../config/LeadStatus";
import TickCircle from "../../../../assets/img/tick-circle.svg";
import CrossCircle from "../../../../assets/img/close-circle.svg"
import "react-sdk/dist/styles/_fonts.scss";
import "./offerPage.style.css";
import { AlertBox } from "../../../../components/CustomAlertbox";
import Preloader from "../../../../components/custom/preLoader";
import { storedList } from 'util/localstorage';
import { LogViewer } from 'msme/components/LogViewer/LogViewer';
import { getMsmeActivityLogsWatcher } from '../../../actions/lead.action';

const user = { _id: storedList('user')?._id, id: storedList('user')?.id };

const OfferPage = (props) => {
    const { loanAppId, MSMECompanyId, MSMEProductId, getSectionStatus, setNavState, setShouldFetch } = props
    const isLoading = useSelector((state) => state.profile.loading);
    const [loader,setLoader]= useState(false);
    const dispatch = useDispatch();
    const [leadStatus, setLeadStatus] = useState("");
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const navigate = useHistory();
    const [offerDetails, setOfferDetails] = useState({});
    const [remark, setRemark] = useState('');

    const fetchActivityLogs = () => {
        const payload = {
            loanAppId: loanAppId,
            companyId:MSMECompanyId,
            productId:MSMEProductId,
            user: user,
        };
        new Promise((resolve, reject) => {
          dispatch(getMsmeActivityLogsWatcher(payload, resolve, reject));
        })
          .then((response) => {
            let comment = response.find(item => item.category === 'follow_up_doc')
            comment = comment.remarks;
            setRemark(comment);
          })    
          .catch((error) => {
            showAlert(error?.response?.data?.message, 'error');
          });
    };

    useEffect(() => {
        if (loanAppId && MSMECompanyId && MSMEProductId) {
            fetchLeadDetails();
            fetchOfferDetails();
            fetchActivityLogs();
        }
    }, [loanAppId,MSMECompanyId,MSMEProductId]);

    const showAlert = (msg, type) => {
        fetchLeadDetails()
        setAlert(true);
        setSeverity(type);
        setAlertMessage(msg);
        setTimeout(() => {
            handleAlertClose();
        }, 3000);
    };

    const updateLeadSection = (status) => {
        const params = {
            loan_app_id: loanAppId,
            companyId: MSMECompanyId,
            productId: MSMEProductId,
            status: status,
        };

        dispatch(updateLeadSectionWatcher(params, result=>{
            if(result){
                if(status===LeadStatus.follow_up_kyc.value){
                    navigate.push(`/admin/msme/lead/${loanAppId}/view`)
                    if(setShouldFetch){
                        setShouldFetch((prev)=>prev+1)
                    }
                    setNavState("Applicant Details")
                }else if(status===LeadStatus.follow_up_doc.value){
                    navigate.push(`/admin/msme/lead/${loanAppId}/edit`)
                }
                getSectionStatus(loanAppId)
            }
        }, error=>{
            showAlert(error.message, "error")
        }))
    }
    const handleAlertClose = () => {
        setAlert(false);
        setSeverity("");
        setAlertMessage("");
    };

    const fetchOfferDetails = () => {
        setLoader(true);
        dispatch(
          getOfferDetailsWatcher(
            { loan_app_id: loanAppId, company_id: MSMECompanyId, product_id: MSMEProductId },
            async response => {
              setOfferDetails(response.data);
              setLoader(false);
            },
            error => {
                setOfferDetails({});
                setLoader(false);
            }
          )
        );
      };

    const fetchLeadDetails = () => {

         const payload = {
            loan_app_id: loanAppId,
            companyId: MSMECompanyId,
            productId: MSMEProductId,
            user: user,
        };
        
       
        new Promise((resolve, reject) => {
            dispatch(getBookLoanDetailsWatcher(payload, resolve, reject));
          }).then((response)=>{
            setLeadStatus(response.lead_status);
          }).catch((error)=>{
            return showAlert(error.response.data.message, "error");

          })
          /*
        dispatch(
            getLeadDetailsByIdWatcher(
                params,
                result => {
                    
                },
                error => {
                      
                }
            )
        );
        */
    };
    return (
        <div style={{ margin: "0px 24px 24px 24px" }}>
            {alert ? (
                <AlertBox
                    severity={severity}
                    msg={alertMessage}
                    onClose={handleAlertClose}
                />
            ) : null}
            {leadStatus === LeadStatus.follow_up_doc.value && <LogViewer head='Offer in progress' body={remark}/>}
            {(leadStatus === LeadStatus.offer_generated.value || leadStatus === LeadStatus.offer_accepted.value || leadStatus === LeadStatus.approved.value|| leadStatus === LeadStatus.new.value)  && (
                <div style={{ display: 'flex', flexDirection: "column", gap: "24px" }}>
                    {leadStatus === LeadStatus.offer_generated.value ?
                    <div>
                        <div className='alert-container'>
                            <img
                                style={{ margin: "17px 0px 0px 16px" }}
                                alt="icon"
                                src={TickCircle}
                                className="menuIcon"
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <div className='alert-container-title' style={{ fontFamily: "Montserrat-SemiBold", }}>
                                        Application approved successfully & Offer generated
                                    </div>
                                    <div className='alert-container-msg' style={{ fontFamily: "Montserrat-Medium" }}>
                                        Congratulations! Your loan application has been approved, and we&apos;ve prepared an offer for you. To move forward, please accept the offer. We look forward to assisting you!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : null}
                    <div> <OfferGenerate customStyle={{ margin: "0px" }} loanAppId={loanAppId} MSMECompanyId={MSMECompanyId} MSMEProductId={MSMEProductId} showAlert={showAlert} leadStatus={leadStatus} fetchLeadDetails={fetchLeadDetails}/></div>
                </div>
            )}
            {(leadStatus === LeadStatus.follow_up_kyc.value )  && (
                <div style={{ display: 'flex', flexDirection: "column", gap: "24px",height:'100vh' }}>
                    {leadStatus === LeadStatus.follow_up_kyc.value ?
                    <div>
                        <div className='alert-container'>
                            <img
                                style={{ margin: "17px 0px 0px 16px" }}
                                alt="icon"
                                src={TickCircle}
                                className="menuIcon"
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <div className='alert-container-title' style={{ fontFamily: "Montserrat-SemiBold", }}>
                                        Application approved successfully & Offer generated
                                    </div>
                                    <div className='alert-container-msg' style={{ fontFamily: "Montserrat-Medium" }}>
                                        Congratulations! Your loan application has been approved, and we&apos;ve prepared an offer for you. To move forward, please accept the offer. We look forward to assisting you!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : null}
                    <div style={{display:'flex', justifyContent:'center', alignContent:'center',paddingTop:'15%'}}><img src={shieldIcon} alt="clock icon" /></div>
                    <div style={{textAlign:'center',color:'#EDA12F',fontFamily: "Montserrat-SemiBold", fontSize:'18px', fontStyle:'normal', fontWeight:'600', lineHeight:'150%'}}>
                        <div>OKYC of Applicants is required</div>
                        <div>to generate the offer.</div>
                    </div>
                    <div onClick={()=>{updateLeadSection(LeadStatus.follow_up_kyc.value);}} style={{cursor:'pointer',textAlign:'center',color:'#134CDE',fontFamily: "Montserrat-Regular", fontSize:'16px', fontStyle:'normal', fontWeight:'600', lineHeight:'150%'}}>
                        <div>Start OKYC</div>
                    </div>
                </div>
            )}

            {leadStatus === LeadStatus.rejected.value ?
                <div>
                    <div className='alert-container' style={{ backgroundColor: "#FFECEC", border: "2px solid #C00", borderRadius: "8px" }}>
                        <img
                            style={{ margin: "17px 0px 0px 16px" }}
                            alt="icon"
                            src={CrossCircle}
                            className="menuIcon"
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div className='alert-container-title' style={{ fontFamily: "Montserrat-SemiBold", color: "#C00" }}>
                                    Offer rejected
                                </div>
                                <div className='alert-container-msg' style={{ fontFamily: "Montserrat-Medium" }}>
                                    We are sorry to inform that your application is rejected. Please try again later.
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : null}
  

            {(leadStatus === LeadStatus.in_review.value || leadStatus === LeadStatus.in_progress.value || leadStatus === LeadStatus.lead_deviation.value || leadStatus === LeadStatus.offer_in_progress.value) &&
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", marginTop: "17%" }}>
                    <div style={{ textAlign: "center" }}>
                        <div><img src={Clock} alt="clock icon" /></div>
                        <div style={{ fontFamily: "Montserrat-SemiBold", fontSize: "18px", color: "#008042", marginTop: "35px", fontWeight: 600 }}>Application submitted successfully</div>
                        <div style={{ fontFamily: "Montserrat-Medium", fontSize: "16px", color: "#161719", marginTop: "15px" }}>
                            We&rsquo;re currently reviewing your application. Please check back <br /> later for the status update. Thank you!
                        </div>
                    </div>
                </div>}
                {(leadStatus === LeadStatus.offer_deviation.value)  && (
                 <div style={{ display: 'flex', flexDirection: "column", gap: "24px",height:'100vh' }}>
                     {/* {leadStatus == LeadStatus.offer_deviation.value ?
                     <div>
                         <div className='alert-container'>
                             <img
                                 style={{ margin: "17px 0px 0px 16px" }}
                                 alt="icon"
                                 src={TickCircle}
                                 className="menuIcon"
                             />
                             <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                 <div style={{ display: "flex", flexDirection: "column" }}>
                                     <div className='alert-container-title' style={{ fontFamily: "Montserrat-SemiBold", }}>
                                         Application approved successfully & Offer generated
                                     </div>
                                     <div className='alert-container-msg' style={{ fontFamily: "Montserrat-Medium" }}>
                                         Congratulations! Your loan application has been approved, and we&apos;ve prepared an offer for you. To move forward, please accept the offer. We look forward to assisting you!
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div> : null} */}
                     <div style={{display:'flex', justifyContent:'center', alignContent:'center',paddingTop:'22%'}}><img src={ClockIcon} alt="clock icon" /></div>
                     <div style={{textAlign:'center',color:'#EDA12F',fontFamily: "Montserrat-SemiBold", fontSize:'18px', fontStyle:'normal', fontWeight:'600', lineHeight:'150%'}}>
                         <div>Loan Application is in</div>
                         <div>Review with {offerDetails?.responsibility} team</div>
                     </div>
                    
                 </div>
                 )}
             {(leadStatus === LeadStatus.follow_up_doc.value)  && (
                 <div style={{ display: 'flex', flexDirection: "column", gap: "24px",height:'100vh' }}>
                     {/* {leadStatus == LeadStatus.follow_up_doc.value ?
                     <div>
                         <div className='alert-container'>
                             <img
                                 style={{ margin: "17px 0px 0px 16px" }}
                                 alt="icon"
                                 src={TickCircle}
                                 className="menuIcon"
                             />
                             <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                 <div style={{ display: "flex", flexDirection: "column" }}>
                                     <div className='alert-container-title' style={{ fontFamily: "Montserrat-SemiBold", }}>
                                         Application approved successfully & Offer generated
                                     </div>
                                     <div className='alert-container-msg' style={{ fontFamily: "Montserrat-Medium" }}>
                                         Congratulations! Your loan application has been approved, and we&apos;ve prepared an offer for you. To move forward, please accept the offer. We look forward to assisting you!
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div> : null} */}
                     <div style={{display:'flex', justifyContent:'center', alignContent:'center',paddingTop:'22%'}}><img src={Clock} alt="clock icon" /></div>
                     <div style={{textAlign:'center',color:'#EDA12F',fontFamily: "Montserrat-SemiBold", fontSize:'18px', fontStyle:'normal', fontWeight:'600', lineHeight:'150%'}}>
                         <div>Loan Application is in</div>
                         <div>Review with {offerDetails?.responsibility} team</div>
                         </div>
                     <div onClick={()=>{updateLeadSection(LeadStatus.follow_up_doc.value)}} 
                        style={{cursor:'pointer',textAlign:'center',color:'#134CDE',fontFamily: "Montserrat-Regular", fontSize:'16px', fontStyle:'normal', fontWeight:'600', lineHeight:'150%'}}>
                         <div>Upload document</div>
                     </div>
                 </div>
             )}
            {(isLoading || loader || !leadStatus) && <Preloader />}
        </div>
    );
};

export default OfferPage;

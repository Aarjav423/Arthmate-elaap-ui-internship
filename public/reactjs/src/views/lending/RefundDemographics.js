import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getRefundDetailsWatcher,
  initiateRefundWatcher
} from "../../actions/refund";
import Button from "react-sdk/dist/components/Button/Button"
import moment from "moment";
import { storedList } from "../../util/localstorage";
import { checkAccessTags } from "../../util/uam";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import {AlertBox} from "../../components/AlertBox";
import "react-sdk/dist/styles/_fonts.scss"

export default function RefundDemographics(props) {
  const { data,openPopup,setOpenPopup}=props;
  const [loanId, setLoanId] = useState(data.loan_id);
  const [companyId, setCompanyId] = useState(data.company_id);
  const [productId, setProductId] = useState(data.product_id);
  const [refundData, setRefundData] = useState(false);
  const [alert,setAlert]=useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [refundPopup,setRefundPopup]=useState(openPopup);
  
  const dispatch = useDispatch();
  const user = storedList("user");

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const statuses = {
    NotInitiated: "Refund not initiated",
    Processed: "Refund processed",
    Initiated: "Refund initiated",
    Failed: "Refund failed"
  };


  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_refund_request_read",
        "tag_refund_request_read_write",
        "tag_loan_queue_read_write"
      ])
    )
      getRefundDetails();
    if (!isTagged) getRefundDetails();
  }, []);

  const handleAlertClose = () => {
    setAlert(false);
    setAlertMessage("");
    setSeverity("");
    setOpenPopup(false);
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const getRefundDetails = () => {
    const payload = {
      loan_id: loanId,
      user_id: user._id,
      company_id: companyId,
      product_id: productId
    };
    new Promise((resolve, reject) => {
      dispatch(getRefundDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setRefundData(response.data);
        // setOpenDialog(true);

      })
      .catch((error) => {
        // setOpenDialog(false);
        // onModalClose(error?.response?.data?.message, "error");
        return showAlert(error?.response?.data?.message, "error");
      });
  };
  const handleClose = () => {
    // setOpenDialog(false);
    // onModalClose("", "");
    setOpenPopup(false);
  };

  const modalStyle={
    width:"27vw",height:"100%",maxHeight:"100%",marginLeft:"36%",paddingTop:"2%",marginRight:"1%"
  }
  const customHeaderStyle={
    marginLeft:"2%",fontSize:"1.3vw",marginBottom:"7%",color:"#303030",width:"25vw"
  }
  const boxStyle={paddingLeft:"2%",float:"left",fontSize:"0.86vw",fontFamily:"Montserrat-Regular",fontWeight:"500",color:"#6B6F80"}
  const boxStyle1={fontSize:"0.86vw",float:"right",marginRight:"2%",fontFamily:"Montserrat-SemiBold",color: '#141519'}

  const handleInitiateRefund = () => {
    const payload = {
      loan_id: loanId,
      user_id: user._id,
      company_id: companyId,
      product_id: productId,
      ...refundData
    };

    delete payload.int_refund_amount;
    payload.refund_amount = refundData?.int_refund_amount;
    new Promise((resolve, reject) => {
      dispatch(initiateRefundWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setRefundPopup(false);
        return showAlert("Refund request initiated successfully", "success");
      })
      .catch((error) => {
        setRefundPopup(false);
        return showAlert(error?.response?.data?.message, "error");
      });
    // setOpenDialog(false);
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
      {refundData&&refundPopup ? (
        <FormPopup onClose={handleClose} 
        heading="Refund Request"
        open={refundPopup}
        isOpen={refundPopup}
        customStyles={modalStyle}
        customHeaderStyle={customHeaderStyle}
        style={{fontSize:"1.5vw"}} >
          
          
            
              <div display="flex" style={{marginBottom:"2.3%",marginTop:"12%"}}>
                <b style={boxStyle}>
                    Interest Refund Amount
                </b>
                <b style={boxStyle1}>
                {refundData?.int_refund_amount||refundData?.int_refund_amount==0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(refundData?.int_refund_amount):" NA"}
                </b>
                <br/>
              </div>
              
              
              <div display="flex" style={{marginBottom:"2.3%"}}>
                <b style={boxStyle}>
                    Interest Refund Days
                </b>
                <b style={boxStyle1}>
                {refundData?.int_refund_days||" NA"}
                </b>
                <br/>
              </div>
              <div display="flex" style={{marginBottom:"2.3%"}}>
                <b style={boxStyle}>
                    Interest Refund Status
                </b>
                <b style={boxStyle1}>
                {statuses[refundData?.interest_refund_status]}
                </b>
                <br/>
              </div>
              {refundData?.interest_refund_date_time ? (
                

                <div display="flex" style={{marginBottom:"2.3%"}}>
                <b style={boxStyle}>
                    Interest Refund Date
                </b>
                <b style={boxStyle1}>
                {moment(refundData?.interest_refund_date_time).format("YYYY-MM-DD HH:MM:SS")}
                </b>
                <br/>
              </div>
                
              ) : <div display="flex" style={{marginBottom:"2.3%"}}>
                <b style={{paddingLeft:"2%",fontSize:"1.3vw"}}>
                </b>
                <b style={{marginLeft:"20%",fontSize:"1.3vw"}}>
                </b>
                <br/>
                </div>}
              {refundData?.int_refund_request_date_time ? (
                
                <div display="flex" style={{marginBottom:"2.3%"}}>
                <b style={boxStyle}>
                    Interest Refund Request Date
                </b>
                <b style={boxStyle1}>
                {moment(refundData?.interest_refund_date_time).format("YYYY-MM-DD HH:MM:SS")}
                </b>
                <br/>
              </div>
              ) : <div display="flex" style={{marginBottom:"2.3%"}}>
                <b style={{paddingLeft:"2%",fontSize:"1.3vw"}}>
                </b>
                <b style={{marginLeft:"20%",fontSize:"1.3vw"}}>
                </b><br/></div>}
            

            {isTagged ? (
              checkAccessTags([
                "tag_refund_request_read_write",
                "tag_loan_queue_read_write"
              ]) ? (
                <div style={{display:"flex",marginTop:"56vh",marginBottom:"2vh"}}>
                <Button
                  onClick={handleClose}
                  id="cancel"
                  label='Cancel'
              buttonType="secondary"
              customStyle={{borderRadius:"8px",width:"13.2vw",height:"4.8vh",fontSize:"0.87vw",paddingLeft:"1vh",paddingRight:"1vh",backgroundColor:"#FFF",color:"#475BD8",paddingTop:"1vh",paddingBottom:"1vh",border:"1px solid #475BD8"}}
                  />
                
                  <Button
                  onClick={handleInitiateRefund}
                  id="initiaterefundrequest"
                  label='Initiate refund request'
              buttonType="primary"
              customStyle={{borderRadius:"8px",width:"13.2vw",height:"4.8vh",fontSize:"0.87vw",paddingLeft:"0vw",paddingRight:"0vw",paddingTop:"1vh",paddingBottom:"1vh"}}
              isDisabled={
                refundData.interest_refund_status === "Processed" ||
                refundData.interest_refund_status === "Initiated"
              }
                  />
                  </div>
                
              ) : null
            ) : (
              <div style={{display:"flex",marginTop:"56vh",marginBottom:"2vh"}}>
                <Button
                  onClick={handleClose}
                  id="cancel"
                  label='Cancel'
              buttonType="secondary"
              customStyle={{borderRadius:"8px",width:"13.2vw",height:"4.8vh",fontSize:"0.87vw",paddingLeft:"1vh",paddingRight:"1vh",backgroundColor:"#FFF",color:"#475BD8",paddingTop:"1vh",paddingBottom:"1vh",border:"1px solid #475BD8"}}
                  />
                <Button
                  onClick={handleInitiateRefund}
                  id="initiaterefundrequest"
                  label='Initiate refund request'
              buttonType="primary"
              customStyle={{borderRadius:"8px",width:"13.2vw",height:"4.8vh",fontSize:"0.87vw",paddingLeft:"0vw",paddingRight:"0vw",paddingTop:"1vh",paddingBottom:"1vh"}}
                  />
              </div>
            )}
          </FormPopup>
      ) : null}
      
    </>
  );
}
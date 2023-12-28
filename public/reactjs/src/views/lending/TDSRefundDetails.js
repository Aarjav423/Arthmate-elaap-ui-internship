import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from 'moment';
import { Form, useHistory } from "react-router-dom";
import Button from "react-sdk/dist/components/Button";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import "react-sdk/dist/styles/_fonts.scss";
import BasicDatePicker from '../../components/DatePicker/basicDatePicker';
import { storedList } from "../../util/localstorage";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import DownloadIcon from "../../msme/assets/Download.svg";
import TextField from "@mui/material/TextField";
import ViewIcon from "../../msme/assets/viewDoc.svg"
import { updateTDSRefundStatusWatcher } from "../../actions/tdsRefund";
import { verifyDateAfter1800 } from '../../util/helper';
import Alert from 'react-sdk/dist/components/Alert/Alert';
import { checkAccessTags } from '../../util/uam';

const user = storedList('user');

export default function TDSRefundDetails(props){
    const { setViewDetails, refundDetails, handleViewDoc } = props;
    const [tdsData, setTDSData] = useState({
    });
    const [rejectPopup, setRejectPopup] = useState(false);
    const [stateData, setStateData ] = useState({});
    const [markProcessedPopup, setMarkProcessedPopup ] = useState(false);
    const [openPopup, setOpenPopup ] = useState(true);
    const [alert, setAlert] = useState(false);
    const [alertMessage,setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [isCompleteForm, setCompleteForm] = useState(false);
    const accountNumberRegex = /^\d{9,18}$/;
    const ifscRegex = /^[A-Z]{4}\d{7}$/;

    useEffect(()=>{
        setTDSData(refundDetails);
    },[refundDetails])

    useEffect(()=>{
        if (tdsData?.amount&&
            stateData?.bank_name&&
            stateData?.bank_ifsc&&
            stateData?.bank_acc_no&&
            stateData?.utr_number&&
            stateData?.utr_date&&
            stateData?.processed_reason)
        {
            setCompleteForm(true);
        }
        else
        {
            setCompleteForm(false);
        }

    },[stateData,tdsData])

    useEffect(()=>{
    if (rejectPopup||markProcessedPopup||openPopup){
        setViewDetails(true);
    }
    else
    {
        setViewDetails(false);
    }
    },[rejectPopup,markProcessedPopup,openPopup])

    const InputBoxStyle = {
        marginTop: '8px',
        maxHeight: '500px',
        zIndex: 1,
        width: '100%',
    };

    const customInputClass = {
        minWidth: '100%',
        backgroundColor: '#fff'
    }

    const customProcessedButton = {
        borderRadius: '8px',
        width: '48%',
        height: '56px',
        fontSize: '16px',
        paddingLeft:'4px',
        paddingRight:'4px'
    };
    const customClass = {
        height: '60px', 
        width: '48%', 
        maxWidth: '100%',
        marginRight:"2%"
    }
    
    const customRejectButton = {
        borderRadius:'8px',
        width: '48%',
        height: '56px',
        fontSize: '16px',
    }

    const handleDetailsClose = () =>{
        setOpenPopup(false);
    }

    const handleRejectPopup = () => {
        setRejectPopup(true);
        setMarkProcessedPopup(false);
        setOpenPopup(false);
    }

    const handleRejectClose = () => {
        setRejectPopup(false);
    }

    const handleProcessedPopup = () =>{
        setMarkProcessedPopup(true);
        setOpenPopup(false);
        setRejectPopup(false);
    }

    const handleProcessedClose = () =>{
        setMarkProcessedPopup(false);
    }

    const showDetails = (field, value) =>{
        let width="";
        if ( field=="Approver's Comment"|| field=="Requestor's Comment"){
            width = "35px";
        }
        else{
            width = "10px";
        }
        return (<>
        <div style={{width:"100%",height:width,justifyContent:"space-between",display:"flex"}}>
            <div style={{fontSize:"14px",fontFamily:"Montserrat-SemiBold"}}>
                {field}:
            </div>
            <div style={{fontSize:"14px",fontFamily:"Montserrat-Regular",marginRight:"8%"}}>
                {value}
            </div>
        </div>
        <br/>
        </>)
    }

    const rejectRefund = (reject=0) => {

        let payload = {}
        payload.user_id = user._id;
        payload.company_id = tdsData?.company_id;
        payload.product_id = tdsData?.product_id;

        if (reject){
            payload.status = "Rejected";
            payload.comment =  stateData?.rejection_reason;
            payload.tds_request_id = tdsData?._id;
        }
        else{
            payload.amount = tdsData?.amount;
            payload.bank_name = stateData?.bank_name;
            payload.ifsc = stateData?.bank_ifsc;
            payload.account_number = stateData?.bank_acc_no;
            payload.status = "Processed";
            payload.comment = stateData?.processed_reason;
            payload.utr_number = stateData?.utr_number;
            payload.utr_date = stateData?.utr_date;
            payload.tds_request_id = tdsData?._id;
        }
        setIsLoading(true);
        dispatch(
        updateTDSRefundStatusWatcher(
        payload,
        async(result)=>{
          if (reject){
            showAlert("Refund Status changed to rejected","success");
            setTimeout(()=>{
                setIsLoading(false);
                setRejectPopup(false);
            },2000)
          }
          else{
            showAlert("Refund Status changed to processed successfully","success");
            setTimeout(()=>{
                setIsLoading(false);
                setMarkProcessedPopup(false);
            },2000)
          }
        },
        (error) => {
            setIsLoading(false);
            showAlert(`${error.response?.data?.message??"Error while updating tds refund status"}`,"error");
        }));
    }
    const handleStatusCSS = (status) => {
        switch(status){
            case "Processed":
                return '#008042';
                break;
            case "Open":
                return '#475BD8';
                break;
            case "Rejected": 
                return '#B30000';
                break;
            case "Failed" :
                return '#B30000';
                break;
            default :
                return '#475BD8';
                break;
        }
    }

    const handleViewTDSDoc = () => {
        handleViewDoc(tdsData?.file_url,"TDS",tdsData?.company_id,tdsData?.product_id);
    }

    const handleAlertClose = () => {
        setAlert(false);
        setAlertMessage("");
        setSeverity("");
    }

    const showAlert=( msg ,severity) => {
        setAlert(true);
        setAlertMessage(msg);
        setSeverity(severity);
        setTimeout(()=>{
            handleAlertClose();
        },[4000])
    }


    const changeDateSelected = (value, name) => {
        const date = verifyDateAfter1800(moment(value).format('YYYY-MM-DD')) ? moment(value).format('YYYY-MM-DD') : value;
        setStateData((prevState) => ({
          ...prevState,
          [name]: date,
        }));
    };


    return (<>
    {openPopup&&
    <FormPopup
    heading={"Refund Details"}
    isOpen={openPopup}
    onClose={handleDetailsClose}
    customStyles={{height:"100%", marginLeft:"35%", width:"30%",overflowY:"auto"}}
    >
        <br/>
        <div style={{width:"100%",height:"65vh", marginTop:"8%"}}>
        <div style={{display:"flex",marginLeft:"-1%",marginBottom:"2%"}}>
            <div style={{marginLeft:"1%",marginRight:"2%",fontSize:"14px",fontFamily:"Montserrat-SemiBold"}}>
                Status
            </div>
            <div style={{marginLeft:"10%",fontWeight:"600",marginRight:"10%",width:"90px",height:"22px",border:`1px solid ${handleStatusCSS(tdsData?.status)}`,color:`${handleStatusCSS(tdsData?.status)}`,borderRadius:"4px"}}>
               <div style={{justifyContent:"space-evenly",display:"flex",fontSize:"14px",fontFamily:"Montserrat-Regular"}}> {tdsData?.status}</div>
            </div>
            <div style={{fontFamily:'Montserrat-SemiBold',fontSize:"14px", marginLeft:"18%",marginRight:"2%"}}>
                TDS Certificate
            </div>
            <div onClick={handleViewTDSDoc}>
            <img src={ViewIcon}/>
            </div>
        </div>
        {showDetails("TDS Certificate Number",tdsData?.certificate_number)}
        {showDetails("TDS Refund Amount",tdsData?.amount||tdsData?.amount==0?Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tdsData?.amount):"NA")}
        {showDetails("Requested By",tdsData?.requested_by??"NA")}
        {showDetails("Created On",tdsData?.createdAt?moment(tdsData?.createdAt).format('DD-MM-YYYY'):"NA")}
        {showDetails("UTR Date",tdsData?.utr_date?moment(tdsData?.utr_date).format('DD-MM-YYYY'):"NA")}
        {tdsData?.status=="Processed"? showDetails("Bank Name",tdsData?.bank_name??"NA"):null}
        {tdsData?.status=="Processed"?showDetails("Bank IFSC",tdsData?.bank_ifsc_code??"NA"):null}
        {tdsData?.status=="Processed"?showDetails("Bank Account No",tdsData?.bank_account_no??"NA"):null}
        {tdsData?.status=="Processed"||tdsData?.status=="Rejected"?showDetails("Processed/Rejected on",tdsData?.updatedAt?moment(tdsData?.updatedAt).format('DD-MM-YYYY'):"NA"):null}
        {tdsData?.status=="Processed"||tdsData?.status=="Rejected"?showDetails("Processed/Rejected by",tdsData?.updated_by??"NA"):null}
        {showDetails("Requestor's Comment",tdsData?.requestor_comment??"NA")}
        {tdsData?.status=="Processed"&&showDetails("Approver's Comment",tdsData?.comment??"NA")}
        </div>
        {checkAccessTags(["tag_tds_refund_details_w"])&&<div style={{marginTop:"35%",display:"flex", marginBottom:"5%"}}>
        <Button
        id="reject"
        buttonType="secondary"
        label="Reject"
        customStyle={{...customRejectButton,border:"1px solid #CC0000",color:"#CC0000"}}
        onClick={handleRejectPopup}
        isDisabled={tdsData?.status=="Processed"||tdsData?.status=="Rejected"}
        />
        <Button
        id="markAsProcessed"
        buttonType="primary"
        label="Mark as Processed"
        customStyle={customProcessedButton}
        onClick={handleProcessedPopup}
        isDisabled={tdsData?.status=="Processed"||tdsData?.status=="Rejected"}
        />
        </div>
        }

    </FormPopup>}
    {markProcessedPopup&& 
    <FormPopup
    heading={"Mark Processed"}
    isOpen={markProcessedPopup}
    onClose={handleProcessedClose}
    customStyles={{width:"600px"}}>
        <br/>
        <div style={{display:"flex", marginLeft:"-1%",marginTop:"5%"}}>
            <InputBox
            id="amountProcesssed"
            label="Amount Processed"
            isDisabled={true}
            initialValue={tdsData?.amount}
            customDropdownClass={InputBoxStyle}
            customClass={customClass}
            customInputClass={{...customInputClass, marginTop:"-3px"}}
            />

            <InputBox
            id="bankName"
            label="Bank Name"
            initialValue={stateData.bank_name}
            onClick={(event)=>setStateData((prevState)=>({
                ...prevState,
                [`bank_name`]:event.value
            }))}
            customDropdownClass={InputBoxStyle}
            customClass={customClass}
            customInputClass={customInputClass}
            />
        </div>
        <div style={{display:"flex",marginTop:"3%",marginLeft:"-1%"}}>
        <InputBox
            id="bankifsc"
            label="Bank IFSC"
            initialValue={stateData.bank_ifsc}
            onClick={(event)=>setStateData((prevState)=>({
                ...prevState,
                [`bank_ifsc`]:event.value.toUpperCase()
            }))}
            customDropdownClass={InputBoxStyle}
            customClass={customClass}
            customInputClass={customInputClass}
            error={stateData?.bank_ifsc && !ifscRegex.test(stateData?.bank_ifsc)?true:false}
            helperText={stateData?.bank_ifsc && !ifscRegex.test(stateData?.bank_ifsc)?"Please enter valid IFSC":" "}
        />
        <InputBox
            id="bankAccNo"
            label="Bank Account Number"
            initialValue={stateData.bank_acc_no}
            onClick={(event)=>setStateData((prevState)=>({
                ...prevState,
                [`bank_acc_no`]:event.value
            }))}
            customDropdownClass={InputBoxStyle}
            customClass={customClass}
            customInputClass={customInputClass}
            error={stateData?.bank_acc_no && !accountNumberRegex.test(stateData?.bank_acc_no)?true:false}
            helperText={stateData?.bank_acc_no && !accountNumberRegex.test(stateData?.bank_acc_no)?"Please enter valid Account Number":" "}
        />
        </div>
        <div style={{display:"flex",marginTop:"3%",marginLeft:"-1%"}}>
        <InputBox
            id="utrNumber"
            label="UTR Number"
            initialValue={stateData.utr_number}
            onClick={(event)=>setStateData((prevState)=>({
                ...prevState,
                [`utr_number`]:event.value
            }))}
            customDropdownClass={InputBoxStyle}
            customClass={customClass}
            customInputClass={customInputClass}
        />
        <BasicDatePicker
        placeholder={'UTR Date'}
        format="dd-MM-yyyy"
        style={{ height:"30px",width:"48%" }}
        value={stateData?.utr_date??""}
        shouldDisableDate={(date) => {
            const today = new Date();
            const selectedDate = new Date(date);
            const age = today.getFullYear() - selectedDate.getFullYear() - (today.getMonth() < selectedDate.getMonth() || (today.getMonth() === selectedDate.getMonth() && today.getDate() < selectedDate.getDate()) ? 1 : 0);
            return age < 0;
        }}
        shouldDisableYear={(date) => {
            const today = new Date();
            const selectedDate = new Date(date);
            const age = today.getFullYear() - selectedDate.getFullYear();
            return age < 0;
        }}
        onDateChange={(date) => changeDateSelected(date, `utr_date`)}
        />
        </div>
        <div style={{marginTop:"5%"}}>
        <TextField
              fullWidth
              id="outlined-basic"
              label="Add Comment"
              placeholder="Add Comment"
              size="string"
              rows={6}
              multiline
              required
              autoFocus
              value={stateData.processed_reason}
              onChange={event => {
                setStateData((prevState)=>({
                    ...prevState,
                    [`processed_reason`]: event.target.value
                }))
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

            />
        </div>
        <div style={{marginTop:"4%",display:"flex", marginBottom:"5%"}}>
        <Button
        id="cancel"
        buttonType="secondary"
        label="Cancel"
        customStyle={{...customRejectButton,border:"1px solid #134CDE",color:"#134CDE",width:"290px"}}
        onClick={handleProcessedClose}
        isDisabled={isLoading}
        />
        <Button
        id="submit"
        buttonType="primary"
        label="Submit"
        isDisabled={!isCompleteForm}
        customStyle={{...customProcessedButton, width:"290px"}}
        onClick={(event)=>{
            rejectRefund()
        }}
        isLoading={isLoading}
        />
        </div>

    </FormPopup>}
    {rejectPopup&& 
    <FormPopup
    heading={"Confirm Rejection"}
    isOpen={rejectPopup}
    onClose={handleRejectClose}
    customStyles={{width:"700px"}}>
    <div style={{fontFamily:"Montserrat-Regular", fontSize:"16px", color:"#767888", fontWeight:"600",marginTop:"8%",marginBottom:"5%"}}>
        Are you sure you want to reject this refund request?
    </div>
    <TextField
              fullWidth
              id="outlined-basic"
              label="Add Comment"
              placeholder="Add Comment"
              size="string"
              rows={6}
              multiline
              required
              autoFocus
              value={stateData.rejection_reason}
              onChange={event => {
                setStateData((prevState)=>({
                    ...prevState,
                    [`rejection_reason`]: event.target.value
                }))
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

            />
        <div style={{marginTop:"4%",display:"flex", marginBottom:"2%"}}>
        <Button
        id="cancel"
        buttonType="secondary"
        label="Cancel"
        customStyle={{...customRejectButton,border:"1px solid #134CDE",color:"#134CDE",width:"322px"}}
        onClick={handleRejectClose}
        isDisabled={isLoading}
        />
        <Button
        id="submit"
        buttonType="primary"
        label="Submit"
        isDisabled={!stateData.rejection_reason}
        customStyle={{...customProcessedButton, width:"322px"}}
        onClick={(event)=>{
            rejectRefund(1);
        }}
        isLoading={isLoading}
        />
        </div>

    </FormPopup>}
    {alert&&
    <Alert
    severity={severity}
    message={alertMessage}
    handleClose={handleAlertClose}
    />}

    </>)
}
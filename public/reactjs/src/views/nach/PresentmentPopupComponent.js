import React, { useState, useEffect } from "react";
import FormPopUp from "react-sdk/dist/components/Popup/FormPopup";
import { validateData } from "../../util/validation";
import Button from "react-sdk/dist/components/Button";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import { verifyDateAfter1800 } from "../../util/helper";
import "react-sdk/dist/styles/_fonts.scss";
import moment from "moment";
import { useDispatch,useSelector } from "react-redux";
import { enachCreatePresentmentWatcher } from "../../../src/actions/enach";
import { storedList} from "../../util/localstorage";
import { AlertBox } from "../../components/CustomAlertbox";

const user = storedList("user");

const modalStyle = {
  position: "fixed",
  width: "30%",
  height: "100%",
  maxHeight: "100%",
  marginLeft: "35%",
  paddingTop: "2%",
  display: "flex",
  flexDirection: "column",
  float: "right",
};
const customStyle = {
  height: "60px",
  width: "100%",
  maxWidth: "100%",
  paddingTop: "0.5%",
  marginTop: "5%",
};

const customStyle1 = {
  height: "100%",
  width: "100%",
  maxWidth: "100%",
  marginTop: "6px",
};

export default function PresentmentCreation({
  isEdit,
  isOpen,
  setIsOpen,
  presentmentData,
  setPresentmentData,
  company_id_subscription,page ,rowstxnHistoryPerPage, reload
}) {
  const dispatch = useDispatch();

  const [openPresentment, setOpenPresentment] = useState(false);
  const [errorDateScheduledOn , setErrorDateScheduledOn] = useState(false);
  const [settlement, setSettlement] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

    const showAlert = (msg, type) => {
        setAlert(true);
        setSeverity(type);
        setAlertMessage(msg);
        setTimeout(() => {
            handleAlertClose();
        }, 2000);
    };
    const handleAlertClose = () => {
      setAlert(false);
      setSeverity("");
      setAlertMessage("");
  };

  const [tranches, setTranches] = useState([
    {
      settlement_date: "",
      settlement_amount: "",
      errorDate: false,
      errorAmount: false,
    },
  ]);

  const handleSubmit = (event, index) => {
    const payload = {
              user_id : user._id,
              company_id: user.company_id ,
              request_id : presentmentData?.subscriptionId,
              mandate_id : presentmentData?.UMRN,
              amount : presentmentData?.amount,
              old_presentment_txn_id : presentmentData.oldTxnId,
              scheduled_on : presentmentData?.scheduledOndate,
              company_id_subscription : company_id_subscription
    };
    if(!validateData(presentmentData?.scheduledOndate, "date") || !presentmentData?.scheduledOndate ){
      setErrorDateScheduledOn(true);
    }
    if(!presentmentData?.amount || !validateData(presentmentData?.amount, "float")){
      const updatedTranches = [...tranches];
      updatedTranches[0].errorAmount = true;
      setTranches(updatedTranches);
    }
    if(!presentmentData?.scheduledOndate){
      showAlert("Please select today or future dates for scheduling transaction ", "error");
      return
    }
    if(presentmentData?.scheduledOndate && presentmentData?.amount){ 
    let today = new Date();
    today.setHours(0,0,0);
    const selectedDate = Date.parse(presentmentData?.scheduledOndate);
    if( selectedDate < today){
        showAlert("Please select today or future dates for scheduling transaction ", "error");
        return;
    }
   new Promise((resolve, reject) => {
      dispatch(enachCreatePresentmentWatcher(payload, resolve, reject));
  }).then(() => {
      showAlert("Presentment created successfully", "success");
      setTimeout(() => {
          setIsOpen(false);
          if (page && rowstxnHistoryPerPage) {
              reload(page ,rowstxnHistoryPerPage)
          }
      }, 2000);
  }).catch((error) => {
      showAlert(error?.response?.data?.message || "Error while creating presentment", "error");
  });}

  };
  const handleClosePresentmentPopup = () => {
    setSettlement(false);
  };

  const handleClosePresentment = () => {
    setTranches([
        {
          settlement_date: "",
          settlement_amount: "",
          errorDate: false,
          errorAmount: false,
        },
      ]);
      setPresentmentData((prevState) => ({
        ...prevState,
        scheduledOndate: null,
      }));
    setIsOpen(false);
    setOpenPresentment(!settlement);
    handleClosePresentmentPopup();
  };

  const handleChange = (event, index) => {
    let { name, value } = event.target;
    setPresentmentData((prevState) => ({
      ...prevState,
      amount: value,
    }));

    if (name === "₹ settlement amount") name = "settlement_amount";
    const onChangeTranch = [...tranches];
    onChangeTranch[index][name] = value;
    onChangeTranch[index]["errorAmount"] = false;
    if(!validateData( "float",value)){
      onChangeTranch[index]["errorAmount"] = true;
    }
    setTranches(onChangeTranch);
   
    if (value > 0 || value === "") {
      setDisabled(false);
    } 
    else {
      onChangeTranch[index]["errorAmount"] = true;
      setDisabled(true);
    }
  };
  
  const handleChangeRemark = (event, index) => {
    let { name, value } = event.target;
    setPresentmentData((prevState) => ({
      ...prevState,
      remark: value,
    }));
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
      <FormPopUp
      
        heading= {isEdit ?"Retry Presentment" :"Create Presentment"}
        open={isOpen}
        isOpen={isOpen}
        onClose={handleClosePresentment}
        customStyles={modalStyle}
      >
        <div style={{ marginBottom: "20px",fontFamily: "Montserrat-Regular" , display:"flex", flexDirection:"column", justifyContent:"space-between" , height:"90vh"}}>
          {tranches.map((value, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "10px",
                }}
              >
                <InputBox
                  initialValue={presentmentData?.subscriptionId}
                  label="Registration ID"
                  id={"amount"}
                  helperText={
                    value.errorAmount ? "Enter valid amount greater than 0" : ""
                  }
                  isDisabled={true}
                  accordianResp={true}
                  customClass={{
                    ...customStyle,

                    display: "flex",

                    flexDirection: "column",
                  }}
                  customInputClass={customStyle1}
                  customErrorClass={{ marginTop: "12px" }}
                />
                <InputBox
                  initialValue={presentmentData?.UMRN}
                  label="URMN"
                  id={"URMN"}
                  helperText={
                    value.errorAmount ? "Enter valid amount greater than 0" : ""
                  }
                  isDisabled={true}
                  accordianResp={true}
                  customClass={{
                    ...customStyle,

                    display: "flex",

                    flexDirection: "column",

                    marginTop: "5%",
                  }}
                  customInputClass={customStyle1}
                  customErrorClass={{ marginTop: "12px" }}
                />
                <InputBox
                  initialValue={presentmentData.amount}
                  label="Amount"
                  id={"amount"}
                  onClick={(event) => {
                    event.target = event;
                    handleChange(event, index);
                  }}
                  error={
                    value.errorAmount > 0 ? "Please enter valid amount" : ""
                  }
                  helperText={
                    value.errorAmount ? "Please enter valid amount" : ""
                  }
                  isDisabled={false}
                  accordianResp={true}
                  customClass={{
                    ...customStyle,
                    display: "flex",
                    flexDirection: "column",
                  }}
                  customInputClass={customStyle1}
                  customErrorClass={{ marginTop: "12px" }}
                />
                <InputBox
                initialValue={presentmentData.remark}
                  label="Remarks"
                  id={"remarks"}
                  onClick={(event) => {
                    event.target = event;
                    handleChangeRemark(event, index);
                  }}
                  isDisabled={false}
                  accordianResp={true}
                  customClass={{
                    ...customStyle,
                    display: "flex",
                    flexDirection: "column",
                  }}
                  customInputClass={customStyle1}
                  customErrorClass={{ marginTop: "12px" }}
                />
                <div style={{ height: "21px" }}></div>
                <BasicDatePicker
                  name="Scheduled on"
                  placeholder="Scheduled on"
                  error={errorDateScheduledOn}
                  helperText={
                    errorDateScheduledOn
                      ? "Please enter date in correct format"
                      : ""
                  }
                  value={presentmentData.scheduledOndate}
                  onDateChange={(date) => {
                    setErrorDateScheduledOn(validateData(date, "date"));
                    if (date == "Invalid Date" || date == null) {
                      setPresentmentData((prevState) => ({
                        ...prevState,
                        scheduledOndate: null,
                      }));
                
                    } else {
                      setErrorDateScheduledOn(false);
                      setPresentmentData((prevState) => ({
                        ...prevState,
                        scheduledOndate: verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                        ? moment(date).format("YYYY-MM-DD")
                        : date,
                      }));
                
                    }
                  }}
                />
              </div>
            </div>
          ))}
          <div
            style={{
              display: "flex",
            }}
          >
            <Button
              id="cancel"
              label="Cancel"
              buttonType="secondary"
              onClick={handleClosePresentment}
              customStyle={{
                width: "49%",
                marginRight: "2%",
                color: "rgb(71, 91, 216)",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #475BD8",
                backgroundColor: "white",
                boxShadow: "none",
              }}
            />
            <Button
              id="create"
              label="Create"
              buttonType="primary"
              onClick={handleSubmit}
              customStyle={{
                borderRadius: "8px",
                width: "49%",
                fontSize: "16px",
              }}
            />
          </div>
        </div>
      </FormPopUp>
    </>
  );
}

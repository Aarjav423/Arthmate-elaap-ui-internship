import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AlertBox } from "../../components/AlertBox";
import { updateCreditLimitWatcher } from "../../actions/credit-limit";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button";
export const UpdateCreditLimitPopup = props => {
  const { openUpdateLimit, handleClose, data } = props;
  const dispatch = useDispatch();
  const [limitAmount, setLimitAmount] = useState("");
  const [tenureInDays, setTenureInDays] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const customButtonCss = {height:"38px",fontSize:"16px",padding: "13px 44px",borderRadius:"26px",gap:"10px",display:"flex",alignItems:"center"}
  const cancelCustomButtonCss = {height:"38px",fontSize:"16px",padding: "13px 44px",borderRadius:"26px",gap:"10px", color:"#475BD8",border:"1px solid #475BD8",display:"flex",alignItems:"center"}


  useEffect(() => {
    if (data?.limit_amount) setLimitAmount(data.limit_amount);
  }, []);

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 5000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setAlertMessage("");
    setSeverity("");
  };

  const handleUpdateCreditLimit = () => {
    setUpdateInProgress(true);
    let payload = {
      company_id: data.company_id,
      product_id: data.product_id,
      loan_id: data.loan_id,
      user_id: data.user_id,
      loan_app_id: data.loan_app_id,
      limit_amount: limitAmount,
    };
    if (tenureInDays > 0) payload["updated_tenure"] = tenureInDays;
    dispatch(
      updateCreditLimitWatcher(
        payload,
        result => {
          showAlert(result.message, "success");
          setTimeout(() => {
            handleClose();
          }, 3000);
        },
        error => {
          setUpdateInProgress(false);
          return showAlert(error?.response?.data?.message, "error");
        }
      )
    );
  };

  return (
    <div>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <FormPopup
          heading={"Update Credit limit"}
          onClose={handleClose}
          isOpen={openUpdateLimit}
          customStyles={{
              width: "fit-content",
              display:"flex",
              flexDirection: "column",
              position:"absolute",
              left:"42%",
              top:"47%",
          }}
          customHeaderStyle={{justifyContent:"space-between"}}
          >
            <div
             style={{display:"flex",justifyContent: "center",flexDirection: "column",
             width:"fit-content",
             margin:"24px 0px 0px 0px",
             gap:"24px"
            }}
            >
            <InputBox
            label="Loan ID"
            initialValue={data.loan_id}
            isDisabled={true} 
            customClass={{height:"56px",width:"600px",maxWidth:"none"}} 
            customInputClass={{maxWidth:"none",width:"100%"}}  
            isRequired={true}    
            />
            <InputBox
            label="Tenure (in days)"
            initialValue={tenureInDays}
            onClick={e => {
              setTenureInDays(e.value);
            }} 
            customClass={{height:"56px",width:"600px",maxWidth:"none"}} 
            customInputClass={{maxWidth:"none",width:"100%"}}      
            />
            <InputBox
            label="Updated credit limit"
            initialValue={limitAmount}
            onClick={e => {
              setLimitAmount(e.value);
            }}   
            customClass={{height:"56px",width:"600px",maxWidth:"none"}}  
            isRequired={true}    
            customInputClass={{maxWidth:"none",width:"100%"}}    
            />
            <div style={{marginTop:"-24px",color:"black",fontSize:"16px"}}>
                {`Current Limit - `}
                <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.limit_amount)}</span>
              </div>
            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <Button
                  label="Cancel"
                  onClick={handleClose}
                  buttonType="secondary"
                  customStyle={cancelCustomButtonCss}
                />
              <Button
                label="Update"
                buttonType="primary"
                customStyle={customButtonCss}
                onClick={handleUpdateCreditLimit}
                isDisabled={updateInProgress}
              />
            </div>
            </div>
          </FormPopup>
    </div>
  );
};

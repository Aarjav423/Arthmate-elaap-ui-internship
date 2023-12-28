import * as React from "react";
import { useState,useEffect } from "react";
import { storedList } from "../util/localstorage";
import { useDispatch } from "react-redux";
import { resetPassword } from "../actions/user";
import { AlertBox } from "../components/AlertBox";
import { useHistory } from "react-router-dom";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button/Button";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
export const PasswordReset = props => {
  const { openPopup, setOpenPopup, userData = false } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const user = storedList("user");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [error, setError] = useState(false);
  const [errors,setErrors]=useState("");
  const [flag, setFlag] = useState(true);
  const [insidePopup, setInsidePopup] = useState(false);
  const [resetPasswordProgress, setResetPasswordProgress] = useState(false);
  const handleClickShowPassword = setShowPassword => {
     setShowPassword(show => !show);
  };
  const handleOpenPopup = () => {
    setShowCurrentPassword(true);
    setShowNewPassword(true);
    setShowConfirmPassword(true);

  };
  const handleClosePopup = () => {
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();

  };
  const customStyle={
    marginTop:"1.5em" ,
    height:"60px",
    width:"100%",
    maxWidth:"100%",
    marginBottom:"1.9em",
    padding:"0px 16px",
    fontSize:"16px",
    fontFamily:"Montserrat-Regular"
    }
    
    const buttonCss = {
    marginTop:"1em",
    height:"56px",
    width:"100%",
    maxWidth:"100%",
    borderRadius:"8px",
    fontSize:"16px",
    fontFamily:"Montserrat-Regular"
    };
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

const handleResetPassword = () => {
    if (!!error) {
      setInsidePopup(true);
      return showAlert("Please enter valid password", "error");
    }

if (newPassword !== confirmPassword) {
      setInsidePopup(true);
      return showAlert("Password mismatch", "error");
    }

    const payload = {
      id: userData?._id || user._id,
      currentPassword: currentPassword,
      confirmPassword: confirmPassword,
      type: userData ? "adminChange" : "user"
    };
    setResetPasswordProgress(true);
    dispatch(
      resetPassword(
        payload,
        resolve => {
          setInsidePopup(false);
          showAlert(resolve.message, "success");
          setOpenPopup(false);

          if (!userData) {
            localStorage.clear();
            setResetPasswordProgress(false);
            setTimeout(() => {
              history.push("/login");
            }, 2000);
          } else {
            handleCLose();
          }
        },
        reject => {
          setResetPasswordProgress(false);
          setInsidePopup(true);
          showAlert(
            reject.response.data.message || "Failed to reset password",
            "error"
          );
        }
      )
    );
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };
  useEffect(()=>{
    var correctPassword=1;
    var error_string="";
    if (newPassword?.length>0)
    {
    if (newPassword?.toString().length < 8) {
         error_string+=`${correctPassword === 0 ? "," : ""}At least 8 characters`;
          setError(true);
          correctPassword=0;

        }
        if (newPassword?.toString().search(/[a-z]/i) < 0) {
          error_string += `${correctPassword === 0 ? "," : ""}At least one small letter`;
          setError(true);
          correctPassword=0;
        }
        if (newPassword?.toString().search(/(?=.*?[A-Z])/) < 0) {
          error_string += `${correctPassword === 0 ? "," : ""}At least one capital letter`;
          setError(true);
          correctPassword=0;
        }
    
        if (newPassword?.toString().search(/(?=.*?[`~#?!@$%^&*-])/) < 0) {
          error_string += `${correctPassword === 0 ? "," : ""}At least one special character`;
          setError(true);
          correctPassword=0;
        }
    
        if (newPassword?.toString().search(/[0-9]/) < 0) {
          error_string += `${correctPassword === 0 ? "," : ""}At least one digit`;
          setError(true);
          correctPassword=0;
        }
        if(correctPassword==0 && errors!=error_string)
        {
          setErrors(error_string);
        }

        if (correctPassword)
        {
          setError(false);
        }
      }
      
        
    
    
  },[newPassword])

  const handleSetPassword = (event, setPassword, checkStrong = false) => {
  
    if (flag) {
      setFlag(false);
      setShowConfirmPassword(true);
      setShowNewPassword(true);
      setShowCurrentPassword(true);

    }

    setPassword(event.value);
   

  };

  

  const handleCLose = () => {
    setOpenPopup(false);
    setConfirmPassword("");
    setNewPassword("");
    setCurrentPassword("");
    setShowConfirmPassword(false);
    setShowNewPassword(false);
    setShowCurrentPassword(false);
    setFlag(true);
    setError(false);
    setInsidePopup(false);

  };

  return (

        <div>
           {alert && !insidePopup ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
         { openPopup ? (
          <>
          {alert && insidePopup ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}
         <FormPopup heading="Change Password" 
          open={openPopup} 
          isOpen={openPopup}
          onClose={handleCLose} 
          customStyles={{height:"450px",justifyContent:"center",alignItems:"center",paddingLeft:"34px",padding:"24px"}} 
          customHeaderStyle={{paddingLeft:"3px",alignItems:"space-between",marginLeft:"2%"}}
          
          >
         <div style={{marginTop:"15%"}}>
              <InputBox
                label="Current Password"
                type={showCurrentPassword ? "password" : "text"}
                isDisabled ={false}
                isPassword = {true}
                width="100%"
                isSearch = {false}
                onClick={event =>
                handleSetPassword(event, setCurrentPassword)}
                isDrawdown={false}
                customClass={customStyle}
                customInputClass={{marginTop:"10px"}}
              />
            
           
              <InputBox
                label="New Password"
                type={showNewPassword ? "password" : "text"}
                isDisabled ={false}
                isPassword = {true}
                width="100%"
                isSearch = {false}
                onClick={event =>
                    handleSetPassword(event, setNewPassword, false)
                  }
                  onMouseDown={handleMouseDownPassword}
                  error={!!error}
                  helperText={errors}
                  isDrawdown={false}
                  customClass={customStyle}
                  customInputClass={{marginTop:"10px"}}
              />
           
           
              <InputBox
                label="Confirm New Password"
                type={showNewPassword ? "password" : "text"}
                isDisabled ={false}
                isPassword = {true}
                width="100%"
                isSearch = {false}
                onClick={event =>
                    handleSetPassword(event, setConfirmPassword)
                  }
                  error={
                    confirmPassword ? confirmPassword !== newPassword : false
                  }

                  helperText={
                    confirmPassword
                      ? confirmPassword !== newPassword
                        ? "Password mismatch"
                        : false
                      : false
                  }
              customClass={customStyle}
              customInputClass={{marginTop:"10px"}}
              />
          
            <Button
              id="1"
              buttonType="primary"
              label="Change Password"
              customStyle={buttonCss}
              isDisabled={resetPasswordProgress ?true :false}
              onClick={handleResetPassword}
            />
            </div>
            
          </FormPopup>

       </>
          )
          :
          (
          <div></div>
          )}
        </div>
  );

};

import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { loginWatcher } from "../actions/user";
import Loginpagepic1 from "../views/loginpagelogo/ArthmateLogo.svg";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button/Button";
import "../../node_modules/react-sdk/dist/styles/_fonts.scss";
import "./loginpagelogo/loginpage.css";
import "react-sdk/dist/styles/_fonts.scss"


const inputBoxCss={
  height: "68px",
  padding: "5px",
  width:"520px",
  maxWidth: "520px"
    }
    const buttonCss = {
      display:"flex",
      width:"520px",
      height: "62px",
      fontSize: "16px",
      maxWidth: "520px",
      borderRadius: "45px",
      textAlign:"inherit",
      fontFamily:"Montserrat-SemiBold"
    }
  const customInputClass = {
    marginTop:"11px"
  }
  const customErrorStyle = {
    marginTop:"32px"
  }

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const handleSetUsername = (event) => setUsername(event.value);
  const handleSetPassword = (event) => setPassword(event.value);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const isloggedIn = localStorage.getItem("auth");
    if (location.pathname.indexOf("login") > -1 && isloggedIn) {
      history.push("/admin/dashboard");
    }
    return false;
  }, [location]);

  const handleSignIn = () => {
    setErrorMessage("");
    dispatch(
      loginWatcher(
        { username, password },
        (result) => {
          if (
            process.env.REACT_APP_BUILD_VERSION > 1 &&
            !result.user?.access_metrix_tags?.length
          ) {
            setErrorMessage(
              "The user is not assigned to any role for the application, please contact administrator."
            );
            return;
          } else {
            history.push("/admin/dashboard");
            window.location.reload();
          }
        },
        (error) => {
          setErrorMessage(
            error?.response?.data?.message || "Something went Wrong"
          );
        }
      )
    );
  };

  return (
    <div className="main-container">
      {/* login page image component */}
      <div className="left-side-container">
        <div className="inside-container">
          <img className="logo" src={Loginpagepic1} alt="Logo" />
          <div>
            <h1 className="loanheading">Loan</h1>
            <h1 className="managementheading">Management</h1>
            <h1 className="systemheading">System.</h1>
          </div>
          <p className="paragraphheading">
            Experience the future of lending with our innovative loan management
            system
          </p>
        </div>
      </div>
      {/* login page form component */}
      <div className="right-side-container">
        <div className="inside-right-heading-container">
          <h1 className="login-heading">Login to your account</h1>
          <div className="login-subheading">
            Please enter your credentials to login
          </div>
          <form noValidate>
            <div className="inputdiv">
              <InputBox
                placeholder="Enter email id"
                label="Enter email id"
                type="text"
                onClick={handleSetUsername}
                isDrawdown={false}
                options={[]}
                customClass={inputBoxCss}
                customInputClass={customInputClass}
              />
            </div>

            <div className="inputdiv">
              <InputBox
                placeholder="Enter password"
                label="Enter password"
                type="password"
                width="100%"
                isPassword="true"
                isDrawdown={false}
                options={[]}
                onClick={handleSetPassword}
                customClass={inputBoxCss}
                customInputClass={customInputClass}
                helperText={
                  errorMessage
                  ? errorMessage
                  : ""
              }
              customErrorStyle={customErrorStyle}
              error={errorMessage}
              />
            </div>
          </form>
          {/* <div className="errormessage">{errorMessage}</div> */}
          <div className="buttondiv">
            <Button
              id="1"
              buttonType="primary"
              label="Login"
              customStyle={buttonCss}
              onClick={handleSignIn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

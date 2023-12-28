import React, { useState, useEffect } from "react";
import FormPopUp from "react-sdk/dist/components/Popup/FormPopup";
import { validateData } from "../../util/validation";
import Button from "react-sdk/dist/components/Button";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import { verifyDateAfter1800 } from "../../util/helper";
import moment from "moment";

const modalStyle = {
  position: "absolute",
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

export default function SubscribeEventPopup({
  isOpen,
  setIsOpen,
  subscribeEventData,
  setSubscribeEventData,
}) {
  const [openPresentment, setOpenPresentment] = useState(false);
  const [errorDateScheduledOn , setErrorDateScheduledOn] = useState(false);
  const [settlement, setSettlement] = useState(false);
  const [disabled, setDisabled] = useState(true);


  const handleSubmit = (event, index) => {};
  const handleClosePresentmentPopup = () => {
    setSettlement(false);
  };

  const handleClosePresentment = () => {
      setSubscribeEventData((prevState) => ({
        ...prevState,
        event: null,
        callBackURL :null,
        securityKey : null,
        eventError : false,
        callBackURLError : false,
        securityKeyError : false    
      }));
    setIsOpen(false);
    setOpenPresentment(!settlement);
    handleClosePresentmentPopup();
  };

//   const handleChange = (event) => {
//     let { name, value } = event.target;
//     setSubscribeEventData((prevState) => ({
//       ...prevState,
//       amount: value,
//     }));

//     if (name === "₹ settlement amount") name = "settlement_amount";
//     if(!validateData( "float",value)){
//     }
   
//     if (value > 0 || value === "") {
//       setDisabled(false);
//     } 
//     else {
//       setDisabled(true);
//     }
//   };
const handleChangeSecurityKey = (event) => {
    let { name, value } = event.target;
    let isValid = validateData( "string",value);
    setSubscribeEventData((prevState) => ({
      ...prevState,
      securityKey: value,
      securityKeyError : isValid
    }));
  };
  const handleChangecallBackURL = (event) => {
    let { name, value } = event.target;
    // let isValid = validateData( "website",value);
    setSubscribeEventData((prevState) => ({
      ...prevState,
      callBackURL: value,
    //   callBackURLError: !isValid,
    }));
  };

  const eventDropDownChange = (value) => {
    let isValid = validateData("string",value?.value);

    if (value?.value !== undefined && value?.value !== null) {
        setSubscribeEventData(prevState => ({
        ...prevState,
        event: value?.value,
        eventError: isValid,
      }));
    }
  };

  return (
    <>
      <FormPopUp
        heading="Subscribe Event"
        open={isOpen}
        isOpen={isOpen}
        onClose={handleClosePresentment}
        customStyles={modalStyle}
      >
        <div style={{ marginBottom: "20px" }}>
            <div
              key={"ufr"}
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "15px",
                marginTop: "20px",
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
                customDropdownClass={{"zIndex": 9999, marginTop:"20px"}}
                isDrawdown={true}
                options={[{"label": "Option 1", "value": "Option 1"} ,{"label": "Option 2", "value": "Option 2"} ,{"label": "Option 3", "value": "Option 3"}  ]}
                  value={subscribeEventData.event}
                  label="Select Event"
                  id={"Select Event"}
                  onClick={(event) => {
                    event.target = event;
                    eventDropDownChange(event);
                  }}
                  error={
                    subscribeEventData?.eventError
                  }
                //   helperText={
                //      "Please enter valid amount" 
                //   }
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
                  value={subscribeEventData.callBackURL}
                  label="Call Back URL"
                  id={"Call Back URL"}
                  onClick={(event) => {
                    event.target = event;
                     handleChangecallBackURL(event);
                  }}
                  error={
                    subscribeEventData?.callBackURLError
                  }
                  helperText={
                    subscribeEventData?.callBackURLError ? "Please enter valid URL" : ""
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
                 value={subscribeEventData.securityKey}
                  label="Security Key"
                  id={"Security Key"}
                  onClick={(event) => {
                    event.target = event;
                    handleChangeSecurityKey(event);
                  }}
                  errror = {
                    subscribeEventData?.securityKeyError
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
                <div style={{ height: "21px" }}></div>
              </div>
            </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              bottom: "0",
              width: "99%",
              marginBottom: "12%",
              paddingTop: "55%",
              marginTop: "55%",
              position: "relative",
            }}
          >
            <Button
              id="cancel"
              label="Cancel"
              buttonType="secondary"
              onClick={handleClosePresentment}
              customStyle={{
                borderRadius: "16px",
                height: "9%",
                width: "49%",
                marginRight: "2%",
                color: "rgb(71, 91, 216)",
                fontSize: "80%",
                borderRadius: "8px",
                border: "1px solid #475BD8",
                backgroundColor: "white",
                boxShadow: "none",
                border: "1px solid #475BD8",
              }}
            />
            <Button
              id="Submit"
              label="Submit"
              buttonType="primary"
              onClick={handleSubmit}
              customStyle={{
                borderRadius: "8px",
                width: "49%",
                height: "9%",
                fontSize: "80%",
              }}
            />
          </div>
        </div>
      </FormPopUp>
    </>
  );
}


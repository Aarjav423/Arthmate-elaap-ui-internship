
import * as React from "react";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button";

export const SetCreditLimitPopup = (props) => {
  const { openLimit, handleClose, handleSetCreditLimit, setLimitAmount } =
    props;
  const customButtonCss = {height:"38px",fontSize:"16px",padding: "13px 44px",borderRadius:"26px",gap:"10px",display:"flex",alignItems:"center"}
  const cancelCustomButtonCss = {height:"38px",fontSize:"16px",padding: "13px 44px",borderRadius:"26px",gap:"10px", color:"#475BD8",border:"1px solid #475BD8",display:"flex",alignItems:"center"}
  return (
    <FormPopup
          heading={"Credit limit amount"}
          onClose={handleClose}
          isOpen={openLimit}
          customStyles={{
              width: "fit-content",
              display:"flex",
              flexDirection: "column",
              position:"absolute",
              left:"42%",
              top:"52%",
          }}
          customHeaderStyle={{justifyContent:"space-between"}}
          >
            <div
             style={{display:"flex",justifyContent: "center",flexDirection: "column",
             width:"fit-content",
             margin:"24px 0px 0px 0px"
            }}
            >
            <InputBox
            label="Enter credit limit amount"
            onClick={(event) => {
                        setLimitAmount(event.value)
                      }}   
            customClass={{height:"56px",width:"600px",maxWidth:"none"}}   
            customInputClass={{maxWidth:"none",width:"100%"}}      
            />
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:"24px"}}>
              <Button
                  label="Cancel"
                  onClick={handleClose}
                  buttonType="secondary"
                  customStyle={cancelCustomButtonCss}
                />
              <Button
                label="Set Limit"
                onClick={handleSetCreditLimit}
                buttonType="primary"
                customStyle={customButtonCss}
              />
            </div>
            </div>
          </FormPopup>
  );
};

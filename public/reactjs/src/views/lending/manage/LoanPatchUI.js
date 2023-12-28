import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { LoanPatchFields } from "./loanPatchFields";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { recalibrateSanctionWatcher } from "../../../actions/recalibrate-api";
import { storedList } from "../../../util/localstorage";
import { verifyDate, verifyFloat } from "../../../util/helper";
import moment from "moment";
import BasicDatePicker from "../../../components/DatePicker/basicDatePicker";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { verifyDateAfter1800 } from "../../../util/helper";
import CustomInputBox from "react-sdk/dist/components/InputBox/InputBox";
import CustomFormPopup from "react-sdk/dist/components/Popup/FormPopup";
import CustomButton from "react-sdk/dist/components/Button/Button";
const inputBoxCss = {
  marginTop: "10px",
  width: "252px",
  marginLeft: "-5px",
  zIndex: 1,
}
const inputCssBankDetail = {
  height: "56px", 
  width: "237px",
 padding: "5px 15px 10px 10px", 
 maxWidth : "none"
}


const BootstrapDialogTitle = props => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export function LoanPatchUI(props) {
  const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(false);
  const [isResetButtonDisabled, setIsResetButtonDisabled] = useState(false);
  const { handleClose, open, data, showAlert } = props;

  const [errors, setErrors] = useState([]);
  const phases = {
    1: [0, 4],
    2: [4, 6],
    3: [6, 9],
    4: [9, 13],
    5: [13, 17],
    6: [17, 21],
    7: [21, 22],
    8: [22, 23]
  };
  const [payload, setPayload] = useState({});
  const dispatch = useDispatch();
  const user = storedList("user");

  const handleUpdate = () => {
    setIsUpdateButtonDisabled(true);
    setIsResetButtonDisabled(true);
    const payloadData = {
      userData: {
        company_id: data.company_id,
        product_id: data.product_id,
        user_id: user._id
      },
      submitData: payload,
      loan_id: data.loan_id
    };
    
    dispatch(
      recalibrateSanctionWatcher(
        payloadData,
        result => {
          showAlert(result.message, "success");
          window.location.reload();
          handleClose();
          setIsUpdateButtonDisabled(false);
          setIsResetButtonDisabled(false);
        },
        error => {
          showAlert(error?.response?.data?.message, "error");
          setIsUpdateButtonDisabled(false);
          setIsResetButtonDisabled(false);
        }
      )
    );
  };
  
  const change = (event, field) => {
    const tempValueStorage = payload;
    tempValueStorage[field.name] =
      field.type === "Date"
        ? verifyDateAfter1800(moment(event).format("YYYY-MM-DD"))
          ? moment(event).format("YYYY-MM-DD")
          : event
        : event?.value;
    if (
      (field.type === "Date" &&
        (verifyDate(
          verifyDateAfter1800(moment(event).format("YYYY-MM-DD"))
            ? moment(event).format("YYYY-MM-DD")
            : event
        ) ||
          event === "")) ||
      verifyFloat(event?.value) ||
      event?.value === ""
    ) {
      const removeErrorFields = [];
      setPayload(tempValueStorage);
      errors?.forEach(error => {
        if (error !== field.name) {
          removeErrorFields.push(error);
        }
      });
      setErrors(removeErrorFields);
    } else {
      const fieldName = field.name;
      const fieldNames = errors;
      fieldNames.push(fieldName);
      setErrors(Array.from(new Set(fieldNames)));
    }
  };

  const handleClear = () => {
    const temp = {};
    LoanPatchFields().map((field, index) => {
      if (field.type === "Date")
        temp[field.name] = data[field.name]
          ? moment(data[field.name]).format("YYYY-MM-DD")
          : "";
      else temp[field.name] = data[field.name] || 0;
    });
    setPayload(temp);
    setErrors([]);
  };

  useEffect(() => {
    handleClear();
  }, []);
  
  return (
    <>
      <div>
        <CustomFormPopup customHeaderStyle = {{marginBottom :"10px"}} onClose={handleClose} heading="Update loan details" isOpen={open} customStyles={{ width: "fit-content", paddingLeft : "30px" ,display :"flex", flexDirection: "column"}}>
        <div style={{display:"grid", width : "fit-content" ,}}>
         
          {Object.keys(phases).map((ind, idx) => {
            return (
              <div  style={{display : "flex", marginBottom: "28px",width: "100%"}} key ={idx}>
                {LoanPatchFields()
                  .slice(phases[ind][0], phases[ind][1])
                  .map((field, index) => {
                    return (
                      <div  key ={index} style={{marginRight:"35px"}}>
                        {
                        field.type === "Date" ? (
                          <BasicDatePicker
                            placeholder={field.title}
                            value={payload[field.name]}
                            onDateChange={date => change(date, field)}
                          />
                        ) : (
                          <CustomInputBox
                            key={index}
                            initialValue={payload[field.name] + ""}
                            label={field.title}
                            error={errors?.includes(field.name)}
                            onClick={event => change(event, field)}
                            isDrawdown={false}
                            customDropdownClass={inputBoxCss}
                            customClass= {inputCssBankDetail}
                            />
                        )
                        }
                      </div>
                    );
                  })}
              </div>
            );
          })}
              <div style={{ display: "flex", marginLeft: "0px", marginTop: "30px", justifyContent:"flex-end", width: "100%" }}>
               <div style={{flexDirection: "row", display: "flex"}}>

              <CustomButton label="Update" buttonType="primary" customStyle={{ height: "42px", fontSize: "14px", padding: "8px", width: "85px" }} onClick={handleUpdate} isDisabled={isUpdateButtonDisabled} />
              <CustomButton label="Reset" buttonType="secondary" customStyle={{ color: "red", border: "1px solid red", height: "42px", fontSize: "14px", fontWeight: "600", padding: "8px", width: "85px",marginRight: "15px" }} onClick={handleClear} isDisabled={isResetButtonDisabled}/>
              </div>
              </div>
              </div>
        </CustomFormPopup>
      </div>
    </>
  );
}

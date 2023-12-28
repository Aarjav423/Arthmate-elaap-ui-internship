import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { collateralFields } from "./CollateralFields";
import { useEffect, useState } from "react";
import { verifyDate, verifyFloat, verifyString } from "../../util/helper";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { addCollateralByIdWatcher } from "../../actions/collateral";
import { storedList } from "../../util/localstorage";
import { useParams } from "react-router-dom";
import { AlertBox } from "../../components/AlertBox";
import * as React from "react";

export const Collateral = ()=>{
  
  const [payload, setPayload] = useState({});
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  
  const user = storedList("user");
  
  const {
    company_id,
    product_id,
  } = useParams();
  
  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };
  
  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };
  
  const handleSubmit = ()=>{
    
    if(errors.length){
      return showAlert("Please enter valid data","error");
    }
    
    const tempErrors = errors;
    
    if(payload.loan_id === ""){
      tempErrors.push("loan_id");
    }
    if(payload.engine_number === ""){
      tempErrors.push("engine_number");
    }
    if(payload.chassis_number === ""){
      tempErrors.push("chassis_number");
    }
  
    if(tempErrors.length){
      setErrors(errors);
      return showAlert("* marked fields are mandatory","error");
    }
    
    const payloadData = {
      userData: {
        company_id: company_id,
        product_id: product_id,
        user_id: user._id,
      },
      submitData: payload,
    }
    dispatch(addCollateralByIdWatcher(payloadData,
      resolve=>{
        showAlert(resolve.message,"success");
        handleClear();
      }, reject=>{
        showAlert(reject?.response?.data?.message,"error");
      }))
  }
  
  const handleClear = ()=>{
    const tempPayload = {};
    setErrors([]);
    collateralFields().map(field=>{
      tempPayload[field.name] = "";
    })
    setPayload(tempPayload);
  }
  
  const change = (event, field) => {
    const tempValueStorage = payload;
    tempValueStorage[field.name] = event.target.value;
    if (
        (( field.type === "float" && verifyFloat(event.target.value)) ||
        ( field.type === "string" && verifyString(event.target.value)) ||
        ( field.type === "date" && verifyDate(event.target.value))) ||
        event.target.value === ""
       )
    {
      const removeErrorFields = [];
      setPayload(tempValueStorage);
      errors?.forEach(error=>{
        if(error !== field.name){
          removeErrorFields.push(error);
        }
      })
      setErrors(removeErrorFields);
    }else{
      const fieldName = field.name;
      const fieldNames = errors;
      fieldNames.push(fieldName);
      setErrors(Array.from(new Set(fieldNames)));
    }
  };
  
  useEffect(()=>{
    const temp = {};
    collateralFields().map(field=>{
      temp[field.name] = "";
    })
    setPayload(temp);
  },[])
  
  return(
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <Typography variant={"h6"} m={2}>
        Collateral data
      </Typography>
      <Grid container mt={2} sx={{marginLeft:"5px"}} display={"flex"} justifyContent={"flex-start"} alignItems={"center"} scrolling={""} >
        {
          collateralFields().map((field, index)=>{
            return(
              <Grid item xs={3} mb={2} key={index} >
                <TextField
                  key={index}
                  label={field.title}
                  required={field.required}
                  placeholder={field.title}
                  value={payload[field.name]}
                  onChange={(event)=>change(event, field)}
                  error = {errors?.includes(field.name)}
                  fullWidth
                />
              </Grid>
            )
          })
        }
      </Grid>
      <Grid container m={2}>
        <Grid item>
          <Button item onClick={handleSubmit} variant={"contained"} color={"info"}>
            Submit
          </Button>
        </Grid>
        <Grid item>
          <Button variant={"contained"} onClick={handleClear} color={"error"} >
            Clear
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

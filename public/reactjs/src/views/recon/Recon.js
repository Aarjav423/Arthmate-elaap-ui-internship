import Typography from "@mui/material/Typography";
import ReconSummary from "../../components/Loan/ReconSummary";
import Grid from "@mui/material/Grid";
import { AlertBox } from "../../components/AlertBox";
import * as React from "react";
import { useEffect, useState } from "react";
import { getReconDetails } from "../../actions/recon";
import { storedList } from "../../util/localstorage";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import CurrentDue from "../../components/Loan/CurrentDue";
import TotalPaid from "../../components/Loan/TotalPaid";
import InstallmentsAndRepayments from "../../components/Loan/InstallmentsAndRepayments";

const Recon = () =>{
  
  const [result, setResult] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const user = storedList("user");
  const {company_id, product_id, loan_id} = useParams();
  
  const dispatch = useDispatch();
  
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
  
  useEffect(()=>{
    const data = {
      user_id: user._id,
      loan_id: loan_id,
      product_id: product_id,
      company_id: company_id
    }
    dispatch(
      getReconDetails(data,
        response=>{
          setResult(response);
        },
        error=>{
          showAlert(error?.response?.data?.message,"error")
        })
      )
  },[])
  
  return(
    <>
      <div>
        <div style={{display:"flex", flexDirection:"column" , justifyContent:"center", textAlign:"center" , alignItems:"center"}}>
          {alert ? (
            <AlertBox
              severity={severity}
              msg={alertMessage}
              onClose={handleAlertClose}
            />
          ) : null}
        </div>
      </div>
      {result &&
        <ReconSummary data={result?.reconSummaryData} />
      }
      {result &&
        <CurrentDue data={result?.currentDueData} />
      }
      {result &&
        <TotalPaid data={result?.totalPaidData} />
      }
      {result &&
        <InstallmentsAndRepayments showAlert={showAlert} data={result?.installmentAndRepaymentData} />
      }
    </>
  )
}

export default Recon

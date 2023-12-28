import React, { useEffect, useState } from 'react'
import InputBox from 'react-sdk/dist/components/InputBox/InputBox'
import Alert from "react-sdk/dist/components/Alert/Alert";
import { getBorrowerDetailsByIdWatcher } from "../../../../actions/borrowerInfo";
import { useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import "./natch.style.css"


const Natch = () => {
    const [umrnNumber, setUmrnNumber] = useState("");
    const [severity, setSeverity] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const { loan_id, company_id, product_id } = useParams();
    const [ alert, setAlert] = useState(false)
    const dispatch = useDispatch()

    const handleAlertClose = () => {
        setAlert(false);
        setSeverity("");
        setAlertMessage("");
      };

    const showAlert = (msg, type) => {
        const element = document.getElementById("TopNavBar");

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
          });
        }
    
        setAlert(true);
        setSeverity(type);
        setAlertMessage(msg);
    
        setTimeout(() => {
          handleAlertClose();
        }, 3000);
      };

    const fetchLoandetails = () => {
        const params = {
        company_id: company_id,
        product_id: product_id,
        loan_id: loan_id,
        };
        dispatch(getBorrowerDetailsByIdWatcher(params,
                (result) => {
                    let loanData = result.data;
                    if(loanData.subscription_umrn){
                        setUmrnNumber(loanData.subscription_umrn)
                    }else{
                        showAlert("E-nach mandate not registered", "error");
                    }
                },
                (error) => {
                //   return showAlert(error.response.data.message, "error");
                },
            ),
        );
    };

    useEffect(() => {
        setImmediate(()=>{
            fetchLoandetails();
        })
    }, []);

    return (
        <div className='nach-container'>
            <InputBox
                label={"UMRN"}
                isDrawdown={false}
                customClass={{
                    height: "3.5rem",
                    width: "30rem",
                    maxWidth: "100%",
                }}
                initialValue={umrnNumber}
                isDisabled={true}
                customInputClass={{
                    width: "100%",
                    backgroundColor: "#fff",
                    fontFamily: "Montserrat-Regular",
                    fontWeight: "400",
                    lineHeight: '150%',
                }}
                onClick={e=>{setUmrnNumber(e.value)}}
            />

        {alert ? (
            <Alert
            severity={severity}
            message={alertMessage}
            handleClose={handleAlertClose}
            />
        ) : null}
        </div>
    )
}

export default Natch

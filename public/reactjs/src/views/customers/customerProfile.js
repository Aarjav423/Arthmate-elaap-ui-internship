import React, { useState,useEffect } from "react";
import CustomizeTemplates from "../loanSchema/templateTabs";
import { AlertBox } from "../../components/AlertBox";
import {getCustomerDocsWatcher,getCustomerDetailsWatcher} from "../../actions/customer";
import CustomerDocList from "./customerDocList";
import CustomerDetails from "./customerDetails";
import { storedList } from "../../util/localstorage";
import { useSelector, useDispatch } from "react-redux";
import Img from "../lending/images/download-button.svg";
import imgH from "../lending/images/download-button-hover.svg";
import { downloadCibilReport } from "../../actions/loanRequest";
import Button from "react-sdk/dist/components/Button/Button";


const CustomerProfile=(props) => {
    const [customerProf,setCustomerProfile]=useState(true);
    const [customerDocTab,setCustomerDocTab]=useState(false);
    const [customerDocs,setCustomerDocuments]=useState(null);
    const [customerDetails,setCustomerDetails]=useState(null);
    const user = storedList("user");
    const dispatch = useDispatch();
    const [alert,setAlert]=useState(false);
    const [alertMessage,setAlertMessage]=useState("");
    const [severity,setSeverity]=useState("");
    const [borrowerType, setBorrowerType] = useState(0);
    const [companyId, setCompanyId] = useState(0);
    const [productId, setProductId] = useState(0);
    const [loanAppId, setLoanAppId] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const URLdata = window.location.href;
    const [payload,setPayload]=useState({
      customer_id:URLdata.split("/").slice(-1)[0],
      user_id:user._id
    });
    const customer_id=URLdata.split("/").slice(-1)[0];
    const [flag,setFlag]=useState(true);

    const buttonCss = {
      display: "flex",
      width: "110%",
      height: "40px",
      border: "1px solid #475BD8",
      borderRadius: "26px",
      color: "#475BD8",
      fontSize: "13px",
      fontFamily: "Montserrat-Regular",
      padding: "10px 24px",
      backgroundColor: "#FFF"
    }

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
      }, 4000);
    };

    const handleCustomerProfile=()=>{
        setCustomerProfile(true);
        setCustomerDocTab(false);
    }
    const getCustomerDetails= async(payload)=>{
      if (payload)
      {
          dispatch(
              getCustomerDetailsWatcher(
                  payload,
                  async(result)=>{
                      setCustomerDetails(result);
                      setLoanAppId(result['customerDetails']?.loan_app_id);
                      setCompanyId(result['customerDetails']?.company_id);
                      setProductId(result['customerDetails']?.product_id);
                  },
                  (error) => {
                    setAlert(true);
                    setSeverity("error");
                    setAlertMessage("Unable to find Customer Profile");
                    setTimeout(() => {
                          handleAlertClose();
                    }, 4000);

                  }
    
              )
          )
      }

  }
    const getCustomerDocs=async(payload)=>{
      dispatch(getCustomerDocsWatcher(
          payload,
          async(result)=>{
              setCustomerDocuments(result.docResponse);
          },
          (error) => {
              setCustomerDocuments(null);
          }
      ))
  }

  const downloadCreditReport = () => {
    const params = {
      loan_app_id: loanAppId,
      company_id: companyId,
      product_id: productId,
      borrower_type: borrowerType
    };
    dispatch(
      downloadCibilReport(
        params,
        (result) => {
          handleDownload(result, customer_id);
        },
        (error) => {
          showAlert("Error while downloading credit report", "error");
        }
      )
    );
  };

  const handleDownload = async (data, customer_id) => {
    try {
      const linkSource = `data:application/pdf;base64,${data}`;
      const downloadLink = document.createElement("a");
      const fileName = `${customer_id}_credit_report.pdf`;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      setDisabled(true);
    } catch (err) {
      setDisabled(true);
    }
  };

  useEffect(()=>{
    if (flag)
    {
      getCustomerDetails({customer_id:customer_id})
      getCustomerDocs(payload);
      setFlag(false);
    }
  })

    const handleDocuments=()=>{
        setCustomerDocTab(true);
        setCustomerProfile(false);
    }

    const changeActiveTab = (tabName) => {
        const tabClickHandlers = {
          'customer details': handleCustomerProfile,
          'documents': handleDocuments,
        };
        const tabClickHandler = tabClickHandlers[tabName];
        
        if (tabClickHandler) {
          tabClickHandler();
        }
      };

  

    return(
        <>
        {alert?<AlertBox severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}/>:null}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
          {customerDocs?<CustomizeTemplates
                  marginLeft="24px"
                  templatesdata={['Customer Details','Documents']}
                  initialState = {'Customer Details'}
                  onIndexChange={changeActiveTab}
          />:<CustomizeTemplates
          marginLeft="24px"
          templatesdata={['Customer Details']}
          initialState = {'Customer Details'}
          />}
          </div>
          <div style={{ marginTop: "11px", marginRight: "40px", float: "right" }}>
            <Button label='Credit Report'
              customStyle={buttonCss}
              onClick={downloadCreditReport}
              imageButton={Img} imageButtonHover={imgH} iconButton="btn-secondary-download-button"
              buttonType='secondary'/>
	        </div>
        </div>
        {customerDocTab&&<>
        <CustomerDocList customerDocs={customerDocs}/>
        </>
        }
        {customerProf&&<>
        <div>
           {customerDetails&&<CustomerDetails custDetails={customerDetails}/>}
        </div>
        </>}
        </>
    )

    
    
    
};
export default CustomerProfile
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSoaDetailsWatcher, getSoaRequestWatcher, downLoadFileSoaRequestWatcher } from "../../actions/soa"
import { storedList } from "../../util/localstorage";
import { checkAccessTags } from "../../util/uam";
import { AlertBox } from "../../components/AlertBox";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import Button from "react-sdk/dist/components/Button/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
export default function StatementOfAccount(props) {
  const { data, onModalClose, openDialog, setOpenDialog, company, product } =
    props;
  const [loanId, setLoanId] = useState(data.loan_id);
  const [companyId, setCompanyId] = useState(data.company_id);
  const [productId, setProductId] = useState(data.product_id);
  const [soaData, setSoaData] = useState({});
  const [soaRequestData, setSoaRequestData] = useState({});
  const dispatch = useDispatch();
  const user = storedList("user");
  const [progress, setProgress] = useState(0);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [showLoader, setShowLoader] = useState(false)
  const [showGenerateButton, setShowGenerateButton] = useState(false)
  const [showLoaderNext, setShowLoaderNext] = useState(false)
  const [showDownloadLast, setShowDownloadLast] = useState(true)
  const [requestId, setRequestId] = useState('')

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  // const buttonCss = {
  //   width: "100%",
  //   maxWidth: "100%",
  //   marginBottom: "2.5em",
  //   borderRadius: "8px",
  //   fontSize: "14px",
  //   color: "white",
  //   backgroundColor: "#475BD8",
  //   fontFamily: 'Montserrat-Regular',
  //   fontSize: "16px",
  //   display: "flex",
  //   flexDirection: "column",
  //   marginBottom: "10vh"


  // };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  let isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const handleGenerateStatement = () => {
    const payload = {
      loan_id: loanId,
      user_id: user._id,
      company_id: companyId,
      product_id: productId,
      requestId: requestId
    };
    new Promise((resolve, reject) => {
      dispatch(downLoadFileSoaRequestWatcher(payload, resolve, reject));
    })
      .then((response) => {
        const linkSource = `data:application/pdf;base64,${response}`;
        const downloadLink = document.createElement("a");
        const fileName = "statement_of_account.pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, "error");
      });
  }

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_loan_queue_soa_read_write",
      ])
    )
      getSoaDetails();
    if (!isTagged) getSoaDetails();
  }, []);

  const getSoaDetails = () => {
    const payload = {
      loan_id: loanId,
      user_id: user._id,
      company_id: companyId,
      product_id: productId,
    };
    new Promise((resolve, reject) => {
      dispatch(getSoaDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setShowGenerateButton(true)
        setSoaData(response.data);
        setRequestId(response.data.previousGenerated?.request_id)
        setOpenDialog(true);
      })
      .catch((error) => {
        setOpenDialog(false);
        onModalClose(error?.response?.data?.message, "error");
      });
  };

  const showEmailAndDownload = () => {
    setShowGenerateButton(false)
    setShowDownloadLast(false)
  }

  const getSoaRequest = () => {
    const payload = {
      loan_id: loanId,
      user_id: user._id,
      company_id: companyId,
      product_id: productId
    };
    new Promise((resolve, reject) => {
      setShowGenerateButton(false)
      setShowLoader(true);
      dispatch(getSoaRequestWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setShowLoader(false)
        setShowLoaderNext(true);
        setSoaRequestData(response.data)
        showAlert(response.message, "success");
      })
      .catch((error) => {
        setShowLoader(false)
        showAlert(error.response.data.message, "error");
      });
  };

  const handleClose = () => {
    setOpenDialog(false);
    onModalClose("", "");
  };

  const popupContainerStyles = {
    transform: "translateY(-50%)",
    width: "30%",
    maxWidth: "30%",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
    marginLeft: "20%",
    height: "100vh",
    maxHeight: "100vh",
  };

  return (
    <>
      <div>
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}
      </div>
      {Object.keys(soaData).length > 0 ?
        (<div>
          <FormPopup
            heading="Statement of Account"
            isOpen={openDialog}
            onClose={handleClose}
            customStyles={popupContainerStyles}
            customHeaderStyle={{ marginLeft: "1.3%" }}
          >
            <div style={{display: "flex", justifyContent: "space-between", flexDirection: "column"}}>
            {soaData.allowLoc > 0 ? (
          <div>
            <div style={{ margin: "20px 8px" ,fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
              <span style={{display:"flex", justifyContent:"space-between" , fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
                Sanction Amount
                <span style={{fontSize: "16px", color: "#141519",fontFamily:"Montserrat-Medium",fontWeight:"500",fontStyle: "normal",lineHeight:"150%" }}>
                {new Intl.NumberFormat('en-IN',{ style: 'currency', currency: 'INR'}).format(parseFloat(soaData.sanction_amount))}
                </span>
              </span>
            </div>

            <div style={{ margin: "20px 8px",fontFamily:'Montserrat-Medium',fontSize:"16px" ,color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
              <span style={{display:"flex", justifyContent:"space-between", fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
                Used Amount
                <span style={{fontFamily:"Montserrat-Medium",fontSize:"16px" ,color:"#141519",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
                {new Intl.NumberFormat('en-IN',{ style: 'currency', currency: 'INR'}).format(parseFloat(soaData.used_amount))}
                </span>
              </span>
            </div>

            <div style={{ margin: "20px 8px" ,fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
              <span style={{display:"flex", justifyContent:"space-between", fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
                 Available Balance
                <span style={{fontFamily:"Montserrat-Medium",fontSize:"16px" ,color:"#141519",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
               
                {new Intl.NumberFormat('en-IN',{ style: 'currency', currency: 'INR'}).format(parseFloat(soaData.available_limit))}
                </span>
              </span>
            </div>

            <div style={{ margin: "20px 8px",fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80" ,fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
              <span style={{display:"flex", justifyContent:"space-between", fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
                 No Of Drawdown
                <span style={{fontFamily:'Montserrat-Medium',fontSize:"16px" ,color:"#141519",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>{soaData.drawdown_count}</span>
              </span>
            </div>

            <div style={{ margin: "20px 8px" ,fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
              <span style={{display:"flex", justifyContent:"space-between", fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
                 Line Status
                <span style={{fontFamily:"Montserrat-Medium",fontSize:"16px" ,color:"#141519",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>{soaData.line_status}</span>
              </span>
            </div>

                    <div style={{ margin: "20px 8px", fontFamily: 'Montserrat-Medium', fontSize: "16px", color: "#6B6F80" ,fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
          <span style={{display:"flex", justifyContent:"space-between", fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
             Line Expiry Date
            <span style={{fontFamily: "Montserrat-Medium", fontSize: "16px", color: "#141519",fontWeight:"500",fontStyle: "normal",lineHeight:"150%" }}>
              {soaData.expiry_date === 0 ? 'NA' : soaData.expiry_date}
            </span>
          </span>
        </div>
          </div>
        ) : (
          <div>
            <div style={{ margin: "20px 8px" ,fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight: "500",fontStyle: "normal",lineHeight:"150%"}}>
              <span style={{display:"flex", justifyContent:"space-between", fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
                 Total Loan Amount Disbursed
                <span style={{fontSize: "16px", color: "#141519",fontFamily:"Montserrat-Medium",fontWeight:"500",fontStyle: "normal",lineHeight:"150%" }}>
                 {new Intl.NumberFormat('en-IN',{ style: 'currency', currency: 'INR'}).format(parseFloat(soaData.total_loan_amount_disbursed))}
                </span>
              </span>
            </div>

            <div style={{ margin: "20px 8px",fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight: "500",fontStyle: "normal",lineHeight:"150%"}}>
              <span style={{display:"flex", justifyContent:"space-between", fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
                 Total Amount Paid
                <span style={{fontSize: "16px", color: "#141519",fontFamily:"Montserrat-Medium",fontWeight:"500",fontStyle: "normal",lineHeight:"150%" }}>
                   {new Intl.NumberFormat('en-IN',{ style: 'currency', currency: 'INR'}).format(parseFloat(soaData.total_amount_paid))}
                </span>
              </span>
            </div>

            <div style={{ margin: "20px 8px",fontFamily:'Montserrat-Medium',fontSize:"16px" ,color:"#6B6F80",fontWeight: "500",fontStyle: "normal",lineHeight:"150%"}}>
              <span style={{display:"flex", justifyContent:"space-between", fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
                Total Outstanding
                <span style={{fontSize: "16px", color: "#141519",fontFamily:"Montserrat-Medium",fontWeight:"500",fontStyle: "normal",lineHeight:"150%" }}>
                  {new Intl.NumberFormat('en-IN',{ style: 'currency', currency: 'INR'}).format(parseFloat(soaData.current_outstanding))}
                </span>
              </span>
            </div>

            <div style={{ margin: "20px 8px",fontFamily:"Montserrat-Medium",fontSize:"16px" ,color:"#6B6F80",fontWeight: "500",fontStyle: "normal",lineHeight:"150%"}}>
              <span style={{display:"flex", justifyContent:"space-between", fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
                 EMI Amount
                <span style={{fontSize: "16px", color: "#141519",fontFamily:"Montserrat-Medium",fontWeight:"500",fontStyle: "normal",lineHeight:"150%" }}>
                  {new Intl.NumberFormat('en-IN',{ style: 'currency', currency: 'INR'}).format(parseFloat(soaData.emi_amount))}
                </span>
              </span>
            </div>
            <div style={{ margin: "20px 8px", fontFamily: "Montserrat-Medium", fontSize: "16px", color: "#6B6F80",fontStyle: "normal",lineHeight:"150%" }}>
            <span style={{display:"flex", justifyContent:"space-between", fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
              Next EMI Due Date
              {soaData.next_emi_date === 0 ? (
                <span style={{fontSize: "16px", color: "#141519",fontFamily:"Montserrat-Medium",fontWeight:"500",fontStyle: "normal",lineHeight:"150%" }}>NA</span>
              ) : (
                <span style={{fontSize: "16px", color: "#141519",fontFamily:"Montserrat-Medium",fontWeight:"500",fontStyle: "normal",lineHeight:"150%" }}>{soaData.next_emi_date}</span>
              )}
            </span>
          </div>

            <div style={{ margin: "20px 8px" ,fontFamily:"Montserrat-Medium",fontSize:"16px",color:"#6B6F80"}}>
              <span style={{display:"flex", justifyContent:"space-between", fontFamily:'Montserrat-Medium',fontSize:"16px",color:"#6B6F80",fontWeight:"500",fontStyle: "normal",lineHeight:"150%"}}>
                Loan Status
                <span style={{fontSize: "16px", color: "#141519",fontFamily:"Montserrat-Medium",fontWeight:"500",fontStyle: "normal",lineHeight:"150%" }}>
                  {soaData.loan_status === "disbursed" ? "Active" : soaData.loan_status}
                </span>
              </span>
            </div>
          </div>
        )
          }
          {showDownloadLast && soaData.previousGenerated?.request_id ? <div style={{ width: "98%", marginLeft: "7px" }}>
            <div
              style={{ width: "98%", textTransform: "none", marginTop: "24px", height: "48px" }}
              onClick={showEmailAndDownload}
            >
            <div style={{float:"left"}}>Last generated statement</div>
            <br/>
              <div style={{float:"left", color:"gray" , fontSize:"10px"}}>Requested date: {soaData?.requested_date}</div>
              <div >
             <div style={{marginTop:"30px",display:"flex",width:"100%",justifyContent:"center"}}>
               <Button  customStyle={{width:"70%",boxShawdow:"none"}} onClick={handleGenerateStatement} buttonType="primary" label="Email"  isDisabled={true}/>
               <Button customStyle={{width:"70%",boxShawdow:"none"}} buttonType="primary"  onClick={handleGenerateStatement} label ="Download"/>
            </div>
              </div>
            </div>
          </div> : null}
              {showGenerateButton &&
                <div style={{display:"flex", marginTop:"90%"}}>
                  <Button
                    buttonType="primary"
                    label="Generate new statement"
                    customStyle={{position: "fixed", bottom: "23px", width:"92%" ,  maxWidth: "92%",
    borderRadius: "8px",
    fontSize: "14px",
    color: "white",
    backgroundColor: "#475BD8",
    fontFamily: 'Montserrat-Regular'
  }}
                    // customStyle={buttonCss}
                    onClick={getSoaRequest}
                    
                  />
                </div>
              }
             



      
            </div>
          </FormPopup>
         
            {/* SCREEN 2  */}
            {showLoader && (
            <Box sx={{ width: "90%", marginLeft: "29px" }}>
              <LinearProgress />
              <div style={{ fontSize: "12px" }}>
                Statement generation is under process...
              </div>
            </Box>
          )}  
         
        </div>)
        : (<div></div>)
      }
    </>
  );
}

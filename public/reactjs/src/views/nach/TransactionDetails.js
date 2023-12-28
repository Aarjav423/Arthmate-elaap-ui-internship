import React, { useEffect, useState } from "react";
import "react-sdk/dist/styles/_fonts.scss";
import Accordian from "react-sdk/dist/components/Accordion/Accordion";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { transactionDetailsWatcher } from "../../actions/enachTransaction";
import { storedList } from "../../util/localstorage";
import { AlertBox } from "../../components/AlertBox";
import Button from "react-sdk/dist/components/Button";
const user = storedList("user");
import moment from "moment";
import "react-sdk/dist/styles/_fonts.scss"

const TransactionDetails = () => {
  const styles = {
    tdTopContainer: {
      padding: "0rem 1.5rem",
      display: "flex",
      justifyContent: "space-between",
    },
    tdTopLeft: {
      display: "flex",
    },
    tdTopAmount: {
      fontSize: "24px",
      fontWeight: "600",
      letterSpacing: "0px",
      textAlign: "left",
      padding: "0.5rem",
      color: "#141519"
    },
    tdSecBtn: {
      borderRadius: "8px",
    },
  };

  const history = useHistory();
  const dispatch = useDispatch();
  const URLdata = window.location.href;
  const presentment_txn_id = URLdata.split("/").slice(-1)[0];
  const [requestID, setRequestID] = useState();
  const [transData, setTransData] = useState();
  const [transactionStatus, setTransactionStatus] = useState();
  const [transactionAmount, setTransactionAmount] = useState();
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleStatusCss = (transactionStatus) => {
    let content;
    switch (transactionStatus) {
      case "S":
        content = {
          width: "fit-content",
          height: "49px",
          display: "flex",
          padding: "8px 22px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          fontWeight: "600",
          border: "1px solid var(--utility-success-50, #008042)",
          color: "var(--utility-success-50, #008042)",
          background: "var(--utility-success-0, #EEFFF7)",
        };
        break;
      case "I":
        content = {
          width: "fit-content",
          height: "49px",
          display: "flex",
          padding: "8px 22px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          fontWeight: "600",
          border: "1px solid var(--utility-warning-20, #DB8400)",
          color: "var(--utility-warning-20, #DB8400)",
          background: "var(--utility-warning-0, #FFF5E6)",
        };
        break;
      case "F":
        content = {
          width: "fit-content",
          height: "49px",
          display: "flex",
          padding: "8px 22px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          fontWeight: "600",
          border: "1px solid var(--utility-danger-30, #B30000)",
          color: "var(--utility-danger-30, #B30000)",
          background: "var(--utility-danger-0, #FFECEC)",
        };
        break;
      default:
        content = {
          width: "fit-content",
          height: "49px",
          display: "flex",
          padding: "8px 22px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          fontWeight: "600",
          border: "1px solid var(--utility-warning-20, #DB8400)",
          color: "var(--utility-warning-20, #DB8400)",
          background: "var(--utility-warning-0, #FFF5E6)",
        };
        break;
    }
    return content;
  };

  const handleViewRegistration = () => {
    let url = `/admin/registration-details/${requestID}`;
    history.push(url);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const statusMappings = { "S": "Success", "F": "Failed", "I": "In Progress" }

  const swapValue = (data) => {
    if (data === null || data === undefined) {
      data = "NA";
    }
    return data;
  };

  const fetchTransactionDetail = (transactionID) => {
    const payload = {
      transactionID: transactionID,
      user_id: user._id,
    };
    new Promise((resolve, reject) => {
      dispatch(transactionDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        let dataApi = response;
        setTransactionStatus(dataApi?.data?.transaction_details?.txn_status?dataApi.data.transaction_details.txn_status:dataApi.data.transaction_details.status);
        setTransactionStatus(dataApi?.data?.transaction_details?.txn_status?dataApi.data.transaction_details.txn_status:dataApi.data.transaction_details.status);
        setTransactionAmount(dataApi.data.transaction_details.amount);
        setRequestID(dataApi.data.transaction_details.request_id);
        setTransData([
          {
            title: "Transaction Info",
            data: [
              {
                head: "TRANSACTION ID",
                body: swapValue(
                  dataApi.data.transaction_details.presentment_txn_id
                ),
              },
              {
                head: "REGISTRATION ID",
                body: swapValue(dataApi.data.transaction_details.request_id),
              },
              {
                head: "EXTERNAL REFERENCE NUMBER",
                body: swapValue(
                  dataApi.data.external_ref_num
                ),
              },
              {
                head: "UMRN",
                body: swapValue(dataApi.data.transaction_details.mandate_id),
              },
            ],
          },
          {
            title: "Customer Details",
            data: [
              {
                head: "NAME",
                body: swapValue(dataApi.data.customer_name),
              },
              {
                head: "EMAIL",
                body: swapValue(dataApi.data.customer_email_id),
              },
              {
                head: "PHONE",
                body: swapValue(dataApi.data.customer_mobile_no),
              },
            ],
          },
          {
            title: "Transaction Details",
            data: [
              {
                head: "AMOUNT",
                body: new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 0,
                }).format(dataApi.data.transaction_details.amount || 0),
              },
              {
                head: "TRANSACTION REFERENCE NUMBER",
                body: swapValue(
                  dataApi.data.transaction_details.txn_reference
                ),
              },
              {
                head: "TRANSACTION DATE & TIME",
                body: dataApi.data.transaction_details.txn_reference_datetime? 
                      moment(dataApi.data.transaction_details.txn_reference_datetime).format("DD-MM-YYYY") + ", "  + dataApi.data.transaction_details.txn_reference_datetime.slice(11, 16) : "NA",
              },
              {
                head: "UTR NUMBER",
                body: swapValue(
                  dataApi.data.transaction_details.txn_utr_number
                ),
              },
              {
                head: "UTR DATE & TIME",
                body: dataApi.data.transaction_details.txn_utr_datetime?
                      moment(dataApi.data.transaction_details.txn_utr_datetime).format("DD-MM-YYYY") + ", "  + dataApi.data.transaction_details.txn_utr_datetime.slice(11, 16) : "NA",
              },
            ],
          },
        ]);
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(
          error?.response?.data?.message || "Error while fetching details"
        );
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  const handleStatus = (transactionStatus) => {
    if (transactionStatus=='I'||transactionStatus=='F'||transactionStatus=='S')
    {
      return transactionStatus;
    }
    return "I";
  }

  useEffect(() => {
    fetchTransactionDetail(presentment_txn_id);
  }, [presentment_txn_id]);

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <div style={styles.tdTopContainer}>
      {requestID? <div style={styles.tdTopLeft}>
          <div style={handleStatusCss(handleStatus(transactionStatus))}>
            {statusMappings[handleStatus(transactionStatus)]}
          </div>
          <div style={styles.tdTopAmount}>{transactionAmount?Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(transactionAmount):"NA"}</div>
        </div>:null}
        {requestID?<Button
        id="viewRegistration"
        label="View Registration"
        buttonType="secondary"
        onClick={handleViewRegistration}
        customStyle={{
          fontSize:"0.9vw",
          fontStyle:"Montserrat-Regular",
          borderRadius:"8px",
          boxShadow:"none",
          backgroundColor:"white",
          border:"1px solid #475BD8",
          color:"#475BD8"
        }}
        />
          :null}
      </div>

      {transData?.length > 0 ? (
        <Accordian
          accordionData={transData}
          customValueClass={{ color: "var(--neutral-neutral-100, #141519)", fontWeight: "600" }}
          customClass={{ width: "97%", marginLeft: "24px" }}
          custumHeaderStyle={{height:"3.5rem"}}
        />
      ) : null}
    </>
  );
};

export default TransactionDetails;

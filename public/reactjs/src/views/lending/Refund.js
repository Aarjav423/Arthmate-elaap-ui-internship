import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getTdsRefundDataWatcher , getRefundDataDetailsWatcher } from "../../actions/tdsRefund";
import { AlertBox } from "../../components/AlertBox";
import Table from "react-sdk/dist/components/Table/Table"
import moment from "moment";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import "react-sdk/dist/styles/_fonts.scss";
import Button from "react-sdk/dist/components/Button/Button";
import CreateRefund from "./CreateRefund";
import { storedList } from '../../util/localstorage';

export default function Refund() {

  const user = storedList('user');
  const dispatch = useDispatch();
  const { loan_id, company_id, product_id } = useParams();
  const [refundData, setRefundData] = useState([]);
  const [refundDataDetails, setRefundDataDetails] = useState([]);
  const [count, setCount] = useState(0);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    setIsOpen(true);
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleStatusCss = (status) => {
    let content;
    switch (status) {
      case 'Processed':
        content = {
          color: "#008042",
          backgroundColor: "#EEFFF7",
          height: "22px",
          fontSize: "12px",
          border: "1px solid #008042",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          padding: "5px",
          textAlign: "center",
          alignItems: "center",
        }
        break;
      case 'In_Progress':
        content = {
          color: "#DB8400",
          backgroundColor: "#FFF5E6",
          height: "22px",
          fontSize: "12px",
          border: "1px solid #DB8400",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          padding: "5px",
          textAlign: "center",
          alignItems: "center",
        }
        break;
      case 'Failed':
        content = {
          color: "#B30000",
          backgroundColor: "#FFECEC",
          height: "22px",
          fontSize: "12px",
          border: "1px solid #B30000",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          padding: "5px",
          textAlign: "center",
          alignItems: "center",
          maxWidth: "60px"
        }
        break;
      default:
        content = {}
        break;
    }
    return content
  }

  const statusMappings = { "In_Progress": "In Progress", "Processed": "Completed", "Failed": "Failed" };
  const refundTypeMapping = { "tds_refund": "TDS Refund", "interest_refund": "Interest Refund", "excess_refund": "Excess Refund" };

  useEffect(()=>{
    let params = {
      user_id: user._id,
      loan_id: loan_id,
      company_id: company_id,
      product_id: product_id,
    }
    dispatch(
      getRefundDataDetailsWatcher(
        params,
        (result) => {
           setRefundDataDetails(result?.data);
        },
        (error) => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  }
  ,[])
  
  useEffect(() => {
    const allowedStatus = ['In_Progress', 'Processed', 'Failed'];
    const stringifiedStatus = allowedStatus.join(',');
    let params = {
      user_id: user._id,
      loan_id: loan_id,
      company_id: company_id,
      product_id: product_id,
      status: stringifiedStatus,
      page: page + 1,
      limit: rowsPerPage,
      type: null,
      tds_id: null,
      disbursement_date_time: null,
      loan_app_date: null,
      financial_quarter: null,
    }
    dispatch(
      getTdsRefundDataWatcher(
        params,
        (result) => {
          setRefundData(result?.data?.rows);
          setCount(result?.data?.count);
        },
        (error) => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  }, [page, rowsPerPage]);

  const columns = [
    {
      id: "refund_id",
      label: "REFUND ID",
      format: refund => refund?._id
    },
    {
      id: "refund_type",
      label: "REFUND TYPE",
      format: refund => refundTypeMapping[refund?.type]
    },
    {
      id: "amount",
      label: "AMOUNT",
      format: refund => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(refund?.amount)
    },
    {
      id: "refund_triggered_by",
      label: "REFUND TRIGGREED BY",
      format: refund => refund?.requested_by ?? refund?.requested_id ?? 'N/A'
    },
    {
      id: "request_date",
      label: "REQUEST DATE",
      format: refund => moment(refund?.created_at).format("DD-MM-YYYY")
    },
    {
      id: "utr_number",
      label: "UTR NUMBER",
      format: refund => refund?.utrn_number
    },
    {
      id: "utr_date",
      label: "UTR DATE",
      format: refund => moment(refund?.utr_date).format("DD-MM-YYYY")
    },
    {
      id: "status",
      label: "STATUS",
      format: refund => 
        (<div style={{ display: "flex" }}>
          <div style={handleStatusCss(refund?.status)}>
              {statusMappings[refund?.status]}
          </div>
        </div>)
    },
  ]

  return (
    <>
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      padding: "24px",
      marginTop: "10px"
    }}>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
          />
          ) : null}
        
        <div style={{ display: "flex", justifyContent: "space-between"}}>
          <div style={{
              fontFamily: "Montserrat-SemiBold",
              width: "268px",
              height: "30px",
              fontSize: "20px",
              fontWeight: "600",
              lineHeight: "150%",
              marginLeft: "10px",
              marginTop: "10px",
              color: "#141519"
            }}
            >
              Refund History
          </div>
          <Button
            label={"Create Refund"}
            buttonType="primary"
            customStyle={{
              fontFamily: "Montserrat-Regular",
              width: "170px",
              height: "48px",
              padding: "0px",
              gap: "8px",
              borderRadius: "8px",
              fontSize: "16px",
            }}
            onClick={handleClick}
          />
        </div>
        <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #EDEDED",
                borderRadius: "15px"
              }}
            >
              <div style={{marginTop: "-20px"}}>
                <Table
                  data={refundData}
                  columns={columns}
                  customStyle={{
                    fontFamily:"Montserrat-Medium",
                    borderBottomLeftRadius: "0",
                    borderBottomRightRadius: "0"
                  }}
                />
              </div>
              <Pagination
                totalItems={count}
                itemsPerPage={rowsPerPage}
                onPageChange={setPage}
                showOptions ={true}
                rowsPerPageOptions={[5,10,15,20]}
                setRowLimit={setRowsPerPage}
              />
            </div>
        </div>
    </div>
     {isOpen ? <CreateRefund handleClose={handleClose} data={refundDataDetails} /> : null}
     </>
  );
}

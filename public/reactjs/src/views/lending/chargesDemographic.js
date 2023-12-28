import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {getChargesWatcher} from "../../actions/charges";
import {AlertBox} from "../../components/AlertBox";
import Table from "react-sdk/dist/components/Table/Table"
import moment from "moment";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import "react-sdk/dist/styles/_fonts.scss";

export default function ChargesDemographic() {
  const columns = [
    {
      id: "fees_charges",
      label: "FEES/CHARGES",
      format: charge => charge.charge_type
    },
    {
      id: "due_amount",
      label: "DUE AMOUNT",
      format: charge => charge?.charge_amount||charge?.charge_amount==0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(charge.charge_amount) : "NA"
    },
    {
      id: "gst",
      label: "GST",
      format: charge => charge?.gst||charge?.gst==0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(charge.gst) : "NA"
    },
    {
      id: "due_date",
      label: "DUE DATE",
      format: charge => moment(charge.charge_application_date).format("DD-MM-YYYY") ?? "NA"
    },
    {
      id: "paid_amount",
      label: "PAID AMOUNT",
      format: charge => charge?.total_amount_paid==0||charge?.total_amount_paid?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(charge.total_amount_paid) : "NA"
    },
    {
      id: "gst_paid",
      label: "GST PAID",
      format: charge => charge?.total_gst_paid==0||charge?.total_gst_paid?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(charge.total_gst_paid) : "NA"
    },
    {
      id: "paid_date",
      label: "PAID DATE",
      format: charge => charge.payment.length ? moment(charge.payment[0].utr_date).format("DD-MM-YYYY") : "NA"
    },
    {
      id: "waived_amount",
      label: "WAIVED AMOUNT",
      format: charge => charge?.total_amount_waived==0||charge?.total_amount_waived?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(charge.total_amount_waived) : "NA"
    },
    {
      id: "gst_reversed",
      label: "GST REVERSED",
      format: charge => charge?.total_gst_reversed==0||charge?.total_gst_reversed?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(charge.total_gst_reversed) : "NA"
    },
    {
      id: "waived_date",
      label: "WAIVED DATE",
      format: charge => charge.waiver.length ? moment(charge.waiver[0].waiver_date).format("DD-MM-YYYY") : "NA"
    }
  ]

  const dispatch = useDispatch();
  const { loan_id, company_id, product_id } = useParams();
  const [charges, setCharges] = useState([]);
  const [details, setDetails] = useState({});
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [tableContent, setTableContent] = useState([])

  useEffect(() => {
    dispatch(
      getChargesWatcher(
        {
          company_id: company_id,
          product_id: product_id,
          loan_id: loan_id
        },
        (result) => {
          setCharges(result.data);
          setDetails(result.other_dettails);
          setTableContent(result.data.slice(page * rowsPerPage, (page + 1) * rowsPerPage))
        },
        (error) => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  }, [page,rowsPerPage]);

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

  const styleCustomerDetailsRow = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: "40px"
  };
  
  const styleCustomerDetailsComponent = {
    display: "flex",
    flexDirection: "column",
    flex: "1 0 0",
    alignItems: "flex-start",
    alignSelf: "stretch"
  }

  const styleCustomerDetailsFieldKey = {
    fontFamily: "Montserrat-Regular",
    fontSize: "12px",
    fontWeight: "400",
    lineHeight: "150%",
    textTransform: "uppercase",
    color: "#6B6F80"
  };

  const styleCustomerDetailsFieldValue = {
    fontFamily: "Montserrat-Medium",
    alignSelf: "stretch",
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "150%",
    color: "#141519"
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      padding: "24px",
      marginTop: "16px"
    }}>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      {charges.length ? (
        <div
          id="fees-loan-details"
          style={{
            backgroundColor:"whitesmoke",
            display:"flex",
            borderRadius:"8px",
            gap:"16px",
            padding:"16px",
            flexDirection:"column",
            width:"582px"
          }}
        >
          <div style={{
            display:"flex",
            color:"#141519",
            fontFamily: "Montserrat-Semibold",
            fontSize: "20px",
            fontWeight: 600,
            lineHeight: "150%"
          }}>
            Loan Details
          </div>
          <div style={styleCustomerDetailsRow}>
            <div style={styleCustomerDetailsComponent}>
              <div style={styleCustomerDetailsFieldKey}>
                loan id
              </div>
              <div style={styleCustomerDetailsFieldValue}>
                {details.loan_id}
              </div>
            </div>
            <div style={styleCustomerDetailsComponent}>
              <div style={styleCustomerDetailsFieldKey}>
                customer name
              </div>
              <div style={styleCustomerDetailsFieldValue}>
                {details.name}
              </div>
            </div>
          </div>
        </div>
      ):null}

      {charges.length ? (
        <div 
          id="fees-charges-details"
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #EDEDED",
            borderRadius: "15px"
          }}
        >
          <div style={{marginTop: "-20px"}}>
            <Table
              data={tableContent}
              columns={columns}
              customStyle={{
                fontFamily:"Montserrat-Medium",
                borderBottomLeftRadius: "0",
                borderBottomRightRadius: "0"
              }}
            />
          </div>
          <Pagination
            totalItems={charges.length}
            itemsPerPage={rowsPerPage}
            onPageChange={setPage}
            showOptions ={true}
            rowsPerPageOptions={[5,10,15,20]}
            setRowLimit={setRowsPerPage}
          />
        </div>
      ):null}
    </div>);
}

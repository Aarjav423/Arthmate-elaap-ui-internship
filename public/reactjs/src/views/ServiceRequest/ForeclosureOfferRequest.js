import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storedList } from "../../util/localstorage";
import Paper from "@mui/material/Paper";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import { Link } from "react-router-dom";
// import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import moment from "moment";
import Box from "@mui/material/Box";
import { styled } from "@material-ui/core/styles";
import { AlertBox } from "../../components/AlertBox";
import { useParams } from "react-router-dom";
import { Button } from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";
import { getForeclosureOfferRequestByLoanIdWatcher } from "../../actions/foreclosureOffer";
import { useHistory } from "react-router-dom";
import Preloader from "../../components/custom/preLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { b64ToBlob } from "../../util/helper";
import { viewDocsWatcher } from "../../actions/loanDocuments";
import ReactBSAlert from "react-bootstrap-sweetalert";
import CloseIcon from "@mui/icons-material/Close";
import Buttoned from "react-sdk/dist/components/Button/Button";
import Table from "react-sdk/dist/components/Table/Table";
import Pagination from "react-sdk/dist/components/Pagination/Pagination"
import "react-sdk/dist/styles/_fonts.scss"


const ForeclosureOfferRequest = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [roleList, setRoleList] = useState([]);
  const { company_id, product_id, loan_id } = useParams();
  const [loanData, setLoanData] = useState({});
  const [loanDataApi, setLoanDataApi] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const isLoading = useSelector((state) => state.profile.loading);
  const history = useHistory();
  const dispatch = useDispatch();
  const user = storedList("user");
  const [popupContent, setPopupContent] = useState("");

  const handleDocumentPopUp = (pdf, fileType) => {
    if (pdf.indexOf("data:application/pdf;base64,") >= 0) {
      pdf = pdf.replace("data:application/pdf;base64,", "");
    }

    const contentType = "application/pdf";
    const blob = b64ToBlob(pdf, contentType);
    const blobUrl = URL.createObjectURL(blob);

    setPopupContent(
      <ReactBSAlert
        style={{
          display: "block",
          marginTop: "-350px",
          width: "900px",
          padding: "15px 4px 3px 3px",
          position: "relative"
        }}
        title={fileType}
        confirmBtnBsStyle="success"
        btnSize="md"
        showConfirm={false}
      >
        <div>
          <button
            type="button"
            className="close"
            style={{
              position: "absolute",
              top: "21px",
              right: "20px",
              zIndex: "999"
            }}
            onClick={() => setPopupContent(false)}
          >
            <CloseIcon />
          </button>
          <iframe
            src={blobUrl}
            type="application/pdf"
            width="100%"
            height="450px"
          />
        </div>
      </ReactBSAlert>
    );
  };

  const handleViewDoc = (awsurl, doctype) => {
    const user = storedList("user");
    let data = {
      company_id: company_id,
      product_id: product_id,
      loan_app_id: loanData.loan_app_id,
      awsurl,
      user_id: user._id
    };
    dispatch(
      viewDocsWatcher(
        data,
        (response) => {
          handleDocumentPopUp(response, doctype);
        },
        (error) => { }
      )
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(event);
    // setLoanDataApi(roleList.slice(event * 10, event * 10 + 10));
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };
  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };
  useEffect(() => {
    fetchLoanOfferDetails();
  }, [page]);

  const fetchLoanOfferDetails = () => {
    const filterData = {};
    const params = {
      company_id: company_id,
      product_id: product_id,
      loan_id: loan_id,
      user_id: user._id,
      page: page,
      limit: limit
    };
    filterData.page = page;
    dispatch(
      getForeclosureOfferRequestByLoanIdWatcher(
        params,
        (result) => {
          setRoleList(result.data.rows);
          setLoanData(result.data);
          setCount(result?.data?.count);
          setLoanDataApi(result.data.rows.slice(0, 10));
        },
        (error) => {
          return showAlert(error?.result?.data?.message, "error");
        }
      )
    );
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#5e72e4",
      color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      color: theme.palette.common.black
    }
  }));

  const handleNavServiceRequestDetails = (row) => {
    window.open(
      `/admin/foreclosure-request-details/${row.company_id}/${row.product_id}/${row.loan_id}/${row._id}`,
      "_blank"
    );
  };
  const [selectedRow, setSelectedRow] = useState({});
  const handleClick = (event, row) => {
    setSelectedRow(row);
    setShowActionList(true);
    setAnchorEl(event.currentTarget);
  };

  const handleForeclosureDetails = (row) => {
    window.open(
      `/admin/foreclosure-request/${company_id}/${product_id}/${loan_id}`,
      "_self"
    );
  };
  

  const columns = [
    {
      id: "REQUEST ID",
      label : <span style={{marginLeft:"-24px"}}>{"REQUEST ID"}</span>,
      // label: "REQUEST ID",
      // (<span style={{marginLeft:"-20px"}}>{exi.loan_id}</span>)
      format: (row) => <span style={{marginLeft:"-24px"}}><Link onClick={() => handleNavServiceRequestDetails(row)}>{row._id}</Link> </span>},
    { id: "requestor_id", label: "REQUESTED BY"  },
    { id: "request_date", label: "REQUEST DATE"},
    
    { id: "VALID TILL", label: "VALID TILL" ,  format: (row) => moment(row?.offers[row.offers.length - 1].foreclosure_date).format("YYYY-MM-DD")},
    { id: "status", label: "STATUS" },
    {
      id: "FORECLOSURE OFFER",
      label: "FORECLOSURE OFFER",
      format: (row) => row.status === "completed" || row.status === "approved" ? <div>{popupContent}<Link onClick={() => handleViewDoc(loanData.foreclosure_letter_url, "Foreclosure Letter")}>View</Link> </div> : "NA"
    }
  ];

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <Buttoned
        customStyle={{
          marginTop: "138px",
          display: "inline-flex",
          marginRight: "17px",
          padding: "13px 26px",
          float: "right",
          top: "40px",
          height: "48px",
          radius: "8px",
          borderRadius: "8px",
          fontSize: "16px",
          lineHeight: "150%",
          justifyCcontent: "center",
          alignItems: "center",
          gap: "10px",
          fontFamily: "Montserrat-Regular",
          backgroundColor: "#475BD8",
          fontWeight: "600",
          fontStyle: "normal",
          lineHeight: "150%",
          backgroundColor:"#475BD8"
        }}
        label="Create Foreclosure Request" buttonType="primary" onClick={() => { handleForeclosureDetails(selectedRow) }} 
        />

      <div style={{ width: "97%", marginTop: "30px", backgroundColor: "#F9F8FA", border: " 1px solid #EDEDED", borderRadius: "8px", marginLeft: "25px", padding: "16px", fontFamily: "Montserrat-SemiBold" }}>
        <h4 style={{ fontSize: "20px", lineHeight: "150%", fontFamily: "Montserrat-SemiBold", color: "#141519" }}>Loan Details</h4>
        <div style={{ display: "grid", gridTemplateColumns: "17% 30% 19% 19% 19%", marginTop: "16px" }}>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }}>
            CUSTOMER NAME
            <div style={{ color: "black", fontFamily: "Montserrat-Regular", fontWeight:"800", fontSize: "16px" }}>
              {loanData?.customer === "" || !loanData?.customer ? "NA" : loanData?.customer}
            </div>
          </div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }} >
            LOAN ID
            <div style={{ color: "black", fontFamily: "Montserrat-Regular", fontWeight:"800", fontSize: "16px" }}>
              {loan_id === "" || !loan_id ? "NA" : loan_id}
            </div>
          </div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }} >
            POS
            <div style={{ color: "black", fontFamily: "Montserrat-Regular", fontWeight:"800", fontSize: "16px" }}>
              {loanData?.prin_os === "" || !loanData?.prin_os ? "NA" : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(loanData?.prin_os)}
            </div>
          </div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }} >
            PARTNER NAME
            <div style={{ color: "black", fontFamily: "Montserrat-Regular", fontWeight:"800", fontSize: "16px" }}>
              {loanData.company === "" || !loanData.company ? "NA" : loanData.company}
            </div>
          </div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }} >
            PRODUCT NAME
            <div style={{ color: "black", fontFamily: "Montserrat-Regular", fontWeight:"800", fontSize: "16px" }}>
              {loanData?.product === "" || !loanData?.product ? "NA" : loanData?.product}
            </div>
          </div>
          </div> 
      </div> 

      {loanDataApi.length ? (
        <div>
          <h2 style={{ fontFamily: "Montserrat-SemiBold", marginLeft: "25px", fontSize: "20pz", lineHeight: "150%", marginTop: "40px", marginBottom: "-20px" }}>Previous Foreclosure Requests</h2>
          <div style={{ maxWidth: "100%", padding: "18px", marginLeft:"6.2px", marginTop:"10px" }}>
            <Table
              customStyle={{ width: "100%" }}
              data={loanDataApi}
              columns={columns}
            // actions={{ handleActionClick }}
            // handleActionClick={handleActionClick}
            />
            {count ? <Pagination
              onPageChange={handleChangePage}
              totalItems={count}
              itemsPerPage={10}
            /> : null}
            {/* <Pagination
                onPageChange={handleChangePage}
                totalItems={count}
                itemsPerPage={10}
              /> */}
          </div>
        </div>) : ""}
      {isLoading && <Preloader />}
    </>
  );
};

export default ForeclosureOfferRequest;

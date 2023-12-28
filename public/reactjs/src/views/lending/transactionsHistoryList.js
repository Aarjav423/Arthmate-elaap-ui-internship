import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { styled } from "@material-ui/core/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { transactionHistoryListWatcher } from "../../actions/transactionHistory";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import { AlertBox } from "../../components/AlertBox";
import CustomTable from "react-sdk/dist/components/Table/Table";
import CustomFormPopup from "react-sdk/dist/components/Popup/FormPopup";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5e72e4",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.black,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const style = {
  position: "fixed",
  align: "right",
  zIndex: "9999",
  top: "5%",
  left: "15%",
  marginRight: "20px",
  transform: "translate(1, 2)",
  width: "85%",
  minHeight: "20%",
  bgcolor: "background.paper",
  border: "1px solid #ccc",
  boxShadow: 5,
  p: 2,
  backgroundColor: "#ffffff",
};

export default function TransactionHistoryDemographics(props) {
  const {
    open,
    data,
    loanSchemaId,
    onModalClose,
    title,
    openDialog,
    setOpenDialog,
    ...other
  } = props;
  const [loanId, setLoanId] = useState(data.loan_id);
  const [companyId, setCompanyId] = useState(data.company_id);
  const [productId, setProductId] = useState(data.product_id);
  const [transactionHistoryList, setTransactionHistoryList] = useState({});
  const [responseData, setResponseData] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState("");
  const [noData, setNoData] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //alert
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
const [rowPerPage ,  setRowPerPage] = useState(10);
  const dispatch = useDispatch();

  
  const handleChangePage = (event, newPage) => {
    setPage(event);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setAlertMessage("");
    setSeverity("");
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  useEffect(() => {
    fetchTransactionHistoryList(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const fetchTransactionHistoryList = (page, rowsPerPage) => {
    const payload = {
      loan_id: loanId,
      company_id: companyId,
      product_id: productId,
      page: page,
      limit: rowsPerPage,
    };
    new Promise((resolve, reject) => {
      dispatch(transactionHistoryListWatcher(payload, resolve, reject));
    })
      .then((response) => {
        if (response.data?.count > 0) {
          setResponseData(response.data.rows);
          setTransactionHistoryList(response.data.rows);
          setCount(response.data.count);
          setNoData(false);
          setOpenDialog(true);
        } else {
          setOpenDialog(false);
          onModalClose("No data found for the loan Id", "error");
        }
      })
      .catch(() => {
        setOpenDialog(false);
        onModalClose("No data found for the given loan Id", "error"); //TODO: check msg with poonam
      });
  };

  const handleClose = () => {
    setOpenDialog(false);
    onModalClose("", "");
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(3),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const BootstrapDialogTitle = (props) => {
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
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  const [transaction_Data, setTransactionData] = useState([]);
  useEffect(()=> {
    updateVar();
  }, [transactionHistoryList])
  function formatAmount(str) {
    const [rupees, paise = ''] = str.split('.');
    const formattedRupees = rupees.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedAmount = paise ? `${formattedRupees}.${paise}` : formattedRupees;
    return `₹${formattedAmount}`;
    }

  const updateVar = () => {
    var a = Array.from(transactionHistoryList).map((item, index) => ({
      "Loan id": item.loan_id,
      "Transaction id": item.label == "repayment" ||
                          item.label == "Advance EMI" || 
                          item.label == "foreclosure"
                            ? item.txn_reference
                              ? item.txn_reference
                              : ""
                            : item.txn_id
                            ? item.txn_id
                            : "",
      "UTR Number":item.utr_number ? item.utr_number : "",
      "Transaction date":item.txn_entry == "dr"
                          ? item.disbursement_date_time
                            ? item.disbursement_date_time
                            : ""
                          : item.txn_entry == "cr"
                          ? moment(item?.utr_date_time_stamp).format(
                              "YYYY-MM-DD"
                            )
                          : "",
      "Transaction mode":   item.label
                          ? item.label == "repayment" ||
                            item.label == "Advance EMI" ||
                            item.label == "foreclosure"
                            ? item.payment_mode
                            : item.record_method
                          : "",
      "Transaction type":item.label,
      "Transaction amount" :new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item?.txn_amount || 0),
      "Status" :   item.label == "repayment" ||
      item.label == "Advance EMI" ||
      item.label == "foreclosure"
        ? item?.is_received === "Y"
          ? "Approved"
          : item?.is_received === "N"
          ? "Approval pending"
          : item?.is_received === "hold"
          ? "Hold"
          : "Approval pending"
        : item.disbursement_status
        ? item.disbursement_status
        : ""              
      }));  

      setTransactionData(a);
  }

  return (
    <>
      {openDialog ? (
        <div>
          {transactionHistoryList.length ? (
           <CustomFormPopup
                  customStyles={{width:"89%",height:"fit-Content"}}
                  heading={title}
                  isOpen={openDialog}
                  onClose={handleClose}
                >
                  <div style={{display:"grid", width:"100%", height:"fit-content"}}>
                  <CustomTable customStyle={{width:"100%"}}
                  columns={[
                  {id: "Loan id",label: "LOAN ID"},
                  {id: "Transaction id",label: "TRANSACTION ID"},
                  {id: "UTR Number",label: "UTR NUMBER"},
                  {id: "Transaction date",label: "TRANSACTION DATE"},
                  {id: "Transaction mode",label: "TRANSACTION MODE"},
                  {id: "Transaction type",label: "TRANSACTION TYPE"},
                  {id: "Transaction amount",label: "TRANSACTION AMOUNT"},
                  {id: "Status",label: "STATUS"},

                ]} data={transaction_Data}
                  />
                  <Pagination
                      itemsPerPage={rowsPerPage}
                      totalItems={count}
                      rowsPerPageOptions={[10]}
                      onPageChange={handleChangePage}
                      showOptions={false}
                      setRowLimit={setRowsPerPage}
                              />
                  </div>
                  </CustomFormPopup>

          ) : null}
          {noData ? (
            <AlertBox
              severity={"error"}
              msg={"No data found for this loan id!"}
              onClose={handleAlertClose}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
}

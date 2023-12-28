import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { styled } from "@material-ui/core/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import DownloadLoanFiles from "../lending/DownloadColendLoanFiles";
// import { Button } from "@mui/material";
import { connect } from "react-redux";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import CustomDatePicker from "../../components/DatePicker/datePickerCustom";
import {
  colendersListWatcher,
  getColenderRepaymentScheduleWatcher,
  getColenderTransactionHistoryWatcher
} from "../../actions/colenders.js";
import RepaymentIcon from "../lending/images/repayment_schedule_img.svg";
import TransactionIcon from "../lending/images/transaction_history_img.svg";
import FrontPageImage from "../lending/images/newleadloanscreen.svg";
import { storedList } from "../../util/localstorage";
import { checkAccessTags } from "../../util/uam";
import { verifyDateAfter1800 } from "../../util/helper";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Table from "react-sdk/dist/components/Table/Table";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import Button from "react-sdk/dist/components/Button/Button";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import { AlertBox } from "../../components/AlertBox";
const {
  getColendersProduct,
  getColenderLoans
} = require("../../apis/colenders");

const statusToDisplay = {
  open: "Open",
  active: "Active",
  closed: "Inactive"
};
let filterObj = {
  company: null,
  product: null,
  fromDate: null,
  toDate: null,
  status: null,
  searchText: null
};

const buttonCss = {
  width: "145px",
  height: "58px",
  borderRadius: "8px",
  fontSize: "16px"
}

const ColendingLoans = props => {
  const {
    reportName,
    isCustomDatePicker,
    text,
    onSearchClick,
    mandatoryFields,
    isViewSearch = false,
    isViewStatus = false,
    reportButton = false,
    sendData = () => { },
    isDisabledFromDateDropdown = false,
    statusList,
    loanStatusList,
    isViewMinAmount = false,
    isViewMaxAmount = false,
    isRepaymentReport,
    isCKYCReport,
    isServiceUsage,
    isViewMonthDropdown,
    isViewYearDropdown,
    isViewDayDropdown,
    isScreenFlag,
    isViewFromDate,
    isViewToDate,
    ...other
  } = props;
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState([]);
  const [productsArray, setProductArray] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [page, setPage] = React.useState(0);
  const [pageTxnHistory, setPageTxnHistory] = React.useState(0);
  const [count, setCount] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rowstxnHistoryPerPage, setRowsTxnHistoryPerPage] = React.useState(10);
  const [customDate, setCustomDate] = useState(true);
  const [colendersList, setColendersList] = useState("");
  const [colenderNames, setColenderNames] = useState([]);
  const [co_lender, setColender] = React.useState("");
  const [loanMinAmount, setLoanMinAmount] = useState("");
  const [loanMaxAmount, setLoanMAxAmount] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [colenderID, setColenderID] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [colenderLoans, setColenderLoans] = useState("");
  const [colendLoans, setColendLoans] = useState([]);
  const [productId, setProductId] = useState("");
  const [status, setStatus] = useState("");
  const [enableSearch, setEnableSearch] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [isOpenHistory, setisOpenHistory] = useState(false);
  const [loan_id, setLoan_id] = useState("");
  const [filterArr, setFilterArr] = useState([]);
  const [filterData, setFilterdData] = useState(filterObj);
  const [filterTransactionHistoryArr, setFilterTransactionHistoryArr] =
    useState([]);
  const [pageRS, setPageRS] = React.useState(0);
  const [rowsPerPageRS, setRowsPerPageRS] = React.useState(10);
  const user = storedList("user");
  const [showButtonLeft, setShowButtonLeft] = useState(true);
  const [showButtonRight, setShowButtonRight] = useState(false);
  const [selectedColender, setSelectedColender] = useState(false);

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const handleChange = async (event, label, value, reason) => {
    if (label == "product") {
      if (reason == "clear") {
        setCompanyName(null);
        setProductId(null);
      } else {
        setSelectedProduct(value);
        const indexOfProduct = productsArray
          .map(e => e.product_name)
          .indexOf(value);
        setCompanyName(productsArray[indexOfProduct].product_name);
        setProductId(productsArray[indexOfProduct].product_id);
      }
    } else {
      if (reason == "clear") {
        setColenderID(null);
        setEnableSearch(false);
        setProductArray([]);
        setProduct([]);
        setCompanyName(null);
        setProductId(null);
        setFromDate(null);
        setToDate(null);
      }
      if (value != null) {
        if (value == "Select All") {
          setColender("Select All");
          setColenderID("");
          setEnableSearch(true);
          setProduct([]);
          setProductArray([]);
          setCompanyName("");
          setFromDate(null);
          setToDate(null);
        } else {
          setColender(value);
          const indexOfColender = colendersList
            ? colendersList?.map(e => e.co_lender_name).indexOf(value)
            : null;
          const co_lender = colendersList[indexOfColender];
          const co_lender_id = co_lender?.co_lender_id;
          setColenderID(co_lender_id);
          setCompanyName(null);
          setSelectedProduct("");

          // method to get product list againt co_lender id
          const response = await getColendersProduct(
            co_lender_id || user?.co_lender_id
          );
          if (!response) {
            setProductArray([]);
            setProduct([]);
            setCompanyName(null);
            return;
          } else {
            setProductArray(response.data);
            const products = response.data;
            let product_name = [];
            let product_length = products?.length;
            for (var i = 0; i < product_length; i++) {
              product_name.push(products[i].product_name);
            }
            setProduct(product_name);
          }
        }
      }
    }
  };

  const handleSearchClick = async value => {
    if (!selectedColender) return showAlert("Please select Co-lender", "error");
    if (colendLoans) {
      setColendLoans([]);
      setColenderLoans([]);
      setCount([]);
    }
    const response = await getColenderLoans(
      colenderID,
      companyId,
      productId,
      status,
      loanMinAmount,
      loanMaxAmount,
      fromDate,
      toDate,
      page,
      rowsPerPage
    );
    const data = response.data;
    setColendLoans((data?.colenderLoan)?.sort(
      (a, b) =>
        function (a, b) {
          return (
            new Date(b.created_at).getMilliseconds() -
            new Date(a.created_at).getMilliseconds()
          );
        }
    ));
    setColenderLoans(data?.colenderLoan);
    setCount(data?.count || 10);
    if (data?.colenderLoan.length === 0) {
      showAlert("No data Available", "error")
    }
  };
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (user?.type === "co-lender") {
      handleChange(null, "co-lender", user.co_lender_name, "selectOption");
      setColender(user?.username);
      setColenderID(user?.co_lender_id)
    }
    if (isTagged && checkAccessTags(["tag_colending_loans_read"]))
      fetchColendersList();
    if (!isTagged) fetchColendersList();
  }, [colenderLoans]);

  const compare = (a, b) => {
    if (a.co_lender_name < b.co_lender_name) {
      return -1;
    }
    if (a.co_lender_name > b.co_lender_name) {
      return 1;
    }
    return 0;
  };

  function labelItem(item) {
    return { "label": item, "value": item };
  }

  //function to fetch co_lender list
  const fetchColendersList = () => {
    const payload = {};
    let names = [];
    new Promise((resolve, reject) => {
      dispatch(colendersListWatcher(payload, resolve, reject));
    })
      .then(res => {
        for (var i = 0; i < res?.length; i++) {
          names.push(res[i].co_lender_name);
        }
        const sortedArray = names?.sort();
        sortedArray.splice(0, 0, "Select All");
        const colenderNamesObject = sortedArray.map(labelItem);
        setColenderNames(colenderNamesObject);
        setColendersList(res?.sort(compare));
      })
      .catch(error => {
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  useEffect(async () => {
    if (colendLoans.length) {
      const response = await getColenderLoans(
        colenderID,
        companyId,
        productId,
        status,
        loanMinAmount,
        loanMaxAmount,
        fromDate,
        toDate,
        page,
        rowsPerPage
      );
      const data = response.data;
      setColendLoans((data.colenderLoan)?.sort(
        (a, b) =>
          function (a, b) {
            return (
              new Date(b.created_at).getMilliseconds() -
              new Date(a.created_at).getMilliseconds()
            );
          }
      ));
      setColenderLoans(data.colenderLoan);
      setCount(data.count);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (user?.type === "co-lender") {
      setSelectedColender(user?.co_lender_name || "")
    }
  }, [])


  const handleChangePage = async (event, newPage) => {
    setPage(event);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePageTxnHistory = (event, newPageTxnHistory) => {
    setPageTxnHistory(event);
  };

  const handleChangeRowsTxnHistoryPerPage = event => {
    setRowsTxnHistoryPerPage(+event.target.value);
    setPageTxnHistory(0);
  };

  const handleChangePageRS = (event, newPage) => {
    setPageRS(event);
  };

  const handleChangeRowsPerPageRS = event => {
    setRowsPerPageRS(+event.target.value);
    setPageRS(0);
  };

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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#5e72e4",
      color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
      color: theme.palette.common.black
    }
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover
    },
    "&:last-child td, &:last-child th": {
      border: 0
    }
  }));

  const formatDate = date => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month?.length < 2) month = "0" + month;
    if (day?.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const sampleData = colendLoans
    ?.sort(
      (a, b) =>
        function (a, b) {
          return (
            new Date(b.created_at).getMilliseconds() -
            new Date(a.created_at).getMilliseconds()
          );
        }
    )
    .map((item, index) => ({
      "COLEND ID": item.co_lender_id,
      "LOAN ID": item.co_lend_loan_id,
      "CO-LENDER LOAN ID": item.co_lender_account_no,
      "LENDER NAME": item.co_lender_name,

      "LOAN AMOUNT": new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.co_lend_loan_amount),
      "DISBURSEMENT DATE": item.disbursement_date ? formatDate(item.disbursement_date) : "",
      "STATUS": statusToDisplay[item.status]
    }));

  const transaction_Data = filterTransactionHistoryArr
    ?.sort(
      (a, b) =>
        function (a, b) {
          return b._id - a._id;
        }
    )
    .slice(
      pageTxnHistory * rowstxnHistoryPerPage,
      pageTxnHistory * rowstxnHistoryPerPage +
      rowstxnHistoryPerPage
    )
    .map((data, index) => ({
      "LOAN ID": data.co_lend_loan_id,
      "TRANSACTION ID": data.txn_id,
      "TRANSACTION DATE": data.txn_date,
      "TRANSACTION MODE": data.txn_mode,
      "TRANSACTION TYPE": data.label,
      "TRANSACTION AMOUNT": data.txn_amount && data.txn_amount.$numberDecimal
        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.txn_amount.$numberDecimal)
        : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.txn_amount) || 0
    }));

  const rs_data = filterArr
    .slice(
      pageRS * rowsPerPageRS,
      pageRS * rowsPerPageRS + rowsPerPageRS
    )
    .map((data, index) => ({
      "LOAN ID": data.co_lend_loan_id,
      "INSTALLMENT NUMBER": data.emi_no,
      "AMOUNT DUE": new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.emi_amount),
      "PRINCIPAL": new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.prin),
      "INTEREST": new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.int_amount),
      "DUE DATE": data.due_date ? moment(data.due_date).format("YYYY-MM-DD") : " "
    }));

  const handleOpenRepaymentSchedule = (data, co_lender_id) => {
    setisOpen(!isOpen);
    setLoan_id(data);
    fetchColenderRepaymentSchedule(data, co_lender_id);
  };

  const handleOpenRepaymentHistory = (data, co_lender_id) => {
    setisOpenHistory(!isOpenHistory);
    setLoan_id(data);
    fetchColenderTransactionHistory(data, co_lender_id);
  };

  const renderAdvanceSearch = () => (
    <div>
      <React.Fragment>

        <FormPopup
          customStyles={{ width: "90%", height: "fit-Content" }}
          heading="Repayment Schedule"
          isOpen={isOpen}
          onClose={() => setisOpen(!isOpen)}
        >
          <div style={{ display: "grid", width: "100%", height: "fit-Content" }}>
            <Table customStyle={{ width: "100%" }}
              columns={[
                { id: "LOAN ID", label: "LOAN ID" },
                { id: "", label: "" },
                { id: "INSTALLMENT NUMBER", label: "INSTALLMENT NUMBER" },
                { id: "AMOUNT DUE", label: "AMOUNT DUE" },
                { id: "PRINCIPAL", label: "PRINCIPAL" },
                { id: "INTEREST", label: "INTEREST" },
                { id: "DUE DATE", label: "DUE DATE" }
              ]} data={rs_data}
            />
            <Pagination
              itemsPerPage={rowsPerPageRS}
              totalItems={filterArr?.length}
              rowsPerPageOptions={[10, 20, 30]}
              onPageChange={handleChangePageRS}
              setRowLimit={setRowsPerPageRS}
              showOptions={true} />
          </div>
        </FormPopup>
      </React.Fragment>
    </div>
  );

  const renderAdvanceSearchHistory = () => (
    <div>
      <React.Fragment>
        <FormPopup
          customStyles={{ width: "93%", height: "fit-Content" }}
          heading="Transaction History"
          isOpen={isOpenHistory}
          onClose={() => setisOpenHistory(!isOpenHistory)}
        >
          <div
            style={{ display: "grid", width: "100%" }}>
            <Table customStyle={{ display: "grid", gridTemplateColumns: "19% 19% 16% 16% 14% 14%", height: "fit-Content", width: "100%" }}
              columns={[
                { id: "LOAN ID", label: "LOAN ID" },
                { id: "TRANSACTION ID", label: "TRANSACTION ID" },
                { id: "TRANSACTION DATE", label: "TRANSACTION DATE" },
                { id: "TRANSACTION MODE", label: "TRANSACTION MODE" },
                { id: "TRANSACTION TYPE", label: "TRANSACTION TYPE" },
                { id: "TRANSACTION AMOUNT", label: "TRANSACTION AMOUNT" }
              ]} data={transaction_Data}
            />
            <Pagination
              itemsPerPage={rowstxnHistoryPerPage}
              totalItems={filterTransactionHistoryArr?.length}
              rowsPerPageOptions={[10, 20, 30]}
              onPageChange={handleChangePageTxnHistory}
              showOptions={true}
              setRowLimit={setRowsTxnHistoryPerPage}
            />
          </div>
        </FormPopup>
      </React.Fragment>
    </div>
  );

  const fetchColenderRepaymentSchedule = (selected_load_id, co_lender_id) => {
    const payload = {
      co_lend_loan_id: selected_load_id,
      co_lender_id
    };
    new Promise((resolve, reject) => {
      dispatch(getColenderRepaymentScheduleWatcher(payload, resolve, reject));
    })
      .then(response => {
        setFilterArr(response.data);
      })
      .catch(error => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error?.response?.data?.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };
  const fetchColenderTransactionHistory = (selected_load_id, co_lender_id) => {
    const payload = {
      co_lend_loan_id: selected_load_id,
      co_lender_id
    };
    new Promise((resolve, reject) => {
      dispatch(getColenderTransactionHistoryWatcher(payload, resolve, reject));
    })
      .then(response => {
        setFilterTransactionHistoryArr(response?.data || []);
      })
      .catch(error => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error?.response?.data?.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  const inputBoxCss = {
    marginTop: "8px",
    width: "13vw",
    maxHeight: "500px",
    zIndex: 1
  }
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '53vh',
    backgroundColor: '#F5F7FF',
    borderRadius: "35px",
    marginLeft: "15%",
    marginRight: "25%",
    marginTop: "70px"
  };

  const imageStyle = {
    marginTop: "5vh",
    width: '100%',
    maxWidth: '400px',
    height: 'auto',
  };

  return (
    <>
      {isOpen ? renderAdvanceSearch() : null}
      {isOpenHistory ? renderAdvanceSearchHistory() : null}
      <div style={{ display: "flex", alignItems: "center" }}>
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}</div>
      <CardContent>
        <Grid container>
          <div style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}>
            <InputBox
              label="Co-Lender"
              isDrawdown={user?.type === "co-lender" ? false : true}
              options={colenderNames}
              onClick={(event, value, reason) => {
                setProduct([]);
                setSelectedColender(true);
                handleChange(event, "co-lender", event.value, reason);
              }}
              customClass={{ height: "58px", marginLeft: "24px", width: "13vw" }}
              customDropdownClass={inputBoxCss}
              initialValue={user?.type === "co-lender" ? user?.co_lender_name : co_lender}
              isDisabled={user?.type === "co-lender" ? true : false}
            />
            <InputBox
              label="Status"
              isDrawdown={true}
              options={[
                { "label": statusToDisplay.active, "value": statusToDisplay.active },
                { "label": statusToDisplay.closed, "value": statusToDisplay.closed },
                { "label": statusToDisplay.open, "value": statusToDisplay.open }
              ]}
              onClick={(event) => {
                if (event.value === "Active") {
                  setStatus("active");
                }
                if (event.value === "Inactive") {
                  setStatus("closed");
                }
                if (event.value === "Open") {
                  setStatus("open");
                }
              }}
              customClass={{ height: "58px", marginLeft: "16px", width: "13vw" }}
              customDropdownClass={inputBoxCss}
            />

            <div style={{ width: "13vw", marginLeft: "16px" }}>
              <CustomDatePicker
                width="13vw"
                placeholder="Duration"
                onDateChange={date => {
                  if (date.state == "custom") {
                    setCustomDate(false);
                    setShowButtonRight(true);
                    setShowButtonLeft(false);
                    setFromDate("");
                    setToDate("");
                  } else {
                    setCustomDate(true);
                    setShowButtonRight(false);
                    setShowButtonLeft(true);
                    setFromDate(date.fromDate);
                    setToDate(date.toDate);
                    setFilterdData({
                      ...filterData,
                      fromDate: moment(date.fromDate).format("YYYY-MM-DD"),
                      toDate: moment(date.toDate).format("YYYY-MM-DD")
                    });
                  }
                }}
              />
            </div>
            {showButtonLeft ? (
              <div style={{ marginLeft: "16px" }}>
                <Button label="Search"
                  buttonType="primary"
                  customStyle={{ height: "58px", width: "145px", borderRadius: "8px", fontSize: "15px" }}
                  onClick={() =>
                    handleSearchClick({
                      colenderID,
                      selectedProduct,
                      companyName,
                      fromDate,
                      toDate,
                      loanMaxAmount,
                      loanMinAmount,
                      status
                    })
                  }
                />
              </div>
            ) : null}
            <div style={{ width: "12vw", marginLeft: "16px" }}>
              {!customDate ? (
                <BasicDatePicker
                  placeholder="From date"
                  value={fromDate || null}
                  onDateChange={(date) => {
                    setFromDate(
                      verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                        ? moment(date).format("YYYY-MM-DD")
                        : date
                    );
                    setFilterdData({
                      ...filterData,
                      fromDate: verifyDateAfter1800(
                        moment(date).format("YYYY-MM-DD")
                      )
                        ? moment(date).format("YYYY-MM-DD")
                        : date
                    });
                  }}
                />
              ) : null}
            </div>
            <div style={{ width: "12vw", marginLeft: "16px" }}>
              {!customDate ? (
                <BasicDatePicker
                  placeholder={"To date"}
                  value={toDate || null}
                  onDateChange={(date) => {
                    setToDate(
                      verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                        ? moment(date).format("YYYY-MM-DD")
                        : date
                    );
                    setFilterdData({
                      ...filterData,
                      toDate: verifyDateAfter1800(
                        moment(date).format("YYYY-MM-DD")
                      )
                        ? moment(date).format("YYYY-MM-DD")
                        : date
                    });
                    if (date === null) {
                      setFilterdData({
                        ...filterData,
                        toDate: null
                      });
                    }
                  }}
                />
              ) : null}
            </div>
            {showButtonRight ? (
              <div style={{ marginLeft: "16px" }}>
                <Button label="Search"
                  buttonType="primary"
                  customStyle={{ height: "58px", width: "145px", borderRadius: "8px", fontSize: "15px" }}
                  onClick={() =>
                    handleSearchClick({
                      colenderID,
                      selectedProduct,
                      companyName,
                      fromDate,
                      toDate,
                      loanMaxAmount,
                      loanMinAmount,
                      status
                    })
                  }
                />
              </div>
            ) : null}
          </div>
        </Grid>
        {colendLoans.length ? (
          <div>
            <DownloadLoanFiles
              loanData={colenderLoans}
              colenderID={colenderID}
              companyId={companyId}
              productId={productId}
              status={status}
              loanMinAmount={loanMinAmount}
              loanMaxAmount={loanMaxAmount}
              fromDate={fromDate}
              toDate={toDate}
              disabled={
                isTagged
                  ? !(
                    checkAccessTags(["tag_colending_loans_export"]) &&
                    colenderLoans?.length
                  )
                  : !colenderLoans?.length
              }
              handleAleart={(error, message, type) =>
                showAlert(error?.response?.data?.message || message, type)
              }
              isColenderLoans={true}
              isCollateral={true}
            />
          </div>
        ) : null}

        <div>
          {!(colendLoans.length) && <div style={containerStyle}>
            <div>
              <img src={FrontPageImage} alt="Front page Image" style={imageStyle} />
            </div>
            <h2 style={{ fontSize: "27px", lineHeight: "48px", fontFamily: "Montserrat-SemiBold", padding: "30px" }}>Kindly fill the above fields to get started</h2>
          </div>}
        </div>

        {colendLoans.length ? (
          <div>
            <Table customStyle={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              wordBreak: "break-all"
            }}
              columns={[
                { id: "LOAN ID", label: "LOAN ID", format: (item) => item.co_lend_loan_id },
                { id: "CO-LENDER LOAN ID", label: "CO-LENDER LOAN ID", format: (item) => item.co_lender_account_no},
                { id: "LENDER NAME", label: "LENDER NAME", format: (item) => item.co_lender_name },
                { id: "LOAN AMOUNT", label: "LOAN AMOUNT", format: (item) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.co_lend_loan_amount) },
                { id: "DISBURSEMENT DATE", label: "DISBURSEMENT DATE", format: (item) => item.disbursement_date ? formatDate(item.disbursement_date) : "" },
                { id: "STATUS", label: "STATUS", format: (item) => statusToDisplay[item.status] },
                { id: "ACTIONS", label: "ACTIONS", format: (loans) => (
                    <div style={{ cursor: "pointer", display: "flex", flexDirection: "row" }}>
                      <img style={{ marginRight: "10px" }} src={RepaymentIcon} alt="svg" onClick={() => {
                        handleOpenRepaymentSchedule(
                          loans.co_lend_loan_id,
                          loans.co_lender_id
                        );
                      }} />
                      <img src={TransactionIcon} alt="svg" onClick={() => {
                        handleOpenRepaymentHistory(
                          loans.co_lend_loan_id,
                          loans.co_lender_id
                        );
                      }} />
                    </div>
                  )
                }
              ]}
              data={colendLoans}
            />
            <div style={{ width: "99%" }}>
              <Pagination
                itemsPerPage={rowsPerPage}
                totalItems={count}
                rowsPerPageOptions={[10, 20, 30]}
                onPageChange={handleChangePage}
                setRowLimit={setRowsPerPage}
                showOptions={true} />
            </div>
          </div>
        ) : null}
      </CardContent>

    </>
  );
};

export default connect(null, null)(ColendingLoans);

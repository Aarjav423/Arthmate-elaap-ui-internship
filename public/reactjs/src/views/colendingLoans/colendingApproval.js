import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@material-ui/core/styles";
import Button from "react-sdk/dist/components/Button/Button";
import Img from "../lending/images/download-button.svg";
import imgH from "../lending/images/download-button-hover.svg";
import FrontPageImage from "../lending/images/newleadloanscreen.svg";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Table from "react-sdk/dist/components/Table/Table";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import moment from "moment";
import { storedList } from "../../util/localstorage";
import { colendersListWatcher } from "../../actions/colenders.js";
import RepaymentScheduleListDemographics from "../lending/repaymentScheduleListDemographics.js";
import TransactionsHistoryList from "../lending/transactionsHistoryList.js";
import { getBorrowerDetailsWatcher } from "../../actions/borrowerInfo";
import { checkAccessTags } from "../../util/uam";
import { downloadDataInXLSXFormat } from "../../util/helper";
import CustomDatePicker from "../../components/DatePicker/datePickerCustom";
import { Link } from "react-router-dom";
const { getColendersProduct, getCbiLoans } = require("../../apis/colenders");
import { verifyDateAfter1800 } from "../../util/helper";
import { AlertBox } from "../../components/AlertBox";
const statusToDisplay = {
  "": "New",
  null: "New",
  undefined: "New",
  New: "New",
  Approved: "Approved",
  Hold: "Hold",
  Rejected: "Rejected"
};

const statusOptions = [
  { "label": statusToDisplay.New, "value": statusToDisplay.New },
  { "label": statusToDisplay.Approved, "value": statusToDisplay.Approved },
  { "label": statusToDisplay.Hold, "value": statusToDisplay.Hold },
  { "label": statusToDisplay.Rejected, "value": statusToDisplay.Rejected }
]



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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));
let filterObj = {
  company: null,
  product: null,
  fromDate: null,
  toDate: null,
  status: null,
  searchText: null
};

const colendingApproval = (props) => {
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
  const [product, setProduct] = useState([]);
  const [productsArray, setProductArray] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [colendersList, setColendersList] = useState("");
  const [colenderNames, setColenderNames] = useState([]);
  const [co_lender, setColender] = React.useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [colenderID, setColenderID] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [productId, setProductId] = useState("");
  const [enableSearch, setEnableSearch] = useState(false);
  const user = storedList("user");
  const [colenderLoans, setColenderLoans] = useState("");
  const [colendLoans, setColendLoans] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loanMinAmount, setLoanMinAmount] = useState("");
  const [loanMaxAmount, setLoanMAxAmount] = useState("");
  const [status, setStatus] = useState("New");
  const [count, setCount] = React.useState("");
  const [row, setRow] = React.useState([]);
  const [company, setCompany] = useState("");
  const [products, setProducts] = useState("");
  const [appid, setAppid] = useState("");
  const [loanId, setLoanId] = useState("");
  const [loanSchemaId, setLoanSchemaId] = useState("");
  const [repaymentSchedule, setRepaymentScheduleModel] = useState(false);
  const [repaymentScheduleList, setRepaymentScheduleListModel] =
    useState(false);
  const [transactionHistoryList, setTransactionHistoryListModel] =
    useState(false);
  const [repayment, setRepaymentModel] = useState(false);
  const [refundModel, setRefundModel] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [alert, setAlert] = useState(false);
  const [filter, setFilter] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [queue, setLoanQueue] = useState([]);
  const [persistLoanQueue, setPersistLoanQueue] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [colenderShortCode, setColenderShortCode] = useState("");
  const [statusValue, setStatusValue] = useState("New");
  const [assignee, setAssignee] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showActionList, setShowActionList] = useState(false);
  const [customDate, setCustomDate] = useState(true);
  const [selectedRow, setSelectedRow] = useState({});
  const [filterData, setFilterdData] = useState(filterObj);
  const [showButtonLeft, setShowButtonLeft] = useState(true);
  const [showButtonRight, setShowButtonRight] = useState(false);
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  function getUserRole(user) {
    if (user.userroles.includes("maker")) {
      return "maker";
    } else if (user.userroles.includes("checker1")) {
      return "checker1";
    } else if (user.userroles.includes("checker2")) {
      return "checker2";
    } else {
      return "No role found";
    }
  }
  const userRole = getUserRole(user);

  const assigneeOptions = [
    { label: "Maker", value: "Maker" },
    { label: "Checker1", value: "Checker1" },
    { label: "Checker2", value: "Checker2" }
  ];

  let filteredOptions = assigneeOptions;
  if (userRole === "checker1") {
    filteredOptions = assigneeOptions.filter(
      (option) => option.value !== "Maker"
    );
  }

  const fetchQues = () => {
    dispatch(
      getBorrowerDetailsWatcher(
        {
          ...filter,
          searchData: searchData,
          pagination: { page: page, limit: rowsPerPage }
        },
        (result) => {
          if (!result?.rows?.length) {
            setLoanQueue([]);
            setPersistLoanQueue([]);
          }
          setLoanQueue(result?.rows);
          setPersistLoanQueue(result?.rows);
          //setCount(result?.count);
        },
        (error) => {
          setLoanQueue([]);
          setPersistLoanQueue([]);
          //showAlert(error.response.data.message, "error");
        }
      )
    );
  };

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (user?.type === "co-lender") {
      handleChange(null, "co-lender", user.co_lender_name, "selectOption");
      setColender(user?.co_lender_name);
    }
    if (isTagged && checkAccessTags(["tag_colend_cases_read"]))
      fetchColendersList();
    if (!isTagged) fetchColendersList();

  }, [colenderLoans]);

  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month?.length < 2) month = "0" + month;
    if (day?.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

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
  const fetchColendersList = () => {
    const payload = {};
    let names = [];
    new Promise((resolve, reject) => {
      dispatch(colendersListWatcher(payload, resolve, reject));
    })
      .then((res) => {
        for (var i = 0; i < res?.length; i++) {
          names.push(res[i].co_lender_name);
        }
        const sortedArray = names?.sort();
        const colenderNamesObject = sortedArray.map(labelItem);
        setColenderNames(colenderNamesObject);
        setColendersList(res?.sort(compare));
        initialSetFunction(res?.sort(compare));
      })
      .catch((error) => {
        showAlert(error.res.data.message, "error");
      });
  };

  const handleChange = async (event, label, value, reason) => {
    if (label == "product") {
      if (reason == "clear") {
        setCompanyName(null);
        setProductId(null);
      } else {
        setSelectedProduct(value);
        const indexOfProduct = productsArray
          .map((e) => e.product_name)
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
            ? colendersList?.map((e) => e.co_lender_name).indexOf(value)
            : null;
          const co_lender = colendersList[indexOfColender];
          const co_lender_id = co_lender?.co_lender_id;
          setColenderID(co_lender_id);
          setCompanyName(null);
          setSelectedProduct("");

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

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const initialSetFunction = (lists) => {
    if (user?.type === "co-lender") {
      const tempValue = user?.co_lender_name || ""
      setColender(tempValue);
      const indexOfColender = lists
        ? lists?.map((e) => e.co_lender_name).indexOf(tempValue)
        : null;
      const co_lender = lists[indexOfColender];
      const co_lender_id = co_lender?.co_lender_id;
      setColenderID(co_lender_id);
    }
  }

  const handleSearchClick = async (value) => {
    if (!colenderID) return showAlert("Please select Co-lender", "error");
    if (statusValue == "") {
      setStatusValue("New");
      setStatus("New");
    }
    if (colendLoans) {
      setColendLoans([]);
      setColenderLoans([]);
      setCount([]);
    }
    const response = await getCbiLoans(
      colenderID,
      companyId,
      productId,
      fromDate,
      toDate,
      page,
      rowsPerPage,
      status,
      assignee
    );
    const data = response.data;
    setColendLoans(data?.colenderLoan);
    setColenderLoans(data?.colenderLoan);
    setCount(data?.count || 10);
    if (data?.colenderLoan?.length === 0) {
      showAlert("No data Available", "error")
    }
  };
  useEffect(async () => {
    if (colendLoans.length) {
      const response = await getCbiLoans(
        colenderID,
        companyId,
        productId,
        fromDate,
        toDate,
        page,
        rowsPerPage,
        status
      );
      const data = response.data;
      setColendLoans(data.colenderLoan);
      setColenderLoans(data.colenderLoan);
      setCount(data.count);
    }
  }, [page, rowsPerPage]);

  const handleChangePage = async (event, newPage) => {
    setPage(event);
  };

  // const handleChangeRowsPerPage = event => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  useEffect(() => {
    if (isTagged && checkAccessTags(["tag_colend_cases_read"])) fetchQues();
    if (!isTagged) fetchQues();
  }, [page]);

  const handleClose = (message, type) => {
    setRepaymentScheduleModel(false);
    setRepaymentScheduleListModel(false);
    setTransactionHistoryListModel(false);
    setRepaymentModel(false);
    if (message) {
      showAlert(message, type);
      fetchQues();
    }
  };

  const handleOpenRepaymentScheduleList = (row) => {
    setRepaymentScheduleListModel(true);
  };

  const handleOpenTransactionHistoryList = (row) => {
    setTransactionHistoryListModel(true);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleOpenDocuments = () => {
    window.open(
      `/admin/template/loandoclist/${company}/${products}/${appid}/pdf`,
      "_blank"
    );
  };

  const handleCams = () => {
    window.open(
      `/admin/lending/leads/cams/${company}/${products}/${appid}`,
      "_blank"
    );
  };

  const handleOpenDetails = () => {
    window.open(
      `/admin/loan/details/origin_lms/${loanId}/${products}/${company}/${loanSchemaId}/${colenderShortCode}`,
      "_blank"
    );
  };

  //Function for downloading colender loans reports
  const handleDownloadXLSXReport = () => {
    const payload = {
      userData: {
        user_id: user._id
      },
      submitData: {
        co_lender_id: colenderID
      }
    };
    downloadDisbursementReport(payload);
  };

  const downloadDisbursementReport = async (payload) => {
    const response = await getCbiLoans(
      colenderID,
      companyId,
      productId,
      fromDate,
      toDate,
      "",
      "",
      status
    );
    await Promise.all([
      downloadDataInXLSXFormat(
        `${co_lender}_Loans_Report.xlsx`,
        response?.data?.colenderLoan
      )
    ]);
  };
  // const sampleData = colendLoans.map((item, index)  => ({
  //   "LOAN ID":item.loan_id,
  //   "CUSTOMER NAME":`${item.first_Name}  ${item.last_name}`,
  //   "LOAN AMOUNT":new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.sanction_amount.$numberDecimal.toString()),
  //   "APPLICATION DATE": item.application_date,
  //   "STATUS":statusToDisplay[item.status],
  //   "ACTION":<Link
  //               onClick={() => {
  //               window.open(
  //               `/admin/co_lending/view_co_lender_cases/${item.loan_id}/${product}/${item.loan_schema_id}/${item.company_id}/${item.product_id}/${item.application_reference_number}/pdf`,
  //               "_blank"
  //               );
  //               }}
  //               >View</Link>
  // }));

  const buttonCss = {
    width: "100%",
    height: "40px",
    border: "1px solid #475BD8",
    borderRadius: "26px",
    color: "#475BD8",
    fontSize: "12px",
    fontFamily: "Montserrat-Regular",
    padding: "10px 24px",
    backgroundColor: "#FFF"
  }

  const inputBoxCss = {
    marginTop: "8px",
    width: "210px",
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
      {repaymentScheduleList && (
        <RepaymentScheduleListDemographics
          onModalClose={handleClose}
          title="Repayment schedule list"
          data={row}
          loanSchemaId={loanSchemaId}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          company={company}
          product={product}
        />
      )}
      {transactionHistoryList && (
        <TransactionsHistoryList
          onModalClose={handleClose}
          title="Transaction history list"
          data={row}
          loanSchemaId={loanSchemaId}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      )}
      <div style={{ display: "flex", alignItems: "center" }}>
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}</div>
      <div style={{ display: "flex", flexDirection: "row", marginTop: "20px" }} >
        <InputBox
          label="Co-Lender"
          isDrawdown={user?.type === "co-lender" ? false : true}
          options={colenderNames}
          onClick={(event, value, reason) => {
            setProduct([]);
            handleChange(event, "co-lender", event.value, reason);
          }}
          customClass={{ height: "58px", marginLeft: "24px", width: "210px" }}
          customDropdownClass={inputBoxCss}
          initialValue={user?.type === "co-lender" ? user?.co_lender_name : co_lender}
          isDisabled={user?.type === "co-lender" ? true : false}
        />
        <InputBox
          label="Status"
          customClass={{ height: "58px", marginLeft: "16px", width: "210px" }}
          customDropdownClass={inputBoxCss}
          options={statusOptions}
          initialValue={"New"}

          //isDisabled={colenderID ? false : true}
          //isDrawdown={colenderID ? true : false}
          isDrawdown={true}
          onClick={(event) => {
            const value = event.value
            if (value == null) {
              setStatus("New");
              setStatusValue("");
            }
            if (value === "New") {
              setStatus("New");
              setStatusValue(value);
            }
            if (value === "Approved") {
              setStatus(value);
              setStatusValue(value);
            }
            if (value === "Hold") {
              setStatus(value);
              setStatusValue(value);
            }
            if (value === "Rejected") {
              setStatus(value);
              setStatusValue(value);
            }
          }}
        />
        {!(userRole == "checker2") && <InputBox
          label="Assignee"
          customClass={{ height: "58px", marginLeft: "16px", width: "210px" }}
          customDropdownClass={inputBoxCss}
          options={filteredOptions}
          isDrawdown={true}
          onClick={(event) => {
            const value = event.value
            setAssignee(value);
          }}
        />}
        <div style={{ width: "200px", marginLeft: "16px" }}>
          <CustomDatePicker
            placeholder="Duration"
            width="200px"
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
                  status,
                  assignee
                })
              }
            />
          </div>
        ) : null}
        <div style={{ width: "200px", marginLeft: "16px" }}>
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
        <div style={{ width: "200px", marginLeft: "16px" }}>
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
      <div>
        {!(colendLoans.length) && <div style={containerStyle}>
          <div>
            <img src={FrontPageImage} alt="Front page Image" style={imageStyle} />
          </div>
          <h2 style={{ fontSize: "27px", lineHeight: "48px", fontFamily: "Montserrat-SemiBold", padding: "30px" }}>Kindly fill the above fields to get started</h2>
        </div>}
      </div>
      {colendLoans.length ? (
        <div style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "24px" }}>
            {isTagged && checkAccessTags(["tag_loan_queue_export"]) ? (
              <Button
                label=" Case Report Download"
                customStyle={buttonCss}
                buttonType="secondary"
                onClick={handleDownloadXLSXReport}
                imageButton={Img} imageButtonHover={imgH} iconButton="btn-secondary-download-button" />
            ) : null}
          </div>
          <div  >
            <Table customStyle={{ display: "flex",justifyContent: "space-between"}}
              columns={[
                { id: 'LOAN ID', label: 'LOAN ID', format: (item) => item.loan_id },
                { id: 'CUSTOMER NAME', label: 'CUSTOMER NAME', format: (item) => `${item.first_Name}  ${item.last_name}` },
                { id: 'LOAN AMOUNT', label: 'LOAN AMOUNT', format: (item) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.sanction_amount.$numberDecimal.toString()) },
                { id: 'APPLICATION DATE', label: 'APPLICATION DATE', format: (item) => item.application_date },
                { id: 'STATUS', label: 'STATUS', format: (item) => statusToDisplay[item.status] },
                { id: 'ASSIGNEE', label: 'ASSIGNEE', format: (item) => item.assignee ? item.assignee : "NA" },
                { id: 'ACTION', label: 'ACTION', format: (item) => <Link
                    onClick={() => {
                      window.open(
                        `/admin/co_lending/view_co_lender_cases/${item.loan_id}/${product}/${item.loan_schema_id}/${item.company_id}/${item.product_id}/${item.application_reference_number}/pdf`,
                        "_blank"
                      );
                    }}
                  >{"View"}</Link>
                }
              ]}
              data={colendLoans}
            />
            <Pagination itemsPerPage={rowsPerPage}
              totalItems={count}
              rowsPerPageOptions={[10, 20, 30]}
              onPageChange={handleChangePage}
              showOptions={true}
              setRowLimit={setRowsPerPage} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default colendingApproval;

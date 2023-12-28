import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import TextField from "@mui/material/TextField";
import moment from "moment";
import CompanyDropdown from "../Company/CompanySelect";
import ProductDropdown from "../Product/ProductSelect";
import BasicDatePicker from "../DatePicker/basicDatePicker";
import CustomDatePicker from "../DatePicker/customDatePicker";
import YearAndMonthPicker from "../DatePicker/YearAndMonthPicker";
import CustomDropdown from "../custom/customSelect";
import { AlertBox } from "../AlertBox";
import EnachDropdown from "../Dropdowns/EnachStatusDropdown";

import { verifyDateAfter1800 } from "../../util/helper";

let filterObj = {
  company: null,
  product: null,
  fromDate: null,
  toDate: null,
  status: null,
  searchText: null,
  loan_schema_id: null,
  minAmount: null,
  maxAmount: null,
  fromCreationDate: null,
  toCreationDate: null,
  isCreation: null
};

const BasicFilter = props => {
  console.log("basic filter old")
  const {
    reportName,
    isCustomDatePicker,
    text,
    onSearchClick,
    mandatoryFields,
    isViewSearch = false,
    isViewStatus = false,
    reportButton = false,
    sendData = () => {},
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
    allowGlobalSearch,
    isLeadReport,
    isLoanReport,
    isLoc,
    displayEnachDropdown,
    defaultFromDate,
    pageName,
    isViewCompanyProductFilter = true,
    ...other
  } = props;
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [fromCreationDate, setFromCreationDate] = useState(null);
  const [toCreationDate, setToCreationDate] = useState(null);
  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [filterData, setFilterdData] = useState(filterObj);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [isCreationDate, setIsCreationDate] = useState(true);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [restrictToDate, setRestrictToDate] = useState(false);
  const [customDate, setCustomDate] = useState(isCustomDatePicker);
  const [openDate, setOpenDate] = useState(true);
  const [openToDate, setOpenToDate] = useState(false);
  const [enachStatus, setEnachStatus] = useState({
    label: "In Progress",
    value: "Inprogress"
  });
  const dispatch = useDispatch();

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const handleSendData = () => {
    sendData(filterData);
  };

  const handleSearchClick = () => {
    let companyCondition = mandatoryFields["company"] && !company;
    let prouctCondition = mandatoryFields["product"] && !product;
    let fromDateCondition = mandatoryFields["fromDate"] && !fromDate;
    let toDateCondition = mandatoryFields["toDate"] && !toDate;

    if (!allowGlobalSearch) {
      if (companyCondition) return showAlert("Select company", "error");
      if (prouctCondition) return showAlert("Select product", "error");
      if (fromDateCondition) return showAlert("Select from date", "error");
      if (toDateCondition) return showAlert("Select to date", "error");
      if (mandatoryFields["searchText"] && !searchText)
        return showAlert("Enter search text", "error");
    } else if (allowGlobalSearch && !searchText) {
      if (companyCondition) return showAlert("Select company", "error");
      if (prouctCondition) return showAlert("Select product", "error");
      if (fromDateCondition) return showAlert("Select from date", "error");
      if (toDateCondition) return showAlert("Select to date", "error");
    }
    onSearchClick({
      company,
      product,
      fromDate: fromDate ? moment(fromDate).format("YYYY-MM-DD") : fromDate,
      toDate: toDate ? moment(toDate).format("YYYY-MM-DD") : toDate,
      status,
      searchText,
      loan_schema_id: product?.loan_schema_id || null,
      minAmount: minAmount,
      maxAmount: maxAmount,
      enachStatus
    });
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  React.useEffect(() => {
    handleSendData();
  });

  React.useEffect(() => {
    if (defaultFromDate) setFromDate(defaultFromDate);
  }, []);

  React.useEffect(() => {
    if (props?.company) setCompany(props?.company);
    if (props.product) setProduct(props.product);
    if (props.fromDate) setFromDate(props?.fromDate);
    if (props.toDate) setToDate(props?.toDate);
    if (props?.status) setStatus(props?.status);
    if (props?.minAmount) setMinAmount(props?.minAmount);
    if (props?.maxAmount) setMaxAmount(props?.maxAmount);
  }, [props?.company, props?.product, props?.fromDate]);

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <Grid xs={12} container spacing={1}>
        {!isCKYCReport && !isServiceUsage && !isLeadReport && !isLoanReport && (
          <>
          {isViewCompanyProductFilter ? (
          <Grid
              xs={12}
              sm={6}
              md={5}
              container
              item
              sx={{ display: "flex" }}
              spacing={1}
            >
              <Grid xs={6} item>
                {isLoc ? (
                  <CompanyDropdown
                    placeholder="Select company"
                    company={company}
                    reportName={reportName}
                    onCompanyChange={value => {
                      setCompany(value ? value : "");
                      setProduct([]);
                      setIsCreationDate(false);
                      setFilterdData({ ...filterData, company: value });
                    }}
                    isLoc={true}
                  />
                ) : (
                  <CompanyDropdown
                    placeholder="Select company"
                    company={company}
                    reportName={reportName}
                    onCompanyChange={value => {
                      setCompany(value ? value : "");
                      setProduct([]);
                      setIsCreationDate(false);
                      setFilterdData({ ...filterData, company: value });
                    }}
                  />
                )}
              </Grid>
              {!isServiceUsage && (
                <Grid xs={6} item>
                  {isLoc ? (
                    <ProductDropdown
                      reportName={reportName}
                      placeholder="Select product"
                      onProductChange={value => {
                        setProduct(value?.label ? value : null);
                        setFilterdData({ ...filterData, product: value });
                      }}
                      company={company || null}
                      product={product || null}
                      isLoc={true}
                      pageName={pageName}
                    />
                  ) : (
                    <ProductDropdown
                      reportName={reportName}
                      placeholder="Select product"
                      onProductChange={value => {
                        setProduct(value?.label ? value : null);
                        setFilterdData({ ...filterData, product: value });
                      }}
                      company={company || null}
                      product={product || null}
                      isLoc={isLoc}
                      pageName={pageName}
                    />
                  )}
                </Grid>
              )}
            </Grid>) : null}
          </>
        )}
        <Grid
          xs={6}
          container
          spacing={1}
          sx={{ display: "flex", alignSelf: "center" }}
        >
          {!isDisabledFromDateDropdown && isViewFromDate ? (
            <>
              {displayEnachDropdown ? (
                <Grid xs={3} item>
                  <EnachDropdown
                    placeholder="Status"
                    value={enachStatus}
                    data={[
                      {label:"Success",value:"Success" },
                      {label:"In Progress",value:"Inprogress" },
                      {label:"Failed",value:"Failed" }
                    ]}
                    changeValue={item => {
                      setEnachStatus(item ? item : null);
                    }}
                  />
                </Grid>
              ) : null}
              {isCustomDatePicker ? (
                <Grid xs={3} item>
                  <CustomDatePicker
                    placeholder="Select duration"
                    onDateChange={date => {
                      if (date.state == "custom") {
                        setCustomDate(false);
                        setFromDate("");
                        setToDate("");
                      } else {
                        setCustomDate(true);
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
                </Grid>
              ) : null}
              <Grid xs={3} item>
                {!customDate ? (
                  <BasicDatePicker
                    placeholder="From date"
                    value={fromDate || null}
                    open={isCustomDatePicker ? openDate : null}
                    disabled={
                      isScreenFlag
                        ? false
                        : (company?.value && !company?.value.toString()) ||
                          (product?.value && !product?.value.toString())
                    }
                    onDateChange={date => {
                      setFromDate(date);
                      setOpenToDate(true);
                      setFilterdData({
                        ...filterData,
                        fromDate: verifyDateAfter1800(
                          moment(date).format("YYYY-MM-DD")
                        )
                          ? moment(date).format("YYYY-MM-DD")
                          : date
                      });
                      setIsCreationDate(false);
                    }}
                  />
                ) : null}
              </Grid>
            </>
          ) : null}
          {isDisabledFromDateDropdown && isViewFromDate ? (
            <Grid xs={3} item>
              <BasicDatePicker
                placeholder={
                  isRepaymentReport
                    ? "From repayment date"
                    : isCKYCReport
                    ? "Date"
                    : "From date"
                }
                value={fromDate || null}
                disabled={
                  (!isCKYCReport && !company?.value) || !!fromCreationDate
                }
                onDateChange={date => {
                  setOpenToDate(true);
                  setFromDate(date);
                  setIsCreationDate(!!date);
                  setFilterdData({
                    ...filterData,
                    fromDate: verifyDateAfter1800(
                      moment(date).format("YYYY-MM-DD")
                    )
                      ? moment(date).format("YYYY-MM-DD")
                      : date,
                    isCreation: false
                  });
                  if (date === null) {
                    setToDate("");
                    setFilterdData({
                      ...filterData,
                      fromDate: null,
                      isCreation: false
                    });
                  }
                }}
              />
            </Grid>
          ) : null}
          {!isCKYCReport && isViewToDate && (
            <Grid xs={3} item>
              {!customDate ? (
                <BasicDatePicker
                  disabled={!fromDate || restrictToDate}
                  placeholder={
                    isRepaymentReport ? "To repayment date" : "To date"
                  }
                  value={toDate || null}
                  open={openToDate}
                  onDateChange={date => {
                    setToDate(date);
                    setOpenToDate(false);
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
            </Grid>
          )}
          {isRepaymentReport ? (
            <Grid xs={3} item>
              <BasicDatePicker
                placeholder="From creation date"
                value={fromCreationDate || null}
                disabled={isCreationDate || filterData.fromDate != null}
                onDateChange={date => {
                  setFromCreationDate(date);
                  setFilterdData({
                    ...filterData,
                    fromCreationDate: verifyDateAfter1800(
                      moment(date).format("YYYY-MM-DD")
                    )
                      ? moment(date).format("YYYY-MM-DD")
                      : date,
                    isCreation: true
                  });
                  if (date === null) {
                    setToCreationDate("");
                    setFilterdData({
                      ...filterData,
                      fromCreationDate: null,
                      isCreation: false
                    });
                  }
                }}
              />
            </Grid>
          ) : null}
          {isRepaymentReport ? (
            <Grid xs={3} item>
              <BasicDatePicker
                disabled={!fromCreationDate}
                placeholder="To creation date"
                value={toCreationDate || null}
                onDateChange={date => {
                  setToCreationDate(date);
                  setFilterdData({
                    ...filterData,
                    toCreationDate: verifyDateAfter1800(
                      moment(date).format("YYYY-MM-DD")
                    )
                      ? moment(date).format("YYYY-MM-DD")
                      : date,
                    fromDate: null,
                    toDate: null
                  });
                  if (date === null) {
                    setFilterdData({
                      ...filterData,
                      toDate: null
                    });
                  }
                }}
              />
            </Grid>
          ) : null}
          {isViewDayDropdown && (
            <Grid xs={3} item>
              <YearAndMonthPicker
                placeholder={"Select day"}
                views={["day"]}
                inputFormat={"dd"}
                value={day}
                onDateChange={date => {
                  setFilterdData({
                    ...filterData,
                    day: moment(date).format("DD")
                  });
                  setDay(date);
                }}
              />
            </Grid>
          )}
          {isViewYearDropdown && isServiceUsage && (
            <Grid xs={3} item>
              <YearAndMonthPicker
                placeholder={"Select year"}
                inputFormat={"yyyy"}
                views={["year"]}
                value={year}
                onDateChange={date => {
                  setFilterdData({
                    ...filterData,
                    year: moment(date).format("YYYY")
                  });
                  setYear(date);
                }}
              />
            </Grid>
          )}

          {isViewMonthDropdown && isServiceUsage && (
            <Grid xs={3} item>
              <YearAndMonthPicker
                placeholder={"Select month"}
                views={["month"]}
                inputFormat={"MMMM"}
                value={month}
                onDateChange={date => {
                  setFilterdData({
                    ...filterData,
                    month: moment(date).format("MM")
                  });
                  setMonth(date);
                }}
              />
            </Grid>
          )}
          {isViewMonthDropdown && !isServiceUsage && (
            <Grid xs={3} item>
              <YearAndMonthPicker
                placeholder={"Select month"}
                views={["month"]}
                inputFormat={"MMMM"}
                value={month}
                onDateChange={date => {
                  setFilterdData({
                    ...filterData,
                    month: moment(date).format("MM")
                  });
                  setMonth(date);
                }}
              />
            </Grid>
          )}
          {isViewYearDropdown && !isServiceUsage && (
            <Grid xs={3} item>
              <YearAndMonthPicker
                placeholder={"Select year"}
                inputFormat={"yyyy"}
                views={["year"]}
                value={year}
                onDateChange={date => {
                  setFilterdData({
                    ...filterData,
                    year: moment(date).format("YYYY")
                  });
                  setYear(date);
                }}
              />
            </Grid>
          )}
        </Grid>
        {isViewStatus && (
          <Grid xs={12} sm={6} md={3} item sx={{ alignSelf: "center" }}>
            <CustomDropdown
              placeholder="Select status"
              data={statusList}
              value={status}
              handleDropdownChange={value => {
                setStatus(value ? value : "");
                setFilterdData({ ...filterData, status: value });
              }}
            />
          </Grid>
        )}
        {isViewMinAmount && (
          <Grid item sx={{ alignSelf: "center" }}>
            <TextField
              variant="outlined"
              label="Loan amount min"
              type="text"
              name="LoanAmountMin"
              autoComplete="off"
              placeholder="Loan amount min"
              value={minAmount}
              onChange={e => {
                setMinAmount(e.target.value);
              }}
            />
          </Grid>
        )}
        {isViewMaxAmount && (
          <Grid item sx={{ alignSelf: "center" }}>
            <TextField
              variant="outlined"
              label="Loan amount Max"
              type="text"
              name="loanAmountMax"
              autoComplete="off"
              placeholder="Loan amount max"
              value={maxAmount}
              onChange={e => {
                setMaxAmount(e.target.value);
              }}
            />
          </Grid>
        )}
        {isViewSearch && (
          <Grid xs={12} sm={6} md={3} item sx={{ alignSelf: "center" }}>
            <TextField
              variant="outlined"
              label="Search by"
              type="text"
              name="searchBox"
              autoComplete="off"
              placeholder="Search by"
              value={searchText}
              onChange={e => {
                setSearchText(e.target.value);
              }}
            />
            <IconButton
              color="primary"
              sx={{
                alignSelf: "center",
                marginTop: "4px",
                marginLeft: "9px",
                cursor: "pointer",
                fontSize: "34px"
              }}
              aria-label="access-token"
              variant="contained"
              onClick={() => {
                handleSearchClick({
                  company,
                  product,
                  fromDate,
                  toDate,
                  status,
                  searchText
                });
              }}
            >
              <ManageSearchIcon
                sx={{
                  fontSize: "34px"
                }}
              />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default BasicFilter;

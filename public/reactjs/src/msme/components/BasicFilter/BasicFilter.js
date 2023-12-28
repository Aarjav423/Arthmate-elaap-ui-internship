import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import TextField from "@mui/material/TextField";
import moment from "moment";
import CompanyDropdown from "../../../components/Company/SelectCompany";
import ProductDropdown from "../../../components/Product/SelectProduct";
import BasicDatePicker from "../../../components/DatePicker/basicDatePicker";
import CustomDatePicker from "../../../components/DatePicker/datePickerCustom";
import YearAndMonthPicker from "../../../components/DatePicker/YearAndMonthPicker";
import CustomDropdown from "../../../components/custom/selectCustom";
import { AlertBox } from "../../../components/AlertBox";
import EnachDropdown from "../../../components/Dropdowns/EnachStatusDropdown";
import InputBox from "react-sdk/dist/components/InputBox/InputBox"
import Button from "react-sdk/dist/components/Button/Button";
import "./basicFilter.scss"

import { verifyDateAfter1800 } from "../../../util/helper";

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
    hasWidth = false,
    width,
    maxWidth,
    height,
    customDropdownClass,
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
    label: "Inprogress",
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
      <div className="container">
      <div className="flex-container nowrap">
        <div>
        {!isCKYCReport && !isServiceUsage && !isLeadReport && !isLoanReport && (
          <>
          {isViewCompanyProductFilter ? (
          <div className="company-product-filter" style={{display:"flex"}}>
              <div className="company-dropdown">
                {isLoc ? (
                  <CompanyDropdown
                    placeholder="Company"
                    company={company}
                    reportName={reportName}
                    onCompanyChange={value => {
                      setCompany(value ? value : "");
                      setProduct([]);
                      setIsCreationDate(false);
                      setFilterdData({ ...filterData, company: value });
                    }}
                    customStyle={customDropdownClass}
                    maxWidth={maxWidth}
                    width = {width}
                    height = {height}
                    isLoc={true}
                  />
                ) : (
                  <CompanyDropdown
                    placeholder="Company"
                    company={company}
                    reportName={reportName}
                    onCompanyChange={value => {
                      setCompany(value ? value : "");
                      setProduct([]);
                      setIsCreationDate(false);
                      setFilterdData({ ...filterData, company: value });
                    }}
                    maxWidth={maxWidth}
                    width = {width}
                    height = {height}
                    customStyle={customDropdownClass}
                  />
                )}
              </div>
              {!isServiceUsage && (
                <div className="product-dropdown" style={{marginLeft:"25px"}}>
                  {isLoc ? (
                    <ProductDropdown
                      reportName={reportName}
                      placeholder="Product"
                      customPlaceholder="Product"
                      onProductChange={value => {
                        setProduct(value?.label ? value : null);
                        setFilterdData({ ...filterData, product: value });
                      }}
                      company={company || null}
                      product={product || null}
                      isLoc={true}
                      pageName={pageName}
                      maxWidth={maxWidth}
                      width = {width}
                      height = {height}
                      customStyle={customDropdownClass}
                    />
                  ) : (
                    <ProductDropdown
                      reportName={reportName}
                      placeholder="Product"
                      customPlaceholder="Product"
                      onProductChange={value => {
                        setProduct(value?.label ? value : null);
                        setFilterdData({ ...filterData, product: value });
                      }}
                      company={company || null}
                      product={product || null}
                      isLoc={isLoc}
                      pageName={pageName}
                      maxWidth={maxWidth}
                      width = {width}
                      height = {height}
                      customStyle={customDropdownClass}
                    />
                  )}
                </div>
              )}
            </div>) 
            : null}
          </>
        )}
        </div>
        <div className="date-picker-container" style={{display:"flex" , marginLeft:"10px"}}>
          {!isDisabledFromDateDropdown && isViewFromDate ? (
            <>
              {displayEnachDropdown ? (
                <div className="date-picker-item">
                  <EnachDropdown
                    placeholder="Status"
                    value={enachStatus}
                    data={[
                      {label:"Success",value:"Success" },
                      {label:"Inprogress",value:"Inprogress" },
                      {label:"Failed",value:"Failed" }
                    ]}
                    changeValue={item => {
                      setEnachStatus(item ? item : null);
                    }}
                  />
                </div>
              ) : null}
              {isCustomDatePicker ? (
                <div className="date-picker-item">
                  <CustomDatePicker
                    placeholder="Duration"
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
                </div>
              ) : null}
              <div style={{width:"150px" , marginLeft:"25px"}}>
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
              </div>
            </>
          ) : null}
          {isDisabledFromDateDropdown && isViewFromDate ? (
            <div>
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
            </div>
          ) : null}
          {!isCKYCReport && isViewToDate && (
            <div style={{width:"150px" , marginLeft:"25px"}}>
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
            </div>
          )}
          {isRepaymentReport ? (
            <div>
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
            </div>
          ) : null}
          {isRepaymentReport ? (
            <div>
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
            </div>
          ) : null}
          {isViewDayDropdown && (
            <div>
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
            </div>
          )}
          {isViewYearDropdown && isServiceUsage && (
            <div>
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
            </div>
          )}

          {isViewMonthDropdown && isServiceUsage && (
            <div>
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
            </div>
          )}
          {isViewMonthDropdown && !isServiceUsage && (
            <div>
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
            </div>
          )}
          {isViewYearDropdown && !isServiceUsage && (
            <div>
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
            </div>
          )}
        </div>
      </div>
      
      {/* Rest of other content */}
      <div style={{display:"flex"}}> 
      {isViewStatus && (
          <div>
            <CustomDropdown
              placeholder="Status"
              data={statusList}
              value={status}
              handleDropdownChange={value => {
                setStatus(value ? value : "");
                setFilterdData({ ...filterData, status: value });
              }}
            />
          </div>
        )}
        {isViewMinAmount && (
          <div style={{marginLeft:"25px"}}>
            <InputBox
              // variant="outlined"
              label="Min Amt"
              customClass={{height:"58px" , width:"15vw"  }}
              type="text"
              name="LoanAmountMin"
              // autoComplete="off"
              // placeholder="Loan amount min"
              value={minAmount}
              onClick={e => {
                setMinAmount(e.value);
              }}
            />
          </div>
        )}
        {isViewMaxAmount && (
          <div style={{marginLeft:"25px"}}>
            <InputBox
              // variant="outlined"
              label="Max Amt"
              customClass={{height:"58px" , width:"15vw"  }}
              type="text"
              name="loanAmountMax"
              // autoComplete="off"
              // placeholder="Loan amount max"
              value={maxAmount}
              onClick={e => {
                setMaxAmount(e.value);
              }}
            />
          </div>
        )}
        {isViewSearch && (
          <div style={{marginLeft:"25px" , display:"flex"}}>
            <InputBox
              // variant="outlined"
              customClass={{height:"58px" , width:"15vw"  }}
              label="Search by"
              type="text"
              name="searchBox"
              // autoComplete="off"
              placeholder="Search by"
              value={searchText}
              onClick={e => {
                setSearchText(e.value);
              }}
            />
             <Button
            buttonType="primary"
             customStyle={{height:"58px", width:"120px" , borderRadius:"8px" ,marginLeft:"28px" , fontSize:"14px" }}
             label="Search"
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
            />
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default BasicFilter;
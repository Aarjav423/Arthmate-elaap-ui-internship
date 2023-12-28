const { useState, useEffect } = require("react");
const { AlertBox } = require("../../../components/AlertBox");
import CompanyDropdown from "../../../components/Company/SelectCompany";
import ProductDropdown from "../../../components/Product/SelectProduct";
import CustomDatePicker from "../../../components/DatePicker/datePickerCustom";
import BasicDatePicker from "../../../components/DatePicker/basicDatePicker";
import moment from "moment";
import Button from "react-sdk/dist/components/Button";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import "react-sdk/dist/styles/_fonts.scss";
import { verifyDateAfter1800 } from "../../../util/helper";

const ReportRequestCriteria = ( props ) => {

  const {
    reportName,
    pageName,
    isLoc = false,
    isStatusDropdownRequired = false,
    isStatusList,
    isCustomDatePicker = true,
    isGenerateDisabled = false,
    handleGenerate,
    initialStatus = false,
    ...other
  } = props;

  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [status, setStatus] = useState(null);
  const [customDate, setCustomDate] = useState(isCustomDatePicker);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [openDate, setOpenDate] = useState(true);
  const [openToDate, setOpenToDate] = useState(false);

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
    }, 3000);
  };

  const handleGenerateClick = () => {
    if (!company) return showAlert("Select company", "error");
    if (!product) return showAlert("Select product", "error");
    if (!fromDate) return showAlert("Select from date", "error");
    if (!toDate) return showAlert("Select to date", "error");

    handleGenerate({
      company,
      product,
      fromDate: verifyDateAfter1800(moment(fromDate).format("YYYY-MM-DD")) ? moment(fromDate).format("YYYY-MM-DD") : fromDate,
      toDate: verifyDateAfter1800(moment(toDate).format("YYYY-MM-DD")) ? moment(toDate).format("YYYY-MM-DD") : toDate,
      status
    });
  }

  useEffect(() => {
    if (props?.company) setCompany(props?.company);
    if (props?.product) setProduct(props?.product);
    if (props?.fromDate) setFromDate(props?.fromDate);
    if (props?.toDate) setToDate(props?.toDate);
    if (props?.initialStatus) setStatus(props?.initialStatus);
  }, [props?.company, props?.product, props?.fromDate, props?.initialStatus]);

  const customCss= {height:"58px" , width:"15vw", marginLeft:"24px"}

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}

      <div
        id="report-request-container"
        style={{
          display: 'flex',
          gap: '16px',
          flexDirection: 'row',
          padding: '24px'
        }}
      >
        <div id="company-dropdown">
          <CompanyDropdown
            reportName={reportName}
            placeholder="Company"
            company={company}
            onCompanyChange={value => {
              setCompany(value ? value : "");
              setProduct([]);
            }}
            isLoc={isLoc}
          />
        </div>

        <div id="product-dropdown">
          <ProductDropdown
            reportName={reportName}
            placeholder="Product"
            company={company || null}
            product={product || null}
            isLoc={isLoc}
            onProductChange={value => {
              setProduct(value ? value : null);
            }}
            pageName={pageName}
          />
        </div>

        {isCustomDatePicker ? (
          <div id="custom-date-picker">
            <CustomDatePicker
              placeholder="Duration"
              onDateChange={date => {
                if (date.state === "custom") {
                  setCustomDate(false);
                  setFromDate("");
                  setToDate("");
                } else {
                  setCustomDate(true);
                  setFromDate(date.fromDate);
                  setToDate(date.toDate);
                }
              }}
            />
          </div>
        ) : null}

        {!customDate ? (
          <div style={{ width: '150px' }}>
            <BasicDatePicker
              placeholder="From date"
              value={fromDate || null}
              open={isCustomDatePicker ? openDate : null}
              onDateChange={date => {
                setFromDate(date);
                setOpenToDate(true);
              }}
            />
          </div>
        ) : null}

        {!customDate ? (
          <div style={{ width:"150px" }}>
            <BasicDatePicker
              placeholder="To date"
              value={toDate || null}
              open={openToDate}
              onDateChange={date => {
                setToDate(date);
                setOpenToDate(false);
              }}
            />
          </div>
        ) : null}

        <Button
          buttonType="primary"
          label="Generate report"
          onClick={handleGenerateClick}
          isDisabled={isGenerateDisabled}
          customStyle={{
            height: '56px',
            display: 'flex',
            borderRadius: '8px',
            fontFamily: 'Montserrat-Regular',
            fontSize: '16px',
            fontWeight: '600'
          }}
        />

      </div>
     {isStatusDropdownRequired ? (
           <InputBox
            id={"Status"}
            isDrawdown={true}
            placeholder="Status"
            label={"Status"}
            options={isStatusList}
            initialValue={props?.initialStatus}
            onClick={value => {
              setStatus(value ? value : null);
            }}
            customClass={customCss}
            customDropdownClass={{marginTop:"8px", zIndex:"1" , width:"15vw"}}
          />
        ) : null}

    </>
  );
};

export default ReportRequestCriteria;

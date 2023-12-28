import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "react-sdk/dist/components/Button";
import {AlertBox} from "../../components/AlertBox";
import {getDrawdownRequestUIFields} from "./uiFieldsHardCoded";
import {drawDownRequestUiState} from "./stateDataHardCoded";
import {
  batchDisbursementWatcher,
  calculateNetDrawDownAmountWatcher,
  fetchBankDetailsWatcher,
  fetchSchemeDetailsWatcher,
  updateDrawdownRequestWatcher
} from "../../actions/compositeDisbursement";
import {drawDownRequestListWatcher} from "../../actions/transactionHistory";
import {validateData} from "../../util/validation";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import {styled} from "@material-ui/core/styles";
import Dialog from "@mui/material/Dialog";
import {storedList} from "../../util/localstorage";
import Autocomplete from "@mui/material/Autocomplete";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import AnchorSelect from "../../components/Anchor/AnchorSelect";

styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

export default function DrawDownRequestUi({
  setIsOpen,
  isEdit,
  productData,
  productDetails,
  data,
  onSearchClick,
  firstDD
}) {
  const drawDownRequestUiFields=getDrawdownRequestUIFields(productDetails)
  const useAsyncState = (initialState) => {
    const [state, setState] = useState(initialState);

    const asyncSetState = (value) => {
      return new Promise((resolve) => {
        setState(value);

        setState((current) => {
          resolve(current);

          return current;
        });
      });
    };

    return [state, asyncSetState];
  };
  const dispatch = useDispatch();
  const { loan_id, company_id, product_id } = useParams();
  const [stateData, setStateData] = useState({});
  const [validationData, setValidationData] = useState({});
  const [severity, setSeverity] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [invoiceList, setInvoiceList] = useState([]);
  const [formValidated, setFormValidated] = useAsyncState(true);
  const [next, setNext] = useState(false);
  const [createButtonWithScheme, setCreateButtonWithScheme] = useState(false);
  const [back, setBack] = useState(false);
  const [createButtonWithoutScheme, setCreateButtonWithoutScheme] = useState(false);
  const [button, setButton] = useState(false);
  const user = storedList("user");
  const [bankId, setBankId] = useState("");
  const [schemeId, setSchemeId] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [names, setNames] = useState([]);
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [schemeName, setSchemeName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showProductSchemes, setShowProductSchemes] = useState(false);
  const [netDrawDownAmount, setNetDrawDownAmount] = useState("");
  const [showNetDrawDownAmount, setShowNetDrawDownAmount] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [repaymentDays, setRepaymentDays] = useState("");
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const [anchorName, setAnchorName] = useState("");
  const [showPf, setShowPf] = useState(false);
  const [showNoOfEmi, setShowNoOfEmi] = useState(false);

  useEffect(() => {
    setInitialState();
  }, []);

  const setInitialState = () => {
    setFormValidated(true);
    drawDownRequestUiState["loan_id"] = loan_id;
    setStateData(drawDownRequestUiState);
    //Generate dynamic validationData
    let validationData = {};
    Object.keys(drawDownRequestUiState).forEach((item) => {
      validationData[`${item}State`] = "";
    });
    setStateData((prevState) => ({
      ...prevState,
      processing_fees_including_gst:
        parseFloat(productData?.processing_fees_amt) +
        parseFloat(productData?.gst_on_pf_amt)
    }));
    setValidationData(validationData);
  };

  useEffect(() => {
    if (productData) {
      if (productData?.beneficiaryBankSource === "Disbursement/Drawdown") {
        fetchBankDetails();
        setShowBankDetails(true);
        setButton(true);
      }
      if (productData?.reconType === "Invoice") {
        fetchInvoiceDetails();
        setButton(true);
        setShowInvoice(true);
      }
      if (productData?.productscheme?.length > 0) {
        fetchSchemeDetails();
      }
    }
    if (data) {
      if (data?.beneficiary_bank_details_id) {
        fetchBankDetails();
        setShowBankDetails(true);
        setButton(true);
        setBankId(data?.beneficiary_bank_details_id);
      }
      if (data?.invoice_number) {
        setButton(true);
        setShowInvoice(true);
        fetchInvoiceDetails();
        setInvoiceNumber(data?.invoice_number);
      }
      if (data?.product_scheme_id) {
        fetchSchemeDetails();
        setSchemeId(data?.product_scheme_id);
      }
      if (data?.anchor_name) {
        setAnchorName(data?.anchor_name);
      }
      setReadOnly(true);
      setStateData(data);
    }
    if (productData?.linePf && productData.linePf === "drawdown" && firstDD) {
      setShowPf(true);
    }
    if (productData?.allowSubLoans || productData?.forceUsageConvertToEmi) {
      setShowNoOfEmi(true);
    }
    checkEntireFormValidation();
  }, [stateData]);

  const checkNoErrorInForm = () => {
    let noBlank = true;
    Object.keys(stateData).forEach((item) => {
      const currentField = drawDownRequestUiFields.filter((ltItem) => {
        return ltItem.field === item;
      })[0];
      if (currentField.checked.toLowerCase() === "true") {
        if (stateData[item] === "" || !stateData[item]) noBlank = false;
      }
    });
    let noError = true;
    Object.keys(validationData).forEach((item) => {
      if (validationData[item] === "has-danger") noError = false;
    });

    return noError === true && noBlank === true;
  };

  const checkEntireFormValidation = async () => {
    let noError = true;
    Object.keys(validationData).forEach((item) => {
      if (validationData[item] === "has-danger") noError = false;
    });
    await setFormValidated(noError);
  };

  const change = async (event, fieldName) => {
    const name = fieldName;
    const value = event.value;
    if((fieldName==="withheld_percentage" && stateData.drawdown_amount>0) || (fieldName === "drawdown_amount" && stateData.withheld_percentage > 0)){
      let with_held_amt = (parseFloat(value)*parseFloat(fieldName==="withheld_percentage" ? stateData.drawdown_amount ? stateData.drawdown_amount : 0 : fieldName === "drawdown_amount"? stateData.withheld_percentage ? stateData.withheld_percentage : 0 : 0 ))/100;
    await setFormValidated(true);
    changeStateError(name, value);
    setStateData((prevState) => ({
      ...prevState,
      [`${name}`]: value
    }));
    //checkEntireFormValidation();
    setStateData((prevState) => ({
      ...prevState,
      [`${"withheld_amount"}`]: parseFloat(with_held_amt).toFixed(2)
    }));
  }else{
  await setFormValidated(true);
  changeStateError(name, value);
  setStateData((prevState) => ({
    ...prevState,
    [`${name}`]: value
  }));
  }
  };

  const validateStateData = async () => {
    await setFormValidated(true);
    Object.keys(stateData).forEach((item) => {
      const currentField = drawDownRequestUiFields.filter((ltItem) => {
        return ltItem.field === item;
      })[0];
      if (
        currentField.checked.toLowerCase() === "true" ||
        (currentField.checked.toLowerCase() === "false" &&
          stateData[item] !== "")
      ) {
        changeStateError(item, stateData[item]);
      }
    });
  };

  const changeStateError = async (item, value) => {
    const fieldData = drawDownRequestUiFields.filter(
      (x) => x.field === item
    )[0];
    if (
      fieldData.checked.toLowerCase() === "true" ||
      (fieldData.checked.toLowerCase() === "false" && value !== "")
    ) {
      if (!validateData(fieldData.type, value)) {
        if (`${item}State` !== "has-danger")
          setValidationData((prevState) => ({
            ...prevState,
            [`${item}State`]: "has-danger"
          }));
        await setFormValidated(false);
      } else {
        if (`${item}State` !== "")
          setValidationData((prevState) => ({
            ...prevState,
            [`${item}State`]: ""
          }));
          if (fieldData.placeholder === "Withheld Percentage" && !(parseFloat(value) < 100  && parseFloat(value) > 0)) {
            setValidationData((prevState) => ({
              ...prevState,
              [`${item}State`]: "has-danger"
            }));
          
          }
        
      }
    } else {
      setValidationData((prevState) => ({
        ...prevState,
        [`${item}State`]: ""
      }));
    }
  };

  const fetchBankDetails = () => {
    const payload = {
      company_id: company_id ? company_id : data?.company_id,
      product_id: product_id ? product_id : data?.product_id,
      user_id: user._id,
      page: 0,
      limit: 1000,
      search: "",
      status: "Success"
    };
    new Promise((resolve, reject) => {
      dispatch(fetchBankDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setNames(response.data);
        if (data) {
          let arr = response.data;
          let obj = arr.find(
            (o) => o._id === data?.beneficiary_bank_details_id
          );
          setBeneficiaryName(obj.bene_bank_account_holder_name);
          setSelectedBank(obj);
        }
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const fetchSchemeDetails = () => {
    const payload = {
      company_id: company_id ? company_id : data?.company_id,
      product_id: product_id ? product_id : data?.product_id,
      user_id: user._id,
      page: 0,
      limit: 1001,
      scheme_id: "",
      status: true
    };
    new Promise((resolve, reject) => {
      dispatch(fetchSchemeDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setSchemes(response.data.rows);
        if (data) {
          let arr = response.data.rows;
          let obj = arr.find((o) => o._id === data?.product_scheme_id);
          setSchemeName(obj.scheme_name);
        }
        setButton(true);
        setShowProductSchemes(true);
      })
      .catch();
  };

  const debounce = (callback, delay) => {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  useEffect(() => {
    const debouncedFetchNetDrawdownAmt = debounce(fetchNetDrawdownAmt, 1000);
    if (
      !isEdit &&
      stateData.drawdown_amount &&
      (stateData.usage_fees_including_gst ||
        stateData.processing_fees_including_gst ||
        stateData.no_of_emi ||
        stateData.repayment_days ||
        stateData.withheld_percentage)
    ) {
      debouncedFetchNetDrawdownAmt();
    }
  }, [
    stateData.drawdown_amount,
    stateData.usage_fees_including_gst,
    stateData.processing_fees_including_gst,
    stateData.no_of_emi,
    stateData.repayment_days,
    stateData.withheld_percentage
  ]);

  const fetchNetDrawdownAmt = (Id, repayment_days) => {
    const data = {
      company_id: company_id ? company_id : stateData?.company_id,
      product_id: product_id ? product_id : stateData?.product_id,
      user_id: user._id,
      loan_id: loan_id ? loan_id : stateData?.loan_id,
      no_of_emi: stateData.no_of_emi,
      drawdown_amount: stateData.drawdown_amount,
      usage_fees_including_gst: stateData.usage_fees_including_gst,
      processing_fees_including_gst: stateData.processing_fees_including_gst,
      repayment_days: stateData.repayment_days
        ? stateData.repayment_days
        : repayment_days,
      product_scheme_id: Id >= 0 ? Id : "",
      withheld_amount:stateData?.withheld_amount,
    };
    if (showProductSchemes) {
      delete data["repayment_days"];
    }
    if (!showPf) {
      delete data["processing_fees_including_gst"];
    }
    new Promise((resolve, reject) => {
      dispatch(calculateNetDrawDownAmountWatcher(data, resolve, reject));
    })
      .then((response) => {
        setNetDrawDownAmount(response.data.net_drawdown_amount);
        setStateData((prevState) => ({
          ...prevState,
          net_drawdown_amount: response.data?.net_drawdown_amount
            ? response.data?.net_drawdown_amount?.toString()
            : "0"
        }));
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const updateDrawdownRequest = () => {
    const payload = {
      product_id: data.product_id,
      company_id: data.company_id,
      loan_id: data.loan_id,
      drawdown_amount: data.drawdown_amount,
      usage_fees_including_gst: data.usage_fees_including_gst,
      repayment_days:
        repaymentDays === "" ? data.repayment_days : repaymentDays,
      product_scheme_id: schemeId !== "" ? schemeId : data?.product_scheme_id,
      beneficiary_bank_details_id:
        bankId !== "" ? bankId : data?.beneficiary_bank_details_id,
      net_drawdown_amount:
        netDrawDownAmount !== "" ? netDrawDownAmount : data?.net_drawdown_amount,
      invoice_number:
        invoiceNumber !== "" ? invoiceNumber : data?.invoice_number,
      user_id: user._id,
      request_id: data?._id,
      anchor_name: anchorName?anchorName:"",
      withheld_amount: data?.withheld_amount
    }
    if (showProductSchemes) {
      delete payload['repayment_days']
    }
    if (data.processing_fees_including_gst) {
      payload["processing_fees_including_gst"] =
        data.processing_fees_including_gst;
    }
    if (showProductSchemes) delete payload["repayment_days"];
    if (!showPf) {
      delete payload["processing_fees_including_gst"];
    }

    new Promise((resolve, reject) => {
      dispatch(updateDrawdownRequestWatcher(payload, resolve, reject));
    })
      .then((response) => {
        showAlert(response?.message, "success");
        setTimeout(() => {
          closePopupHandler();
          onSearchClick();
        }, 3000);
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const calculateNetDrawDownAmount = (Id) => {
    const payload = {
      company_id: data.company_id,
      product_id: data.product_id,
      drawdown_amount: data.drawdown_amount,
      usage_fees_including_gst: data.usage_fees_including_gst,
      loan_id: data.loan_id,
      repayment_days: data.repayment_days,
     withheld_amount:stateData?.withheld_amount,
      user_id: user._id,
      product_scheme_id: Id ? Id : schemeId,
    }
    if (showProductSchemes) {
      delete payload['repayment_days']
    }
    if (data.processing_fees_including_gst) {
      payload["processing_fees_including_gst"] =
        data.processing_fees_including_gst;
    }
    if (showProductSchemes) {
      delete payload["repayment_days"];
    }
    if (!showPf) {
      delete payload["processing_fees_including_gst"];
    }
    new Promise((resolve, reject) => {
      dispatch(calculateNetDrawDownAmountWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setNetDrawDownAmount(response.data.net_drawdown_amount);
        setShowNetDrawDownAmount(true);
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const fetchInvoiceDetails = () => {
    const payload = {
      loan_id: loan_id ? loan_id : data?.loan_id,
      company_id: company_id ? company_id : data?.company_id,
      product_id: product_id ? product_id : data?.product_id,
      page:0,
      limit:1000
    };
    new Promise((resolve, reject) => {
      dispatch(drawDownRequestListWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setInvoiceList(response.data);
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, "error");
      });
  };


  const callSubmitAPI = () => {
    if (formValidated) {
      const userData = {
        company_id: company_id,
        product_id: product_id
      };
      let data = stateData;
      data = {
        ...data,
        anchor_name: anchorName ? anchorName : "",
        beneficiary_bank_details_id: bankId,
        product_scheme_id: schemeId,
        invoice_number: invoiceNumber
      };
      if (showProductSchemes) {
        delete data["repayment_days"];
      }
      if (!showPf) delete data["processing_fees_including_gst"];
      dispatch(
        batchDisbursementWatcher(
          { submitData: data, userData },
          (result) => {
            setAlert(true);
            showAlert(result.message, "success");
            setTimeout(() => {
              setIsOpen(false);
              window.location.reload();
            }, 3000);
          },
          (error) => {
            setCreateButtonWithScheme(false);
            setCreateButtonWithoutScheme(false);
            setBack(false);
            setAlert(true);
            showAlert(error.response.data.message, "error");
            setNext(false);
          }
        )
      );
    }
  };

  const handleSubmit = async () => {
    if (data) {
     if (showProductSchemes && schemeId === "") {
        showAlert("Please select scheme.", "error");
      } else {
        updateDrawdownRequest();
      }
    } else {
      await validateStateData();
      if (checkNoErrorInForm()) {
        if (
          productData?.beneficiaryBankSource === "Disbursement/Drawdown" &&
          bankId === ""
        ) {
          showAlert("Beneficiary bank details is required", "error");
        } else if (showProductSchemes && schemeId === "") {
          showAlert("Please select scheme.", "error");
        } else if (
          productData?.reconType === "Invoice" &&
          invoiceNumber === ""
        ) {
          showAlert("please enter Invoice number", "error");
        } else {
            setCreateButtonWithScheme(true);
            setCreateButtonWithoutScheme(true);
            setBack(true);
            callSubmitAPI();
        }
      } else {
      }
    }
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      setAlert(false);
    }, 4000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  function closePopupHandler() {
    setIsOpen(false);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNext(false);
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  const handleChangeBankDetails = (event, newValue) => {
    setBeneficiaryName(newValue?.bene_bank_account_holder_name || "");
    setBankId(newValue?._id || "");
  };

  const handleChangeSchemeDetails = (event) => {
    let name = event.target.value;
    setSchemeName(name.scheme_name);
    setRepaymentDays(name.repayment_days);
    setSchemeId(name._id);
    if (data) {
      calculateNetDrawDownAmount(name._id);
    } else {
      fetchNetDrawdownAmt(name._id, name.repayment_days);
    }
  };

  const handleInvoiceNumber = (event) => {
    let invoiceNumber = validateData("invoiceNumber", event.value);
    if (invoiceNumber) {
      setInvoiceNumber(event.value);
    }
  };

  const handleBankRecord = (data, event, ID) => {
    if (!event.target.checked) {
      setBeneficiaryName("");
      setBankId("");
    }
    if (event.target.checked) {
      setBeneficiaryName(data);
      setBankId(ID);
    }
  };

  const handleSchemeRecord = (data, event, ID) => {
    if (!event.target.checked) {
      setSchemeName("");
      setSchemeId("");
    }
    if (event.target.checked) {
      setSchemeName(data);
      setSchemeId(ID);
    }
  };

  const handleNext = async () => {
    //Return error if recon_type is invoice and scheme is not mapped to product.
    if (
      productData?.reconType === "Invoice" &&
      !productData?.productscheme?.length
    ) {
      return showAlert("Product scheme mapping is required.", "error");
    }
    if (data && button === true) {
      setNext(true);
      setOpenDialog(true);
    } else {
      if (button === true) {
        await validateStateData();
        if (checkNoErrorInForm()) {
          setNext(true);
          setOpenDialog(true);
        }
      } else {
        handleSubmit();
      }
    }
  };
  const customButtonCss = {
    height: "48px",
    width: "50%",
    fontSize: "16px",
    padding: "13px 44px",
    borderRadius: "8px",
    gap: "10px"
  };
  const customCancelButtonCss = {
    height: "48px",
    width: "50%",
    fontSize: "16px",
    padding: "13px 44px",
    color: "#475BD8",
    border: "1px solid #475BD8",
    borderRadius: "8px",
    gap: "10px"
  };

  return (
    <>
      <Grid>
        {next ? (
          <>
            <div>
              <FormPopup
                heading={
                  isEdit ? "Edit Drawdown Request" : "New Drawdown Request"
                }
                onClose={handleCloseDialog}
                isOpen={openDialog}
                customStyles={{
                  width: "fit-content",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "absolute",
                  left: "75%"
                }}
                customHeaderStyle={{ marginBottom: "44px" }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Grid xs={12}>
                    {alert ? (
                      <AlertBox
                        severity={severity}
                        msg={alertMessage}
                        onClose={handleAlertClose}
                      />
                    ) : null}
                  </Grid>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "32px"
                    }}
                  >
                    {showBankDetails || showProductSchemes || showInvoice ? (
                      <FormControl>
                        <AnchorSelect
                          anchor={anchorName}
                          onAnchorChange={(item) => {
                            setAnchorName(item?.label);
                          }}
                        />
                      </FormControl>
                    ) : null}

                    {showBankDetails ? (
                      <FormControl>
                        <Autocomplete
                          id="demo-simple-select"
                          options={names}
                          getOptionLabel={(option) =>
                            option.bene_bank_account_holder_name || option
                          }
                          value={
                            selectedBank?.bene_bank_account_holder_name || ""
                          }
                          onChange={(event, newValue) => {
                            setSelectedBank(newValue);
                            handleChangeBankDetails(event, newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Bank Beneficiary"
                              variant="outlined"
                            />
                          )}
                          renderOption={(props, option) => (
                            <MenuItem
                              {...props}
                              key={option._id}
                              value={option}
                            >
                              <Checkbox
                                checked={bankId === option._id}
                                onChange={(e) =>
                                  handleBankRecord(
                                    option.bene_bank_account_holder_name,
                                    e,
                                    option._id
                                  )
                                }
                                style={{ marginRight: "10px" }}
                                color="primary"
                              />
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center"
                                }}
                              >
                                <Typography
                                  style={{
                                    marginRight: "20px",
                                    fontSize: "16px"
                                  }}
                                >
                                  {option.bene_bank_account_holder_name}
                                </Typography>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: "12px"
                                }}
                              >
                                <div style={{ marginRight: "40px" }}>
                                  Bank Name
                                  <div style={{ fontSize: "16px" }}>
                                    {option.bene_bank_name}
                                  </div>
                                </div>
                                <div style={{ marginRight: "40px" }}>
                                  IFSC
                                  <div style={{ fontSize: "16px" }}>
                                    {option.bene_bank_ifsc}
                                  </div>
                                </div>
                                <div>
                                  A/C Number
                                  <div style={{ fontSize: "16px" }}>
                                    {option.bene_bank_acc_num}
                                  </div>
                                </div>
                              </div>
                            </MenuItem>
                          )}
                        />
                      </FormControl>
                    ) : null}

                    {showProductSchemes ? (
                      <FormControl>
                        <InputLabel id="demo-simple-select-label">
                          Select Scheme
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Select Scheme"
                          renderValue={(value) => (value = schemeName)}
                          onChange={handleChangeSchemeDetails}
                          MenuProps={MenuProps}
                          defaultValue={schemeName}
                          style={{ borderRadius: "8px", width: "700px" }}
                        >
                          {Array.from(schemes).map((data, index) => (
                            <MenuItem key={index} value={data}>
                              <Checkbox
                                checked={schemeId === data._id}
                                onChange={(e) =>
                                  handleSchemeRecord(
                                    data.scheme_name,
                                    e,
                                    data._id
                                  )
                                }
                                style={{ marginRight: "10px" }}
                                color="primary"
                              />
                              <ListItemText>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center"
                                  }}
                                >
                                  <Typography
                                    style={{
                                      marginRight: "20px",
                                      fontSize: "16px"
                                    }}
                                  >
                                    {data.scheme_name}
                                  </Typography>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "12px"
                                  }}
                                >
                                  <div style={{ marginRight: "40px" }}>
                                    Interest Rate
                                    <div style={{ fontSize: "16px" }}>
                                      {data.interest_rate}
                                    </div>
                                  </div>
                                  <div style={{ marginRight: "40px" }}>
                                    {" "}
                                    Interest Type
                                    <div style={{ fontSize: "16px" }}>
                                      {data.interest_type}
                                    </div>
                                  </div>
                                  <div style={{ marginRight: "40px" }}>
                                    {" "}
                                    Penal Interest
                                    <div style={{ fontSize: "16px" }}>
                                      {data.penal_rate}
                                    </div>
                                  </div>
                                  <div style={{ marginRight: "40px" }}>
                                    Bounce Charge
                                    <div style={{ fontSize: "16px" }}>
                                      {data.bounce_charge}
                                    </div>
                                  </div>
                                  <div>
                                    Repayment Days
                                    <div style={{ fontSize: "16px" }}>
                                      {data.repayment_days}
                                    </div>
                                  </div>
                                </div>
                              </ListItemText>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : null}
                    {showInvoice ? (
                      <InputBox
                        label="Enter Invoice Number"
                        initialValue={invoiceNumber}
                        onClick={handleInvoiceNumber}
                        customClass={{
                          width: "700px",
                          height: "56px",
                          maxWidth: "none"
                        }}
                      />
                    ) : null}
                    {showNetDrawDownAmount || !isEdit ? (
                      <InputBox
                        label="Net Drawdown Amount"
                        initialValue={new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR"
                        }).format(netDrawDownAmount)}
                        isDisabled={true}
                        customClass={{
                          width: "700px",
                          height: "56px",
                          maxWidth: "none"
                        }}
                      />
                    ) : null}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "10px",
                    height: "50%"
                  }}
                >
                  <div
                    style={{
                      marginTop: "auto",
                      marginBottom: "24px",
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px"
                    }}
                  >
                    <Button
                      isDisabled={back}
                      onClick={() => {
                        setNext(false);
                      }}
                      label="Back"
                      customStyle={customButtonCss}
                      buttonType="secondary"
                    />

                    <Button
                      isDisabled={createButtonWithScheme}
                      onClick={handleSubmit}
                      label={isEdit ? "Save" : "Create"}
                      customStyle={customButtonCss}
                      buttonType="primary"
                    />
                  </div>
                </div>
              </FormPopup>
            </div>
          </>
        ) : null}
      </Grid>
      {next ? null : (
        <FormPopup
          heading={isEdit ? "Edit Drawdown Request" : "New Drawdown Request"}
          onClose={closePopupHandler}
          isOpen={setIsOpen}
          customStyles={{
            width: "fit-content",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            left: "82%"
          }}
          customHeaderStyle={{ marginBottom: "44px" }}
        >
          {alert ? (
            <AlertBox
              severity={severity}
              msg={alertMessage}
              onClose={handleAlertClose}
            />
          ) : null}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "fit-content"
              }}
            >
              {drawDownRequestUiFields.map((item, index) => {
                return (
                  <Grid
                    key={`${item.field}${index}`}
                    xs={12}
                    style={{
                      display:
                        (item.field === "repayment_days" &&
                          showProductSchemes) ||
                        (item.field === "net_drawdown_amount" &&
                          (showProductSchemes ||
                            showBankDetails ||
                            showInvoice))||
                            (item.field === "processing_fees_including_gst" &&
                           !showPf) ||
	                         (item.field === "no_of_emi" && !showNoOfEmi)||
                            (!productDetails?.cash_collateral && (item.field === "withheld_percentage"||item.field === "withheld_amount"))
                          ? "none"
                          : "flex"
                    }}
                  >
                    <div style={{ marginBottom: "32px" }}>
                      <InputBox
                        label={`${item.placeholder
                          .split("_")
                          .map((word) => {
                            const formattedWord =
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase();
                            return `${formattedWord}`;
                          })
                          .join(" ")}`}
                        isDrawdown={false}
                        type={item.type}
                        error={
                          validationData[`${item.field}State`] === "has-danger"
                        }
                        helperText={
                          validationData[`${item.field}State`] === "has-danger" ?
                            ((item.field === "withheld_percentage" && stateData?.withheld_percentage == "" ) ? item.errorMsg : ( item.field === "withheld_percentage" && stateData?.withheld_percentage <= 0) ? "Enter more than zero" :
                            (item.field === "withheld_percentage" && stateData?.withheld_percentage >= 100) ? "Enter less than 100" :
                            (item.field === "withheld_percentage" && stateData?.withheld_percentage % 1 !== 0) ? item.errorMsg :
                             item.errorMsg) : ""
                              }
                        name={item.field}
                        isDisabled={readOnly ? readOnly : item.disableDefault}
                        initialValue={stateData[item.field]}
                        onClick={(e) => change(e, item.field)}
                        customClass={{
                          width: "33.4375rem",
                          height: "56px",
                          maxWidth: "none"
                        }}
                        customInputClass={{ width: "100%" }}
                      />
                    </div>
                  </Grid>
                );
              })}
            </div>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "2.75rem",
                marginLeft: "10px",
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                height: "fit-content"
              }}
            >
              <Button
                buttonType="secondary"
                onClick={closePopupHandler}
                label="Cancel"
                customStyle={customCancelButtonCss}
              />
              <Button
                buttonType="primary"
                onClick={() => {
                  handleNext();
                }}
                isDisabled={!formValidated || createButtonWithoutScheme}
                label={button ? "Next" : "Create"}
                customStyle={customButtonCss}
              />
            </div>
          </div>
        </FormPopup>
      )}
    </>
  );
}

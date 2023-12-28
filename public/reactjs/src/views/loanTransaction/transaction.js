import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Grid, CardContent, Stack, Alert } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import moment from "moment";
// import BKTableHeader from "../../components/BKTable/BKTableHeader";
import CompanyDropdown from "../../components/Company/CompanySelect";
import ProductDropdown from "../../components/Product/ProductSelect";
import CustomDropdown from "../../components/custom/customSelect";
import BasicDatePicker from "../../components/DatePicker/basicDatePicker";
import { useSelector } from "react-redux";
// import { loanTransactionDuesTable } from "./tableProps";
import { disbursmentChannelList, txnTypeList } from "./fields";
import {
  VerifyPenalInterest,
  VerifyUpfront,
  VerifyRear,
  VerifyInterest,
  VerifyBool
} from "../../util/helper";
import { setAlert } from "../../actions/common";
import { getLoanData, addLoanTransaction } from "../../actions/clTransactions";
import { storedList } from "../../util/localstorage";
import { verifyDateAfter1800 } from "../../util/helper";

const emptyDue = {
  principal_amount: "",
  fees: "",
  subvention_fees: "",
  processing_fees: "",
  usage_fee: "",
  upfront_interest: "",
  int_value: "",
  interest_free_days: "",
  exclude_interest_till_grace_period: "",
  tenure_in_days: "",
  grace_period: "",
  overdue_charges_per_day: "",
  penal_interest: "",
  overdue_days: "",
  penal_interest_days: ""
};

const defaultErrors = {
  principalAmountError: false,
  feesError: false,
  subventionFeesError: false,
  processingFeesError: false,
  usageFeeError: false,
  upfrontInterestError: false,
  intValueError: false,
  interestFreeDaysError: false,
  excIntTillGracePeriodError: false,
  tenureinDaysError: false,
  gracePeriodError: false,
  overDueChargesPerDayError: false,
  penalInterestError: false,
  overdueDaysError: false,
  penalInterestDaysError: false,
  accountHolderNameError: false,
  bankNameError: false,
  accountNumberError: false,
  txnAmountError: false,
  txnIdError: false,
  txnRefError: false
};

export default function loanTransaction(props) {
  const dispatch = useDispatch();
  const user = storedList("user");
  const [product, setProduct] = useState("");
  const [company, setCompany] = useState("");
  const [disbursementChannel, setDisbursementChannel] = useState("");
  const [loanId, setLoanId] = useState("");
  const [borrowerId, setBorrowerId] = useState("");
  const [partnerLoanId, setPartnerLoanId] = useState("");
  const [partnerBorrowerId, setPartnerBorrowerId] = useState("");
  const [loanData, setLoanData] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDuesForm, setShowDuesForm] = useState(false);
  // loan transaction fields
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [txnType, setTxnType] = useState("");
  const [txnAmount, setTxnAmount] = useState("");
  const [txnId, setTxnId] = useState("");
  const [txnRef, setTxnRef] = useState("");
  const [txnDate, setTxnDate] = useState("");

  // transaction dues fields
  const [currentDue, setCurrentDue] = useState({
    principal_amount: "",
    fees: "",
    subvention_fees: "",
    processing_fees: "",
    usage_fee: "",
    upfront_interest: "",
    int_value: "",
    interest_free_days: "",
    exclude_interest_till_grace_period: "",
    tenure_in_days: "",
    grace_period: "",
    overdue_charges_per_day: "",
    penal_interest: "",
    overdue_days: "",
    penal_interest_days: ""
  });

  const [dues, setDues] = useState([]);
  const [errors, setErrors] = useState(defaultErrors);
  const alert = useSelector(state => state?.profile?.aleart);

  const getExistingDuesData = () => {
    const postData = {
      company_id: company.value,
      product_id: product.value,
      loan_id: loanId,
      user_id: user._id
    };
    dispatch(
      getDuesData(
        postData,
        response => {
          setCurrentDue(response.dues);
        },
        error => {
          setLoanData([]);
        }
      )
    );
  };

  const handleClear = () => {
    setLoanId("");
    setBorrowerId("");
    setPartnerLoanId("");
    setPartnerBorrowerId("");
    setAccountHolderName("");
    setBankName("");
    setAccountNumber("");
    setTxnType("");
    setTxnAmount("");
    setTxnId("");
    setTxnRef("");
    setTxnDate("");
    setLoanData("");
    setDisbursementChannel("");
    setShowForm(false);
    setShowDuesForm(false);
    setDues([]);
    setCurrentDue(emptyDue);
  };

  const fetchLoanData = () => {
    const postData = {
      company_id: company.value,
      product_id: product.value,
      loan_id: loanId,
      user_id: user._id
    };
    dispatch(
      getLoanData(
        postData,
        response => {
          if (response?.loanDetails?.stage < 3) {
            return dispatch(
              setAlert(
                false,
                "For recording transaction loan status should be disbursal_approved or disbursed",
                "error"
              )
            );
          }
          setLoanData(response);
          setLoanId(response.loanDetails.loan_id);
          setBorrowerId(response.loanDetails.borrower_id);
          setPartnerLoanId(response.loanDetails.partner_loan_id);
          setPartnerBorrowerId(response.loanDetails.partner_borrower_id);
          setShowForm(true);
        },
        error => {
          dispatch(
            setAlert(false, error?.response?.data?.message || "Error", "error")
          );
        }
      )
    );
  };

  const handleSearch = () => {
    if (loanId === "" && !company && !product)
      return dispatch(
        setAlert(
          false,
          "Please Enter some search criteria and try again",
          "error"
        )
      );
    if (!company)
      return dispatch(setAlert(false, "Please select company", "error"));
    if (loanId === "")
      return dispatch(setAlert(false, "Please enter  loan id", "error"));
    if (!product)
      return dispatch(setAlert(false, "Please select product", "error"));
    handleClear();
    fetchLoanData();
  };

  const setCurrentDueData = event => {
    currentDue[event.target.name] = event.target.value;
    const dueToUpdate = { ...currentDue, ...currentDue };
    setCurrentDue(dueToUpdate);
  };

  const validateDues = () => {
    if (currentDue.principal_amount === "") {
      setErrors({ ...defaultErrors, principalAmountError: true });
      return false;
    }
    if (currentDue.interest_free_days === "") {
      setErrors({ ...defaultErrors, interestFreeDaysError: true });
      return false;
    }
    if (currentDue.tenure_in_days === "") {
      setErrors({ ...defaultErrors, tenureinDaysError: true });
      return false;
    }
    if (currentDue.grace_period === "") {
      setErrors({ ...defaultErrors, gracePeriodError: true });
      return false;
    }
    if (currentDue.overdue_days === "") {
      setErrors({ ...defaultErrors, overdueDaysError: true });
      return false;
    }
    if (currentDue.penal_interest_days === "") {
      setErrors({ ...defaultErrors, penalInterestDaysError: true });
      return false;
    }
    if (VerifyPenalInterest(currentDue.fees) === false) {
      setErrors({ ...defaultErrors, feesError: true });
      return false;
    } else if (VerifyPenalInterest(currentDue.subvention_fees) === false) {
      setErrors({ ...defaultErrors, subventionFeesError: true });
      return false;
    } else if (VerifyPenalInterest(currentDue.processing_fees) === false) {
      setErrors({ ...defaultErrors, processingFeesError: true });
      return false;
    } else if (VerifyPenalInterest(currentDue.usage_fee) === false) {
      setErrors({ ...defaultErrors, usageFeeError: true });
      return false;
    } else if (VerifyUpfront(currentDue.upfront_interest) === false) {
      setErrors({ ...defaultErrors, upfrontInterestError: true });
      return false;
    } else if (VerifyInterest(currentDue.int_value) === false) {
      setErrors({ ...defaultErrors, intValueError: true });
      return false;
    } else if (
      VerifyBool(currentDue.exclude_interest_till_grace_period) === false
    ) {
      setErrors({ ...defaultErrors, excIntTillGracePeriodError: true });
      return false;
    } else if (VerifyRear(currentDue.overdue_charges_per_day) === false) {
      setErrors({ ...defaultErrors, overDueChargesPerDayError: true });
      return false;
    } else if (VerifyRear(currentDue.penal_interest) === false) {
      setErrors({ ...defaultErrors, penalInterestError: true });
      return false;
    } else if (
      !currentDue.principal_amount ||
      currentDue.subvention_fees === "" ||
      currentDue.upfront_interest === "" ||
      currentDue.interest_free_days === "" ||
      currentDue.tenure_in_days === "" ||
      currentDue.exclude_interest_till_grace_period === "" ||
      currentDue.grace_period === "" ||
      currentDue.overdue_days === "" ||
      currentDue.penal_interest_days === ""
    ) {
      dispatch(
        setAlert(false, "all fields of the due element are required.", "error")
      );
      return false;
    } else {
      return true;
    }
  };

  const validateTranscation = () => {
    if (!txnType?.value) {
      dispatch(setAlert(false, "Please select transaction type", "error"));
      return false;
    } else if (accountHolderName === "") {
      setErrors({ ...defaultErrors, accountHolderNameError: true });
      return false;
    } else if (txnDate === "") {
      dispatch(setAlert(false, "Please select transaction date", "error"));
      return false;
    } else if (txnId === "") {
      setErrors({ ...defaultErrors, txnIdError: true });
      return false;
    } else if (txnRef === "") {
      setErrors({ ...defaultErrors, txnRefError: true });
      return false;
    } else if (txnAmount === "") {
      setErrors({ ...defaultErrors, txnAmountError: true });
      return false;
    } else if (disbursementChannel.value === "ad hoc" && accountNumber === "") {
      setErrors({ ...defaultErrors, accountNumberError: true });
      return false;
    } else if (disbursementChannel.value === "ad hoc" && bankName === "") {
      setErrors({ ...defaultErrors, bankNameError: true });
      return false;
    } else {
      return true;
    }
  };

  const handleAddDue = () => {
    if (JSON.stringify(emptyDue) === JSON.stringify(currentDue)) {
      return dispatch(setAlert(false, "Due should not be empty", "error"));
    }
    if (validateDues(currentDue)) {
      dues.push(currentDue);
      const dueToInsert = emptyDue;
      setCurrentDue(dueToInsert);
      setDues(dues);
      getExistingDuesData();
    }
  };

  const handleDeleteDueRecord = index => {
    const remainingDues = dues.splice(index, 1);
    setDues(dues);
  };

  const handleRecordTransaction = () => {
    if (validateTranscation()) {
      const companyData =
        user.type === "company"
          ? { value: user.usercompany, label: user.usercompanyname }
          : company;

      const postData = {
        userData: {
          company_id: companyData.value,
          product_id: product.value,
          loan_id: loanId,
          user_id: user._id
        },
        submitData: [
          {
            partner_loan_id: partnerLoanId,
            partner_borrower_id: partnerBorrowerId,
            loan_id: loanId,
            borrower_id: borrowerId,
            ac_holder_name: accountHolderName,
            txn_id: txnId,
            txn_amount: txnAmount,
            txn_date: moment(txnDate).format("YYYY-MM-DD"),
            txn_reference: txnRef,
            label: txnType?.value,
            disbursement_channel: disbursementChannel.value,
            bank_name: bankName ? bankName : "",
            account_number: accountNumber ? accountNumber : "",
            dues: dues ? dues : []
          }
        ]
      };
      if (!postData.submitData[0].dues.length) {
        delete postData.submitData[0].dues;
      }
      dispatch(
        addLoanTransaction(
          postData,
          response => {
            dispatch(setAlert(false, response.message, "success"));
            handleClear();
          },
          error => {
            dispatch(setAlert(false, error.response.data.message, "error"));
          }
        )
      );
    }
  };

  const handleChangeCompany = value => {
    if (!value) {
      setProduct(null);
      value = "";
    }
    setCompany(value);
  };

  const handleChangeDisbursementChannel = value => {
    if (!value) {
      value = "";
    }
    setDisbursementChannel(value);
  };

  const deleteDues = index => {
    const duesToDelete = JSON.parse(JSON.stringify(dues));
    duesToDelete.splice(index, 1);
    setDues(duesToDelete);
  };

  const handleClearAleart = () => {
    dispatch(setAlert(false, "", ""));
  };

  if (alert.message !== "" && alert.message !== undefined) {
    setTimeout(handleClearAleart, 4000);
  }

  const handleSetTxnAmountError = value => {
    if (value == 0) {
      setTxnAmount(value);
      return setErrors({ ...defaultErrors, txnAmountError: true });
    }
    if (value >= 1) {
      setTxnAmount(value);
      return setErrors({ ...defaultErrors, txnAmountError: false });
    }
  };

  return (
    <>
      {alert.message !== "" && alert.message !== undefined ? (
        <Stack
          lg={{
            width: "80%"
          }}
          justifyContent="center"
          alignItems="center"
        >
          <Alert severity={alert?.type} onClose={() => handleClearAleart()}>
            {alert?.message}
          </Alert>
        </Stack>
      ) : null}
      <CardContent>
        <Grid xs={12} sx={{ margin: "10px 0" }}>
          <Grid xs={12} container spacing={1}>
            <Grid xs={2} item sx={{ margin: "10px 0" }}>
              <CompanyDropdown
                placeholder="Select company"
                company={company}
                onCompanyChange={value => handleChangeCompany(value)}
              />
            </Grid>
            <Grid xs={2} item sx={{ margin: "10px 0" }}>
              <ProductDropdown
                placeholder="Select product"
                onProductChange={value => {
                  setProduct(value);
                }}
                company={company}
                product={product}
              />
            </Grid>
            <Grid xs={2} sx={{ margin: "10px 0" }} item>
              <CustomDropdown
                placeholder="Select channel"
                data={disbursmentChannelList}
                value={disbursementChannel}
                handleDropdownChange={value => {
                  handleChangeDisbursementChannel(value);
                }}
              />
            </Grid>
            <Grid xs={3} item sx={{ margin: "10px 0" }}>
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <TextField
                  variant="standard"
                  label="Loan id"
                  type="text"
                  value={loanId}
                  onChange={e => {
                    setLoanId(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={3} item sx={{ margin: "10px 0" }}>
              <IconButton
                aria-label="access-token"
                size="large"
                onClick={() => {
                  handleSearch();
                }}
              >
                <ManageSearchIcon />
              </IconButton>
            </Grid>
          </Grid>
          {showForm ? (
            <Grid>
              <Grid xs={12}>
                <Divider textAlign="left" />
                <Typography
                  variant="h6"
                  display="block"
                  sx={{
                    fontWeight: "bold"
                  }}
                >
                  Record Transaction
                </Typography>
              </Grid>

              <Grid xs={12} sx={{ margin: "10px 0" }} container spacing={1}>
                <Grid xs={2} item sx={{ margin: "10px 0" }}>
                  <CustomDropdown
                    placeholder="Txn type"
                    data={txnTypeList}
                    value={txnType}
                    handleDropdownChange={value => {
                      setTxnType(value);
                    }}
                  />
                </Grid>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Account holder name"
                      type="text"
                      value={accountHolderName}
                      onChange={e => {
                        setAccountHolderName(e.target.value);
                      }}
                      error={errors.accountHolderNameError}
                      helperText={
                        errors.accountHolderNameError
                          ? "Account holder name is required"
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>

                {disbursementChannel.value === "ad hoc" ? (
                  <Grid xs={3} item sx={{ margin: "10px 0" }}>
                    <FormControl
                      sx={{ m: 1, width: "100%" }}
                      variant="standard"
                    >
                      <TextField
                        variant="standard"
                        label="Bank name"
                        type="text"
                        value={bankName}
                        onChange={e => {
                          setBankName(e.target.value);
                        }}
                        error={errors.bankNameError}
                        helperText={
                          errors.bankNameError ? "Bank name is required" : ""
                        }
                      />
                    </FormControl>
                  </Grid>
                ) : null}
                {disbursementChannel.value === "ad hoc" ? (
                  <Grid xs={3} item sx={{ margin: "10px 0" }}>
                    <FormControl
                      sx={{ m: 1, width: "100%" }}
                      variant="standard"
                    >
                      <TextField
                        variant="standard"
                        label="Account Number"
                        type="text"
                        value={accountNumber}
                        onChange={e => {
                          setAccountNumber(e.target.value);
                        }}
                        error={errors.accountNumberError}
                        helperText={
                          errors.accountNumberError
                            ? "Account number is required"
                            : ""
                        }
                      />
                    </FormControl>
                  </Grid>
                ) : null}
              </Grid>
              <Grid xs={12} sx={{ margin: "10px 0" }} container spacing={1}>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Txn amount"
                      type="number"
                      value={txnAmount}
                      onChange={e => {
                        handleSetTxnAmountError(e.target.value);
                      }}
                      error={errors.txnAmountError}
                      helperText={
                        errors.txnAmountError
                          ? "Txn amount is required or can not be 0."
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Txn Id"
                      type="text"
                      value={txnId}
                      onChange={e => {
                        setTxnId(e.target.value);
                      }}
                      error={errors.txnIdError}
                      helperText={errors.txnIdError ? "Txn id is required" : ""}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Txn Ref"
                      type="text"
                      value={txnRef}
                      onChange={e => {
                        setTxnRef(e.target.value);
                      }}
                      error={errors.txnRefError}
                      helperText={
                        errors.txnRefError ? "Txn ref is required" : ""
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <BasicDatePicker
                    placeholder="Txn date"
                    value={txnDate}
                    onDateChange={date => {
                      setTxnDate(
                        verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                          ? moment(date).format("YYYY-MM-DD")
                          : date
                      );
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </Grid>

        <Grid xs={12} sx={{ margin: "10px 0" }}>
          {showDuesForm ? (
            <Grid>
              <Grid xs={12}>
                <Typography
                  variant="h6"
                  display="block"
                  sx={{
                    fontWeight: "bold"
                  }}
                >
                  Record Transaction Dues
                </Typography>
              </Grid>
              <Grid xs={12} container spacing={1}>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Principal amount"
                      name="principal_amount"
                      type="number"
                      value={currentDue.principal_amount}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.principalAmountError}
                      helperText={
                        errors.principalAmountError
                          ? "Principal amount id required"
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Fees i.e (0.02UA | 0.02UP | 0.02RP | 0.02RA)"
                      name="fees"
                      type="text"
                      value={currentDue.fees}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.feesError}
                      helperText={
                        errors.feesError ? "please enter valid fees" : ""
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Subvention fees i.e (0.02UA | 0.02UP | 0.02RP | 0.02RA)"
                      name="subvention_fees"
                      type="text"
                      value={currentDue.subvention_fees}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.subventionFeesError}
                      helperText={
                        errors.subventionFeesError
                          ? "Please enter valid subvention fees"
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Processing fees i.e (0.02UA | 0.02UP | 0.02RP | 0.02RA)"
                      name="processing_fees"
                      type="text"
                      value={currentDue.processing_fees}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.processingFeesError}
                      helperText={
                        errors.processingFeesError
                          ? "Please enter valid Processing fees"
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid xs={12} container spacing={1}>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Usage fee i.e (0.02UA | 0.02UP | 0.02RP | 0.02RA)"
                      name="usage_fee"
                      type="text"
                      value={currentDue.usage_fee}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.usageFeeError}
                      helperText={
                        errors.usageFeeError
                          ? "Please enter valid usage fee"
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Upfront interest i.e (0.02UA | 0.02UP )"
                      name="upfront_interest"
                      type="text"
                      value={currentDue.upfront_interest}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.upfrontInterestError}
                      helperText={
                        errors.upfrontInterestError
                          ? "Please enter valid upfront interest"
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Interest value i.e (0.02P | 0.02A)"
                      name="int_value"
                      type="text"
                      value={currentDue.int_value}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.intValueError}
                      helperText={
                        errors.intValueError
                          ? "Please enter valid int value"
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Interest free days i.e 20"
                      name="interest_free_days"
                      type="number"
                      value={currentDue.interest_free_days}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.interestFreeDaysError}
                      helperText={
                        errors.interestFreeDaysError
                          ? "Interest free days are required."
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid xs={12} container spacing={1}>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="exclude_interest_till_grace_period i.e true | false"
                      name="exclude_interest_till_grace_period"
                      type="text"
                      value={currentDue.exclude_interest_till_grace_period}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.excIntTillGracePeriodError}
                      helperText={
                        errors.excIntTillGracePeriodError
                          ? "Exclude interest till grace period is required."
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Tenure in days i.e 10"
                      name="tenure_in_days"
                      type="number"
                      value={currentDue.tenure_in_days}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.tenureinDaysError}
                      helperText={
                        errors.tenureinDaysError
                          ? "Tenure in days is required."
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Grace period i.e 10"
                      name="grace_period"
                      type="number"
                      value={currentDue.grace_period}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.gracePeriodError}
                      helperText={
                        errors.gracePeriodError
                          ? "Grace period is required."
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Overdue charges per day i.e (0.02RP|0.02RA)"
                      name="overdue_charges_per_day"
                      type="text"
                      value={currentDue.overdue_charges_per_day}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.overDueChargesPerDayError}
                      helperText={
                        errors.overDueChargesPerDayError
                          ? "Please enter valid overdue charges per day."
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid xs={12} container spacing={1}>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Penal interest i.e (0.02RP | 0.02RA)"
                      name="penal_interest"
                      type="text"
                      value={currentDue.penal_interest}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.penalInterestError}
                      helperText={
                        errors.penalInterestError
                          ? "Please enter valid penal interest."
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Overdue days i.e 20"
                      name="overdue_days"
                      type="number"
                      value={currentDue.overdue_days}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.overdueDaysError}
                      helperText={
                        errors.overdueDaysError
                          ? "Overdue days are required."
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={3} item sx={{ margin: "10px 0" }}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    <TextField
                      variant="standard"
                      label="Penal interest days i.e 10"
                      name="penal_interest_days"
                      type="number"
                      value={currentDue.penal_interest_days}
                      onChange={event => {
                        setCurrentDueData(event);
                      }}
                      error={errors.penalInterestDaysError}
                      helperText={
                        errors.penalInterestDaysError
                          ? "Penal interest days are required."
                          : ""
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          ) : null}
          <Grid container xs={6}>
            {showForm ? (
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  onClick={handleRecordTransaction}
                  sx={{
                    color: "#fff"
                  }}
                >
                  Submit
                </Button>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
}

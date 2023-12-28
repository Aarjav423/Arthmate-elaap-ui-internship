import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import moment from "moment";
import BasicDatePicker from "../../components/BKDatePicker/basicDatePicker";
import BKTableHeader from "../../components/BKTable/BKTableHeader";
import CustomDropdown from "../../components/custom/customSelect";
import { emiDues, duesTable } from "./tableProps";
import { storedList } from "../../util/localstorage";
import {
  getLoanData,
  getDuesData,
  addMakeLoan
} from "../../actions/clTransactions";
import { verifyDateAfter1800 } from "../../util/helper";

const style = {
  position: "absolute",
  top: "5%",
  left: "10%",
  overflow: "scroll",
  height: "100%",
  display: "block",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

export default function MakeLoan(props) {
  const { isOpen, setAlert, records, details, handleClose } = props;
  const user = storedList("user");
  const dispatch = useDispatch();
  const [loanId, setLoanId] = useState("");
  const [borrowerId, setBorrowerId] = useState("");
  const [partnerLoanId, setPartnerLoanId] = useState("");
  const [partnerBorrowerId, setPartnerBorrowerId] = useState("");
  const [loanData, setLoanData] = useState("");
  const [txnIds, setTxnIds] = useState([]);

  const [emiOption, setEmiOption] = useState("");
  const [emiArray, setEmiArray] = useState([]);
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
  const [addCustomDue, setAddCustomDue] = useState(false);

  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [txnType, setTxnType] = useState("");
  const [txnAmount, setTxnAmount] = useState("");
  const [txnId, setTxnId] = useState("");
  const [txnRef, setTxnRef] = useState("");
  const [txnDate, setTxnDate] = useState("");

  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);

  const getCustomDuesData = () => {
    const postData = {
      company_id: details.company_id,
      product_id: details.product_id,
      loan_id: records[0].loan_id,
      user_id: details.user_id
    };
    dispatch(
      getDuesData(
        postData,
        response => {
          if (!response) {
            return dispatch(setAlert(false, "No records found  ", "error"));
          }
          setCurrentDue(response.dues);
        },
        error => {
          dispatch(setAlert(false, error.response.data.message, "error"));
          setLoanData([]);
        }
      )
    );
  };

  const fetchLoanData = () => {
    const postData = {
      company_id: details.company_id,
      product_id: details.product_id,
      loan_id: records[0].loan_id,
      user_id: details.user_id
    };
    dispatch(
      getLoanData(
        postData,
        response => {
          setLoanData(response);
          setLoanId(response.data.loan_id);
          setBorrowerId(response.data.borrower_id);
          setPartnerLoanId(response.data.partner_loan_id);
          setPartnerBorrowerId(response.data.partner_borrower_id);
          getCustomDuesData();
        },
        error => {
          dispatch(setAlert(false, error.response.data.message, "error"));
        }
      )
    );
  };

  const resetSearchBoxes = () => {
    setPartnerLoanId("");
    setPartnerBorrowerId("");
    setLoanId("");
    setBorrowerId("");
    setAccountHolderName("");
    setTxnId("");
    setTxnAmount("");
    setTxnDate("");
    setTxnRef("");
    setDues([]);
    setEmiArray([]);
    setCurrentDue({
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
  };

  useEffect(() => {
    let amount = 0;
    records.forEach((item, index) => {
      amount += parseFloat(item.txn_amount);
    });
    const ids = records.map(item => item.txn_id);
    setTxnAmount(amount.toFixed(2));
    setAccountHolderName(records[0].ac_holder_name);
    setTxnIds(ids);
    fetchLoanData();
  }, []);

  const generateEmi = value => {
    setAddCustomDue(false);
    setEmiOption(value);
    setDues([]);
    const emiArrays = [];
    setEmiArray([]);
    for (let i = 0; i < value.value; i += 1) {
      const emiObj = currentDue;
      emiObj.principal_amount = parseFloat(txnAmount / value.value).toFixed(2);
      emiArrays.push(emiObj);
    }
    setEmiArray(emiArrays);
  };

  const submitMakeLoanData = () => {
    if (!dues.length && !emiArray.length) {
      return dispatch(
        setAlert(false, "at least one due is required.", "error")
      );
    }
    const data = {
      userData: {
        company_id: details.company_id,
        product_id: details.product_id,
        user_id: details.user_id
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
          label: "usage",
          dues: dues.length ? dues : emiArray.length ? emiArray : [],
          txn_ids: txnIds ? txnIds : []
        }
      ]
    };
    dispatch(
      addMakeLoan(
        data,
        response => {
          if (!response) {
            return dispatch(
              setAlert(false, "Error while adding  usage emi data.", "error")
            );
          }

          if (response) {
            setEmiArray([]);
            setDues([]);
            handleClose(true);
            resetSearchBoxes();
            return dispatch(setAlert(false, response.message, "success"));
          }
        },
        error => {
          setLoanData([]);
          dispatch(setAlert(false, error.response.data.message, "error"));
        }
      )
    );
  };

  const handleSubmitEmi = () => {
    if (
      accountHolderName === "" ||
      txnId === "" ||
      txnAmount === "" ||
      txnDate === "" ||
      txnRef === ""
    ) {
      return dispatch(setAlert(false, "All fields are required", "error"));
    } else {
      submitMakeLoanData();
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        size="lg"
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid sx={style}>
          <Grid xs={12}>
            <Typography
              variant="h6"
              display="block"
              sx={{
                fontWeight: "bold"
              }}
            >
              Make Loan Form
            </Typography>
            <Divider textAlign="left" />
          </Grid>
          <Grid xs={12} container spacing={1}>
            <Grid xs={3} item>
              Loan id : {loanId}
            </Grid>
            <Grid xs={3} item>
              Borrower id : {borrowerId}
            </Grid>
            <Grid xs={3} item>
              Partner loan id : {partnerLoanId}
            </Grid>
            <Grid xs={3} item>
              Partner borrower id : {partnerBorrowerId}
            </Grid>
          </Grid>

          <Grid xs={12} sx={{ margin: "10px 0" }} container spacing={1}>
            <Grid xs={3} item>
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <TextField
                  variant="standard"
                  label="Account holder name"
                  type="text"
                  value={accountHolderName}
                  onChange={e => {
                    setAccountHolderName(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={3} item>
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <TextField
                  variant="standard"
                  label="Txn Id"
                  type="text"
                  value={txnId}
                  onChange={e => {
                    setTxnId(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={3} item>
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
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
              </FormControl>
            </Grid>
          </Grid>

          <Grid xs={12} sx={{ margin: "10px 0" }} container spacing={1}>
            <Grid xs={3} item>
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <TextField
                  variant="standard"
                  label="Txn Ref"
                  type="text"
                  value={txnRef}
                  onChange={e => {
                    setTxnRef(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={3} item>
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <TextField
                  variant="standard"
                  label="Txn amount"
                  type="number"
                  value={txnAmount}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid xs={3} item>
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <TextField
                  variant="standard"
                  label="Txn type"
                  type="string"
                  value="usage"
                  disabled
                />
              </FormControl>
            </Grid>
          </Grid>

          <Divider textAlign="left" />
          <Grid xs={6} sx={{ margin: "10px 0" }} container spacing={1}>
            <Grid xs={3} item>
              <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                <CustomDropdown
                  style={{ marginLeft: "120px" }}
                  placeholder="Select EMI"
                  data={emiDues}
                  value={emiOption}
                  handleDropdownChange={value => generateEmi(value)}
                />
              </FormControl>
            </Grid>
          </Grid>

          {emiArray && emiArray.length ? (
            <Grid>
              <Grid sx={{ mt: 2 }} xs={12}>
                <TableContainer>
                  <Table style={{ width: "100%" }}>
                    <BKTableHeader headers={duesTable} />
                    <TableBody>
                      {emiArray?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell
                            component="td"
                            align="left"
                            sx={{ width: "20%" }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell align="left">
                            {row.principal_amount}
                          </TableCell>
                          <TableCell align="left">{row.fees}</TableCell>
                          <TableCell align="left">
                            {row.subvention_fees}
                          </TableCell>
                          <TableCell align="left">
                            {row.processing_fees}
                          </TableCell>
                          <TableCell align="left">{row.usage_fee}</TableCell>
                          <TableCell align="left">
                            {row.upfront_interest}
                          </TableCell>
                          <TableCell align="left">{row.int_value}</TableCell>
                          <TableCell align="left">
                            {row.interest_free_days}
                          </TableCell>
                          <TableCell align="left">
                            {row.exclude_interest_till_grace_period}
                          </TableCell>
                          <TableCell align="left">
                            {row.tenure_in_days}
                          </TableCell>
                          <TableCell align="left">{row.grace_period}</TableCell>
                          <TableCell align="left">
                            {row.overdue_charges_per_day}
                          </TableCell>
                          <TableCell align="left">
                            {row.penal_interest}
                          </TableCell>
                          <TableCell align="left">{row.overdue_days}</TableCell>
                          <TableCell align="left">
                            {row.penal_interest_days}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid container sx={{ mt: 3 }} xs={6}>
                <Grid item xs={3}>
                  <Button
                    variant="contained"
                    onClick={handleSubmitEmi}
                    sx={{
                      color: "#fff"
                    }}
                  >
                    Submit Emi
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </Modal>
    </div>
  );
}

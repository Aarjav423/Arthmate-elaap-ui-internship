import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SummarizeSharpIcon from "@mui/icons-material/SummarizeSharp";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import moment from "moment";
import BKTableHeader from "../../components/BKTable/BKTableHeader";
import BasicFilter from "../../components/BKFilter/basic";
import { setAlert } from "../../actions/common";
import { storedList } from "../../util/localstorage";
import { getLoanTransactionData } from "../../actions/clTransactions";
import { loanTransactionTable, txnStage } from "./tableProps";
import CustomDue from "./customDue";
import MakeLoan from "./makeLoan";
import { downloadDataInXLSXFormat } from "../../util/helper";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const txnStageObject = {
  Initiated: "01",
  Cancel: "02",
  Rejected: "03",
  Process: "04",
  Success: "05",
  Reconciled: "06",
  "Clubbed-Loan": "07",
  "Loan-Booked": "08",
};

const txtStatusColors = {
  "01": "#b3d1ff",
  "02": "#eeccff",
  "03": "#b3b3ff",
  "04": "#ffecb3",
  "05": "#ecd7c6",
  "06": "#e6ffe6",
  "07": "#ccf2ff",
  "08": "#c6ebc6",
};

export default function loanTransactionLedger(props) {
  const [filter, setFilter] = useState("");
  const [loanTransactions, setLoanTransactions] = useState("");
  const [showCustomDue, setShowCustomDue] = useState(false);
  const [customDueFilter, setCustomDueFilter] = useState({});
  const [showMakeLoanButton, setShowMakeLoanButton] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedArray, setCheckedArray] = useState([]);

  const [loanData, setLoanData] = useState({});
  const [makeLoanForm, setMakeLoanForm] = useState(false);

  const user = storedList("user");
  const dispatch = useDispatch();

  const fetchLoanTransactions = () => {
    filter.user_id = user._id;
    dispatch(
      getLoanTransactionData(
        filter,
        (response) => {
          setLoanTransactions(response.data);
        },
        (error) => {
          dispatch(setAlert(false, error.response.data.message, "error"));
        }
      )
    );
  };

  useEffect(() => {
    if (filter) {
      fetchLoanTransactions();
    }
  }, [filter]);

  useEffect(() => {
    const { company_id, product_id, str, from_date, to_date } = filter;
    const a = moment(to_date);
    const toDatemonth = a.format("M");
    const b = moment(from_date);
    const fromDatemonth = b.format("M");
    const daysDifference = a.diff(b, "days");
    const checkEqualMonths = fromDatemonth === toDatemonth;
    if (
      company_id &&
      product_id &&
      str &&
      from_date &&
      to_date &&
      checkEqualMonths &&
      checkedArray.length
    ) {
      setShowMakeLoanButton(true);
    } else {
      setShowMakeLoanButton(false);
    }
  }, [checkedArray, filter]);

  const onSearchClick = (data) => {
    setCheckedArray([]);
    setLoanTransactions([]);
    setFilter({
      company_id: data.partner.value,
      product_id: data.product.value,
      from_date: data.fromDate,
      to_date: data.toDate,
      str: data.searchText,
    });
  };

  const getCustomDues = (record) => {
    const filterData = {
      company_id: record.company_id || "",
      product_id: record.product_id || "",
      txn_id: record.txn_id || "",
      loan_id: record.loan_id || "",
    };
    setCustomDueFilter(filterData);
    setShowCustomDue(true);
  };

  const handleCustomDueClose = () => {
    setShowCustomDue(false);
  };

  const handleSelectCheckbox = (
    event,
    txn_id,
    txn_amount,
    index,
    id,
    txn_stage,
    upfront_deducted_charges,
    loanId
  ) => {
    const recordsChecked = JSON.parse(JSON.stringify(checkedArray));
    const item = loanTransactions[index];
    item.check = event.target.checked ? true : false;
    loanTransactions.index = item;
    setLoanTransactions(loanTransactions);
    if (event.target.checked === true) {
      recordsChecked.push({
        txn_id,
        txn_amount,
        checked: event.target.checked,
        id,
        loan_id: loanId,
        ac_holder_name: loanTransactions[0].ac_holder_name,
        txn_stage,
        upfront_deducted_charges,
      });
    } else if (event.target.checked === false) {
      const arrayindex = checkedArray.findIndex((i) => i.txn_id === txn_id);
      recordsChecked.splice(arrayindex, 1);
    }
    setCheckedArray(recordsChecked);
  };

  const handleMakeLoan = () => {
    const sampleArray = checkedArray.filter((item) => item.txn_stage !== "01");
    if (sampleArray.length) {
      return dispatch(
        setAlert(false, "some txn_ids are not in Initiated stage", "error")
      );
    }
    const Data = {
      user_id: user._id,
      company_id: filter.company_id || "",
      product_id: filter.product_id || "",
    };
    const dataToSet = Data;
    setLoanData(dataToSet);
    setMakeLoanForm(true);
    setShowCustomDue(false);
  };

  const handlemakeLoanClose = (refreshData) => {
    setMakeLoanForm(false);
    setCheckedArray([]);
    setLoanTransactions([]);
    fetchLoanTransactions();
  };

  const datamanipulation = (Data) => {
    const array = [];
    Data.map((ele) =>
      array.push({
        loan_id: ele.loan_id,
        borrower_id: ele.borrower_id,
        partner_borrower_id: ele.partner_borrower_id,
        partner_loan_id: ele.partner_loan_id,
        ac_holder_name: ele.ac_holder_name,
        txn_amount: ele.txn_amount,
        txn_date: ele.txn_date,
        txn_reference: ele.txn_reference,
        txn_id: ele.txn_id,
        type: ele.type,
        tenure_in_days: ele.tenure_in_days,
        final_disburse_amount: ele.final_disburse_amt,
        upfront_interest: ele.upfront_interest,
        upfront_fees: ele.upfront_fees,
        upfront_processing_fees: ele.upfront_processing_fees,
        upfront_usage_fee: ele.upfront_usage_fee,
        upfront_charges: ele.upfront_deducted_charges,
        rear_ended_fees: ele.payable_fees,
        rear_ended_processing_fees: ele.payable_processing_fees,
        rear_ended_usage_fee: ele.payable_usage_fee,
        rear_ended_charges: ele.charges_payable,
        interest_payable: ele.interest_payable,
        penal_interest: ele.penal_interest,
        overdue_charges: ele.overdue_charges,
        subvention_fees: ele.subvention_fees,
        interest_free_days: ele.interest_free_days,
        exclude_interest_till_grace_period:
          ele.exclude_interest_till_grace_period,
        disburse_amount: ele.final_disburse_amt,
        total_outstanding: ele.total_outstanding,
        due_date: ele.due_date,
        int_value: ele.int_value,
        grace_period: ele.grace_period,
        txn_stage: Object.keys(txnStageObject).filter((key) => {
          return txnStageObject[key] === ele.txn_stage;
        })[0],
      })
    );
    return downloadDataInXLSXFormat("loan_transaction_data", array);
  };

  const DownloadExcelData = () => {
    const { str, from_date, to_date, company_id, product_id } = filter;
    if (moment(to_date).diff(moment(from_date), "days") > 180) {
      return dispatch(
        setAlert(
          false,
          "Difference between to date and from date should be less than or equal to 180",
          "error"
        )
      );
    }
    if (
      moment(to_date).format("YYYY-MM-DD") >=
      moment().add("days", 1).format("YYYY-MM-DD")
    ) {
      return dispatch(
        setAlert(
          false,
          "To date  should be less than or equal to current date",
          "error"
        )
      );
    }
    const postData = {
      company_id: user.type === "company" ? user.usercompany : company_id,
      product_id,
      from_date,
      to_date,
      loan_id: str,
      user_id: user._id,
      limit: 0,
      offset: 0,
    };
    dispatch(
      getLoanTransactionData(
        postData,
        (response) => {
          if (!response.data.length) {
            return dispatch(setAlert(false, "No records found", "error"));
          }
          datamanipulation(response.data);
        },
        (error) => {
          return dispatch(
            setAlert(false, error.response.data.message, "error")
          );
        }
      )
    );
  };

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Grid xs={12} sx={{ margin: "10px 0" }}>
          <Grid xs={12}>
            <BasicFilter
              onSearchClick={onSearchClick}
              mandatoryFields={{
                partner: true,
                product: true,
                fromDate: true,
                toDate: true,
              }}
            />
          </Grid>
          {makeLoanForm ? (
            <MakeLoan
              isOpen={makeLoanForm}
              setAlert={setAlert}
              records={checkedArray}
              details={loanData}
              handleClose={handlemakeLoanClose}
            />
          ) : null}
          {showCustomDue ? (
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "100vh" }}
            >
              <Grid item xs={12}>
                <CustomDue
                  isOpen={showCustomDue}
                  records={customDueFilter}
                  handleClose={handleCustomDueClose}
                />
              </Grid>
            </Grid>
          ) : null}
          <Grid container xs={6}>
            {loanTransactions && loanTransactions.length ? (
              <Grid item xs={1}>
                <Tooltip title="Download data" placement="top" arrow>
                  <IconButton
                    size="large"
                    aria-label="download loan transaction data"
                    color="info"
                    onClick={DownloadExcelData}
                    sx={{
                      fontSize: 40,
                    }}
                  >
                    <DownloadForOfflineIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            ) : null}
            {showMakeLoanButton ? (
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  onClick={handleMakeLoan}
                  sx={{
                    padding: "8.3px 20px",
                    position: "flex",
                    mt: 2,
                    color: "#fff",
                  }}
                >
                  Make Loan
                </Button>
              </Grid>
            ) : null}
          </Grid>
          {loanTransactions && loanTransactions.length ? (
            <Grid sx={{ mt: 2 }} xs={12}>
              <TableContainer>
                <Table style={{ width: "100%" }}>
                  <BKTableHeader headers={loanTransactionTable} />
                  <TableBody>
                    {loanTransactions?.map((row, index) => (
                      <TableRow
                        sx={{
                          background: txtStatusColors[row.txn_stage],
                        }}
                        key={index}
                      >
                        <TableCell
                          component="td"
                          align="left"
                          sx={{ width: "20%" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell align="left">{row.company_name}</TableCell>
                        <TableCell align="left">{row.loan_id}</TableCell>
                        <TableCell align="left">{row.txn_id}</TableCell>
                        <TableCell align="left">{row.type}</TableCell>
                        <TableCell align="left">{row.txn_amount}</TableCell>
                        <TableCell align="left">{row.txn_date}</TableCell>
                        <TableCell align="left">{row.txn_stage}</TableCell>
                        <TableCell align="left">
                          {row.disbursement_channel}
                        </TableCell>
                        <TableCell align="left">
                          {row.custom_due === "1" ? (
                            <Tooltip title="Custom due" placement="top" arrow>
                              <IconButton
                                aria-label="custom due"
                                onClick={() => {
                                  getCustomDues(row);
                                }}
                              >
                                <SummarizeSharpIcon fontSize="medium" />
                              </IconButton>
                            </Tooltip>
                          ) : null}
                        </TableCell>

                        <TableCell align="left">
                          {row.txn_entry === "dr" &&
                          row.custom_due !== "1" &&
                          (row.txn_stage === "05" || row.txn_stage === "01") ? (
                            <Checkbox
                              checked={row.check}
                              onChange={(event) => {
                                handleSelectCheckbox(
                                  event,
                                  row.txn_id,
                                  row.txn_amount,
                                  index,
                                  row._id,
                                  row.txn_stage,
                                  row.upfront_deducted_charges,
                                  row.loan_id
                                );
                              }}
                              value="primary"
                              name={row._id.toString()}
                              disabled={
                                row.txn_stage === "05" || row.txn_stage === "01"
                                  ? false
                                  : true
                              }
                              inputProps={{
                                "aria-label": "primary checkbox",
                              }}
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  borderColor: "#000",
                                },
                              }}
                            />
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ) : null}
        </Grid>
      </DashboardLayout>
    </>
  );
}

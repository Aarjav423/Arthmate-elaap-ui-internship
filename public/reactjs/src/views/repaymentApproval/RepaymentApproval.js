import * as React from "react";
import Grid from "@mui/material/Grid";
import CompanyDropdown from "../../components/Company/CompanySelect";
import ProductDropdown from "../../components/Product/ProductSelect";
import CollectionBankAccountPopup from "./CollectionBankAccountPopup";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  getPendingRepaymentListWatcher,
  approveRepaymentsWatcher
} from "../../actions/repaymentApproval";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { styled } from "@material-ui/core/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import { AlertBox } from "../../components/AlertBox";
import { storedList } from "../../util/localstorage";
import moment from "moment";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { checkAccessTags } from "../../util/uam";
import CustomSelect from "../../components/custom/customSelect";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import IconButton from "@mui/material/IconButton";
const user = storedList("user");

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

const defaultErrors = {
  txnAmountError: false,
  txnReferenceError: false,
  utrNumberError: false
};

const RepaymentApproval = () => {
  const user = storedList("user");
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);
  const [isAllSelect, setIsAllSelect] = useState(false);
  const [count, setCount] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [result, setResult] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [filter, setFilter] = useState("");
  const [checkCounter, setCheckCounter] = useState(0);
  const [totalSelection, setTotalSelectCount] = useState(0);
  const [totalTransactionAmount, setTotalTransactionAmount] = useState(0);
  const [utrNumber, setUtrNumber] = useState("");
  const [txnReference, setTxnReference] = useState("");
  const [txnAmount, setTxnAmount] = useState("");
  const [errors, setErrors] = useState(defaultErrors);
  const [status, setStatus] = useState({ value: "pending", label: "Pending" });
  const [openPopup, setOpenPopup] = useState(false);

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const statusObject = [
    { value: "pending", label: "Pending" },
    { value: "hold", label: "Hold" }
  ];

  useEffect(() => {
    if (
      isTagged &&
      filter &&
      checkAccessTags([
        "tag_repayment_approval_read",
        "tag_repayment_approval_read_write"
      ])
    )
      getRepaymentPendingList(page);
    if (!isTagged && filter) getRepaymentPendingList(page);
  }, [filter, page, rowsPerPage]);

  const handleSelectAllRecord = data => {
    setIsAllSelect(!isAllSelect);
    let selected = [];
    let sum = 0;
    result.map(item => {
      selected.push({
        ...item,
        checked: !isAllSelect
      });
      sum += parseFloat(item.txn_amount);
    });
    setResult(selected);
    if (data?.target?.checked) {
      setSelectedRecords(selected);
      setTotalSelectCount(selected.length);
      setTotalTransactionAmount(sum);
      setCheckCounter(result.length);
    } else {
      setSelectedRecords([]);
      setTotalSelectCount(0);
      setTotalTransactionAmount(0);
      setCheckCounter(0);
    }
  };

  const handleSelectSingleRecord = (event, idx) => {
    let newRecords = [...result];
    newRecords[idx].checked = !newRecords[idx].checked;
    setResult(newRecords);

    if (event?.target?.checked) {
      let selected = selectedRecords;
      selected.push(newRecords[idx]);
      setSelectedRecords(selected);
      let sum = 0;
      let count = 0;
      selected.map(i => {
        sum += parseFloat(i.txn_amount);
        count += 1;
      });
      setTotalTransactionAmount(sum);
      setTotalSelectCount(count);
      setCheckCounter(checkCounter + 1);
      if (checkCounter + 1 === result.length) setIsAllSelect(true);
    } else {
      setCheckCounter(checkCounter - 1);
      setIsAllSelect(false);
      let sum = 0;
      let count = 0;
      let selected = [];
      selectedRecords.map(item => {
        if (item.checked) {
          selected.push(item);
          sum += parseFloat(item.txn_amount);
          count += 1;
        }
      });
      setTotalTransactionAmount(sum);
      setTotalSelectCount(count);
      setSelectedRecords(selected);
    }
  };

  const getRepaymentPendingList = page => {
    const data = {
      company_id: company.value,
      product_id: product.value,
      txn_amount: txnAmount,
      txn_reference: txnReference,
      utr_number: utrNumber,
      page,
      limit: rowsPerPage,
      status: status?.value
    };
    setSelectedRecords([]);
    setTotalSelectCount(0);
    setTotalTransactionAmount(0);
    dispatch(
      getPendingRepaymentListWatcher(
        data,
        response => {
          let result = [];
          Array.from(response.rows).forEach(row => {
            result.push({
              ...row,
              checked: false
            });
          });
          setResult(result);
          setCount(response.count);
          setIsAllSelect(false);
        },
        error => {
          showAlert(error.response.data.message, "error");
          setResult([]);
        }
      )
    );
  };

  const handleInputChange = setValue => event => {
    const { value } = event.target;
    setValue(value);
  };

  const handleSubmit = status => {
    if (!selectedRecords.length)
      return showAlert("Kindly select record for repayment approval", "error");

    if (status === 'approve') {
      setOpenPopup(true);
      return;
    }

    const data = {
      company_id: company.value,
      product_id: product.value,
      user_id: user._id,
      page,
      limit: rowsPerPage,
      status: status === "approve" ? "Y" : status,
      bankName: null,
      bankAccountNumber: null
    };
    setPage(0);
    const payload = { data, selectedRecords };
    dispatch(
      approveRepaymentsWatcher(
        payload,
        response => {
          showAlert(response?.message, "success");
          getRepaymentPendingList(0);
        },
        error => {
          showAlert(error.response.data.message, "error");
          getRepaymentPendingList(0);
        }
      )
    );
  };

  const onSearchClick = () => {
    if (!company?.value) return showAlert("Please select company", "error");
    if (!product?.value) return showAlert("Please select product", "error");
    setIsAllSelect(false);
    setSelectedRecords([]);
    setTotalSelectCount(0);
    setTotalTransactionAmount(0);
    setPage(0);
    setResult([]);
    setCompany(company);
    setProduct(product);
    setCheckCounter(0);
    setFilter({
      company_id: company.value,
      product_id: product.value
    });
  };

  const clearAll = () => {
    setSelectedRecords([]);
    setPage(0);
    setResult([]);
    setFilter("");
    setIsAllSelect(false);
    setCompany("");
    setProduct("");
    setTotalSelectCount(0);
    setTotalTransactionAmount(0);
    setTxnAmount("");
    setTxnReference("");
    setUtrNumber("");
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      setAlert(false);
    }, 4000);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setTotalSelectCount(0);
    setTotalTransactionAmount(0);
    setIsAllSelect(false);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value));
    setSelectedRecords([]);
    setIsAllSelect(false);
    setPage(0);
  };

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={() => setAlert(false)}
        />
      ) : null}
      {openPopup && (
        <CollectionBankAccountPopup
          isOpen={openPopup}
          setIsOpen={setOpenPopup}
          showAlert={showAlert}
          company={company}
          product={product}
          user={user}
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          getRepaymentPendingList={getRepaymentPendingList}
          selectedRecords={selectedRecords}
        />
      )}
      <Typography sx={{ mt: 2, ml: 2 }} variant="h6">
        Repayment approval
      </Typography>
      <CardContent>
        <Grid sx={{ margin: "10px 0px" }}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <CompanyDropdown
                placeholder="Select company"
                company={company}
                onCompanyChange={value => {
                  setCompany(value ? value : null);
                  setProduct(null);
                  setResult([]);
                  setSelectedRecords([]);
                  setTotalSelectCount(0);
                  setTotalTransactionAmount(0);
                  setIsAllSelect(false);
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <ProductDropdown
                placeholder="Select product"
                onProductChange={value => {
                  setProduct(value ? value : null);
                  setResult([]);
                  setSelectedRecords([]);
                  setTotalSelectCount(0);
                  setTotalTransactionAmount(0);
                  setIsAllSelect(false);
                }}
                company={company || null}
                product={product || null}
              />
            </Grid>
            <Grid item xs={3}>
              <CustomSelect
                placeholder="Select status"
                data={statusObject}
                value={status}
                handleDropdownChange={value => {
                  if (status !== value) {
                    setSelectedRecords([]);
                    setPage(0);
                    setResult([]);
                    setFilter("");
                    setIsAllSelect(false);
                    setTotalSelectCount(0);
                    setTotalTransactionAmount(0);
                    setTxnAmount("");
                    setCheckCounter(0);
                    setTxnReference("");
                    setUtrNumber("");
                  }
                  setStatus(value);
                }}
              />
            </Grid>
            <Grid
              item
              style={{ marginBottom: "25px" }}
              alignSelf={"center"}
              textAlign={"center"}
            >
              <IconButton color="primary" onClick={onSearchClick}>
                <ManageSearchIcon
                  sx={{
                    fontSize: "40px"
                  }}
                />
              </IconButton>
            </Grid>
            <Grid item xs={3}>
              <FormControl
                variant="filled"
                component={Box}
                width="100%"
                marginBottom="1.5rem!important"
              >
                <TextField
                  id="outlined-basic"
                  label="Transaction Amount"
                  variant="outlined"
                  type="text"
                  placeholder="Transaction Amount"
                  value={txnAmount ?? ""}
                  error={errors.txnAmountError}
                  onChange={handleInputChange(setTxnAmount)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl
                variant="filled"
                component={Box}
                width="100%"
                marginBottom="1.5rem!important"
              >
                <TextField
                  id="outlined-basic"
                  label="UTR Number"
                  variant="outlined"
                  type="text"
                  placeholder="UTR Number"
                  value={utrNumber ?? ""}
                  error={errors.utrNumberError}
                  onChange={handleInputChange(setUtrNumber)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl
                variant="filled"
                component={Box}
                width="100%"
                marginBottom="1.5rem!important"
              >
                <TextField
                  id="outlined-basic"
                  label="TXN Reference"
                  variant="outlined"
                  type="text"
                  placeholder="TXN Reference"
                  value={txnReference ?? ""}
                  error={errors.txnReferenceError}
                  onChange={handleInputChange(setTxnReference)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ margin: "10px 0px" }}>
          <Grid container>
            {totalSelection > 0 ? (
              <Grid item xs={9}>
                <TableContainer
                  sx={{ height: "100%", width: 350 }}
                  component={Paper}
                >
                  <Table aria-label="customized table" id="selectionSummary">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          style={{
                            textAlign: "center",
                            fontSize: "14px",
                            padding: "5px"
                          }}
                        >
                          Selection Summary
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <StyledTableRow key="totalSelection">
                        <StyledTableCell scope="row" style={{ padding: "5px" }}>
                          <div style={{ float: "left", width: "auto" }}>
                            <Typography
                              variant="h6"
                              style={{ fontSize: "12px", marginLeft: "5px" }}
                            >
                              Selected Repayments Count :
                            </Typography>
                          </div>
                          <div style={{ float: "right", width: "auto" }}>
                            <Typography
                              variant="h6"
                              style={{ fontSize: "12px" }}
                            >
                              {" "}
                              {totalSelection}
                            </Typography>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow key="totalTransactionAmount">
                        <StyledTableCell scope="row" style={{ padding: "5px" }}>
                          <div style={{ float: "left", width: "auto" }}>
                            <Typography
                              variant="h6"
                              style={{ fontSize: "12px", marginLeft: "5px" }}
                            >
                              Total Transaction Amount :
                            </Typography>
                          </div>
                          <div style={{ float: "right", width: "auto" }}>
                            <Typography
                              variant="h6"
                              style={{ fontSize: "12px" }}
                            >
                              {" "}
                              {Math.round(
                                (totalTransactionAmount * 1 + Number.EPSILON) *
                                100
                              ) / 100}
                            </Typography>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            ) : null}
            <Grid
              textAlign={"right"}
              item
              xs={totalSelection > 0 ? 3 : 12}
              paddingRight={0}
            >
              <Button
                variant="contained"
                disabled={!selectedRecords.length}
                color={"success"}
                onClick={() => handleSubmit("approve")}
                sx={{ marginRight: "5px" }}
              >
                Approve
              </Button>
              {status?.value === "pending" ? (
                <Button
                  variant={"contained"}
                  disabled={!selectedRecords.length}
                  onClick={() => handleSubmit("hold")}
                  color={"warning"}
                  sx={{ marginRight: "5px" }}
                >
                  Hold
                </Button>
              ) : null}
              <Button
                variant={"contained"}
                disabled={!selectedRecords.length}
                onClick={() => handleSubmit("rejected")}
                color={"error"}
              >
                Reject
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {isTagged && result.length ? (
          checkAccessTags([
            "tag_repayment_approval_read",
            "tag_repayment_approval_read_write"
          ]) ? (
            <TableContainer sx={{ mt: 4 }} component={Paper}>
              <Table
                sx={{ minWidth: 700 }}
                aria-label="customized table"
                id="pdf"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>
                      Select all
                      <Checkbox
                        color="success"
                        disabled={
                          isTagged
                            ? !checkAccessTags([
                              "tag_repayment_approval_read_write"
                            ])
                            : false
                        }
                        checked={isAllSelect}
                        onChange={handleSelectAllRecord}
                      />
                    </StyledTableCell>
                    <StyledTableCell> Loan id </StyledTableCell>
                    <StyledTableCell> Transaction amount</StyledTableCell>
                    <StyledTableCell> Amount net of TDS</StyledTableCell>
                    <StyledTableCell> Payment mode </StyledTableCell>
                    <StyledTableCell> Label </StyledTableCell>
                    <StyledTableCell> Repayment UTR number </StyledTableCell>
                    <StyledTableCell>Transaction date and time</StyledTableCell>
                    <StyledTableCell> TXN reference </StyledTableCell>
                    <StyledTableCell> Settlement date & time </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result &&
                    result.map((item, idx) => (
                      <StyledTableRow key={item.idx}>
                        <StyledTableCell scope="row">
                          <Checkbox
                            color="success"
                            checked={item?.checked}
                            disabled={
                              isTagged
                                ? !checkAccessTags([
                                  "tag_repayment_approval_read_write"
                                ])
                                : false
                            }
                            onChange={e => handleSelectSingleRecord(e, idx)}
                          />
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.loan_id}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.txn_amount}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.amount_net_of_tds || "NA"}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.payment_mode}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.label}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.utr_number}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {moment(item?.utr_date_time_stamp).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.txn_reference}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {moment(item?.txn_reference_datetime).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
              {count ? (
                <TablePagination
                  sx={{
                    ".MuiTablePagination-toolbar": {
                      color: "rgb(41, 39, 39)",
                      height: "35px",
                      margin: "none"
                    },

                    ".MuiTablePagination-selectLabel": {
                      marginBottom: "0px"
                    },
                    ".MuiTablePagination-displayedRows": {
                      marginBottom: "-1px"
                    },
                    ".MuiTablePagination-select": {
                      paddingTop: "6px"
                    }
                  }}
                  component="div"
                  count={count}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10, 50, 100, 200]}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              ) : null}
            </TableContainer>
          ) : null
        ) : result.length ? (
          <TableContainer sx={{ mt: 4 }} component={Paper}>
            <Table
              sx={{ minWidth: 700 }}
              aria-label="customized table"
              id="pdf"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    Select all
                    <Checkbox
                      color="success"
                      checked={isAllSelect}
                      onChange={handleSelectAllRecord}
                    />
                  </StyledTableCell>
                  <StyledTableCell> Loan id </StyledTableCell>
                  <StyledTableCell> Transaction amount</StyledTableCell>
                  <StyledTableCell> Payment mode </StyledTableCell>
                  <StyledTableCell> Label </StyledTableCell>
                  <StyledTableCell> Repayment UTR number </StyledTableCell>
                  <StyledTableCell> Transaction date and time </StyledTableCell>
                  <StyledTableCell> TXN reference </StyledTableCell>
                  <StyledTableCell> Settlement date & time </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result &&
                  result.map((item, idx) => (
                    <StyledTableRow key={item.idx}>
                      <StyledTableCell scope="row">
                        <Checkbox
                          color="success"
                          checked={item?.checked}
                          onChange={e => handleSelectSingleRecord(e, idx)}
                        />
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {item?.loan_id}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {item?.txn_amount}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {item?.payment_mode}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {item?.label}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {item?.utr_number}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {moment(item?.utr_date_time_stamp).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {item?.txn_reference}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {moment(item?.txn_reference_datetime).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
            {count ? (
              <TablePagination
                sx={{
                  ".MuiTablePagination-toolbar": {
                    color: "rgb(41, 39, 39)",
                    height: "35px",
                    margin: "none"
                  },

                  ".MuiTablePagination-selectLabel": {
                    marginBottom: "0px"
                  },
                  ".MuiTablePagination-displayedRows": {
                    marginBottom: "-1px"
                  },
                  ".MuiTablePagination-select": {
                    paddingTop: "6px"
                  }
                }}
                component="div"
                count={count}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 50, 100, 200]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            ) : null}
          </TableContainer>
        ) : null}
      </CardContent>
    </>
  );
};

export default RepaymentApproval;

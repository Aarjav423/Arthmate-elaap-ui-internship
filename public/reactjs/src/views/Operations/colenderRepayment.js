import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { AlertBox } from "../../components/AlertBox";
import { checkAccessTags } from "../../util/uam";
import { styled } from "@material-ui/core/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Autocomplete from "@mui/material/Autocomplete";
import moment from "moment";
import { Button, Divider } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import CustomDatePicker from "../../components/DatePicker/customDatePicker";
import IconButton from "@mui/material/IconButton";
import {
  colendersListWatcher,
  colenderRepaymentListWatcher,
  colenderSummaryPopupWatcher,
  colenderDisburseWatcher,
  colenderMarkAsPaidWatcher
} from "../../actions/colenders.js";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { storedList } from "../../util/localstorage";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { verifyDateAfter1800 } from "../../util/helper";

let filterObj = {
  company: null,
  product: null,
  fromDate: null,
  toDate: null,
  status: null,
  searchText: null
};

const statusToDisplay = {
  open: "Open",
  requested: "Requested",
  in_progress: "In Progress",
  paid: "Paid"
};

const statusValue = {
  "-1": "",
  0: "Open",
  1: "Requested",
  2: "In Progress",
  3: "Paid"
};

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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = props => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white"
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const colenderRepayment = () => {
  const user = storedList("user");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [colenderNames, setColenderNames] = useState([]);
  const [colenderLoans, setColenderLoans] = useState("");
  const [co_lender, setColender] = React.useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [colenderId, setColenderId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [colendersList, setColendersList] = useState("");
  const [status, setStatus] = useState("-1");
  const [customDate, setCustomDate] = useState(true);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filterData, setFilterdData] = useState(filterObj);
  const [selectAll, setSelectAll] = useState(false);
  const [page, setPage] = React.useState(0);
  const [count, setCount] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [repaymentRecords, setRepaymetRecords] = useState([]);
  const [showButtonLeft, setShowButtonLeft] = useState(true);
  const [showButtonRight, setShowButtonRight] = useState(false);
  const [selectedRepaymentRecords, setSelectedRepaymentRecords] = useState([]);
  const [totalSelection, setTotalSelectCount] = useState(0);
  const [totalNetTxnAmount, setTotalNetTxnAmount] = useState(0);
  const [summaryIdRecords, setSummaryIdRecords] = useState([]);
  const [isOpen, setisOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isOpenSummary, setisOpenSummary] = useState(false);
  const [openDialogSummary, setOpenDialogSummary] = useState(false);
  const [isOpenMap, setisOpenMap] = useState(false);
  const [openDialogMap, setOpenDialogMap] = useState(false);
  const [pageRS, setPageRS] = React.useState(0);
  const [rowsPerPageRS, setRowsPerPageRS] = React.useState(5);
  const [summaryIds, setSummaryIds] = React.useState([]);
  const [UtrNumber, setUtrNumber] = useState("");
  const [mapDate, setMapDate] = useState(null);
  const [selectedRow, setSelectedRow] = useState("");
  const [dateTime, setDateTime] = useState("");

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;
  const compare = (a, b) => {
    if (a.co_lender_name < b.co_lender_name) {
      return -1;
    }
    if (a.co_lender_name > b.co_lender_name) {
      return 1;
    }
    return 0;
  };

  const compareSummaryIds = (a, b) => {
    if (a.summary_id < b.summary_id) {
      return -1;
    }
    if (a.summary_id > b.summary_id) {
      return 1;
    }
    return 0;
  };

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (user?.type === "co-lender") {
      handleChange(null, "co-lender", user.co_lender_name, "selectOption");
      setColender(user?.username);
    }
    if (
      isTagged &&
      checkAccessTags([
        "tag_colender_repayment_read",
        "tag_colender_repayment_read_write"
      ])
    ) {
      fetchColendersList();
      handleSearch();
    }
    if (!isTagged) fetchColendersList();
    if (!isTagged) handleSearch();
  }, [colenderLoans]);

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
        setColenderNames(sortedArray);
        setColendersList(res?.sort(compare));
      })
      .catch(error => {
        showAlert(error.res.data.message, "error");
      });
  };

  const handleSearch = () => {
    setPage(0);
    const payload = {
      co_lender_id: colenderId,
      stage: status,
      from_date: fromDate,
      to_date: toDate,
      page: page,
      rowsPerPage: rowsPerPage,
      user_id: user._id
    };
    new Promise((resolve, reject) => {
      dispatch(colenderRepaymentListWatcher(payload, resolve, reject));
    })
      .then(response => {
        const data = response;
        setRepaymetRecords(
          data.rows.map(item => {
            return {
              ...item,
              checked: false
            };
          })
        );
        setCount(data.count);
        setTotalSelectCount(0);
        setTotalNetTxnAmount(0);
        setSelectedRepaymentRecords([]);
        setSelectAll(false);
        if (!data.count) {
          showAlert("No records found", "error");
        }
      })
      .catch(error => {
        showAlert(error.message, "error");
      });
  };

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    const payload = {
      co_lender_id: colenderId,
      stage: status,
      from_date: fromDate,
      to_date: toDate,
      page: newPage,
      rowsPerPage: rowsPerPage,
      user_id: user._id
    };
    new Promise((resolve, reject) => {
      dispatch(colenderRepaymentListWatcher(payload, resolve, reject));
    })
      .then(response => {
        const data = response;
        setRepaymetRecords(
          data.rows.map(item => {
            return {
              ...item,
              checked: false
            };
          })
        );
        setCount(data.count);
        setTotalSelectCount(0);
        setTotalNetTxnAmount(0);
        setSelectedRepaymentRecords([]);
        setSelectAll(false);
      })
      .catch(error => {
        showAlert(error.res.data.message, "error");
      });
  };

  const handleChange = async (event, label, value, reason) => {
    setStatus("-1");
    setColender(value);
    const indexOfColender = colendersList
      ? colendersList?.map(e => e.co_lender_name).indexOf(value)
      : null;
    const co_lender = colendersList[indexOfColender];
    const co_lender_id = co_lender?.co_lender_id;
    setColenderId(co_lender_id);
    setCompanyName(null);
    setSelectedProduct("");
  };

  const handleSummayId = data => {
    setRepaymetRecords(
      repaymentRecords.map(item => {
        return {
          ...item,
          checked: false
        };
      })
    );
    setSelectedRepaymentRecords([]);
    setTotalSelectCount(0);
    setTotalNetTxnAmount(0);
    const payload = {
      summary_id: data.summary_id,
      user_id: user._id
    };
    new Promise((resolve, reject) => {
      dispatch(colenderSummaryPopupWatcher(payload, resolve, reject));
    })
      .then(response => {
        const data = response;
        setSummaryIdRecords(data);
        setTotalSelectCount(0);
        setSelectAll(false);
      })
      .catch(error => {
        showAlert(error.message, "error");
        setSummaryIdRecords([]);
      });
    setisOpen(!isOpen);
    setOpenDialog(!openDialog);
  };

  const handleDisburse = () => {
    const payload = {
      summary_ids: summaryIds,
      stage: 1,
      user_id: user._id
    };
    new Promise((resolve, reject) => {
      dispatch(colenderDisburseWatcher(payload, resolve, reject));
    })
      .then(response => {
        showAlert(response.message, "success");
        handleSearch();
      })
      .catch(error => {
        showAlert(error.message, "error");
      });
    setisOpenSummary(!isOpenSummary);
    setOpenDialogSummary(!openDialogSummary);
    setRepaymetRecords(
      repaymentRecords.map(item => {
        return {
          ...item,
          checked: false
        };
      })
    );
    setSelectedRepaymentRecords([]);
    setTotalSelectCount(0);
    setTotalNetTxnAmount(0);
    setSummaryIds([]);
  };

  const handleMarkasPaid = () => {
    setDateTime(moment(dateTime).format("YYYY-MM-DD hh:mm:ss"));
    const payload = {
      summary_ids: summaryIds,
      stage: 3,
      utr_number: UtrNumber,
      txn_date: dateTime,
      user_id: user._id
    };
    new Promise((resolve, reject) => {
      dispatch(colenderMarkAsPaidWatcher(payload, resolve, reject));
    })
      .then(response => {
        showAlert(response.message, "success");
        handleSearch();
      })
      .catch(error => {
        showAlert(error.message, "error");
      });
    setOpenDialogMap(!openDialogMap);
    setisOpenMap(!isOpenMap);
    setRepaymetRecords(
      repaymentRecords.map(item => {
        return {
          ...item,
          checked: false
        };
      })
    );
    setSelectedRepaymentRecords([]);
    setTotalSelectCount(0);
    setTotalNetTxnAmount(0);
    setSummaryIds([]);
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

  const handleSelectAll = data => {
    let netTxnSum = 0;
    if (data?.target?.checked) {
      setSelectAll(!selectAll);
      setSelectedRepaymentRecords(
        repaymentRecords.map(item => {
          if (item.txn_amount.$numberDecimal)
            netTxnSum += parseFloat(item.txn_amount.$numberDecimal);
          return {
            ...item,
            checked: !selectAll
          };
        })
      );
      setRepaymetRecords(
        repaymentRecords.map(item => {
          return {
            ...item,
            checked: !selectAll
          };
        })
      );
      setTotalSelectCount(repaymentRecords.length);
      setTotalNetTxnAmount(netTxnSum);
    }
    if (!data?.target?.checked) {
      handleSearch();
      setSelectAll(!selectAll);
      setRepaymetRecords(
        repaymentRecords.map(item => {
          return {
            ...item,
            checked: !selectAll
          };
        })
      );
      setSelectedRepaymentRecords([]);
      setTotalSelectCount(0);
      setTotalNetTxnAmount(0);
    }
  };

  React.useEffect(() => {
    if (
      repaymentRecords?.length &&
      selectedRepaymentRecords?.length === repaymentRecords?.length
    ) {
      setSelectAll(true);
    }
  }, [selectedRepaymentRecords]);

  const handleSingleRecord = (data, event) => {
    let newRecords = [...repaymentRecords];
    const rowToChange = newRecords.findIndex(item => {
      return item.summary_id === data.summary_id;
    });
    newRecords[rowToChange].checked = !newRecords[rowToChange].checked;
    setRepaymetRecords(newRecords);
    let netTxnSum = Number(totalNetTxnAmount);
    let count = Number(totalSelection);

    if (!event?.target?.checked) {
      let selectedRecords = [...selectedRepaymentRecords];
      const index = selectedRecords.findIndex(item => {
        return item.summary_id === data.summary_id;
      });
      netTxnSum -= parseFloat(selectedRecords[index].txn_amount.$numberDecimal);
      count -= 1;
      selectedRecords.splice(index, 1);
      setSelectedRepaymentRecords(selectedRecords);
      setSelectAll(false);
    }
    if (event?.target?.checked) {
      setSelectedRepaymentRecords([...selectedRepaymentRecords, data]);
      if (data.txn_amount.$numberDecimal)
        netTxnSum += parseFloat(data.txn_amount.$numberDecimal);
      count += 1;
    }
    setTotalSelectCount(count);
    setTotalNetTxnAmount(netTxnSum);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClose = () => {
    setOpenDialog(!openDialog);
    setisOpen(!isOpen);
    setPageRS(0);
  };

  const handleCloseDisburse = () => {
    setOpenDialogSummary(!openDialogSummary);
    setisOpenSummary(!isOpenSummary);
  };

  const handleCloseMap = () => {
    setOpenDialogMap(!openDialogMap);
    setisOpenMap(!isOpenMap);
    setDateTime("");
    setUtrNumber("");
  };

  const handleChangePageRS = (event, newPage) => {
    setPageRS(newPage);
  };

  const handleChangeRowsPerPageRS = event => {
    setRowsPerPageRS(+event.target.value);
    setPageRS(0);
  };

  const renderSummaryPopup = () => (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        maxWidth={"lg"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={{ backgroundColor: "#5E72E4", color: "white" }}
        >
          {" "}
          Summary
        </BootstrapDialogTitle>

        <Grid sx={{ mt: 2, ml: 2, mr: 2, mb: 2 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Loan Id </StyledTableCell>
                  <StyledTableCell align="left">Amount Repaid</StyledTableCell>
                  <StyledTableCell align="left">Principal</StyledTableCell>
                  <StyledTableCell align="left">Interest</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summaryIdRecords
                  .slice(
                    pageRS * rowsPerPageRS,
                    pageRS * rowsPerPageRS + rowsPerPageRS
                  )
                  .map((data, index) => {
                    return (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{data?.loan_id}</StyledTableCell>
                        <StyledTableCell>
                          {data?.txn_amount?.$numberDecimal}
                        </StyledTableCell>
                        <StyledTableCell>
                          {data?.principal_amount?.$numberDecimal}
                        </StyledTableCell>
                        <StyledTableCell>
                          {data?.interest_amount?.$numberDecimal}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              sx={{
                "& .MuiTablePagination-toolbar": {
                  display: "flex",
                  alignItems: "baseline"
                },
                float: "",
                marginTop: "20px",
                marginLeft: "40px"
              }}
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={summaryIdRecords?.length}
              rowsPerPage={rowsPerPageRS}
              page={pageRS}
              onPageChange={handleChangePageRS}
              onRowsPerPageChange={handleChangeRowsPerPageRS}
            ></TablePagination>
          </TableContainer>
        </Grid>
      </BootstrapDialog>
    </>
  );

  const renderDisbursePopup = () => (
    <>
      <BootstrapDialog
        onClose={handleCloseDisburse}
        aria-labelledby="customized-dialog-title"
        open={openDialogSummary}
        maxWidth={"lg"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseDisburse}
          style={{ backgroundColor: "#5E72E4", color: "white" }}
        >
          Disbursement Summary
        </BootstrapDialogTitle>
        <TableContainer
          sx={{ width: 400 }}
          style={{ marginTop: "20px" }}
          component={Paper}
        >
          <Table aria-label="customized table" id="selectionSummary">
            <TableBody>
              <StyledTableRow key="totalSelection">
                <StyledTableCell scope="row" style={{ padding: "5px" }}>
                  <div style={{ float: "left", width: "75%" }}>
                    <Typography>Selected rows:</Typography>
                  </div>
                  <div style={{ float: "right" }}>
                    <Typography> {totalSelection}</Typography>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow key="totalDisbursementAMount">
                <StyledTableCell scope="row" style={{ padding: "5px" }}>
                  <div style={{ float: "left", width: "75%" }}>
                    <Typography>Total transaction amount:</Typography>
                  </div>
                  <div style={{ float: "right" }}>
                    <Typography> {totalNetTxnAmount.toFixed(2)}</Typography>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid
          display="flex"
          justifyContent="center"
          alignItems="flex-end"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              handleSearch();
              handleCloseDisburse();
              setRepaymetRecords(
                repaymentRecords.map(item => {
                  return {
                    ...item,
                    checked: false
                  };
                })
              );
              setSelectedRepaymentRecords([]);
              setTotalSelectCount(0);
              setTotalNetTxnAmount(0);
              setSummaryIds([]);
              setSelectAll(false);
              window.location.reload(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="ml-2"
            variant="contained"
            size="large"
            onClick={handleDisburse}
          >
            Disburse
          </Button>
        </Grid>
      </BootstrapDialog>
    </>
  );

  const handleInputChange = () => event => {
    setUtrNumber(event.target.value);
  };

  const renderMarkAsPaidPopup = () => (
    <>
      <BootstrapDialog
        onClose={handleCloseMap}
        aria-labelledby="customized-dialog-title"
        open={openDialogMap}
        maxWidth={"lg"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseMap}
          style={{ backgroundColor: "#5E72E4", color: "white" }}
        >
          Mark as Paid
        </BootstrapDialogTitle>

        <Grid item xs={3}>
          <TextField
            id="outlined-read-only-input"
            label="UTR number*"
            type="text"
            placeholder="UTR number*"
            value={UtrNumber}
            onChange={handleInputChange()}
            sx={{ mt: 2, mb: 2, minWidth: "410px" }}
          />
        </Grid>
        <Grid item xs={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DateTimePicker"]}
              sx={{ minWidth: "410px" }}
            >
              <DateTimePicker
                label="Date & time*"
                value={dateTime || null}
                onChange={newValue => setDateTime(newValue)}
                renderInput={props => (
                  <TextField {...props} size="large" helperText={null} />
                )}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="flex-end"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              handleCloseMap();
              setRepaymetRecords(
                repaymentRecords.map(item => {
                  return {
                    ...item,
                    checked: false
                  };
                })
              );
              setSelectedRepaymentRecords([]);
              setTotalSelectCount(0);
              setTotalNetTxnAmount(0);
              setSummaryIds([]);
              setSelectAll(false);
              window.location.reload(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="ml-2"
            variant="contained"
            size="large"
            onClick={() => {
              handleMarkasPaid();
            }}
          >
            Mark as paid
          </Button>
        </Grid>
      </BootstrapDialog>
    </>
  );

  const handleDisbursePopup = () => {
    let count = 0;
    let repaymentChannelCoLenders = [];
    for (let i = 0; i < selectedRepaymentRecords.length; i++) {
      if (selectedRepaymentRecords[i].stage == 0) {
        count = count + 1;
      }
      if (!selectedRepaymentRecords[i].channel) {
        repaymentChannelCoLenders.push(
          selectedRepaymentRecords[i].co_lender_name
        );
      }
    }
    let uniqueCoLenders = new Set(repaymentChannelCoLenders);
    let coLenders = "";
    if (uniqueCoLenders.size) {
      coLenders = Array.from(uniqueCoLenders).join(",");
    }
    if (repaymentChannelCoLenders.length) {
      showAlert(
        `No repayment channel configuration found for co-lender ${coLenders}`,
        "error"
      );
      return;
    }
    if (count == selectedRepaymentRecords.length) {
      setisOpenSummary(!isOpenSummary);
      setOpenDialogSummary(!openDialogSummary);
      let temparray = [];
      for (let i = 0; i < selectedRepaymentRecords.length; i++) {
        temparray.push(selectedRepaymentRecords[i].summary_id);
      }
      setSummaryIds(temparray);
    } else {
      showAlert("please select records of status 'Open' ", "error");
    }
  };

  const handleMarkAsPaidPopup = data => {
    let count = 0;
    for (let i = 0; i < selectedRepaymentRecords.length; i++) {
      if (selectedRepaymentRecords[i].stage == 2) {
        count = count + 1;
      }
    }
    if (count == selectedRepaymentRecords.length) {
      let ids = [];
      for (let i = 0; i < selectedRepaymentRecords.length; i++) {
        ids.push(selectedRepaymentRecords[i].summary_id);
      }
      setSummaryIds(ids);
      setisOpenMap(!isOpenMap);
      setOpenDialogMap(!openDialogMap);
    } else {
      showAlert("please select records of status 'In progress' ", "error");
    }
  };

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <Typography sx={{ mt: 2, ml: 2 }} variant="h6">
        Co-Lender Repayment
      </Typography>
      {isOpen ? renderSummaryPopup() : null}
      {isOpenSummary ? renderDisbursePopup() : null}
      {isOpenMap ? renderMarkAsPaidPopup() : null}
      <CardContent>
        <Grid container style={{ marginBottom: "20px" }}>
          <Grid item xs={2}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={colenderNames}
              onChange={(event, value, reason) => {
                handleChange(event, "co-lender", value, reason);
              }}
              sx={{ mb: 2, minWidth: "100%" }}
              renderInput={params => (
                <TextField {...params} label="Select Co-Lender" />
              )}
              value={
                user?.type === "co-lender" ? user?.co_lender_name : co_lender
              }
              disabled={user?.type === "co-lender"}
            />
          </Grid>
          <Grid item xs={2}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              value={statusValue[status]}
              options={[
                statusToDisplay.open,
                statusToDisplay.requested,
                statusToDisplay.in_progress,
                statusToDisplay.paid
              ]}
              onChange={(event, value) => {
                if (value === "Open") {
                  setStatus(0);
                }
                if (value === "Requested") {
                  setStatus(1);
                }
                if (value === "In Progress") {
                  setStatus(2);
                }
                if (value === "Paid") {
                  setStatus(3);
                }
              }}
              sx={{ mb: 2, minWidth: "100%" }}
              renderInput={params => (
                <TextField {...params} label="Select Status" />
              )}
            />
          </Grid>

          <Grid xs={2} item>
            <CustomDatePicker
              placeholder="Select duration"
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
          </Grid>
          {showButtonLeft ? (
            <Grid xs={1} style={{ marginTop: "10px" }}>
              <Button
                className="ml-2"
                variant="contained"
                onClick={handleSearch}
                disabled={colenderId ? false : true}
              >
                Search
              </Button>
            </Grid>
          ) : null}

          <Grid xs={2} item>
            {!customDate ? (
              <BasicDatePicker
                placeholder="From date"
                value={fromDate || null}
                onDateChange={date => {
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
          </Grid>
          <Grid xs={2} item>
            {!customDate ? (
              <BasicDatePicker
                placeholder={"To date"}
                value={toDate || null}
                onDateChange={date => {
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
          </Grid>
          {showButtonRight ? (
            <Grid xs={1} style={{ marginTop: "10px" }}>
              <Button
                className="ml-2"
                variant="contained"
                onClick={handleSearch}
                disabled={colenderId ? false : true}
              >
                Search
              </Button>
            </Grid>
          ) : null}
        </Grid>
        {isTagged ? (
          checkAccessTags(["tag_colender_repayment_read_write"]) ? (
            <Grid
              display="flex"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Button
                className="ml-2"
                variant="contained"
                size="large"
                onClick={() => {
                  handleMarkAsPaidPopup();
                }}
                disabled={!totalSelection}
              >
                Mark as Paid
              </Button>
              <Button
                className="ml-2"
                variant="contained"
                size="large"
                onClick={handleDisbursePopup}
                disabled={!totalSelection}
              >
                Disburse
              </Button>
            </Grid>
          ) : null
        ) : (
          <Grid display="flex" justifyContent="flex-end" alignItems="flex-end">
            <Button
              className="ml-2"
              variant="contained"
              size="large"
              onClick={() => {
                handleMarkAsPaidPopup();
              }}
              disabled={true}
            >
              Mark as Paid
            </Button>
            <Button
              className="ml-2"
              variant="contained"
              size="large"
              onClick={handleDisbursePopup}
              disabled={true}
            >
              Disburse
            </Button>
          </Grid>
        )}

        <Grid sx={{ margin: "10px 0px" }}>
          <Grid container>
            {totalSelection > 0 ? (
              <Grid item xs={4}>
                <TableContainer sx={{ width: 400 }} component={Paper}>
                  <Table aria-label="customized table" id="selectionSummary">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          style={{ textAlign: "center", padding: "5px" }}
                        >
                          Selection summary
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <StyledTableRow key="totalSelection">
                        <StyledTableCell scope="row" style={{ padding: "5px" }}>
                          <div style={{ float: "left", width: "75%" }}>
                            <Typography>Selected rows:</Typography>
                          </div>
                          <div style={{ float: "right" }}>
                            <Typography> {totalSelection}</Typography>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow key="totalDisbursementAMount">
                        <StyledTableCell scope="row" style={{ padding: "5px" }}>
                          <div style={{ float: "left", width: "75%" }}>
                            <Typography>Total transaction amount:</Typography>
                          </div>
                          <div style={{ float: "right" }}>
                            <Typography>
                              {" "}
                              {totalNetTxnAmount.toFixed(2)}
                            </Typography>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Grid sx={{ mt: 1 }}>
          <Divider />
        </Grid>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <Checkbox
                    color="success"
                    onChange={handleSelectAll}
                    checked={selectAll}
                  />
                </StyledTableCell>
                <StyledTableCell align="left">Summary Id </StyledTableCell>
                <StyledTableCell align="left">Co-Lender Name</StyledTableCell>
                <StyledTableCell align="left">
                  Transaction Amount
                </StyledTableCell>
                <StyledTableCell align="left">Transaction Id</StyledTableCell>
                <StyledTableCell align="left">Created Date</StyledTableCell>
                <StyledTableCell align="left">Channel</StyledTableCell>
                <StyledTableCell align="left">Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {repaymentRecords?.sort(compareSummaryIds).map((data, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>
                    <Checkbox
                      color="success"
                      onChange={e => handleSingleRecord(data, e)}
                      checked={data?.checked}
                    />
                  </StyledTableCell>
                  <StyledTableCell scope="row">
                    <Link
                      onClick={() => {
                        handleSummayId(data);
                      }}
                    >
                      {data.summary_id}
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell scope="row">
                    {data.co_lender_name}
                  </StyledTableCell>
                  <StyledTableCell scope="row">
                    {data.txn_amount.$numberDecimal}
                  </StyledTableCell>
                  <StyledTableCell align="left">{data.txn_id}</StyledTableCell>
                  <StyledTableCell align="left">
                    {moment(data.created_at).format("YYYY-MM-DD")}
                  </StyledTableCell>
                  <StyledTableCell align="left">{data.channel}</StyledTableCell>
                  <StyledTableCell align="left">
                    {statusToDisplay[data.status]}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </>
  );
};

export default colenderRepayment;

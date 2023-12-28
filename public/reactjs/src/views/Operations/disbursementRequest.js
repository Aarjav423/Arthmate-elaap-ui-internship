import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { styled } from "@material-ui/core/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import moment from "moment";
import { storedList } from "../../util/localstorage";
import { Button, Divider } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { statusToDisplay } from "../../util/helper";
import {
  compositeDisbursementWatcher,
  getLoanByStatusForLocWatcher,
  getLoanByStatusWatcher,
  compositeDrawdownWatcher,
  processDrawdownPfWatcher
} from "../../actions/compositeDisbursement";
import CompanyDropdown from "../../components/Company/CompanySelect";
import ProductDropdown from "../../components/Product/ProductSelect";
import Checkbox from "@mui/material/Checkbox";
import DisbursementRequestPopUp from "./disbursementRequestPopUp";
import DDRPFProcessPopUp from "./DDRPFProcessPopUp";
import { checkAccessTags } from "../../util/uam";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import { getProductByIdWatcher } from "../../actions/product";
import DrawDownRequestUi from "../lending/drawDownRequestUi";
import { Link } from "react-router-dom";
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

const typeToDisplay = {
  Colend_loans: "Yes",
  Non_Colend_loans: "No"
};

const DisbursementRequest = props => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);
  const [page, setPage] = React.useState(0);
  const [count, setCount] = React.useState("");
  const [isAllSelect, setIsAllSelect] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [disbursementRecords, setDisbursementRecords] = useState([]);
  const [selectedDisbursementRecords, setSelectedDisbursementRecords] =
    useState([]);
  const [successRows, setSuccessRows] = useState([]);
  const [failRows, setFailRows] = useState([]);
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState([
    10, 20, 50, 100
  ]);
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [isDDRPFOpen, setIsDDRPFOpen] = useState(false);
  const [errorRowsText, setErrorRowsText] = React.useState("");
  const [successRowsText, setSuccessRowsText] = React.useState("");
  const [isProgressStop, setIsProgressStop] = React.useState(false);
  const [isProgressStart, setIsProgressStart] = React.useState(false);
  const [totalSelection, setTotalSelectCount] = useState(0);
  const [totalSanctionAmount, setTotalSanctionAmount] = useState(0);
  const [totalNetDisbAmount, setTotalNetDisbAmount] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [walletConfigCheck, setWalletConfig] = useState(false);
  const [type, setType] = useState("N");
  const [typetodisplay, setTypeToDisplay] = useState("No");
  const [drawDownErrorMessage, setDrawDownErrorMessage] = useState("");
  const [productDetails, setproductDetails] = useState({})
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});
  const user = storedList("user");

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const getDisbursalApprovedList = () => {
    const payload = {
      sendData: {
        ...filter,
        page: page,
        limit: rowsPerPage,
        status: "disbursal_approved",
        stage: 3
      },
      userData: {
        user_id: user._id,
        ...filter
      }
    };
    new Promise((resolve, reject) => {
      dispatch(getLoanByStatusWatcher(payload, resolve, reject));
    })
      .then(response => {
        setIsAllSelect(false);
        setDisbursementRecords(
          response?.rows.map(item => {
            return {
              ...item,
              checked: false
            };
          })
        );
        setAvailableBalance(response.availableBalance);
        setWalletConfig(response.walletConfigCheck);
        setCount(response?.count);
      })
      .catch(error => {
        setDisbursementRecords([]);
        showAlert(error?.response?.data?.message, "error");
      });
  };
  const getDisbursalApprovedListForLoc = () => {
    const payload = {
      sendData: {
        ...filter,
        page: page,
        limit: rowsPerPage,
        status: 0
      },
      userData: {
        user_id: user._id,
        ...filter
      }
    };

    new Promise((resolve, reject) => {
      dispatch(getLoanByStatusForLocWatcher(payload, resolve, reject));
    })
      .then(response => {
        setIsAllSelect(false);
        setDisbursementRecords(
          response?.rows.map(item => {
            return {
              ...item,
              checked: false
            };
          })
        );
        setAvailableBalance(response.availableBalance);
        setWalletConfig(response.walletConfigCheck || false);
        setCount(response?.count);
      })
      .catch(error => {
        setDisbursementRecords([]);
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const errorTextToRender = () => {
    var newLine = "\r\n";
    var text = newLine;
    failRows.map((item, index) => {
      text =
        text + `${index + 1})  ${item.loan_id} - ${item.message}` + newLine;
    });
    setErrorRowsText(text);
    return text;
  };
  const successTextToRender = () => {
    var newLine = "\r\n";
    var text = newLine;
    successRows.map((item, index) => {
      text =
        text +
        `${index + 1}) ${item.loan_id} -  ${item.response.txn_id} - ${
          item.response?.data?.remarks
        }` +
        newLine;
    });
    setSuccessRowsText(text);
    return text;
  };

  const handleDisbursement = count => {
    if (!selectedDisbursementRecords.length) return;
    setIsProgressStart(true);
    const data = selectedDisbursementRecords[count];
    if (count === selectedDisbursementRecords.length) {
      errorTextToRender();
      setIsProgressStop(true);
      setIsProgressStart(false);
      setIsAllSelect(false);
      clearSelectionSummary();
      getDisbursalApprovedList();
      return;
    }
    const payload = {
      submitData: {
        loan_app_id: data?.loan_app_id,
        loan_id: data.loan_id,
        borrower_id: data?.borrower_id,
        partner_loan_app_id: data?.partner_loan_app_id,
        partner_loan_id: data?.partner_loan_id,
        partner_borrower_id: data?.partner_borrower_id,
        borrower_mobile: data?.loan_request[0]?.appl_phone,
        txn_date: moment(new Date()).format("YYYY-MM-DD"),
        sanction_amount: data?.sanction_amount,
        net_disbur_amt: data?.net_disbur_amt
      },
      userData: {
        user_id: user._id,
        ...filter
      }
    };

    new Promise((resolve, reject) => {
      dispatch(compositeDisbursementWatcher(payload, resolve, reject));
    })
      .then(response => {
        successRows.push(data);
        handleDisbursement(count + 1);
      })
      .catch(error => {
        failRows.push({
          loan_id: data.loan_id,
          message: error?.response?.data?.message
        });
        handleDisbursement(count + 1);
      });
  };
  const handleCompositeDrawdown = count => {
    if (!selectedDisbursementRecords.length) return;
    setDrawDownErrorMessage("");
    let finalProcessData = selectedDisbursementRecords.map(item => {
      let obj = {
        _id: item?._id,
        loan_app_id: item?.loan_app_id,
        loan_id: item.loan_id,
        borrower_id: item?.borrower_id,
        partner_loan_app_id: item?.partner_loan_app_id,
        partner_loan_id: item?.partner_loan_id,
        partner_borrower_id: item?.partner_borrower_id,
        txn_date: moment(new Date()).format("YYYY-MM-DD"),
        sanction_amount: item?.sanction_amount,
        net_disbur_amt: item?.net_disbur_amt,
        borrower_mobile: item?.borrower_mobile,
        drawadown_request_date: moment(new Date()).format("YYYY-MM-DD"),
        drawdown_amount: item?.drawdown_amount,
        net_drawdown_amount: item?.net_drawdown_amount,
        usage_fees: item?.usage_fees,
        usage_fees_including_gst: item?.usage_fees_including_gst,
        no_of_emi: Number(item?.no_of_emi),
        repayment_days: Number(item?.repayment_days),
        withheld_amount: item?.withheld_amount,
        invoice_number:item?.invoice_number
      };
      if (item.hasOwnProperty("processing_fees_including_gst"))
        obj["processing_fees_including_gst"] =
          item.processing_fees_including_gst;
      return obj;
    });

    // updated payload
    const payloadProcess = {
      submitData: finalProcessData,
      userData: {
        user_id: user._id,
        ...filter
      }
    };

    new Promise((resolve, reject) => {
      dispatch(processDrawdownPfWatcher(payloadProcess, resolve, reject));
    })
      .then(response => {
        processDrawdownFinal(count);
      })
      .catch(error => {
        setDrawDownErrorMessage(error?.response?.data?.message);
        setIsDDRPFOpen(true);
        //showAlert(error?.response?.data?.message, 'error');
      });
  };

  const handleStartDisbursement = () => {
    if (product?.isLoc) {
      handleCompositeDrawdown(0);
    } else {
      setIsOpenPopUp(!isOpenPopUp);
      handleDisbursement(0);
    }
  };

  const getProductDetails = (product_id) => {
    new Promise((resolve, reject) => {
      dispatch(getProductByIdWatcher(product_id, resolve, reject));
    })
      .then((response) => {
        setproductDetails(response);
        // product = response;
      })
      .catch((error) => {
        showAlert(
          error?.response?.data?.message ||
            "Error while getting product details",
          "error"
        );
      });
  };

  const processDrawdownFinal = count => {
    setIsOpenPopUp(!isOpenPopUp);
    setIsProgressStart(true);
    const data = selectedDisbursementRecords[count];
    if (count === selectedDisbursementRecords.length) {
      errorTextToRender();
      successTextToRender();
      setIsProgressStop(true);
      setIsProgressStart(false);
      setIsAllSelect(false);
      clearSelectionSummary();
      getDisbursalApprovedListForLoc();
      return;
    }

    let payload = {
      submitData: {
        _id: data?._id,
        loan_app_id: data?.loan_app_id,
        loan_id: data.loan_id,
        borrower_id: data?.borrower_id,
        partner_loan_app_id: data?.partner_loan_app_id,
        partner_loan_id: data?.partner_loan_id,
        partner_borrower_id: data?.partner_borrower_id,
        txn_date: moment(new Date()).format("YYYY-MM-DD"),
        sanction_amount: data?.sanction_amount,
        net_disbur_amt: data?.net_disbur_amt,
        borrower_mobile: data?.borrower_mobile,
        drawadown_request_date: moment(new Date()).format("YYYY-MM-DD"),
        drawdown_amount: data?.drawdown_amount,
        net_drawdown_amount: data?.net_drawdown_amount,
        usage_fees: data?.usage_fees,
        usage_fees_including_gst: data?.usage_fees_including_gst,
        no_of_emi: Number(data?.no_of_emi),
        repayment_days: Number(data?.repayment_days),
        withheld_amount:data?.withheld_amount,
        invoice_number:data?.invoice_number
      },
      userData: {
        user_id: user._id,
        ...filter
      }
    };

    if (data.hasOwnProperty("processing_fees_including_gst"))
      payload.submitData["processing_fees_including_gst"] =
        data.processing_fees_including_gst;

    new Promise((resolve, reject) => {
      dispatch(compositeDrawdownWatcher(payload, resolve, reject));
    })
      .then(response => {
        successRows.push(response);
        processDrawdownFinal(count + 1);
      })
      .catch(error => {
        failRows.push({
          loan_id: data.loan_id,
          message: error?.response?.data?.message
        });
        processDrawdownFinal(count + 1);
      });
  };

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags(["tag_disbursement_read", "tag_disbursement_read_write"])
    ) {
      if (product?.isLoc && filter) {
        getDisbursalApprovedListForLoc();
      } else if (filter && !product?.isLoc) {
        getDisbursalApprovedList();
      }
    }
    if (!isTagged) {
      if (product?.isLoc && filter) {
        getDisbursalApprovedListForLoc();
      } else if (filter && !product?.isLoc) {
        getDisbursalApprovedList();
      }
    }
  }, [filter, page, rowsPerPage]);

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

  const onSearchClick = data => {
    if (!company?.value) return showAlert("Please select company", "error");
    if (!product?.value) return showAlert("Please select product", "error");
    if (!type) return showAlert("Please select Co-lend Loan", "error");
    setIsAllSelect(false);
    setSelectedDisbursementRecords([]);
    setPage(0);
    setDisbursementRecords([]);
    setFilter({
      company_id: company.value,
      product_id: product.value,
      co_lend_flag: type
    });
    clearSelectionSummary();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    clearSelectionSummary();
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value));
    setIsAllSelect(false);
    setSelectedDisbursementRecords([]);
    setPage(0);
  };

  const handleSelectSingleRecord = (data, event) => {
    let newRecords = [...disbursementRecords];
    const rowToChange = newRecords.findIndex(item => {
      return item._id === data._id;
    });
    newRecords[rowToChange].checked = !newRecords[rowToChange].checked;
    setDisbursementRecords(newRecords);
    let sanctionSum = Number(totalSanctionAmount);
    let netDisbSum = Number(totalNetDisbAmount);
    let count = Number(totalSelection);
    if (!event?.target?.checked) {
      let selectedRecords = [...selectedDisbursementRecords];
      const index = selectedRecords.findIndex(item => {
        if (item._id === data._id) {
          if (product.isLoc) {
            if (data.drawdown_amount) {
              sanctionSum -= parseFloat(item.drawdown_amount);
            }
            if (data.net_drawdown_amount) {
              netDisbSum -= parseFloat(item.net_drawdown_amount);
            }
          } else {
            if (data.sanction_amount) {
              sanctionSum -= parseFloat(item.sanction_amount);
            }
            if (data.net_disbur_amt) {
              netDisbSum -= parseFloat(item.net_disbur_amt);
            }
          }
          count -= 1;
        }
        return item._id === data._id;
      });
      selectedRecords.splice(index, 1);
      setSelectedDisbursementRecords(selectedRecords);
      setIsAllSelect(false);
    }
    if (event?.target?.checked) {
      setSelectedDisbursementRecords([...selectedDisbursementRecords, data]);
      if (product.isLoc) {
        if (data.drawdown_amount) {
          sanctionSum += parseFloat(data.drawdown_amount);
        }
        if (data.net_drawdown_amount)
          netDisbSum += parseFloat(data.net_drawdown_amount);
      } else {
        if (data.sanction_amount) {
          sanctionSum += parseFloat(data.sanction_amount);
        }
        if (data.net_disbur_amt) netDisbSum += parseFloat(data.net_disbur_amt);
      }
      count += 1;
    }
    setTotalSelectCount(count);
    setTotalSanctionAmount(sanctionSum);
    setTotalNetDisbAmount(netDisbSum);
  };

  React.useEffect(() => {
    if (
      disbursementRecords?.length &&
      selectedDisbursementRecords?.length === disbursementRecords?.length
    ) {
      setIsAllSelect(true);
    }
  }, [selectedDisbursementRecords]);

  const handleSelectAllRecord = data => {
    let sanctionSum = 0;
    let netDisbSum = 0;
    if (data?.target?.checked) {
      setIsAllSelect(!isAllSelect);
      setDisbursementRecords(
        disbursementRecords.map(item => {
          if (product.isLoc) {
            if (item.drawdown_amount) {
              sanctionSum += parseFloat(item.drawdown_amount);
            }
            if (item.net_drawdown_amount) {
              netDisbSum += parseFloat(item.net_drawdown_amount);
            }
          } else {
            if (item.sanction_amount) {
              sanctionSum += parseFloat(item.sanction_amount);
            }
            if (item.net_disbur_amt) {
              netDisbSum += parseFloat(item.net_disbur_amt);
            }
          }
          return {
            ...item,
            checked: !isAllSelect
          };
        })
      );
      setSelectedDisbursementRecords(disbursementRecords);
      setTotalSelectCount(disbursementRecords.length);
      setTotalSanctionAmount(sanctionSum);
      setTotalNetDisbAmount(netDisbSum);
    }
    if (!data?.target?.checked) {
      setIsAllSelect(!isAllSelect);
      setTotalSelectCount(0);
      setTotalSanctionAmount(0);
      setTotalNetDisbAmount(0);
      setDisbursementRecords(
        disbursementRecords.map(item => {
          return {
            ...item,
            checked: !isAllSelect
          };
        })
      );
      setSelectedDisbursementRecords([]);
    }
  };

  const clearSelectionSummary = () => {
    setTotalSelectCount(0);
    setTotalSanctionAmount(0);
    setTotalNetDisbAmount(0);
    setAvailableBalance(0);
    setSelectedDisbursementRecords([]);
  };

  const handleChangeCompanyProduct = () => {
    setIsAllSelect(false);
    setDisbursementRecords(
      disbursementRecords.map(item => {
        return {
          ...item,
          checked: false
        };
      })
    );
    setSelectedDisbursementRecords([]);
    setDisbursementRecords([]);
    clearSelectionSummary();
  };

  const handleClosePopUp = () => {
    setIsOpenPopUp(!isOpenPopUp);
    setSelectedDisbursementRecords([]);
    setErrorRowsText("");
    setSuccessRows([]);
    setFailRows([]);
  };

  const handleOpenInNewPage = (url, page) => {
    window.open(`${url}`, `${page || "_blank"}`);
  };
  
  const handleDdrDetails = (selectedRow) => {
    if (
      product?.line_pf === "drawdown" &&
      selectedRow._id === oldestEntry._id
    ) {
      handleOpenInNewPage(
        `/admin/lending/loan/loc_drawdown_request/${selectedRow.company_id}/${
          selectedRow.product_id
        }/${selectedRow.loan_id}/${selectedRow._id}/${
          selectedRow.loan_app_id
        }/${selectedRow.status}/${"true"}`
      );
    } else {
      handleOpenInNewPage(
        `/admin/lending/loan/loc_drawdown_request/${selectedRow.company_id}/${
          selectedRow.product_id
        }/${selectedRow.loan_id}/${selectedRow._id}/${
          selectedRow.loan_app_id
        }/${selectedRow.status}/${"false"}`
      );
    }
  };

  return (
    <>
      {alert ? (
        <Stack
          lg={{
            width: "80%"
          }}
          justifyContent="center"
          alignItems="center"
        >
          <Alert severity={severity} onClose={handleAlertClose}>
            {alertMessage}
          </Alert>
        </Stack>
      ) : null}
      <DisbursementRequestPopUp
        isOpen={isOpenPopUp}
        successRows={successRows}
        failRows={failRows}
        totalRequest={selectedDisbursementRecords}
        errorRowsText={errorRowsText}
        isProgressStop={isProgressStop}
        setIsOpen={() => handleClosePopUp()}
        successRowsText={successRowsText}
        isProgressStart={isProgressStart}
        title="Disbursement progress"
      />
      {isDDRPFOpen && (
        <DDRPFProcessPopUp
          setIsOpen={() => setIsDDRPFOpen(false)}
          title="Request"
          message={drawDownErrorMessage}
        />
      )}

      <Typography
        sx={{
          mt: 2,
          ml: 2
        }}
        variant="h6"
      >
        Disbursement request
      </Typography>
      <CardContent>
        <Grid
          xs={12}
          sx={{
            margin: "10px 0"
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <CompanyDropdown
                placeholder="Select company"
                company={company}
                onCompanyChange={value => {
                  setCompany(value ? value : "");
                  setProduct([]);
                  handleChangeCompanyProduct();
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <ProductDropdown
                placeholder="Select product"
                onProductChange={value => {
                  setProduct(value ? value : "");
                  handleChangeCompanyProduct();
                }}
                company={company || null}
                product={product || null}
              />
            </Grid>
            <Grid item xs={3}>
              <Autocomplete
                id="combo-box-demo"
                value={typetodisplay}
                options={[
                  typeToDisplay.Colend_loans,
                  typeToDisplay.Non_Colend_loans
                ]}
                onChange={(event, value) => {
                  if (value == null) {
                    setTypeToDisplay("");
                    setType("");
                  }
                  if (value == "Yes") {
                    setType("Y");
                    setTypeToDisplay(typeToDisplay.Colend_loans);
                  }
                  if (value == "No") {
                    setType("N");
                    setTypeToDisplay(typeToDisplay.Non_Colend_loans);
                  }
                }}
                renderInput={params => (
                  <TextField {...params} label="Co-Lend Loan" />
                )}
              />
            </Grid>
            <Grid item xs={2} sx={{ mt: 1, ml: 2 }}>
              <Button variant="contained" onClick={onSearchClick}>
                Search
              </Button>
            </Grid>
          </Grid>
          <Grid display="flex" justifyContent="flex-end" alignItems="flex-end">
            <Button
              variant="contained"
              size="large"
              onClick={() => handleStartDisbursement()}
              disabled={!selectedDisbursementRecords.length}
            >
              Disburse
            </Button>
          </Grid>
          <Grid sx={{ margin: "10px 0px" }}>
            <Grid container>
              {totalSelection > 0 ? (
                <Grid item xs={4}>
                  <TableContainer sx={{ width: 400 }} component={Paper}>
                    <Table aria-label="customized table" id="selectionSummary">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell
                            style={{
                              textAlign: "center",
                              padding: "5px"
                            }}
                          >
                            Selection summary
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <StyledTableRow key="availableBalance">
                          <StyledTableCell
                            scope="row"
                            style={{ padding: "5px" }}
                          >
                            <div style={{ float: "left", width: "75%" }}>
                              <Typography>Available balance:</Typography>
                            </div>
                            <div style={{ float: "right" }}>
                              <Typography>
                                {Number(walletConfigCheck)
                                  ? Number(availableBalance).toFixed(2)
                                  : "NA"}
                              </Typography>
                            </div>
                          </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow key="totalSelection">
                          <StyledTableCell
                            scope="row"
                            style={{ padding: "5px" }}
                          >
                            <div style={{ float: "left", width: "75%" }}>
                              <Typography>Selected rows:</Typography>
                            </div>
                            <div style={{ float: "right" }}>
                              <Typography>{totalSelection}</Typography>
                            </div>
                          </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow key="totalLoanAmount">
                          <StyledTableCell
                            scope="row"
                            style={{ padding: "5px" }}
                          >
                            <div style={{ float: "left", width: "75%" }}>
                              <Typography>Total loan amount:</Typography>
                            </div>
                            <div style={{ float: "right" }}>
                              <Typography>
                                {totalSanctionAmount.toFixed(2)}
                              </Typography>
                            </div>
                          </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow key="totalDisbursementAMount">
                          <StyledTableCell
                            scope="row"
                            style={{ padding: "5px" }}
                          >
                            <div style={{ float: "left", width: "75%" }}>
                              <Typography>Total transaction amount:</Typography>
                            </div>
                            <div style={{ float: "right" }}>
                              <Typography>
                                {totalNetDisbAmount.toFixed(2)}
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
          {disbursementRecords.length ? (
            <Grid xs={12}>
              {isTagged ? (
                checkAccessTags([
                  "tag_disbursement_read",
                  "tag_disbursement_read_write"
                ]) ? (
                  <TableContainer
                    sx={{
                      mt: 4
                    }}
                    component={Paper}
                  >
                    <Table
                      sx={{
                        minWidth: 700
                      }}
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
                                      "tag_disbursement_read_write"
                                    ])
                                  : false
                              }
                              checked={isAllSelect}
                              onChange={handleSelectAllRecord}
                            />
                          </StyledTableCell>
                          <StyledTableCell> Loan id </StyledTableCell>
                          {product?.isLoc ? (
                            <StyledTableCell>
                              Drawdown request id
                            </StyledTableCell>
                          ) : null}
                          <StyledTableCell> Customer name </StyledTableCell>
                          {product?.isLoc ? (
                            <StyledTableCell> Drawdown amount </StyledTableCell>
                          ) : (
                            <StyledTableCell> Loan amount </StyledTableCell>
                          )}
                          {product?.isLoc ? (
                            <StyledTableCell>
                              Net drawdown amount
                            </StyledTableCell>
                          ) : (
                            <StyledTableCell>
                              Net disbursement amount
                            </StyledTableCell>
                          )}
                          {product?.isLoc ? (
                            <StyledTableCell> Request date </StyledTableCell>
                          ) : (
                            <StyledTableCell>
                              Loan sanction date
                            </StyledTableCell>
                          )}
                          <StyledTableCell> Channel </StyledTableCell>
                          <StyledTableCell> Status </StyledTableCell>
                          <StyledTableCell> Action </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {disbursementRecords &&
                          disbursementRecords.map(item => (
                            <StyledTableRow key={item._id}>
                              <StyledTableCell scope="row">
                                <Checkbox
                                  color="success"
                                  disabled={
                                    isTagged
                                      ? !checkAccessTags([
                                          "tag_disbursement_read_write"
                                        ])
                                      : false
                                  }
                                  checked={item?.checked}
                                  onChange={e =>
                                    handleSelectSingleRecord(item, e)
                                  }
                                />
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {item?.loan_id}
                              </StyledTableCell>
                              {product?.isLoc ? (
                                <StyledTableCell scope="row">
                                  <Link onClick={(event) => {
                                       handleDdrDetails(item);
                                   }}>
                                   {item?._id}
                                  </Link>
                                  {item?.processing_fees_including_gst ? (
                                    <Tooltip
                                      title={`PF = ${item?.processing_fees_including_gst}`}
                                    >
                                      <IconButton>
                                        <InfoIcon style={{ color: "blue" }} />
                                      </IconButton>
                                    </Tooltip>
                                  ) : null}
                                </StyledTableCell>
                              ) : null}
                              <StyledTableCell scope="row">
                                {item?.first_name} {item?.last_name}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {product?.isLoc
                                  ? item?.drawdown_amount
                                  : item?.sanction_amount}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {product?.isLoc
                                  ? item?.net_drawdown_amount
                                  : item?.net_disbur_amt}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {moment(item.created_at).format("YYYY-MM-DD")}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {item?.channel}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {statusToDisplay[item?.status]}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {product?.isLoc ? (
                                  <Tooltip title="Edit">
                                    <EditIcon
                                      style={{
                                        color: "#5e72e4",
                                        cursor: "pointer"
                                      }}
                                      disabled={
                                        isTagged
                                          ? checkAccessTags([
                                              "tag_drawdown_request_edit_read_write"
                                            ])
                                          : false
                                      }
                                      onClick={() => {
                                        getProductDetails(item?.product_id)
                                        setIsOpen(true);
                                        setData(item);
                                      }}
                                    />
                                  </Tooltip>
                                ) : (
                                  "NA"
                                )}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                      </TableBody>
                    </Table>
                    {count ? (
                      <TablePagination
                        component="div"
                        count={count}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={rowsPerPageOptions}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    ) : null}
                  </TableContainer>
                ) : null
              ) : (
                <TableContainer
                  sx={{
                    mt: 4
                  }}
                  component={Paper}
                >
                  <Table
                    sx={{
                      minWidth: 700
                    }}
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
                        {product?.isLoc ? (
                          <StyledTableCell>
                            {" "}
                            Drawdown request id{" "}
                          </StyledTableCell>
                        ) : null}
                        <StyledTableCell> Customer name </StyledTableCell>
                        {product?.isLoc ? (
                          <StyledTableCell> Drawdown amount </StyledTableCell>
                        ) : (
                          <StyledTableCell> Loan amount </StyledTableCell>
                        )}
                        {product?.isLoc ? (
                          <StyledTableCell>
                            {" "}
                            Net drawdown amount{" "}
                          </StyledTableCell>
                        ) : (
                          <StyledTableCell>
                            Net disbursement amount
                          </StyledTableCell>
                        )}
                        {product?.isLoc ? (
                          <StyledTableCell> Request date </StyledTableCell>
                        ) : (
                          <StyledTableCell>
                            {" "}
                            Loan sanction date{" "}
                          </StyledTableCell>
                        )}
                        <StyledTableCell> Status </StyledTableCell>
                        <StyledTableCell> Action </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {disbursementRecords &&
                        disbursementRecords.map(item => (
                          <StyledTableRow key={item._id}>
                            <StyledTableCell scope="row">
                              <Checkbox
                                color="success"
                                checked={item?.checked}
                                onChange={e =>
                                  handleSelectSingleRecord(item, e)
                                }
                              />
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item?.loan_id}
                            </StyledTableCell>
                            {product?.isLoc ? (
                              <StyledTableCell scope="row">
                                {item?._id}
                              </StyledTableCell>
                            ) : null}
                            <StyledTableCell scope="row">
                              {item?.first_name} {item?.last_name}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {product?.isLoc
                                ? item?.drawdown_amount
                                : item?.sanction_amount}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {product?.isLoc
                                ? item?.net_drawdown_amount
                                : item?.net_disbur_amt}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {moment(item.created_at).format("YYYY-MM-DD")}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {statusToDisplay[item?.status]}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {product?.isLoc ? (
                                <Tooltip title="Edit">
                                  <EditIcon
                                    style={{
                                      color: "#5e72e4",
                                      cursor: "pointer"
                                    }}
                                  /> 
                                </Tooltip>
                              ) : (
                                "NA"
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                  {count ? (
                    <TablePagination
                      component="div"
                      count={count}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      rowsPerPageOptions={rowsPerPageOptions}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  ) : null}
                </TableContainer>
              )}
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
      {isOpen && (
        <DrawDownRequestUi
          setIsOpen={setIsOpen}
          isEdit={true}
          data={data}
          onSearchClick={onSearchClick}
          productDetails={productDetails}
        />
      )}
    </>
  );
};

export default DisbursementRequest;

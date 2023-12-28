import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { styled } from "@material-ui/core/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import moment from "moment";
import { storedList } from "../../util/localstorage";
import { Button } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import {
  cashCollateralWatcher,
  disburseWithheldAmountWatcher
} from "../../actions/cashCollateral";
import CompanyDropdown from "../../components/Company/CompanySelect";
import ProductDropdown from "../../components/Product/ProductSelect";
import Checkbox from "@mui/material/Checkbox";
import DisbursementRequestPopUp from "./disbursementRequestPopUp";
import DDRPFProcessPopUp from "./DDRPFProcessPopUp";
import { checkAccessTags } from "../../util/uam";
import { AlertBox } from "../../components/AlertBox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
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

const BootstrapDialogTitle = (props) => {
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

const cashCollateralDisbursal = (props) => {
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
  const [drawDownErrorMessage, setDrawDownErrorMessage] = useState("");
  const user = storedList("user");
  const [openDialog, setOpenDialog] = useState(false);
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

      const getVal = value => {
        if (value?.$numberDecimal !== undefined) {
          return parseFloat(value.$numberDecimal.toString());
        } else if (typeof value === "object") {
          return parseFloat(value.toString());
        }
        return value;
      };

  const renderProductSchemePopup = () => (
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
          style={{ backgroundColor: "#5e72e4", color: "white" }}
        >
          Disbursement Summary
        </BootstrapDialogTitle>

        <Grid
          item
          xs={12}
          sx={{ mt: 3 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ float: "left", color: "#6E6E6E" }}>Selected rows</div>
          <div style={{ float: "right", fontWeight: "bold" }}>
            {totalSelection}
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ mt: 3 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ float: "left", color: "#6E6E6E" }}>
            Total Transaction Amount
          </div>
          <div style={{ float: "right", fontWeight: "bold" }}>
            {parseFloat(totalSanctionAmount).toFixed(2)}
          </div>
        </Grid>
        <DialogActions style={{ marginTop: "15px" }}>
          <Button
            style={{
              backgroundColor: "white",
              color: "#5e72e4",
              textAlign: "center",
              border: "2px solid #5e72e4",
              marginLeft: "10px",
              marginRight: "10px",
              marginBottom: "5px",
              width: "200px"
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor: "#5e72e4",
              color: "#fff",
              textAlign: "center",
              marginBottom: "5px",
              marginRight: "10px",
              width: "200px"
            }}
            onClick={() => handleStartDisbursement()}
          >
            Disburse
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );

  const getDisbursalApprovedList = () => {
    const payload = {
      sendData: {
        ...filter,
        page: page,
        limit: rowsPerPage,
        user_id: user._id
      }
    };
    new Promise((resolve, reject) => {
      dispatch(cashCollateralWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setIsAllSelect(false);
        setDisbursementRecords(
          response?.data?.rows.map((item) => {
            return {
              ...item,
              checked: false
            };
          })
        );
        setCount(response?.data?.count);
      })
      .catch((error) => {
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
        `${index + 1}) ${item.loan_id} -  ${item?.response?.txn_id} - ${
          item.response?.data?.remarks
        }` +
        newLine;
    });
    setSuccessRowsText(text);
    return text;
  };

  const handleDisbursement = (count) => {
    if (!selectedDisbursementRecords.length) return;
    setIsProgressStart(true);
    const data = selectedDisbursementRecords[count];
    if (count === selectedDisbursementRecords.length) {
      errorTextToRender();
      setIsProgressStop(true);
      successTextToRender();
      setIsProgressStart(false);
      setIsAllSelect(false);
      clearSelectionSummary();
      getDisbursalApprovedList();
      return;
    }
    const payload = {
      submitData: {
        ...filter,
        loan_id: data.loan_id,
        txn_date: moment(new Date()).format("YYYY-MM-DD"),
        net_disbur_amt: getVal(data?.withheld_amount).toFixed(2),
        user_id: user._id,
        loc_drawdown_request_id:data?.loc_drawdown_request_id,
        loc_drawdown_usage_id:data?.loc_drawdown_usage_id,
        disbursmentType: "cashcollateral"
      }
    };
    new Promise((resolve, reject) => {
      dispatch(
        disburseWithheldAmountWatcher(payload.submitData, resolve, reject)
      );
    })
      .then((response) => {
        successRows.push(response);
        handleDisbursement(count + 1);
      })
      .catch((error) => {
        failRows.push({
          loan_id: data.loan_id,
          message: error?.response?.data?.message
        });
        handleDisbursement(count + 1);
      });
  };

  const handleStartDisbursement = () => {
    setOpenDialog(!openDialog);
    setIsOpenPopUp(!isOpenPopUp);
    handleDisbursement(0);
  };

  useEffect(() => {
    if (
      filter
    ) {
      getDisbursalApprovedList();
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

  const onSearchClick = (data) => {
    if (!company?.value) return showAlert("Please select partner", "error");
    if (!product?.value) return showAlert("Please select product", "error");
    setIsAllSelect(false);
    setSelectedDisbursementRecords([]);
    setPage(0);
    setDisbursementRecords([]);
    setFilter({
      company_id: company.value,
      product_id: product.value
    });
    clearSelectionSummary();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    clearSelectionSummary();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(getVal(event.target.value));
    setIsAllSelect(false);
    setSelectedDisbursementRecords([]);
    setPage(0);
  };

  const handleClose = () => {
    setOpenDialog(!openDialog);
  };

  const handleSelectSingleRecord = (data, event) => {
    let newRecords = [...disbursementRecords];
    const rowToChange = newRecords.findIndex((item) => {
      return item._id === data._id;
    });
    newRecords[rowToChange].checked = !newRecords[rowToChange].checked;
    setDisbursementRecords(newRecords);

    let count = totalSelection;
    let sanctionSum = totalSanctionAmount;

    if (!event?.target?.checked) {
      let selectedRecords = [...selectedDisbursementRecords];
      const index = selectedRecords.findIndex((item) => {
        if (item._id === data._id) {
          if (data.withheld_amount) {
            sanctionSum -= getVal(item.withheld_amount);
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
      if (data.withheld_amount) {
        sanctionSum += getVal(data.withheld_amount);
      }
      count += 1;
    }
    setTotalSelectCount(count);
    setTotalSanctionAmount(sanctionSum);
  };

  React.useEffect(() => {
    if (
      disbursementRecords?.length &&
      selectedDisbursementRecords?.length === disbursementRecords?.length
    ) {
      setIsAllSelect(true);
    }
  }, [selectedDisbursementRecords]);

  const handleSelectAllRecord = (data) => {
    let sanctionSum = 0;
    let netDisbSum = 0;
    if (data?.target?.checked) {
      setIsAllSelect(!isAllSelect);
      setDisbursementRecords(
        disbursementRecords.map((item) => {
          if (item.withheld_amount) {
            sanctionSum += getVal(item.withheld_amount);
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
      setDisbursementRecords(
        disbursementRecords.map((item) => {
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
      disbursementRecords.map((item) => {
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

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      {openDialog ? renderProductSchemePopup() : null}
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
        Cash Collateral
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
                placeholder="Select partner"
                company={company}
                onCompanyChange={(value) => {
                  setCompany(value ? value : "");
                  setProduct([]);
                  handleChangeCompanyProduct();
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <ProductDropdown
                placeholder="Select product"
                onProductChange={(value) => {
                  setProduct(value ? value : "");
                  handleChangeCompanyProduct();
                }}
                company={company || null}
                product={product || null}
              />
            </Grid>
            <Grid item xs={2} sx={{ mt: 0, ml: 2 }}>
              <Button
                style={{
                  backgroundColor: "#5e72e4",
                  color: "#fff",
                  height: "55px"
                }}
                variant="contained"
                size="Large"
                onClick={onSearchClick}
              >
                Search
              </Button>
            </Grid>
          </Grid>

          {checkAccessTags(["tag_cash_collateral_disbursement_read_write"]) && (
            <Grid
              display="flex"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Button
                variant="contained"
                size="large"
                style={{
                  height: "55px",
                  backgroundColor: selectedDisbursementRecords.length
                    ? "#5e72e4"
                    : "",
                  color: selectedDisbursementRecords.length ? "#fff" : ""
                }}
                onClick={() => {
                  setOpenDialog(!openDialog);
                }}
                disabled={!selectedDisbursementRecords.length}
              >
                Disburse
              </Button>
            </Grid>
          )}
          {disbursementRecords.length ? (
            <Grid xs={12}>
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
                    {checkAccessTags([
                         "tag_cash_collateral_disbursement_read_write"
                       ]) && (
                        <StyledTableCell>
                          Select all
                          <Checkbox
                            color="success"
                            checked={isAllSelect}
                            onChange={handleSelectAllRecord}
                          />
                        </StyledTableCell>
                        )}
                      <StyledTableCell> Loan ID </StyledTableCell>
                      {(disbursementRecords[0]?.withheld_amount!=null) &&
                        <StyledTableCell> Usage ID </StyledTableCell>
                        }
                      
                      <StyledTableCell> Sanction Amount </StyledTableCell>
                      <StyledTableCell>
                        Primary Disbursement Amount
                      </StyledTableCell>
                      <StyledTableCell>
                        Primary Disbursement Date
                      </StyledTableCell>
                      <StyledTableCell>Withheld Amount</StyledTableCell>
                      <StyledTableCell> Loan Closure Date </StyledTableCell>
                      <StyledTableCell>Disbursement Channel</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {disbursementRecords &&
                      disbursementRecords.map((item) => (
                        <StyledTableRow key={item._id}>
                          {checkAccessTags([
                             "tag_cash_collateral_disbursement_read_write"
                           ]) && (
                            <StyledTableCell scope="row">
                              <Checkbox
                                color="success"
                                checked={item?.checked}
                                onChange={(e) =>
                                  handleSelectSingleRecord(item, e)
                                }
                              />
                            </StyledTableCell>
                          )}
                          <StyledTableCell scope="row">
                            {item?.loan_id}
                          </StyledTableCell>
                          {(disbursementRecords[0]?.withheld_amount!=null) && 
                           <StyledTableCell scope="row">
                            {item?.loc_drawdown_usage_id}
                          </StyledTableCell>}
                          <StyledTableCell scope="row">
                            <CurrencyRupeeIcon fontSize="small" />{" "}
                            {getVal(item?.sanction_amount)}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            <CurrencyRupeeIcon fontSize="small" />{" "}
                            {getVal(item?.primary_net_disbursment_amount).toFixed(2)}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {moment(item.primary_disbursement_date).format(
                              "YYYY-MM-DD"
                            )}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item?.withheld_amount ?
                            <>
                            <CurrencyRupeeIcon fontSize="small" />
                            {getVal(item?.withheld_amount).toFixed(2)} </> : "NA"}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {moment(item.loan_closure_date).format(
                              "YYYY-MM-DD"
                            )}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item?.disbursment_channel}
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
                    rowsPerPageOptions={rowsPerPageOptions}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                ) : null}
              </TableContainer>
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
    </>
  );
};

export default cashCollateralDisbursal;

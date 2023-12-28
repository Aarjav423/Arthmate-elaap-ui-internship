import * as React from "react";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {styled} from "@material-ui/core/styles";
import {tableCellClasses} from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment";
import {storedList} from "../../util/localstorage";
import {Button, Divider} from "@mui/material";
import {connect} from "react-redux";
import TablePagination from "@mui/material/TablePagination";
import {statusToDisplay} from "../../util/helper";
import {getLoanByStatusWatcher} from "../../actions/compositeDisbursement";
import CompanyDropdown from "../../components/Company/CompanySelect";
import ProductDropdown from "../../components/Product/ProductSelect";
import Checkbox from "@mui/material/Checkbox";
import DisbursementRequestPopUp from "./disbursementRequestPopUp";
import {updateBorrowerInfoCommonUncommonWatcher} from "../../actions/borrowerInfo";
import {AlertBox} from "../../components/AlertBox";
import {checkAccessTags} from "../../util/uam";

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5e72e4",
    color: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.black
  }
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const DisbursementApprove = props => {
  const history = useHistory();
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
  const [loansRecords, setLoansRecords] = useState([]);
  const [selectedLoanRecords, setSelectedLoanRecords] = useState([]);
  const [successRows, setSuccessRows] = useState([]);
  const [failRows, setFailRows] = useState([]);
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState([
    10,
    20,
    50,
    100
  ]);
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [errorRowsText, setErrorRowsText] = React.useState("");
  const [isProgressStop, setIsProgressStop] = React.useState(false);
  const [isProgressStart, setIsProgressStart] = React.useState(false);
  const [totalSelection, setTotalSelectCount] = useState(0);
  const [totalSanctionAmount, setTotalSanctionAmount] = useState(0);
  const [totalNetDisbAmount, setTotalNetDisbAmount] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [walletConfigCheck, setWalletConfigCheck] = useState(false);
  const user = storedList("user");

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const getLoansByStatus = () => {
    const payload = {
      sendData: {
        ...filter,
        page: page,
        limit: rowsPerPage,
        status: "credit_approved",
        stage: 2
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
        setLoansRecords(
          response?.rows.map(item => {
            return {
              ...item,
              checked: false
            };
          })
        );
        setCount(response?.count);
        setAvailableBalance(response.availableBalance);
        setWalletConfigCheck(response.walletConfigCheck);
      })
      .catch(error => {
        setLoansRecords([]);
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const clearSelectionSummary = () => {
    setTotalSelectCount(0);
    setTotalSanctionAmount(0);
    setTotalNetDisbAmount(0);
    setAvailableBalance(0);
    setSelectedLoanRecords([]);
  };

  const handleUpdateLoanStatus = (count, status) => {
    if (!selectedLoanRecords.length) return;
    setIsProgressStart(true);
    const data = selectedLoanRecords[count];
    if (count === selectedLoanRecords.length) {
      errorTextToRender();
      setIsProgressStop(true);
      setIsProgressStart(false);
      setIsAllSelect(false);
      clearSelectionSummary();
      getLoansByStatus();
      return;
    }

    const params = {
      company_id: data?.company_id,
      product_id: data?.product_id,
      loan_id: data?.loan_id,
      loan_app_id: data?.loan_app_id,
      partner_loan_id: data?.partner_loan_id,
      partner_borrower_id: data?.partner_borrower_id,
      borrower_id: data?.borrower_id,
      status
    };

    new Promise((resolve, reject) => {
      dispatch(
        updateBorrowerInfoCommonUncommonWatcher(params, resolve, reject)
      );
    })
      .then(response => {
        successRows.push(data);
        handleUpdateLoanStatus(count + 1);
      })
      .catch(error => {
        failRows.push({
          loan_id: data.loan_id,
          message: error?.response?.data?.message
        });
        handleUpdateLoanStatus(count + 1);
      });
  };

  const handleStartStatusUpdate = status => {
    setIsOpenPopUp(!isOpenPopUp);
    handleUpdateLoanStatus(0, status);
  };

  const errorTextToRender = async () => {
    var newLine = "\r\n";
    var text = newLine;
    await failRows.map((item, index) => {
      text =
        text + `${index + 1})  ${item.loan_id} - ${item.message}` + newLine;
    });
    setErrorRowsText(text);
    return text;
  };

  useEffect(() => {
    if (
      isTagged &&
      filter &&
      checkAccessTags([
        "tag_disbursement_approval_read",
        "tag_disbursement_approval_read_write"
      ])
    )
      getLoansByStatus();
    if (!isTagged && filter) getLoansByStatus();
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
    setIsAllSelect(false);
    setSelectedLoanRecords([]);
    setPage(0);
    setTotalSelectCount(0);
    setTotalSanctionAmount(0);
    setTotalNetDisbAmount(0);
    setAvailableBalance(0);
    setLoansRecords([]);
    setFilter({
      company_id: company.value,
      product_id: product.value
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setTotalSelectCount(0);
    setTotalSanctionAmount(0);
    setTotalNetDisbAmount(0);
    setAvailableBalance(0);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value));
    setIsAllSelect(false);
    setSelectedLoanRecords([]);
    setPage(0);
  };

  const handleSelectSingleRecord = (data, event) => {
    let newRecords = [...loansRecords];
    const rowToChange = newRecords.findIndex(item => {
      return item._id === data._id;
    });
    newRecords[rowToChange].checked = !newRecords[rowToChange].checked;
    setLoansRecords(newRecords);
    let sanctionSum = Number(totalSanctionAmount);
    let netDisbSum = Number(totalNetDisbAmount);
    let count = Number(totalSelection);

    if (!event?.target?.checked) {
      let selectedRecords = [...selectedLoanRecords];
      const index = selectedRecords.findIndex(item => {
        return item._id === data._id;
      });
      selectedRecords.splice(index, 1);
      setSelectedLoanRecords(selectedRecords);
      setIsAllSelect(false);
      selectedLoanRecords.map(item => {
        if (item._id === data._id) {
          if (data.sanction_amount)
            sanctionSum -= parseFloat(item.sanction_amount);
          if (data.net_disbur_amt)
            netDisbSum -= parseFloat(item.net_disbur_amt);
          count -= 1;
        }
      });
    }
    if (event?.target?.checked) {
      setSelectedLoanRecords([...selectedLoanRecords, data]);
      if (data.sanction_amount) {
        sanctionSum += parseFloat(data.sanction_amount);
      }
      if (data.net_disbur_amt) netDisbSum += parseFloat(data.net_disbur_amt);
      count += 1;
    }
    setTotalSelectCount(count);
    setTotalSanctionAmount(sanctionSum);
    setTotalNetDisbAmount(netDisbSum);
  };

  React.useEffect(() => {
    if (
      loansRecords?.length &&
      selectedLoanRecords?.length === loansRecords?.length
    ) {
      setIsAllSelect(true);
    }
  }, [selectedLoanRecords]);

  const handleSelectAllRecord = data => {
    let sanctionSum = 0;
    let netDisbSum = 0;
    if (data?.target?.checked) {
      setIsAllSelect(!isAllSelect);
      setLoansRecords(
        loansRecords.map(item => {
          if (item.sanction_amount)
            sanctionSum += parseFloat(item.sanction_amount);
          if (item.net_disbur_amt)
            netDisbSum += parseFloat(item.net_disbur_amt);
          return {
            ...item,
            checked: !isAllSelect
          };
        })
      );
      setTotalSelectCount(loansRecords.length);
      setSelectedLoanRecords(loansRecords);
      setTotalSanctionAmount(sanctionSum);
      setTotalNetDisbAmount(netDisbSum);
    }
    if (!data?.target?.checked) {
      setTotalSelectCount(0);
      setTotalSanctionAmount(0);
      setTotalNetDisbAmount(0);
      setIsAllSelect(!isAllSelect);
      setLoansRecords(
        loansRecords.map(item => {
          return {
            ...item,
            checked: !isAllSelect
          };
        })
      );
      setSelectedLoanRecords([]);
    }
  };

  const handleChangeCompanyProduct = () => {
    setIsAllSelect(false);
    setLoansRecords(
      loansRecords.map(item => {
        return {
          ...item,
          checked: false
        };
      })
    );
    setSelectedLoanRecords([]);
    setLoansRecords([]);
    setTotalSelectCount(0);
    setTotalSanctionAmount(0);
    setTotalNetDisbAmount(0);
    setAvailableBalance(0);
  };

  const handleClosePopUp = () => {
    setIsOpenPopUp(!isOpenPopUp);
    setSelectedLoanRecords([]);
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
      <DisbursementRequestPopUp
        isOpen={isOpenPopUp}
        successRows={successRows}
        failRows={failRows}
        totalRequest={selectedLoanRecords}
        errorRowsText={errorRowsText}
        isProgressStop={isProgressStop}
        setIsOpen={() => handleClosePopUp()}
        isProgressStart={isProgressStart}
        title="Disbursement approve progress"
      />
      <Typography
        sx={{
          mt: 2,
          ml: 2
        }}
        variant="h6"
      >
        Disbursement approval
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
            <Grid item xs={3} sx={{mt: 1, ml: 2}}>
              <Button variant="contained" onClick={onSearchClick}>
                Search
              </Button>
            </Grid>
          </Grid>
          <Grid display="flex" justifyContent="flex-end" alignItems="flex-end">
            <Button
              variant="contained"
              size="large"
              onClick={() => handleStartStatusUpdate("disbursal_approved")}
              disabled={!selectedLoanRecords.length}
            >
              Approve
            </Button>
            <Button
              className="ml-2"
              variant="contained"
              size="large"
              color="error"
              onClick={() => handleStartStatusUpdate("rejected")}
              disabled={!selectedLoanRecords.length}
            >
              Reject
            </Button>
          </Grid>
          <Grid sx={{margin: "10px 0px"}}>
            <Grid container>
              {totalSelection > 0 ? (
                <Grid item xs={4}>
                  <TableContainer sx={{width: 400}} component={Paper}>
                    <Table aria-label="customized table" id="selectionSummary">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell
                            style={{textAlign: "center", padding: "5px"}}
                          >
                            Selection summary
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <StyledTableRow key="totalSelection">
                          <StyledTableCell scope="row" style={{padding: "5px"}}>
                            <div style={{float: "left", width: "75%"}}>
                              <Typography>Available balance:</Typography>
                            </div>
                            <div style={{float: "right"}}>
                              <Typography>
                                {Number(walletConfigCheck)
                                  ? Number(availableBalance).toFixed(2)
                                  : "NA"}
                              </Typography>
                            </div>
                          </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow key="totalSelection">
                          <StyledTableCell scope="row" style={{padding: "5px"}}>
                            <div style={{float: "left", width: "75%"}}>
                              <Typography>Selected rows:</Typography>
                            </div>
                            <div style={{float: "right"}}>
                              <Typography> {totalSelection}</Typography>
                            </div>
                          </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow key="totalLoanAmount">
                          <StyledTableCell scope="row" style={{padding: "5px"}}>
                            <div style={{float: "left", width: "75%"}}>
                              <Typography>Total loan amount:</Typography>
                            </div>
                            <div style={{float: "right"}}>
                              <Typography>
                                {" "}
                                {totalSanctionAmount.toFixed(2)}
                              </Typography>
                            </div>
                          </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow key="totalDisbursementAMount">
                          <StyledTableCell scope="row" style={{padding: "5px"}}>
                            <div style={{float: "left", width: "75%"}}>
                              <Typography>Total transaction amount:</Typography>
                            </div>
                            <div style={{float: "right"}}>
                              <Typography>
                                {" "}
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
          <Grid sx={{mt: 1}}>
            <Divider />
          </Grid>

          {loansRecords.length ? (
            <Grid xs={12}>
              {isTagged ? (
                checkAccessTags([
                  "tag_disbursement_approval_read",
                  "tag_disbursement_approval_read_write"
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
                                      "tag_disbursement_approval_read_write"
                                    ])
                                  : false
                              }
                              checked={isAllSelect}
                              onChange={handleSelectAllRecord}
                            />
                          </StyledTableCell>
                          <StyledTableCell> Loan id </StyledTableCell>
                          <StyledTableCell> Customer name </StyledTableCell>
                          <StyledTableCell> Company name </StyledTableCell>
                          <StyledTableCell> Product name </StyledTableCell>
                          <StyledTableCell> Loan amount </StyledTableCell>
                          <StyledTableCell>
                            Net Disbursement Amount
                          </StyledTableCell>
                          <StyledTableCell> Application date </StyledTableCell>
                          <StyledTableCell> Status </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loansRecords &&
                          loansRecords.map(item => (
                            <StyledTableRow key={item._id}>
                              <StyledTableCell scope="row">
                                <Checkbox
                                  color="success"
                                  checked={item?.checked}
                                  disabled={
                                    isTagged
                                      ? !checkAccessTags([
                                          "tag_disbursement_approval_read_write"
                                        ])
                                      : false
                                  }
                                  onChange={e =>
                                    handleSelectSingleRecord(item, e)
                                  }
                                />
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {item?.loan_id}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {item?.first_name} {item?.last_name}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {`${item.company[0]?.name} (${item.company[0]?.code})`}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {item.product[0]?.name}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {item?.sanction_amount}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {item?.net_disbur_amt}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {moment(item.created_at).format("YYYY-MM-DD")}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {statusToDisplay[item?.status]}
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
                        <StyledTableCell> Customer name </StyledTableCell>
                        <StyledTableCell> Company name </StyledTableCell>
                        <StyledTableCell> Product name </StyledTableCell>
                        <StyledTableCell> Loan amount </StyledTableCell>
                        <StyledTableCell>
                          Net Disbursement Amount
                        </StyledTableCell>
                        <StyledTableCell> Application date </StyledTableCell>
                        <StyledTableCell> Status </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loansRecords &&
                        loansRecords.map(item => (
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
                            <StyledTableCell scope="row">
                              {item?.first_name} {item?.last_name}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {`${item.company[0]?.name} (${item.company[0]?.code})`}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.product[0]?.name}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item?.sanction_amount}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item?.net_disbur_amt}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {moment(item.created_at).format("YYYY-MM-DD")}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {statusToDisplay[item?.status]}
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
              )}
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
    </>
  );
};

const mapStateToProps = state => {
  return {};
};

export default connect(null, null)(DisbursementApprove);

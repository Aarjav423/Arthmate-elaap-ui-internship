import React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
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
import Grid from "@mui/material/Grid";
import { Button, Divider } from "@mui/material";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {
  generateEscrowReportsWatcher,
  getCoLenderReportsWatcher,
  downloadCoLenderReportsWatcher,
  generateBorrowerReportsWatcher,
  getBorrowerReportsWatcher,
  downloadBorrowerReportsWatcher,
  generateP2pReportsWatcher,
  getP2pReportsWatcher,
  downloadP2pReportsWatcher
} from "../../../actions/reports";
import Autocomplete from "@mui/material/Autocomplete";
import { colendersListWatcher } from "../../../actions/colenders.js";
import CustomDatePicker from "../../../components/DatePicker/customDatePicker";
import { useDispatch } from "react-redux";
import { storedList } from "../../../util/localstorage";
import TablePagination from "@mui/material/TablePagination";
import moment from "moment";
import { downloadDataInXLSXFormat } from "../../../util/helper";
import { AlertBox } from "../../../components/AlertBox";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import { checkAccessTags } from "../../../util/uam";
import { verifyDateAfter1800 } from "../../../util/helper";
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
let filterObj = {
  company: null,
  product: null,
  fromDate: null,
  toDate: null,
  status: null,
  searchText: null
};

const GenerateReport = props => {
  const {
    isCustomDatePicker,
    text,
    onSearchClick,
    mandatoryFields,
    isViewSearch = false,
    isViewStatus = false,
    reportButton = false,
    sendData = () => {},
    isDisabledFromDateDropdown = false,
    statusList,
    loanStatusList,
    isViewMinAmount = false,
    isViewMaxAmount = false,
    isRepaymentReport,
    isCKYCReport,
    isServiceUsage,
    isViewMonthDropdown,
    isViewYearDropdown,
    isViewDayDropdown,
    isScreenFlag,
    isViewFromDate,
    isViewToDate,
    ...other
  } = props;
  const URLdata = window.location.href;
  const user = storedList("user");
  const dispatch = useDispatch();
  const [colendersList, setColendersList] = useState("");
  const [colenderNames, setColenderNames] = useState([]);
  const [reports, setReports] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [page, setPage] = useState(0);
  const [count, setCount] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showStatus, setShowStatus] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const [colenderID, setColenderID] = useState("");
  const [co_lender, setColender] = React.useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [reportName, setReportName] = useState(URLdata.split("/").slice(-1)[0]);
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [productId, setProductId] = useState("");
  const [enableSearch, setEnableSearch] = useState(false);
  const [productsArray, setProductArray] = useState("");
  const [customDate, setCustomDate] = useState(true);
  const [filterData, setFilterdData] = useState(filterObj);
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

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

  //Functions for fetching reports
  const handleGetReport = () => {
    const payload = {
      page: page,
      limit: rowsPerPage,
      userData: {
        company_id: "",
        user_id: user._id,
        product_id: ""
      }
    };
    if (reportName.indexOf("Escrow_Disbursement_transactions") > -1) {
      getColenderDisbursementReports(payload);
    }
    if (reportName.indexOf("Borrower_Disbursement_transactions") > -1) {
      getBorrowerDisbursementReports(payload);
    }
    if (reportName.indexOf("Co-Lender_disbursement_report") > -1) {
      getP2pReports(payload);
    }
  };

  const getColenderDisbursementReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getCoLenderReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getBorrowerDisbursementReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getBorrowerReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getP2pReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getP2pReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setReports([]);
  };

  //Functios for generating reports
  const handleGenerateReport = () => {
    if (reportName.indexOf("Escrow_Disbursement_transactions") > -1) {
      generateDisbursementReport();
    }
    if (reportName.indexOf("Borrower_Disbursement_transactions") > -1) {
      generateBorrowerDisbursementReport();
    }
    if (reportName.indexOf("Co-Lender_disbursement_report") > -1) {
      generatep2pReport();
    }
  };

  const generateDisbursementReport = () => {
    const payload = {
      userData: {
        company_id: company?.value,
        user_id: user._id,
        product_id: product?.value
      },
      submitData: {
        from_date: fromDate,
        to_date: toDate,
        co_lender_id: colenderID
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateEscrowReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const generateBorrowerDisbursementReport = () => {
    const payload = {
      userData: {
        company_id: company?.value,
        user_id: user._id,
        product_id: product?.value
      },
      submitData: {
        from_date: fromDate,
        to_date: toDate,
        co_lender_id: colenderID
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateBorrowerReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const generatep2pReport = () => {
    const payload = {
      userData: {
        company_id: company?.value,
        user_id: user._id,
        product_id: product?.value
      },
      submitData: {
        from_date: fromDate,
        to_date: toDate,
        co_lender_id: colenderID
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateP2pReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const handleChange = async (event, label, value, reason) => {
    if (reason == "clear") {
      setColenderID(" ");
      setProductArray([]);
      setProduct([]);
      setCompanyName("");
      setProductId("");
    }
    if (value != null) {
      const colender_type = event.target.value;
      if (value == "Select All") {
        setColender(event.target.value);
        setColenderID("-1");
        setEnableSearch(true);
        setProduct([]);
        setProductArray([]);
        setCompanyName("");
      } else {
        setColender(value);
        const indexOfColender = colendersList
          .map(e => e.co_lender_name)
          .indexOf(value);
        const co_lender = colendersList[indexOfColender];
        const co_lender_id = co_lender?.co_lender_id;
        setColenderID(co_lender_id);
        setCompanyName("");
      }
    }
  };

  //Functios for downloading reports
  const handleDownloadReport = (id, name) => {
    const payload = {
      userData: {
        user_id: user._id
      },
      submitData: {
        id: id
      }
    };
    if (reportName.indexOf("Escrow_Disbursement_transactions") > -1) {
      downloadDisbursementReport(payload, name);
    }
    if (reportName.indexOf("Borrower_Disbursement_transactions") > -1) {
      downloadBorrowerDisbursementReport(payload, name);
    }
    if (reportName.indexOf("Co-Lender_disbursement_report") > -1) {
      downloadP2pReport(payload, name);
    }
  };

  const downloadDisbursementReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadCoLenderReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadBorrowerDisbursementReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadBorrowerReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadP2pReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadP2pReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_colending_reports_read",
        "tag_colending_reports_read_write"
      ])
    )
      handleGetReport();
    if (!isTagged) handleGetReport();
  }, [page]);

  useEffect(() => {
    if (reportName.indexOf("Disbursement_transactions") > -1) {
      setShowStatus(true);
      setStatusData([
        { label: "Success", value: "success" },
        { label: "Fail", value: "fail" }
      ]);
    }
  }, []);

  React.useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_colending_reports_read",
        "tag_colending_reports_read_write"
      ])
    )
      fetchColendersList();
    if (!isTagged) fetchColendersList();
  }, []);

  const compare = (a, b) => {
    if (a.co_lender_name < b.co_lender_name) {
      return -1;
    }
    if (a.co_lender_name > b.co_lender_name) {
      return 1;
    }
    return 0;
  };

  //function to fetch co_lender list
  const fetchColendersList = () => {
    const payload = {};
    let names = [];
    new Promise((resolve, reject) => {
      dispatch(colendersListWatcher(payload, resolve, reject));
    })
      .then(res => {
        for (var i = 0; i < res.length; i++) {
          if (
            !process.env.REACT_APP_NON_COLENDER_NAMES.includes(
              res[i].co_lender_shortcode
            )
          ) {
            names.push(res[i].co_lender_name);
          }
        }
        const sortedArray = names.sort();
        sortedArray.splice(0, 0, "Select All");
        setColenderNames(sortedArray);
        setColendersList(res.sort(compare));
      })
      .catch(error => {
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  return (
    <div>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <Typography
        sx={{
          mt: 2,
          ml: 2
        }}
        variant="h6"
      >
        {reportName.replace(/_+/g, " ")}
      </Typography>
      <CardContent>
        <Grid container>
          <Grid
            xs={3}
            sx={{
              margin: "10px 0"
            }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={colenderNames}
              onChange={(event, value, reason) =>
                handleChange(event, "company", value, reason)
              }
              sx={{ mb: 2, minWidth: "100%" }}
              renderInput={params => (
                <TextField {...params} label="Select Co-Lender" />
              )}
            />
          </Grid>
          <Grid
            xs={18}
            sm={4}
            md={4}
            item
            container
            spacing={2}
            sx={{
              mt: "-20px",
              display: "flex",
              alignSelf: "center"
            }}
          >
            <Grid xs={5} item>
              <CustomDatePicker
                placeholder="Select duration"
                onDateChange={date => {
                  if (date.state == "custom") {
                    setCustomDate(false);
                    setFromDate("");
                    setToDate("");
                  } else {
                    setCustomDate(true);
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
            <Grid xs={3} item>
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
            <Grid xs={3} item>
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
          </Grid>
        </Grid>

        <Grid
          xs={12}
          sx={{
            margin: "10px 0"
          }}
        >
          <Grid
            m={1}
            sx={{ mt: 5 }}
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Button
              variant="contained"
              color="primary"
              disabled={
                isTagged
                  ? !checkAccessTags(["tag_colending_reports_read_write"])
                  : false
              }
              onClick={handleGenerateReport}
            >
              Generate report
            </Button>
          </Grid>
          <Grid>
            <Divider />
          </Grid>
          {reports.length ? (
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
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell> Title </StyledTableCell>
                      <StyledTableCell> Requested by </StyledTableCell>
                      <StyledTableCell>
                        Generation date and time
                      </StyledTableCell>
                      <StyledTableCell> Download</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports &&
                      reports.map(item => (
                        <StyledTableRow key={item._id}>
                          <StyledTableCell scope="row">
                            {`${
                              item.co_lender_name ? item.co_lender_name : "NA"
                            }_${item.from_date ? item.from_date : "NA"}_${
                              item.to_date ? item.to_date : "NA"
                            }_report.xlsx`}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item?.requested_by_name}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {moment(item?.created_at).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            <Tooltip
                              title="Download File"
                              placement="top"
                              arrow
                            >
                              <IconButton
                                aria-label="Download File"
                                color="primary"
                                onClick={() =>
                                  handleDownloadReport(
                                    item._id,
                                    `${
                                      item.co_lender_name
                                        ? item.co_lender_name
                                        : "NA"
                                    }_${
                                      item.from_date ? item.from_date : "NA"
                                    }_${
                                      item.to_date ? item.to_date : "NA"
                                    }_report.xlsx`
                                  )
                                }
                              >
                                <ArrowCircleDownIcon />
                              </IconButton>
                            </Tooltip>
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
                    rowsPerPageOptions={[10]}
                  />
                ) : null}
              </TableContainer>
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
    </div>
  );
};

export default GenerateReport;

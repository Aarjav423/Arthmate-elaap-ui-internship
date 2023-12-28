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
import Autocomplete from "@mui/material/Autocomplete";
import { colendersListWatcher } from "../../../actions/colenders.js";
import { useDispatch } from "react-redux";
import { storedList } from "../../../util/localstorage";
import TablePagination from "@mui/material/TablePagination";
import moment from "moment";
import { AlertBox } from "../../../components/AlertBox";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import { checkAccessTags } from "../../../util/uam";
import CustomDatePicker from "../../../components/DatePicker/customDatePicker.js";
import { verifyDateAfter1800 } from "../../../util/helper";
const user = storedList("user");

const { getZipFIlesAPI, getZipFIleAPI } = require("../../../apis/reports.js");

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

const DownloadZipFile = props => {
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
  const [customDate, setCustomDate] = useState(true);
  const [filterData, setFilterdData] = useState(filterObj);
  const [colenderShortCode, setColenderShortCode] = useState("");
  const [co_lender_name, setCo_lender_name] = useState("");
  const [zipFiles, setZipFiles] = useState([]);
  const [zipFile, setZipFile] = useState("");
  const [reports, setReports] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [colenderID, setColenderID] = useState("");
  const [co_lender, setColender] = React.useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [reportName, setReportName] = useState(URLdata.split("/").slice(-1)[0]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    if (isTagged && checkAccessTags(["tag_colend_casedump_report_read_write"]))
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

  const fetchColendersList = () => {
    const payload = {};
    let names = [];
    let shortCode = [];
    new Promise((resolve, reject) => {
      dispatch(colendersListWatcher(payload, resolve, reject));
    })
      .then(res => {
        for (var i = 0; i < res.length; i++) {
          names.push(res[i].co_lender_name);
          shortCode.push(res[i].co_lender_shortcode);
        }
        const sortedArray = names.sort();
        const sortByCode = shortCode.sort();
        setColenderShortCode(sortByCode);
        setColenderNames(sortedArray);
        setColendersList(res.sort(compare));
      })
      .catch(error => {
        showAlert(error.res.data.message, "error");
      });
  };

  const handleChange = async function (event, label, value, reason) {
    if (value != null) {
      const colender_type = event.target.value;
      setColender(value);
      setCo_lender_name(value);
      const indexOfColender = colendersList
        .map(e => e.co_lender_name)
        .indexOf(value);
      const co_lender = colendersList[indexOfColender];
      const co_lender_id = co_lender.co_lender_id;
      const co_lender_shortcode = co_lender.co_lender_shortcode;
      setColenderID(co_lender_id);
      setColenderShortCode(co_lender_shortcode);
    }
  };

  const handleSearch = async value => {
    const payload = {
      from_date: fromDate,
      to_date: toDate,
      co_lender_shortcode: colenderShortCode
    };
    try {
      const response = await getZipFIlesAPI(payload);
      const data = response.data;
      setZipFiles(response.data);
    } catch (err) {
      showAlert(err?.response?.data?.message, "error");
    }
  };

  useEffect(() => {
    if (
      isTagged &&
      page !== 0 &&
      checkAccessTags(["tag_colend_casedump_report_read_write"])
    )
      handleSearch();
    if (!isTagged && page !== 0) handleSearch();
  }, [page]);

  const handleDownloadReport = async value => {
    const generatedDate = moment(value, "DD-MM-YYYY").format().substring(0, 10);
    const payload = {
      generated_date: generatedDate,
      co_lender_shortcode: colenderShortCode
    };
    const response = await getZipFIleAPI(payload);
    setZipFile(response.data);
    const file = new Blob([response.data], { type: "application/zip" });
    saveAs(file, `case_dump_report.zip`);
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
              margin: "10px 0",
              marginLeft: "20px"
            }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={colenderNames}
              value={co_lender_name}
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
            <Grid xs={4} item>
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
            <Grid xs={4} item>
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
            <Grid xs={4} item>
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

          <Grid xs={3} sx={{ ml: "0px" }} item>
            <Button
              disabled={
                isTagged
                  ? !checkAccessTags(["tag_colend_casedump_report_read_write"])
                  : false
              }
              style={{
                backgroundColor: "#5e72e4",
                color: "#fff",
                marginTop: "20px",
                marginLeft: "-15px"
              }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        <Grid
          xs={12}
          sx={{
            margin: "10px 0"
          }}
        >
          <Grid>
            <Divider />
          </Grid>
          {zipFiles.length ? (
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
                      <StyledTableCell>Co-Lender</StyledTableCell>
                      <StyledTableCell>
                        Generation date and time
                      </StyledTableCell>
                      <StyledTableCell> Download</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {zipFiles
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((x, index) => {
                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              {x.co_lender_name}
                            </StyledTableCell>
                            <StyledTableCell>
                              {x.generated_date}
                            </StyledTableCell>
                            <StyledTableCell>
                              <Tooltip
                                title="Download File"
                                placement="top"
                                arrow
                              >
                                <IconButton
                                  aria-label="Download File"
                                  color="primary"
                                  onClick={e =>
                                    handleDownloadReport(x.generated_date)
                                  }
                                >
                                  <ArrowCircleDownIcon />
                                </IconButton>
                              </Tooltip>
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                sx={{
                  "& .MuiTablePagination-toolbar": {
                    display: "flex",
                    alignItems: "baseline"
                  },
                  float: "right",
                  marginTop: "20px",
                  marginLeft: "-20px"
                }}
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={zipFiles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              >
                {" "}
              </TablePagination>
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
    </div>
  );
};

export default DownloadZipFile;

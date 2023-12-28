import * as React from "react";
import { useEffect, useState } from "react";
import { styled } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { tableCellClasses } from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import CustomDropdown from "../../components/custom/customSelect";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import moment from "moment";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import CompanyDropdown from "../../components/Company/CompanySelect";
import ServicesDropdown from "components/Dropdowns/ServicesDropdown";
import BasicDatePicker from "../../components/DatePicker/basicDatePicker";
import { getServiceInvoiceWatcher } from "../../actions/services";
import { AlertBox } from "../../components/AlertBox";
import TablePagination from "@mui/material/TablePagination";
import CustomDatePicker from "../../components/DatePicker/customDatePicker";
import { verifyDateAfter1800 } from "../../util/helper";

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

const types = [
  {
    value: "all",
    label: "All"
  },
  {
    value: "request",
    label: "Request"
  },
  {
    value: "response",
    label: "Response"
  }
];
let filterObj = {
  company: null,
  product: null,
  fromDate: null,
  toDate: null,
  status: null,
  searchText: null
};

export default function ServiceInvoice(props) {
  // const {isCustomDatePicker} = props;
  const {
    reportName,
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
  const dispatch = useDispatch();
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState({});
  const [customDate, setCustomDate] = useState(true);
  const [service, setService] = useState([]);
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [serviceInvoice, setServiceInvoice] = useState([]);
  const [severity, setSeverity] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [filterData, setFilterdData] = useState(filterObj);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (company && fromDate && toDate && service) handleSearchClick();
  }, [page]);

  const handleSearchClick = () => {
    const filterData = {};
    if (company) filterData.company_id = company?.value;
    if (service) filterData.service_id = service?.id;
    if (type && type.value !== "all") filterData.type = type.value;
    if (fromDate) filterData.from_date = moment(fromDate).format("YYYY-MM-DD");
    if (toDate) filterData.to_date = moment(toDate).format("YYYY-MM-DD");
    filterData.page = page;
    dispatch(
      getServiceInvoiceWatcher(
        filterData,
        response => {
          setServiceInvoice(response.data);
          setCount(response?.count);
        },
        error => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
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

  return (
    <Grid container xs={12} sx={{ marginLeft: "1.3rem!important" }}>
      <Grid xs={12}>
        <Typography sx={{ mt: 2 }} variant="h6">
          Service usage
        </Typography>
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}
        <Grid xs={12} sx={{ mt: 2, ml: 1 }} container spacing={1}>
          <Grid
            xs={12}
            sm={6}
            md={5}
            container
            item
            sx={{ display: "flex" }}
            spacing={1}
          >
            <Grid xs={6} item>
              <CompanyDropdown
                placeholder="Select company"
                company={company}
                onCompanyChange={value => {
                  setCompany(value);
                  setServiceInvoice([]);
                }}
              />
            </Grid>
            <Grid xs={6} item>
              <FormControl variant="filled" component={Box} width="100%">
                <ServicesDropdown
                  id="select-service"
                  placeholder="Select service"
                  valueData={service}
                  onValueChange={value => {
                    setService(value);
                    setServiceInvoice([]);
                  }}
                  helperText={!service ? "Service is required" : ""}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            xs={12}
            sm={6}
            md={4}
            item
            container
            spacing={1}
            sx={{ display: "flex", alignSelf: "center" }}
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
          <Grid xs={12} sm={6} md={3} item sx={{ alignSelf: "center" }}>
            <FormControl variant="filled" component={Box} width="50%">
              <CustomDropdown
                placeholder="Select type"
                data={types}
                value={type}
                handleDropdownChange={value => {
                  setType(value);
                  setServiceInvoice([]);
                }}
              />
            </FormControl>

            <IconButton
              aria-label="handle-search"
              onClick={() => {
                handleSearchClick();
              }}
            >
              <ManageSearchIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
        {serviceInvoice.length ? (
          <Grid
            item
            xs={12}
            sx={{
              mt: "30px"
            }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell> Sr No.</StyledTableCell>
                    <StyledTableCell> Company Name</StyledTableCell>
                    <StyledTableCell> API Name</StyledTableCell>
                    <StyledTableCell> Date</StyledTableCell>
                    <StyledTableCell> Type</StyledTableCell>
                    <StyledTableCell> Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceInvoice &&
                    serviceInvoice.map((item, index) => (
                      <StyledTableRow key={item._id}>
                        <StyledTableCell scope="row">
                          {page * 15 + index + 1}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item.company_name}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item.api_name}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {moment(item.timestamp).format("YYYY-MM-DD")}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item.request_type}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item.api_response_status}
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
                  rowsPerPage={15}
                  rowsPerPageOptions={[10]}
                />
              ) : null}
            </TableContainer>
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
}

import * as React from "react";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getEmiDataWatcher, submitForNachWatcher } from "../../actions/enach";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { styled } from "@material-ui/core/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import { AlertBox } from "../../components/AlertBox";
import { storedList } from "../../util/localstorage";
import Preloader from "../../components/custom/preLoader";
import { checkAccessTags } from "../../util/uam";
import BasicFilter from "../../components/Filter/basic";
const user = storedList("user");
import { Link } from "react-router-dom";
import moment from "moment";

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

const EnachList = props => {
  const isLoading = useSelector(state => state.profile.loading);
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
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [result, setResult] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [filter, setFilter] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [enachStatus, setEnachStatus] = useState("active");

  const [checkCounter, setCheckCounter] = useState(0);

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  useEffect(() => {
    if (
      isTagged &&
      filter &&
      checkAccessTags([
        "tag_enach_presentation_read",
        "tag_enach_presentation_read_write"
      ])
    )
      getEMIData();
    if (!isTagged && filter) getEMIData();
  }, [filter, page]);

  const handleSelectAllRecord = data => {
    setIsAllSelect(!isAllSelect);
    setResult(
      result.map(item => {
        return { ...item, checked: !isAllSelect };
      })
    );
    if (data?.target?.checked) {
      let pendingPresentmentData = [];
      result.forEach(item => {
        if (item.nach_presentment_status !== "initiated") {
          item.checked = !isAllSelect;
          pendingPresentmentData.push(item);
        }
      });
      setSelectedRecords(pendingPresentmentData);
      setCheckCounter(pendingPresentmentData.length + 1);
    } else {
      setSelectedRecords([]);
      setCheckCounter(0);
    }
  };

  const handleSelectSignalRecord = (event, idx) => {
    let newRecords = [...result];
    newRecords[idx].checked = !newRecords[idx].checked;
    setResult(newRecords);
    if (event?.target?.checked) {
      let selected = selectedRecords;
      selected.push(newRecords[idx]);
      setSelectedRecords(selected);
      setCheckCounter(checkCounter + 1);
      if (checkCounter + 1 === result.length) setIsAllSelect(true);
    } else {
      setCheckCounter(checkCounter - 1);
      setIsAllSelect(false);
      let selected = [];
      newRecords.map(item => {
        if (item.checked && item.nach_presentment_status !== "initiated")
          selected.push(item);
      });
      setSelectedRecords(selected);
    }
  };

  const getEMIData = () => {
    const data = {
      company_id: company.value,
      product_id: product.value,
      page,
      limit: rowsPerPage,
      fromRange: fromDate,
      toRange: toDate,
      searchBy: searchBy || null,
      status: enachStatus
    };

    dispatch(
      getEmiDataWatcher(
        data,
        response => {
          response.repaymentRecords.forEach(item => {
            if (item.nach_presentment_status === "initiated") {
              item.checked = false;
            }
          });
          setResult(response.repaymentRecords);
          setCount(response.count);
          setSelectedRecords([]);
          setIsAllSelect(false);
        },
        error => {
          showAlert(error.response.data.message, "error");
          setResult([]);
          setSelectedRecords([]);
          setIsAllSelect(false);
        }
      )
    );
  };

  const onSearchClickUpdated = data => {
    if (!data.company?.value)
      return showAlert("Please select company", "error");
    if (!data.product?.value)
      return showAlert("Please select product", "error");
    if (!data.enachStatus?.value)
      return showAlert("Please select status", "error");
    setSearchBy(data.searchText);
    setIsAllSelect(false);
    setSelectedRecords([]);
    setPage(0);
    setResult([]);
    setCompany(data.company);
    setProduct(data.product);
    setSortOrder("desc");
    setFromDate(data.fromDate);
    setToDate(data.toDate);
    setEnachStatus(data.enachStatus.value);
    setFilter({
      company_id: data.company.value,
      product_id: data.product.value
    });
  };

  const clearAll = () => {
    setSelectedRecords([]);
    setPage(0);
    setResult([]);
    setFilter("");
    setSortOrder("desc");
    setIsAllSelect(false);
    setCompany("");
    setProduct("");
    setSearchBy("");
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
    setSortOrder("desc");
    setPage(newPage);
    setSelectedRecords([]);
    setIsAllSelect(false);
  };

  const handleSortByNextPresentation = () => {
    let sort = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(sort);
    if (sort === "asc") {
      result.sort((a, b) => {
        if (a.DUE_DAY > b.DUE_DAY) {
          return -1;
        }
      });
    } else {
      result.sort((a, b) => {
        if (a.DUE_DAY < b.DUE_DAY) {
          return -1;
        }
      });
    }
  };

  const handleNavLoanDetails = item => {
    window.open(
      `/admin/loan/details/${company.lms_version}/${item.LOAN_NO}/${product.value}/${company.value}/${product.loan_schema_id}/1`,
      "_blank"
    );
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
      <Typography sx={{ mt: 2, ml: 2 }} variant="h6">
        eNACH Presentation
      </Typography>
      <CardContent>
        <Grid xs={12}>
          <BasicFilter
            isCustomDatePicker={false}
            company={company}
            product={product}
            fromDate={fromDate}
            toDate={toDate}
            isViewSearch={true}
            isViewFromDate={true}
            isViewToDate={true}
            onSearchClick={onSearchClickUpdated}
            mandatoryFields={{
              company: true,
              partner: true,
              product: true,
              fromDate: true,
              toDate: true
            }}
            isViewStatus={false}
            isViewMinAmount={false}
            isViewMaxAmount={false}
            displayEnachDropdown={true}
            defaultFromDate={moment().format("YYYY/MM/DD")}
          />
        </Grid>

        {isTagged && result.length ? (
          checkAccessTags([
            "tag_enach_presentation_read",
            "tag_enach_presentation_read_write"
          ]) ? (
            <TableContainer sx={{ mt: 4 }} component={Paper}>
              <Table
                sx={{ minWidth: 700 }}
                aria-label="customized table"
                id="pdf"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Txn ID </StyledTableCell>
                    <StyledTableCell> Loan id</StyledTableCell>
                    <StyledTableCell> Registration ID</StyledTableCell>
                    <StyledTableCell> UMRN</StyledTableCell>
                    <StyledTableCell> Customer name </StyledTableCell>
                    <StyledTableCell> Installment amount </StyledTableCell>
                    <StyledTableCell> Due amount (Exc Excess Funds)
                    </StyledTableCell>
                    <StyledTableCell> Reason </StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result &&
                    result.map((item, idx) => (
                      <StyledTableRow key={item.idx}>
                        <StyledTableCell scope="row">
                          {item?.TXN_ID}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          <div onClick={() => handleNavLoanDetails(item)}>
                            <Link>{item.LOAN_NO}</Link>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.REFERENCE_ID}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.UMRN}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.CUST_NAME}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.INSTALLMENT_AMOUNT}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.DUE_AMOUNT}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.REASON? item.REASON: "NA"}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {item?.STATUS
                            ? item.STATUS
                            : "NA"}
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
                  <StyledTableCell>  Txn ID  </StyledTableCell>
                  <StyledTableCell> Loan id </StyledTableCell>
                  <StyledTableCell> Registration ID</StyledTableCell>
                  <StyledTableCell> UMRN</StyledTableCell>
                  <StyledTableCell> Customer name </StyledTableCell>
                    <StyledTableCell> Installment amount </StyledTableCell>
                    <StyledTableCell>
                      Due amount (Exc Excess Funds)
                    </StyledTableCell>
                    <StyledTableCell> Reason </StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result &&
                  result.map((item, idx) => (
                    <StyledTableRow key={item.idx}>
                    <StyledTableCell scope="row">
                          {item?.TXN_ID}
                        </StyledTableCell>
                      <StyledTableCell scope="row">
                        <div onClick={() => handleNavLoanDetails(item)}>
                          <Link>{item.LOAN_NO}</Link>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {item?.MANDATE_REF_NO}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {item?.UMRN}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {item?.CUST_NAME}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {item?.EMI_AMOUNT}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {item?.DUE_AMOUNT}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {item?.REASON ?item.REASON: "NA"}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {item?. STATUS
                          ? item. STATUS
                          : "NA"}
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
        ) : null}
      </CardContent>
      {isLoading && <Preloader />}
    </>
  );
};

export default EnachList;

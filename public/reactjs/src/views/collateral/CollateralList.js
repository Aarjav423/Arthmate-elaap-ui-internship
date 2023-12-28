import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
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
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import BasicFilter from "../../components/Filter/basic";
import { storedList } from "../../util/localstorage";
import { Button, Divider } from "@mui/material";
import { connect } from "react-redux";
import DownloadLoanFiles from "../lending/DownloadLoanFiles";
import TablePagination from "@mui/material/TablePagination";
import { loanStatusList } from "../../util/helper";
import { getCollateralListWatcher } from "../../actions/collateral";
import { AlertBox } from "../../components/AlertBox";
import { Link } from "react-router-dom";
import { checkAccessTags } from "../../util/uam";

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

const CollateralList = (props) => {
  const history = useHistory();
  const [filter, setFilter] = useState("");
  const [queue, setLoanQueue] = useState([]);
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [page, setPage] = React.useState(0);
  const [count, setCount] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [collateralList, setCollateralList] = useState([]);
  const [showInputButtonFlag, setShowInputButtonFlag] = useState(false);
  const user = storedList("user");

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const getCollateralList = () => {
    const payload = {
      sendData: {
        ...filter,
        page: page,
        limit: rowsPerPage
      },
      userData: {
        user_id: user._id,
        ...filter
      }
    };
    new Promise((resolve, reject) => {
      dispatch(getCollateralListWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setCollateralList(response?.rows);
        setCount(response?.count);
      })
      .catch((error) => {
        setCollateralList([]);
        showAlert(error?.response?.data?.message, "error");
      });
  };

  useEffect(() => {
    if (
      isTagged &&
      filter &&
      checkAccessTags(["tag_collateral_read", "tag_collateral_read_write"])
    )
      getCollateralList();
    if (filter) getCollateralList();
  }, [filter, page]);

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
    setCompany(data.company);
    setProduct(data?.product);
    setFromDate(data.fromDate);
    setToDate(data?.toDate);
    setFilter({
      company_id: data.company.value,
      product_id: data.product.value,
      from_date: data.fromDate,
      to_date: data.toDate,
      str: data.searchText,
      loan_schema_id: data.product.loan_schema_id,
      loan_status: data?.status
    });
    setShowInputButtonFlag(true);
  };

  const handleEditRecord = (row) => {
    history.push({
      pathname: `/admin/collateral_edit/${row._id}`
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenDocuments = (row) => {
    window.open(
      `/admin/template/loandoclist/${row.company_id}/${row.product_id}/${row.loan_app_id}/pdf`,
      "_blank"
    );
  };

  const handleOpenCollateralPage = () => {
    window.open(
      `/admin/collateral/${company.value}/${product.value}/`,
      "_blank"
    );
  };

  const handleNav = (row) => {
    if (
      (isTagged && checkAccessTags(["tag_collateral_read_write"])) ||
      !isTagged
    ) {
      window.open(
        `/admin/loan/details/${company.lms_version}/${row.loan_id}/${row.product_id}/${row.company_id}/${filter.loan_schema_id}/1`,
        "_blank"
      );
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
      <Typography
        sx={{
          mt: 2,
          ml: 2
        }}
        variant="h6"
      >
        Collateral list
      </Typography>
      <CardContent>
        <Grid xs={12}>
          <BasicFilter
            isCustomDatePicker={true}
            company={company}
            product={product}
            fromDate={fromDate}
            toDate={toDate}
            isViewSearch={true}
            isViewFromDate={true}
            isViewToDate={true}
            onSearchClick={onSearchClick}
            mandatoryFields={{
              company: true,
              partner: true,
              product: true,
            }}
            statusList={loanStatusList}
            isViewStatus={false}
            isViewMinAmount={false}
            isViewMaxAmount={false}
          />
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
          mb={2}
        >
          <Grid item>
            <Button
              variant={"contained"}
              disabled={
                isTagged
                  ? !(
                    checkAccessTags(["tag_collateral_read_write"]) &&
                    showInputButtonFlag
                  )
                  : !showInputButtonFlag
              }
              onClick={handleOpenCollateralPage}
            >
              Input collateral data
            </Button>
          </Grid>
          <Grid item>
            <DownloadLoanFiles
              loanData={collateralList}
              company={company}
              product={product}
              disabled={
                isTagged
                  ? !(
                    checkAccessTags(["tag_collateral_export"]) &&
                    collateralList.length
                  )
                  : !collateralList.length
              }
              handleAleart={(error, message, type) =>
                showAlert(error?.response?.data?.message || message, type)
              }
              isCollateral={true}
            />
          </Grid>
        </Grid>
        <Grid>
          <Divider />
        </Grid>
        {collateralList.length ? (
          <Grid xs={12}>
            {isTagged ? (
              checkAccessTags([
                "tag_collateral_read",
                "tag_collateral_read_write"
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
                        <StyledTableCell> Loan id </StyledTableCell>
                        <StyledTableCell> Partner id </StyledTableCell>
                        <StyledTableCell> First name </StyledTableCell>
                        <StyledTableCell> Last name </StyledTableCell>
                        <StyledTableCell> Chassis number </StyledTableCell>
                        <StyledTableCell> Engine number </StyledTableCell>
                        <StyledTableCell>
                          Insurance partner name
                        </StyledTableCell>
                        <StyledTableCell> Invoice amount </StyledTableCell>
                        <StyledTableCell> Invoice date </StyledTableCell>
                        <StyledTableCell> Invoice number </StyledTableCell>
                        <StyledTableCell> Policy expiry date </StyledTableCell>
                        <StyledTableCell>
                          {" "}
                          Policy issuance date{" "}
                        </StyledTableCell>
                        <StyledTableCell> Policy number </StyledTableCell>
                        <StyledTableCell>
                          Vehicle registration number
                        </StyledTableCell>
                        <StyledTableCell>Brand</StyledTableCell>
                        <StyledTableCell>Model name</StyledTableCell>
                        <StyledTableCell>Sub-model</StyledTableCell>
                        <StyledTableCell>Type</StyledTableCell>
                        <StyledTableCell>Documents</StyledTableCell>
                        <StyledTableCell> Action </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {collateralList &&
                        collateralList.map((item) => (
                          <StyledTableRow key={item._id}>
                            <StyledTableCell scope="row">
                              <div onClick={() => handleNav(item)}>
                                <Link>{item?.loan_id}</Link>
                              </div>
                            </StyledTableCell>

                            <StyledTableCell scope="row">
                              {item.company_id ? item.company_id : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.first_name ? item.first_name : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.last_name ? item.last_name : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.chassis_number ? item.chassis_number : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.engine_number ? item.engine_number : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.insurance_partner_name
                                ? item.insurance_partner_name
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.invoice_amount
                                ? item.invoice_amount.toFixed(2)
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.invoice_date
                                ? moment(item.invoice_date).format("YYYY-MM-DD")
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.invoice_number ? item.invoice_number : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.policy_expiry_date
                                ? moment(item.policy_expiry_date).format(
                                  "YYYY-MM-DD"
                                )
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.policy_issuance_date
                                ? moment(item.policy_issuance_date).format(
                                  "YYYY-MM-DD"
                                )
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.policy_number ? item.policy_number : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.vehicle_registration_number
                                ? item.vehicle_registration_number
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.vehicle_brand ? item.vehicle_brand : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.vehicle_model ? item.vehicle_model : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.vehicle_sub_model
                                ? item.vehicle_sub_model
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.vehicle_type ? item.vehicle_type : ""}
                            </StyledTableCell>
                            <StyledTableCell>
                              <Tooltip title="Documents" placement="top" arrow>
                                <IconButton
                                  aria-label="open documents"
                                  color="primary"
                                  disabled={
                                    isTagged
                                      ? !checkAccessTags([
                                        "tag_documents_read",
                                        "tag_documents_read_write",
                                        "tag_collateral_read_write"
                                      ])
                                      : false
                                  }
                                  onClick={() => {
                                    handleOpenDocuments(item);
                                  }}
                                >
                                  <DocumentScannerIcon fontSize="medium" />
                                </IconButton>
                              </Tooltip>
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              <Tooltip title="Edit loan" placement="top" arrow>
                                <IconButton
                                  aria-label="fill loan info"
                                  color="primary"
                                  disabled={
                                    isTagged
                                      ? !checkAccessTags([
                                        "tag_collateral_read_write"
                                      ])
                                      : false
                                  }
                                  onClick={() => {
                                    handleEditRecord(item);
                                  }}
                                >
                                  <EditIcon />
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
                      <StyledTableCell> Loan id </StyledTableCell>
                      <StyledTableCell> Partner id </StyledTableCell>
                      <StyledTableCell> First name </StyledTableCell>
                      <StyledTableCell> Last name </StyledTableCell>
                      <StyledTableCell> Chassis number </StyledTableCell>
                      <StyledTableCell> Engine number </StyledTableCell>
                      <StyledTableCell>Insurance partner name</StyledTableCell>
                      <StyledTableCell> Invoice amount </StyledTableCell>
                      <StyledTableCell> Invoice date </StyledTableCell>
                      <StyledTableCell> Invoice number </StyledTableCell>
                      <StyledTableCell> Policy expiry date </StyledTableCell>
                      <StyledTableCell> Policy issuance date </StyledTableCell>
                      <StyledTableCell> Policy number </StyledTableCell>
                      <StyledTableCell>
                        Vehicle registration number
                      </StyledTableCell>
                      <StyledTableCell>Brand</StyledTableCell>
                      <StyledTableCell>Model name</StyledTableCell>
                      <StyledTableCell>Sub-model</StyledTableCell>
                      <StyledTableCell>Type</StyledTableCell>
                      <StyledTableCell>Documents</StyledTableCell>
                      <StyledTableCell> Action </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {collateralList &&
                      collateralList.map((item) => (
                        <StyledTableRow key={item._id}>
                          <StyledTableCell scope="row">
                            <div onClick={() => handleNav(item)}>
                              <Link>{item?.loan_id}</Link>
                            </div>
                          </StyledTableCell>

                          <StyledTableCell scope="row">
                            {item.company_id ? item.company_id : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.first_name ? item.first_name : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.last_name ? item.last_name : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.chassis_number ? item.chassis_number : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.engine_number ? item.engine_number : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.insurance_partner_name
                              ? item.insurance_partner_name
                              : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.invoice_amount
                              ? item.invoice_amount.toFixed(2)
                              : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.invoice_date
                              ? moment(item.invoice_date).format("YYYY-MM-DD")
                              : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.invoice_number ? item.invoice_number : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.policy_expiry_date
                              ? moment(item.policy_expiry_date).format(
                                "YYYY-MM-DD"
                              )
                              : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.policy_issuance_date
                              ? moment(item.policy_issuance_date).format(
                                "YYYY-MM-DD"
                              )
                              : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.policy_number ? item.policy_number : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.vehicle_registration_number
                              ? item.vehicle_registration_number
                              : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.vehicle_brand ? item.vehicle_brand : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.vehicle_model ? item.vehicle_model : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.vehicle_sub_model
                              ? item.vehicle_sub_model
                              : ""}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.vehicle_type ? item.vehicle_type : ""}
                          </StyledTableCell>
                          <StyledTableCell>
                            <Tooltip title="Documents" placement="top" arrow>
                              <IconButton
                                aria-label="open documents"
                                color="primary"
                                onClick={() => {
                                  handleOpenDocuments(item);
                                }}
                              >
                                <DocumentScannerIcon fontSize="medium" />
                              </IconButton>
                            </Tooltip>
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            <Tooltip title="Edit loan" placement="top" arrow>
                              <IconButton
                                aria-label="fill loan info"
                                color="primary"
                                onClick={() => {
                                  handleEditRecord(item);
                                }}
                              >
                                <EditIcon />
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
            )}
          </Grid>
        ) : null}
      </CardContent>
    </>
  );
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(null, null)(CollateralList);

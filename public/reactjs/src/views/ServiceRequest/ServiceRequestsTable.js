import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import { styled } from "@material-ui/core/styles";
import moment from "moment";
import { Button } from "@mui/material";
import { useState } from "react";
import { putServiceRequestAction } from "../../actions/service-request";
import { storedList } from "../../util/localstorage";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { checkAccessTags } from "../../util/uam";
const user = storedList("user");
import { Link } from "react-router-dom";

export default function ServiceRequestsTable(props) {
  const {
    data,
    value,
    index,
    setPage,
    count,
    page,
    handleChangePage,
    showAlert,
    getServiceRequest,
    company,
    disabled,
    ...other
  } = props;

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

  const user = storedList("user");
  const [selectedRow, setSelectedRow] = useState();
  const [openAction, setOpenAction] = useState(false);
  const [isReadable, setIsReadable] = useState(false);
  const [remarks, setRemarks] = useState();
  const dispatch = useDispatch();
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const handleClose = () => {
    setOpenAction(false);
  };

  const handleSubmit = (is_approved) => {
    if (!remarks) return showAlert("Comment is required", "error");

    if (Date.now() > new Date(selectedRow?.validity_date)) {
      return showAlert("Request is expired", "error");
    }

    const payload = {
      loan_id: selectedRow?.loan_id,
      sr_req_id: selectedRow?.sr_req_id,
      id: selectedRow?._id,
      is_approved: is_approved,
      remarks: remarks,
      user_id: user._id,
      product_id: selectedRow?.product_id,
      company_id: selectedRow?.company_id
    };
    dispatch(
      putServiceRequestAction(
        payload,
        (response) => {
          showAlert(response?.message, "success");
          setOpenAction(false);
          getServiceRequest();
        },
        (error) => {
          showAlert(error?.response?.data?.message, "error");
          setOpenAction(false);
          getServiceRequest();
        }
      )
    );
  };

  const handleNavForeClosureRequestDetails = (row) => {
    window.open(
      `/admin/foreclosure-request-details/${row.company_id}/${row.product_id}/${row.loan_id}/${row._id}`,
      "_blank"
    );
  };

  const handleNavLoanDetails = (row) => {
    window.open(
      `/admin/loan/details/${row.company.lms_version}/${row.loan_id}/${row.product_id}/${row.company_id}/${row.product.loan_schema_id}/1`,
      "_blank"
    );
  }

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2)
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
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  return (
    <>
      <div
        role="tabpanel"
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        <Dialog
          onClose={handleClose}
          open={openAction}
          fullWidth
          maxWidth={"xl"}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Foreclosure service request
          </BootstrapDialogTitle>
          <DialogContent>
            <Grid mt={2} ml={2} mr={2}>
              <Card>
                <CardContent>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography>
                        <b> Request id: </b> {selectedRow?.sr_req_id}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        <b> Loan id: </b> {selectedRow?.loan_id}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        <b> Borrower id: </b> {selectedRow?.borrower_id}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        <b> Customer name: </b> {selectedRow?.customer_name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography>
                        <b> partner name: </b>
                        {company?.label}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        <b> product name: </b>
                        {selectedRow?.product_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        <b>Loan amount: </b> {selectedRow?.sanction_amount}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        <b> Status: </b>{" "}
                        {isReadable
                          ? selectedRow?.is_approved === "Y"
                            ? "Approved"
                            : selectedRow?.is_approved === "N"
                            ? "Rejected"
                            : "Pending"
                          : "Pending"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid m={2}>
              <Card>
                <Grid container direction="row" ml={1} bgcolor={"green"}>
                  <Grid item xs={11}>
                    <Typography sx={{ fontWeight: "bold" }} color={"white"}>
                      REQUEST DETAILS
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography sx={{ fontWeight: "bold" }} color={"white"}>
                      {moment(selectedRow?.request_date).format("YYYY-MM-DD")}
                    </Typography>
                  </Grid>
                </Grid>

                <CardContent>
                  <Grid
                    container
                    mb={1}
                    direction="row"
                    justifyContent={"space-between"}
                  >
                    <Grid item>
                      {isReadable ? (
                        <Typography>
                          <b> Requested foreclosure date: </b>{" "}
                          {moment(selectedRow?.request_date).format(
                            "YYYY-MM-DD"
                          )}
                        </Typography>
                      ) : (
                        <Typography>
                          <b> Request date: </b>{" "}
                          {moment(selectedRow?.request_date).format(
                            "YYYY-MM-DD"
                          )}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item>
                      {isReadable ? (
                        <Typography>
                          <b> foreclosure validity date: </b>{" "}
                          {moment(selectedRow?.validity_date).format(
                            "YYYY-MM-DD"
                          )}
                        </Typography>
                      ) : (
                        <Typography>
                          <b> Request valid till: </b>{" "}
                          {moment(selectedRow?.validity_date).format(
                            "YYYY-MM-DD"
                          )}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                  <Grid>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <StyledTableCell> Description </StyledTableCell>
                            <StyledTableCell> AM System </StyledTableCell>
                            <StyledTableCell> Partner system </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow key={0}>
                            <TableCell scope="row">
                              {" "}
                              Principal outstanding{" "}
                            </TableCell>
                            <TableCell scope="row">
                              {" "}
                              {selectedRow?.prin_os}{" "}
                            </TableCell>
                            <TableCell scope="row">
                              {" "}
                              {selectedRow?.prin_requested}{" "}
                            </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                            <TableCell scope="row"> Interest </TableCell>
                            <TableCell scope="row">
                              {" "}
                              {selectedRow?.int_calculated}{" "}
                            </TableCell>
                            <TableCell scope="row">
                              {" "}
                              {selectedRow?.int_requested}{" "}
                            </TableCell>
                          </TableRow>
                          <TableRow key={2}>
                            <TableCell scope="row">
                              {" "}
                              Foreclosure Charges{" "}
                            </TableCell>
                            <TableCell scope="row">
                              {" "}
                              {selectedRow?.foreclosure_charges_calculated}{" "}
                            </TableCell>
                            <TableCell scope="row">
                              {" "}
                              {selectedRow?.foreclosure_charge_requested}{" "}
                            </TableCell>
                          </TableRow>
                          <TableRow key={3}>
                            <TableCell scope="row">
                              {" "}
                              GST on Foreclosure Charges{" "}
                            </TableCell>
                            <TableCell scope="row">
                              {" "}
                              {
                                selectedRow?.gst_foreclosure_charges_calculated
                              }{" "}
                            </TableCell>
                            <TableCell scope="row">
                              {" "}
                              {
                                selectedRow?.gst_foreclosure_charge_requested
                              }{" "}
                            </TableCell>
                          </TableRow>
                          <TableRow key={4}>
                            <TableCell scope="row"> Waiver </TableCell>
                            <TableCell scope="row"> 0 </TableCell>
                            <TableCell scope="row">
                              {" "}
                              {selectedRow?.waiver_requested}{" "}
                            </TableCell>
                          </TableRow>
                          <TableRow key={5}>
                            <TableCell scope="row"> Total Amount </TableCell>
                            <TableCell scope="row">
                              {" "}
                              {
                                selectedRow?.total_foreclosure_amt_calculated
                              }{" "}
                            </TableCell>
                            <TableCell scope="row">
                              {" "}
                              {
                                selectedRow?.total_foreclosure_amt_requested
                              }{" "}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid m={2}>
              <Card>
                <CardContent>
                  <TextField
                    label="Comments"
                    fullWidth
                    InputProps={{
                      readOnly: isReadable
                    }}
                    value={remarks}
                    variant={"standard"}
                    autoFocus={true}
                    onChange={(event) => {
                      setRemarks(event.target.value);
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid display={"flex"} justifyContent={"center"}>
              <Typography>
                <b>Total amount payable : </b>{" "}
                {selectedRow?.total_foreclosure_amt_requested}
              </Typography>
            </Grid>

            {isTagged && !isReadable ? (
              checkAccessTags(["tag_service_requests_read_write"]) ? (
                <Grid
                  m={2}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      onClick={() => handleSubmit("Y")}
                    >
                      Approve
                    </Button>
                  </Grid>
                  <Button variant="contained" onClick={() => handleSubmit("N")}>
                    Reject
                  </Button>
                </Grid>
              ) : null
            ) : !isReadable ? (
              <Grid
                m={2}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Grid item xs={6}>
                  <Button variant="contained" onClick={() => handleSubmit("Y")}>
                    Approve
                  </Button>
                </Grid>
                <Button variant="contained" onClick={() => handleSubmit("N")}>
                  Reject
                </Button>
              </Grid>
            ) : null}
          </DialogContent>
        </Dialog>
        <Box sx={{ p: 3 }}>
          {data && data.length ? (
            <TableContainer>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell> Request ID </StyledTableCell>
                    <StyledTableCell> Loan ID </StyledTableCell>
                    <StyledTableCell> Customer name </StyledTableCell>
                    <StyledTableCell> Request type </StyledTableCell>
                    <StyledTableCell> Requested by </StyledTableCell>
                    <StyledTableCell> Request date and time </StyledTableCell>
                    <StyledTableCell> Valid till </StyledTableCell>
                    <StyledTableCell> Status </StyledTableCell>
                    {/* {!value ? (
                      <StyledTableCell> Action </StyledTableCell>
                    ) : (
                      <StyledTableCell> View Details </StyledTableCell>
                    )} */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data &&
                    data.map((item, index) => ( 
                      <TableRow key={index}>
                          <StyledTableCell align="left">
                        <div
                          onClick={() => handleNavForeClosureRequestDetails(item)}
                        >
                          <Link>{item._id}</Link>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <div
                        onClick={() => handleNavLoanDetails(item)}
                        >
                          <Link>{item?.loan_id}</Link>
                        </div>
                      </StyledTableCell>
                        <TableCell scope="row">{item?.borrower_details?.customer_name}</TableCell>
                        <TableCell scope="row">{"Foreclosure"}</TableCell>
                        <TableCell scope="row">{item?.requestor_id}</TableCell>
                        <TableCell scope="row">
                          {moment(item?.request_date).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell scope="row">
                          {moment(item?.offers?.[item.offers.length - 1].foreclosure_date).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell scope="row">
                          {item?.status}
                        </TableCell>
                        {/* {!value ? (
                          <TableCell scope="row">
                            <IconButton
                              aria-label={"Action"}
                              disabled={
                                isTagged
                                  ? !checkAccessTags([
                                      "tag_service_requests_read",
                                      "tag_service_requests_read_write"
                                    ])
                                  : false
                              }
                              onClick={() => {
                                setOpenAction(true);
                                setSelectedRow(item);
                                setIsReadable(false);
                                setRemarks("");
                              }}
                              color={"primary"}
                            >
                              <RuleIcon />
                            </IconButton>
                          </TableCell>
                        ) : (
                          <TableCell scope="row">
                            <Tooltip title={"View details"}>
                              <IconButton
                                aria-label={"View Details"}
                                onClick={() => {
                                  setOpenAction(true);
                                  setSelectedRow(item);
                                  setRemarks(item?.remarks_by_approver);
                                  setIsReadable(true);
                                }}
                                color={"primary"}
                              >
                                <InfoIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        )} */}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {count ? (
                <TablePagination
                  component="div"
                  count={count}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={10}
                  rowsPerPageOptions={[10]}
                />
              ) : null}
            </TableContainer>
          ) : null}
        </Box>
      </div>
    </>
  );
}

ServiceRequestsTable.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

ServiceRequestsTable.defaultProps = {
  children: ""
};

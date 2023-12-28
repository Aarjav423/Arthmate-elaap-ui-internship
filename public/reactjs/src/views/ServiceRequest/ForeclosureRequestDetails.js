import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { AlertBox } from "../../components/AlertBox";
import * as React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@material-ui/core/styles";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import { tableCellClasses } from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { storedList } from "../../util/localstorage";
import Divider from "@material-ui/core/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import moment from "moment";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Stack from "@mui/material/Stack";
import { checkAccessTags } from "../../util/uam";
import {
  getForeClosureRequestDetailsByReqIdWatcher,
  updateForeClosureRequestSagaIdWatcher
} from "../../actions/foreclosureOffer"

import { getBorrowerDetailsByIdWatcher } from "../../actions/borrowerInfo";

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

export default function WaiverRequestDetails(props) {
  const dispatch = useDispatch();
  const user = storedList("user");
  const { company_id, product_id, loan_id, request_id } = useParams();
  const [loanData, setLoanData] = useState("");

  //alert
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const [foreClosureData, setForeClosureData] = useState("")
  const [dayIndex, setDayIndex] = useState(0);
  const [offers, setOffers] = useState({})
  const [product, setProduct] = useState("")
  const [company, setCompany] = useState("")
  const [comment, setComment] = useState("")
  const [isDisableApprove, setIsDisableApprove] = useState(false);
  const [isDisableReject, setIsDisableReject] = useState(false);
  let isTagged =
  process.env.REACT_APP_BUILD_VERSION > 1
    ? user?.access_metrix_tags?.length
    : false;
  isTagged= true;

  const  [borrowerDetails, setBorrowerDetails] = useState("")
  //Show alert
  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  //close alert
  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  //Fetch foreclosure details and loan details initially
  useEffect(() => {
    fetchLoandetails();
    getForeClosureDetailsByReqId();
  }, []);


  //Fetch forclosure details by req id.
  const getForeClosureDetailsByReqId = () => {
    const payload = {
      loan_id,
      request_id: request_id,
      company_id,
      product_id,
      user_id: user._id
    };
    dispatch(
      getForeClosureRequestDetailsByReqIdWatcher(
        payload,
        (response) => {
          setForeClosureData(response.data?.foreclosureRequestDetail)
          setBorrowerDetails(response.data?.borrower_details)
          setOffers(response.data?.foreclosureRequestDetail.offers)
          setProduct(response.data?.product)
          setCompany(response.data?.company)
        },
        (error) => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  };

    //Fetch loan details
    const fetchLoandetails = () => {
      const params = {
        company_id: company_id,
        product_id: product_id,
        loan_id: loan_id
      };
      dispatch(
        getBorrowerDetailsByIdWatcher(
          params,
          (result) => {
            setLoanData(result.data);
          },
          (error) => {
            return showAlert(error?.response?.data?.message, "error");
          }
        )
      );
    };

  useEffect(() => {
    if (foreClosureData.status == 'pending' && moment(foreClosureData.request_date).format('YYYY-MM-DD')  < moment(new Date()).format('YYYY-MM-DD')) {
      setIsDisableApprove(true)
    } else if (foreClosureData.status == 'approved') {
      setIsDisableApprove(true)
      setIsDisableReject(true)
    } else if (foreClosureData.status == 'invalid') {
      setIsDisableApprove(true)
      setIsDisableReject(true)
    } else if (foreClosureData.status == 'rejected') {
      setIsDisableApprove(true)
      setIsDisableReject(true)
    }
    else {
      setIsDisableApprove(false)
    }
  }, [foreClosureData])



  const handleApproveForeClosureRequest = async (status) => {
    try {
      let payload = {
        approver_id: user._id,
        approver_comment: comment,
        company_id,
        product_id,
        loan_id,
        status,
      };
      if(comment == ''){
        showAlert("Please add a comment", "error");
      }else{
        dispatch(
          updateForeClosureRequestSagaIdWatcher(
            payload,
            (response) => {
               showAlert(response?.message, "success");
               window.location.reload();
            },
            (error) => {
              return showAlert(error.response.data.message, "error");
            }
          )
        );
      }

    } catch (error) {
      return showAlert(error.response.data.message, "error");
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
      <Typography sx={{ mt: 3, ml: 2, mb: 3 }} variant="h6">
        Foreclosure service request
      </Typography>
      <Grid ml={2} mr={2}>
        <Card style={{ border: "none", boxShadow: "none" }}>
          <CardContent>
            <Grid container >
              <Grid item xs={2}>
                <Typography>
                  <div style={{ color: "grey", fontSize: "14px" }}>
                    Request ID
                  </div>
                  {foreClosureData ? foreClosureData._id : ""}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  <div style={{ color: "grey", fontSize: "14px" }}>
                    Loan ID
                  </div>
                  {foreClosureData ? foreClosureData.loan_id : ""}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>
                  <div style={{ color: "grey", fontSize: "14px" }}>
                    Loan Amount
                  </div>
                  {borrowerDetails ? borrowerDetails?.sanction_amount : ""}
                </Typography>
              </Grid>
              <Grid item xs={2.5}>
                <Typography>
                  <div style={{ color: "grey", fontSize: "14px" }}>
                    Partner name
                  </div>
                  {company ? company : ""}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>
                  <div style={{ color: "grey", fontSize: "14px" }}>
                    Product name
                  </div>
                  {product ? product : ""}
                </Typography>
              </Grid>
              <Grid item xs={2}  mt={2}>
                <Typography>
                  <div style={{ color: "grey", fontSize: "14px" }}>
                    Customer name
                  </div>
                  {loanData ? loanData?.first_name + " " + loanData?.last_name  : ""}
                </Typography>
              </Grid>
              <Grid item xs={2} mt={2}>
                <Typography>
                  <div style={{ color: "grey", fontSize: "14px" }}>
                    Status
                  </div>
                  {foreClosureData ? (foreClosureData.status == "pending" ? "Pending Approval" : foreClosureData.status) : ""}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid mt={2} ml={2} mr={2}>
        <Card
          style={{
            border: "none", boxShadow: "none",
            marginTop: "15px",
          }}
        >
          <CardContent
          >
            <Grid
              container
            >
                <Grid item xs={2}>
                  <Typography>
                    <div style={{ color: "grey", fontSize: "14px" }}> Day </div>
                    {dayIndex}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>
                    <div style={{ color: "grey", fontSize: "14px" }}>Date</div>
                    {moment(offers[dayIndex]?.foreclosure_date).format("YYYY-MM-DD")}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>
                    <div style={{ color: "grey", fontSize: "14px" }}>
                      Child ID
                    </div>
                    {foreClosureData._id}_{dayIndex}
                  </Typography>
                </Grid>
              <Grid item xs={6}>
                <Typography>
                  <Stack
                    style={{ float: "right", marginTop: "20px" }}
                    spacing={2}
                  >
                    <span>
                      <>
                        <span
                          style={{ color: dayIndex == 0 ? "grey" : "black", cursor: "pointer" }}
                          onClick={() =>
                            dayIndex > 0 ? setDayIndex(dayIndex - 1) : null
                          }
                        >
                          <ArrowBackIosIcon fontSize="small" />
                        </span>
                        <span>Day {dayIndex} </span>
                        <span
                          style={{
                            color:
                              dayIndex != foreClosureData.offers?.length - 1
                                ? "black"
                                : "grey",
                            cursor: "pointer"
                          }}
                          onClick={() =>
                            dayIndex < foreClosureData.offers.length - 1
                              ? setDayIndex(dayIndex + 1)
                              : null
                          }
                        >
                          <ArrowForwardIosIcon fontSize="small" />
                        </span>
                      </>
                    </span>
                  </Stack>
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Divider></Divider>
        <Grid>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Description </StyledTableCell>
                  <StyledTableCell>System Values</StyledTableCell>
                  <StyledTableCell>Waiver Requested Percentage</StyledTableCell>
                  <StyledTableCell>Waiver Requested</StyledTableCell>
                  <StyledTableCell>Requested Values</StyledTableCell>
                </TableRow>
              </TableHead>
              {
                foreClosureData.offers?.filter((offer) => offer.seq_id == dayIndex).map((offer) => {
                  const excess_received = foreClosureData.excess_received ? foreClosureData.excess_received  : 0
                  const total_of_waiver_requested = parseFloat(offer.interest_waiver) + parseFloat(offer.lpi_waiver) + parseFloat(offer.bounce_charges_waiver) + parseFloat(offer.gst_reversal_bc) + parseFloat(offer.fc_waiver) + parseFloat(offer.gst_reversal_fc)
                  const total_of_system_values =  parseFloat(offer.total_foreclosure_amt)
                  const requestedIntDue = parseFloat(offer.int_due) - parseFloat(offer.interest_waiver);
                  const requestedLpiDue = parseFloat(offer.lpi_due) - parseFloat(offer.lpi_waiver);
                  const requestedBounceCharges = parseFloat(offer.bounce_charges) - parseFloat(offer.bounce_charges_waiver);
                  const requestedGstOnBounceCharges = parseFloat(offer.gst_on_bc) - parseFloat(offer.gst_reversal_bc)
                  const requestedForeClosureCharges = parseFloat(offer.foreclosure_charges) - parseFloat(offer.fc_waiver)
                  const requestedGstOnForeClosureCharges = parseFloat(offer.gst_on_fc) - parseFloat(offer.gst_reversal_fc)
                  const total_foreclosure_requested_amt = (parseFloat(foreClosureData.prin_os) + requestedIntDue + requestedLpiDue + requestedBounceCharges + requestedGstOnBounceCharges + requestedForeClosureCharges + requestedGstOnForeClosureCharges) - excess_received
                  return (
                    <TableBody key={0}>
                      <TableRow key={0}>
                        <TableCell scope="row">
                          Principal outstanding
                        </TableCell>
                        <TableCell scope="row">
                          {parseFloat(foreClosureData.prin_os).toFixed(2)}
                        </TableCell>
                        <TableCell scope="row"> NA </TableCell>
                        <TableCell scope="row"> NA </TableCell>
                        <TableCell scope="row">
                          {parseFloat(foreClosureData.prin_os).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow key={1}>
                        <TableCell scope="row">
                          Interest Due
                        </TableCell>
                        <TableCell scope="row">
                          {parseFloat(offer.int_due).toFixed(2)}
                        </TableCell>
                        <TableCell scope="row"> {parseFloat(foreClosureData.interest_waiver_perc)}% </TableCell>
                        <TableCell scope="row"> {parseFloat(offer.interest_waiver).toFixed(2)} </TableCell>
                        <TableCell scope="row">
                          {parseFloat(requestedIntDue).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow key={2}>
                        <TableCell scope="row">
                          LPI Due
                        </TableCell>
                        <TableCell scope="row">
                          {parseFloat(offer.lpi_due).toFixed(2)}
                        </TableCell>
                        <TableCell scope="row"> {parseFloat(foreClosureData.lpi_waiver_perc)}% </TableCell>
                        <TableCell scope="row"> {parseFloat(offer.lpi_waiver).toFixed(2)} </TableCell>
                        <TableCell scope="row">
                          {parseFloat(requestedLpiDue).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow key={3}>
                        <TableCell scope="row">
                          Bounce charges
                        </TableCell>
                        <TableCell scope="row">
                          {parseFloat(offer.bounce_charges).toFixed(2)}
                        </TableCell>
                        <TableCell scope="row"> {parseFloat(foreClosureData.bounce_charge_waiver_perc)}% </TableCell>
                        <TableCell scope="row"> {parseFloat(offer.bounce_charges_waiver).toFixed(2)} </TableCell>
                        <TableCell scope="row">
                          {parseFloat(requestedBounceCharges).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow key={4}>
                        <TableCell scope="row">
                          GST on Bounce charges
                        </TableCell>
                        <TableCell scope="row">
                          {parseFloat(offer.gst_on_bc).toFixed(2)}
                        </TableCell>
                        <TableCell scope="row"> {parseFloat(foreClosureData.bounce_charge_waiver_perc)}% </TableCell>
                        <TableCell scope="row"> {parseFloat(offer.gst_reversal_bc).toFixed(2)} </TableCell>
                        <TableCell scope="row">
                          {parseFloat(requestedGstOnBounceCharges).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow key={5}>
                        <TableCell scope="row">
                          Foreclosure charges
                        </TableCell>
                        <TableCell scope="row">
                          {parseFloat(offer.foreclosure_charges).toFixed(2)}
                        </TableCell>
                        <TableCell scope="row"> {parseFloat(foreClosureData.fc_waiver_perc)}% </TableCell>
                        <TableCell scope="row"> {parseFloat(offer.fc_waiver).toFixed(2)} </TableCell>
                        <TableCell scope="row">
                          {parseFloat(requestedForeClosureCharges).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow key={6}>
                        <TableCell scope="row">
                          GST on foreclosure charges
                        </TableCell>
                        <TableCell scope="row">
                          {parseFloat(offer.gst_on_fc).toFixed(2)}
                        </TableCell>
                        <TableCell scope="row"> {parseFloat(foreClosureData.fc_waiver_perc)}% </TableCell>
                        <TableCell scope="row"> {parseFloat(offer.gst_reversal_fc).toFixed(2)} </TableCell>
                        <TableCell scope="row">
                          {parseFloat(requestedGstOnForeClosureCharges).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow key={7}>
                          <TableCell scope="row"> Excess received </TableCell>
                          <TableCell scope="row">
                            ({excess_received})
                          </TableCell>
                          <TableCell scope="row">
                            NA
                          </TableCell>
                          <TableCell scope="row">
                            NA
                          </TableCell>
                          <TableCell scope="row">
                          ({excess_received})
                          </TableCell>
                        </TableRow>
                      <TableRow key={8}>
                        <TableCell scope="row">
                          Total amount
                        </TableCell>
                        <TableCell scope="row">
                          {parseFloat(total_of_system_values).toFixed(2)}
                        </TableCell>
                        <TableCell scope="row">  </TableCell>
                        <TableCell scope="row">{parseFloat(total_of_waiver_requested).toFixed(2)}</TableCell>
                        <TableCell scope="row">
                          {parseFloat(total_foreclosure_requested_amt).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )
                })
              }
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Grid style={{ marginTop: "40px" }} m={2}>
        <span style={{ color: "black" }}>{"Requester's comment"} </span>
        <div style={{ marginTop: "5px" }}>
          <TextField
            disabled={true}
            fullWidth
            id="reuester-comment"
            value={foreClosureData?.requestor_comment || ''}
            variant="outlined"
          />
        </div>
      </Grid>
  {isTagged && checkAccessTags(["tag_service_request_foreclosure_read_write"]) ? (
  <Grid style={{ marginTop: "20px" }} m={2}>
    <span style={{ color: "black" }}>{"Approver's Comment"}</span>
    <div style={{ marginTop: "5px" }}>
      <TextField
        disabled={
          (isDisableReject && !foreClosureData.approver_comment) ||
          (foreClosureData.approver_comment && (isTagged && checkAccessTags(["tag_service_request_foreclosure_read_write"])))
        }
        fullWidth
        id="approver's-comment"
        defaultValue=""
        value={comment || foreClosureData?.approver_comment}
        variant="outlined"
        autoFocus={true}
        onChange={(event) => {
          setComment(event.target.value);
        }}
      />
    </div>
  </Grid>
) : (
  <Grid style={{ marginTop: "20px" }} m={2}>
    <span style={{ color: "black" }}>{"Approver's Comment"}</span>
    <div style={{ marginTop: "5px" }}>
      <TextField
      disabled
        fullWidth
        id="approver's-comment"
        defaultValue=""
        value={comment || foreClosureData?.approver_comment}
        variant="outlined"
        autoFocus={true}
        onChange={(event) => {
          setComment(event.target.value);
        }}
      />
    </div>
  </Grid>
)}
 {isTagged && checkAccessTags(["tag_service_request_foreclosure_read_write"]) ? (
      <Grid m={2} display={"flex"}>
        <Grid item xs={1.2}>
          <Button
            disabled={isDisableApprove}
            variant="contained"
            onClick={() => handleApproveForeClosureRequest("1")}>
            Approve
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button
            disabled={isDisableReject}
            variant="contained"
            onClick={() => handleApproveForeClosureRequest("0")}>
            Reject
          </Button>
        </Grid>
      </Grid> ) : null }
    </>
  );
}

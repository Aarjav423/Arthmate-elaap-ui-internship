import * as React from "react";
import PropTypes from "prop-types";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { AlertBox } from "../../components/AlertBox";
import { styled } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
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
import Stack from "@mui/material/Stack";
import {
  getForeclosureOfferByLoanIdWatcher,
  addForeclosureOfferByLoanIdWatcher,
} from "../../actions/foreclosureOffer";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useParams } from "react-router-dom";
export default function ServiceRequestsTable(props) {
  const params = useParams();
  const {
    value,
    index,
    setPage,
    count,
    page,
    handleChangePage,
    getServiceRequest,
    company,
    disabled,
    ...other
  } = props;

  const history = useHistory();
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#5e72e4",
      color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      color: theme.palette.common.black,
    },
  }));

  let bounceChargesGst, foreclosureChargesGst;
  const [dayIndex, setDayIndex] = useState(0);
  const [foreclosureData, setForeclosureData] = useState({});
  const user = storedList("user");
  const [selectedRow, setSelectedRow] = useState();
  const [percentDropDown, setPercentDropDown] = useState([]);
  const [openAction, setOpenAction] = useState(false);
  const [isReadable, setIsReadable] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [comments, setComments] = useState("");
  const [interestWaiverPercent, setInterestWaiverPercent] = useState(0);
  const [lpiWaiverPercent, setLpiWaiverPercent] = useState(0);
  const [bounceChargesWaiverPercent, setBounceChargesWaiverPercent] =
    useState(0);
  const [foreclosureChargeWaiverPercent, setForeclosureChargeWaiverPercent] =
    useState(0);
  const [offers, setOffers] = useState({});
  const dispatch = useDispatch();
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      setAlert(false);
    }, 2000);
  };

  useEffect(() => {
    if (Object.values(foreclosureData).length != 0) {
      setDayIndex(
        foreclosureData.offers ? foreclosureData.offers[0]?.seq_id : 0
      );

      var tempOffers = {};

      for (let offer of foreclosureData.offers) {
        tempOffers[offer.seq_id] = {
          seq_id: offer.seq_id,
          interest_waiver: 0,
          lpi_waiver: 0,
          bounce_charges_waiver: 0,
          fc_waiver: 0,
        };
      }

      setOffers(tempOffers);
    }
  }, [foreclosureData]);

  const handleClose = () => {
    setOpenAction(false);
  };

  const handleSubmit = (is_approved) => {
    if (!comments) return showAlert("Comment is required", "error");

    if (Date.now() > new Date(selectedRow?.validity_date)) {
      return showAlert("Request is expired", "error");
    }

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
  const clearAll = () => {
    window.open(`/admin/foreclosure-offers-requests/${params.loan_id}/${params.company_id}/${params.product_id}`, "_self");
  };

  const submitData = async () => {
    try {
      let payload = {
        companyData: {
          company_id: params.company_id,
          product_id: params.product_id,
          loan_id: params.loan_id,
        },

        id: foreclosureData.request_id,
        requestor_comment: comments,
        interest_waiver_perc: interestWaiverPercent,
        lpi_waiver_perc: lpiWaiverPercent,
        bounce_charge_waiver_perc: bounceChargesWaiverPercent,
        fc_waiver_perc: foreclosureChargeWaiverPercent,
        // offers: Object.values(offers),
      };
      dispatch(
        addForeclosureOfferByLoanIdWatcher(
          payload,
          (response) => {
            showAlert(response?.message, "success");
            setTimeout(() => {
              window.open(`/admin/foreclosure-offers-requests/${params.loan_id}/${params.company_id}/${params.product_id}`, "_self");
            }, 2000);
          },
          (error) => {
            return showAlert(error.response.data.message, "error");
          }
        )
      );
    } catch (error) {
      return showAlert(error.response.data.message, "error");
    }
  };
  useEffect(() => {
    try {
      let payload = {
        company_id: params.company_id,
        product_id: params.product_id,
        loan_id: params.loan_id,
      };
      dispatch(
        getForeclosureOfferByLoanIdWatcher(
          payload,
          (response) => {
            setForeclosureData(response.data);
            setPercentDropDown(response.percentDropDownArray)
          },
          (error) => {
            showAlert(error.response.data.message, "error");
          }
        )
      );
    } catch (error) {
      showAlert(error.response.data.message, "error");
    }
  }, []);

  const onChangeOffer = (e, offer, inputField, maximumValue) => {
    if (e.target.value <= maximumValue) {
      setOffers({
        ...offers,
        [offer.seq_id]: {
          ...offers[offer.seq_id],
          [inputField]: Number(e.target.value),
        },
      });
    }
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
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
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  if (
    Object.keys(foreclosureData).length == 0 ||
    Object.keys(offers).length == 0
  ) {
    return <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={() => setAlert(false)}
        />
      ) : null}
    </>;
  }
  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={() => setAlert(false)}
        />
      ) : null}
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Foreclosure Service Request
      </BootstrapDialogTitle>
      <DialogContent>
        <Grid mt={2} ml={2} mr={2}>
          <Card>
            <CardContent>
              <Grid container>
                <Grid item xs={2}>
                  <Typography>
                    <div style={{ color: "grey", fontSize: "14px" }}>
                      Request id
                    </div>
                    {foreclosureData.request_id}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    <div style={{ color: "grey", fontSize: "14px" }}>
                      Loan id
                    </div>
                    {foreclosureData.loan_id}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    <div style={{ color: "grey", fontSize: "14px" }}>
                      partner name
                    </div>
                    {foreclosureData.company_name}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>
                    <div style={{ color: "grey", fontSize: "14px" }}>
                      product name
                    </div>
                    {foreclosureData.product_name}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>
                    <div style={{ color: "grey", fontSize: "14px" }}>
                      Customer name
                    </div>
                    {foreclosureData.customer_name}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card
            style={{
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0), 0px 1px 1px 0px rgba(0,0,0,0), 0px 1px 3px 0px rgba(0,0,0,0)",
              marginTop: "15px",
            }}
          >
            <CardContent>
              <Grid container>
                <Grid item xs={2}>
                  <Typography>
                    <div style={{ color: "grey", fontSize: "14px" }}> Day </div>
                    {dayIndex}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>
                    <div style={{ color: "grey", fontSize: "14px" }}>Date</div>
                    {moment(selectedRow?.request_date)
                      .add(dayIndex, "d")
                      .format("YYYY-MM-DD")}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>
                    <div style={{ color: "grey", fontSize: "14px" }}>
                      Child ID
                    </div>
                    {foreclosureData.request_id}_{dayIndex}
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
                            style={{ color: dayIndex == 0 ? "grey" : "black" }}
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
                                dayIndex != foreclosureData.offers.length - 1
                                  ? "black"
                                  : "grey",
                            }}
                            onClick={() =>
                              dayIndex < foreclosureData.offers.length - 1
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
          <Grid>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Description </StyledTableCell>
                    <StyledTableCell>System values</StyledTableCell>
                    <StyledTableCell>Waiver requested</StyledTableCell>
                    <StyledTableCell>Requested values</StyledTableCell>
                  </TableRow>
                </TableHead>
                {foreclosureData["offers"]
                  .filter((offer) => offer.seq_id == dayIndex)
                  .map((offer) => {
                    foreclosureChargesGst = parseFloat((
                      offer.foreclosure_charges *
                      foreclosureChargeWaiverPercent
                    ) * 18 / 10000);
                    bounceChargesGst = parseFloat((
                      offer.bounce_charges *
                      bounceChargesWaiverPercent
                    ) * 18 / 10000);

                    let totalForeClosureRequestedValue = ""
                    return (
                      <TableBody key={0}>
                        <TableRow key={0}>
                          <TableCell scope="row">
                            Principal outstanding
                          </TableCell>
                          <TableCell scope="row">
                            {parseFloat(foreclosureData.prin_os).toFixed(2)}
                          </TableCell>
                          <TableCell scope="row"> NA </TableCell>
                          <TableCell scope="row">
                            {parseFloat(offer.prin_os).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow key={1}>
                          <TableCell scope="row"> Interest Due </TableCell>
                          <TableCell scope="row">
                            {parseFloat(offer.int_due).toFixed(2)}
                          </TableCell>
                          <TableCell scope="row">
                            <div>
                              {dayIndex === 0 && (
                                <select
                                  style={{ height: "26px" }}
                                  name="interestWaiverPercent"
                                  id="interestWaiverPercent"
                                  value={interestWaiverPercent}
                                  onChange={(e) => {
                                    setInterestWaiverPercent(
                                      parseFloat(e.target.value)
                                    );
                                  }}
                                >
                                  {
                                    percentDropDown.map((val) => {
                                      return <option key={val} value={val}>{val}%</option>
                                    })
                                  }
                                </select>
                              )}
                              <input
                                disabled
                                value={parseFloat(
                                  offer.int_due * (interestWaiverPercent / 100)
                                ).toFixed(2)}
                                placeholder="0"
                                onChange={(e) =>
                                  onChangeOffer(
                                    e,
                                    offer,
                                    "interest_waiver",
                                    offer.int_due
                                  )
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell scope="row">
                            {parseFloat(
                              parseFloat(offer.int_due).toFixed(2) - parseFloat(
                                offer.int_due * (interestWaiverPercent / 100)
                              ).toFixed(2)
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow key={2}>
                          <TableCell scope="row"> Lpi Due </TableCell>
                          <TableCell scope="row">
                            {parseFloat(offer.lpi_due).toFixed(2)}
                          </TableCell>
                          <TableCell scope="row">
                            <div>
                              {dayIndex === 0 && (
                                <select
                                  style={{ height: "26px" }}
                                  name="lpiWaiverPercent"
                                  id="lpiWaiverPercent"
                                  value={lpiWaiverPercent}
                                  onChange={(e) => {
                                    setLpiWaiverPercent(
                                      parseFloat(e.target.value)
                                    );
                                  }}
                                >
                                  {
                                    percentDropDown.map((val) => {
                                      return <option key={val} value={val}>{val}%</option>
                                    })
                                  }
                                </select>
                              )}
                              <input
                                disabled
                                value={parseFloat(
                                  offer.lpi_due * (lpiWaiverPercent / 100)
                                ).toFixed(2)}
                                placeholder="0"
                                onChange={(e) =>
                                  onChangeOffer(
                                    e,
                                    offer,
                                    "lpi_waiver",
                                    offer.lpi_due
                                  )
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell scope="row">
                            {parseFloat(
                              parseFloat(offer.lpi_due).toFixed(2) -
                              parseFloat(offer.lpi_due * (+lpiWaiverPercent / 100)
                              ).toFixed(2)
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow key={3}>
                          <TableCell scope="row"> Bounce Charges </TableCell>
                          <TableCell scope="row">
                            {parseFloat(offer.bounce_charges).toFixed(2)}
                          </TableCell>
                          <TableCell scope="row">
                            <div>
                              {dayIndex === 0 && (
                                <select
                                  style={{ height: "26px" }}
                                  name="bounceChargesWaiverPercent"
                                  id="bounceChargesWaiverPercent"
                                  value={bounceChargesWaiverPercent}
                                  onChange={(e) =>
                                    setBounceChargesWaiverPercent(
                                      parseFloat(e.target.value)
                                    )
                                  }
                                >
                                  {
                                    percentDropDown.map((val) => {
                                      return <option key={val} value={val}>{val}%</option>
                                    })
                                  }
                                </select>
                              )}
                              <input
                                disabled
                                value={parseFloat(
                                  offer.bounce_charges *
                                  (+bounceChargesWaiverPercent / 100)
                                ).toFixed(2)}
                                placeholder="0"
                                onChange={(e) =>
                                  onChangeOffer(
                                    e,
                                    offer,
                                    "bounce_charges_waiver",
                                    offer.bounce_charges
                                  )
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell scope="row">
                            {parseFloat(
                              parseFloat(offer.bounce_charges).toFixed(2) -
                              parseFloat(offer.bounce_charges *
                                (+bounceChargesWaiverPercent / 100)
                              ).toFixed(2)
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow key={4}>
                          <TableCell scope="row">
                            GST on bounce charges
                          </TableCell>
                          <TableCell scope="row">
                            {parseFloat(offer.gst_on_bc).toFixed(2)}
                          </TableCell>
                          <TableCell scope="row">{parseFloat(bounceChargesGst).toFixed(2)}</TableCell>
                          <TableCell scope="row">
                            {parseFloat(
                              offer.gst_on_bc - bounceChargesGst
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow key={3}>
                          <TableCell scope="row">Foreclosure Charges</TableCell>
                          <TableCell scope="row">
                            {parseFloat(offer.foreclosure_charges).toFixed(2)}
                          </TableCell>
                          <TableCell scope="row">
                            <div>
                              {dayIndex === 0 && (
                                <select
                                  style={{ height: "26px" }}
                                  name="foreclosureChargeWaiverPercent"
                                  id="foreclosureChargeWaiverPercent"
                                  value={foreclosureChargeWaiverPercent}
                                  onChange={(e) =>
                                    setForeclosureChargeWaiverPercent(
                                      parseFloat(e.target.value)
                                    )
                                  }
                                >
                                  {
                                    percentDropDown.map((val) => {
                                      return <option key={val} value={val}>{val}%</option>
                                    })
                                  }
                                </select>
                              )}
                              <input
                                disabled
                                value={parseFloat(
                                  offer.foreclosure_charges *
                                  (+foreclosureChargeWaiverPercent / 100)
                                ).toFixed(2)}
                                placeholder="0"
                                onChange={(e) =>
                                  onChangeOffer(
                                    e,
                                    offer,
                                    "fc_waiver",
                                    offer.foreclosure_charges
                                  )
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell scope="row">
                            {parseFloat(
                              parseFloat(offer.foreclosure_charges).toFixed(2) -
                              parseFloat(
                                offer.foreclosure_charges *
                                (+foreclosureChargeWaiverPercent / 100)
                              ).toFixed(2)
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow key={3}>
                          <TableCell scope="row">
                            GST on foreclosure Charges
                          </TableCell>
                          <TableCell scope="row">
                            {parseFloat(offer.gst_on_fc).toFixed(2)}
                          </TableCell>
                          <TableCell scope="row">
                            {parseFloat(foreclosureChargesGst).toFixed(2)}
                          </TableCell>
                          <TableCell scope="row">
                            {
                              parseFloat(
                                offer.gst_on_fc - foreclosureChargesGst
                              ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow key={4}>
                          <TableCell scope="row"> Excess received </TableCell>
                          <TableCell scope="row">
                            ({parseFloat(foreclosureData.excess_received).toFixed(2)})
                          </TableCell>
                          <TableCell scope="row">
                            NA
                          </TableCell>
                          <TableCell scope="row">
                            ({parseFloat(foreclosureData.excess_received).toFixed(2)})
                          </TableCell>
                        </TableRow>
                        <TableRow key={5}>
                          <TableCell scope="row"> Total Amount </TableCell>
                          <TableCell scope="row">
                            {parseFloat(offer.total_foreclosure_amt).toFixed(2)}
                          </TableCell>
                          <TableCell scope="row">
                            {
                              parseFloat(
                                offer.int_due * (interestWaiverPercent / 100) +
                                offer.lpi_due * (lpiWaiverPercent / 100) +
                                offer.bounce_charges * (+bounceChargesWaiverPercent / 100) +
                                offer.foreclosure_charges * (+foreclosureChargeWaiverPercent / 100) +
                                bounceChargesGst +
                                foreclosureChargesGst 
                              ).toFixed(2)
                            }
                          </TableCell>
                          <TableCell scope="row">
                            {parseFloat(
                              parseFloat(offer.total_foreclosure_amt).toFixed(2) - 
                              parseFloat(
                                offer.int_due * (interestWaiverPercent / 100) +
                                offer.lpi_due * (lpiWaiverPercent / 100) +
                                offer.bounce_charges * (+bounceChargesWaiverPercent / 100) +
                                offer.foreclosure_charges * (+foreclosureChargeWaiverPercent / 100) +
                                bounceChargesGst +
                                foreclosureChargesGst
                              ).toFixed(2)
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    );
                  })}
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <Grid style={{ marginTop: "40px" }} m={2}>
          <span style={{ color: "black" }}>Comment</span>
          <Card style={{ border: "1px solid black" }}>
            <CardContent>
              <TextField
                label="Comments"
                fullWidth
                InputProps={{
                  readOnly: isReadable,
                }}
                value={comments}
                variant={"standard"}
                autoFocus={true}
                onChange={(event) => {
                  setComments(event.target.value);
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid m={2} display={"flex"}>
          <Button variant="outlined" onClick={() => clearAll()}>
            Back
          </Button>
          <Grid item xs={1.2}>
            <Button variant="contained" onClick={() => submitData()}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
}

ServiceRequestsTable.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

ServiceRequestsTable.defaultProps = {
  children: "",
};

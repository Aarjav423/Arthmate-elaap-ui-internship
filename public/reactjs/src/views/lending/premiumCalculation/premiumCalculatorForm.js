import * as React from "react";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {styled} from "@material-ui/core/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import {AlertBox} from "../../../components/AlertBox";
import CustomDropdown from "../../../components/custom/customSelect";
import moment from "moment";
import {storedList} from "../../../util/localstorage";
import {calculatePremiumWatcher} from "../../../actions/insurance";
import {checkAccessTags} from "../../../util/uam";
import FormControl from "@mui/material/FormControl";
import BasicDatePicker from "../../../components/DatePicker/basicDatePicker";
import TextField from "@mui/material/TextField";
import {loanTenureList} from "./loanTenureList";

export default function ChargeTypeRecord(props) {
  const {
    data,
    onModalClose,
    openDialog,
    setOpenDialog,
    companyId,
    productId,
    onAcceptInsurance
  } = props;

  const [chargeTypeList, setChargeTypeList] = useState([]);
  const [borrowerAge, setBorrowerAge] = useState("");
  const [coBorrowerAge, setCoBorrowerAge] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [responsePopup, setResponsePopup] = useState(false);
  const [premiumData, setPremiumData] = useState({});
  const [showPremiumScreen, setShowPremiumScreen] = useState(1);

  const dispatch = useDispatch();
  const user = storedList("user");

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleCalculatePremium = () => {
    if (!borrowerAge) return showAlert("Borrower age is required.", "error");
    if (!loanTenure) return showAlert("Loan tenure is required.", "error");
    if (!loanAmount) return showAlert("Loan amount is required.", "error");
    const payload = {
      company_id: companyId,
      product_id: productId,
      user_id: user._id,
      borrower_age: borrowerAge,
      co_borrower_age: coBorrowerAge ? coBorrowerAge : "",
      loan_tenure_in_months: loanTenure.value,
      loan_amount: loanAmount
    };
    if (!coBorrowerAge || coBorrowerAge == "") delete payload.co_borrower_age;
    //Need to change this watcher
    new Promise((resolve, reject) => {
      dispatch(calculatePremiumWatcher(payload, resolve, reject));
    })
      .then(response => {
        setPremiumData(response.data);
        setShowPremiumScreen(2);
      })
      .catch(error => {
        return showAlert(error?.response?.data?.message, "error");
      });
  };

  const BootstrapDialogTitle = props => {
    const {children, onClose, product, ...other} = props;
    return (
      <DialogTitle
        sx={{m: 0, p: 2, bgcolor: "#0A2647", color: "white"}}
        {...other}
      >
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  const handleCalulatorClose = () => {
    setOpenDialog(false);
  };

  const handlePremiumCalculatorClose = () => {
    setOpenDialog(false);
  };

  const openAcceptInsurance = () => {
    setShowPremiumScreen(3);
  };

  const handleDisplayCalulatorClose = () => {
    setShowPremiumScreen(1);
  };

  const handleAcceptInsurance = () => {
    premiumData["loanTenure"] = loanTenure.value;
    premiumData["loanAmount"] = loanAmount;
    onAcceptInsurance(premiumData);
    setOpenDialog(false);
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

      <Dialog
        open={openDialog}
        onClose={handlePremiumCalculatorClose}
        fullWidth
        maxWidth={"xs"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handlePremiumCalculatorClose}
        >
          Insurance premium
        </BootstrapDialogTitle>

        {showPremiumScreen === 1 ? (
          <DialogContent>
            <Grid
              direction="column"
              justifyContent="space-evenly"
              alignItems="stretch"
            >
              <Grid
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                item
                mt={2}
                mb={2}
              >
                <Typography variant="h6" width={"60%"}>
                  Borrower age
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Age (Years)"
                  variant="outlined"
                  type="number"
                  placeholder="Age (Years)"
                  value={borrowerAge}
                  size="medium"
                  onChange={event => setBorrowerAge(event.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                item
                mt={2}
                mb={2}
              >
                <Typography variant="h6" width={"60%"}>
                  Co-Borrower age
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Age (Years)"
                  variant="outlined"
                  type="number"
                  placeholder="Age (Years)"
                  value={coBorrowerAge}
                  size="medium"
                  onChange={event => setCoBorrowerAge(event.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                item
                mt={2}
                mb={2}
              >
                <Typography variant="h6" width={"60%"}>
                  Loan tenure (Months)
                </Typography>
                <CustomDropdown
                  width={"100%"}
                  placeholder="Loan tenure(Months)"
                  data={loanTenureList}
                  value={loanTenure?.value}
                  handleDropdownChange={loanTenure => setLoanTenure(loanTenure)}
                />
              </Grid>
              <Grid
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                item
                mt={2}
                mb={2}
              >
                <Typography variant="h6" width={"60%"}>
                  Loan amount
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Amount"
                  variant="outlined"
                  type="number"
                  placeholder="Amount"
                  value={loanAmount}
                  onChange={event => setLoanAmount(event.target.value)}
                  fullWidth
                />
              </Grid>

              {/* Buttons */}
              <Grid
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Grid item mt={2}>
                  <Button
                    onClick={handlePremiumCalculatorClose}
                    variant={"outlined"}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item mt={2}>
                  <Button
                    onClick={handleCalculatePremium}
                    variant={"contained"}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        ) : showPremiumScreen === 2 ? (
          <DialogContent>
            <Grid
              direction="column"
              justifyContent="space-evenly"
              alignItems="stretch"
            >
              <Grid
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                item
                mt={2}
                mb={2}
              >
                <Typography variant="h6">
                  {`Borrower Premium - ${premiumData.borrower_insurance_premium}`}
                </Typography>
              </Grid>
              <Grid
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                item
                mt={2}
                mb={2}
              >
                <Typography variant="h6">
                  {`Co-Borrower Premium - ${premiumData.coborrower_insurance_premium}`}
                </Typography>
              </Grid>
              <Grid
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                item
                mt={2}
                mb={2}
              >
                <Typography variant="h6">
                  {`Total premium (GST inclusive) - ${premiumData.total_premium_inc_gst}`}
                </Typography>
              </Grid>

              {/* Buttons */}
              <Grid
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Grid item mt={2}>
                  <Button
                    onClick={handleDisplayCalulatorClose}
                    variant={"contained"}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item mt={2}>
                  <Button variant={"contained"} onClick={openAcceptInsurance}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        ) : showPremiumScreen === 3 ? (
          <>
            <DialogContent>
              <Grid
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                direction={"column"}
              >
                <Grid item mt={3}>
                  <Typography variant="h6">
                    {`Total premium (GST inclusive) - ${premiumData.total_premium_inc_gst} will be deducted from net disbursement.`}
                  </Typography>
                </Grid>
                <Grid
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Grid item mt={2}>
                    <Button
                      variant={"contained"}
                      onClick={handleDisplayCalulatorClose}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item mt={2}>
                    <Button
                      variant={"contained"}
                      onClick={handleAcceptInsurance}
                    >
                      Ok
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        ) : null}
      </Dialog>
    </>
  );
}

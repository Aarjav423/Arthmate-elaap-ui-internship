import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import CompanyDropdown from "../../components/Company/CompanySelect";
import ProductDropdown from "../../components/Product/ProductSelect";
import { CoLendersDropDown } from "../../components/Dropdowns/CoLendersDropdown";
import DisbursementChannelMasterDropdown from "../../components/DisbursementChannel/disbursementChannelMasterSelect";
import { storedList } from "../../util/localstorage";
import {
  addDisbursementConfigChannel,
  addColenderDisbursementConfigChannel
} from "../../actions/disbursementConfigChannel";
import { verifyNumber, verifyNewIfsc } from "../../util/helper";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AlertBox } from "../../components/AlertBox";

const DisbursementChannel = (props) => {
  const dispatch = useDispatch();
  const [company, setCompany] = useState();
  const [products, setProducts] = useState();
  const [coLender, setCoLender] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [configChannel, setConfigChannel] = useState("");
  const [walletConfigData, setWalletConfigData] = useState(0);
  const [debitAccount, setDebitAccount] = useState("");
  const [debitAccountState, setDebitAccountState] = useState("");
  const [debitAccountIfsc, setDebitAccountIfsc] = useState("");
  const [debitAccountIfscState, setDebitAccountIfscState] = useState("");
  const [allProductConfigChannelData, setallProductConfigChannelData] =
    useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const user = storedList("user");

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

  const handleInputChange = (value) => {
    verifyNumber(value)
      ? setDebitAccountState("has-success")
      : setDebitAccountState("has-danger");
    setDebitAccount(value);
  };

  const handleIfscChange = (value) => {
    verifyNewIfsc(value)
      ? setDebitAccountIfscState("has-success")
      : setDebitAccountIfscState("has-danger");
    setDebitAccountIfsc(value);
  };

  useEffect(() => {
    setProducts("");
    setConfigChannel("");
    setWalletConfigData(0);
    setDebitAccount("");
    setDebitAccountIfsc("");
    setProducts(null);
  }, [company]);

  const handleChannelChange = (channel) => {
    setSelectedChannel(channel);
  };

  const configColenderDisbursementChannel = () => {
    const data = {
      userData: {
        user_id: user._id
      },
      submitData: {
        disburse_channel: selectedChannel.value,
        debit_account: debitAccount,
        debit_account_ifsc: debitAccountIfsc,
        co_lender_id: coLender?.co_lender_id
      }
    };
    dispatch(
      addColenderDisbursementConfigChannel(
        data,
        (response) => {
          showAlert(response.message, "success");
          handleClear();
        },
        (error) => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  };

  const handleSubmit = () => {
    try {
      if (
        !coLender &&
        (company == "" || company == undefined || company == null)
      ) {
        showAlert("Select company.", "error");
        return;
      } else if (
        !coLender &&
        (products == "" || products == undefined || products == null)
      ) {
        showAlert("Select product.", "error");
        return;
      } else if (
        !selectedChannel ||
        selectedChannel?.value == "" ||
        selectedChannel?.value == undefined ||
        selectedChannel?.value === null
      ) {
        showAlert("Select disbursement channel.", "error");
        return;
      } else if (
        debitAccountState === "" ||
        debitAccountState === "has-danger"
      ) {
        setDebitAccountState("has-danger");
        showAlert("Enter valid debit account number. Only in number", "error");
        return;
      } else if (
        debitAccountIfscState === "" ||
        debitAccountIfscState === "has-danger"
      ) {
        setDebitAccountIfscState("has-danger");
        showAlert("Enter valid IFSC code", "error");
        return;
      }
      if (coLender) {
        configColenderDisbursementChannel();
      } else {
        const data = {
          userData: {
            company_id: company ? company?.value : "",
            user_id: user._id
          },
          submitData: {
            company_id: company ? company?.value : "",
            disburse_channel: selectedChannel.value,
            wallet_config_check: walletConfigData,
            debit_account: debitAccount,
            product_id: products ? products.value : "",
            debit_account_ifsc: debitAccountIfsc,
            co_lender_id: coLender?.co_lender_id ? coLender?.co_lender_id : ""
          }
        };
        new Promise((resolve, reject) => {
          dispatch(addDisbursementConfigChannel(data, resolve, reject));
        })
          .then((response) => {
            showAlert(response.message, "success");
            handleClear();
          })
          .catch((error) => {
            return showAlert(error.response.data.message, "error");
          });
      }
    } catch (error) {
      showAlert("error in form validation, kindly refresh UI");
      return;
    }
  };

  const handleClear = () => {
    setCompany(null);
    setProducts(null);
    setConfigChannel(null);
    setWalletConfigData(0);
    setDebitAccount("");
    setDebitAccountIfsc("");
    setSelectedChannel(null);
    setDebitAccountIfscState(null);
    setDebitAccountState(null);
    setCoLender(null);
  };

  return (
    <Grid
      xs={12}
      sx={{
        paddingTop: "10px",
        height: "100%",
        marginLeft: "1.3rem!important"
      }}
    >
      <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
        Configure disbursement channel
      </Typography>
      <Grid xs={12}>
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}
      </Grid>
      <Grid xs={12} container>
        <Grid
          xs={4}
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "300px"
          }}
        >
          <Grid xs={12} sx={{ mt: 1, mb: 1 }} item>
            <CompanyDropdown
              placeholder="Select company"
              onCompanyChange={(value) => {
                setCompany(value);
                setCoLender(null);
              }}
              company={company ?? ""}
              isDisabled={coLender ? true : false}
            />
          </Grid>
          <Grid xs={12} sx={{ mt: 1, mb: 1 }} item>
            <ProductDropdown
              placeholder="Select product"
              product={products ?? ""}
              company={company ?? ""}
              onProductChange={(value) => {
                setProducts(value);
                setCoLender(null);
              }}
              isDisabled={coLender ? true : false}
            />
          </Grid>

          <Grid xs={12} sx={{ mt: 1, mb: 1 }} item>
            <CoLendersDropDown
              placeholder={"Select co-lender"}
              value={coLender}
              id={"co-lender"}
              disabled={company ? true : false}
              onValueChange={(value) => {
                setCompany(null);
                setProducts(null);
                setWalletConfigData(0);
                setCoLender(value);
              }}
            />
          </Grid>

          <Grid xs={12} sx={{ mt: 1, mb: 1 }} item>
            <DisbursementChannelMasterDropdown
              placeholder="Disbursement master"
              onChannelChange={(value) => setSelectedChannel(value)}
              channel={selectedChannel}
            />
          </Grid>
          <Grid xs={12} sx={{ mt: 1, mb: 1 }} item>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={walletConfigData}
                    disabled={coLender ? true : false}
                    onChange={() => {
                      setWalletConfigData(walletConfigData ? 0 : 1);
                    }}
                  />
                }
                label={"Wallet config check"}
              />
            </FormGroup>
          </Grid>
          <Grid xs={12} sx={{ mt: 1, mb: 1 }} item>
            <FormControl variant="standard">
              <TextField
                sx={{ width: 469 }}
                id="outlined-basic"
                label="Debit account"
                variant="outlined"
                type="text"
                placeholder="debit account"
                value={debitAccount}
                error={debitAccountState === "has-danger"}
                helperText={
                  debitAccountState === "has-danger"
                    ? "Enter a valid debit_account."
                    : ""
                }
                size="medium"
                onChange={(event) => handleInputChange(event.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sx={{ mt: 1, mb: 1 }} item>
            <FormControl variant="standard">
              <TextField
                sx={{ width: 469 }}
                id="outlined-basic"
                label="Debit account IFSC"
                variant="outlined"
                type="text"
                placeholder="debit account ifsc"
                value={debitAccountIfsc}
                error={debitAccountIfscState === "has-danger"}
                helperText={
                  debitAccountIfscState === "has-danger"
                    ? "Enter a valid debit_account_ifsc."
                    : ""
                }
                size="medium"
                onChange={(event) => handleIfscChange(event.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sx={{ mt: 1, mb: 1 }} item>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                color: "#fff"
              }}
            >
              Submit
            </Button>
            <Button color="success" onClick={handleClear}>
              Clear
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DisbursementChannel;

import * as React from "react";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { validateData } from "../../util/validation";
import Button from "@mui/material/Button";
import BasicDatePicker from "../../components/DatePicker/basicDatePicker";
import { useParams } from "react-router-dom";
import { storedList } from "../../util/localstorage";
import {
  getCollateralByIdWatcher,
  updateCollateralByIdWatcher
} from "../../actions/collateral";
import { useDispatch } from "react-redux";
import moment from "moment";
import { verifyFloat } from "../../util/helper";
import { AlertBox } from "../../components/AlertBox";
import { verifyDateAfter1800 } from "../../util/helper";

const CollateralForm = () => {
  const defaultErrors = {};
  const { id } = useParams();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState(defaultErrors);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(null);
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [engineNumber, setEngineNumber] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [policyInsuranceDate, setPolicyInsuranceDate] = useState("");
  const [policyExpiryDate, setPolicyExpiryDate] = useState("");
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] =
    useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleSubModel, setVehicleSubModel] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [loanId, setLoanId] = useState("");
  const [collateralDetails, setCollateralDetails] = useState({});
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const user = storedList("user");

  const handleInputChange = (field, validationType, setValue) => event => {
    const { value } = event.target;
    setValue(value);
    setErrors({
      ...errors,
      [field + "Error"]: !validateData(validationType, value)
    });
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

  const handleClear = () => {
    setInvoiceNumber("");
    setInvoiceDate("");
    setInvoiceAmount("");
    setEngineNumber("");
    setChassisNumber("");
    setInsuranceProvider("");
    setPolicyInsuranceDate("");
    setPolicyNumber("");
    setPolicyExpiryDate("");
    setVehicleRegistrationNumber("");
    setVehicleBrand("");
    setVehicleModel("");
    setVehicleSubModel("");
    setVehicleType("");
    setErrors(defaultErrors);
  };

  const getCollateralDetails = () => {
    if (!id) return;
    const payload = {
      sendData: {
        id: id
      },
      userData: {
        user_id: user._id
      }
    };

    new Promise((resolve, reject) => {
      dispatch(getCollateralByIdWatcher(payload, resolve, reject));
    })
      .then(response => {
        setCollateralDetails(response);
        setInvoiceNumber(response?.invoice_number ?? "");
        setInvoiceDate(response?.invoice_date ?? "");
        setInvoiceAmount(response?.invoice_amount ?? "");
        setEngineNumber(response?.engine_number ?? "");
        setChassisNumber(response?.chassis_number ?? "");
        setInsuranceProvider(response?.insurance_partner_name ?? "");
        setPolicyNumber(response?.policy_number ?? "");
        setPolicyInsuranceDate(response?.policy_issuance_date ?? "");
        setPolicyExpiryDate(response?.policy_expiry_date ?? "");
        setVehicleRegistrationNumber(
          response?.vehicle_registration_number ?? ""
        );
        setVehicleBrand(response?.vehicle_brand ?? "");
        setVehicleModel(response?.vehicle_model ?? "");
        setVehicleSubModel(response?.vehicle_sub_model ?? "");
        setVehicleType(response?.vehicle_type ?? "");
        setLoanId(response?.loan_id ?? "");
        setErrors(defaultErrors);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const updateCollateralDetails = async () => {
    if (!id) return;
    if (!loanId) return showAlert("Please enter valid loan id.", "error");
    if (invoiceAmount && !verifyFloat(invoiceAmount))
      return showAlert("Please enter valid invoice amount.", "error");
    const payload = {
      sendData: {
        id: id,
        loan_id: loanId,
        invoice_number: invoiceNumber ? invoiceNumber : "",
        invoice_date: invoiceDate
          ? moment(invoiceDate).format("YYYY-MM-DD")
          : "",
        invoice_amount: invoiceAmount ? invoiceAmount : "",
        engine_number: engineNumber ? engineNumber : "",
        chassis_number: chassisNumber ? chassisNumber : "",
        insurance_partner_name: insuranceProvider ? insuranceProvider : "",
        policy_number: policyNumber ? policyNumber : "",
        policy_issuance_date: policyInsuranceDate
          ? moment(policyInsuranceDate).format("YYYY-MM-DD")
          : "",
        policy_expiry_date: policyExpiryDate
          ? moment(policyExpiryDate).format("YYYY-MM-DD")
          : "",
        vehicle_registration_number: vehicleRegistrationNumber
          ? vehicleRegistrationNumber
          : "",
        vehicle_brand: vehicleBrand ? vehicleBrand : "",
        vehicle_model: vehicleModel ? vehicleModel : "",
        vehicle_sub_model: vehicleSubModel ? vehicleSubModel : "",
        vehicle_type: vehicleType ? vehicleType : ""
      },

      userData: {
        user_id: user._id,
        company_id: collateralDetails?.company_id,
        product_id: collateralDetails?.product_id
      }
    };

    new Promise((resolve, reject) => {
      dispatch(updateCollateralByIdWatcher(payload, resolve, reject));
    })
      .then(response => {
        getCollateralDetails();
        showAlert(response?.message, "success");
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  React.useEffect(() => {
    getCollateralDetails();
  }, [id]);

  return (
    <div>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <Grid
        xs={12}
        sx={{
          paddingTop: "10px",
          height: "100%",
          marginLeft: "1.3rem!important"
        }}
      >
        <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
          Collateral edit
        </Typography>
        <Grid xs={12} container>
          <Grid
            xs={6}
            item
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <TextField
                autoFocus={true}
                id="loanId"
                label="Loan id"
                variant="outlined"
                type="text"
                placeholder="Loan id"
                value={loanId}
                size="medium"
                disabled
                onChange={handleInputChange("loanId", "string", setLoanId)}
              />
            </FormControl>
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <TextField
                autoFocus={true}
                id="invoiceNumber"
                label="Invoice number"
                variant="outlined"
                type="text"
                placeholder="Invoice number"
                value={invoiceNumber}
                error={errors?.invoiceNumberError}
                helperText={
                  errors?.invoiceNumberError &&
                  "Please enter valid invoice number."
                }
                size="medium"
                onChange={handleInputChange(
                  "invoiceNumber",
                  "string",
                  setInvoiceNumber
                )}
              />
            </FormControl>
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <BasicDatePicker
                placeholder="Invoice date"
                value={invoiceDate || null}
                error={errors?.invoiceDateError}
                helperText={
                  errors?.invoiceDateError && "Please enter valid invoice date."
                }
                onChange={handleInputChange(
                  "invoiceDate",
                  "date",
                  setInvoiceDate
                )}
                onDateChange={date => {
                  setInvoiceDate(
                    verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                      ? moment(date).format("YYYY-MM-DD")
                      : date
                  );
                }}
              />
            </FormControl>
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <TextField
                id="invoiceAmount"
                label="Invoice amount"
                variant="outlined"
                type="text"
                placeholder="Invoice amount"
                value={invoiceAmount}
                error={errors?.invoiceAmountError}
                helperText={
                  errors?.invoiceAmountError &&
                  "Please enter valid invoice amount."
                }
                size="medium"
                onChange={handleInputChange(
                  "invoiceAmount",
                  "float",
                  setInvoiceAmount
                )}
              />
            </FormControl>
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <TextField
                id="engineNumber"
                label="Engine number"
                variant="outlined"
                type="text"
                placeholder="Engine number"
                value={engineNumber}
                error={errors?.engineNumberError}
                helperText={
                  errors?.engineNumberError &&
                  "Please enter valid engine number."
                }
                size="medium"
                onChange={handleInputChange(
                  "engineNumber",
                  "string",
                  setEngineNumber
                )}
              />
            </FormControl>
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <TextField
                id="chassisNumber"
                label="Chassis number"
                variant="outlined"
                type="text"
                placeholder="Chassis number"
                value={chassisNumber}
                error={errors?.chassisNumberError}
                helperText={
                  errors?.chassisNumberError &&
                  "Please enter valid chassis number."
                }
                size="medium"
                onChange={handleInputChange(
                  "chassisNumber",
                  "string",
                  setChassisNumber
                )}
              />
            </FormControl>
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <TextField
                id="insuranceProvider"
                label="Insurance provider"
                variant="outlined"
                type="text"
                placeholder="Insurance provider"
                value={insuranceProvider}
                error={errors?.insuranceProviderError}
                helperText={
                  errors?.insuranceProviderError &&
                  "Please enter valid insurance provider."
                }
                size="medium"
                onChange={handleInputChange(
                  "insuranceProvider",
                  "string",
                  setInsuranceProvider
                )}
              />
            </FormControl>
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <TextField
                id="policyNumber"
                label="Policy number"
                variant="outlined"
                type="text"
                placeholder="Policy number"
                value={policyNumber}
                error={errors?.policyNumberError}
                helperText={
                  errors?.policyNumberError &&
                  "Please enter valid policy number."
                }
                size="medium"
                onChange={handleInputChange(
                  "policyNumber",
                  "string",
                  setPolicyNumber
                )}
              />
            </FormControl>
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <BasicDatePicker
                placeholder="Policy insurance date"
                value={policyInsuranceDate || null}
                error={errors?.policyInsuranceDateError}
                helperText={
                  errors?.policyInsuranceDateError &&
                  "Please enter valid policy insurance date."
                }
                onChange={handleInputChange(
                  "policyInsuranceDate",
                  "date",
                  setPolicyInsuranceDate
                )}
                onDateChange={date => {
                  setPolicyInsuranceDate(
                    verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                      ? moment(date).format("YYYY-MM-DD")
                      : date
                  );
                }}
              />
            </FormControl>
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <BasicDatePicker
                placeholder="Policy expiry date"
                value={policyExpiryDate || null}
                error={errors?.policyExpiryDateError}
                helperText={
                  errors?.policyExpiryDateError &&
                  "Please enter valid policy expiry date."
                }
                onChange={handleInputChange(
                  "policyExpiryDate",
                  "date",
                  setPolicyExpiryDate
                )}
                onDateChange={date => {
                  setPolicyExpiryDate(
                    verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                      ? moment(date).format("YYYY-MM-DD")
                      : date
                  );
                }}
              />
            </FormControl>
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <TextField
                id="Vehicle registration number"
                label="Vehicle registration number"
                variant="outlined"
                type="text"
                placeholder="Vehicle registration number"
                value={vehicleRegistrationNumber}
                error={errors?.vehicleRegistrationNumberError}
                helperText={
                  errors?.vehicleRegistrationNumberError &&
                  "Please enter valid vehicle registration number."
                }
                size="medium"
                onChange={handleInputChange(
                  "vehicleRegistrationNumber",
                  "string",
                  setVehicleRegistrationNumber
                )}
              />
            </FormControl>
          </Grid>
          <Grid xs={6} item sx={{ display: "flex", flexDirection: "column" }}>
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <TextField
                autoFocus={true}
                id="vehicleBrand"
                label="Vehicle brand"
                variant="outlined"
                type="text"
                placeholder="Vehicle brand"
                value={vehicleBrand}
                error={errors?.vehicleBrandError}
                helperText={
                  errors?.vehicleBrandError &&
                  "Please enter valid Vehicle brand."
                }
                size="medium"
                onChange={handleInputChange(
                  "vehicleBrandError",
                  "string",
                  setVehicleBrand
                )}
              />
            </FormControl>
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <TextField
                autoFocus={true}
                id="vehicleModel"
                label="Vehicle model"
                variant="outlined"
                type="text"
                placeholder="Vehicle model"
                value={vehicleModel}
                error={errors?.vehicleModelError}
                helperText={
                  errors?.vehicleModelError &&
                  "Please enter valid Vehicle model."
                }
                size="medium"
                onChange={handleInputChange(
                  "vehicleModelError",
                  "string",
                  setVehicleModel
                )}
              />
            </FormControl>

            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <TextField
                id="vehicleSubModel"
                label="Vehicle sub model"
                variant="outlined"
                type="text"
                placeholder="Vehicle sub model"
                value={vehicleSubModel}
                error={errors?.vehicleSubModelError}
                helperText={
                  errors?.vehicleSubModelError &&
                  "Please enter valid Vehicle sub model."
                }
                size="medium"
                onChange={handleInputChange(
                  "vehicleSubModelError",
                  "string",
                  setVehicleSubModel
                )}
              />
            </FormControl>
            <FormControl
              variant="filled"
              component={Box}
              marginBottom="1.5rem!important"
            >
              <TextField
                id="vehicleType"
                label="Vehicle type"
                variant="outlined"
                type="text"
                placeholder="Vehicle type"
                value={vehicleType}
                error={errors?.vehicleTypeError}
                helperText={
                  errors?.vehicleTypeError && "Please enter valid Vehicle type."
                }
                size="medium"
                onChange={handleInputChange(
                  "vehicleTypeError",
                  "string",
                  setVehicleType
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Button
          onClick={updateCollateralDetails}
          variant="contained"
          sx={{
            mr: 2
          }}
        >
          Submit
        </Button>
        <Button onClick={handleClear} variant="contained" color="error">
          Clear
        </Button>
      </Grid>
    </div>
  );
};

export default CollateralForm;

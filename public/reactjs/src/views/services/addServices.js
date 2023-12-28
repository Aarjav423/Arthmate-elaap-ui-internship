import * as React from "react";
import {useState, useRef} from "react";
import {useDispatch} from "react-redux";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {makeStyles} from "@material-ui/core/styles";
import componentStyles from "assets/theme/views/auth/register.js";
import componentStylesButtons from "assets/theme/components/button.js";
import CustomSelect from "../../components/custom/customSelect";
import {validateData} from "../../util/validation";
import {addServiceWatcher} from "../../actions/services";
import {AlertBox} from "../../components/AlertBox";

const useStyles = makeStyles(componentStyles);
const useStylesButtons = makeStyles(componentStylesButtons);

export default function AddServices(props) {
  const classes = {
    ...useStyles(),
    ...useStylesButtons()
  };

  const defaultErrors = {
    nameError: false,
    loanTemplatesError: false,
    templateNameError: false
  };

  const dispatch = useDispatch();
  const ref = useRef();
  const [alert, setAlert] = useState(false);
  const [errors, setErrors] = useState(defaultErrors);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [serviceSection, setServiceSection] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [serviceUrl, setServiceUrl] = useState("");
  const [inputFileName, setInputFileName] = useState("");

  const serviceSectionList = [
    {label: "Bureau", value: "Bureau"},
    {label: "KYC", value: "KYC"},
    {label: "Disbursement", value: "Disbursement"},
    {label: "E-sign", value: "E-sign"}
  ];

  const serviceTypeList = [
    {label: "GET", value: "GET"},
    {label: "POST", value: "POST"}
  ];

  const handleInputChange = (field, validationType, setValue) => event => {
    const {value} = event.target;
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

  const onFileChangeHandler = event => {
    setInputFileName(event.target.files[0]);
  };

  const handleSubmit = () => {
    const file = new FormData();
    const regexp = /^[a-zA-Z0-9--]+$/;
    const regExpURL = /^[a-zA-Z0-9-_]+$/;
    file.append("file", inputFileName);
    if (
      serviceName == "" ||
      vendorName == "" ||
      serviceSection.value == "" ||
      serviceType.value == "" ||
      serviceUrl == ""
    ) {
      setAlert(true);
      setSeverity("error");
      setAlertMessage("All fields are required");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
      return;
    }
    if (serviceName.search(regexp) === -1 || vendorName.search(regexp) === -1) {
      setAlert(true);
      setSeverity("error");
      setAlertMessage(
        "Please enter service or vendor name with no special characters."
      );
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
      return;
    }
    if (serviceUrl.search(regExpURL) === -1) {
      setAlert(true);
      setSeverity("error");
      setAlertMessage("Please enter service URL with no special characters.");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
      return;
    }
    const reqData = {
      service_name: serviceName,
      vendor_name: vendorName,
      section: serviceSection.value,
      type: serviceType.value,
      url: serviceUrl
    };

    new Promise((resolve, reject) => {
      dispatch(addServiceWatcher(reqData, file, resolve, reject));
    })
      .then(response => {
        setAlert(true);
        setSeverity("success");
        setAlertMessage(response.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
        handleClear();
      })
      .catch(error => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response.data.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  const handleClear = () => {
    setServiceName("");
    setVendorName("");
    setServiceSection("");
    setServiceType("");
    setServiceUrl("");
    ref.current.value = "";
  };

  return (
    <Grid
      xs={12}
      sx={{paddingTop: "10px", height: "100%", marginLeft: "1.3rem!important"}}
    >
      <Typography sx={{mt: 2}} variant="h6">
        Add service
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
              id="outlined-basic"
              label="Service name"
              variant="outlined"
              type="text"
              placeholder="Service name"
              value={serviceName}
              size="medium"
              onChange={handleInputChange(
                "serviceName",
                "string",
                setServiceName
              )}
            />
          </FormControl>
          <FormControl
            variant="filled"
            component={Box}
            marginBottom="1.5rem!important"
          >
            <TextField
              id="outlined-basic"
              label="Vendor name"
              variant="outlined"
              type="text"
              placeholder="Vendor name"
              value={vendorName}
              size="medium"
              onChange={handleInputChange(
                "vendorName",
                "string",
                setVendorName
              )}
            />
          </FormControl>
          <FormControl
            variant="filled"
            width="100%"
            component={Box}
            marginBottom="1.5rem!important"
          >
            <CustomSelect
              placeholder="Service section"
              data={serviceSectionList}
              value={serviceSection}
              id="serviceSection"
              handleDropdownChange={value => setServiceSection(value)}
            />
          </FormControl>
          <FormControl
            variant="filled"
            width="100%"
            component={Box}
            marginBottom="1.5rem!important"
          >
            <CustomSelect
              placeholder="Service type"
              data={serviceTypeList}
              value={serviceType}
              id="serviceType"
              handleDropdownChange={value => setServiceType(value)}
            />
          </FormControl>
          <FormControl
            variant="filled"
            component={Box}
            marginBottom="1.5rem!important"
          >
            <TextField
              id="serviceUrl"
              label="Service URL"
              variant="outlined"
              type="text"
              placeholder="api/"
              value={serviceUrl}
              size="medium"
              onChange={handleInputChange(
                "serviceUrl",
                "string",
                setServiceUrl
              )}
            />
          </FormControl>
          <FormControl
            variant="filled"
            component={Box}
            marginBottom="1.5rem!important"
          >
            <Grid item md="12" className="fileinput">
              <Typography
                component="span"
                variant="body2"
                color={"black"}
                opacity={0.8}
                sx={{lineHeight: 0}}
              >
                Select the template in .xlsx format only
              </Typography>
              <Typography
                component="span"
                variant="body2"
                color={"white"}
                opacity={0.8}
                sx={{lineHeight: 2}}
              >
                <input
                  style={{display: "block", color: "black"}}
                  ref={ref}
                  type="file"
                  name="file"
                  accept=".xlsx"
                  onChange={e => onFileChangeHandler(e, inputFileName)}
                />
              </Typography>
            </Grid>
          </FormControl>
        </Grid>
      </Grid>
      <Button
        onClick={handleSubmit}
        variant="contained"
        classes={{
          root: classes.buttonContainedInfo
        }}
      >
        SUBMIT
      </Button>
    </Grid>
  );
}

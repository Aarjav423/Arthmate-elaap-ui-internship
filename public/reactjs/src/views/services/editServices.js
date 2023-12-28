import * as React from "react";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {useParams, useHistory} from "react-router-dom";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import * as xlsx from "xlsx";
import moment from "moment";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {makeStyles} from "@material-ui/core/styles";
import componentStyles from "assets/theme/views/auth/register.js";
import componentStylesButtons from "assets/theme/components/button.js";
import CustomSelect from "../../components/custom/customSelect";
import {validateData} from "../../util/validation";
import {
  editServiceWatcher,
  getServiceByIdWatcher
} from "../../actions/services";
import GetAppIcon from "@mui/icons-material/GetApp";
import {AlertBox} from "../../components/AlertBox";
const useStyles = makeStyles(componentStyles);
const useStylesButtons = makeStyles(componentStylesButtons);

export default function EditServices(props) {
  const {service_id} = useParams();
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
  const history = useHistory();
  const [alert, setAlert] = useState(false);
  const [errors, setErrors] = useState(defaultErrors);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [serviceSection, setServiceSection] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [serviceUrl, setServiceUrl] = useState("");
  const [inputFileName, setInputFileName] = useState("");
  const [inputFileJson, setInputFileJson] = useState("");

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const handleFormValues = () => {
    new Promise((resolve, reject) => {
      dispatch(getServiceByIdWatcher(service_id, resolve, reject));
    })
      .then(response => {
        const selectedService = response;
        setServiceId(selectedService._id);
        setServiceName(selectedService.service_name);
        setVendorName(selectedService.vendor_name);
        setServiceSection(selectedService.section);
        setServiceType(selectedService.type);
        setServiceUrl(selectedService.url.replace("api/", ""));
        setInputFileJson(selectedService.file);
      })
      .catch(error => {
        return showAlert(error.response.data.message, "error");
      });
  };

  useEffect(() => {
    if (service_id) {
      handleFormValues();
    }
  }, []);

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

  const downloadServiceTemplate = () => {
    const newWB = xlsx.utils.book_new();
    const newWS = xlsx.utils.json_to_sheet(inputFileJson);
    xlsx.utils.book_append_sheet(newWB, newWS, "File");
    xlsx.writeFile(
      newWB,
      serviceName + "-" + moment().format("Do MMMM YYYY") + ".xlsx"
    );
  };

  const handleServiceSectionChange = value => {
    if (!value) {
      value = "";
    }
    setServiceSection(value ? value.value : "");
  };

  const handleServiceTypeChange = value => {
    if (!value) {
      value = "";
    }
    setServiceType(value ? value.value : "");
  };

  const handleClear = () => {
    setServiceName("");
    setVendorName("");
    setServiceSection("");
    setServiceType("");
    setServiceUrl("");
    setInputFileName(null);
    setInputFileJson("");
  };

  const handleSubmit = () => {
    const file = new FormData();
    file.append("file", inputFileName);
    if (!serviceName || serviceName === "") {
      return showAlert("Service name is required", "error");
    }
    if (!vendorName || vendorName === "") {
      return showAlert("Vendor name is required", "error");
    }
    if (!serviceSection || serviceSection === "") {
      return showAlert("Service section is required", "error");
    }
    if (!serviceType || serviceType === "") {
      return showAlert("Service type is required", "error");
    }
    if (!serviceUrl || serviceUrl === "") {
      return showAlert("Service url is required", "error");
    }
    const reqData = {
      service_id: serviceId,
      service_name: serviceName,
      vendor_name: vendorName,
      section: serviceSection,
      type: serviceType,
      url: serviceUrl
    };
    new Promise((resolve, reject) => {
      dispatch(editServiceWatcher(reqData, file, resolve, reject));
    })
      .then(response => {
        handleFormValues();
        showAlert(response.message, "success");
      })
      .catch(error => {
        return showAlert(error.response.data.message, "error");
      });
  };

  return (
    <Grid
      xs={12}
      sx={{paddingTop: "10px", height: "100%", marginLeft: "1.3rem!important"}}
    >
      <Typography sx={{mt: 2, mb: 2}} variant="h6">
        Edit service
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
              id={serviceId}
              handleDropdownChange={value => handleServiceSectionChange(value)}
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
              id={serviceId}
              handleDropdownChange={value => handleServiceTypeChange(value)}
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
            {inputFileJson ? (
              <Grid item className="fileinput">
                <Typography
                  component="span"
                  variant="body2"
                  opacity={0.8}
                  sx={{lineHeight: 0}}
                >
                  Download template for Service :
                </Typography>
                <Button
                  size="sm"
                  onClick={() => {
                    downloadServiceTemplate();
                  }}
                >
                  <GetAppIcon />
                </Button>
              </Grid>
            ) : null}
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

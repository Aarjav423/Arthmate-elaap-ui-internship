import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Stack from "@mui/material/Stack";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Grid from "@material-ui/core/Grid";
import componentStyles from "assets/theme/views/auth/register.js";
import componentStylesButtons from "assets/theme/components/button.js";
import TextField from "@mui/material/TextField";
import LoanTemplatesDropdown from "../../components/Dropdowns/LoanTemplatesDropdown";
import { validateData } from "../../util/validation";
import {
  addLoanTypeWatcher,
  addLoanTemplateNameWatcher
} from "../../actions/loanType";

const useStyles = makeStyles(componentStyles);
const useStylesButtons = makeStyles(componentStylesButtons);

function DefaultLoanType() {
  const classes = {
    ...useStyles(),
    ...useStylesButtons()
  };

  const defaultErrors = {
    nameError: false,
    descriptionError: false,
    loanTemplatesError: false,
    templateNameError: false
  };
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [newLoanTemplate, setNewLoanTemplate] = useState("");
  const [loanTemplates, setLoanTemplates] = useState([]);
  const [errors, setErrors] = useState(defaultErrors);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const handleSubmit = () => {
    if (!name || !description || !loanTemplates.length) {
      return showAlert("All fields are required for creating loan", "error");
    }
    if (!validateData("title", name)) {
      return showAlert("Please enter valid name", "error");
    }
    if (!validateData("description", description)) {
      return showAlert("Please enter valid description", "error");
    }
    const data = {
      name: name,
      desc: description,
      template_names: loanTemplates.map((loanTemplate) => loanTemplate.value)
    };
    new Promise((resolve, reject) => {
      dispatch(addLoanTypeWatcher(data, resolve, reject));
    })
      .then((response) => {
        showAlert(response.message, "success");
        handleClear();
      })
      .catch((error) => {
        return showAlert(error.response.data.message, "error");
      });
  };

  const handleTemplateSubmit = () => {
    if (!validateData("title", templateName)) {
      return showAlert(
        "Please enter template name in valid alphabetical format with only allowed special characters",
        "error"
      );
    }
    const data = {
      name: templateName
    };
    new Promise((resolve, reject) => {
      dispatch(addLoanTemplateNameWatcher(data, resolve, reject));
    })
      .then((response) => {
        showAlert(response.message, "success");
        setNewLoanTemplate(response.addLoanTemplate.name);
        handleTemplateClear();
      })
      .catch((error) => {
        return showAlert(error.response.data.message, "error");
      });
  };

  const handleSelectChange = (field, value, setValue, isMulti) => {
    setValue(value);
    setErrors({
      ...errors,
      [field + "Error"]: isMulti ? !value?.length : !value
    });
  };

  const handleInputChange = (field, validationType, setValue) => (event) => {
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

  const handleClear = () => {
    setName("");
    setDescription("");
    setLoanTemplates([]);
  };

  const handleTemplateClear = () => {
    setTemplateName("");
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  return (
    <>
      <Grid item xs={12}>
        <CardContent>
          <Grid item xs={12}>
            {alert ? (
              <Stack
                lg={{
                  width: "80%"
                }}
                justifyContent="center"
                alignItems="center"
              >
                <Alert severity={severity} onClose={handleAlertClose}>
                  {alertMessage}
                </Alert>
              </Stack>
            ) : null}
            <Typography
              variant="h7"
              display="block"
              sx={{
                fontWeight: "bold",
                marginLeft: "0.812rem"
              }}
            >
              Loan template name
            </Typography>
            <CardContent>
              <Stack
                lg={{
                  width: "60%"
                }}
                justifyContent="left"
                alignItems="left"
                spacing={1}
              >
                <FormControl
                  variant="filled"
                  component={Box}
                  width="30%"
                  marginBottom="1.5rem!important"
                >
                  <TextField
                    id="outlined-basic"
                    label="Template name"
                    variant="outlined"
                    type="text"
                    placeholder="Loan template name"
                    value={templateName}
                    size="medium"
                    error={errors.templateNameError}
                    helperText={
                      errors.templateNameError
                        ? "Loan template name is required"
                        : ""
                    }
                    onChange={handleInputChange(
                      "templateName",
                      "title",
                      setTemplateName
                    )}
                  />
                </FormControl>
                <Box>
                  <Button
                    variant="contained"
                    onClick={handleTemplateSubmit}
                    classes={{
                      root: classes.buttonContainedInfo
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Grid>
          <Divider textAlign="left" />
          <Grid item xs={12}>
            <Typography
              variant="h7"
              display="block"
              sx={{
                fontWeight: "bold",
                margin: "0.812rem"
              }}
            >
              Default loan type
            </Typography>
            <CardContent>
              <Stack
                lg={{
                  width: "60%"
                }}
                justifyContent="left"
                alignItems="left"
                spacing={1}
              >
                <FormControl
                  variant="filled"
                  component={Box}
                  width="30%"
                  marginBottom="1.5rem!important"
                >
                  <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    type="text"
                    placeholder="Loan type"
                    value={name}
                    size="medium"
                    error={errors.nameError}
                    helperText={
                      errors.nameError ? "Loan type name is required" : ""
                    }
                    onChange={handleInputChange("name", "title", setName)}
                  />
                </FormControl>

                <FormControl
                  variant="filled"
                  component={Box}
                  width="30%"
                  marginBottom="1.5rem!important"
                >
                  <TextField
                    id="outlined-basic"
                    label="Description"
                    variant="outlined"
                    type="text"
                    placeholder="loan description"
                    value={description}
                    size="medium"
                    error={errors.descriptionError}
                    helperText={
                      errors.descriptionError ? "Enter valid description" : ""
                    }
                    onChange={handleInputChange(
                      "description",
                      "description",
                      setDescription
                    )}
                  />
                </FormControl>

                <FormControl
                  variant="filled"
                  component={Box}
                  width="30%"
                  marginBottom="1.5rem!important"
                >
                  <LoanTemplatesDropdown
                    newLoanTemplate={newLoanTemplate}
                    id="select-loan-templates"
                    placeholder="Loan template"
                    valueData={loanTemplates}
                    onValueChange={(value) =>
                      handleSelectChange(
                        "loanTemplates",
                        value,
                        setLoanTemplates,
                        true
                      )
                    }
                  />
                  <Typography
                    variant="button"
                    fontSize="0.6rem"
                    fontWeight="400"
                    color="red"
                    style={{ color: "red" }}
                    marginLeft="1.3rem!important"
                  >
                    {errors.loanTemplatesError
                      ? "Loan templates are required"
                      : ""}
                  </Typography>
                </FormControl>
                <Box>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    classes={{
                      root: classes.buttonContainedInfo
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Grid>
        </CardContent>
      </Grid>
    </>
  );
}

export default DefaultLoanType;

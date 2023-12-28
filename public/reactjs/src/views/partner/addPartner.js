import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addPartnerFormWatcher } from "../../actions/addPartner";
import { PARTNER_BUSINESS_DETAILS_FIELDS } from "./formFields";
import {
  Countries,
  States,
  Cities,
  getStatesData,
  getCitiesData,
  getPincodeData
} from "../../constants/country-state-city-data";
import { stateCityWatcher } from "../../actions/stateCity";
import {
  verifyEmail,
  verifyUrl,
  verifyGSTIN,
  verifyPincode,
  verifyPhone,
  verifyMobile,
  verifyCIN,
  verifyAlphaNeumericName,
  verifyTIN,
  verifyState,
  verifyAlphaNeumeric,
  verifyAddress,
  verifyAlpha,
  verifyString,
} from "../../util/helper";
import CustomDropdown from "../../components/custom/customSelect";
import { AlertBox } from "../../components/AlertBox";

class AddPartner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: Countries,
      states: States,
      cities: [],
      stateCityData: [],
      pincodes: [],
      //alert params
      alert: false,
      severity: "",
      alertMessage: "",
      partnername: "",
      cin: "",
      address: "",
      pincode: "",
      city: "",
      state: "",
      gstin: "",
      tin: "",
      phone: "",
      directors: [{ name: "", resultState: "" }],
      website: "",

      shortName: "",
      lmsVersion: [],
      lmsOptions: [
        { label: "Legacy LMS", value: "legacy_lms" },
        { label: "Origin LMS", value: "origin_lms" }
      ],
      groName: "",
      groDesignation: "",
      groAddress: "",
      groEmailId: "",
      groContactNumber: "",
      digitalLendingApp: "",

      // type validation form
      partnernameState: "",
      cinState: "",
      addressState: "",
      pincodeState: "",
      cityState: "",
      stateState: "",
      gstinState: "",
      tinState: "",
      phoneState: "",
      websiteState: "",
      shortNameState: "",
      lmsVersionState: "",
      groNameState: "",
      groDesignationState: "",
      groAddressState: "",
      groEmailIdState: "",
      groContactNumberState: "",
      digitalLendingAppState: "",
    };
  }

  handleClear = () => {
    this.setState({
      partnername: "",
      cin: "",
      address: "",
      pincode: "",
      city: null,
      state: null,
      gstin: "",
      tin: "",
      phone: "",
      directors: [{ name: "", resultState: "" }],
      website: "",
      groName: "",
      groDesignation: "",
      groAddress: "",
      groEmailId: "",
      groContactNumber: "",
      digitalLendingApp: "",

      shortName: "",
      lmsVersion: null,
      lmsVersionState: "",

      shortNameState: "",
      partnernameState: "",
      cinState: "",
      addressState: "",
      pincodeState: "",
      cityState: "",
      stateState: "",
      gstinState: "",
      tinState: "",
      phoneState: "",
      websiteState: "",
      groNameState: "",
      groDesignationState: "",
      groAddressState: "",
      groEmailIdState: "",
      groContactNumberState: "",
      digitalLendingAppState: "",
    });
  };

  handleDropdownChange = country => {
    if (country.value !== "") {
      this.setState({
        abCountry: country.value,
        abCountryState: "has-success"
      });
    } else {
      this.setState({ abCountryState: "has-danger" });
    }
  };

  handleDirectorNameChange = (evt, idx, stateNameEqualTo) => {
    const newdirectors = this.state.directors.map((director, sidx) => {
      if (idx !== sidx) return director;
      if (
        evt.target.value.length >= stateNameEqualTo &&
        verifyAlphaNeumericName(evt.target.value)
      ) {
        return {
          ...director,
          name: evt.target.value,
          resultState: "has-success"
        };
      } else {
        return {
          ...director,
          name: evt.target.value,
          resultState: "has-danger"
        };
      }
    });
    this.setState({ directors: newdirectors });
  };

  handleAddDirector = () => {
    if (this.state.directors.length < 7) {
      this.setState({
        directors: this.state.directors.concat([{ name: "", resultState: "" }])
      });
    } else {
      return false;
    }
  };

  handleRemoveDirector = idx => () => {
    if (this.state.directors.length > 1) {
      this.setState({
        directors: this.state.directors.filter((s, sidx) => {
          return idx !== sidx;
        })
      });
    } else {
      return false;
    }
  };

  change = (event, stateName, type, stateNameEqualTo, Value) => {
    switch (type) {
      case "length":
        if (!event.target.value) {
          this.setState({ [stateName + "State"]: "" });
        } else if (event.target.value.length >= stateNameEqualTo) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "email":
        if (verifyEmail(event.target.value)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "url":
        if (verifyUrl(event.target.value)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "gstin":
        if (!event.target.value) {
          this.setState({ [stateName + "State"]: "" });
        } else if (verifyGSTIN(event.target.value)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "cin":
        if (verifyCIN(event.target.value)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "name":
        if (verifyAlphaNeumericName(event.target.value)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "tin":
        if (!event.target.value) {
          this.setState({ [stateName + "State"]: "" });
        } else if (verifyTIN(event.target.value)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "state":
        if (verifyState(event.target.value)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "pincode":
        if (verifyPincode(event.target.value)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "phone":
        if (verifyPhone(event.target.value)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "mobile":
        if (verifyMobile(event.target.value)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "address":
        if (verifyAddress(event.target.value)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "string":
        if (verifyString(event.target.value)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      default:
        break;
    }
    this.setState({ [stateName]: event.target.value });
  };

  handleSubmit = () => {
    let data = {};
    const isValidated = this.isValidated();
    if (!isValidated) {
      this.setState({ alert: true });
      this.setState({ severity: "error" });
      this.setState({ alertMessage: "Kindly check for errors in fields." });
      setTimeout(() => {
        this.handleAlertClose();
      }, 4000);
    }

    if (isValidated === true) {
      data = {
        name: this.state.partnername,
        cin: this.state.cin,
        company_address: this.state.address,

        short_code: this.state.shortName ? this.state.shortName : "",
        pin_code: this.state.pincode,
        city: this.state.city.value,
        state: this.state.state.value,
        gstin: this.state.gstin,
        tin: this.state.tin,
        business_phone: this.state.phone,
        lms_version: this.state.lmsVersion.value,
        gro_name: this.state.groName,
        gro_designation: this.state.groDesignation,
        gro_address: this.state.groAddress,
        gro_email_id: this.state.groEmailId,
        gro_contact_number: this.state.groContactNumber,
        digital_lending_app_name: this.state.digitalLendingApp,
        directors: this.state.directors.map(d => {
          return d.name;
        }),
        website: this.state.website
      };
    } else {
      return;
    }

    new Promise((resolve, reject) => {
      this.props.addPartnerFormWatcher(data, resolve, reject);
    })
      .then(response => {
        this.setState({ alert: true });
        this.setState({ severity: "success" });
        this.setState({ alertMessage: response.message });
        setTimeout(() => {
          this.handleAlertClose();
        }, 4000);
        this.handleClear();
      })
      .catch(error => {
        this.setState({ alert: true });
        this.setState({ severity: "error" });
        this.setState({ alertMessage: error.response.data.message });
        setTimeout(() => {
          this.handleAlertClose();
        }, 4000);
      });
  };

  isValidated = () => {
    if (
      this.state.cinState === "has-success" &&
      this.state.addressState === "has-success" &&
      this.state.pincodeState === "has-success" &&
      this.state.cityState === "has-success" &&
      this.state.stateState === "has-success" &&
      this.state.partnernameState === "has-success" &&
      this.state.lmsVersionState === "has-success" &&
      (this.state.gstinState === "" ||
        this.state.gstinState === "has-success") &&
      (this.state.tinState === "" ||
        this.state.tinState === "has-success") &&
      this.state.groNameState === "has-success" &&
      this.state.groDesignationState === "has-success" &&
      this.state.groAddressState === "has-success" &&
      this.state.groEmailIdState === "has-success" &&
      this.state.groContactNumberState === "has-success" &&
      this.state.digitalLendingAppState === "has-success" &&
      this.state.directors.every(
        director => director.resultState === "has-success"
      )
    ) {
      return true;
    } else {
      if (this.state.partnernameState !== "has-success") {
        this.setState({ partnernameState: "has-danger" });
      }
      if (this.state.cinState !== "has-success") {
        this.setState({ cinState: "has-danger" });
      }
      if (this.state.addressState !== "has-success") {
        this.setState({ addressState: "has-danger" });
      }
      if (this.state.pincodeState !== "has-success") {
        this.setState({ pincodeState: "has-danger" });
      }
      if (this.state.cityState !== "has-success") {
        this.setState({ cityState: "has-danger" });
      }
      if (this.state.lmsVersionState !== "has-success") {
        this.setState({ lmsVersionState: "has-danger" });
      }
      if (this.state.stateState !== "has-success") {
        this.setState({ stateState: "has-danger" });
      }
      if (this.state.gstinState !== "has-success" && this.state.gstinState !== "") {
        this.setState({ gstinState: "has-danger" });
      }
      if (this.state.tinState !== "has-success" && this.state.tinState !== "") {
        this.setState({ tinState: "has-danger" });
      }
      if (this.state.websiteState !== "has-success") {
        this.setState({ websiteState: "has-danger" });
      }

      if (this.state.phoneState !== "has-success") {
        this.setState({ phoneState: "has-danger" });
      }
      if (this.state.groNameState !== "has-success") {
        this.setState({ groNameState: "has-danger" });
      }
      if (this.state.groDesignationState !== "has-success") {
        this.setState({ groDesignationState: "has-danger" });
      }
      if (this.state.groAddressState !== "has-success") {
        this.setState({ groAddressState: "has-danger" });
      }
      if (this.state.groEmailIdState !== "has-success") {
        this.setState({ groEmailIdState: "has-danger" });
      }
      if (this.state.groContactNumberState !== "has-success") {
        this.setState({ groContactNumberState: "has-danger" });
      }
      if (this.state.digitalLendingAppState !== "has-success") {
        this.setState({ digitalLendingAppState: "has-danger" });
      }
      const validatedDirectors = this.state.directors.map(director => {
        if (director.resultState !== "has-success") {
          return {
            ...director,
            resultState: "has-danger"
          };
        } else {
          return {
            ...director,
            resultState: "has-success"
          };
        }
      });
      this.setState({ directors: validatedDirectors });
      return false;
    }
  };

  handleGetCities = async () => {
    this.setState({ cities: Cities(this.state.state) });
  };

  handleGetPincodes = async () => {
    const pincodesData = await getPincodeData(
      this.state.stateCityData,
      this.state.city
    );
    this.setState({ pincodes: pincodesData });
  };

  handleClearDropdown = name => {
    if (name === "state") {
      this.setState({ city: "", pincode: "", cities: [], pincodes: [] });
    }
    if (name === "city") {
      this.setState({ pincode: "", pincodes: [] });
    }
    if (name === "lmsVersion") {
      this.setState({ lmsVersionState: "", lmsVersion: [] });
    }
  };

  dropDownChange = (value, field) => {
    if (field.name === "pincode" && value !== null && value !== undefined) {
      value = value.label;
    }

    this.setState(
      {
        [field.name]: value,
        [`${field.name}State`]: "has-success"
      },
      () => {
        if (value === null || value === undefined)
          return this.handleClearDropdown(field.name);
        if (field.name === "state" && value !== null && value !== undefined) {
          this.handleClearDropdown(field.name);
          this.handleGetCities();
        }
        if (field.name === "city" && value !== null && value !== undefined) {
          this.setState({ pincode: "", pincodes: [] });
          this.handleGetPincodes();
        }
      }
    );
  };

  handleAlertClose = () => {
    this.setState({ alert: false });
    this.setState({ severity: "" });
    this.setState({ alertMessage: "" });
    setTimeout(() => {
      this.handleAlertClose();
    }, 4000);
  };

  getStatseData = async data => {
    const statesData = await getStatesData(data);
    this.setState({ states: statesData });
  };

  handleGetStateCity = async () => {
    const { stateCity } = this.props;
    if (stateCity?.length) {
      this.setState({ stateCityData: stateCity });
      this.getStatseData(stateCity);
    } else {
      new Promise((resolve, reject) => {
        this.props.stateCityWatcher(null, resolve, reject);
      })
        .then(response => {
          this.setState({ stateCityData: response });
          this.getStatseData(response);
        })
        .catch(error => {
        });
    }
  };

  render() {
    const { classes } = this.props;
    const { city } = this.state;
    return (
      <>
        <Grid item xs={12}>
          {this.state.alert ? (
            <AlertBox
              severity={this.state.severity}
              msg={this.state.alertMessage}
              onClose={this.handleAlertClose}
            />
          ) : null}
          <CardContent>
            <Grid className="p-1" container xs={12} spacing={1}>
              {PARTNER_BUSINESS_DETAILS_FIELDS(this.state).map(
                (field, index) => {
                  return (
                    <Grid key={index} xs={12} md={4} item>
                      <FormControl
                        sx={{ m: 1, width: "100%" }}
                        variant="standard"
                      >
                        {field.component === "text" ? (
                          <TextField
                            variant="standard"
                            label={field.placeholder}
                            type={field.type}
                            error={field.resultState === "has-danger"}
                            helperText={
                              field.resultState === "has-danger"
                                ? field.errorMsg
                                : ""
                            }
                            placeholder={field.placeholder}
                            name={field.name}
                            value={this.state[field.name]}
                            onChange={e =>
                              this.change(
                                e,
                                field.name,
                                field.condition,
                                field.value
                              )
                            }
                          />
                        ) : field.component === "select" ||
                          field.component === "selectMulti" ? (
                          <CustomDropdown
                            placeholder={field.placeholder}
                            data={this.state[field.dataSet]}
                            multiple={field.component === "selectMulti"}
                            value={this.state[field.name]}
                            id={field.name}
                            handleDropdownChange={value =>
                              this.dropDownChange(value, field)
                            }
                            error={field.resultState === "has-danger"}
                            helperText={
                              field.resultState === "has-danger"
                                ? field.errorMsg
                                : ""
                            }
                          />
                        ) : null}
                      </FormControl>
                    </Grid>
                  );
                }
              )}
            </Grid>
            <Divider className="mt-3" textAlign="left" />
            <Grid className="ml-1 mt-2" xs={12} container>
              <Grid xs={12} spacing={1}>
                <Typography
                  variant="h7"
                  display="block"
                  sx={{
                    fontWeight: "bold",
                    marginLeft: "0.812rem"
                  }}
                >
                  Add director
                  <IconButton
                    color="primary"
                    aria-label="add director"
                    component="span"
                    onClick={this.handleAddDirector}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Typography>
              </Grid>
            </Grid>
            <Grid
              className="ml-1"
              container
              xs={12}
              spacing={1}
              sx={{ margin: "0.125rem" }}
            >
              {this.state.directors.map((director, idx) => (
                <Grid key={idx} xs={12} md={4} item>
                  <TextField
                    sx={{ width: "80%" }}
                    variant="standard"
                    label={`Director ${idx + 1} name`}
                    type="text"
                    error={director.resultState === "has-danger"}
                    helperText={
                      director.resultState === "has-danger"
                        ? "Enter valid director name"
                        : ""
                    }
                    placeholder={`Director ${idx + 1}  Name`}
                    value={director.name}
                    onChange={e => this.handleDirectorNameChange(e, idx, 2)}
                  />
                  <IconButton
                    color="error"
                    aria-label="add director"
                    component="span"
                    onClick={this.handleRemoveDirector(idx)}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Grid>
              ))}
            </Grid>
            <Divider className="mb-2 mt-2" textAlign="left" />
            <Grid xs={12} container sx={{ margin: "10px 0" }}>
              <Stack spacing={2} direction="row">
                <Button
                  variant="contained"
                  className="pull-right ml-4 mr-3"
                  onClick={this.handleSubmit}
                  size="large"
                  sx={{
                    color: "#fff"
                  }}
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  className="pull-right"
                  size="large"
                  onClick={this.handleClear}
                >
                  Clear
                </Button>
              </Stack>
            </Grid>
          </CardContent>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    stateCity: state.stateCity?.stateCityData
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addPartnerFormWatcher,
      stateCityWatcher
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPartner);

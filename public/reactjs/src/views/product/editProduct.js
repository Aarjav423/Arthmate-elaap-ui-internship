import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {
  VerifyPenalInterest,
  verifyNumber,
  verifyFloat,
  VerifyUpfront,
  VerifyRear,
  VerifyInterest
} from "../../util/helper";
import {bindActionCreators} from "redux";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CustomDropdown from "../../components/custom/customSelect";
import {addProductDueConfigWatcher} from "../../actions/productDueConfig";
import {
  getProductByCompanyAndProductWatcher,
  getProductByIdWatcher
} from "../../actions/product";
import {OVERDUES_FIELD} from "../../constants/defaultData";
import {storedList} from "../../util/localstorage";
import {AlertBox} from "../../components/AlertBox";
const styles = theme => ({});
const exclude_interest_till_grace_period = [
  {
    value: "true",
    label: "TRUE"
  },
  {
    value: "false",
    label: "FALSE"
  }
];
const defaultErrors = {
  nameError: false,
  loanTemplatesError: false,
  templateNameError: false
};
class EditPro extends React.Component {
  constructor(props) {
    super(props);
    const URLdata = window.location.href;
    const {selectedProducts} = props;
    this.state = {
      errors: defaultErrors,
      alert: false,
      alertMessage: "",
      company_id: URLdata.split("/").slice(-3)[0],
      product_id: URLdata.split("/").slice(-2)[0],
      loan_schema_id: URLdata.split("/").slice(-1)[0],
      loan_schema: "",
      subvention_fees: "0UA",
      processing_fees: "0UA",
      usage_fee: "0UA",
      int_value: "0A",
      penal_interest: "0",
      bounce_charges: "0",
      productData: [],
      maximumNumberOfEmi:"",
      forceUsageConvertToEmi:"",
      // type validation form
      subvention_feesState: "has-success",
      processing_feesState: "has-success",
      usage_feeState: "has-success",
      int_valueState: "has-success",
      penal_interestState: "has-success",
      bounce_chargesState: "has-success",
      ErrorMessage: false,
      SuccessMessage: false,
      Types: false,
      isResponse: false,
      buttonDisabled: false,
      foreclosure: false,
      foreclosureState: false,
      foreclosureCharge: false,
      foreclosureChargeState: false,
      foreclosureOfferDays: false,
      foreclosureOfferDaysState: false,
      lockInPeriod: false,
      lockInPeriodState: false
    };
  }
  componentDidMount = () => {
    const user = storedList("user");
    const data = {
      user_id: user._id,
      company_id: this.state.company_id,
      product_id: this.state.product_id,
      loan_schema_id: this.state.loan_schema_id
    };
    new Promise((resolve, reject) => {
      this.props.getProductByCompanyAndProductWatcher(data, resolve, reject);
    })
      .then(response => {
        if (response.dpdrecords.fees) {
          this.setState({
            buttonDisabled: false,
            subvention_fees: response.dpdrecords.subvention_fees,
            processing_fees: response.dpdrecords.processing_fees,
            usage_fee: response.dpdrecords.usage_fee,
            int_value: response.dpdrecords.int_value,
            penal_interest: response.dpdrecords.penal_interest,
            bounce_charges: response.dpdrecords.bounce_charges,
            foreclosure: response.dpdrecords.foreclosure,
            foreclosureCharge: response.dpdrecords.foreclosure_charge,
            foreclosureOfferDays: response.dpdrecords.fc_offer_days,
            lockInPeriod: response.dpdrecords.lock_in_period,
            maximumNumberOfEmi: response.dpdrecords?.maximum_number_of_emi,
            forceUsageConvertToEmi: response.dpdrecords?.force_usage_convert_to_emi,
          });
        }
      })
      .catch(error => {
        this.setState({
          alert: true,
          severity: "error",
          alertMessage: error.response.data.message
        });
        setTimeout(() => {
          this.handleAlertClose();
        }, 4000);
      });

    new Promise((resolve, reject) => {
      this.props.getProductByIdWatcher(this.state.product_id, resolve, reject);
    })
      .then(response => {
        this.setState({
          productData: response
        });
      })
      .catch(error => {
        this.setState({
          alert: true,
          severity: "error",
          alertMessage: error.response.data.message
        });
        setTimeout(() => {
          this.handleAlertClose();
        }, 4000);
      });
  };

  handleDropdownChange = (value, stateName) => {
    if (value.label !== "") {
      this.setState({
        [stateName]: value,
        [stateName + "State"]: "has-success"
      });
    } else {
      this.setState({[stateName + "State"]: "has-danger"});
    }
  };
  change = (event, stateName, type, stateNameEqualTo) => {
    switch (type) {
      case "number":
        if (verifyFloat(event.target.value)) {
          this.setState({[stateName + "State"]: "has-success"});
        } else {
          this.setState({[stateName + "State"]: "has-danger"});
        }
        break;
      case "overdues":
        if (VerifyPenalInterest(event.target.value)) {
          this.setState({[stateName + "State"]: "has-success"});
        } else {
          this.setState({[stateName + "State"]: "has-danger"});
        }
        break;
      case "penal":
        if (VerifyPenalInterest(event.target.value)) {
          this.setState({[stateName + "State"]: "has-success"});
        } else {
          this.setState({[stateName + "State"]: "has-danger"});
        }
        break;
      case "rear":
        if (VerifyRear(event.target.value)) {
          this.setState({[stateName + "State"]: "has-success"});
        } else {
          this.setState({[stateName + "State"]: "has-danger"});
        }
        break;
      case "interest":
        if (VerifyInterest(event.target.value)) {
          this.setState({[stateName + "State"]: "has-success"});
        } else {
          this.setState({[stateName + "State"]: "has-danger"});
        }
        break;
      case "upfront":
        if (VerifyUpfront(event.target.value)) {
          this.setState({[stateName + "State"]: "has-success"});
        } else {
          this.setState({[stateName + "State"]: "has-danger"});
        }
        break;
      case "pureNumber":
        if (verifyNumber(event.target.value)) {
          this.setState({[stateName + "State"]: "has-success"});
        } else {
          this.setState({[stateName + "State"]: "has-danger"});
        }
        break;
      default:
        break;
    }
    this.setState({[stateName]: event.target.value});
  };

  isValidated = Types => {
    if (Types === false) {
      if (
        this.state.subvention_feesState === "has-success" &&
        this.state.processing_feesState === "has-success" &&
        this.state.usage_feeState === "has-success" &&
        this.state.int_valueState === "has-success"
      ) {
        return true;
      } else {

        if (this.state.subvention_feesState !== "has-success") {
          this.setState({subvention_feesState: "has-danger"});
        }
        if (this.state.processing_feesState !== "has-success") {
          this.setState({processing_feesState: "has-danger"});
        }
        if (this.state.usage_feeState !== "has-success") {
          this.setState({usage_feeState: "has-danger"});
        }
        if (this.state.int_valueState !== "has-success") {
          this.setState({int_valueState: "has-danger"});
        }

        return false;
      }
    } else {
      return true;
    }
  };

  hideAlert = () => {
    this.setState({
      alert: null
    });
  };

  handleAlertClose = () => {
    this.setState({
      alert: false,
      severity: "",
      alertMessage: ""
    });
    setTimeout(() => {
      this.handleAlertClose();
    }, 4000);
  };

  handleClear = () => {
    this.setState({
      subvention_fees: "",
      processing_fees: "",
      usage_fee: "",
      int_value: "",
      penal_interest: "",
      bounce_charges: ""
    });
  };

  handleNext = () => {
    const Types = !this.state.fees ? false : true;
    this.setState({Types: Types});
    const isValidated = this.isValidated(Types);
    this.setState({ErrorMessage: false, SuccessMessage: false});
    if (!this.isValidated(Types)) return false;
    const user = storedList("user");
    const submitData = {
      userData: {
        user_id: user._id,
        company_id: this.state.company_id,
        loan_schema_id: this.state.loan_schema_id,
        product_id: this.state.product_id
      },
      submitData: {
        subvention_fees: this.state.subvention_fees,
        processing_fees: this.state.processing_fees,
        usage_fee: this.state.usage_fee,
        int_value: this.state.int_value,
        penal_interest: this.state.penal_interest,
        bounce_charges: this.state.bounce_charges,
        lock_in_period: this.state.lockInPeriod,
        foreclosure: this.state.foreclosure,
        foreclosure_charge: this.state.foreclosureCharge,
        fc_offer_days: this.state.foreclosureOfferDays,
        maximum_number_of_emi: this.state.maximumNumberOfEmi,
        force_usage_convert_to_emi: this.state.forceUsageConvertToEmi,
      }
    };
    new Promise((resolve, reject) => {
      this.props.addProductDueConfigWatcher(submitData, resolve, reject);
    })
      .then(response => {
        this.setState({
          alert: true,
          severity: "success",
          alertMessage: response.message
        });
        setTimeout(() => {
          this.handleAlertClose();
        }, 2000);
      })
      .catch(error => {
        this.setState({
          alert: true,
          severity: "error",
          alertMessage: error.response.data.message
        });
        setTimeout(() => {
          this.handleAlertClose();
        }, 4000);
      });
  };

  render() {
    const {handleClose, selectedProducts, Types} = this.props;
    const {
      isRange,
      data,
      errorMsg,
      sum,
      ErrorMessage,
      SuccessMessage
    } = this.state;
    return (
      <>
        <CardContent>
          <Grid item xs={12}>
            {this.state.alert ? (
              <AlertBox
                severity={this.state.severity}
                msg={this.state.alertMessage}
                onClose={this.handleAlertClose}
              />
            ) : null}
          </Grid>
          <Typography
            id="keep-mounted-modal-title"
            display="block"
            sx={{
              fontWeight: "bold",
              margin: "0.812rem"
            }}
            variant="h6"
          >
            Edit Product
          </Typography>
          <Grid container xs={12} spacing={1}>
            {OVERDUES_FIELD &&
              OVERDUES_FIELD(this.state).map((field, index) => {
                return (
                  <>
                    <Grid xs={12} md={4} item>
                      <FormControl
                        sx={{m: 1, width: "100%"}}
                        variant="standard"
                      >
                        {field.type === "text" ? (
                          <TextField
                            variant="standard"
                            key={field.placeholder}
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
                            helperText={
                              field.resultState === "has-danger"
                                ? field.errorMsg
                                : ""
                            }
                          />
                        ) : null}
                      </FormControl>
                    </Grid>
                  </>
                );
              })}
            <Grid xs={12} md={4} item>
              <h4>Exclude Interest Till Grace Period</h4>
              <CustomDropdown
                placeholder="Exclude interest till grace period"
                data={exclude_interest_till_grace_period}
                value={this.state.exclude_interest_till_grace_period}
                handleDropdownChange={value => {
                  this.setState({
                    exclude_interest_till_grace_period: value.value,
                    exclude_interest_till_grace_periodState: "has-success"
                  });
                }}
              />
              {this.state.exclude_interest_till_grace_periodState ===
                "has-danger" || Types === false ? (
                <label className="error" style={{color: "red"}}>
                  {" "}
                  Please select Exclude Interest Till Grace Period
                </label>
              ) : null}
            </Grid>
            <Grid xs={12} md={4} item>
              {this.state.ErrorMessage != false ? (
                <h4 style={{color: "red", "font-weight": "bold"}}>
                  {this.state.ErrorMessage}
                </h4>
              ) : null}
              {this.state.SuccessMessage != false ? (
                <h4 style={{color: "green", "font-weight": "bold"}}>
                  {this.state.SuccessMessage}
                </h4>
              ) : null}
              <Grid md="11">
                <Button
                  disabled={this.state.buttonDisabled}
                  variant="contained"
                  color="primary"
                  onClick={this.handleNext}
                  sx={{
                    margin: "0.812rem"
                  }}
                >
                  Edit
                </Button>
                {/*<Button color="success" onClick={this.handleClear}>
                  Clear
                </Button>*/}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addProductDueConfigWatcher,
      getProductByCompanyAndProductWatcher,
      getProductByIdWatcher
    },
    dispatch
  );
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles, {withTheme: true})(EditPro));

import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// @mui material components
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import {
  getCompanyLoanSchemaWatcher,
  getDefaultTemplatesWatcher,
  getLoanTypesWatcher
} from "actions/loanType";
import { addLoanSchemaWatcher } from "../../actions/loanSchema";
import { AlertBox } from "../../components/AlertBox";
import CompanyDropdown from "../../components/Company/CompanySelect";
import CustomDropdown from "../../components/custom/customSelect";
import { verifyFloat, verifyNumber } from "../../util/helper";
import { storedList } from "../../util/localstorage";
import CustomizeTemplates from "./customizeTemplates";

const user = storedList("user");

class LoanSchema extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCompany: "",
      selectLoanType: "",
      selectedSchema: {},
      loanAmount: "",
      intRate: "",
      tenure: "",
      writeOff: "",
      intRateType: "",
      dpdRates: [{ amount: "", resultState: "" }],
      // Loan type validation
      selectLoanTypeState: "",
      loanAmountState: "",
      intRateState: "",
      dpdRatesState: "",
      tenureState: "",
      dpdRateState: "",
      writeOffState: "",
      intRateTypeState: "",
      isFlexIntRate: false,
      interestOnUsage: false,
      isTempEdit: false,
      isCreateProduct: false,
      isLoanType: true,
      templates: [],
      defaultloantypes: "",
      // schema id passed in create product component
      schemaid: "",
      isSubventionBasedLoans: false,
      defaultLoanStatus: { value: "open", label: "Open" },
      defaultLoanStatusState: "",
      listSchemas: [],
      alert: false,
      severity: "",
      alertMessage: ""
    };
  }

  getDefaultTemplates = type => {
    this.setState({ templates: [] });
    const data = { id: type };
    // get default templates
    new Promise((resolve, reject) => {
      this.props.getDefaultTemplatesWatcher(data, resolve, reject);
    })
      .then(response => {
        let objKeys = Object.keys(response);
        this.setState({
          templates: response
        });
      })
      .catch(error => {
      });
  };

  componentDidMount = () => {
    this.getDefaultLoanTypes();
  };

  getDefaultLoanTypes = () => {
    // get default loan types
    new Promise((resolve, reject) => {
      this.props.getLoanTypesWatcher(resolve, reject);
    })
      .then(response => {
        this.setState({
          defaultloantypes: response
        });
      })
      .catch(error => {
      });
  };

  handleCheck = name => event => {
    if (name === "isTempEdit" && this.state.selectLoanType === "")
      this.setState({
        alert: true,
        severity: "error",
        alertMessage: "Please select the loan type."
      });
    setTimeout(() => {
      this.handleAlertClose();
    }, 4000);
    this.setState({ [name]: event.target.checked });
  };

  handleDropdownChange = (value, stateName) => {
    if (value?.label !== "") {
      this.setState(
        {
          [stateName]: value,
          [stateName + "State"]: "has-success"
        },
        () => {
          if (stateName === "selectedCompany") this.fetchCompaniesSchemas();
        }
      );
    } else {
      this.setState({ [stateName + "State"]: "has-danger" });
    }
    if (stateName === "selectLoanType") {
      this.getDefaultTemplates(value?.value);
    }
  };

  change = (event, stateName, type, stateNameEqualTo, setState) => {
    switch (type) {
      case "length":
        if (event.target.value.length >= stateNameEqualTo) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "number":
        if (
          verifyNumber(event.target.value) &&
          event.target.value.length >= stateNameEqualTo
        ) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "float":
        if (
          verifyFloat(event.target.value) &&
          event.target.value.length >= stateNameEqualTo
        ) {
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

  fetchCompaniesSchemas = () => {
    this.setState({ listSchemas: [] });
    const { selectedCompany } = this.state;
    new Promise((resolve, reject) => {
      this.props.getCompanyLoanSchemaWatcher(
        selectedCompany.value,
        resolve,
        reject
      );
    })
      .then(schemas => {
        this.setState({ listSchemas: schemas });
      })
      .catch(error => {
      });
  };

  handleAddLoanSchema = () => {
    const { selectedCompany } = this.state;
    if (!selectedCompany.value) {
      this.setState({
        alert: true,
        severity: "error",
        alertMessage: "Please select the company"
      });
      setTimeout(() => {
        this.handleAlertClose();
      }, 4000);
    }
    const data = {
      template_type: "custom",
      loan_type_name: this.state.selectLoanType.label,
      loan_type_id: this.state.selectLoanType.value,
      validated: true,
      company_id: selectedCompany.value,
      user_id: user._id,
      loan_schema_settings: {
        amount: this.state.loanAmount,
        int_rate_type: this.state.intRateType.value,
        default_loan_status: this.state.defaultLoanStatus.value,
        int_rt: this.state.intRate,
        tenure: this.state.tenure,
        int_rate: this.state.kintrate,
        writeof_in_days: this.state.writeOff,
        flexible_int_rate: this.state.isFlexIntRate,
        interest_on_usage: this.state.interestOnUsage,
        is_subvention_based_loans: this.state.isSubventionBasedLoans,
        cycle_days: this.state.cycleDays
      },
      templates: this.state.templates
    };
    new Promise((resolve, reject) => {
      this.props.addLoanSchemaWatcher(data, resolve, reject);
    })
      .then(response => {
        this.setState({
          alert: true,
          severity: "success",
          alertMessage: response.message
        });
        setTimeout(() => {
          this.handleAlertClose();
        }, 4000);
        // get partner loan schema
        this.fetchCompaniesSchemas();
        this.handleClear();
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

  handleClear = () => {
    this.setState({
      // Loan schema details
      selectLoanType: "",
      selectedCompany: null,
      intRateType: "",
      loanAmount: "",
      intRate: "",
      tenure: "",
      writeOff: "",
      cprocfees: "",
      kprocfees: "",
      kintrate: "",
      cycleDays: "",
      // Loan schema validation
      selectLoanTypeState: "",
      loanAmountState: "",
      intRateState: "",
      tenureState: "",
      dpdRateState: "",
      writeOffState: "",
      cprocfeesState: "",
      kprocfeesState: "",
      kintrateState: "",
      intRateTypeState: "",
      isFlexIntRate: false,
      interestOnUsage: false,
      isTempEdit: false,
      isCreateProduct: false,
      isLoanType: true,
      cycleDaysState: "",
      templates: [],
      // schema id passed in create product component
      schemaid: "",
      isSubventionBasedLoans: false,
      defaultLoanStatus: { value: "open", label: "Open" },
      defaultLoanStatusState: ""
    });
  };

  isValidated = () => {
    if (
      this.state.selectLoanTypeState === "has-success" &&
      this.state.intRateState === "has-success" &&
      this.state.loanAmountState === "has-success" &&
      this.state.intRateTypeState === "has-success" &&
      this.state.tenureState === "has-success" &&
      this.state.writeOffState === "has-success"
    ) {
      return true;
    } else {
      if (this.state.selectLoanTypeState !== "has-success") {
        this.setState({ selectLoanTypeState: "has-danger" });
      }
      if (this.state.intRateTypeState !== "has-success") {
        this.setState({ intRateTypeState: "has-danger" });
      }
      if (this.state.loanAmountState !== "has-success") {
        this.setState({ loanAmountState: "has-danger" });
      }
      if (this.state.intRateState !== "has-success") {
        this.setState({ intRateState: "has-danger" });
      }
      if (this.state.tenureState !== "has-success") {
        this.setState({ tenureState: "has-danger" });
      }
      if (this.state.writeOffState !== "has-success") {
        this.setState({ writeOffState: "has-danger" });
      }
      if (this.state.cprocfeesState !== "has-success") {
        this.setState({ cprocfeesState: "has-danger" });
      }
      if (this.state.kprocfeesState !== "has-success") {
        this.setState({ kprocfeesState: "has-danger" });
      }
      if (this.state.kintrateState !== "has-success") {
        this.setState({ kintrateState: "has-danger" });
      }
      return false;
    }
  };

  handleAddProduct = schema => {
    this.setState({
      schemaid: schema._id,
      selectedSchema: schema,
      isLoanType: false,
      isCreateProduct: true
    });
  };

  handleAlertClose = () => {
    this.setState({ severity: "", alertMessage: "", alert: false });
  };

  handleProductBack = () => {
    this.setState({
      isCreateProduct: false,
      schemaid: "",
      isLoanType: true
    });
  };

  render() {
    const { defaultloantypes } = this.state;
    const loantypeData =
      defaultloantypes && defaultloantypes
        ? defaultloantypes.map(type => {
            if (type?.name) return { value: type._id, label: type.name };
          })
        : [{ value: "", label: "No records", isDisabled: true }];
    const intRateTypeData = [
      { value: "flat", label: "Flat" },
      { value: "reducing", label: "Reducing" }
    ];
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
          <Box sx={{ marginLeft: "20px" }} py={3} mb={20}>
            {this.state.isLoanType && this.state.isLoanType === true ? (
              <Grid container>
                <Grid container xs={12} spacing={2}>
                  <Grid xs={12} sm={4} item>
                    <CompanyDropdown
                      placeholder="Select company"
                      onCompanyChange={value =>
                        this.handleDropdownChange(value, "selectedCompany")
                      }
                      company={this.state.selectedCompany ?? ""}
                    />
                  </Grid>
                  <Grid xs={12} sm={4} item>
                    <CustomDropdown
                      placeholder="Select loan type"
                      data={loantypeData}
                      value={this.state.selectLoanType}
                      id="selectLoanType"
                      handleDropdownChange={value =>
                        this.handleDropdownChange(value, "selectLoanType")
                      }
                    />
                  </Grid>
                </Grid>
                <Grid md={12}>
                  <Divider textAlign="left" sx={{ margin: "10px 0" }} />
                </Grid>
                {this.state.selectLoanType ? (
                  <Grid md={12}>
                    <CustomizeTemplates
                      templatesdata={this.state.templates}
                      onDataChange={templates => {
                        this.setState({ templates: templates });
                      }}
                    />
                  </Grid>
                ) : null}
                <Grid
                  item
                  xs={12}
                  className="mt-3 mb-3 pl-0"
                  sx={{ display: "flex" }}
                >
                  <Grid item xs={6} className="mt-3 mb-3 pl-0">
                    <Button
                      variant="contained"
                      onClick={this.handleAddLoanSchema}
                      sx={{
                        color: "#fff"
                      }}
                    >
                      Submit
                    </Button>
                  </Grid>
                  {Object.keys(this.state.templates).map((template, index) => {
                    if (template === "lead" || template === "loan")
                      return (
                        <Grid
                          item
                          xs={3}
                          className="mt-3 mb-3 pl-0"
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            flexDirection: "column"
                          }}
                        >
                          <Typography variant="span" component="span">
                            {template}
                          </Typography>
                          <Typography variant="span" component="span">
                            {"Mandatory fields = "}
                            {
                              this.state.templates[template].filter(
                                item => item?.checked.toLowerCase() === "true"
                              ).length
                            }
                          </Typography>
                          <Typography variant="span" component="span">
                            {"Display on UI = "}
                            {
                              this.state.templates[template].filter(
                                item =>
                                  item?.checked.toLowerCase() !== "true" &&
                                  item?.displayOnUI &&
                                  item?.displayOnUI.toLowerCase() === "true"
                              ).length
                            }
                          </Typography>
                        </Grid>
                      );
                  })}
                </Grid>
                <Grid md={12}>
                  <Divider textAlign="left" />
                </Grid>
              </Grid>
            ) : null}
          </Box>
        </CardContent>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getDefaultTemplatesWatcher,
      getLoanTypesWatcher,
      addLoanSchemaWatcher,
      getCompanyLoanSchemaWatcher
    },
    dispatch
  );
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(null, { withTheme: true })(LoanSchema));

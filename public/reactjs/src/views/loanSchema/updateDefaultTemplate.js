import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import {
  getSchemaTemplatesWatcher,
  updateCustomTemplatesWatcher
} from "actions/loanType";
import { AlertBox } from "../../components/AlertBox";
import CompanyDropdown from "../../components/Company/CompanySelect";
import LoanSchemaDropDown from "../../components/Dropdowns/LoanSchemaDropDown";
import { storedList } from "../../util/localstorage";
import CustomizeTemplates from "./customizeTemplates";

const user = storedList("user");

class UpdateLoanSchemaTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCompany: "",
      selectedCompanyState: "",
      company_id: "",
      selectLoanSchema: "",
      selectLoanSchemaState: "",
      templates: [],
      // schema id passed in create product component
      alert: false,
      severity: "",
      alertMessage: ""
    };
  }

  getSchemaTemplates = type => {
    this.setState({ templates: [] });
    const data = { loan_schema_id: type };
    // get default templates
    new Promise((resolve, reject) => {
      this.props.getSchemaTemplatesWatcher(data, resolve, reject);
    })
      .then(response => {
        this.setState({
          templates: response
        });
      })
      .catch(error => {
      });
  };

  handleDropdownChange = (value, stateName) => {
    if (value?.label !== "") {
      this.setState(
        {
          [stateName]: value,
          [stateName + "State"]: "has-success"
        },
        () => {
          if (stateName === "selectedCompany")
            this.setState({ company_id: value?.value, selectLoanSchema: "" });
          if (stateName === "selectLoanSchema")
            this.getSchemaTemplates(value?.value);
        }
      );
    } else {
      this.setState({ [stateName + "State"]: "has-danger" });
    }
  };

  handleAddLoanSchema = () => {
    if (!this.isValidated()) {
      this.setState({
        alert: true,
        severity: "error",
        alertMessage: "Please select the company and loan Schema."
      });
      setTimeout(() => {
        this.handleAlertClose();
      }, 4000);
      return false;
    }

    const data = {
      template_type: "default",
      loan_schema_id: this.state.selectLoanSchema.value,
      company_id: this.state.company_id,
      user_id: user._id,
      templates: this.state.templates
    };
    new Promise((resolve, reject) => {
      this.props.updateCustomTemplatesWatcher(data, resolve, reject);
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
      selectLoanSchema: "",
      selectedCompany: null,
      selectedCompanyState: "",
      company_id: "",
      // Loan schema validation
      selectLoanSchemaState: "",
      templates: []
      // schema id passed in create product component
    });
  };

  isValidated = () => {
    if (
      this.state.selectLoanSchemaState === "has-success" &&
      this.state.selectedCompanyState === "has-success"
    ) {
      return true;
    } else {
      if (this.state.selectLoanSchemaState !== "has-success") {
        this.setState({ selectLoanSchemaState: "has-danger" });
      }
      if (this.state.selectedCompanyState !== "has-success") {
        this.setState({ selectedCompanyState: "has-danger" });
      }
      return false;
    }
  };

  handleAlertClose = () => {
    this.setState({ severity: "", alertMessage: "", alert: false });
  };

  render() {
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
            <Grid container>
              <Grid container xs={12} spacing={2}>
                <Grid xs={12} sm={4} item>
                  <CompanyDropdown
                    placeholder="Select Company"
                    onCompanyChange={value =>
                      this.handleDropdownChange(value, "selectedCompany")
                    }
                    company={this.state.selectedCompany ?? ""}
                  />
                </Grid>
                <Grid xs={12} sm={4} item>
                  <LoanSchemaDropDown
                    placeholder="Select Loan Schema"
                    valueData={this.state.selectLoanSchema}
                    company_id={this.state.company_id}
                    onValueChange={value =>
                      this.handleDropdownChange(value, "selectLoanSchema")
                    }
                  />
                </Grid>
              </Grid>
              <Grid md={12}>
                <Divider textAlign="left" sx={{ margin: "10px 0" }} />
              </Grid>
              {this.state.selectLoanSchema ? (
                <Grid md={12}>
                  <CustomizeTemplates
                    templatesdata={this.state.templates}
                    onDataChange={templates => {
                      this.setState({ templates: templates });
                    }}
                  />
                </Grid>
              ) : null}
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
              <Grid md={12}>
                <Divider textAlign="left" />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getSchemaTemplatesWatcher,
      updateCustomTemplatesWatcher
    },
    dispatch
  );
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(null, { withTheme: true })(UpdateLoanSchemaTemplate));

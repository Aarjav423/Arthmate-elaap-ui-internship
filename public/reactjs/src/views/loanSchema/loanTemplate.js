import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CustomDropdown from "../../components/custom/customSelect";
import TabPanel from "../../components/tabPanel";
import CustomizeTemplates from "./templateTabData";
import {
  getLoanTypesWatcher,
  tempXlsxToJsonWatcher
} from "../../actions/loanType";
import {addLoanSchemaWatcher} from "../../actions/loanSchema";
import {AlertBox} from "../../components/AlertBox";
import {storedList} from "../../util/localstorage";
const user = storedList("user");

class LoanTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loanType: "",
      tabIndex: 0,
      alert: false,
      templatesData: "",
      defaultLoanType: "",
      severity: "",
      alertMessage: ""
    };
  }

  componentDidMount = () => {
    new Promise((resolve, reject) => {
      this.props.getLoanTypesWatcher(resolve, reject);
    })
      .then(response => {
        this.setState({defaultLoanType: response});
      })
      .catch(error => {
      });
  };

  handleFileUpload = (file, type) => {
    const data = new FormData();
    data.append("file", file);
    new Promise((resolve, reject) => {
      this.props.tempXlsxToJsonWatcher(data, type, resolve, reject);
    })
      .then(response => {
        this.setState({[response.type]: response.result});
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

  onFileChangeHandler = (event, type) => {
    this.handleFileUpload(event.target.files[0], type);
  };

  handleSubmit = () => {
    const {loanType} = this.state;
    const templates = {};
    const emptyTemplates = [];
    loanType &&
      loanType.template_names.split(",").forEach(name => {
        if (!this.state[name] || this.state[name] === "")
          return emptyTemplates.push(name);
        templates[name] = this.state[name];
      });
    if (!loanType || loanType === "") {
      this.setState({
        alert: true,
        severity: "error",
        alertMessage: "Please select loan type"
      });
      setTimeout(() => {
        this.handleAlertClose();
      }, 4000);
    } else if (emptyTemplates.length) {
      this.setState({
        alert: true,
        severity: "error",
        alertMessage: `Please upload ${emptyTemplates[0]} template`
      });
      setTimeout(() => {
        this.handleAlertClose();
      }, 4000);
    } else {
      this.AddLoanSchema(templates);
    }
  };

  AddLoanSchema = templates => {
    const data = {
      template_type: "default",
      loan_type_name: this.state.loanType.label,
      loan_type_id: this.state.loanType.value,
      user_id: user._id,
      validated: true,
      loan_schema_settings: null,
      templates
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
    return false;
  };

  changeActiveTab = (e, tabState, tadName) => {
    e.preventDefault();
    this.setState({
      [tabState]: tadName
    });
  };

  handleClear = () => {
    this.state.loanType.template_names.split(",").forEach(name => {
      delete this.state[name];
    });
    this.setState({
      loanType: "",
      tabIndex: 0
    });
  };
  handleAlertClose = () => {
    this.setState({severity: "", alertMessage: "", alert: false});
  };

  handleLoanTypeChange = value => {
    if (value) {
      this.setState({
        loanType: value,
        templatesData: value.template_names.split(",")
      });
    } else if (!value || value == null) {
      this.setState({
        loanType: "",
        templatesData: []
      });
    }
  };

  render() {
    const {classes, light} = this.props;
    const {
      templatesData,
      loanType,
      tabIndex,
      severity,
      alertMessage,
      defaultLoanType,
      alert
    } = this.state;

    const loantypeData =
      defaultLoanType && defaultLoanType
        ? defaultLoanType.map(type => {
            const obj = type;
            obj.value = type._id;
            obj.label = type.name;
            return obj;
          })
        : [{value: "", label: "No records", isDisabled: true}];

    return (
      <>
        <Grid item xs={12}>
          {alert ? (
            <AlertBox
              severity={severity}
              msg={alertMessage}
              onClose={this.handleAlertClose}
            />
          ) : null}
          <CardContent>
            <Typography sx={{mt: 1}} variant="h6">
              Loan template upload
            </Typography>
            <FormControl
              variant="filled"
              component={Box}
              width="30%"
              sx={{mt: 1}}
              marginBottom="1.5rem!important"
            >
              <CustomDropdown
                placeholder="Select loan type"
                data={loantypeData}
                value={loanType}
                handleDropdownChange={value => {
                  this.handleLoanTypeChange(value);
                }}
              />
            </FormControl>
            {loanType ? (
              <Grid item xs={12}>
                {loantypeData ? (
                  <Grid item md={8}>
                    {loanType && (
                      <CustomizeTemplates
                        templatesdata={templatesData}
                        onIndexChange={(e, index) =>
                          this.changeActiveTab(e, "tabIndex", index)
                        }
                      />
                    )}
                  </Grid>
                ) : null}
                {loanType &&
                  loanType.template_names.split(",").map((name, index) => {
                    return (
                      <TabPanel value={tabIndex} index={index} key={name}>
                        <Grid item md="12" className="fileinput">
                          <Typography
                            component="span"
                            variant="body2"
                            color={"black"}
                            opacity={0.8}
                            sx={{lineHeight: 0}}
                          >
                            Select the {name} template in .xlsx format only
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            color={"black"}
                            opacity={0.8}
                            sx={{lineHeight: 2}}
                          >
                            <input
                              type="file"
                              name="file"
                              onChange={e => this.onFileChangeHandler(e, name)}
                            />
                          </Typography>
                        </Grid>
                        <Grid item md="12">
                          <Grid container>
                            {this.state[name] &&
                              this.state[name].map((field, position) => {
                                return (
                                  <Grid item md="3" key={position}>
                                    <div
                                      style={{
                                        border: "1px solid #ccc",
                                        padding: "0 0 0 10px",
                                        borderRadius: "5px",
                                        margin: "5px"
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          fontWeight: "bold"
                                        }}
                                      >
                                        {field.field}
                                      </Typography>
                                      <p
                                        style={{
                                          fontSize: "10px",
                                          color: "green"
                                        }}
                                      >
                                        {field.validationmsg}
                                      </p>
                                    </div>
                                  </Grid>
                                );
                              })}
                          </Grid>
                        </Grid>
                      </TabPanel>
                    );
                  })}
                {loanType ? (
                  <Button variant="contained" onClick={this.handleSubmit}>
                    SUBMIT
                  </Button>
                ) : null}
              </Grid>
            ) : null}
          </CardContent>
        </Grid>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      tempXlsxToJsonWatcher,
      addLoanSchemaWatcher,
      getLoanTypesWatcher
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(LoanTemplate);

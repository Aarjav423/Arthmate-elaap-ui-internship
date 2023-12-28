import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TabPanel from "../../components/tabPanel";
import {addLoanDocTemplateWatcher} from "../../actions/loanType";
import {tempXlsxToJsonWatcher} from "../../actions/loanType";
import {AlertBox} from "../../components/AlertBox";

class LoanDocTemplates extends Component {
  constructor(props) {
    super(props);
    const URLdata = window.location.href;
    this.state = {
      loanType: "",
      tabIndex: 0,
      alert: false,
      company_id: URLdata.split("/").slice(-2)[0],
      product_id: URLdata.split("/").slice(-1)[0],
      templatesData: "",
      loanDocTemplateData: "",
      defaultLoanType: "",
      severity: "",
      alertMessage: ""
    };
  }

  handleFileUpload = (file, type) => {
    const data = new FormData();
    data.append("file", file);
    new Promise((resolve, reject) => {
      this.props.tempXlsxToJsonWatcher(data, type, resolve, reject);
    })
      .then(response => {
        this.setState({loanDocTemplateData: response.result});
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

  handleClear = () => {
    this.setState({
      loanType: "",
      tabIndex: 0
    });
  };

  handleAlertClose = () => {
    this.setState({severity: "", alertMessage: "", alert: false});
  };

  handleAddTemplate = () => {
    const postData = {
      company_id: this.state.company_id,
      product_id: this.state.product_id,
      templates: this.state.loanDocTemplateData
    };
    new Promise((resolve, reject) => {
      this.props.addLoanDocTemplateWatcher(postData, resolve, reject);
    })
      .then(response => {
        this.setState({
          alert: true,
          severity: "success",
          alertMessage: response.message,
          loanDocTemplateData: ""
        });
        setTimeout(() => {
          this.handleAlertClose();
        }, 2000);
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

  render() {
    const {
      templatesData,
      loanType,
      tabIndex,
      severity,
      alertMessage,
      defaultLoanType,
      alert,
      loanDocTemplateData
    } = this.state;

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
            <Grid item xs={12}>
              <TabPanel value={0} index={0} key={"loandocument"}>
                <Grid item md="12" className="fileinput">
                  <Typography
                    component="span"
                    variant="body2"
                    color={"black"}
                    opacity={0.8}
                    sx={{lineHeight: 0}}
                  >
                    Select the loandocument template in .xlsx format only
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color={"white"}
                    opacity={0.8}
                    sx={{lineHeight: 2}}
                  >
                    <input
                      type="file"
                      name="file"
                      onChange={e =>
                        this.onFileChangeHandler(e, "loandocument")
                      }
                    />
                  </Typography>
                </Grid>
                <Grid item md="12">
                  <Grid container>
                    {loanDocTemplateData &&
                      loanDocTemplateData.map((field, id) => {
                        return (
                          <Grid
                            xs={3}
                            item
                            key={id}
                            sx={{
                              border: "1px solid #ccc",
                              borderCollapse: "collapse",
                              padding: "5px"
                            }}
                          >
                            <FormGroup variant="outlined">
                              <Typography
                                variant="caption"
                                display="block"
                                sx={{
                                  color: "green",
                                  fontWeight: "bold"
                                }}
                              >
                                {field.title}
                              </Typography>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    defaultChecked={
                                      field.checked.toLowerCase() === "true"
                                        ? true
                                        : false
                                    }
                                    onChange={e => {
                                      return (field.checked =
                                        e.target.checked === true
                                          ? "TRUE"
                                          : "FALSE");
                                    }}
                                    disabled={
                                      field.isOptional.toLowerCase() === "false"
                                        ? true
                                        : false
                                    }
                                  />
                                }
                                label={
                                  <Typography variant="caption">
                                    {field.field}
                                  </Typography>
                                }
                              />
                            </FormGroup>
                          </Grid>
                        );
                      })}
                  </Grid>
                </Grid>
              </TabPanel>
              <Button variant="contained" onClick={this.handleAddTemplate}>
                SUBMIT
              </Button>
            </Grid>
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
      //addLoanSchemaWatcher,
      //getLoanTypesWatcher,
      addLoanDocTemplateWatcher
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(LoanDocTemplates);

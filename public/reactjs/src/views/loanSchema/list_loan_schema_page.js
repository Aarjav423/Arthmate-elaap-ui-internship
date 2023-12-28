import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {storedList} from "../../util/localstorage";
import {withStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CardContent from "@material-ui/core/CardContent";
import CompanyDropdown from "../../components/Company/CompanySelect";
import LoanSchemaList from "./listLoanSchema";
import CreateProduct from "./createProduct";
import {getCompanyLoanSchemaWatcher} from "actions/loanType";
import {updateLoanSchemaWatcher} from "../../actions/loanSchema";
import {AlertBox} from "../../components/AlertBox";
const user = storedList("user");
import {checkAccessTags} from "../../util/uam";

const isTagged =
  process.env.REACT_APP_BUILD_VERSION > 1
    ? user?.access_metrix_tags?.length
    : false;

class LoanSchema extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCompany: "",
      selectLoanType: "",
      selectedSchema: {},
      isLoanType: true,
      // schema id passed in create product component
      schemaid: "",
      listSchemas: [],
      alert: false,
      severity: "",
      alertMessage: ""
    };
  }

  handleCompanyChange = (value, stateName) => {
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
      this.setState({[stateName + "State"]: "has-danger"});
    }
    if (stateName === "selectLoanType") {
      this.getDefaultTemplates(value?.value);
    }
  };

  showAlert = (msg, type) => {
    this.setState({alert: true, severity: type, alertMessage: msg});
    setTimeout(() => {
      this.handleAlertClose();
    }, 3000);
  };

  fetchCompaniesSchemas = () => {
    const {selectedCompany} = this.state;
    new Promise((resolve, reject) => {
      this.props.getCompanyLoanSchemaWatcher(
        selectedCompany.value,
        resolve,
        reject
      );
    })
      .then(schemas => {
        this.setState({listSchemas: schemas});
      })
      .catch(error => {
      });
  };

  handleToggleStatusChange = data => {
    let payload = {
      id: data?.id,
      status: data?.status,
      company_id: this.state.selectedCompany?.value,
      user_id: user._id
    };
    new Promise((resolve, reject) => {
      this.props.updateLoanSchemaWatcher(payload, resolve, reject);
    })
      .then(response => {
        this.fetchCompaniesSchemas();
        return this.showAlert(response.message, "success");
      })
      .catch(error => {
        return this.showAlert(error.response.data.message, "error");
      });
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
    this.setState({severity: "", alertMessage: "", alert: false});
  };

  handleProductBack = () => {
    this.setState({
      isCreateProduct: false,
      schemaid: "",
      isLoanType: true
    });
  };

  render() {
    const {defaultloantypes, listSchemas, selectedSchema} = this.state;
    const {classes} = this.props;
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
          <Box sx={{marginLeft: "20px"}} py={3} mb={20}>
            {this.state.isLoanType && this.state.isLoanType === true ? (
              <Grid container>
                <Grid
                  container
                  xs={12}
                  spacing={2}
                  sx={{display: "flex", justifyContent: "space-between"}}
                >
                  <div className="ml-3">
                    <CompanyDropdown
                      placeholder="Select company"
                      onCompanyChange={value =>
                        this.handleCompanyChange(value, "selectedCompany")
                      }
                      company={this.state.selectedCompany ?? ""}
                      width="300px"
                    />
                  </div>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      window.open("/admin/loan_schema");
                    }}
                    disabled={
                      isTagged
                        ? !checkAccessTags(["tag_loan_schema_read_write"])
                        : false
                    }
                    sx={{
                      color: "#fff"
                    }}
                  >
                    Add New
                  </Button>
                </Grid>
                <Grid md={12}>
                  <Divider textAlign="left" sx={{marginTop: "20px"}} />
                </Grid>
                {listSchemas.length ? (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      marginTop: "12px",
                      padding: "20px"
                    }}
                  >
                    {isTagged ? (
                      checkAccessTags([
                        "tag_loan_schema_read",
                        "tag_loan_schema_read_write"
                      ]) ? (
                        <LoanSchemaList
                          disabled={
                            isTagged
                              ? !checkAccessTags(["tag_loan_schema_read_write"])
                              : false
                          }
                          data={listSchemas}
                          handleCreateProduct={schema =>
                            this.handleAddProduct(schema)
                          }
                          handleToggleStatusChange={data =>
                            this.handleToggleStatusChange(data)
                          }
                        />
                      ) : null
                    ) : (
                      <LoanSchemaList
                        disabled={
                          isTagged
                            ? !checkAccessTags(["tag_loan_schema_read_write"])
                            : false
                        }
                        data={listSchemas}
                        handleCreateProduct={schema =>
                          this.handleAddProduct(schema)
                        }
                        handleToggleStatusChange={data =>
                          this.handleToggleStatusChange(data)
                        }
                      />
                    )}
                  </Grid>
                ) : null}
              </Grid>
            ) : null}
            {this.state.isCreateProduct &&
            this.state.isCreateProduct === true &&
            selectedSchema ? (
              <CreateProduct
                disabled={
                  isTagged
                    ? !checkAccessTags(["tag_loan_schema_read_write"])
                    : false
                }
                schema={selectedSchema}
                handleBack={this.handleProductBack}
              />
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
      getCompanyLoanSchemaWatcher,
      updateLoanSchemaWatcher
    },
    dispatch
  );
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(null, {withTheme: true})(LoanSchema));

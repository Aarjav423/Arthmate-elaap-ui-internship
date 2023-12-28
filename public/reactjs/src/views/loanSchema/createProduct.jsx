import React, {Component} from "react";
import Button from "@mui/material/Button";
import Box from "@material-ui/core/Box";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import CardContent from "@material-ui/core/CardContent";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {createProductWatcher} from "../../actions/product";
import {storedList} from "../../util/localstorage";
import {AlertBox} from "../../components/AlertBox";

class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productname: "",
      productnameState: "",
      isCredit: false,
      creditGrids: "",
      alert: false,
      severity: "",
      alertMessage: ""
    };
  }

  change = (event, stateName, type, stateNameEqualTo, setState) => {
    switch (type) {
      case "length":
        if (event.target.value.length >= stateNameEqualTo) {
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

  handleAddProduct = () => {
    const user = storedList("user");
    const regexp = /^[a-zA-Z0-9-_]+$/;
    const validateProductName = this.state.productname.search(regexp) === -1;
    if (validateProductName) {
      this.setState({
        alert: true,
        severity: "error",
        alertMessage: "Please enter  product name with no special characters ."
      });
      setTimeout(() => {
        this.handleAlertClose();
      }, 4000);
    }
    const {schema} = this.props;
    const data = {
      name: this.state.productname,
      loan_schema_id: schema._id,
      auto_check_credit: this.state.isCredit === true ? 1 : 0,
      company_id: schema.company_id,
      company_code: schema.company_code,
      user_id: user._id
    };
    new Promise((resolve, reject) => {
      this.props.createProductWatcher(data, resolve, reject);
    })
      .then(response => {
        this.setState({
          alert: true,
          severity: "success",
          alertMessage: response.message
        });
        this.setState({productname: ""});
        setTimeout(() => {
          this.handleAlertClose();
        }, 4000);
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

  handleCheck = name => event => {
    this.setState({[name]: event.target.checked});
  };

  handleAlertClose = () => {
    this.setState({severity: "", alertMessage: "", alert: false});
  };

  render() {
    const {classes, schema, handleBack} = this.props;
    const {creditGrids, isCredit, alert, severity, alertMessage} = this.state;
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
            <Typography
              variant="button"
              sx={{
                fontWeight: "bold"
              }}
            >
              {`Create Product for ${schema.name} ${schema._id}`}
            </Typography>

            <Grid xs={12} sm={4} container>
              <FormControl sx={{m: 1, width: "100%"}} variant="standard">
                <TextField
                  variant="outlined"
                  label="Product name"
                  value={this.state.productname}
                  type="text"
                  error={this.state.productnameState === "has-danger"}
                  helperText={
                    this.state.productnameState === "has-danger"
                      ? "Enter product name "
                      : ""
                  }
                  onChange={e => this.change(e, "productname", "length", 2)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} container className="mb-3">
              <Stack spacing={2} direction="row">
                <Box m={2} pt={3}>
                  <Button
                    color="success"
                    className="pull-right ml-4 mr-3"
                    onClick={this.props.handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    className="pull-right"
                    onClick={this.handleAddProduct}
                    sx={{
                      color: "#fff"
                    }}
                  >
                    Add Product
                  </Button>
                </Box>
              </Stack>
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
      createProductWatcher
    },
    dispatch
  );
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(null, {withTheme: true})(CreateProduct));

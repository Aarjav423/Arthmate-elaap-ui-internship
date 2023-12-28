import React, {Component} from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {styled} from "@material-ui/core/styles";
import {tableCellClasses} from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
  getCompanyLoanSchemaWatcher,
  updateSchemaListWatcher
} from "../../actions/loanType";
import {storedList} from "../../util/localstorage";
import Dialog, {DialogProps} from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {Divider} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CardContent from "@mui/material/CardContent";
const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5e72e4",
    color: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.black
  }
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

class LoanSchemaList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      openDocView: false,
      loanTemplates: [],
      openDialog: false,
      logData: false
    };
  }

  componentDidMount = () => {
    return;
    const user = storedList("user");
    if (user.type === "company") {
      // get partner loan schema
      new Promise((resolve, reject) => {
        this.props.getCompanyLoanSchemaWatcher(
          user.usercompanyname,
          resolve,
          reject
        );
      });
    }
  };

  handleClose = () => {
    this.setState({openDocView: false});
    this.setState({openDialog: false});
  };

  toggleDocView = data => {
    this.setState({openDocView: !this.state.openDocView, loanTemplates: data});
  };

  viewLogDetails = data => {
    this.setState({openDialog: !this.state.openDialog, logData: data});
  };

  viewLogDetails = data => {
    this.setState({openDialog: !this.state.openDialog, logData: data});
  };

  renderLoanTemplates = () => {
    return (
      <React.Fragment>
        <Dialog
          fullWidth={false}
          open={this.state.openDocView}
          onClose={() => this.handleClose()}
        >
          <DialogTitle>Loan Templates</DialogTitle>
          <Divider />
          <DialogContent style={{width: "500px"}}>
            {this.state?.loanTemplates?.map((item, index) => {
              return (
                <div key={index + 1}>
                  {" "}
                  <b>{`${index + 1} Name:`}</b> {`${item.name}`}
                </div>
              );
            })}
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button
              size="sm"
              variant="contained"
              color="error"
              onClick={() => this.handleClose()}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  };

  handleToggleStatusChange = (e, data) => {
    this.props.handleToggleStatusChange({
      status: e.target.checked === true ? 1 : 0,
      id: data?._id
    });
  };

  handleEditLoanSchema = data => {
    window.open(`update_default_template`, "_blank");
  };

  render() {
    const {data} = this.props;
    return (
      <>
        {this.state.openDialog && this.state.logData?.created_by ? (
          <Dialog
            fullWidth
            maxWidth={"md"}
            open={this.state.openDialog}
            onClose={() => this.handleClose()}
          >
            <DialogTitle>Log details</DialogTitle>
            <Divider />
            <DialogContent>
              <CardContent>
                <Typography>
                  <b>Creation details</b>
                </Typography>
                <Grid container>
                  <Grid item xs={4}>
                    <Typography>
                      <b>User name</b>:{" "}
                      {this.state.logData?.created_by[0]?.user_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>
                      <b>Company code</b>:{" "}
                      {this.state.logData?.created_by[0]?.company_code}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>
                      <b>Time stamp</b>:{" "}
                      {this.state.logData?.created_by[0]?.timestamp}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardContent>
                <Typography>
                  <b>Updation details</b>
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>User name</StyledTableCell>
                        <StyledTableCell>Company code</StyledTableCell>
                        <StyledTableCell>Time stamp</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.logData?.updated_by
                        ? this.state.logData?.updated_by?.map(item => (
                            <StyledTableRow key={item._id}>
                              <StyledTableCell scope="row">
                                {item.user_name}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {item.company_code}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {item.timestamp}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        : null}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </DialogContent>
            <Divider />
            <DialogActions>
              <Button
                size="sm"
                variant="contained"
                color="error"
                onClick={() => this.handleClose()}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
        {this.renderLoanTemplates()}
        <Grid container xs={12}>
          <Grid xs={12}>
            <Typography
              variant="h6"
              display="block"
              sx={{
                fontWeight: "bold"
              }}
            >
              Loan schema list
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 700}} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Company code</StyledTableCell>
                    <StyledTableCell>Loan schema name</StyledTableCell>
                    <StyledTableCell>Loan type</StyledTableCell>
                    <StyledTableCell>Active products</StyledTableCell>
                    <StyledTableCell>Loan templates</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Edit</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                    <StyledTableCell>Logs</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data &&
                    data.map(item => (
                      <StyledTableRow key={item.name}>
                        <StyledTableCell scope="row">
                          {item.company_code}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {item.name}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {item?.loanDefaultTypes?.name}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {
                            item?.products?.filter(
                              product => product?.status === 1
                            )?.length
                          }
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Tooltip title="Details" placement="top" arrow>
                            <IconButton
                              aria-label="details"
                              color="primary"
                              onClick={() =>
                                this.toggleDocView(item?.loanTemplates)
                              }
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Switch
                            color="primary"
                            disabled={
                              item?.products?.filter(
                                product => product?.status === 1
                              )?.length || this.props.disabled
                                ? true
                                : false
                            }
                            checked={item.status ? true : false}
                            onChange={e =>
                              this.handleToggleStatusChange(e, item)
                            }
                          />
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Tooltip
                            title="Edit loan schema"
                            placement="top"
                            arrow
                          >
                            <IconButton
                              aria-label="edit-loan-schema"
                              color="primary"
                              disabled={this.props.disabled}
                              onClick={() => this.handleEditLoanSchema(item)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Button
                            size="sm"
                            variant="contained"
                            color="info"
                            onClick={() => window.open(`product/${item.company_id}/${item._id}/${item.name}`, "_blank")}
                            disabled={this.props.disabled}
                          >
                            Create product
                          </Button>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Tooltip
                            title="View log details"
                            placement="top"
                            arrow
                          >
                            <IconButton
                              aria-label="edit-loan-schema"
                              color="primary"
                              onClick={() => {
                                this.viewLogDetails(item);
                              }}
                            >
                              <ManageAccountsIcon />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    listSchemas: state.profile.listSchemas
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCompanyLoanSchemaWatcher,
      updateSchemaListWatcher
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LoanSchemaList);

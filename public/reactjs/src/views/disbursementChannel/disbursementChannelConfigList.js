import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@material-ui/core/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { storedList } from "../../util/localstorage";
import { useDispatch } from "react-redux";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import {
  ListDisbursementConfigChannel,
  updateDisbursementConfigChannel,
  deleteDisbursementConfigChannel,
  updateDisbursementConfigChannelStatus
} from "../../actions/disbursementConfigChannel";
import { verifyNumber } from "../../util/helper";
import CompanyDropdown from "../../components/Company/CompanySelect";
import { AlertBox } from "../../components/AlertBox";
import { checkAccessTags } from "../../util/uam";
const user = storedList("user");

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5e72e4",
    color: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.black
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const DisbursementChannelConfigList = (props) => {
  const dispatch = useDispatch();
  const [severity, setSeverity] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [configLists, setConfigLists] = useState("");
  const [debitAccount, setDebitAccount] = useState("");
  const [debitAccountState, setDebitAccountState] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const handleDisbursementConfigProductListByCompany = () => {
    const user = storedList("user");
    const data = {
      userData: {
        company_id: companyFilter.value || "",
        user_id: user._id
      }
    };
    new Promise((resolve, reject) => {
      dispatch(ListDisbursementConfigChannel(data, resolve, reject));
    })
      .then((response) => {
        setConfigLists(response);
      })
      .catch((error) => {
        showAlert(error.response.data.message, "error");
        setConfigLists("");
      });
  };

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_disbursement_channel_list_read",
        "tag_disbursement_channel_list_read_write"
      ])
    )
      handleDisbursementConfigProductListByCompany();
    if (!isTagged) handleDisbursementConfigProductListByCompany();
  }, [companyFilter]);

  const deleteDisbursementConfigChannelData = (item) => {
    const user = storedList("user");
    var data = item;
    data.user_id = user._id;
    new Promise((resolve, reject) => {
      dispatch(deleteDisbursementConfigChannel(data, resolve, reject));
    })
      .then((response) => {
        showAlert(response.message, "success");
        handleDisbursementConfigProductListByCompany();
      })
      .catch((error) => {
        showAlert(error.response.data.message, "error");
      });
  };

  const editDisbursementConfigChannel = (
    type,
    value,
    item,
    state = "has-danger"
  ) => {
    if (!value) {
      showAlert(type + " is required", "error");
      return;
    } else if (type === "debit_account" && state !== "has-success") {
      showAlert("Enter valid debit_account", "error");
      return;
    }
    const user = storedList("user");
    var data = {
      userData: {
        company_id: item.company_id,
        product_id: item.product_id,
        user_id: user._id
      },
      submitData: {
        disburse_channel: item.value,
        wallet_config_check: item.wallet_config_check,
        debit_account: item.debit_account,
        id: item._id
      }
    };
    if (typeof value === "object") {
      data.submitData[type] = value.value;
    } else {
      data.submitData[type] = value;
    }

    new Promise((resolve, reject) => {
      dispatch(updateDisbursementConfigChannel(data, resolve, reject));
    })
      .then((response) => {
        showAlert(response.message, "success");
        handleDisbursementConfigProductListByCompany();
      })
      .catch((error) => {
        showAlert(error.response.data.message, "error");
      });
  };

  const updateDisbursementConfigStatus = (e, item) => {
    const user = storedList("user");
    var data = {
      userData: {
        company_id: item.company_id,
        product_id: item.product_id,
        user_id: user._id
      },
      submitData: {
        id: item._id,
        status: e.target.checked === true ? "1" : "0"
      }
    };
    new Promise((resolve, reject) => {
      dispatch(updateDisbursementConfigChannelStatus(data, resolve, reject));
    })
      .then((response) => {
        showAlert(response.message, "success");
        handleDisbursementConfigProductListByCompany();
      })
      .catch((error) => {
        showAlert(error.response?.data?.message, "error");
      });
  };

  const handleInputChange = (value) => {
    verifyNumber(value)
      ? setDebitAccountState("has-success")
      : setDebitAccountState("has-danger");
    setDebitAccount(value);
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  return (
    <Grid
      xs={12}
      sx={{
        paddingTop: "10px",
        height: "100%",
        marginLeft: "1.3rem!important"
      }}
    >
      <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
        Disbursement channel config list
      </Typography>
      <Grid container xs={12} spacing={2}>
        <Grid xs={12}>
          {alert ? (
            <AlertBox
              severity={severity}
              msg={alertMessage}
              onClose={handleAlertClose}
            />
          ) : null}
        </Grid>
        <Grid xs={12} sm={4} item>
          <CompanyDropdown
            placeholder="Select company"
            onCompanyChange={(value) => setCompanyFilter(value)}
          />
        </Grid>
        {configLists.length ? (
          <Grid
            item
            xs={12}
            sx={{
              marginTop: "30px"
            }}
          >
            {isTagged ? (
              checkAccessTags([
                "tag_disbursement_channel_list_read",
                "tag_disbursement_channel_list_read_write"
              ]) ? (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell> Company name</StyledTableCell>
                        <StyledTableCell> Colender name</StyledTableCell>
                        <StyledTableCell> Product name</StyledTableCell>
                        <StyledTableCell> Disburse channel</StyledTableCell>
                        <StyledTableCell> Wallet config check</StyledTableCell>
                        <StyledTableCell> Debit account</StyledTableCell>
                        <StyledTableCell> IFSC</StyledTableCell>
                        <StyledTableCell> Available balance</StyledTableCell>
                        <StyledTableCell> Action </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {configLists &&
                        configLists.map((item) => (
                          <StyledTableRow key={item._id}>
                            <StyledTableCell scope="row">
                              {item.company_name}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.co_lender_name ? item.co_lender_name : ""}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <StyledTableCell scope="row">
                                {item.product_name}
                              </StyledTableCell>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {item.disburse_channel}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {Number(item.wallet_config_check)
                                ? "True"
                                : "false"}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {item.debit_account}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {item.debit_account_ifsc || "NA"}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {Number(item.wallet_config_check)
                                ? item.available_balance
                                : "NA"}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <Switch
                                color="primary"
                                checked={item.status === "1" ? true : false}
                                disabled={
                                  isTagged
                                    ? !checkAccessTags([
                                        "tag_disbursement_channel_list_read_write"
                                      ])
                                    : false
                                }
                                onChange={(e) =>
                                  updateDisbursementConfigStatus(e, item)
                                }
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : null
            ) : (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell> Company name</StyledTableCell>
                      <StyledTableCell> Colender name</StyledTableCell>
                      <StyledTableCell> Product name</StyledTableCell>
                      <StyledTableCell> Disburse channel</StyledTableCell>
                      <StyledTableCell> Wallet config check</StyledTableCell>
                      <StyledTableCell> Debit account</StyledTableCell>
                      <StyledTableCell> IFSC</StyledTableCell>
                      <StyledTableCell> Available balance</StyledTableCell>
                      <StyledTableCell> Action </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {configLists &&
                      configLists.map((item) => (
                        <StyledTableRow key={item._id}>
                          <StyledTableCell scope="row">
                            {item.company_name}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.co_lender_name ? item.co_lender_name : ""}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <StyledTableCell scope="row">
                              {item.product_name}
                            </StyledTableCell>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {item.disburse_channel}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {Number(item.wallet_config_check)
                              ? "True"
                              : "false"}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {item.debit_account}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {item.debit_account_ifsc || "NA"}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {Number(item.wallet_config_check)
                              ? item.available_balance
                              : "NA"}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Switch
                              color="primary"
                              checked={item.status === "1" ? true : false}
                              onChange={(e) =>
                                updateDisbursementConfigStatus(e, item)
                              }
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default DisbursementChannelConfigList;

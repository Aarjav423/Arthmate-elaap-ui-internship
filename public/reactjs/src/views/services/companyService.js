import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import { styled } from "@material-ui/core/styles";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import moment from "moment";
import GenToken from "../../components/Access/GenToken";
import {
  toggleCompanyServicesWatcher,
  getAllServicesWatcher,
  getCompanyServicesWatcher,
  getServicesPCByCompanyWatcher
} from "../../actions/services";
import { storedList } from "../../util/localstorage";
import { AlertBox } from "../../components/AlertBox";

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

export default function CompanyServices(props) {
  const dispatch = useDispatch();
  const { company, disabled } = props;
  const user = storedList("user");
  const [services, setServices] = useState("");
  const [companyServices, setCompanyServices] = useState("");
  const [onToggleChange, setOnToggleChange] = useState(false);
  const [isTagged, setIsTagged] = useState(false);
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  useEffect(() => {
    const data = {
      userData: {
        company_id: !company ? "" : company.value,
        user_id: user._id
      }
    };
    new Promise((resolve, reject) => {
      dispatch(getAllServicesWatcher(resolve, reject));
    })
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        return showAlert(error.response.data.message, "error");
      });
    setIsTagged(user?.access_metrix_tags?.includes("tag_products_read_write"));
    setIsToggleDisabled(
      user.type === "admin" &&
        user?.access_metrix_tags?.includes("tag_products_read_write")
        ? false
        : true
    );
  }, []);

  const getCompanyServiceList = () => {
    new Promise((resolve, reject) => {
      dispatch(getCompanyServicesWatcher(company.value, resolve, reject));
    })
      .then((response) => {
        setCompanyServices(response);
      })
      .catch((error) => {
        setCompanyServices("");
      });
  };

  useEffect(() => {
    if (company) {
      getCompanyServiceList();
    }
  }, [company]);

  useEffect(() => {
    if (company) {
      getCompanyServiceList();
    }
  }, [onToggleChange]);

  const handleToggleCompanyService = (e, comp_id, service_id) => {
    const data = {
      company_id: company.value,
      services: service_id,
      status: e.target.checked === true ? 1 : 0
    };
    new Promise((resolve, reject) => {
      dispatch(toggleCompanyServicesWatcher(data, resolve, reject));
    })
      .then((response) => {
        new Promise((resolve, reject) => {
          getCompanyServicesWatcher(comp_id, resolve, reject);
        });
        getCompanyServiceList();
      })
      .catch((error) => {
        return showAlert(error.response.data.message, "error");
      });
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleDownloadJson = (json) => {
    const fileName = `postman-collection-${moment().format("YYYY-MM-DD")}.json`;
    const finalJson = JSON.stringify(json);
    const blob = new Blob([finalJson], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadServicePCByCompany = (e) => {
    const data = {
      company_id: company.value,
      companyServiceId: e
    };
    if (!e.length) {
      dispatch(setAlert(false, "Services not activated", "error"));
      return;
    }
    new Promise((resolve, reject) => {
      dispatch(getServicesPCByCompanyWatcher(data, resolve, reject));
    })
      .then((response) => {
        handleDownloadJson(response);
      })
      .catch((error) => {
        return showAlert(error.response.data.message, "error");
      });
  };

  return (
    <>
      <Grid xs={12}>
        <Grid xs={12}>
          {alert ? (
            <AlertBox
              severity={severity}
              msg={alertMessage}
              onClose={handleAlertClose}
            />
          ) : null}
        </Grid>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={3}>
            {user.type === "admin" ? (
              <div>
                <Divider />
                <h4 style={{ "text-align": "center" }}>
                  Manage services for company
                </h4>
                <h4>
                  Choose which services you would like to make available for a
                  company.
                </h4>
              </div>
            ) : (
              <div>
                <h1>Services List</h1>
              </div>
            )}
          </Grid>
        </Grid>
        <Grid container columns={16} ml={10}>
          <Grid item xs={8}>
            Postman collection for services :
            <IconButton
              color="primary"
              disabled={
                company && companyServices.length
                  ? false
                  : disabled
                  ? true
                  : true
              }
              size="large"
              onClick={() => {
                handleDownloadServicePCByCompany(companyServices);
              }}
            >
              <CloudDownloadIcon fontSize="medium" />
            </IconButton>
          </Grid>
          <Grid item xs={8}>
            Access token for services :
            <GenToken
              product={{}}
              company={company}
              disabled={disabled}
              user={user}
              type="service"
            />
          </Grid>
        </Grid>
        <Divider />
        <Grid xs={12} m={2}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell> Service id</StyledTableCell>
                  <StyledTableCell> Service name</StyledTableCell>
                  <StyledTableCell> status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {company &&
                  services &&
                  services.map((service, index) => {
                    return (
                      <StyledTableRow key={index}>
                        <StyledTableCell scope="row">
                          {service._id}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {service.service_name}
                        </StyledTableCell>
                        {
                          <StyledTableCell align="left">
                            <Switch
                              color="primary"
                              checked={companyServices.includes(service._id)}
                              disabled={isToggleDisabled}
                              onChange={(e) =>
                                handleToggleCompanyService(
                                  e,
                                  company.value,
                                  service._id
                                )
                              }
                            />
                          </StyledTableCell>
                        }
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

import * as React from "react";
import {useState, useEffect} from "react";
import {styled} from "@material-ui/core/styles";
import {tableCellClasses} from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import {useDispatch} from "react-redux";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import {useHistory} from "react-router-dom";
import {checkAccessTags} from "../../util/uam";
import {storedList} from "../../util/localstorage";
const user = storedList("user");

import {
  getAllServicesWatcher,
  toggleServiceStatusWatcher
} from "../../actions/services";
import EditServices from "./editServices";
import {AlertBox} from "../../components/AlertBox";

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#82bdd6",
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

export default function ManageService(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [severity, setSeverity] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [serviceLists, setServiceLists] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [service, setService] = useState("");

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const backToServiceList = () => {
    setShowEditForm(false);
    setShowTable(true);
  };

  const handleServiceList = () => {
    new Promise((resolve, reject) => {
      dispatch(getAllServicesWatcher(resolve, reject));
    })
      .then(response => {
        setServiceLists(response.data);
      })
      .catch(error => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response.data.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_manage_service_read",
        "tag_manage_service_read_write"
      ])
    )
      handleServiceList();
    if (!isTagged) handleServiceList();
  }, []);

  const toggleProductStatus = (e, id) => {
    const data = {
      id: id,
      status: e.target.checked === true ? 1 : 0
    };
    new Promise((resolve, reject) => {
      dispatch(toggleServiceStatusWatcher(data, resolve, reject));
    })
      .then(response => {
        setAlert(true);
        setSeverity("success");
        setAlertMessage("Product status updated successfully");
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
        handleServiceList();
      })
      .catch(error => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage("error.response.data.message");
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleNextStage = item => {
    history.push(`edit_service/${item._id}`);
    setShowEditForm(true);
    item.section = {label: item.section, value: item.section};
    item.type = {label: item.type, value: item.type};
    setService(item);
  };

  return (
    <Grid container xs={12} sx={{marginLeft: "1.3rem!important"}}>
      <Grid xs={12}>
        <Typography sx={{mt: 2}} variant="h6">
          Manage service
        </Typography>
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}
        {showEditForm ? (
          <Grid
            item
            xs={12}
            sx={{
              marginTop: "30px"
            }}
          >
            <EditServices
              selectedService={service}
              backToServiceList={backToServiceList}
            />
          </Grid>
        ) : null}

        {showTable ? (
          <Grid
            item
            xs={12}
            sx={{
              marginTop: "30px"
            }}
          >
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 700}} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell> Service id</StyledTableCell>
                    <StyledTableCell> Service name</StyledTableCell>
                    <StyledTableCell> Status</StyledTableCell>
                    <StyledTableCell> Edit</StyledTableCell>
                  </TableRow>
                </TableHead>
                {showEditForm == false && serviceLists.length ? (
                  <TableBody>
                    {serviceLists &&
                      serviceLists.map(item => (
                        <StyledTableRow key={item._id}>
                          <StyledTableCell scope="row">
                            {item._id}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item.service_name}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Switch
                              color="primary"
                              checked={item.status ? true : false}
                              disabled={
                                isTagged
                                  ? !checkAccessTags([
                                      "tag_manage_service_read_write"
                                    ])
                                  : false
                              }
                              onChange={e => toggleProductStatus(e, item._id)}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <StyledTableCell scope="row">
                              <Tooltip
                                title="Edit service"
                                placement="top"
                                arrow
                              >
                                <IconButton
                                  aria-label="edit_service"
                                  color="primary"
                                  disabled={
                                    isTagged
                                      ? !checkAccessTags([
                                          "tag_manage_service_read_write"
                                        ])
                                      : false
                                  }
                                  onClick={() => handleNextStage(item)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </StyledTableCell>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                ) : null}
              </Table>
            </TableContainer>
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
}

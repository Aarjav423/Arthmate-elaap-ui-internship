import React from "react";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {
  Card,
  CardContent,
  Divider,
  Typography,
  Grid,
  Stack,
  Alert,
  TextField,
  Button
} from "@mui/material";
import {storedList} from "../../util/localstorage";
import {styled} from "@material-ui/core/styles";
import {tableCellClasses} from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import FilledInput from "@mui/material/FilledInput";
import {
  getListDisbursementChannelWatcher,
  deleteDisbursementChannel,
  AddDisbursementChannel,
  updateDisbursementChannel
} from "../../actions/compositeDisbursement";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {validateData} from "../../util/validation";
import {AlertBox} from "../../components/AlertBox";
import {checkAccessTags} from "../../util/uam";
const user = storedList("user");

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

const DisbursementMaster = () => {
  const dispatch = useDispatch();
  const [company, setCompany] = useState("");
  const [disbursementChannelList, setDisbursementChannelList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [isOpen, setisOpen] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [title, setTitle] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [updateId, setUpdateId] = useState(null);
  const [secretKeyDisplay, setSecretKeyDisplay] = useState(false);
  const [error, setError] = useState(false);

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleShowAleart = (type, message) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(message);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const handleGetChannelList = () => {
    const user = storedList("user");
    const data = {
      userData: {
        company_id: company?.value,
        user_id: user._id
      },
      submitData: {}
    };

    new Promise((resolve, reject) => {
      dispatch(getListDisbursementChannelWatcher(data, resolve, reject));
    })
      .then(response => {
        if (response.message) {
          handleShowAleart("error", response.message);
          setDisbursementChannelList([]);
        }
        if (response.data.length) {
          setDisbursementChannelList(response.data);
        }
      })
      .catch(error => {
        handleShowAleart("error", error?.response?.data?.message);
      });
  };

  const handledeleteChannelList = id => {
    const user = storedList("user");
    const data = {
      userData: {
        company_id: user.company_id,
        user_id: user._id
      },
      submitData: {id: id}
    };
    new Promise((resolve, reject) => {
      dispatch(deleteDisbursementChannel(data, resolve, reject));
    })
      .then(response => {
        handleGetChannelList();
        return handleShowAleart("success", response.data.message);
      })
      .catch(error => {
        return handleShowAleart("error", error.response.data.message);
      });
  };

  const handleCleardisbChannel = () => {
    setTitle("");
    setEndpoint("");
    setSecretKey("");
    setUpdateId(null);
  };

  const handledOnboardChannel = () => {
    if (!error && secretKey && title) {
      const user = storedList("user");
      const data = {
        userData: {
          company_id: user.company_id,
          user_id: user._id
        },
        submitData: {
          title: title,
          endpoint: endpoint,
          secret_key: secretKey
        }
      };

      new Promise((resolve, reject) => {
        dispatch(AddDisbursementChannel(data, resolve, reject));
      })
        .then(response => {
          handleGetChannelList();
          handleCleardisbChannel();
          setisOpen(!isOpen);
          handleShowAleart(
            "success",
            response.data.message ||
              "Master disbursement channel created successfully!"
          );
        })
        .catch(error => {
          handleShowAleart("error", error?.response?.data?.message);
        });
    } else {
      handleShowAleart("error", "All fields are mandatory");
    }
  };

  const handledChannelUpdate = () => {
    if (!error && secretKey && title) {
      const user = storedList("user");
      const data = {
        userData: {
          company_id: user.company_id,
          user_id: user._id
        },
        submitData: {
          title: title,
          endpoint: endpoint,
          secret_key: secretKey,
          id: updateId
        }
      };

      new Promise((resolve, reject) => {
        dispatch(updateDisbursementChannel(data, resolve, reject));
      })
        .then(response => {
          setisOpen(!isOpen);
          handleCleardisbChannel();
          handleGetChannelList();
          handleShowAleart("success", response?.data?.message);
        })
        .catch(error => {
          handleShowAleart("error", error.response.data.message);
        });
    } else {
      handleShowAleart("error", "All fields are mandatory");
    }
  };

  const handleOpenUpdateModal = data => {
    setSecretKeyDisplay(false);
    setTitle(data.title);
    setEndpoint(data.endpoint);
    setSecretKey(data.secret_key);
    setUpdateId(data._id);
    setisOpen(!isOpen);
  };

  const handleSecretKeyToggle = () => {
    setSecretKeyDisplay(!secretKeyDisplay);
  };

  React.useEffect(() => {
    if (endpoint && !validateData("website", endpoint)) {
      setError(true);
    }
    if (
      isTagged &&
      checkAccessTags([
        "tag_disbursement_channel_master_read",
        "tag_disbursement_channel_master_read_write"
      ])
    )
      handleGetChannelList();
    if (!isTagged) handleGetChannelList();
  }, [company]);

  const renderAdvanceSearch = () => (
    <div>
      <React.Fragment>
        <Dialog
          fullWidth={true}
          maxWidth={false}
          open={isOpen}
          onClose={() => setisOpen(!isOpen)}
        >
          <DialogTitle>Onboard Disbursement Channel</DialogTitle>
          <DialogContent>
            <Grid xs={12}>
              {alert ? (
                <AlertBox
                  severity={severity}
                  msg={alertMessage}
                  onClose={handleAlertClose}
                />
              ) : null}
            </Grid>
            <Divider />
            <Grid
              sx={{
                paddingTop: "20px",
                paddingBottom: "20px",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Grid className="p-2" xs={12} item>
                <TextField
                  required={true}
                  sx={{width: 465}}
                  id="title"
                  label="Title"
                  variant="outlined"
                  value={title}
                  onChange={e => {
                    setTitle(e.target.value);
                  }}
                />
              </Grid>
              <Grid className="p-2" xs={12} item>
                <TextField
                  error={error}
                  helperText={error ? "Enter valid website" : null}
                  sx={{width: 465}}
                  id="endpoint"
                  label="Endpoint"
                  variant="outlined"
                  value={endpoint}
                  onChange={e => {
                    setEndpoint(e.target.value);
                    if (validateData("website", e.target.value))
                      setError(false);
                    else setError(true);
                  }}
                />
              </Grid>
              <Grid className="p-2" xs={12} item>
                <FilledInput
                  type={secretKeyDisplay ? "text" : "password"}
                  placeholder="secretkey"
                  value={secretKey}
                  onChange={e => setSecretKey(e.target.value)}
                />
              </Grid>
            </Grid>
            <Divider />
            <DialogActions>
              <Grid className="pt-2">
                <Button
                  sx={{ml: 1}}
                  variant="contained"
                  color="error"
                  size="md"
                  onClick={handleCleardisbChannel}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  sx={{ml: 1}}
                  size="md"
                  onClick={
                    updateId ? handledChannelUpdate : handledOnboardChannel
                  }
                >
                  {updateId ? "Update" : "Submit"}
                </Button>
                <Button
                  sx={{ml: 1}}
                  variant="contained"
                  onClick={() => setisOpen(!isOpen)}
                  color="error"
                >
                  Close
                </Button>
              </Grid>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </div>
  );

  return (
    <Grid
      xs={12}
      sx={{paddingTop: "10px", height: "100%", marginLeft: "1.3rem!important"}}
    >
      <Typography sx={{mt: 2, mb: 2}} variant="h6">
        Disbursement channel master
      </Typography>
      {renderAdvanceSearch()}
      <Card className="mr-3">
        <CardContent>
          <Grid xs={12}>
            {!isOpen && alert ? (
              <Stack
                lg={{
                  width: "80%"
                }}
                justifyContent="center"
                alignItems="center"
              >
                <Alert severity={severity} onClose={handleAlertClose}>
                  {alertMessage}
                </Alert>
              </Stack>
            ) : null}
          </Grid>
          <Button
            variant="contained"
            disabled={
              isTagged
                ? !checkAccessTags([
                    "tag_disbursement_channel_master_read_write"
                  ])
                : false
            }
            onClick={() => setisOpen(!isOpen)}
          >
            Add New
          </Button>
          <Grid xs={12} container>
            {isTagged ? (
              checkAccessTags(["tag_user_read", "tag_user_read_write"]) ? (
                <TableContainer sx={{mt: 4, ml: 2}} component={Paper}>
                  <Table sx={{minWidth: 700}} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Title </StyledTableCell>
                        <StyledTableCell> Endpoint </StyledTableCell>
                        <StyledTableCell> Actions </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {disbursementChannelList &&
                        disbursementChannelList.map(item => {
                          return (
                            <StyledTableRow key={item._id}>
                              <StyledTableCell scope="row">
                                {item.title}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {item.endpoint}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                <Tooltip title="Edit" placement="top" arrow>
                                  <IconButton
                                    aria-label="Edit"
                                    color="primary"
                                    disabled={
                                      isTagged
                                        ? !checkAccessTags([
                                            "tag_disbursement_channel_master_read_write"
                                          ])
                                        : false
                                    }
                                    onClick={() => handleOpenUpdateModal(item)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete" placement="top" arrow>
                                  <IconButton
                                    aria-label="Edit"
                                    color="primary"
                                    disabled={
                                      isTagged
                                        ? !checkAccessTags([
                                            "tag_disbursement_channel_master_read_write"
                                          ])
                                        : false
                                    }
                                    onClick={() =>
                                      handledeleteChannelList(item._id)
                                    }
                                  >
                                    <DeleteForeverIcon style={{color: "red"}} />
                                  </IconButton>
                                </Tooltip>
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : null
            ) : (
              <TableContainer sx={{mt: 4, ml: 2}} component={Paper}>
                <Table sx={{minWidth: 700}} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Title </StyledTableCell>
                      <StyledTableCell> Endpoint </StyledTableCell>
                      <StyledTableCell> Actions </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {disbursementChannelList &&
                      disbursementChannelList.map(item => {
                        return (
                          <StyledTableRow key={item._id}>
                            <StyledTableCell scope="row">
                              {item.title}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item.endpoint}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              <Tooltip title="Edit" placement="top" arrow>
                                <IconButton
                                  aria-label="Edit"
                                  color="primary"
                                  onClick={() => handleOpenUpdateModal(item)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete" placement="top" arrow>
                                <IconButton
                                  aria-label="Edit"
                                  color="primary"
                                  onClick={() =>
                                    handledeleteChannelList(item._id)
                                  }
                                >
                                  <DeleteForeverIcon style={{color: "red"}} />
                                </IconButton>
                              </Tooltip>
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DisbursementMaster;

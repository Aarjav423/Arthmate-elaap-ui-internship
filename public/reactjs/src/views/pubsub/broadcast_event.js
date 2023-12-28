import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, styled } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import componentStyles from "assets/theme/views/auth/register.js";
import componentStylesButtons from "assets/theme/components/button.js";
import TextField from "@mui/material/TextField";
import { validateData } from "../../util/validation";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { checkAccessTags } from "../../util/uam";
import { storedList } from "../../util/localstorage";
const user = storedList("user");

import {
  createBroadcastEventWatcher,
  broadcastEventListWatcher,
  updateBroadcastEventWatcher,
  updateBroadcastEventStatusWatcher
} from "../../actions/pubsub";
import { AlertBox } from "../../components/AlertBox";

const useStyles = makeStyles(componentStyles);
const useStylesButtons = makeStyles(componentStylesButtons);

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

const defaultErrors = {
  titleError: false,
  descriptionError: false,
  keyError: false
};

const BroadcastEvent = () => {
  const classes = {
    ...useStyles(),
    ...useStylesButtons()
  };
  const dispatch = useDispatch();
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [key, setKey] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(defaultErrors);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [userList, setUserList] = useState([]);

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  React.useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_broadcast_event_read",
        "tag_broadcast_event_read_write"
      ])
    )
      fetchEventList();
    if (!isTagged) fetchEventList();
  }, []);

  const fetchEventList = () => {
    const payload = {};
    new Promise((resolve, reject) => {
      dispatch(broadcastEventListWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setEventList(response);
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response.data.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  const handleInputChange = (field, validationType, setValue) => (event) => {
    const { value } = event.target;
    setValue(value);
    setErrors({
      ...errors,
      [field + "Error"]: !validateData(validationType, value)
    });
  };

  const handleSelectChange = (field, value, setValue, isMulti) => {
    if (value === null) {
      setValue("");
    } else {
      setValue(value);
    }
    setErrors({
      ...errors,
      [field + "Error"]: isMulti ? !value?.length : !value
    });
  };

  const validate = () => {
    let formValidated = true;
    if (!validateData("title", title) || title === "") {
      setErrors({
        ...errors,
        titleError: true
      });
      formValidated = false;
    }
    if (!validateData("description", description) || description === "") {
      setErrors({
        ...errors,
        descriptionError: true
      });
    }
    if (!validateData("title", key) || key === "") {
      setErrors({
        ...errors,
        keyError: true
      });
      formValidated = false;
    }
    return formValidated;
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setKey("");
    setCurrentEvent(null);
    setErrors(defaultErrors);
  };

  const handleSubmit = () => {
    if (saving) return;
    if (validate()) {
      setSaving(true);
      const payload = {
        title,
        description,
        key
      };
      new Promise((resolve, reject) => {
        dispatch(createBroadcastEventWatcher(payload, resolve, reject));
      })
        .then((response) => {
          setAlert(true);
          setSeverity("success");
          handleClear();
          setAlertMessage(response.message);
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
          setSaving(false);
          fetchEventList();
        })
        .catch((error) => {
          setAlert(true);
          setSeverity("error");
          setAlertMessage(error.response.data.message);
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
          setSaving(false);
        });
    }
  };

  const handleEditChange = (event) => {
    setTitle(event.title);
    setDescription(event.description);
    setKey(event.key);
    setCurrentEvent(event);
  };

  const handleEventUpdateSubmit = (eventItem) => {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      title,
      description,
      key,
      id: currentEvent._id
    };
    new Promise((resolve, reject) => {
      dispatch(updateBroadcastEventWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setAlert(true);
        setSeverity("success");
        //handleClear();
        setAlertMessage(response.message);
        setTimeout(() => {
          handleAlertClose();
        }, 10000);
        setSaving(false);
        fetchEventList();
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response.data.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
        setSaving(false);
      });
  };

  const handleStatusToggle = (eventItem) => {
    setSaving(true);
    const payload = {
      title: eventItem.title,
      description: eventItem.description,
      key: eventItem.key,
      id: eventItem._id,
      status: eventItem.status === "Inactive" ? "active" : "Inactive"
    };
    new Promise((resolve, reject) => {
      dispatch(updateBroadcastEventStatusWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setAlert(true);
        setSeverity("success");
        //handleClear();
        setAlertMessage(response.message);
        setTimeout(() => {
          handleAlertClose();
        }, 10000);
        setSaving(false);
        fetchEventList();
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response.data.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
        setSaving(false);
      });
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
          Broadcast event
        </Typography>
        <CardContent>
          {alert ? (
            <AlertBox
              severity={severity}
              msg={alertMessage}
              onClose={handleAlertClose}
            />
          ) : null}
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <FormControl
                variant="filled"
                component={Box}
                width="100%"
                marginBottom="1.5rem!important"
              >
                <TextField
                  id="outlined-basic"
                  label="Title"
                  variant="outlined"
                  type="text"
                  placeholder="title"
                  value={title}
                  error={errors.titleError}
                  helperText={errors.titleError ? "Enter valid title" : ""}
                  onChange={handleInputChange("title", "title", setTitle)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl
                variant="filled"
                component={Box}
                width="100%"
                marginBottom="1.5rem!important"
              >
                <TextField
                  id="outlined-basic-2"
                  label="Description"
                  variant="outlined"
                  type="text"
                  placeholder="Description"
                  value={description}
                  error={errors.descriptionError}
                  helperText={
                    errors.descriptionError ? "Enter valid description" : ""
                  }
                  onChange={handleInputChange(
                    "description",
                    "description",
                    setDescription
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl
                variant="filled"
                component={Box}
                width="100%"
                marginBottom="1.5rem!important"
              >
                <TextField
                  id="outlined-basic-3"
                  label="Key"
                  variant="outlined"
                  type="text"
                  placeholder="Key"
                  value={key}
                  error={errors.keyError}
                  helperText={errors.keyError ? "Enter valid key" : ""}
                  onChange={handleInputChange("key", "title", setKey)}
                />
              </FormControl>
            </Grid>
            {!currentEvent && (
              <Box
                textAlign="center"
                marginTop="0.6rem"
                marginBottom="1.5rem"
                marginLeft="0.6rem"
                alignSelf="center"
              >
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={
                    saving || isTagged
                      ? !checkAccessTags(["tag_broadcast_event_read_write"]) ||
                        !title ||
                        !description ||
                        !key ||
                        errors.titleError ||
                        errors.descriptionError ||
                        errors.keyError
                      : !title ||
                        !description ||
                        !key ||
                        errors.titleError ||
                        errors.descriptionError ||
                        errors.keyError
                  }
                  classes={{
                    root: classes.buttonContainedInfo
                  }}
                >
                  Submit
                </Button>
              </Box>
            )}

            {currentEvent?._id && (
              <Box
                textAlign="center"
                marginTop="0.6rem"
                marginBottom="1.5rem"
                marginLeft="0.6rem"
                alignSelf="center"
              >
                <Button
                  variant="contained"
                  onClick={handleEventUpdateSubmit}
                  disabled={
                    saving || isTagged
                      ? !checkAccessTags(["tag_broadcast_event_read_write"]) ||
                        !title ||
                        !description ||
                        !key ||
                        errors.titleError ||
                        errors.descriptionError ||
                        errors.keyError
                      : !title ||
                        !description ||
                        !key ||
                        errors.titleError ||
                        errors.descriptionError ||
                        errors.keyError
                  }
                  classes={{
                    root: classes.buttonContainedInfo
                  }}
                >
                  Update
                </Button>
              </Box>
            )}
            <Box
              textAlign="center"
              marginTop="0.6rem"
              marginBottom="1.5rem"
              marginLeft="0.6rem"
              alignSelf="center"
            >
              <Button
                variant="contained"
                onClick={handleClear}
                disabled={!title && !description && !key}
                classes={{
                  root: classes.buttonContainedInfo
                }}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </CardContent>

        <CardContent>
          {isTagged ? (
            checkAccessTags([
              "tag_broadcast_event_read",
              "tag_broadcast_event_read_write"
            ]) ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Sr.No </StyledTableCell>
                      <StyledTableCell>Title </StyledTableCell>
                      <StyledTableCell align="left">
                        Description
                      </StyledTableCell>
                      <StyledTableCell align="left">Key</StyledTableCell>
                      <StyledTableCell align="left">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eventList.map((event, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell scope="row">
                          {index + 1}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          {event.title}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {event.description}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {event.key}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Tooltip title="Toggle status" placement="top" arrow>
                            <Switch
                              color="secondary"
                              checked={event.status === "active" ? true : false}
                              disabled={
                                !checkAccessTags([
                                  "tag_broadcast_event_read_write"
                                ])
                              }
                              onChange={(e) => handleStatusToggle(event)}
                            />
                          </Tooltip>
                          <Tooltip title="Edit event" placement="top" arrow>
                            <IconButton
                              aria-label="access-token"
                              color="primary"
                              title="Edit event"
                              disabled={
                                !checkAccessTags([
                                  "tag_broadcast_event_read_write"
                                ])
                              }
                              onClick={() => handleEditChange(event)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
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
                    <StyledTableCell>Sr.No </StyledTableCell>
                    <StyledTableCell>Title </StyledTableCell>
                    <StyledTableCell align="left">Description</StyledTableCell>
                    <StyledTableCell align="left">Key</StyledTableCell>
                    <StyledTableCell align="left">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventList.map((event, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell scope="row">{index + 1}</StyledTableCell>
                      <StyledTableCell scope="row">
                        {event.title}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {event.description}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {event.key}
                      </StyledTableCell>
                      <StyledTableCell align="left" style={{ display: "flex" }}>
                        <Tooltip title="Toggle status" placement="top" arrow>
                          <Switch
                            color="secondary"
                            checked={event.status === "active" ? true : false}
                            onChange={(e) => handleStatusToggle(event)}
                          />
                        </Tooltip>
                        <Tooltip title="Edit event" placement="top" arrow>
                          <IconButton
                            aria-label="access-token"
                            color="primary"
                            title="Edit event"
                            onClick={() => handleEditChange(event)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Grid>
    </>
  );
};

export default BroadcastEvent;

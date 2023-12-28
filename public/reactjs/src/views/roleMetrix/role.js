import React from "react";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {styled} from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import {
  addRoleWatcher,
  getRoleWatcher,
  updateRoleWatcher
} from "../../actions/roleMetrix";
import {AlertBox} from "../../components/AlertBox";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import AccessMetrixDropDown from "../../components/Dropdowns/AccessMetrixDropdown";
import TablePagination from "@mui/material/TablePagination";
import {checkAccessTags} from "../../util/uam";
import {storedList} from "../../util/localstorage";
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

function CreateRole() {
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [roleList, setRoleList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [buttonTitle, setButtonTitle] = useState("Add");
  const [selectedRow, setSelectedRow] = useState({});
  const [tags, setTags] = useState([]);
  const [count, setCount] = useState(true);
  const [page, setPage] = useState(0);
  const [displayRoleList, setDisplayRoleList] = useState([]);
  const [label, setLabel] = useState("Add role");
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags(["tag_role_matrix_read", "tag_role_matrix_read_write"])
    )
      getRoleList();
    if (!isTagged) getRoleList();
  }, []);

  const getRoleList = () => {
    new Promise((resolve, reject) => {
      dispatch(getRoleWatcher(resolve, reject));
    })
      .then(response => {
        setRoleList(response);
        setDisplayRoleList(response.slice(0, 10));
        setCount(response?.length);
      })
      .catch(error => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response.data.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
    handleClear();
  };

  const handleSubmit = () => {
    let tagsList = [];
    tags?.map(item => {
      tagsList.push(item.label || item);
    });
    const data = {
      title: role,
      tags: tagsList
    };
    if (role.match(/^[a-zA-Z0-9\-_\s]+$/)) {
      if (buttonTitle === "Add") {
        new Promise((resolve, reject) => {
          dispatch(addRoleWatcher(data, resolve, reject));
        })
          .then(response => {
            setAlert(true);
            setSeverity("success");
            setAlertMessage(response.message);
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
            getRoleList();
          })
          .catch(error => {
            setAlert(true);
            setSeverity("error");
            setAlertMessage(error.response.data.message);
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          });
      } else if (buttonTitle === "Update") {
        new Promise((resolve, reject) => {
          data.id = selectedRow._id;
          dispatch(updateRoleWatcher(data, resolve, reject));
        })
          .then(response => {
            setAlert(true);
            setSeverity("success");
            setAlertMessage(response.message);
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
            getRoleList();
            setRole("");
            setLabel("Add role");
          })
          .catch(error => {
            setAlert(true);
            setSeverity("error");
            setAlertMessage(
              error.response?.data?.message || "Failed to update the role"
            );
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          });
      }
    } else {
      setAlert(true);
      setSeverity("error");
      setAlertMessage(
        "Title must be a string with no special characters except underscore(_) or hyphen (-)"
      );
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
  };

  const handleClear = () => {
    setButtonTitle("Add");
    setSelectedRow({});
    setRole("");
    setTags([]);
    setPage(0);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setDisplayRoleList(roleList.slice(newPage * 10, newPage * 10 + 10));
  };

  const handleSetForUpdate = row => {
    setLabel("Edit role");
    setRole(row?.title);
    setTags(row?.tags || []);
    setButtonTitle("Update");
    setSelectedRow(row);
  };
  
  const setTagValues = value =>{
    let flag = true;
    tags?.forEach(tag => {
      value.forEach(val => {
        if (tag === val.label) flag = false;
      });
    });
    if (flag)
      setTags(value)
  }

  return (
    <>
      <Grid item xs={12}>
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}
        <Typography sx={{mt: 2, ml: 2}} variant="h6">
          {label}
        </Typography>
        <CardContent>
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
                  placeholder="Title"
                  value={role}
                  onChange={event => {
                    setRole(event.target.value);
                  }}
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
                <AccessMetrixDropDown
                  onValueChange={value => {setTagValues(value)}}
                  valueData={tags}
                  placeholder={"Select tag names"}
                  id={"access metrix"}
                  helperText={"Please select at least one tag"}
                />
              </FormControl>
            </Grid>
            <Box
              textAlign="center"
              marginTop="0.9rem"
              marginBottom="1.3rem"
              marginLeft="0.6rem"
            >
              <Button
                variant="contained"
                disabled={
                  isTagged
                    ? !checkAccessTags(["tag_role_matrix_read_write"])
                    : false
                }
                onClick={handleSubmit}
              >
                {buttonTitle}
              </Button>
            </Box>
            <Box
              textAlign="center"
              marginTop="0.9rem"
              marginBottom="1.3rem"
              marginLeft="0.6rem"
            >
              <Button
                variant="contained"
                color={"error"}
                disabled={
                  isTagged
                    ? !checkAccessTags(["tag_role_matrix_read_write"])
                    : false
                }
                onClick={handleClear}
              >
                Clear
              </Button>
            </Box>
          </Grid>

          {isTagged ? (
            checkAccessTags([
              "tag_role_matrix_read",
              "tag_role_matrix_read_write"
            ]) ? (
              <TableContainer component={Paper}>
                <Table sx={{minWidth: 700}} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Sr.No</StyledTableCell>
                      <StyledTableCell>Title</StyledTableCell>
                      <StyledTableCell>Tags</StyledTableCell>
                      <StyledTableCell>Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayRoleList &&
                      displayRoleList.map((item, index) => (
                        <StyledTableRow key={item.title}>
                          <StyledTableCell align="left">
                            {index + 1 + page * 10}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {item.title}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {Array(item.tags).toString()}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Tooltip
                              title="Edit access metrix"
                              placement="top"
                              arrow
                            >
                              <IconButton
                                aria-label="Edit access metrix"
                                color="primary"
                                onClick={() => handleSetForUpdate(item)}
                                disabled={
                                  !checkAccessTags([
                                    "tag_role_matrix_read_write"
                                  ])
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
                {count ? (
                  <TablePagination
                    component="div"
                    count={count}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={10}
                    rowsPerPageOptions={[10]}
                  />
                ) : null}
              </TableContainer>
            ) : null
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 700}} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Sr.No</StyledTableCell>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Tags</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayRoleList &&
                    displayRoleList.map((item, index) => (
                      <StyledTableRow key={item.title}>
                        <StyledTableCell align="left">
                          {index + 1 + page * 10}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {item.title}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {Array(item.tags).toString()}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Tooltip
                            title="Edit access metrix"
                            placement="top"
                            arrow
                          >
                            <IconButton
                              aria-label="Edit access metrix"
                              color="primary"
                              onClick={() => handleSetForUpdate(item)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
              {count ? (
                <TablePagination
                  component="div"
                  count={count}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={10}
                  rowsPerPageOptions={[10]}
                />
              ) : null}
            </TableContainer>
          )}
        </CardContent>
      </Grid>
    </>
  );
}

export default CreateRole;

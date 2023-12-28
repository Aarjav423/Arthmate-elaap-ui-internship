import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, styled } from "@material-ui/core/styles";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import componentStyles from "assets/theme/views/auth/register.js";
import componentStylesButtons from "assets/theme/components/button.js";
import { validateData } from "../util/validation";
import {
  createUserWatcher,
  userListWatcher,
  toggleUserStatusWatcher,
  updateUserWatcher,
  resetPassword,
  searchUser
} from "../actions/user";
import { AlertBox } from "../components/AlertBox";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import TablePagination from "@mui/material/TablePagination";
const useStyles = makeStyles(componentStyles);
const useStylesButtons = makeStyles(componentStylesButtons);
import { checkAccessTags } from "../util/uam";
import { storedList } from "../util/localstorage";
import KeyIcon from "@mui/icons-material/Key";
import { PasswordReset } from "./PasswordReset";
import UserPopUp from "./userPopUp";
import TextField from "@mui/material/TextField";
import SearchIcon from '@mui/icons-material/Search';

const {getUser} = require("../apis/user");

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

const defaultErrors = {
  nameError: false,
  emailError: false,
  typeError: false,
  companyError: false,
  userRolesError: false
};

const CreateUser = () => {
  const dispatch = useDispatch();
  const [company, setCompany] = useState("");
  const [coLender, setCoLender] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(defaultErrors);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [userList, setUserList] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [displayUsersList, setDisplayUsersList] = useState([]);
  const [buttonTitle, setButtonTitle] = useState("Submit");
  const [selectedRow, setSelectedRow] = useState({});
  const [rolesList, setRolesList] = useState([]);
  const [label, setLabel] = useState("Users");
  const [read, setRead] = useState(true);
  const [readWrite, setReadWrite] = useState(true);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [isDisableReset, setIsDisableReset] = useState(false);
  const [openNewUser, setOpenNewUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  React.useEffect(() => {
    if (isTagged && checkAccessTags(["tag_user_read", "tag_user_read_write"]))
      fetchUserList();
    if (!isTagged) fetchUserList();
  }, []);

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const fetchUserList = () => {
    const payload = {};
    new Promise((resolve, reject) => {
      dispatch(userListWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setUserList(response);
        setDisplayUsersList(response.slice(0, 10));
        setCount(response.length);
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
    if (field === "userRoles") {
      let flag = false;
      userRoles.forEach((role) => {
        value.forEach((val) => {
          if (role === val.value) flag = true;
        });
      });
      if (flag) return;
    }
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
    if (!validateData("string", name)) {
      setErrors({
        ...defaultErrors,
        nameError: true
      });
      return false;
    }
    if (!validateData("email", email)) {
      setErrors({
        ...defaultErrors,
        emailError: true
      });
      return false;
    }
    if (!type && !type?.value) {
      setErrors({
        ...defaultErrors,
        typeError: true
      });
      return false;
    }
    if (type?.value === "company" && !company?.value) {
      setErrors({
        ...defaultErrors,
        companyError: true
      });
      return false;
    }
    return true;
  };

  const handleClear = () => {
    setCompany(null);
    setName("");
    setEmail("");
    setUserRoles([]);
    setType([]);
    setCoLender("");
    setButtonTitle("Submit");
    setSelectedRow({});
    setErrors([]);
    setLabel("User List");
    setUserSearch("");
  };

  const handleSubmit = () => {
    let userRoleArray = [];
    userRoles.forEach((role) => {
      userRoleArray.push({ title: role.value, id: role.id });
    });
    if (name && email && !type) {
      return showAlert("Please select user type.", "error");
    }
    if ((type.value === "co-lender" || type === "co-lender") && !coLender) {
      return showAlert("Please select co-lender.", "error");
    }
    if ((type.value === "company" || type === "company") && !company) {
      return showAlert("Please select company.", "error");
    }
    if (saving) return;
    if (!validate()) return;
    setSaving(true);
    const payload = {
      username: name,
      email,
      type: type.value,
      company_id: company ? company.value : "",
      co_lender_id: coLender?.co_lender_id || "",
      co_lender_name: coLender.label || "",
      userroles: userRoles.map((role) => role.value),
      role_metrix: userRoleArray
    };

    new Promise((resolve, reject) => {
      if (buttonTitle === "Submit")
        dispatch(createUserWatcher(payload, resolve, reject));
      if (buttonTitle === "Update") {
        const roles = [];
        const roleMetrix = [];
        userRoles.map((item) => {
          roles.push(item.value || item);
          rolesList.map((roleItem) => {
            if ((item.value || item) === roleItem.title)
              roleMetrix.push({
                title: roleItem.title,
                id: roleItem._id
              });
          });
        });

        const updatePayload = {
          id: selectedRow._id,
          username: name,
          email: email,
          type: type?.value || type,
          userroles: roles,
          role_metrix: roleMetrix,
          co_lender_name: coLender.label || "",
          co_lender_id: coLender.value || "",
          company_name: company?.label || "",
          company_id: company?.value || ""
        };
        dispatch(updateUserWatcher(updatePayload, resolve, reject));
      }
    })
      .then((response) => {
        setSaving(false);
        fetchUserList();
        setLabel("Add user");
        handleClear();
        return showAlert(response.message, "success");
      })
      .catch((error) => {
        setSaving(false);
        return showAlert(error.response?.data?.message, "error");
      });
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const toggleUserStatus = (e, id) => {
    const data = {
      id: id,
      status: e.target.checked ? true : false
    };
    new Promise((resolve, reject) => {
      dispatch(toggleUserStatusWatcher(data, resolve, reject));
    })
      .then((response) => {
        fetchUserList();
        return showAlert(response.message, "success");
      })
      .catch((error) => {
        return showAlert(error.response.data.message, "error");
      });
  };

  const handleSetForUpdate = (row) => {
    setSelectedUser(row);
    return setOpenEditUser(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setDisplayUsersList(userList.slice(newPage * 10, newPage * 10 + 10));
  };

  const handleSetForResetPassword = (userData) => {
    const payload = { id: userData._id, type: "admin" };
    setIsDisableReset(true);
    new Promise((resolve, reject) => {
      dispatch(resetPassword(payload, resolve, reject));
    })
      .then((response) => {
        setIsDisableReset(false);
        fetchUserList();
        return showAlert(response.message, "success");
      })
      .catch((error) => {
        setIsDisableReset(false);
        return showAlert(error.response.data.message, "error");
      });
  };

  const handleSearchClick = () => {
    if(userSearch) {
      const payload = { searchstring: userSearch };
      new Promise((resolve, reject) => {
        dispatch(searchUser(payload, resolve, reject));
      })
        .then((response) => {
          if(response.length) {
            setUserList(response);
            setDisplayUsersList(response.slice(0));
            setCount(response.length);
          }
          else{
            fetchUserList();
          }
        })
        .catch((error) => {
          fetchUserList();
          return showAlert(error.message, "error");
        });
    }
    else{
      fetchUserList();
    }
  }

  return (
    <>
      <UserPopUp
        openDialog={openNewUser}
        user={selectedUser}
        action={"new"}
        refreshData={() => {
          fetchUserList();
        }}
        handleClose={() => {
          setOpenNewUser(false);
        }}
      />
      <UserPopUp
        openDialog={openEditUser}
        user={selectedUser}
        action={"edit"}
        refreshData={() => {
          fetchUserList();
        }}
        handleClose={() => {
          setOpenEditUser(false);
        }}
      />
      <PasswordReset
        openPopup={openResetPassword}
        setOpenPopup={setOpenResetPassword}
        userData={selectedUser}
      />
      <Grid item xs={12}>
        <Grid item sx={{ mt: 2, display:"flex", justifyContent:"space-between"}}>
          <Typography sx={{ mt: 2, mb: 1, fontSize: "26px" }} variant="p">
            {label}
          </Typography>
        </Grid>
        <Grid item sx={{ mt: 2, display:"flex", alignItems:"stretch", justifyContent:"space-between"}}>
          <div>
            <TextField id="outlined-basic" label="Search" variant="outlined" 
            value={userSearch}
            onChange={e => {setUserSearch(e.target.value);}}/>
            <IconButton
              color="primary" 
              sx={{
                alignSelf: "centre",
                marginLeft: "9px",
                cursor: "pointer",
                fontSize: "34px"
              }}
              aria-label="access-token"
              variant="contained"
              onClick={() =>{
                handleSearchClick();
              }}
              >
            <SearchIcon sx={{
                  fontSize: "34px"
                }}/>
            </IconButton>
          </div>
          <Button
          sx={{ justifyContent: "flex-end" }}
          variant={"contained"}
          color={"info"}
          disabled={
            isTagged ? !checkAccessTags(["tag_user_read_write"]) : false
          }
          onClick={() => {
            setOpenNewUser(true);
          }}>
            <AddIcon /> Add User
          </Button>
        </Grid>
        {readWrite ? (
          <CardContent>
            {alert ? (
              <AlertBox
                severity={severity}
                msg={alertMessage}
                onClose={handleAlertClose}
              />
            ) : null}
          </CardContent>
        ) : null}

        <CardContent>
          {isTagged ? (
            checkAccessTags(["tag_user_read", "tag_user_read_write"]) ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Sr.no </StyledTableCell>
                      <StyledTableCell>Name-Email </StyledTableCell>
                      <StyledTableCell align="left">Type</StyledTableCell>
                      <StyledTableCell align="left">Role</StyledTableCell>
                      <StyledTableCell align="left">Status</StyledTableCell>
                      <StyledTableCell align="left">Action</StyledTableCell>
                      <StyledTableCell align="left">
                        Reset password
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayUsersList.map((user, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell scope="row">
                          {index + 1 + page * 10}
                        </StyledTableCell>
                        <StyledTableCell scope="row">
                          <Typography>{user.username}</Typography>
                          <Typography>{user.email}</Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {user.type}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {Array(user.userroles).toString()}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Switch
                            color="secondary"
                            checked={!!user.status}
                            disabled={!checkAccessTags(["tag_user_read_write"])}
                            onChange={(e) => toggleUserStatus(e, user._id)}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Tooltip title="Edit user" placement="top" arrow>
                            <IconButton
                              aria-label="Edit user"
                              color="primary"
                              disabled={
                                !checkAccessTags(["tag_user_read_write"])
                              }
                              onClick={() => handleSetForUpdate(user)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Tooltip title="Reset password" placement="top" arrow>
                            <IconButton
                              aria-label="Reset password"
                              color="primary"
                              onClick={() => handleSetForResetPassword(user)}
                              disabled={
                                !checkAccessTags(["tag_user_read_write"]) ||
                                isDisableReset
                              }
                            >
                              <KeyIcon />
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
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Sr.no </StyledTableCell>
                    <StyledTableCell>Name-Email </StyledTableCell>
                    <StyledTableCell align="left">Type</StyledTableCell>
                    <StyledTableCell align="left">Role</StyledTableCell>
                    <StyledTableCell align="left">Status</StyledTableCell>
                    <StyledTableCell align="left">Action</StyledTableCell>
                    <StyledTableCell align="left">
                      Reset password
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayUsersList.map((user, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell scope="row">
                        {index + 1 + page * 10}
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        <Typography>{user.username}</Typography>
                        <Typography>{user.email}</Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {user.type}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {Array(user.userroles).toString()}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Switch
                          color="secondary"
                          checked={!!user.status}
                          onChange={(e) => toggleUserStatus(e, user._id)}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Tooltip title="Edit user" placement="top" arrow>
                          <IconButton
                            aria-label="Edit user"
                            color="primary"
                            onClick={() => handleSetForUpdate(user)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Tooltip title="Reset password" placement="top" arrow>
                          <IconButton
                            aria-label="Reset password"
                            color="primary"
                            onClick={() => handleSetForResetPassword(user)}
                            disabled={isDisableReset}
                          >
                            <KeyIcon />
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
};

export default CreateUser;

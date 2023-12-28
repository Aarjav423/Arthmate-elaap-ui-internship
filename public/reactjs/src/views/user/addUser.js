import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import RolesDropDown from "components/Dropdowns/RolesDropDown";
import UserTypeDropDown from "components/Dropdowns/userTypeDropdown";
import CompanySelect from "components/Company/CompanySelect";
import { validateData } from "../../util/validation";
import { createUserWatcher, updateUserWatcher } from "../../actions/user";
import { AlertBox } from "../../components/AlertBox";
import { CoLendersDropDown } from "../../components/Dropdowns/CoLendersDropdown";
import Typography from "@mui/material/Typography";
import { checkAccessTags } from "../../util/uam";
import { storedList } from "../../util/localstorage";

const user = storedList("user");

const defaultErrors = {
  nameError: false,
  emailError: false,
  typeError: false,
  companyError: false,
  userRolesError: false
};

const AddUser = (props) => {
  const { action, user, cancelProcess, refreshData } = props;
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
  const [rolesList, setRolesList] = useState([]);
  const [label, setLabel] = useState("Add User");

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  useEffect(() => {
    if (user && action === "edit") {
      setName(user.username);
      setEmail(user.email);
      setType({ value: user.type, label: user.type });
      setUserRoles(user.userroles);
      setCoLender({
        co_lender_id: user.co_lender_id,
        label: user.co_lender_name
      });
      setCompany({
        value: user.company_id,
        label: user.company_name
      });
      setErrors({
        ...errors,
        ["name" + "Error"]: !validateData("fullname", user.username)
      });
    }
  }, [user]);

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
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
    cancelProcess();
  };

  const handleSaveUpdate = () => {
    let userRoleArray = [];
    userRoles.forEach((role) => {
      userRoleArray.push({ title: role.value, id: role.id });
    });
    if (!validateData("fullname", name))
      return showAlert("Please enter valid full name", "error");
    if (name && email && !type) {
      return showAlert("Please select user type.", "error");
    }
    if ((type.value === "co-lender" || type === "co-lender") && !coLender) {
      return showAlert("Please select co-lender.", "error");
    }
    if ((type.value === "company" || type === "company") && !company) {
      return showAlert("Please select company.", "error");
    }
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
      if (action === "new")
        dispatch(
          createUserWatcher(
            payload,
            (response) => {
              setSaving(false);
              showAlert(response.message, "success");
              setTimeout(() => {
                refreshData();
                cancelProcess();
              }, 1000);
            },
            (error) => {
              setSaving(false);
              return showAlert(error.response?.data?.message, "error");
            }
          )
        );
      if (action === "edit") {
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
          id: user._id,
          username: name,
          email: email,
          type: type?.value || type,
          userroles: roles,
          role_metrix: roleMetrix,
          co_lender_name: coLender.label || "",
          co_lender_id: coLender?.co_lender_id || "",
          company_name: company?.label || "",
          company_id: company?.value || ""
        };
        dispatch(
          updateUserWatcher(
            updatePayload,
            (response) => {
              setSaving(false);
              showAlert(response.message, "success");
              setTimeout(() => {
                refreshData();
                cancelProcess();
              }, 1000);
            },
            (error) => {
              setSaving(false);
              return showAlert(error.response?.data?.message, "error");
            }
          )
        );
      }
    });
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleSetForUpdate = () => {
    setLabel("Edit user");
    setName(user.username);
    setEmail(user.email);

    setType(user.type);
    if (user.type === "company") {
      setCompany({
        label: user.company_name,
        value: user.company_id
      });
    } else if (user.type === "co-lender") {
      setCoLender({
        label: user.co_lender_name,
        value: user.co_lender_id
      });
    }
    setUserRoles(user.userroles);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setDisplayUsersList(userList.slice(newPage * 10, newPage * 10 + 10));
  };
  return (
    <>
      <Grid item xs={12}>
        <CardContent>
          <Typography sx={{ mt: 2, mb: 3 }} variant="h6">
            {action === "new" ? "Add User" : "Edit User"}
          </Typography>
          {alert ? (
            <AlertBox
              severity={severity}
              msg={alertMessage}
              onClose={handleAlertClose}
            />
          ) : null}

          <Grid container spacing={1} xs={12}>
            <Grid item xs={12}>
              <FormControl
                variant="filled"
                component={Box}
                width="100%"
                marginBottom="1.5rem!important"
              >
                <TextField
                  id="outlined-basic"
                  label="Full name"
                  variant="outlined"
                  type="text"
                  placeholder="Full name"
                  value={name ?? ""}
                  error={errors.nameError}
                  helperText={errors.nameError ? "Enter valid name" : ""}
                  onChange={handleInputChange("name", "fullname", setName)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant="filled"
                component={Box}
                width="100%"
                marginBottom="1.5rem!important"
              >
                <TextField
                  id="outlined-basic"
                  label="Email ID"
                  variant="outlined"
                  type="text"
                  placeholder="Email ID"
                  value={email}
                  disabled={action === "edit" ? true : false}
                  error={errors.emailError}
                  helperText={
                    errors.emailError ? "Enter valid email address" : ""
                  }
                  onChange={handleInputChange("email", "email", setEmail)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant="filled"
                component={Box}
                width="100%"
                marginBottom="1.5rem!important"
              >
                <UserTypeDropDown
                  id="select-type-comp"
                  placeholder="Select type of user"
                  valueData={type}
                  onValueChange={(value) => {
                    if (value?.value === "admin") setCompany(null);
                    handleSelectChange("type", value, setType, false);
                  }}
                  disabled={action === "edit" ? true : false}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant="filled"
                component={Box}
                width="100%"
                marginBottom="1.5rem!important"
              >
                <RolesDropDown
                  id="select-role"
                  placeholder="Select role"
                  valueData={userRoles}
                  error={errors.userRolesError}
                  helperText={
                    errors.userRolesError ? "At least 1 role is required" : ""
                  }
                  setRolesList={setRolesList}
                  onValueChange={(value) => {
                    handleSelectChange(
                      "userRoles",
                      value.value || value,
                      setUserRoles,
                      true
                    );
                  }}
                />
              </FormControl>
            </Grid>
            {type.value === "" || type.value === "company" ? (
              <Grid item xs={12}>
                <FormControl
                  variant="filled"
                  component={Box}
                  width="100%"
                  marginBottom="1.5rem!important"
                >
                  <CompanySelect
                    placeholder="Select Company"
                    company={company ?? null}
                    isDisabled={action === "edit" ? true : false}
                    onCompanyChange={(value) => {
                      setCoLender("");
                      if (value?.value === "admin") setCompany(null);
                      handleSelectChange("company", value, setCompany, false);
                    }}
                    error={errors.typeError}
                    helperText={errors.typeError ? "company is required" : ""}
                  />
                </FormControl>
              </Grid>
            ) : null}

            {type.value === "co-lender" || type === "co-lender" ? (
              <Grid item xs={12}>
                <FormControl
                  variant="filled"
                  component={Box}
                  width="100%"
                  marginBottom="1.5rem!important"
                >
                  <CoLendersDropDown
                    placeholder={"Select co-lender"}
                    value={coLender}
                    id={"co-lender"}
                    onValueChange={(value) => {
                      setCompany("");
                      handleSelectChange("coLender", value, setCoLender, false);
                    }}
                    disabled={action === "edit" ? true : false}
                  />
                </FormControl>
              </Grid>
            ) : null}
            <Box
              textAlign="center"
              marginTop="0.9rem"
              marginBottom="1.3rem"
              marginLeft="0.6rem"
            >
              <Button
                variant="contained"
                disabled={
                  saving ||
                  (isTagged ? !checkAccessTags(["tag_user_read_write"]) : false)
                }
                onClick={handleSaveUpdate}
              >
                {action === "new" ? "Save" : "Update"}
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
                  saving ||
                  (isTagged ? !checkAccessTags(["tag_user_read_write"]) : false)
                }
                onClick={handleClear}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </CardContent>
      </Grid>
    </>
  );
};

export default AddUser;

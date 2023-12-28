import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addFosUserWatcher } from "../../../../../actions/collection/user.action";
import { storedList } from "../../../../../util/localstorage";
import useDimensions from "../../../../../hooks/useDimensions";

import "./addUser.view.css";
import UserForm from "../form/form.view";
import {FOS_USER_FORM_FIELDS}  from "../formFields.userForm"
import { setObjectKeysToDefault } from "util/helper";

const formUserDefault= setObjectKeysToDefault(FOS_USER_FORM_FIELDS); 

const user = storedList("user");

export default function AddUser(props) {
  const { innerWidth, innerHeight } = useDimensions();
  const dispatch = useDispatch();
  const styles = useStyles({ innerWidth, innerHeight });
  const [formUser,setFormUser] = useState(formUserDefault);


  const onSubmit = (payload) => {
    return new Promise((resolve, reject) => {
      dispatch(addFosUserWatcher(payload, resolve, reject));
    });
  };

  return (
    <React.Fragment>
      <UserForm {...props} onSubmit={onSubmit} formUser={formUser} submitButtonText="Create" />
    </React.Fragment>
  );
}

const useStyles = ({ innerWidth, innerHeight }) => {
  return {};
};

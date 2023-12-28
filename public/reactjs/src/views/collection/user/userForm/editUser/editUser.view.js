import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addFosUserWatcher,
  getFosUserWatcher,
  updateFosUserWatcher,
} from "../../../../../actions/collection/user.action";
import { storedList } from "../../../../../util/localstorage";
import useDimensions from "../../../../../hooks/useDimensions";

import "./editUser.view.css";
import UserForm from "../form/form.view";
import { FOS_USER_FORM_FIELDS } from "../formFields.userForm";
import { setObjectKeysToDefault } from "util/helper";

const formUserDefault = setObjectKeysToDefault(FOS_USER_FORM_FIELDS);

const user = storedList("user");

export default function EditUser(props) {
  const { innerWidth, innerHeight } = useDimensions();
  const dispatch = useDispatch();
  const styles = useStyles({ innerWidth, innerHeight });
  const [formUser, setFormUser] = useState(formUserDefault);

  React.useEffect(() => {
    fetchUserById(props.selectedUser);
  }, [props.selectedUser]);

  const fetchUserById = (selectedUser) => {
    new Promise((resolve, reject) => {
      dispatch(getFosUserWatcher(selectedUser._id, resolve, reject));
    })
      .then((response) => {
        let userData = response.data;

        userData = {
          ...userData,
          ...userData.details,
        };
        delete userData["details"];

        setFormUser(userData);
      })
      .catch((error) => {});
  };

  const onSubmit = (payload) => {
    return new Promise((resolve, reject) => {
      dispatch(
        updateFosUserWatcher(
          { ...payload, userId: props.selectedUser._id },
          resolve,
          reject
        )
      );
    });
  };

  return (
    <React.Fragment>
      <UserForm
        {...props}
        onSubmit={onSubmit}
        formUser={formUser}
        submitButtonText="Update & Save"
        type="edit"
      />
    </React.Fragment>
  );
}

const useStyles = ({ innerWidth, innerHeight }) => {
  return {};
};

import * as React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import CustomDropdown from "../custom/customSelect";
import { storedList } from "../../util/localstorage";
import { useEffect, useState } from "react";

const ServiceStatusSelect = ({ onStatusChange, placeholder, requestType }) => {
  const [status, setStatus] = useState([]);
  const [statuses, setStatuses] = useState({
    forclousure_request: [
      { label: "Pending", value: "pending" },
      { label: "Approved", value: "approved" },
      { label: "Rejected", value: "rejected" },
      { label: "Invalid", value: "invalid" },
      { label: "Completed", value: "completed" },
    ],
    waiver_request: [
      { label: "Pending Approval", value: "pending" },
      { label: "Approved", value: "approved" },
      { label: "Rejected", value: "rejected" },
    ],
    default: [{ label: "None", value: "" }],
  });
  const [disabled, setDisabled] = React.useState(false);
  const dispatch = useDispatch();
  const user = storedList("user");

  const changeValue = (item) => {
    setStatus(item || { label: "", value: "" });
  };

  useEffect(() => {
    onStatusChange(status);
  }, [status]);

  return (
    <CustomDropdown
      placeholder={placeholder}
      data={statuses[requestType || "default"]}
      value={status}
      id="status"
      handleDropdownChange={changeValue}
      disabled={disabled}
    />
  );
};

ServiceStatusSelect.propTypes = {
  children: PropTypes.node,
};

ServiceStatusSelect.defaultProps = {
  children: "",
};

export default ServiceStatusSelect;

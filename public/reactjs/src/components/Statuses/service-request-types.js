import * as React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import CustomDropdown from "../custom/customSelect";
import { storedList } from "../../util/localstorage";
import { useEffect, useState } from "react";

const ServiceRequestTypeSelect = ({
  onRequestTypeChange,
  placeholder,
  accessTags
}) => {
  const [status, setStatus] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const user = storedList("user");

  const changeValue = (item) => {
    setStatus(item || { label: "", value: "" });
  };

  useEffect(() => {
    onRequestTypeChange(status);
  }, [status]);

  useEffect(() => {
    const statusesTagsBased = JSON.parse(JSON.stringify(statuses));
    if (
      accessTags.indexOf("tag_service_request_foreclosure_read") > -1 ||
      accessTags.indexOf("tag_service_request_foreclosure_read_write") > -1
    )
      statusesTagsBased.push({
        label: "Foreclosure",
        value: "forclousure_request"
      });

    if (
      accessTags.indexOf("tag_service_request_waiver_read") > -1 ||
      accessTags.indexOf("tag_service_request_waiver_read_write") > -1
    )
      statusesTagsBased.push({ label: "Waiver", value: "waiver_request" });
    setStatuses(statusesTagsBased);
  }, []);

  return (
    <CustomDropdown
      placeholder={placeholder}
      data={statuses}
      value={status}
      id="service_type"
      handleDropdownChange={changeValue}
      disabled={disabled}
    />
  );
};

ServiceRequestTypeSelect.propTypes = {
  children: PropTypes.node
};

ServiceRequestTypeSelect.defaultProps = {
  children: ""
};

export default ServiceRequestTypeSelect;

import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { getAllServicesWatcher } from "../../actions/services";
import CustomDropdown from "../custom/customSelect";

const ServicesDropDown = (props) => {
  const {
    onValueChange,
    placeholder,
    valueData,
    id,
    helperText,
    ...other
  } = props;
  const [service, setService] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getAllServicesWatcher(
        (result) => {
          setService(
            result.data.map((item) => {
              return {
                value: item.service_name,
                label: item.service_name,
                id: item._id,
              };
            })
          );
        },
        (error) => {}
      )
    );
  }, []);

  return (
    <CustomDropdown
      placeholder={placeholder}
      data={service}
      value={valueData}
      id={id}
      handleDropdownChange={onValueChange}
      helperText={helperText}
    />
  );
};

ServicesDropDown.propTypes = {
  children: PropTypes.node,
};

ServicesDropDown.defaultProps = {
  children: "",
};

export default ServicesDropDown;

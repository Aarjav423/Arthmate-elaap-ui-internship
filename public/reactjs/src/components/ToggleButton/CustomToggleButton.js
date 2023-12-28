import * as React from "react";
import PropTypes from "prop-types";
import ToggleButton from "@mui/material/ToggleButton";

export default function CustomToggleButton(props) {
  const { children, selected, onToggleChange } = props;

  return (
    <ToggleButton value="check" selected={selected} onChange={onToggleChange}>
      {children}
    </ToggleButton>
  );
}

CustomToggleButton.propTypes = {
  children: PropTypes.node,
  selected: PropTypes.number.isRequired,
  onToggleChange: PropTypes.number.isRequired,
};

CustomToggleButton.defaultProps = {
  children: "",
};

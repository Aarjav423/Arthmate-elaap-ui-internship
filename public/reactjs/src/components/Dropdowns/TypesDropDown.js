import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import CustomDropdown from "../custom/customSelect";


export default function TypesDropdown(props) {
  const { onValueChange, placeholder, valueData, id, helperText,disabled,typesList,colors } = props;
  const [types, setTypes] = useState([]);

  const colorsComp= (color)=>{
    return (
      <h3>color</h3>
    )
  }

  useEffect(() => {

    setTypes(
      typesList.map((item,index) => {
        return {
          value: index,
          label: item,
          color: colors[index]
        };
    }));

  }, [typesList]);


  return (
    <CustomDropdown
      placeholder={placeholder}
      data={types}
      value={valueData}
      id={id}
      helperText={helperText}
      handleDropdownChange={onValueChange}
      disabled={disabled?disabled:false}
      colors={colors}
    />
  );
}

TypesDropdown.propTypes = {
  children: PropTypes.node,
};

TypesDropdown.defaultProps = {
  children: "",
};

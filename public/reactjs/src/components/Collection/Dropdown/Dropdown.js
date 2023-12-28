import React, { useState, useEffect } from "react";
import dropdownArrow from "assets/collection/images/dropdownArrow.svg";
import dropdownDisable from "assets/collection/images/dropdowndisabled.svg";
import "./Dropdown.css";

const defaultCustomCss = {
  width: "260px",
  height: "48px",
};

const Dropdown = ({
  id,
  dropdownList,
  isActive,
  setIsActive,
  value,
  setValue,
  placeholder,
  disabled,
  myStyle = {},
}) => {
  const [selected, setSelected] = useState({
    label: "",
    value: "",
  });

  useEffect(() => {
    if (value) {
      var temp = dropdownList.find((item) => item.value == value);
      if (temp) {
        onSelect(temp);
      }
    }
  }, [value]);

  const onDropdownSelect = (item) => {
    setValue(item.value);
  };

  const onSelect = (item) => {
    setSelected(item);
    setIsActive(false);
  };

  const dropdownContentStyle = {
    height: `${Math.min(dropdownList.length * 40, 200)}px`,
  };




  return (
    <div className="dropdown_select_dropdown">
      <div style={{ ...defaultCustomCss, ...myStyle }}>
        <div
          className={isActive ? "dropdow_disable" : "dropdown_button"}
          onClick={() => {
            if (disabled) {
              setIsActive(false);
            } else {
              setIsActive(!isActive);
            }
          }}
        >
          {!value ? placeholder : <span> {selected?.label}</span>}
          {<img src={isActive ? dropdownArrow : dropdownDisable} />}
        </div >

        {isActive && (
          <ul className="DropDown_Ul">
            {dropdownList.map((item, index) => (
              <li key={index} onClick={() => onDropdownSelect(item)}>
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div >
    </div >
  );
};

export default Dropdown;

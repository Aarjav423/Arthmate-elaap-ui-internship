import React, { useEffect, useState } from "react";
import "./autoComplete.css";
import dropdownArrow from "assets/collection/images/dropdownArrow.svg";
import clearFilter_img from "assets/collection/images/clearFilter_img.svg";
import dropdownDisable from "assets/collection/images/dropdowndisabled.svg";
import dropDownImg from "assets/collection/images/dropdown_img.svg";
import dropdownUpImg from "assets/collection/images/dropdown_up_img.svg";

const Autocomplete = ({
  placeholder,
  value,
  setValue,
  options,
  onOptionSelect,
  autoCompleteCustomStyle,
  type,
  customStyleParent = {
    border: '1px solid grey',
    borderRadius: '35px',
    paddingLeft: '20px',
    height: '48px',
  },
  customStyleContainer = {
    display: "flex",
    justify:"flex-end"
  },
  customStyleDropDownIcon = {
    padding: "18px", marginLeft: '70px' 
  },
  customStyleInput = {
    width: '300px'
  },
  customStyleDropDown = {
    width: '300px'
  }

}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showSuggestions) {
        const suggestions = document.querySelector(".suggestions");
        if (suggestions && !suggestions.contains(e.target)) {
          setShowSuggestions(false);
        }
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [showSuggestions]);

  const handleInputChange = (e) => {
    setValue(e.target.value);
    setShowSuggestions(true);
  };

  const setDefault=()=>{
    onOptionSelect('');
    setValue('');
    setShowSuggestions(false);
  }

  const handleSuggestionClick = (item) => {
    onOptionSelect(item.value);
    setValue(item.label);
    setShowSuggestions(false);
  };

  return (
    <div style={customStyleParent} >
      <div style={customStyleContainer}>
        <input
          id="autoCompleteInput"
          type="text"
          value={value}
          onChange={handleInputChange}
          onClick={()=>setShowSuggestions(!showSuggestions)}
          placeholder={placeholder}
          autoComplete="off"
          style={customStyleInput}
        />
        {type == "cross" ? (
          <img
            style={customStyleDropDownIcon}
            src={clearFilter_img}
            onClick={() => setDefault()}
          />) : <div onClick={() => setShowSuggestions(!showSuggestions)}>
            {value && <img
              style={{marginTop:"5px", cursor:"pointer"}}
              src={clearFilter_img}
              onClick={() => setDefault()}
            />}
            <img src={showSuggestions ? dropdownUpImg : dropDownImg} style={{marginRight:"10px",marginTop:"5px",cursor:"pointer"}} alt="dropdown"/>
            </div>}
      </div>

      {showSuggestions && options && options.length>0 && (
        <ul className="suggestions" style={customStyleDropDown}>
          {options?.map((item, index) => (
            <li key={index} onClick={() => handleSuggestionClick(item)}>
              {item?.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;

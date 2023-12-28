import * as React from "react";
import { useDispatch } from "react-redux";
import { storedList } from "../../util/localstorage";
import { useEffect, useState } from "react";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";

const LabelDropdown = ({ onLabelChange, placeholder, nameField, isLoc }) => {
  const [label, setLabel] = useState([]);
  const [labels, setLabels] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const user = storedList("user");

  const changeValue = item => {
    setLabel(item);
  };

  useEffect(() => {
    let dataObject = isLoc
      ? [
          { label: "Repayment", value: "repayment" },
          { label: "Processing Fee", value: "pf" },
          //{ label: "Partpayment", value: "partpayment" },
          { label: "FLDG", value: "fldg" }
        ]
      : [
          { label: "Repayment", value: "repayment" },
          { label: "Foreclosure", value: "foreclosure" },
          { label: "Advance EMI", value: "Advance EMI" },
          //{ label: "Partpayment", value: "partpayment" },
          { label: "FLDG", value: "fldg" }
        ];
    setLabels(dataObject);
  }, []);

  useEffect(() => {
    onLabelChange(label, nameField);
  }, [label]);

  const inputBoxCss={
    marginTop:"0px",
    marginLeft:"2px",
    maxHeight:"500px",
    zIndex:1,
    padding:"0px 16px"
  }

  return (
    <InputBox
    label={placeholder}
    isDrawdown={true}
    options={labels}
    onClick={item => {
      changeValue(item);
    }}
    isDisabled={disabled}
    customClass={{height:"56px",width:"335px",maxWidth:"none"}}
    customDropdownClass={inputBoxCss}
    />
  );
};

export default LabelDropdown;

import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { getLoanTemplateNamesWatcher } from "../../actions/loanType";
import CustomDropdown from "../custom/customSelect";

export default function LoanTemplatesDropdown(props) {
  const { onValueChange, placeholder, valueData, id, helperText, newLoanTemplate } = props;
  const [loanTemplates, setLoanTemplates] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getLoanTemplateNamesWatcher(
        (result) => {
          setLoanTemplates(
            result.map((item) => {
              return {
                value: item.name,
                label: item.name,
              };
            })
          );
        },
        (error) => {
          return error;
        }
      )
    );
  }, [newLoanTemplate]);

  return (
    <CustomDropdown
      placeholder={placeholder}
      data={loanTemplates}
      value={valueData}
      id={id}
      multiple={true}
      helperText={helperText}
      handleDropdownChange={onValueChange}
    />
  );
}

LoanTemplatesDropdown.propTypes = {
  children: PropTypes.node,
};

LoanTemplatesDropdown.defaultProps = {
  children: "",
};

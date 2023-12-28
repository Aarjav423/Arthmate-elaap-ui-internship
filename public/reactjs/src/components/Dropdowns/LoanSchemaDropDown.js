import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { getLoanSchemaByCompanIdWatcher } from "../../actions/loanSchema";
import CustomDropdown from "../custom/customSelect";

const LoanSchemaDropDown = (props) => {
  const {
    onValueChange,
    placeholder,
    valueData,
    id,
    helperText,
    company_id,
    isDisabled,
    ...other
  } = props;
  const [loanSchema, setLoanSchema] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getLoanSchemaByCompanIdWatcher(
        { company_id },
        (result) => {
          setLoanSchema(
            result.map((item) => {
              return {
                value: item._id,
                label: item.name,
              };
            })
          );
        },
        (error) => {
        }
      )
    );
  }, [company_id]);

  return (
    <CustomDropdown
      placeholder={placeholder}
      data={loanSchema}
      value={valueData}
      id={id}
      multiple={false}
      handleDropdownChange={onValueChange}
      helperText={helperText}
      disabled = {isDisabled}
    />
  );
};

LoanSchemaDropDown.propTypes = {
  children: PropTypes.node,
};

LoanSchemaDropDown.defaultProps = {
  children: "",
};

export default LoanSchemaDropDown;

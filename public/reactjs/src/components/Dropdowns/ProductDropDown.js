import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { getDesignationWatcher } from "actions/roleMetrix";
import CustomDropdown from "../custom/customSelect";
import { getSubscriptionEventByCompanyIdApiEffectSaga } from "sagas/pubsub";
import { getCompanyProducts } from "apis/partnerAnalytics";

export default function ProductDropdown(props) {
  const {
    companyId,
    onValueChange,
    placeholder,
    valueData,
    id,
    helperText,
    disabled
  } = props;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (companyId) {
      getCompanyProducts(companyId).then(response => {
        let res = response.data;
        setProducts(
          res["data"].map(item => {
            return {
              value: item._id,
              label: item.name
            };
          })
        );
      });
    }
  }, [companyId]);

  return (
    <CustomDropdown
      placeholder={placeholder}
      data={products}
      value={valueData}
      id={id}
      helperText={helperText}
      handleDropdownChange={onValueChange}
      disabled={disabled ? disabled : false}
    />
  );
}

ProductDropdown.propTypes = {
  children: PropTypes.node
};

ProductDropdown.defaultProps = {
  children: ""
};

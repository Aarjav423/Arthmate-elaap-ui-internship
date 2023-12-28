import * as React from "react";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getAllProductByCompanyIDWatcher,
  getAllProductByLocCompanyIDWatcher
} from "../../actions/product";
import CustomDropdown from "../custom/customSelect";
import { storedList } from "../../util/localstorage";

const ProductSelect = ({
  onProductChange,
  placeholder,
  company,
  product,
  reportName,
  isDisabled,
  isLoc,
  pageName
}) => {
  const [products, setProducts] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const dispatch = useDispatch();
  const user = storedList("user");

  const handleSetProdcuts = (result, isCompanyUser) => {
    let productsArray = result?.filter(item => item.status === 1);

    if (isCompanyUser) {
      productsArray = productsArray?.filter(
        item => item?.company_id === user?.company_id
      );
    }
    const finalProductsArray = productsArray.map(item => {
      return {
        value: item._id,
        label: `${item.name}`,
        loan_schema_id: `${item.loan_schema_id}`,
        repayment_type: `${item.repayment_schedule}`,
        isLoc: item.allow_loc,
        forceUsageConvertToEmi: item?.force_usage_convert_to_emi,
        bounceCharges: item?.bounce_charges ? item?.bounce_charges : 0,
        insurance_charges: `${item?.insurance_charges}`,
        a_score: item.a_score,
        recon_type: `${item?.recon_type}`
      };
    });

    if (
      reportName === "Disbursement_transactions_report" ||
      reportName === "Insurance_report" ||
      reportName === "Repayment_report" ||
      reportName === "Bureau_report" ||
      reportName === "Disbursement_failure_transactions_report"
    ) {
      productsArray.unshift({
        value: "00",
        label: `All Products`
      });
    }
    setProducts(finalProductsArray);
  };

  useEffect(() => {
    if (products.length) {
      setSelectedProduct(products[0]);
    }
    if (!products.length)
      setSelectedProduct({
        value: "",
        label: ""
      });
  }, [products]);

  useEffect(() => {
    onProductChange(selectedProduct);
  }, [selectedProduct]);

  const handleSelectedProduct = item => {
    setSelectedProduct(item);
  };

  useEffect(() => {
    if (company) {
      if (company.label == "All Partner") {
        setProducts([
          {
            value: 0,
            label: `All Products`
          }
        ]);
      } else {
        setProducts([]);
        if (isLoc) {
          dispatch(
            getAllProductByLocCompanyIDWatcher(
              company.value,
              result => {
                let finalProducts = result;
                if (pageName === "loanQueue" || pageName === "loanQueue")
                  finalProducts = result.filter(item => item?.allow_loc === 1);
                handleSetProdcuts(finalProducts, user.type === "company");
              },
              error => {}
            )
          );
        } else {
          dispatch(
            getAllProductByCompanyIDWatcher(
              company.value,
              result => {
                let finalProducts = result;
                if (pageName === "loanQueue" || pageName === "loanQueue")
                  finalProducts = result.filter(item => item?.allow_loc !== 1);
                handleSetProdcuts(finalProducts, user.type === "company");
              },
              error => {}
            )
          );
        }
      }
    } else {
      setSelectedProduct({
        value: "",
        label: ""
      });
      setProducts([]);
    }
  }, [company]);

  return (
    <CustomDropdown
      placeholder={placeholder}
      data={products}
      value={selectedProduct}
      id="product"
      handleDropdownChange={handleSelectedProduct}
      disabled={disabled || isDisabled}
    />
  );
};

ProductSelect.propTypes = {
  children: PropTypes.node
};

ProductSelect.defaultProps = {
  children: ""
};

export default ProductSelect;

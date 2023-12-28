import * as React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  getAllCompaniesWatcher,
  getAllLocCompaniesWatcher
} from "../../actions/company";
import CustomDropdown from "../custom/customSelect";
import { storedList } from "../../util/localstorage";

const CompanySelect = ({
  reportName,
  onCompanyChange,
  placeholder,
  company,
  width,
  isDisabled,
  isLoc = false
}) => {
  const [companies, setCompanies] = React.useState([]);
  const [disabled, setDisabled] = React.useState(false);
  const dispatch = useDispatch();
  const user = storedList("user");

  const handleSetDataForCompanyUser = result => {
    const userCompany = result?.find(
      company => company?._id === user?.company_id
    );

    setCompanies([
      {
        value: userCompany?._id,
        label: userCompany?.short_code
          ? `${userCompany?.short_code} - ${userCompany.name}`
          : userCompany.name,
        code: `${userCompany?.code}`
      }
    ]);

    onCompanyChange({
      value: userCompany?._id,
      label: userCompany?.short_code
        ? `${userCompany?.short_code} - ${userCompany.name}`
        : userCompany.name,
      code: `${userCompany?.code}`,
      lms_version: `${userCompany?.lms_version}`
    });
    setDisabled(true);
  };

  const handleSetCompanyData = result => {
    const companiesData = result?.map(item => {
      return {
        value: item._id,
        label: item?.short_code
          ? `${item?.short_code} - ${item.name}`
          : item.name,
        code: `${item.code}`,
        lms_version: `${item.lms_version}`
      };
    });

    if (
      reportName === "Disbursement_transactions_report" ||
      reportName === "Insurance_report" ||
      reportName === "Repayment_report" ||
      reportName === "Bureau_report" ||
      reportName === "Disbursement_inprogress_Report"
    ) {
      companiesData.unshift({
        value: "00",
        label: "All Partner",
        code: "ALLPARTNER00",
        lms_version: "undefined"
      });
    }

    return setCompanies(companiesData);
  };

  React.useEffect(() => {
    if (isLoc) {
      dispatch(
        getAllLocCompaniesWatcher(
          result => {
            if (user.type === "company") {
              handleSetDataForCompanyUser(result);
            }
            if (user.type !== "company") {
              handleSetCompanyData(result);
            }
          },
          error => {}
        )
      );
    } else {
      dispatch(
        getAllCompaniesWatcher(
          result => {
            if (user.type === "company") {
              handleSetDataForCompanyUser(result);
            }
            if (user.type !== "company") {
              handleSetCompanyData(result);
            }
          },
          error => {}
        )
      );
    }
  }, []);

  return (
    <CustomDropdown
      placeholder={placeholder}
      data={companies}
      value={company}
      id={"companies"}
      handleDropdownChange={onCompanyChange}
      disabled={disabled || isDisabled}
      width={width}
    />
  );
};

CompanySelect.propTypes = {
  children: PropTypes.node
};

CompanySelect.defaultProps = {
  children: ""
};

export default CompanySelect;

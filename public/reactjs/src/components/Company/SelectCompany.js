import * as React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  getAllCompaniesWatcher,
  getAllLocCompaniesWatcher
} from "../../actions/company";
import CustomDropdown from "../custom/customSelect";
import { storedList } from "../../util/localstorage";
import InputBox from "react-sdk/dist/components/InputBox/InputBox"
import { getMsmeCompaniesWatcher } from "../../msme/actions/msme.action";

const CompanySelect = ({
  reportName,
  onCompanyChange,
  placeholder,
  company,
  width,
  isDisabled,
  isLoc = false,
  isLocation = false,
  customStyle,
  height,
  maxWidth,
  error,
  helperText,
  isMsme
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
      reportName === "Disbursement_inprogress_Report" ||
      reportName === "LOC_due_report"
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
    }
    else if(isMsme) {
      dispatch(
        getMsmeCompaniesWatcher(
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
    else {
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

  
  const customCss= {height:"58px" , width:"15vw" , pointerEvents : user?.type && user.type === "company"  ? "none" : "auto" }

  return (
    <InputBox
      id={"companies"}
      isDrawdown={true}
      initialValue={company?.label ? company.label : ""}
      placeholder="Company"
      label={placeholder ? placeholder :"Company"}
      options={companies}
      error={error}
      helperText={helperText}
      onClick={onCompanyChange}
      isDisabled={disabled || isDisabled}
      customClass={height || width ? {height:height, width:width ,maxWidth:maxWidth ,pointerEvents : user?.type && user.type === "company"  ? "none" : "auto"} : customCss}
      customDropdownClass={customStyle ? customStyle :{marginTop:"8px", zIndex:"1" , width:"15vw"}}
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

import React, { useState } from "react";
// import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { downloadDataInXLSXFormat } from "../../util/helper";
import { CSVLink } from "react-csv";
import GridOnIcon from "@mui/icons-material/GridOn";
import { getBorrowerDetailsWatcher } from "../../actions/borrowerInfo";
import { useDispatch } from "react-redux";
import Button from "react-sdk/dist/components/Button/Button";
import Img from "./images/download-button.svg"
import imgH from "./images/download-button-hover.svg";

const DownloadLoanFiles = ({
  loanData,
  company,
  product,
  handleAleart,
  disabled,
  filter,
  searchData,
  fromDate,
  toDate,
  isCollateral = false
}) => {
  const dispatch = useDispatch();

  const getDownloadData = (flag) => {
    dispatch(
      getBorrowerDetailsWatcher(
        {
          ...filter,
          searchData: searchData,
          isExport: true
        },
        (result) => {
          if (flag === 1) generatePdfFile(result?.rows ? result?.rows : result);
          if (flag === 2)
            generateXLSXFile(result?.rows ? result?.rows : result, "xlsx");
          if (flag === 3)
            generateXLSXFile(result?.rows ? result?.rows : result, "csv");
        },
        (error) => {
          return handleAleart(null, error?.response?.data?.message, "error");
        }
      )
    );
  };

  const generatePdfFile = (data) => {
    const doc = new jsPDF();
    const columns = [
      { title: "Loan App Id", field: "loan_app_id" },
      { title: "Borrower Id", field: "borrower_id" },
      { title: "Partner name", field: "partner_name" },
      { title: "Product Name", field: "product_name" },
      { title: "Customer Name", field: "customer_name" },
      { title: "Loan Amount", field: "sanction_amount" },
      { title: "App Date", field: "created_at" },
      { title: "Status", field: "status" }
    ];

    autoTable(doc, { html: "#my-table" });

    doc.autoTable({
      theme: "grid",
      body: data?.map((record) => {
        return {
          ...record,
          created_at: moment(record.created_at).format("YYYY-MM-DD"),
          partner_name: company.label ? company.label : company.name,
          product_name: product.label ? product.label : product.name,
          customer_name: `${record?.first_name ?? ""} ${
            record?.last_name ?? ""
          }`
        };
      }),
      columns: columns.map((col) => ({ ...col, dataKey: col?.field }))
    });
    let fileName = `LoanFile_${company.label}${product.label}${
      moment(fromDate).format("DD_MMM_YYYY") !== "Invalid date"
        ? moment(fromDate).format("DD_MMM_YYYY")
        : "NA"
    }_${
      moment(toDate).format("DD_MMM_YYYY") !== "Invalid date"
        ? moment(toDate).format("DD_MMM_YYYY")
        : "NA"
    }.pdf`;
    doc.save(fileName);
    setTimeout(() => {
      handleAleart(null, "File Downloaded Successfully", "success");
    }, 2000);
  };

  const generateCollateralPdfFile = () => {
    const doc = new jsPDF();
    const columns = [
      { title: "Loan id", field: "loan_id" },
      { title: "Company Id", field: "company_id" },
      { title: "Product Id", field: "product_id" },
      { title: "Chassis number", field: "chassis_number" },
      { title: "Engine number", field: "engine_number" },
      { title: "Insurance p name", field: "insurance_partner_name" },
      { title: "Invoice amount", field: "invoice_amount" },
      { title: "Invoice date", field: "invoice_date" },
      { title: "Invoice number", field: "invoice_number" },
      { title: "Policy exp date", field: "policy_expiry_date" },
      { title: "Policy iss date", field: "policy_issuance_date" },
      { title: "Policy number", field: "policy_number" },
      { title: "Vehicle reg number", field: "vehicle_registration_number" }
    ];

    autoTable(doc, { html: "#my-table" });

    doc.autoTable({
      theme: "grid",
      body: loanData?.map((record) => {
        return {
          ...record,
          invoice_date: moment(record.invoice_date).format("YYYY-MM-DD"),
          policy_expiry_date: moment(record.policy_expiry_date).format(
            "YYYY-MM-DD"
          ),
          policy_issuance_date: moment(record.policy_issuance_date).format(
            "YYYY-MM-DD"
          )
        };
      }),
      columns: columns.map((col) => ({ ...col, dataKey: col?.field }))
    });
    let fileName = `LoanFile_${company?.label || company?.name}_${
      product?.label || product?.name
    }_${
      moment().format("Do MMMM YYYY") !== "Invalid date"
        ? moment().format("Do MMMM YYYY")
        : "NA"
    }.pdf`;
    if (isCollateral) {
      fileName = `collateralFile_${
        moment().format("Do MMMM YYYY") !== "Invalid date"
          ? moment().format("Do MMMM YYYY")
          : "NA"
      }.pdf`;
    }
    doc.save(fileName);
    setTimeout(() => {
      handleAleart(null, "File Downloaded Successfully", "success");
    }, 2000);
  };

  const generateXLSXFile = (data, ext) => {
    let jsonData = data?.map((record) => {
      return {
        ...record,
        created_at: moment(record.created_at).format("YYYY-MM-DD"),
        partner_name: company.label ? company.label : company.name,
        product_name: product.label ? product.label : product.name,
        customer_name: `${record?.first_name ?? ""} ${record?.last_name ?? ""}`
      };
    });
    let fileName = `LoanFile_${company?.label || company?.name}_${
      product?.label || product?.name
    }_${
      moment(filter.from_date).format("DD_MMM_YYYY") !== "Invalid date"
        ? moment(filter.from_date).format("DD_MMM_YYYY")
        : "NA"
    }_${
      moment(filter.to_date).format("DD_MMM_YYYY") !== "Invalid date"
        ? moment(filter.to_date).format("DD_MMM_YYYY")
        : "NA"
    }.${ext}`;
    if (isCollateral) {
      fileName = `collateralFile_${company?.label}.${ext}`;
      jsonData = loanData?.map((record) => {
        return {
          ...record,
          invoice_date: record.invoice_date
            ? moment(record.invoice_date).format("YYYY-MM-DD")
            : "",
          policy_expiry_date: record.policy_expiry_date
            ? moment(record.policy_expiry_date).format("YYYY-MM-DD")
            : "",
          policy_issuance_date: record.policy_issuance_date
            ? moment(record.policy_issuance_date).format("YYYY-MM-DD")
            : ""
        };
      });
    }
    downloadDataInXLSXFormat(fileName, jsonData);
    setTimeout(() => {
      handleAleart(null, "File Downloaded Successfully", "success");
    }, 2000);
  };

  const generateCSVFile = () => {
    setTimeout(() => {
      handleAleart(null, "File Downloaded Successfully", "success");
    }, 2000);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", 
          marginRight:"1.3vw"
        }}
      >
        <Button
        buttonType="secondary"
        customStyle={{width:"109px" , height:"40px" , border: "1px solid #475BD8",color: "#475BD8" , borderRadius:"26px" , color: "rgb(71, 91, 216)" , fontSize:"12px" , display:"flex",justifyContent: "center", boxShadow:"none", backgroundColor:"white"}}
        imageButton={Img}
         imageButtonHover={imgH} 
         iconButton="btn-secondary-download-button"
          onClick={
            isCollateral
              ? () => generateXLSXFile(loanData, "xlsx")
              : () => getDownloadData(2)
          }
          label="XLSX"
        />
        {disabled ? (
          <Button isDisabled={true} label="CSV" buttonType="secondary" customStyle={{width:"109px" , height:"40px" , backgroundColor:"white"}} />
        ) : (
          <Button
          buttonType="secondary"
          customStyle={{width:"109px" , height:"40px" , marginLeft:"12px" , border: "1px solid #475BD8",color: "#475BD8" , borderRadius:"26px" , color: "rgb(71, 91, 216)" , fontSize:"12px" , display:"flex",justifyContent: "center", boxShadow:"none" , backgroundColor:"white"}}
          imageButton={Img}
           imageButtonHover={imgH}
            iconButton="btn-secondary-download-button"
            onClick={
              isCollateral
                ? () => generateXLSXFile(loanData, "csv")
                : () => getDownloadData(3)
            }
            label="CSV"
          />
        )}
      </div>
    </>
  );
};

export default DownloadLoanFiles;

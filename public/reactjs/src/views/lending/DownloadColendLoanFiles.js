import React from 'react';
//import Button from '@mui/material/Button';
import Button from "react-sdk/dist/components/Button/Button";
import Img from "./images/download-button.svg"
import imgH from "./images/download-button-hover.svg";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import moment from "moment";
import { downloadDataInXLSXFormat } from "../../util/helper";
const {
    getColenderLoans,
} = require("../../apis/colenders");


const DownloadLoanFiles = ({
    loanData,
    disabled,
    colenderID,
    companyId,
    productId,
    status,
    loanMinAmount,
    loanMaxAmount,
    fromDate,
    toDate,
    isCollateral = false,
    handleAleart
}) => {

    const [csvHeaders, setCsvHeaders] = React.useState();


    const getColendeData = async (flag) => {
        let result = await getColenderLoans(
            colenderID,
            companyId,
            productId,
            status,
            loanMinAmount,
            loanMaxAmount,
            fromDate,
            toDate
        );
        const colendLoan = result.data.colenderLoan

        loanData = colendLoan
        if (flag === 1) { generateColenderLoanPdfFile(colendLoan) };
        if (flag === 2) generateXLSXFile(colendLoan, "xlsx");
        if (flag === 3) generateCSVFile(colendLoan, "csv");

    }

    const generateColenderLoanPdfFile = (colendLoan) => {
        const doc = new jsPDF();
        const columns = [
            { title: 'Loan Id', field: 'loan_id' },
            { title: 'Colend Loan Id', field: 'co_lend_loan_id' },
            { title: 'Lender Name', field: 'lender_name' },
            { title: 'Loan Amount', field: 'loan_amount' },
            { title: 'Disbursement date', field: 'disbursement_date' },
            { title: 'status', field: 'status' },
        ];

        autoTable(doc, { html: '#my-table' });

        doc.autoTable({
            theme: 'grid',
            body: colendLoan?.map((record) => {
                return {
                    ...record,
                    loan_id: record.loan_id,
                    co_lend_loan_id: record.co_lend_loan_id,
                    lender_name: record.co_lender_name,
                    loan_amount: `${record.co_lend_loan_amount}`,
                    disbursement_date: record.disbursement_date ?  moment(record.disbursement_date).format("YYYY-MM-DD") : "",
                    status: record.status,

                }
            }),
            columns: columns.map((col => ({ ...col, dataKey: col?.field })))
        });
        let fileName = `LoanFile_${moment().format('Do MMMM YYYY')}.pdf`
        doc.save(fileName);
        setTimeout(() => {
            handleAleart(null, 'File Downloaded Successfully', 'success');
        }, 2000);
    };

    const generateXLSXFile = (colendLoan) => {
        const jsonData = colendLoan?.map((record) => {
            return {
                loan_id: record.loan_id,
                co_lend_loan_id: record.co_lend_loan_id,
                lender_name: record.co_lender_name,
                loan_amount: `${record.co_lend_loan_amount}`,
                disbursement_date: record.disbursement_date ? moment(record.disbursement_date).format("YYYY-MM-DD") : "",
                status: record.status,

            }
        });
        let fileName = `LoanFile_${new Date().toISOString()}.xlsx`

        downloadDataInXLSXFormat(fileName, jsonData);
        setTimeout(() => {
            handleAleart(null, 'File Downloaded Successfully', 'success');
        }, 2000);
    };

    const generateCSVFile = (colendLoan) => {
        const jsonData = colendLoan?.map((record) => {
            return {
                loan_id: record.loan_id,
                co_lend_loan_id: record.co_lend_loan_id,
                lender_name: record.co_lender_name,
                loan_amount: `${record.co_lend_loan_amount}`,
                disbursement_date: record.disbursement_date ? moment(record.disbursement_date).format("YYYY-MM-DD")  : "",
                status: record.status,

            }
        });
        let fileName = `LoanFile_${new Date().toISOString()}.csv`

        downloadDataInXLSXFormat(fileName, jsonData);
        setTimeout(() => {
            handleAleart(null, 'File Downloaded Successfully', 'success');
        }, 2000);
    };

    const buttonCss = {
        width:"105px" , 
        height:"40px", 
        marginRight:"8px",
        border: "1px solid #475BD8",
        borderRadius: "26px",
        color: "#475BD8",
        fontSize: "12px",
        fontFamily:"Montserrat-Regular",
        backgroundColor:"#FFF"
    }

    return (
         <div style={{ display: 'flex', justifyContent: "flex-end",marginTop:"10px" }}>
        <Button
            buttonType="secondary"
            customStyle={buttonCss}
            onClick={() => getColendeData(1)}
            label=" PDF"
            imageButton={Img} imageButtonHover={imgH} iconButton="btn-secondary-download-button"
        />
        <Button
            buttonType="secondary"
            customStyle={buttonCss}
            onClick={() => getColendeData(2)}
            label=" XLSX"
            imageButton={Img} imageButtonHover={imgH} iconButton="btn-secondary-download-button"
        />
        <Button 
            buttonType="secondary"
            customStyle={buttonCss}
            onClick={() => getColendeData(3)}
            label=" CSV"
            imageButton={Img} imageButtonHover={imgH} iconButton="btn-secondary-download-button"
        />
      </div>
    )
};

export default DownloadLoanFiles;

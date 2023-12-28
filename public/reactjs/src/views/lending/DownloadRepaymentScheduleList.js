import React, {useState} from "react";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import {downloadDataInXLSXFormat} from "../../util/helper";
import {AlertBox} from "../../components/AlertBox";
import Button from "react-sdk/dist/components/Button/Button"
import Img from "./images/download-button.svg"
import imgH from "./images/download-button-hover.svg";

const DownloadRepaymentScheduleList = ({
  data,
  company,
  product,
  loanId
}) => {
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  
  const handleAlertClose = () => {
    setAlert(false);
    setAlertMessage("");
    setSeverity("");
  };
  
  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };
  
  let columns = [
    { title: 'Loan id', field: 'loan_id' },
    { title: 'Installment number', field: 'emi_no' },
    { title: 'Amount due', field: 'emi_amount' },
    { title: 'Principal', field: 'prin' },
    { title: 'Interest', field: 'int_amount' },
    { title: 'Due date', field: 'due_date' }
  ];
  const columnsForLoc = [
    { title: 'Loan id', field: 'loan_id' },
    { title: 'Sub loan id', field: 'sub_loan_id' },
    { title: 'Installment number', field: 'emi_no' },
    { title: 'Amount due', field: 'emi_amount' },
    { title: 'Principal', field: 'prin' },
    { title: 'Interest', field: 'int_amount' },
    { title: 'Due date', field: 'due_date' }
  ];
  
  const generatePdfFile = () => {
    if(product?.isLoc){
      columns = columnsForLoc;
    }
    const doc = new jsPDF();
    
    autoTable(doc, { html: '#my-table' });
    
    doc.autoTable({
      theme: 'grid',
      body: data,
      columns: columns.map((col => ({ ...col, dataKey: col?.field })))
    });
    doc.save(`Repayment_Schedule_${company.label}_${product.label}_${loanId}..pdf`);
    setTimeout(() => {
      showAlert('File Downloaded Successfully', 'success');
    }, 2000);
  };
  
  const generateXLSXFile = () => {
    
    let jsonData;
    if(product?.isLoc) {
      jsonData = data?.map((record) => {
        return {
          loan_id: record?.loan_id,
          sub_loan_id: record.sub_loan_id,
          emi_no: record?.emi_no,
          emi_amount: record.emi_amount,
          prin: record.prin,
          int_amount: record.int_amount,
          due_date: record.due_date,
        };
      });
    }else{
      jsonData = data?.map((record) => {
        return {
          loan_id: record?.loan_id,
          emi_no: record?.emi_no,
          emi_amount: record.emi_amount,
          prin: record.prin,
          int_amount: record.int_amount,
          due_date: record.due_date
        };
      });
    }
    let fileName = `Repayment_Schedule_${company.label}_${product.label}_${loanId}.xlsx`
    downloadDataInXLSXFormat(fileName, jsonData);
    setTimeout(() => {
      showAlert('File Downloaded Successfully', 'success');
    }, 2000);
  };
  
  const generateCSVFile = () => {
    setTimeout(() => {
      showAlert('File Downloaded Successfully', 'success');
    }, 2000);
  };
  
  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <div style={{ display: 'flex', justifyContent: "flex-end",marginTop:"150px",gap:"10px"}}>
        <Button
            iconButton="btn-secondary-download-button"
            imageButton={Img}
            imageButtonHover={imgH}
            buttonType="secondary"
            customStyle={{width:"109px" , height:"40px" , border: "1px solid #475BD8",color: "#475BD8" , borderRadius:"26px" , color: "rgb(71, 91, 216)" , fontSize:"12px" , display:"flex",justifyContent: "center" ,  boxShadow:"none" ,backgroundColor:"white"}}
            onClick={generatePdfFile}
            label="PDF"
        />
        <Button
            iconButton="btn-secondary-download-button"
            imageButton={Img}
            imageButtonHover={imgH}
            buttonType="secondary"
            customStyle={{width:"109px" , height:"40px" , border: "1px solid #475BD8",color: "#475BD8" , borderRadius:"26px" , color: "rgb(71, 91, 216)" , fontSize:"12px" , display:"flex",justifyContent: "center",  boxShadow:"none" ,backgroundColor:"white"}}
            onClick={generateXLSXFile}
            label="XLSX"
        />
        <Button
            iconButton="btn-secondary-download-button"
            imageButton={Img}
            imageButtonHover={imgH}
            buttonType="secondary"
            customStyle={{width:"109px" , height:"40px" , border: "1px solid #475BD8",color: "#475BD8" , borderRadius:"26px" , color: "rgb(71, 91, 216)" , fontSize:"12px" , display:"flex",justifyContent: "center",  boxShadow:"none" ,backgroundColor:"white"}}
            onClick={generateCSVFile}
            label="CSV"
        />
      </div>
    </>
  )
};

export default DownloadRepaymentScheduleList;

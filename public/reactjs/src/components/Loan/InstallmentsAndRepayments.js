import * as React from "react";
import { useState } from "react";
import Payments from "./Payments";
import Table from "../../../node_modules/react-sdk/dist/components/Table/Table";
import Pagination from "../../../node_modules/react-sdk/dist/components/Pagination/Pagination";
import svg from "./tableicon.svg"
import "react-sdk/dist/styles/_fonts.scss"
import moment from "moment";


const InstallmentsAndRepayments = props => {
  const {data,showAlert} = props;
  const [count, setCount] = useState(data?.length);
  const [originalData, setOriginalData] = useState(data);
  const [installmentAndRepaymentData, setInstallmentAndRepaymentData] = useState(data.slice(0, 10));
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [paymentsData, setPaymentsData] = useState(false);
  
  const handleChangePage = (event, newPage) => {
    setPage(event);
    const f = event * 10;
    const l = event * 10 + 10;
    const sliced = originalData.slice(f, l);
    setInstallmentAndRepaymentData(sliced);
  };
  
  const onModalClose =()=>{
    setOpen(false);
  }
  
  const handleOpenPayments =(payments)=>{
    if(!payments.length){
      showAlert("No repayment records found","error");
    }
    else{
      setOpen(true);
      setPaymentsData(payments);
    }
  }


  const columns = [
    { id: "installment_number", label: <span style={{marginLeft:"-20px"}}>{"INST. NO." }</span> ,format:(rowData) => <span style={{marginLeft:"-20px"}}>{(rowData?.installment_number)}</span>},
    { id: "installment_amount_due", label: <span style={{marginLeft:"-140px"}}>{"INST. AMOUNT"}</span> , format:(rowData) => <span style={{marginLeft:"-140px"}}>{rowData?.installment_amount_due||rowData?.installment_amount_due===0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rowData?.installment_amount_due):"NA"}</span> },
    { id: "principal_due", label: <span style={{marginLeft:"-110px"}}>{"PRINCIPAL DUE" }</span> , format:(rowData) => <span style={{marginLeft:"-110px"}}>{rowData?.principal_due||rowData?.principal_due===0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rowData?.principal_due):"NA"}</span>},
    { id: "interest_due", label: <span style={{marginLeft:"-60px"}}>{"INTEREST DUE"}</span> ,format:(rowData) => <span style={{marginLeft:"-60px"}}>{rowData?.interest_due||rowData?.interest_due===0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rowData?.interest_due):"NA"}</span>},
    { id: "due_date", label: <span style={{marginLeft:"-20px"}}>{"DUE DATE"}</span> ,format:(rowData) => <span style={{marginLeft:"-20px"}}>{(rowData?.due_date)}</span>},
    { id: "lpi_due", label: "LPI DUE" ,   format:(rowData) => <div>{rowData?.lpi_due||rowData?.lpi_due===0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rowData?.lpi_due):"NA"}</div> },
    { id: "principal_paid", label: "PRINCIPAL PAID", format:(rowData) => <div>{rowData?.principal_paid||rowData?.principal_paid===0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rowData?.principal_paid):"NA"}</div>  },
    { id: "interest_paid", label: "INTEREST PAID" ,format:(rowData) => <div>{rowData?.interest_paid||rowData?.interest_paid===0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rowData?.interest_paid):"NA"}</div> },
    { id: "lpi_paid", label: "LPI PAID" , format:(rowData) => <div>{rowData?.lpi_paid||rowData?.lpi_paid===0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rowData?.lpi_paid):"NA"}</div> },
    { id: "paid_date", label: "PAID DATE" , format:(rowData) => <div>{ (rowData?.paid_date ?  moment(rowData?.paid_date).format("YYYY-MM-DD") : "NA")}</div> },
    { id: "status", label: "STATUS" },
    { id: "REPAYMENT", label: "REPAYMENT" , format:(rowData) => <div style={{cursor:"pointer"}} onClick={()=>handleOpenPayments(rowData?.payments)}><img src={svg} alt="table icon" /></div> },
  ];
  
  return(
    <>
      {open ?
        <Payments
          data={paymentsData}
          open={open}
          onModalClose={onModalClose}
          setOpen={setOpen}
        />
        : null
      }
      <div>
            <div style={{color:"#141519", margin:"30px",  fontSize:"18px" , lineHeight:"150%" , fontFamily: "Montserrat-SemiBold"}} >Installments And Payments</div>
            {installmentAndRepaymentData.length ? (
          <div>
            <div style={{maxWidth:"100%" , padding:"20px" , marginTop:"-40px"}}>
              <Table
              customStyle={{width:"100%"}}
                data={installmentAndRepaymentData}
                columns={columns}
              />
              {count ?  <Pagination
                onPageChange={handleChangePage}
                totalItems={count}
                itemsPerPage={10}
              /> : null }
            </div> 
          </div> ) : "" }
        </div>
    </>
  );
}

export default InstallmentsAndRepayments

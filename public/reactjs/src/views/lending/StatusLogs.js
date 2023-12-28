import * as React from "react";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";

import { statusLogsWatcher } from "../../actions/statusLogs";
import { storedList } from "../../util/localstorage";
import Table from "react-sdk/dist/components/Table/Table";
import moment from "moment";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";


const statusToDisplay = {
    open: "Open",
    batch:"Batch",
    manual:"Manual KYC",
    kyc_data_approved: "KYC Data Approved",
    credit_approved: "Credit Approved",
    co_lender_approval_pending: "Co-Lender Approval Pending",
    disbursal_approved: "Disbursement Approved",
    disbursal_pending: "Pending Disbursal",
    disbursement_initiated: "Disbursement Initiated",
    disbursed: "Active",
    rejected: "Rejected",
    cancelled: "Cancelled",
    line_in_use: "Line in use",
    expired: "Expired",
    active: "Active",
    foreclosed:"Foreclosed"
};





export default function StatusLogs(props) {
    const {
    data,
    openDialog,
    setOpenDialog,
    showAlert
    } = props;
    const dispatch = useDispatch();
    const user = storedList("user");
    const [isLoaded, setIsLoaded] = useState(false);
    const [result, setResult] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);
    const[rowsPerPage,setRowPerPage] =useState(10);
    const [rowData,setRowData] = useState([])
    useEffect(() => {
      
    
    const payload = {
    company_id: data.company_id,
    product_id: data.product_id,
    user_id: user._id,
    loan_id: data.loan_id,
    page:0,
    limit:rowsPerPage,
    }
    new Promise((resolve, reject) => {
    dispatch(statusLogsWatcher(payload,resolve, reject));
    })
    .then(result => {
    setIsLoaded(true);
    setCount(result.data.count);
    setResult(result.data.rows.slice(page*rowsPerPage,(page+1)*rowsPerPage));
    setRowData(result.data.rows.slice(page*rowsPerPage,(page+1)*rowsPerPage));
    })
    .catch(error => {
    setOpenDialog(false);
    showAlert(error?.response?.data?.message, "error");
    });
    }, [data,page,rowsPerPage]);
    
    var sampleData = rowData.map((item, index) => ({
      "Loan id": item.loan_id,
      "Old status":statusToDisplay[item?.old_status],
      "New status":statusToDisplay[item?.new_status],
      "User ID":item?.user_email,
      "Date & time":moment(item?.action_date_time).format("YYYY-MM-DD, HH:mm:ss")
      
      
      }));
    const handleClose =() =>{
        setOpenDialog(false);
      }
    return (
    <>
    {isLoaded ? (
    <div style={{width:"70%",height:"60%"}}>
    <FormPopup heading="Status Change Logs"  open={openDialog} isOpen={openDialog} onClose={handleClose} customStyles={{width:"fit-Content",height:"fit-Content"}}>
    <div style={{marginTop:"10px",display:"table",width:"100%",zIndex:100000}}>
    <Table customStyle={{fontFamily:"Montserrat-Medium",display:"grid",gridTemplateColumns:"20% 20% 20% 20% 20%"}}

    columns={[
   
    { id: 'Loan id', label: 'LOAN ID' },
    { id: 'Old status', label: 'OLD STATUS'},
    { id: 'New status', label: 'NEW STATUS'},
    { id: 'User ID', label: 'USER ID' },
    { id: 'Date & time', label: 'DATE & TIME'},
    ]} data={sampleData} />

    <Pagination 
        itemsPerPage={rowsPerPage} 
        totalItems={count} 
        rowsPerPageOptions={[5, 10, 15, 20]}
        onPageChange={setPage} 
        setRowLimit={setRowPerPage}
        /> 
    </div>

 </FormPopup>
 </div>
 )
          :
          (
          <div></div>
          )}
        
</>
);
}


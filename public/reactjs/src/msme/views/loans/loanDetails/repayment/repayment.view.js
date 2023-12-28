import React, { useEffect, useState } from 'react'
import Pagination from 'react-sdk/dist/components/Pagination/Pagination';
import Table from 'react-sdk/dist/components/Table/Table';


function Repayment() {


    const [batchRowsPerPage, setBatchRowsPerPage] = useState(10);
    const [batchCount, setBatchCount] = useState(0);
  
    //repayment Data
    const [rePaymentSchedule, setRepaymnetSchedule] = useState([
        {
            "inst_number": 1,
            "loan_id": "AMLHAPAGX100986",
            "amount_due": '₹2343',
            "principle_amount": '₹876787',
            "intrest": '₹12',
            "due_date": "12-08-1997"
        },
        {
            "inst_number": 2,
            "loan_id": "AMLHAPAGX100986",
            "amount_due": '₹2343',
            "principle_amount": '₹876787',
            "intrest": '₹12',
            "due_date": "12-08-1997"
        },
      
        {
            "inst_number": 3,
            "loan_id": "AMLHAPAGX100986",
            "amount_due": '₹2343',
            "principle_amount": '₹876787',
            "intrest": '₹12',
            "due_date": "12-08-1997"
        },
    ]);

    const BatchTransactioncolumns = [
        { id: "inst_number", label: "INST NO." },
        { id: "loan_id", label: "LOAN ID" },
        { id: "amount_due", label: "AMOUNT DUE" },
        { id: "principle_amount", label: "PRINCIPAL" },
        { id: "intrest", label: "INTEREST" },
        { id: "due_date", label: "DUE DATE" },
    ];

    const handleBatchChangePage = (event, newPage) => {
        setBatchPage(event);
    };

    return (
        <div>
            <Table
                customStyle={{
                    display: "grid",
                    gridTemplateColumns: "20% 20% 15% 15% 10% 20%",
                    fontFamily: 'Montserrat-Medium',
                    width: "100%",
                    overflowX:"hidden"
                }}
                data={rePaymentSchedule}
                columns={BatchTransactioncolumns}
            />

            <Pagination
                itemsPerPage={batchRowsPerPage}
                totalItems={batchCount}
                rowsPerPageOptions={[10, 20, 30]}
                setRowLimit={setBatchRowsPerPage}
                onPageChange={handleBatchChangePage}
                showOptions={true}
            />
        </div>
    )
}

export default Repayment

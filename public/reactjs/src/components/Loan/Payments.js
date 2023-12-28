import * as React from "react";
import {useState} from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {styled} from "@material-ui/core/styles";
import {tableCellClasses} from "@mui/material/TableCell";
// import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import moment from "moment";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import Table from "../../../node_modules/react-sdk/dist/components/Table/Table";
import Pagination from "../../../node_modules/react-sdk/dist/components/Pagination/Pagination";

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5e72e4",
    color: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.black
  }
}));

export default function Payments(props) {
  const {
    data,
    onModalClose,
    open,
    setOpen,
  } = props;
  const [responseData, setResponseData] = useState(data);
  const [payments, setPayments] = useState(data.slice(0,10));
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(data?.length);
    
  const handleChangePage = (event, newPage) => {
    setPage(event);
    const f = event * 10;
    const l = event * 10 + 10;
    const data = responseData.slice(f, l);
    setPayments(data);
  
  };

  const columns = [
    { id: "utr", label: "UTR NUMBER" },
    {id: "Date", label: "DATE", format: (rowData) => moment(rowData.utr_date).format("YYYY-MM-DD")},
    // {id: "Principal", label: "PRINCIPAL", format: (rowData) => <div>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(rowData?.prin_paid))}</div>},
    {
      id: "Principal",
      label: "PRINCIPAL",
      format: (rowData) => {
        const prinPaid = rowData?.prin_paid;
        return <div>{prinPaid||prinPaid==0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(prinPaid)):"NA"}</div>
      }
    },
    // { id: "amount_paid", label: "AMOUNT PAID",  format: (rowData) => <div>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(rowData?.amount_paid))}</div>},
    {
      id: "amount_paid",
      label: "AMOUNT PAID",
      format: (rowData) => {
        const amtPaid = rowData?.amount_paid;
        return <div>{amtPaid||amtPaid==0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(amtPaid)):"NA"}</div>
      }
    },
    // {id: "Interest", label: "INTEREST", format: (rowData) => <div>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(rowData?.int_paid))}</div>},
    {
      id: "Interest",
      label: "INTEREST",
      format: (rowData) => {
        const intPaid = rowData?.int_paid;
        return <div>{intPaid||intPaid==0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(intPaid)):"NA"}</div>
      }
    },
    {
      id: "LPI",
      label: "LPI",
      format: (rowData) => {
        const lpiPaid = rowData?.lpi_paid;
        return <div>{lpiPaid||lpiPaid==0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(lpiPaid)):"NA"}</div>
      }
    },
    // {id: "LPI", label: "LPI", format: (rowData) => <div>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(rowData?.lpi_paid))}</div>}
  ];
  
  const handleClose = () => {
    setOpen(false);
    onModalClose("", "");
  };
  const getVal = value => {
    if (value?.$numberDecimal !== undefined) {
      return parseFloat(value.$numberDecimal.toString());
    } else if (typeof value === "object") {
      return parseFloat(value.toString());
    }
    return value;
  };
  
  return (
    <>
      {open ? (
        <FormPopup
          onClose={handleClose}
          heading="Repayments"
          isOpen={open}
          open={open}
          customStyles={{width:"75%" , overflowX:"hidden"}}
        >
          {payments.length ? (
          <div>
            <div style={{width:"100%" , display:"grid" }}>
              <Table
              customStyle={{width:"100%"}}
                data={payments}
                columns={columns}
              />
              <div style={{width:"100%"}}>  {count ?  <Pagination
                onPageChange={handleChangePage}
                totalItems={count}
                itemsPerPage={10}
              /> : null }</div>
            </div> 
          </div> ) : "" }
        </FormPopup>
      ) : null}
    </>
  );
}

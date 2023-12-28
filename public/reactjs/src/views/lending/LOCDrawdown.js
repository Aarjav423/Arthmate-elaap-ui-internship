import Typography from "@mui/material/Typography";
import * as React from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@material-ui/core/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { useEffect, useState } from "react";
import { transactionHistoryListWatcher } from "../../actions/transactionHistory";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment/moment";
import TableBody from "@mui/material/TableBody";
import { AlertBox } from "../../components/AlertBox";
import TablePagination from "@mui/material/TablePagination";
import { checkAccessTags } from "../../util/uam";
import { storedList } from "../../util/localstorage";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import Table from "react-sdk/dist/components/Table/Table";
const user = storedList("user");

export default function LOCDrawdown() {
  const dispatch = useDispatch();
  const { company_id, product_id, loan_id } = useParams();
  const [drawdownHistoryList, setDrawdownHistoryList] = useState({});
  const [responseData, setResponseData] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_transaction_ledger_read",
        "tag_loan_queue_read_write"
      ])
    )
      fetchDrawDownList();
    if (!isTagged) fetchDrawDownList();
  }, [page]);

  const handleAlertClose = () => {
    setAlert(false);
    setAlertMessage("");
    setSeverity("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(event);
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const fetchDrawDownList = () => {
    const payload = {
      loan_id: loan_id,
      company_id,
      product_id,
      page,
      limit: rowsPerPage
    };
    new Promise((resolve, reject) => {
      dispatch(transactionHistoryListWatcher(payload, resolve, reject));
    })
      .then((response) => {
        if (response.data?.count > 0) {
          setResponseData(response.data.rows);
                    setDrawdownHistoryList(response.data.rows.slice(0, rowsPerPage));
          setCount(response.data.count);
        } else {
          showAlert("No drawdown records found for the loan id", "error");
        }
      })
      .catch(() => {
        showAlert("No drawdown records found for the loan id", "error");
      });
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#5e72e4",
      color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      color: theme.palette.common.black
    }
  }));

  const columns = [
    {
      id: "Transaction date",
      label: "TRANSACTION DATE",
      format: (row) => moment(row?.txn_date ? row.txn_date : row.utr_date_time_stamp).format("YYYY-MM-DD")
    },
    {
      id: "Transaction amount",
      label: "TRANSACTION AMOUNT",
      format: (row) => row.txn_amount||row.txn_amount==0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(row.txn_amount).toFixed(2)):"NA"
    },
    { id: "label", label: "TRANSACTION TYPE" },
    {
      id: "Transaction id",
      label: "TRANSACTION ID",
      format: (row) =>
        `${
          row.txn_entry != "dr"
            ? row.txn_reference
              ? row.txn_reference
              : ""
            : row.txn_id
            ? row.txn_id
            : ""
        }`
    },
    {
      id: "UTR Number",
      label: "UTR NUMBER",
      format: (row) => `${row.utr_number ? row.utr_number : ""}`
    },
    {
      id: "Usage id",
      label: "USAGE ID",
      format: (row) => `${row?.usage_id ?? row?._id}`
    },
    {
      id: "status",
      label: "STATUS",
      format: (row) =>
        `${
          row.txn_entry != "dr"
            ? row?.is_received === "Y"
              ? "Approved"
              : row?.is_received === "N"
              ? "Approval pending"
              : row?.is_received === "hold"
              ? "Hold"
              : "Approval pending"
            : row.disbursement_status
            ? row.disbursement_status
            : ""
        }`
    }
    // No need for the "Action" column with the icon here
  ];

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onclose={handleAlertClose}
        />
      ) : null}
      {/* <Grid display={"flex"} pt={2}>
        <Grid item xs={4}>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Transaction ledger
          </Typography>
        </Grid>
      </Grid> */}
      <div>
        <div>
          {/* {drawdownHistoryList.length ? (
            <TableContainer
              sx={{
                mt: 1
              }}
              component={Paper}
            >
              <Table
                sx={{
                  minWidth: 700
                }}
                aria-label="customized table"
                id="pdf"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell> Transaction date </StyledTableCell>{" "}
                    <StyledTableCell> Transaction amount </StyledTableCell>{" "}
                    <StyledTableCell> Transaction type </StyledTableCell>{" "}
                    <StyledTableCell> Transaction id </StyledTableCell>{" "}
                    <StyledTableCell> UTR Number</StyledTableCell>{" "}
                    <StyledTableCell> Usage id </StyledTableCell>{" "}
                    <StyledTableCell> Status </StyledTableCell>{" "}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drawdownHistoryList
                    ? drawdownHistoryList.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell scope="row">
                            {moment(item?.txn_date).format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell scope="row">
                            {`${Number(item.txn_amount).toFixed(2)}`}
                          </TableCell>
                          <TableCell scope="row">{item.label}</TableCell>
                          <TableCell scope="row">{`${
                            item.txn_entry != "dr"
                              ? item.txn_reference
                                ? item.txn_reference
                                : ""
                              : item.txn_id
                              ? item.txn_id
                              : ""
                          }`}</TableCell>
                          <TableCell scope="row">
                            {`${item.utr_number ? item.utr_number : ""}`}
                          </TableCell>
                          <TableCell scope="row">{`${item?.usage_id ?? item?._id}`}</TableCell>
                          <TableCell scope="row">{`${
                            item.txn_entry != "dr"
                              ? item?.is_received === "Y"
                                ? "Approved"
                                : item?.is_received === "N"
                                ? "Approval pending"
                                : item?.is_received === "hold"
                                ? "Hold"
                                : "Approval pending"
                              : item.disbursement_status
                              ? item.disbursement_status
                              : ""
                          }`}</TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
              {count ? (
                <TablePagination
                  component="div"
                  count={count}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10]}
                />
              ) : null}
            </TableContainer>
          ) : null} */}

          {drawdownHistoryList.length ? (
            <div style={{ padding: "20px", maxWidth: "100%"}}>
              <Table
                customStyle={{ width: "100%" }}
                data={drawdownHistoryList}
                columns={columns}
                // actions={{ handleActionClick }}
                // handleActionClick={handleActionClick}
              />
              <Pagination
                onPageChange={handleChangePage}
                totalItems={count}
                itemsPerPage={10}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

import * as React from "react";
import { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import TableCell from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import IconButton from "@mui/material/IconButton";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import { useDispatch } from "react-redux";
import { setAlert } from "../../actions/common";
import { storedList } from "../../util/localstorage";
import { fetchCreditlineLimitWatcher } from "../../actions/creditlineLimit";
import CompanyDropdown from "../../components/BKCompany/CompanySelect";
import BKTableHeader from "../../components/BKTable/BKTableHeader";
import { sanctionTransactionsTables } from "../lending/bookloan/tableProps";

export default function SanctionList(props) {
  const dispatch = useDispatch();
  const [company, setCompany] = useState("");
  const [loanId, setLoanId] = useState("");
  const [sanctionAmountList, setSanctionAmountList] = useState("");
  const [page, setPage] = useState(0);
  const [count, setCount] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangeCompany = (value) => {
    if (!value) {
      value = "";
    }
    setCompany(value ? value.value : "");
  };

  const handleChangeLoanId = (e) => {
    setLoanId(e.target.value ? e.target.value : "");
  };

  const fetchSanctionAmountList = () => {
    const user = storedList("user");
    const data = {
      company_id: company,
      loan_id: loanId,
      user_id: user._id,
      page,
      limit: rowsPerPage,
    };
    new Promise((resolve, reject) => {
      dispatch(fetchCreditlineLimitWatcher(data, resolve, reject));
    })
      .then((response) => {
        setSanctionAmountList(response.creditLimitList);
        setCount(response.count);
      })
      .catch((error) => {
        dispatch(setAlert(false, error.response.data.message, "error"));
      });
  };

  useEffect(() => {
    fetchSanctionAmountList();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchSanctionAmountList();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    fetchSanctionAmountList();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container xs={12} spacing={2}>
        <Grid xs={12} sm={3} item>
          <CompanyDropdown
            placeholder="Select company"
            company={company}
            onCompanyChange={(value) => handleChangeCompany(value)}
          />
        </Grid>
        <Grid xs={12} sm={3} item>
          <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
            <TextField
              variant="standard"
              label="loanId"
              type="string"
              onChange={(value) => handleChangeLoanId(value)}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={3} item>
          <IconButton
            aria-label="access-token"
            onClick={() => {
              fetchSanctionAmountList();
            }}
          >
            <ManageSearchIcon />
          </IconButton>
        </Grid>
        {sanctionAmountList.length ? (
          <Grid xs={12} item>
            <TableContainer>
              {count ? (
                <TablePagination
                  component="div"
                  count={count}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              ) : null}
              <Table style={{ width: "100%" }} aria-label="customized table">
                <BKTableHeader headers={sanctionTransactionsTables} />
                <TableBody>
                  {sanctionAmountList &&
                    sanctionAmountList.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell scope="row">{`${item.company_name}`}</TableCell>
                        <TableCell scope="row">{`${item.product_name}`}</TableCell>
                        <TableCell scope="row">{`${item.loan_id}`}</TableCell>
                        <TableCell align="left">{item.limit_amount}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ) : null}
      </Grid>
    </DashboardLayout>
  );
}

import * as React from "react";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {styled} from "@material-ui/core/styles";
import {tableCellClasses} from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Divider} from "@mui/material";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {AlertBox} from "../../../components/AlertBox";
import {checkAccessTags} from "../../../util/uam";
import {storedList} from "../../../util/localstorage";
const user = storedList("user");

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

const StyledTableRow = styled(TableRow)(({theme}) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const isTagged =
  process.env.REACT_APP_BUILD_VERSION > 1
    ? user?.access_metrix_tags?.length
    : false;

const reportsList = [
  {
    id: 1,
    report_category: "Disbursement To Escrow",
    report_name: "Escrow_Disbursement_transactions_report",
    description: "Report of disbursement data",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_escrow_disbursement_report_read",
          "tag_escrow_disbursement_report_read_write"
        ])
      : false
  },
  {
    id: 2,
    report_category: "Disbursement To Borrower",
    report_name: "Borrower_Disbursement_transactions_report",
    description: "Report of disbursement data",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_borrower_disbursement_report_read",
          "tag_borrower_disbursement_report_read_write"
        ])
      : false
  },
  {
    id: 3,
    report_category: "Case Dump for Co-Lending",
    report_name: "Case_Dump_for_Co-Lending",
    description: "Case for Co-Lending",
    disabled: isTagged
      ? !checkAccessTags([
          "tag_colend_casedump_report_read_write"
        ])
      : false
  },
  {
    id: 4,
    report_category: "Repayment To Co-Lender",
    report_name: "Repayment_to_Co-Lender_report",
    description: "Report of co-Lender repayment data",
    disabled: isTagged
      ? !checkAccessTags(["tag_co_lending_repayment_file_read_write"])
      : false
  },
  {
    id: 5,
    report_category: "Co-Lender Disbursement",
    report_name: "Co-Lender_disbursement_report",
    description: "Report of Co-Lender Disbursement data",
    disabled: isTagged
      ? !checkAccessTags(["tag_colend_disburse_report_read_write"])
      : false
  }
];

const ColendingReports = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [reports, setreports] = useState(reportsList);

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };
  const handleNav = name => {
    if (name === "Repayment_to_Co-Lender_report") {
      window.open(
        `/admin/co_lending/download_repayment_file/${name}`,
        "_blank"
      );
    }
    if (name === "Case_Dump_for_Co-Lending") {
      window.open(
        `/admin/colending/download_zip_file/${name}`,
        "_blank"
      );
    }
    if (name === "Co-Lender_disbursement_report") {
      window.open(
        `/admin/co_lending/generate_reports/${name}`,
        "_blank"
      );
    }
    else{
    history.push({
      pathname: `/admin/co_lending/generate_reports/${name}`
    });
  }}

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <Typography
        sx={{
          mt: 2,
          ml: 2
        }}
        variant="h6"
      >
        Reports
      </Typography>
      <CardContent>
        <Grid
          xs={12}
          sx={{
            margin: "10px 0"
          }}
        >
          <Grid>
            <Divider />
          </Grid>
          {reports.length ? (
            <Grid xs={12}>
              <TableContainer
                sx={{
                  mt: 4
                }}
                component={Paper}
              >
                <Table
                  sx={{
                    minWidth: 700
                  }}
                  aria-label="customized table"
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell> ID </StyledTableCell>
                      <StyledTableCell> Report category </StyledTableCell>
                      <StyledTableCell> Report name </StyledTableCell>
                      <StyledTableCell> Report description </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports &&
                      reports.map(item => (
                        <StyledTableRow key={item.id}>
                          <StyledTableCell scope="row">
                            {item?.id}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item?.report_category}
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            <div
                              disabled={item.disabled}
                              onClick={() =>
                                !item.disabled && handleNav(item?.report_name)
                              }
                            >
                              <Link>{item?.report_name}</Link>
                            </div>
                          </StyledTableCell>
                          <StyledTableCell scope="row">
                            {item?.description}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
    </>
  );
};

export default connect(null, null)(ColendingReports);

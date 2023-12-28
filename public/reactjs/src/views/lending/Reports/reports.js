import { Divider } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AlertBox } from "../../../components/AlertBox";
import {
  StyledTableCell,
  StyledTableRow
} from "../../../components/custom/TableElements";
import { reportsList } from "../../../util/reports-data";

const Reports = () => {
  const history = useHistory();
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
    if (["LOC_due_report","Enach_subscription_report"].includes(name)) {
      history.push({
        pathname: `/admin/lending/report-requests/${name}`
      });
    } else {
      history.push({
        pathname: `/admin/lending/generate-reports/${name}`
      });
    }
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

export default Reports;

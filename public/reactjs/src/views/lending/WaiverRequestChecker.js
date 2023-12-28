import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { styled } from "@material-ui/core/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import { AlertBox } from "../../components/AlertBox";

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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

export default function WaiverRequestChecker(props) {
  const dispatch = useDispatch();
  const { loan_id, company_id, product_id } = useParams();
  const [waiverRequest, setWaiverRequest] = useState({});

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
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
      {charges.length && (
        <CardContent>
          <Grid
            xs={12}
            sx={{
              margin: "10px 20px",
              display: "flex"
            }}
          >
            <Typography variant="h6" sx={{ mt: 2 }}>
              Waiver request checker
            </Typography>
          </Grid>
          <Grid xs={12} sx={{ margin: "10px 10px", display: "flex" }}>
            <Grid
              xs={12}
              sx={{
                margin: "10px 10px",
                display: "flex"
              }}
            >
              <Grid
                xs={3}
                sx={{
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Typography
                  id="loan_id_title"
                  variant="p"
                  component="p"
                  sx={{
                    fontSize: "12px"
                  }}
                >
                  Loan ID
                </Typography>
                <Typography
                  id="loan_id_title_value"
                  variant="h6"
                  component="h6"
                  sx={{
                    fontSize: "16px"
                  }}
                >
                  {details.loan_id}
                </Typography>
              </Grid>
              <Grid
                xs={3}
                sx={{
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Typography
                  id="customer_name"
                  variant="p"
                  component="p"
                  sx={{
                    fontSize: "12px"
                  }}
                >
                  Customer Name
                </Typography>
                <Typography
                  id="customer_name_value"
                  variant="h6"
                  component="h6"
                  sx={{
                    fontSize: "16px"
                  }}
                >
                  {details.name}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} sx={{ margin: "10px 10px" }}>
            <TableContainer sx={{ mt: 4 }} component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow></TableRow>
                </TableHead>
                <TableBody></TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </CardContent>
      )}
    </>
  );
}

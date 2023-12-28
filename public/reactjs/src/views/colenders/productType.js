import { Collapse } from "@mui/material";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import CardContent from "@mui/material/CardContent";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { makeStyles, styled } from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { TableBody } from "@material-ui/core";
import { productTypeListWatcher } from "../../actions/colenders.js";
import { useDispatch } from "react-redux";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5e72e4",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.black,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ProductType = () => {
  const dispatch = useDispatch();
  const [productTypeList, setProductTypeList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  React.useEffect(() => {
    fetchProductTypeList();
  }, []);

  const fetchProductTypeList = () => {
    const payload = {};
    new Promise((resolve, reject) => {
      dispatch(productTypeListWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setProductTypeList(response);
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response.data.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
        Product Types
      </Typography>

      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Sr.No </StyledTableCell>
                <StyledTableCell align="left">
                  Product Type Code{" "}
                </StyledTableCell>
                <StyledTableCell align="left">
                  Product Type Description
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productTypeList.map((x, index) => {
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{x.product_type_id}</StyledTableCell>
                    <StyledTableCell>{x.product_type_code}</StyledTableCell>
                    <StyledTableCell>{x.product_type_name}</StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Grid>
  );
};

export default ProductType;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import CardContent from "@mui/material/CardContent";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { makeStyles, styled } from "@material-ui/core/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Button, TableBody } from "@material-ui/core";


import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { Await } from "react-router-dom";
import {
  productTypeListWatcher,
  colendersListWatcher,
} from "../../actions/colenders.js";
import { useDispatch } from "react-redux";
import CoLenderServiceToken from "../../components/Access/CoLenderServiceToken.js";
import { Divider } from "@mui/material";
import {storedList} from "../../util/localstorage";
const user = storedList("user");

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

const shares = [
  { value: 20 },
  { value: 30 },
  { value: 40 },
  { value: 50 },
  { value: 60 },
  { value: 70 },
  { value: 80 },
];

const colendingModeValue = [
  {value:"DA"},
  {value:"RT"}
];

const InfoColenders = () => {
  const [filterArr, setFilterArr] = useState([]);
  

  const [colendingshare, setColendingshare] = React.useState("");
  const [product_type_code, setProduct_type_code] = React.useState("");
  const [productpricing, setProductpricing] = React.useState("");
  const [totalAllocLimit, setTotalAllocLimit] = useState("");
  const [netAvailLimit, setNetAvailLimit] = useState("");
  const [is_rps, setIs_rps] = useState("");
  const [foreclosureShare,setForeclosureShare] = useState("");
  const [lpiShare,setLpiShare] = useState("");

  const showAlert = (msg, type) => {
    setAlert(true); 
    setSeverity(type); 
    setAlertMessage(msg); 
    setTimeout(()=>{handleAlertClose()},4000);
   };

  const {
    co_lender_id,
    co_lender_name,
    is_rps_by_co_lender,
    co_lender_shortcode,
    co_lending_share,
    co_lending_mode,
    escrow_account_number,
    escrow_account_beneficiary_name,
    escrow_account_ifsc_code,
    escrow_repayment_account_number,
    escrow_repayment_account_ifsc_code
  } = useParams();

  const [obj, setObj] = useState({ co_lender_id: co_lender_id });

  const handleChange = (event) => {
    setColendingshare(event.target.value);
    setObj({ ...obj, colending_share: event.target.value });
  };
  const handleChange1 = (event) => {
    setProduct_type_code(event.target.value);
    setObj({ ...obj, product_type_code: event.target.value });
  };
  const handleChange2 = (event) => {
    setProductpricing(event.target.value);
    setObj({ ...obj, product_pricing: event.target.value });
  };
  const handleTotalAllocLimit = (event) => {
    setTotalAllocLimit(event.target.value);
    setObj({ ...obj, total_allocated_limit: event.target.value });
  };

  const handleNetAvailLimit = (event) => {
    setNetAvailLimit(event.target.value);
    setObj({ ...obj, net_available_limit: event.target.value });
  };

  const handleIsrps = (event) => {
    if (is_rps == false) {
      setIs_rps("Y");
    } else {
      setIs_rps("N");
    }
    setObj({ ...obj, is_rps_by_colender: event.target.checked });
  };

  const handleDelete = (id, e) => {
    const deleteRow = (item) => {
      if (item.co_lender_id != id) {
        return true;
      }
      return false;
    };
    setFilterArr(filterArr.filter(deleteRow));
  };

  const handleEdit = (e) => {};

  const filterData = (item) => {
    if (item.co_lender_id == co_lender_id) {
      return true;
    } else {
      return false;
    }
  };

  const handleAddProduct = () => {
    setFilterArr([...filterArr, obj]);
    setObj({ co_lender_id: co_lender_id });
    setProductpricing("");
    setNetAvailLimit("");
    setTotalAllocLimit("");
    setProduct_type_code("");
  };

  const dispatch = useDispatch();
  const [colendersList, setColendersList] = useState([]);
  const [productTypeList, setProductTypeList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [colenderProducts, setColenderProducts] = useState([]);

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  React.useEffect(() => {
    fetchColendersList();
  }, []);

  const fetchColendersList = () => {
    const payload = {};
    new Promise((resolve, reject) => {
      dispatch(colendersListWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setColendersList(response);
        setFilterArr(response.filter(filterData));
        for (let ele of response.filter(filterData)){
          setLpiShare(ele.lpi_share ? ele.lpi_share : "")
          setForeclosureShare(ele.foreclosure_share ? ele.foreclosure_share : "")
        }
      })
      .catch((error) => {
        showAlert("error while fetching colender info","error")
      });
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
        showAlert(error.response.data.message,"error")
      });
  };

  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
        Info Colender
      </Typography>
      <CardContent>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "30ch" },
          }}
          noValidate
          autoComplete="off"
          marginBottom="10px"
        >
          <TextField
            id="outlined-read-only-input"
            label="Colender Id"
            defaultValue={co_lender_id}
            inputProps={{ readOnly: true }}
          />
          <TextField
            id="outlined-read-only-input"
            label="Colender Name"
            defaultValue={co_lender_name}
            inputProps={{ readOnly: true }}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Colending share
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={co_lending_share}
              label="Colending share"
              onChange={handleChange}
              inputProps={{ readOnly: true }}
            >
              {shares.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Colending Mode
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={co_lending_mode}
              label="Colending Mode"
              onChange={handleChange}
              inputProps={{ readOnly: true }}
            >
              {colendingModeValue.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="outlined-read-only-input"
            label="Colender Short Code"
            defaultValue={co_lender_shortcode}
            inputProps={{ readOnly: true }}
          />
        </Box>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "35ch" },
          }}
          noValidate
          autoComplete="off"
          marginTop="10px"
          marginBottom="10px"
        >
          <TextField
            id="outlined-read-only-input"
            label="Escrow Account Beneficiary Name"
            type="text"
            placeholder="Escrow Account Beneficiary Name"
            value={escrow_account_beneficiary_name=="-1" ? "":escrow_account_beneficiary_name}
            inputProps={{ readOnly: true }}
          />

         <TextField
            id="outlined-read-only-input"
            label="Escrow Account Number"
            placeholder="Escrow Account Number"
            value={escrow_account_number=="-1"? "":escrow_account_number}
            inputProps={{ readOnly: true }}
          />

          <TextField
            id="outlined-read-only-input"
            label="Escrow Account IFSC Code"
            placeholder="Escrow Account IFSC Code"
            value={escrow_account_ifsc_code=="-1" ?  "":escrow_account_ifsc_code}
            inputProps={{
              minLength: 11,
              maxLength: 11,
              style: { textTransform: "uppercase" },
              readOnly: true,
            }}
          />
          <TextField
            id="outlined-read-only-input"
            label="Foreclosure share"
            value={foreclosureShare}
            inputProps={{ readOnly: true }}
          />
          </Box>
          <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "35ch" },
          }}
          noValidate
          autoComplete="off"
          marginBottom="20px"
        >
          <TextField
            id="outlined-read-only-input"
            label="LPI share"
            value={lpiShare}
            inputProps={{ readOnly: true }}
          />
          <TextField
            id="outlined-read-only-input"
            label="Escrow repayment account number"
            type="text"
            placeholder="Escrow repayment account number"
            value={escrow_repayment_account_number=="-1"? "":escrow_repayment_account_number}
            inputProps={{ readOnly: true }}
          />
          <TextField
            id="outlined-read-only-input"
            label="Escrow repayment account IFSC code"
            type="text"
            placeholder="Escrow repayment account IFSC code"
            value={escrow_repayment_account_ifsc_code=="-1" ?  "":escrow_repayment_account_ifsc_code}
            inputProps={{
              minLength: 11,
              maxLength: 11,
              style: { textTransform: "uppercase" },
              readOnly: true,
            }}
          />
        </Box>
       
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Product Type </StyledTableCell>
                <StyledTableCell align="left">
                  Product Pricing (%){" "}
                </StyledTableCell>
                <StyledTableCell align="left">
                  Total Allocated Limit
                </StyledTableCell>
                <StyledTableCell align="left">
                  Net Available Limit
                </StyledTableCell>
              </TableRow>
            </TableHead>

            {filterArr.map((item, index) => {
              return (
                <TableBody key={index}>
                  {item.product_types.map((c, i) => (
                    <StyledTableRow key={i}>
                    <StyledTableCell>{c.product_type_code}</StyledTableCell>
                    <StyledTableCell>{c.product_pricing ? c.product_pricing.$numberDecimal? c.product_pricing.$numberDecimal :c.product_pricing : ""}</StyledTableCell>
                    <StyledTableCell>{c.total_allocated_limit ? c.total_allocated_limit.$numberDecimal? c.total_allocated_limit.$numberDecimal :c.total_allocated_limit  : ""}</StyledTableCell>
                    <StyledTableCell>{c.net_available_limit  ? c.net_available_limit.$numberDecimal? c.net_available_limit.$numberDecimal : c.net_available_limit : ""  }</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              );
            })}
          </Table>
        </TableContainer>
        <Divider/>
        <div>
          <FormControlLabel
            style={{ float: "left", marginTop: "20px" }}
            control={
              <Checkbox checked={is_rps_by_co_lender == "Y" ? true : false} />
            }
            label="Is RPS by Colender"
            inputProps={{ readOnly: true }}
          />
          <FormControlLabel
            style={{ float: "right", marginTop: "20px" }}
            control={
              <CoLenderServiceToken
                co_lender_id = {co_lender_id}
                co_lender_shortcode = {co_lender_shortcode}
                user={user}
                defineError={errMsg => {
                  showAlert(errMsg, "error");
                }}
                type="co-lender-api"
              />
            }
            label="Api Token for Colender"
          />
        </div>
      </CardContent>
    </Grid>
  );
};

export default InfoColenders;

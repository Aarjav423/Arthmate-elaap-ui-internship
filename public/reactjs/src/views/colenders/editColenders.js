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
import { validateData } from "../../util/validation";
import {
  productTypeListWatcher,
  createColenderWatcher,
  getColenderWatcher,
  putColenderWatcher,
} from "../../actions/colenders.js";
import { useDispatch } from "react-redux";
import { AlertBox } from "../../components/AlertBox";
import product from "views/product/product";

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
]

const defaultErrors = {
  productTypeError: false,
  productPricingError: false,
  totalAllocLimitError: false,
  colenderNameError: false,
  escrowAccBenNameError: false,
  escrowAccNumError: false,
  escrowAccIfscCodeError: false,
  escrowRepaymentAccNumError: false,
  escrowRepaymentAccIfscCodeError: false,
  foreclosureShareError:false,
  lpiShareError:false
};

const EditColenders = () => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [productName, setProductName] = React.useState("");
  const [productType, setProductType] = React.useState("");
  const [productPricing, setProductPricing] = React.useState("");
  const [totalAllocLimit, setTotalAllocLimit] = useState("");
  const [netAvailLimit, setNetAvailLimit] = useState("");
  const [productTypeList, setProductTypeList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [filterArr, setFilterArr] = useState([]);
  const [errors, setErrors] = useState(defaultErrors);
  const [colenderShortCode, setColenderShortCode] = useState("");
  const [colenderName, setColenderName] = useState("");
  const [colendingShare, setColendingShare] = useState("");
  const [colenderIsRps, setColenderIsRps] = useState(true);
  const [colenderId, setColenderId] = useState("");
  const [editObj, setEditObj] = useState({});
  const [escrowAccBenName, setEscrowAccBenName] = useState ("");
  const [escrowAccNum, setEscrowAccNum] = useState("");
  const [escrowAccIfscCode, setEscrowAccIfscCode] = useState("");
  const [escrowRepaymentAccNum, setEscrowRepaymentAccNum] = useState("");
  const [escrowRepaymentAccIfscCode, setEscrowRepaymentAccIfscCode] = useState("");
  const [colendingMode, setcolendingMode] = useState("");
  const { id } = useParams();
  const [foreclosureShare,setForeclosureShare] = useState("");
  const [lpiShare,setLpiShare] = useState("");

  const showAlert = (msg, type) => {
    setAlert(true); 
    setSeverity(type); 
    setAlertMessage(msg); 
    setTimeout(()=>{handleAlertClose()},4000);
   };

  React.useEffect(() => {
    fetchColenderProfile();
  }, []);

  const fetchColenderProfile = () => {
    const payload = {
      id: id,
    };
    new Promise((resolve, reject) => {
      dispatch(getColenderWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setColenderId(response.co_lender_id);
        setColenderName(response.co_lender_name);
        setColendingShare(response.co_lending_share);
        setcolendingMode(response.co_lending_mode);
        setColenderIsRps(response.is_rps_by_co_lender == "Y" ? true : false);
        setColenderShortCode(response.co_lender_shortcode);
        setEscrowAccBenName(response.escrow_account_beneficiary_name);
        setEscrowAccNum(response.escrow_account_number);
        setEscrowAccIfscCode(response.escrow_account_ifsc_code);
        setEscrowRepaymentAccNum(response.escrow_repayment_account_number);
        setEscrowRepaymentAccIfscCode(response.escrow_repayment_account_ifsc_code)
        setForeclosureShare(response.foreclosure_share);
        setLpiShare(response.lpi_share);
        setFilterArr(response.product_types);
      })
      .catch((error) => {
        showAlert(error.response.data.message,"error")
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

  const handleAccountNumberLimit = (field,setValue) => (event) => {
    const { value } = event.target;
    if(value){
    setValue(value);
    const regex = /^(\d{9,18})$/;
    const isValidated = regex.test(value);
    setErrors({
      ...errors,
      [field + "Error"]: !isValidated,
    });
  }
  else{
    setValue(value);
    setErrors({
      ...errors,
      [field + "Error"]: false,
    });
  }
  };

  const handleIfscInput = (field,setValue) => (event) => {
    const { value } = event.target;
    if(value){
    setValue(value);
    const regex = /^[a-zA-Z]{4}[0]{1}[a-zA-Z0-9]{6}$/;
    const isValidated = regex.test(value);
    setErrors({
      ...errors,
      [field + "Error"]: !isValidated,
    });
  }
  else{
    setValue(value);
    setErrors({
      ...errors,
      [field + "Error"]: false,
    });
  }
  };

  const handleBeneficiaryNameInput = (field,setValue) => (event) => {
    const { value } = event.target;
    if(value){
    setValue(value);
    const regex = /^[a-zA-Z0-9 _.-]{0,150}$/;
    const isValidated = regex.test(value);
    setErrors({
      ...errors,
      [field + "Error"]: !isValidated,
    });
  }
  else{
    setValue(value);
    setErrors({
      ...errors,
      [field + "Error"]: false,
    });
  }
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleInputChange = (field, validationType, setValue) => (event) => {
    const { value } = event.target;
    setValue(value);
    setErrors({
      ...errors,
      [field + "Error"]: !validateData(validationType, value),
    });
  };

  const handlePadding = (setValue) => (event) => {
    const { value } = event.target;
    if (value.length != 0) {
      setValue(
        Number(value).toFixed(2) === "NaN" ? value : Number(value).toFixed(2)
      );
    }
  };

  const handleDecimalLimit = (event) => {
    const { value } = event.target;
    if (event.keyCode >= 48 && event.keyCode <= 57) {
      const regex = /^[0-9]+\.[0-9]{2}$/;
      if (regex.test(value)) {
        event.preventDefault();
      }
    }
  };

  const handleDelete = (product_type_code) => {
    const deleteRow = (item) => {
      if (item.product_type_code != product_type_code) {
        return true;
      }
      return false;
    };
    setFilterArr(filterArr.filter(deleteRow));
  };

  const handleEdit = (product_type_code) => {
    if (!(Object.keys(editObj).length === 0)) {
      showAlert("Please add the product that is edited","error")
    } else {
      const editRow = (item) => {
        if (item.product_type_code === product_type_code) {
          return true;
        }
        return false;
      };

      const productTypeObj = filterArr.find(editRow);
      setProductType(productTypeObj.product_type_code);
      setProductPricing(productTypeObj.product_pricing ? productTypeObj.product_pricing.$numberDecimal? productTypeObj.product_pricing.$numberDecimal :productTypeObj.product_pricing : "");
      setTotalAllocLimit(productTypeObj.total_allocated_limit ? productTypeObj.total_allocated_limit.$numberDecimal? productTypeObj.total_allocated_limit.$numberDecimal :productTypeObj.total_allocated_limit  : "");
      setNetAvailLimit(productTypeObj.net_available_limit  ? productTypeObj.net_available_limit.$numberDecimal? productTypeObj.net_available_limit.$numberDecimal : productTypeObj.net_available_limit : ""  );
      setEditObj(productTypeObj);
      handleDelete(product_type_code);
    }
  };

  const handleAddProduct = () => {
    if (!(Object.values(errors).indexOf(true) > -1)) {
      const found = arr.find((obj) => {
        return obj.id === 1;
      });
      const targetProductDuplicate = (item) => {
        if (item.product_type_code === productType) {
          return true;
        }
        return false;
      };
      if (!filterArr.find(targetProductDuplicate)){
         if (totalAllocLimit!="")  {
          if (productPricing!="") {
            if (netAvailLimit==""){
                const targetProduct = (item) => {
                  if (item.product_type_code === productType) {
                    return true;
                  }
                  return false;
                };
                const productObj = productTypeList.find(targetProduct);
                const addObj = {
                  product_type_code: productType,
                  total_allocated_limit: parseFloat(totalAllocLimit),
                  net_available_limit: parseFloat(totalAllocLimit),
                  product_pricing: parseFloat(productPricing),
                  product_type_name: productObj.product_type_name,
                };
                setFilterArr([...filterArr, addObj]);
                setProductType("");
                setProductPricing("");
                setNetAvailLimit("");
                setTotalAllocLimit("");
                setEditObj({});
              }
              else{
                const targetProduct = (item) => {
                  if (item.product_type_code === productType) {
                    return true;
                  }
                  return false;
                };
                const productObj = productTypeList.find(targetProduct);
                const addObj = {
                  product_type_code: productType,
                  total_allocated_limit: parseFloat(totalAllocLimit),
                  net_available_limit: parseFloat(totalAllocLimit),
                  product_pricing: parseFloat(productPricing),
                  product_type_name: productObj.product_type_name,
                };
                setFilterArr([...filterArr, addObj]);
                setProductType("");
                setProductPricing("");
                setNetAvailLimit("");
                setTotalAllocLimit("");
                setEditObj({});
              }
               }
               else{
                showAlert("Enter value in Product Pricing","error")
               }
              }
                else{
                  showAlert("Enter value in Total Allocated limit","error")
                } 
              }
      else {
          showAlert("Product type already added","error")
                  }
    }
  };

  const handleCheckBox = () => {
    setColenderIsRps(!colenderIsRps);
  };

  const handleSubmit = () => {
    if (!(Object.values(errors).indexOf(true) > -1)){ 
    if(!lpiShare){
      showAlert("Please enter lpi_share ","error")
    }
    else{
    if(!foreclosureShare){
      showAlert("Please enter foreclosure_share","error")
    }
    else{
    if (productType || productPricing || totalAllocLimit) {
      showAlert("Please add the product","error")
    } else {
      if (saving) return;
      setSaving(true);
      const payload = {
        co_lender_id: colenderId,
        co_lender_name: colenderName,
        co_lending_share: colendingShare,
        co_lending_mode: colendingMode,
        co_lender_shortcode: colenderShortCode,
        is_rps_by_co_lender: colenderIsRps == true ? "Y" : "N",
        escrow_account_number :escrowAccNum ? escrowAccNum : "-1",
        escrow_account_beneficiary_name :escrowAccBenName ? escrowAccBenName : "-1",
        escrow_account_ifsc_code :  escrowAccIfscCode ? escrowAccIfscCode.toUpperCase() : "-1",
        escrow_repayment_account_number :escrowRepaymentAccNum ? escrowRepaymentAccNum : "-1",
        escrow_repayment_account_ifsc_code :  escrowRepaymentAccIfscCode ? escrowRepaymentAccIfscCode.toUpperCase() : "-1",
        foreclosure_share : foreclosureShare,
        lpi_share : lpiShare,
        product_types: filterArr,
      };

      new Promise((resolve, reject) => {
        dispatch(putColenderWatcher(payload, resolve, reject));
      })
        .then((response) => {
          setAlert(true);
          setSeverity("success");
          setAlertMessage(response.message);
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
          setSaving(false);
          window.open(`/admin/co_lender`, "_self");
        })
        .catch((error) => {
          setAlert(true);
          setSeverity("error");
          setAlertMessage(error.response.data.message);
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
          setSaving(false);
        });
    }}}
  }}

  let arr = [];

  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
        Edit Colender
      </Typography>
      <CardContent>
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}
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
            defaultValue=""
            value={colenderId ?? ""}
            inputProps={{ readOnly: true }}
          />
          <TextField
            id="outlined-read-only-input"
            label="Colender Name"
            type="text"
            placeholder="Colender name"
            value={colenderName ?? ""}
            error={errors.colenderNameError}
            helperText={
              errors.colenderNameError ? "Enter valid Colender Name" : ""
            }
            onChange={handleInputChange(
              "colenderName",
              "alphaNeumericExtra",
              setColenderName
            )}
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Colending share
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={colendingShare ?? " "}
              label="Colending share"
              onChange={handleInputChange(
                "colendingShare",
                "number",
                setColendingShare
              )}
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
              value={colendingMode ?? " "}
              label="Colender type"
              onChange={handleInputChange(
                "colendingMode",
                "alphaNeumericExtra",
                setcolendingMode
              )}
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
            type="text"
            placeholder="Colender short code"
            value={colenderShortCode ?? ""}
            onChange={handleInputChange(
              "colenderShortCode",
              "alpha",
              setColenderShortCode
            )}
            inputProps={{
              maxLength: 4,
              style: { textTransform: "uppercase" },
              readOnly: true,
            }}
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
            value={escrowAccBenName=="-1" ? "" : escrowAccBenName}
            error={errors.escrowAccBenNameError}
            helperText={
              errors.escrowAccBenNameError ? "Enter valid  Escrow Account Beneficiary Name" : ""
            }
            onChange={handleBeneficiaryNameInput(
              "escrowAccBenName",
              setEscrowAccBenName
            )}
          />

         <TextField
            id="outlined-read-only-input"
            label="Escrow Account Number"
            placeholder="Escrow Account Number"
            value={escrowAccNum=="-1" ? "":escrowAccNum}
            error={errors.escrowAccNumError}
            helperText={
              errors.escrowAccNumError ? "Enter valid Escrow Account Number" : ""
            }
            onChange={handleAccountNumberLimit(
              "escrowAccNum",
              setEscrowAccNum
            )}
          />

          <TextField
            id="outlined-read-only-input"
            label="Escrow Account IFSC Code"
            placeholder="Escrow Account IFSC Code"
            value={escrowAccIfscCode=="-1" ? "":escrowAccIfscCode}
            error={errors.escrowAccIfscCodeError}
            helperText={
              errors.escrowAccIfscCodeError ? "Enter valid Escrow Account IFSC Code" : ""
            }
            onChange={handleIfscInput(
              "escrowAccIfscCode",
              setEscrowAccIfscCode
            )}
            inputProps={{
              minLength: 11,
              maxLength: 11,
              style: { textTransform: "uppercase" },
            }}
          />
          <TextField
            id="outlined-read-only-input"
            label="Foreclosure share"
            value={foreclosureShare}
            error={errors.foreclosureShareError}
            helperText={
              errors.foreclosureShareError
                ? "Enter valid Foreclosure share (0-100 without decimals)"
                : ""
            }
            onChange={handleInputChange(
              "foreclosureShare",
              "upto100",
              setForeclosureShare
            )}
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
            error={errors.lpiShareError}
            helperText={
              errors.lpiShareError
                ? "Enter valid LPI share (0-100 without decimals)"
                : ""
            }
            onChange={handleInputChange(
              "lpiShare",
              "upto100",
              setLpiShare
            )}
          />
          <TextField
            id="outlined-read-only-input"
            label="Escrow repayment account number"
            type="text"
            placeholder="Escrow repayment account number"
            value={escrowRepaymentAccNum=="-1" ? "":escrowRepaymentAccNum}
            error={errors.escrowRepaymentAccNumError}
            helperText={
              errors.escrowRepaymentAccNumError ? "Enter valid escrow repayment account number" : ""
            }
            onChange={handleAccountNumberLimit(
              "escrowRepaymentAccNum",
              setEscrowRepaymentAccNum
            )}
          />
          <TextField
            id="outlined-read-only-input"
            label="Escrow repayment account IFSC code"
            type="text"
            placeholder="Escrow repayment account IFSC code"
            value={escrowRepaymentAccIfscCode=="-1" ? "":escrowRepaymentAccIfscCode}
            error={errors.escrowRepaymentAccIfscCodeError}
            helperText={
              errors.escrowRepaymentAccIfscCodeError ? "Enter valid escrow repayment account IFSC code" : ""
            }
            onChange={handleIfscInput(
              "escrowRepaymentAccIfscCode",
              setEscrowRepaymentAccIfscCode
            )}
            inputProps={{
              minLength: 11,
              maxLength: 11,
              style: { textTransform: "uppercase" },
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
                <StyledTableCell align="left">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterArr.map((x, index) => {
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{x.product_type_code}</StyledTableCell>
                    <StyledTableCell>{x.product_pricing ? x.product_pricing.$numberDecimal? x.product_pricing.$numberDecimal :x.product_pricing : ""}</StyledTableCell>
                    <StyledTableCell>{x.total_allocated_limit ? x.total_allocated_limit.$numberDecimal? x.total_allocated_limit.$numberDecimal :x.total_allocated_limit  : ""}</StyledTableCell>
                    <StyledTableCell>{ x.net_available_limit  ? x.net_available_limit.$numberDecimal? x.net_available_limit.$numberDecimal : x.net_available_limit : ""  }</StyledTableCell>
                    <StyledTableCell>
                     

                      <span
                        className="action_text"
                        onClick={(e) => {
                          handleDelete(x.product_type_code);
                        }}
                        style={{ cursor: "pointer", marginRight: "10px", color: "blue" }}
                      >
                        Delete
                      </span>
                      <span
                        className="action_text"
                        onClick={(e) => {
                          handleEdit(x.product_type_code);
                        }}
                        style={{ cursor: "pointer", color: "blue" }}
                      >

                        Edit
                      </span>

                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "35ch" },
          }}
          noValidate
          autoComplete="off"
          marginTop="20px"
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Product Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={productType}
              label="Product type"
              onChange={handleInputChange(
                "productType",
                "alphaNeumeric",
                setProductType
              )}
            >
              {productTypeList.map((option, index) => (
                <MenuItem key={index} value={option.product_type_code}>
                  {option.product_type_code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="outlined-read-only-input"
            label="Product Pricing"
            value={productPricing}
            error={errors.productPricingError}
            helperText={
              errors.productPricingError
                ? "Enter valid product price (0-20)"
                : ""
            }
            onChange={handleInputChange(
              "productPricing",
              "upto20",
              setProductPricing
            )}
            onBlur={handlePadding(setProductPricing)}
            onKeyDown={handleDecimalLimit}
          />
          <TextField
            id="outlined-read-only-input"
            label="Total Allocated limit"
            value={totalAllocLimit}
            error={errors.totalAllocLimitError}
            helperText={
              errors.totalAllocLimitError
                ? "Enter valid total allocation limit (0-500cr)"
                : ""
            }
            onChange={handleInputChange(
              "totalAllocLimit",
              "upto500",
              setTotalAllocLimit
            )}
            onBlur={handlePadding(setTotalAllocLimit)}
            onKeyDown={handleDecimalLimit}
          />
        </Box>
        <Button
          style={{
            float: "right",
            backgroundColor: "#5e72e4",
            color: "#fff",
            marginRight: "auto",
            marginTop: "20px",
          }}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
        <FormGroup>
          <FormControlLabel
            style={{ float: "left", marginTop: "20px" }}
            control={<Checkbox checked={colenderIsRps} />}
            label="Is RPS by Colender"
            onClick={handleCheckBox}
          />
        </FormGroup>
        <div style={{ alignItems: "center", justifyContent: "center" }}>
          <Button
            style={{
              backgroundColor: "#5e72e4",
              color: "#fff",
              textAlign: "center",
              marginTop: "20px",
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button
            style={{
              backgroundColor: "#5e72e4",
              color: "#fff",
              marginTop: "20px",
              marginLeft: "20px",
            }}
            onClick={() => {
              window.close();
            }}
          >
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor: "#5e72e4",
              color: "#fff",
              marginTop: "20px",
              marginLeft: "20px",
            }}
            onClick={() => {
              window.location.reload();
            }}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Grid>
  );
};

export default EditColenders;

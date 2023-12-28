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
  newColenderIdWatcher,
} from "../../actions/colenders.js";
import { useDispatch } from "react-redux";
import { AlertBox } from "../../components/AlertBox";

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
  co_lender_ShortCodeError: false,
  co_lender_NameError: false,
  colendingModeError: false,
  escrowAccBeneNameError: false,
  escrowAccNumError: false,
  escrowAccIfscCodeError: false,
  escrowRepaymentAccNumError: false,
  escrowRepaymentAccIfscCodeError: false,
  foreclosureShareError:false,
  lpiShareError:false
};

const AddColenders = () => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [productType, setProductType] = useState("");
  const [productPricing, setProductPricing] = useState("");
  const [totalAllocLimit, setTotalAllocLimit] = useState("");
  const [netAvailLimit, setNetAvailLimit] = useState("");
  const [productTypeList, setProductTypeList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [filterArr, setFilterArr] = useState([]);
  const [errors, setErrors] = useState(defaultErrors);
  const [co_lender_ShortCode, setCo_lender_ShortCode] = useState("");
  const [co_lender_Name, setCo_lender_Name] = useState("");
  const [escrowAccBeneName, setescrowAccBeneName] = useState ("");
  const [escrowAccNum, setescrowAccNum] = useState("");
  const [escrowAccIfscCode, setescrowAccIfscCode] = useState("");
  const [escrowRepaymentAccNum, setEscrowRepaymentAccNum] = useState("");
  const [escrowRepaymentAccIfscCode, setEscrowRepaymentAccIfscCode] = useState("");
  const [co_lending_share, setCo_lending_share] = useState("");
  const [colendingMode, setColendingMode] = useState("");
  const [colenderIsRps, setColenderIsRps] = useState(false);
  const [co_lender_id, setColenderId] = useState("");
  const [editObj, setEditObj] = useState({});
  const [foreclosureShare,setForeclosureShare] = useState("");
  const [lpiShare,setLpiShare] = useState("");

  const showAlert = (msg, type) => {
        setAlert(true); 
        setSeverity(type); 
        setAlertMessage(msg); 
        setTimeout(()=>{handleAlertClose()},4000);
       };


  React.useEffect(() => {
    fetchNewColenderId();
  }, []);

  const fetchNewColenderId = () => {
    const payload = {};
    new Promise((resolve, reject) => {
      dispatch(newColenderIdWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setColenderId(response.co_lender_id);
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
      setProductPricing(productTypeObj.product_pricing);
      setTotalAllocLimit(productTypeObj.total_allocated_limit);
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
                  net_available_limit: parseFloat(netAvailLimit),
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
      if (productType || productPricing || totalAllocLimit) {
        showAlert("Please add the product ","error")
      } else {
        if (saving) return;
        //   if (!validate()) return;
        setSaving(true);
        const payload = {
          co_lender_id: co_lender_id,
          co_lender_name: co_lender_Name,
          co_lending_share: co_lending_share,
          co_lending_mode:colendingMode,
          co_lender_shortcode: co_lender_ShortCode.toUpperCase(),
          is_rps_by_co_lender: colenderIsRps == true ? "Y" : "N",
          escrow_account_number :escrowAccNum ? escrowAccNum : "-1",
          escrow_account_beneficiary_name :escrowAccBeneName  ? escrowAccBeneName : "-1",
          escrow_account_ifsc_code :  escrowAccIfscCode ? escrowAccIfscCode.toUpperCase() : "-1",
          escrow_repayment_account_number :escrowRepaymentAccNum ? escrowRepaymentAccNum : "-1",
          escrow_repayment_account_ifsc_code :  escrowRepaymentAccIfscCode ? escrowRepaymentAccIfscCode.toUpperCase() : "-1",
          foreclosure_share : foreclosureShare,
          lpi_share : lpiShare,
          status: "0",
          product_types: filterArr,
        };

          new Promise((resolve, reject) => {
            dispatch(createColenderWatcher(payload, resolve, reject));
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
        }
   }
 }

  let arr = [];

  return (
    <Grid item xs={12}>
      <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
        Add Co-lender
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
            value={co_lender_id ?? ""}
            inputProps={{ readOnly: true }}
          />
          <TextField
            id="outlined-read-only-input"
            label="Colender Name"
            type="text"
            placeholder="Colender name"
            value={co_lender_Name ?? ""}
            error={errors.co_lender_NameError}
            helperText={
              errors.co_lender_NameError ? "Enter valid Colender Name" : ""
            }
            onChange={handleInputChange(
              "co_lender_Name",
              "alphaNeumericExtra",
              setCo_lender_Name
            )}
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Colending share
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={co_lending_share ?? " "}
              label="Colending share"
              onChange={handleInputChange(
                "co_lending_Share",
                "number",
                setCo_lending_share
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
              value={colendingMode ?? ""}
              label="Colending Mode"
              error={errors.colendingModeError}
              onChange={handleInputChange(
                "colendingMode",
                "string",
                setColendingMode
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
            value={co_lender_ShortCode}
            error={errors.co_lender_ShortCodeError}
            helperText={
              errors.co_lender_ShortCodeError
                ? "Enter valid Short Code of four characters"
                : ""
            }
            onChange={handleInputChange(
              "co_lender_ShortCode",
              "alphaExtra",
              setCo_lender_ShortCode
            )}
            inputProps={{
              minLength: 4,
              maxLength: 4,
              style: { textTransform: "uppercase" },
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
            value={escrowAccBeneName ?? ""}
            error={errors.escrowAccBeneNameError}
            helperText={
              errors.escrowAccBeneNameError ? "Enter valid  Escrow Account Beneficiary Name" : ""
            }
            onChange={handleBeneficiaryNameInput(
              "escrowAccBeneName",
              setescrowAccBeneName
            )}
          />

         <TextField
            id="outlined-read-only-input"
            label="Escrow Account Number"
            type="text"
            placeholder="Escrow Account Number"
            value={escrowAccNum ?? ""}
            error={errors.escrowAccNumError}
            helperText={
              errors.escrowAccNumError ? "Enter valid Escrow Account Number" : ""
            }
            onChange={handleAccountNumberLimit(
              "escrowAccNum",
              setescrowAccNum
            )}
          />

          <TextField
            id="outlined-read-only-input"
            label="Escrow Account IFSC Code"
            type="text"
            placeholder="Escrow Account IFSC Code"
            value={escrowAccIfscCode ?? ""}
            error={errors.escrowAccIfscCodeError}
            helperText={
              errors.escrowAccIfscCodeError ? "Enter valid Escrow Account IFSC Code" : ""
            }
            onChange={handleIfscInput(
              "escrowAccIfscCode",
              setescrowAccIfscCode
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
            value={escrowRepaymentAccNum ?? ""}
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
            value={escrowRepaymentAccIfscCode ?? ""}
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
                    <StyledTableCell>{x.product_pricing}</StyledTableCell>
                    <StyledTableCell>{x.total_allocated_limit}</StyledTableCell>
                    <StyledTableCell>{x.net_available_limit}</StyledTableCell>
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
            style={{ float: "left" }}
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
              window.history.back();
            }}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Grid>
  );
};

export default AddColenders;

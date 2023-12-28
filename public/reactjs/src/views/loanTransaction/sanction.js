import * as React from "react";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CompanyDropdown from "../../components/BKCompany/CompanySelect";
import ProductDropdown from "../../components/BKCompany/ProductSelect";
import { validateData } from "../../util/validation";
import { setAlert } from "../../actions/common";
import { storedList } from "../../util/localstorage";
import {
  getLoanData,
  setCreditLimitWatcher,
  updateCLCreditBalanceWatcher,
} from "../../actions/clTransactions";

export default function loanSanction(props) {
  const dispatch = useDispatch();

  const defaultErrors = {
    loanIdError: false,
    sanctionAmountError: false,
  };

  const [company, setCompany] = useState();
  const [product, setProduct] = useState("");
  const [loanId, setLoanId] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(defaultErrors);
  const [appliedAmount, setAppliedAmount] = useState("");
  const [sanctionAmount, setSanctionAmount] = useState("");
  const [respSanctionAmount, setRespSanctionAmount] = useState("");
  const [showForm, setshowForm] = useState(false);

  const handleInputChange = (field, validationType, setValue) => (event) => {
    const { value } = event.target;
    setValue(value);
    setErrors({
      ...errors,
      [field + "Error"]: !validateData(validationType, value),
    });
  };

  const validate = () => {
    if (!validateData("string", loanId)) {
      setErrors({ ...defaultErrors, loanIdError: true });
      return false;
    }
    if (showForm === true) {
      if (!validateData("float", sanctionAmount)) {
        setErrors({ ...defaultErrors, sanctionAmountError: true });
        return false;
      }
    }
    return true;
  };

  const handleChangeCompany = (value) => {
    if (!value) {
      value = "";
    }
    setCompany(value ? value.value : "");
  };

  const handleChangeProduct = (value) => {
    setProduct(value ? value : "");
  };

  const handleSearch = () => {
    if (!validate()) return;
    const user = storedList("user");
    setSaving(true);
    const data = {
      company_id: company,
      product_id: product.value,
      loan_id: loanId,
      user_id: user._id,
    };
    new Promise((resolve, reject) => {
      dispatch(getLoanData(data, resolve, reject));
    })
      .then((response) => {
        const sanction = response.data.sanction_amount
          ? response.data.sanction_amount
          : response.data.applied_amount;
        setSanctionAmount(sanction);
        setRespSanctionAmount(response.data.sanction_amount);
        setshowForm(true);
      })
      .catch((error) => {
        dispatch(setAlert(false, error.response.data.message, "error"));
        setSaving(false);
      });
  };

  const handleClear = () => {
    setSanctionAmount("");
    setLoanId("");
    setAppliedAmount("");
    setshowForm(false);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const user = storedList("user");
    const data = {
      company_id: company,
      product_id: product.value,
      loan_id: loanId,
      user_id: user._id,
      limit_amount: sanctionAmount,
    };
    if (respSanctionAmount) {
      new Promise((resolve, reject) => {
        dispatch(updateCLCreditBalanceWatcher(data, resolve, reject));
      })
        .then((response) => {
          dispatch(setAlert(false, response.message, "success"));
          handleClear();
        })
        .catch((error) => {
          dispatch(setAlert(false, error.response.data.message, "error"));
          setSaving(false);
        });
    } else {
      new Promise((resolve, reject) => {
        dispatch(setCreditLimitWatcher(data, resolve, reject));
      })
        .then((response) => {
          dispatch(setAlert(false, response.message, "success"));
          handleClear();
        })
        .catch((error) => {
          dispatch(setAlert(false, error.response.data.message, "error"));
          setSaving(false);
        });
    }
  };

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Grid xs={12}>
          <h5>Loan Sanction</h5>
        </Grid>
        <Grid xs={12} container spacing={1}>
          <Grid xs={3} item sx={{ margin: "10px 0" }}>
            <CompanyDropdown
              placeholder="Select company"
              company={company}
              onCompanyChange={(value) => handleChangeCompany(value)}
            />
          </Grid>
          <Grid xs={3} sx={{ margin: "10px 0" }} item>
            <ProductDropdown
              placeholder="Select product"
              company={company}
              onProductChange={(value) => handleChangeProduct(value)}
              product={product}
            />
          </Grid>
          <Grid xs={3} item sx={{ margin: "10px 0" }}>
            <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
              <TextField
                variant="standard"
                label="loanId"
                type="string"
                value={loanId}
                error={errors.loanIdError}
                helperText={errors.loanIdError ? "loan Id is required" : ""}
                onChange={handleInputChange("loanId", "string", setLoanId)}
              />
            </FormControl>
          </Grid>
          <Grid xs={3} item sx={{ margin: "10px 0" }}>
            <IconButton
              aria-label="access-token"
              onClick={() => {
                handleSearch();
              }}
            >
              <ManageSearchIcon />
            </IconButton>
          </Grid>
        </Grid>
        {showForm ? (
          <>
            <Grid xs={12} container spacing={1}>
              <Grid xs={3} item sx={{ margin: "10px 0" }}>
                <FormControl sx={{ m: 1, width: "100%" }} variant="filled">
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label="Sanction amount"
                    type="number"
                    value={sanctionAmount}
                    error={errors.sanctionAmountError}
                    helperText={
                      errors.sanctionAmountError
                        ? "Sanction Amount is required"
                        : ""
                    }
                    onChange={handleInputChange(
                      "sanctionAmount",
                      "float",
                      setSanctionAmount
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                className="pull-right ml-4 mr-3"
                onClick={handleSubmit}
                sx={{
                  color: "#fff",
                }}
              >
                {respSanctionAmount ? "Update" : "Set"}
              </Button>
            </Grid>
          </>
        ) : null}
      </DashboardLayout>
    </>
  );
}

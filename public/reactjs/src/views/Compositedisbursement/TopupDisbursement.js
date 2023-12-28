import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Typography,
  Grid,
  TextField
} from "@mui/material";
import CompanyDropdown from "../../components/Company/CompanySelect";
import ProductDropdown from "../../components/Product/ProductSelect";
import { storedList } from "../../util/localstorage";
import {
  addTopUpDisbursement,
  getListDisbursementChannelWatcher
} from "../../actions/compositeDisbursement";
import DisbursementConfigData from "../../components/DisbursementConfig/disbursementConfigData";
import { AlertBox } from "../../components/AlertBox";

const TopupDisbursement = () => {
  const dispatch = useDispatch();
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);
  const [utrnNo, setUtrnNo] = useState("");
  const [disbursementChannelList, setDisbursementChannelList] = useState([]);
  const [amount, setAmount] = useState();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [configChannel, setConfigChannel] = useState("");

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleShowAleart = (type, message) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(message);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const handleSubmit = () => {
    const user = storedList("user");
    if (company == "" || company == undefined || company == null) {
      return handleShowAleart("error", "Company is required.");
    } else if (product == "" || product == undefined || product == null) {
      return handleShowAleart("error", "Product is required.");
    } else if (
      configChannel.value == "" ||
      configChannel.value == undefined ||
      configChannel === null
    ) {
      return handleShowAleart("error", "Disbursement Channel is required.");
    } else if (utrnNo == "" || utrnNo == undefined || utrnNo === null) {
      return handleShowAleart("error", "UtrnNo is required.");
    } else if (
      amount == "" ||
      amount == undefined ||
      amount === null ||
      amount <= 0
    ) {
      return handleShowAleart("error", "Enter valid amount.");
    }

    const data = {
      userData: {
        company_id: company.value,
        user_id: user._id,
        product_id: product.value
      },
      submitData: {
        product_id: product.value,
        company_id: company.value,
        disbursement_channel: configChannel.label,
        disbursement_channel_id: configChannel.value,
        utrn_number: utrnNo,
        amount: amount,
        txn_entry: "cr"
      }
    };

    new Promise((resolve, reject) => {
      dispatch(addTopUpDisbursement(data, resolve, reject));
    })
      .then((response) => {
        handleShowAleart("success", response.message || "Successfully Added!.");
        handleClear();
      })
      .catch((error) => {
        handleShowAleart("error", error.response.data.message);
      });
  };

  const handleGetChannelList = () => {
    const user = storedList("user");
    const data = {
      userData: {
        company_id: company?.value,
        user_id: user._id
      },
      submitData: {}
    };

    new Promise((resolve, reject) => {
      dispatch(getListDisbursementChannelWatcher(data, resolve, reject));
    })
      .then((response) => {
        setDisbursementChannelList(
          response.data?.map((record) => {
            return {
              label: record.title,
              value: record._id
            };
          })
        );
      })
      .catch((error) => {
        handleShowAleart("error", error.response.data.message);
      });
  };

  React.useEffect(() => {
    if (company) {
      handleGetChannelList();
      setProduct(null);
    }
  }, [company]);

  const handleClear = () => {
    setCompany(null);
    setProduct(null);
    setConfigChannel(null);
    setUtrnNo("");
    setAmount("");
  };

  return (
    <Grid
      xs={12}
      sx={{
        paddingTop: "10px",
        height: "100%",
        marginLeft: "1.3rem!important"
      }}
    >
      <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
        Topup disbursement channel
      </Typography>
      <Card className="mr-3">
        <CardContent>
          <Grid xs={12}>
            {alert ? (
              <AlertBox
                severity={severity}
                msg={alertMessage}
                onClose={handleAlertClose}
              />
            ) : null}
          </Grid>
          <Grid xs={12} container>
            <Grid
              xs={4}
              item
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "300px"
              }}
            >
              <Grid className="p-2" xs={12} item>
                <CompanyDropdown
                  placeholder="Select company"
                  onCompanyChange={(value) => setCompany(value)}
                  company={company ?? ""}
                />
              </Grid>
              <Grid className="p-2" xs={12} item>
                <ProductDropdown
                  placeholder="Select product"
                  product={product ?? ""}
                  company={company ?? ""}
                  onProductChange={(value) => setProduct(value)}
                />
              </Grid>
              <Grid className="p-2" xs={12} item>
                <DisbursementConfigData
                  product={product}
                  company={company}
                  updateDisbursementChannel={(configReturned) => {
                    setConfigChannel(configReturned);
                  }}
                ></DisbursementConfigData>
              </Grid>
              <Grid className="p-2" xs={12} item>
                <TextField
                  sx={{ width: 465 }}
                  id="utrn-no"
                  label="UTRN no"
                  variant="outlined"
                  value={utrnNo}
                  onChange={(e) => setUtrnNo(e.target.value)}
                />
              </Grid>
              <Grid className="p-2" xs={12} item>
                <TextField
                  sx={{ width: 465 }}
                  id="amount"
                  label="Amount"
                  variant="outlined"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActionArea>
          <Grid className="p-3" xs={12} item>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                color: "#fff"
              }}
            >
              Submit
            </Button>
            <Button
              className="ml-2"
              variant="contained"
              color="error"
              onClick={handleClear}
            >
              Clear
            </Button>
          </Grid>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default TopupDisbursement;

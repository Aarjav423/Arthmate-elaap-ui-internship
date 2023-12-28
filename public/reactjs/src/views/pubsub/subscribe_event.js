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
import { createSubscriptionEventWatcher } from "../../actions/pubsub";
import BrodcastDropdown from "../../components/Dropdowns/BrodcastDropdown";
import { isValidUrl } from "../../util/helper";
import { AlertBox } from "../../components/AlertBox";

const SubscribeEvent = () => {
  const dispatch = useDispatch();
  const [company, setCompany] = useState("");
  const [products, setProducts] = useState("");
  const [secretkey, setSecretkey] = useState("");
  const [headerkey, setHeaderkey] = useState("");
  const [selectedBrodcast, setSelectedBrodcast] = useState([]);
  const [callBackUrl, setCallBackUrl] = useState();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [urlError, setUrlError] = useState(false);

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

  const handleClear = () => {
    setCompany(null);
    setProducts(null);
    setSelectedBrodcast(null);
    setCallBackUrl("");
    setSecretkey("");
    setHeaderkey("");
    setUrlError(false);
  };

  const handleSubmit = () => {
    if (urlError) return;
    const user = storedList("user");
    if (company == "" || company == undefined || company == null) {
      return handleShowAleart("error", "Company is required.");
    } else if (products == "" || products == undefined || products == null) {
      return handleShowAleart("error", "Product is required.");
    } else if (
      selectedBrodcast.value == "" ||
      selectedBrodcast.value == undefined ||
      selectedBrodcast === null
    ) {
      return handleShowAleart("error", "Brodcast event is required.");
    } else if (
      callBackUrl == "" ||
      callBackUrl == undefined ||
      callBackUrl === null
    ) {
      return handleShowAleart("error", "callBackUrl is required.");
    } else if (
      secretkey == "" ||
      secretkey == undefined ||
      secretkey === null
    ) {
      return handleShowAleart("error", "secretkey is required.");
    } 

    const data = {
      userData: {
        company_id: company.value,
        user_id: user._id,
        product_id: products.value
      },
      submitData: {
        product_id: products?.value,
        company_id: company?.value,
        key: selectedBrodcast?.key,
        key_id: selectedBrodcast?.value,
        callback_uri: callBackUrl,
        header_key: headerkey,
        secret_key: secretkey
      }
    };

    new Promise((resolve, reject) => {
      dispatch(createSubscriptionEventWatcher(data, resolve, reject));
    })
      .then(response => {
        handleShowAleart("success", response.message || "Successfully Added!.");
        handleClear();
      })
      .catch(error => {
        handleShowAleart("error", error.response.data.message);
      });
  };

  const validateURL = value => {
    const validateurl = isValidUrl(value);
    if (validateurl) {
      setCallBackUrl(value);
      setUrlError(false);
    } else {
      setCallBackUrl(value);
      setUrlError(true);
    }
  };

  return (
    <div>
      <Grid
        xs={12}
        sx={{
          paddingTop: "10px",
          height: "100%",
          marginLeft: "1.3rem!important"
        }}
      >
        <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
          Subscribe event
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
                    onCompanyChange={value => {
                      setCompany(value);
                      setProducts([]);
                    }}
                    company={company ?? ""}
                  />
                </Grid>
                <Grid className="p-2" xs={12} item>
                  <ProductDropdown
                    placeholder="Select product"
                    product={products ?? ""}
                    company={company ?? ""}
                    onProductChange={value => {
                      setProducts(value);
                    }}
                  />
                </Grid>
                <Grid className="p-2" xs={12} item>
                  <BrodcastDropdown
                    placeholder="Select broadcast event"
                    onChange={value => setSelectedBrodcast(value)}
                    value={selectedBrodcast}
                  />
                </Grid>
                <Grid className="p-2" xs={12} item>
                  <TextField
                    sx={{ width: 465 }}
                    id="call-back-url"
                    label="Call back URL"
                    variant="outlined"
                    value={callBackUrl}
                    error={urlError}
                    helperText={urlError ? "Please enter valid url" : ""}
                    onChange={e => validateURL(e.target.value)}
                  />
                </Grid>     
                <Grid className="p-2" xs={12} item>
                  <TextField
                    sx={{ width: 465 }}
                    id="header-key"
                    label="Header Key (optional)"
                    variant="outlined"
                    value={headerkey}
                    onChange={e => setHeaderkey(e.target.value)}
                  />
                </Grid>         
                <Grid className="p-2" xs={12} item>
                  <TextField
                    sx={{ width: 465 }}
                    id="secretkey"
                    type={"password"}
                    label="Secret key"
                    variant="outlined"
                    value={secretkey}
                    onChange={e => setSecretkey(e.target.value)}
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
    </div>
  );
};

export default SubscribeEvent;

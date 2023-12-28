import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { AlertBox } from "../../components/AlertBox";
import * as React from "react";
import { useEffect, useState } from "react";
import CompanySelect from "../../components/Company/CompanySelect";
import ProductSelect from "../../components/Product/ProductSelect";
import ServiceStatusSelect from "../../components/Statuses/service-request-statuses";
import ServiceRequestTypeSelect from "../../components/Statuses/service-request-types";

import Button from "@mui/material/Button";
import { storedList } from "../../util/localstorage";
import { useSelector, useDispatch } from "react-redux";
import {
  getForeclosureOfferRequestWatcher,
  getWaiverRequestWatcher
} from "../../actions/service-request";
import ForclosureRequestsTable from "./ServiceRequestsTable";
import CardContent from "@mui/material/CardContent";
import { checkAccessTags } from "../../util/uam";
import Preloader from "../../components/custom/preLoader";

import WaiverRequests from "./WaiverRequestList";
const user = storedList("user");

const ServiceRequest = () => {
  const isLoading = useSelector((state) => state.profile.loading);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [value, setValue] = useState(0);
  const [filterdData, setFilterdData] = useState({});
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [openAction, setOpenAction] = useState();
  const [requestType, setRequestType] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [result, setResult] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const [isApiCallMade, setIsApiCallMade] = useState(false);
  const user = storedList("user");
  const dispatch = useDispatch();
  const [remarks, setRemarks] = useState();

  let isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleSearch = () => {
    if (!company) return showAlert("Please select valid company", "error");
    if (!product) return showAlert("Please select valid product", "error");
    if (!requestType)
      return showAlert("Please select service request type", "error");
    if (company && product && requestType) {
      if (requestType === "forclousure_request") {
        isTagged = true;
        isTagged
          ? checkAccessTags([
              "tag_service_request_foreclosure_read",
              "tag_service_request_foreclosure_read_write"
            ])
            ? getForeclosureServiceRequest()
            : showAlert("You have no access", "error")
          : showAlert("You have no access", "error");
      } else if (requestType === "waiver_request") {
        getWaiverServiceRequest();
      }
    }
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const getForeclosureServiceRequest = () => {
    const payload = {
      user_id: user._id,
      product_id: product.value,
      company_id: company.value,
      requestStatus: requestStatus || "all",
      requestType: requestType,
      page: page,
      limit: limit
    };
    if (product.value && company.value) {
      dispatch(
        getForeclosureOfferRequestWatcher(
          payload,
          (response) => {
            setResult(response?.data?.rows);
            setCount(response?.data?.count);
            setIsApiCallMade(true);
          },
          (error) => {
            setResult([]);
            setCount(0);
            setPage(0);
            showAlert(error?.response?.data?.message, "error");
          }
        )
      );
    }
  };

  useEffect(() => {
    if (requestType === "forclousure_request") getForeclosureServiceRequest();
    if (requestType === "waiver_request") getWaiverServiceRequest();
  }, [page]);

  const getWaiverServiceRequest = () => {
    const payload = {
      user_id: user._id,
      product_id: product.value,
      company_id: company.value,
      requestStatus: requestStatus || "undefined",
      requestType: requestType,
      page: page,
      limit: limit
    };
    if (product.value && company.value) {
      dispatch(
        getWaiverRequestWatcher(
          payload,
          (response) => {
            setResult(response?.data?.rows);
            setCount(response?.data?.count);
            setIsApiCallMade(true);
          },
          (error) => {
            setResult([]);
            setCount(0);
            setPage(0);
            showAlert(error?.response?.data?.message, "error");
          }
        )
      );
    }
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangePageWaiver = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <CardContent>
        <Grid container>
          <Grid item xs={4}>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Service request
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            display={"flex"}
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            {alert ? (
              <AlertBox
                severity={severity}
                msg={alertMessage}
                onClose={handleAlertClose}
              />
            ) : null}
          </Grid>
        </Grid>
        <Grid
          container
          spacing={1}
          mt={1}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Grid xs={3} item>
            <CompanySelect
              placeholder="Select company"
              company={company}
              onCompanyChange={(value) => {
                setCompany(value);
                setProduct("");
                setResult([]);
                setPage(0);
              }}
            />
          </Grid>
          <Grid xs={3} item>
            <ProductSelect
              placeholder="Select product"
              company={company}
              product={product}
              onProductChange={(value) => {
                setProduct(value);
                setResult([]);
                setPage(0);
              }}
            />
          </Grid>
          <Grid xs={2} item>
            <ServiceRequestTypeSelect
              accessTags={user?.access_metrix_tags}
              placeholder="Request type"
              onRequestTypeChange={(item) => {
                setRequestType(item.value);
                setResult([]);
                setPage(0);
              }}
            />
          </Grid>
          <Grid xs={2} item>
            <ServiceStatusSelect
              placeholder="Select status"
              onStatusChange={(item) => {
                setRequestStatus(item.value);
                setResult([]);
                setPage(0);
              }}
              requestType={requestType}
            />
          </Grid>

          <Grid
            item
            xs={2}
            textAlign={"center"}
            display={"flex"}
            justifyContent={"left"}
            alignItems={"center"}
          >
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>
        {}
        {result?.length && requestType === "forclousure_request" ? (
          <ForclosureRequestsTable
            data={result}
            index={0}
            value={value}
            setPage={setPage}
            count={count}
            page={page}
            handleChangePage={handleChangePage}
            remarks={remarks}
            setRemarks={setRemarks}
            showAlert={showAlert}
            getServiceRequest={getForeclosureServiceRequest}
            company={company}
            disabled={
              isTagged ? !checkAccessTags(["tag_service_requests_read"]) : false
            }
          />
        ) : result?.length && requestType === "waiver_request" ? (
          <WaiverRequests
            accessTags={user?.access_metrix_tags}
            count={count}
            page={page}
            handleChangePage={handleChangePageWaiver}
            result={result}
            company={company}
            product={product}
            isForSingleLoan={false}
          />
        ) : (
          ""
        )}
      </CardContent>
      {isLoading && <Preloader />}
    </>
  );
};

export default ServiceRequest;

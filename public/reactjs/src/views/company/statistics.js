import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, styled } from "@material-ui/core/styles";
import clsx from "clsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@material-ui/core/styles";
import componentStyles from "assets/theme/views/auth/register.js";
import componentStylesButtons from "assets/theme/components/button.js";
import ProductsDropDown from "components/Dropdowns/ProductDropDown";
import CompanySelect from "components/Company/CompanySelect";
import { validateData } from "../../util/validation";
import CardHeader from "@material-ui/core/CardHeader";
import StatisticHeader from "components/Headers/StatisticHeader";
import {
  createUserWatcher,
  userListWatcher,
  toggleUserStatusWatcher
} from "../../actions/user";
import Container from "@material-ui/core/Container";
// @material-ui/icons components
import componentStylesCardDeck from "assets/theme/components/cards/card-deck.js";
import CardMultiLine from "components/Cards/Charts/CardMultiLine";
import {
  serviceUsageFunction,
  leadFunction,
  loanFunction,
  dpdFunction,
  dailyDisbursedLoanFunction,
  leadLoanFunction
} from "variables/chartHelper";
import {
  dpd_data,
  service_data,
  loan_data,
  lead_data,
  daily_disbursed_loans_data
} from "util/data";
import {
  getCompanyDpd,
  getCompanyLeads,
  getCompanyLoanDisbursed,
  getCompanyLoans,
  getCompanyProductDpd,
  getCompanyProductLeads,
  getCompanyProductLoanDisbursed,
  getCompanyProductLoans,
  getCompanyProductServices,
  getCompanyServices
} from "../../apis/partnerAnalytics";
import { AlertBox } from "../../components/AlertBox";
import CardHistogram from "components/Cards/Charts/CardHistogram";
import CardLineHistogram from "components/Cards/Charts/CardLineHistogram";
import { stepSizeFunction } from "util/helper";

const useStyles = makeStyles(componentStyles);
const useStylesButtons = makeStyles(componentStylesButtons);
const useStylesCardDeck = makeStyles(componentStylesCardDeck);

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

const defaultErrors = {
  nameError: false,
  emailError: false,
  typeError: false,
  companyError: false,
  departmentError: false,
  userRolesError: false,
  productError: false
};

/**
 * @description Statistics Component
 * @returns
 */

const Statistics = () => {
  const classes = {
    ...useStyles(),
    ...useStylesButtons(),
    ...useStylesCardDeck()
  };
  const theme = useTheme();

  const dispatch = useDispatch();
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(defaultErrors);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [product, setProduct] = useState("");
  const [selectedCompany, setSelectedCompany] = useState({
    label: null,
    value: null
  });
  const [selectedProduct, setSelectedProduct] = useState({
    label: null,
    value: null
  });
  const [openStats, setOpenStats] = useState(false);
  const [serviceUsage, setServiceUsage] = useState({
    xAxis: [],
    yAxis: [],
    maxValue: 0,
    types: [],
    typesColor: []
  });
  const [leadLoans, setLeadLoans] = useState({
    xAxis: [],
    yAxis: [],
    maxValue: 0,
    types: [],
    typesColor: []
  });

  const [dailyDisbursedLoans, setDailyDisbursedLoans] = useState({
    xAxis: [],
    yAxis: [],
    maxValue: 0
  });

  const [dpd, setDpd] = useState({
    xAxis: [],
    xAxis2: [],
    yAxis: [],
    yAxis2: [],
    maxValue: 0,
    maxValue2: 0,
    types: [],
    typesColor: []
  });

  React.useEffect(() => {}, []);

  const handleSubmit = async () => {
    const payload = {};

    var temp_obj = {};

    setOpenStats(true);
    setSelectedCompany(company);
    setSelectedProduct(product);

    /*
    temp_obj=leadLoanFunction(lead_data,loan_data)
    setLeadLoans(temp_obj)

    temp_obj=dpdFunction(dpd_data);
    setDpd(temp_obj);

    temp_obj=serviceUsageFunction(service_data);
    setServiceUsage(temp_obj);

    temp_obj=dailyDisbursedLoanFunction(daily_disbursed_loans_data);
    setDailyDisbursedLoans(temp_obj);
    */

    if (company.value && company.value.length != 0) {
      if (product.value && product.value.length != 0) {
        const response_lead = (
          await getCompanyProductLeads(company.value, product.value)
        ).data;

        getCompanyProductLoans(company.value, product.value).then(
          (response) => {
            let res = response.data;
            temp_obj = leadLoanFunction(response_lead.data, res.data);
            setLeadLoans(temp_obj);
          }
        );

        getCompanyProductLoanDisbursed(company.value, product.value).then(
          (response) => {
            let res = response.data;
            temp_obj = dailyDisbursedLoanFunction(res.data);
            setDailyDisbursedLoans(temp_obj);
          }
        );

        getCompanyProductDpd(company.value, product.value).then((response) => {
          let res = response.data;
          temp_obj = dpdFunction(res.data);
          setDpd(temp_obj);
        });

        getCompanyProductServices(company.value, product.value).then(
          (response) => {
            let res = response.data;
            temp_obj = serviceUsageFunction(res.data);
            setServiceUsage(temp_obj);
          }
        );
      } else {
        const response_lead = (await getCompanyLeads(company.value)).data;

        getCompanyLoans(company.value).then((response) => {
          let res = response.data;
          temp_obj = leadLoanFunction(response_lead.data, res.data);
          setLeadLoans(temp_obj);
        });

        getCompanyLoanDisbursed(company.value).then((response) => {
          let res = response.data;
          temp_obj = dailyDisbursedLoanFunction(res.data);
          setDailyDisbursedLoans(temp_obj);
        });

        getCompanyDpd(company.value).then((response) => {
          let res = response.data;
          temp_obj = dpdFunction(res.data);
          setDpd(temp_obj);
        });

        getCompanyServices(company.value).then((response) => {
          let res = response.data;
          temp_obj = serviceUsageFunction(res.data);
          setServiceUsage(temp_obj);
        });
      }
    }
  };

  const handleSelectChange = (field, value, setValue, isMulti) => {
    if (field == "company") {
      setProduct("");
    }

    if (value === null) {
      setValue("");
    } else {
      setValue(value);
    }
    setErrors({
      ...errors,
      [field + "Error"]: isMulti ? !value?.length : !value
    });
  };

  const validate = () => {
    if (!validateData("string", name)) {
      setErrors({
        ...defaultErrors,
        nameError: true
      });
      return false;
    }
    if (!validateData("email", email)) {
      setErrors({
        ...defaultErrors,
        emailError: true
      });
      return false;
    }
    if (!type?.value) {
      setErrors({
        ...defaultErrors,
        typeError: true
      });
      return false;
    }
    if (type?.value === "company" && !company?.value) {
      setErrors({
        ...defaultErrors,
        companyError: true
      });
      return false;
    }
    if (!designation?.value) {
      setErrors({
        ...defaultErrors,
        designationError: true
      });
      return false;
    }
    if (!department?.length) {
      setErrors({
        ...defaultErrors,
        userRolesError: true
      });
      return false;
    }
    return true;
  };

  const handleClear = () => {
    setCompany(null);
    setName("");
    setDepartment([]);
    setDesignation([]);
    setEmail("");
    setUserRoles([]);
    setType([]);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const toggleUserStatus = (e, id) => {
    const data = {
      id: id,
      status: e.target.checked ? true : false
    };

    new Promise((resolve, reject) => {
      dispatch(toggleUserStatusWatcher(data, resolve, reject));
    })
      .then((response) => {
        setAlert(true);
        setSeverity("success");
        setAlertMessage(response.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
        fetchUserList();
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
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <StatisticHeader section="Statistics" subsection="Companies" />
      <Container
        maxWidth={false}
        component={Box}
        marginTop="-4.5rem"
        classes={{ root: classes.containerRoot }}
      >
        {/* Page content */}
        <Card classes={{ root: classes.cardRoot }}>
          <CardHeader
            title={
              <Box component="span" color={theme.palette.gray[600]}>
                {" "}
              </Box>
            }
            subheader={`${
              selectedCompany.label
                ? `${selectedCompany.label}`
                : "Select Company"
            } ${
              selectedProduct.label && selectedProduct.label.length != 0
                ? `(${selectedProduct.label})`
                : ""
            }`}
            classes={{ root: classes.cardHeaderRoot }}
            titleTypographyProps={{
              component: Box,
              variant: "h6",
              letterSpacing: "2px",
              marginBottom: "0!important",
              classes: {
                root: classes.textUppercase
              }
            }}
            subheaderTypographyProps={{
              component: Box,
              variant: "h3",
              marginBottom: "0!important",
              color: "initial"
            }}
          />
          <CardContent>
            <Grid container spacing={1} style={{ paddingTop: "2vh" }}>
              <Grid item xs={4}>
                <FormControl
                  variant="filled"
                  component={Box}
                  width="80%"
                  marginBottom="1.5rem!important"
                >
                  <CompanySelect
                    placeholder="Select company"
                    company={company}
                    onCompanyChange={(value) => {
                      handleSelectChange("company", value, setCompany, false);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl
                  variant="filled"
                  component={Box}
                  width="80%"
                  marginBottom="1.5rem!important"
                >
                  <ProductsDropDown
                    id="select-product"
                    companyId={
                      company.value && company.value.length != 0
                        ? company.value
                        : null
                    }
                    placeholder="Select product"
                    valueData={product}
                    error={errors.productError}
                    disabled={
                      company.value && company.value.length != 0 ? false : true
                    }
                    onValueChange={(value) =>
                      handleSelectChange("product", value, setProduct, false)
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <Box
                  textAlign="center"
                  marginTop="0.5rem"
                  marginBottom="1.5rem"
                >
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                      company.value && company.value.length != 0 ? false : true
                    }
                    style={{
                      width: "125px"
                    }}
                    classes={{
                      root: classes.buttonContainedInfo
                    }}
                  >
                    Open Stats
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Charts */}
        {openStats ? (
          <React.Fragment>
            <div id="lead_loan">
              <Box
                className={clsx(classes.cardDeck, classes.flexColumnFlexXlRow)}
              >
                <CardMultiLine
                  chartHeader="Leads Vs Loans"
                  xLabel="Days"
                  xAxis={leadLoans["xAxis"]}
                  yLabel="Lead/Loan Count"
                  yAxis={leadLoans["yAxis"]}
                  maxValue={leadLoans["maxValue"]}
                  types={leadLoans["types"]}
                  stepSize={stepSizeFunction(leadLoans["maxValue"])}
                  showColorLabel={true}
                  typesColor={leadLoans["typesColor"]}
                />
                {/*
            <CardLine
              chartHeader="Leads"
              toolTipLabel="Lead Count"
              xLabel="Days"
              xAxis={leads["xAxis"]}
              yLabel="No. of Leads"
              yAxis={leads["yAxis"]}
              maxValue={leads["maxValue"]}
              stepSize={10}
            />
          */}
              </Box>
              <br />
            </div>

            <div id="service_usage">
              <Box
                className={clsx(classes.cardDeck, classes.flexColumnFlexXlRow)}
              >
                <CardMultiLine
                  chartHeader="Service Usage"
                  xLabel="Months"
                  xAxis={serviceUsage["xAxis"]}
                  yLabel="Services Consumed Count"
                  yAxis={serviceUsage["yAxis"]}
                  maxValue={serviceUsage["maxValue"]}
                  types={serviceUsage["types"]}
                  stepSize={stepSizeFunction(serviceUsage["maxValue"])}
                  showColorLabel={false}
                  typesColor={serviceUsage["typesColor"]}
                />
              </Box>
              <br />
            </div>

            <div id="dpd">
              <Box
                className={clsx(classes.cardDeck, classes.flexColumnFlexXlRow)}
              >
                {/*
          <CardMultiLine
              chartHeader="DPD"
              toolTipLabel="DPD Count"
              xLabel="DPD Value"
              xAxis={dpd["xAxis2"]}
              yLabel="Amount (₹)"
              yAxis={dpd["yAxis2"]}
              maxValue={dpd["maxValue2"]}
              types={dpd["types"]}
              stepSize={30000}
              showColorLabel={true}
              typesColor={dpd["typesColor"]}
            />
        */}

                <CardLineHistogram
                  chartHeader="DPD"
                  toolTipLabel="DPD Count"
                  xLabel="DPD Value"
                  xAxis={dpd["xAxis"]}
                  yLabel1="Amount (₹)"
                  yLabel2="No of DPDs"
                  yAxis={dpd["yAxis"]}
                  maxValue={dpd["maxValue"]}
                  maxValue2={dpd["maxValue2"]}
                  types={dpd["types"]}
                  stepSize={stepSizeFunction(dpd["maxValue"])}
                  stepSize2={stepSizeFunction(dpd["maxValue2"])}
                  showColorLabel={true}
                  typesColor={dpd["typesColor"]}
                  yAxisTypes={dpd["yAxisTypes"]}
                />
              </Box>
              <br />
            </div>

            <div id="daily_disbursed_loans">
              <Box
                className={clsx(classes.cardDeck, classes.flexColumnFlexXlRow)}
              >
                <CardLineHistogram
                  chartHeader="Daily Disbursed Loans"
                  toolTipLabel="Disbursed Loan Amount"
                  xLabel="Days"
                  xAxis={dailyDisbursedLoans["xAxis"]}
                  yLabel1="Disbursement Amount (₹)"
                  yLabel2="No of disbursement"
                  yAxis={dailyDisbursedLoans["yAxis"]}
                  maxValue={dailyDisbursedLoans["maxValue"]}
                  maxValue2={dailyDisbursedLoans["maxValue2"]}
                  types={dailyDisbursedLoans["types"]}
                  stepSize={stepSizeFunction(dailyDisbursedLoans["maxValue"])}
                  stepSize2={stepSizeFunction(dailyDisbursedLoans["maxValue2"])}
                  showColorLabel={true}
                  typesColor={dailyDisbursedLoans["typesColor"]}
                  yAxisTypes={dailyDisbursedLoans["yAxisTypes"]}
                />
              </Box>
              <br />
            </div>
          </React.Fragment>
        ) : null}
      </Container>
    </>
  );
};

export default Statistics;

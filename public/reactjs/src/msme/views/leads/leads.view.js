import * as React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-sdk/dist/components/Table";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import { AlertBox } from "../../../components/CustomAlertbox";

import "react-sdk/dist/styles/_fonts.scss";

import StatusIcon from "../../components/StatusIcon/StatusIcon";
import InfoIcon from "../../../assets/img/info-circle.svg";
import { storedList } from "../../../util/localstorage";
import { getMsmeAgenciesWatcher } from "../../actions/agency.action";
import { getLoanRequestDataWatcher } from "../../../actions/loanRequest";
import { getAllCompaniesWatcher } from "../../../actions/company";
import { getProductByIdWatcher } from "../../../actions/product";
import LeadLoanLineImage from "../../../views/lending/images/newleadloanscreen.svg";
import Preloader from "../../../components/custom/preLoader";
import MsmeBasicFilter from "../../../components/Filter/msmeBasicFilter";
import useDimensions from "hooks/useDimensions";
import { checkAccessTags } from "../../../util/uam";
import DownloadMsmeFile from "../../../../../../public/reactjs/src/views/lending/DownloadMsmeFile";

import "./leads.style.css";
import moment from "moment";
import { LeadStatus } from "msme/config/LeadStatus";

const user = storedList('user');

export default function Leads(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const isLoading = useSelector((state) => state.profile.loading);
  const [responseData, setResponseData] = useState([]);

  const [count, setCount] = useState("");
  const [filter, setFilter] = useState("");
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [msmeLeadList, setMsmeLeadList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [status, setStatus] = useState("");
  const [companyGlobal, setCompanyGlobal] = useState(null);
  const [productGlobal, setProductGlobal] = useState(null);
  const [searchBy, setSearchBy] = useState("");
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const { innerWidth, innerHeight } = useDimensions();
  const styles = useStyles({ innerWidth, innerHeight });

  useEffect(() => {
    //This is a testing api. Please uncomment next line to test api. Will need a CollSuperAdmin role to access this api.
    //fetchAgencies();
    // console.log("sdv:",JSON.stringify(leadsData))
  }, []);

  const fetchAgencies = () => {
    new Promise((resolve, reject) => {
      dispatch(getMsmeAgenciesWatcher({}, resolve, reject));
    }).then((response) => {});
  };
  const getLeadList = async (filter) => {
    if (filter) {
      dispatch(
        getLoanRequestDataWatcher(
          filter,
          async (result) => {
            if (!result?.rows.length) {
              setAlert(true);
              setSeverity("error");
              setAlertMessage("No msme record found");
              setTimeout(() => {
                handleAlertClose();
              }, 4000);
            }
            setResponseData(result?.rows);
            setCount(result?.count);
            setMsmeLeadList(
              result?.rows.slice(0, rowsPerPage).map((item) => {
                item.customer_name = `${
                  item?.first_name ? item?.first_name : ""
                  } ${item?.middle_name ? item?.middle_name : ""} ${
                  item?.last_name ? item?.last_name : ""
                  }`;
                item.status = <StatusIcon status={item?.lead_status} />;
                item.action = (
                  <React.Fragment>
                    {checkAccessTags([
                      "tag_msme_lead_view_ext_read",
                      "tag_msme_lead_view_ext_read_write",
                    ]) ? (
                      <React.Fragment>
                        <Link
                          to={{
                            pathname:
                              item.lead_status === LeadStatus["new"].value
                                ? `/admin/msme/lead/${item.loan_app_id}/view`
                                // ? `/admin/msme/loans/loan_creation/${item.loan_app_id}/`
                                  : `/admin/msme/lead/${item.loan_app_id}/${
                                    item.lead_status ==
                                  LeadStatus["pending"].value ||
                                  item.lead_status ==
                                  LeadStatus["draft"].value
                                  ? "edit"
                                  : "view"
                                }`,
                            state: {
                              companyId: company?.value
                                ? company?.value
                                : item?.company_id,
                              productId: product?.value
                                ? product?.value
                                : item?.product_id,
                            },
                          }}
                        >
                          {item.lead_status == LeadStatus["pending"].value ||
                            item.lead_status == LeadStatus["draft"].value
                            ? "Resume"
                            : "View"}
                        </Link>
                      </React.Fragment>
                    ) : checkAccessTags([
                      "tag_msme_lead_view_int_read",
                      "tag_msme_lead_view_int_read_write",
                    ]) ? (
                      <Link
                        to={{
                          pathname: `/admin/msme/leads/${item.loan_app_id}`,
                          state: {
                            companyId: company?.value
                              ? company?.value
                              : item?.company_id,
                            productId: product?.value
                              ? product?.value
                              : item?.product_id,
                            lead_status: item?.lead_status,
                          },
                        }}
                      >
                        View
                      </Link>
                    ) : (
                      <div />
                    )}
                  </React.Fragment>
                );

                item.loan_amount = new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(item?.loan_amount ? item.loan_amount : 0);
                item.application_date = moment(item?.created_at).format(
                  "DD-MM-yyyy"
                );
                return item;
              })
            );
            if (result?.rows.length) {
              if (!company || !product) {
                dispatch(
                  getAllCompaniesWatcher(
                    async (companies) => {
                      const companyInRow = companies.filter(
                        (item) => item._id === result?.rows[0].company_id
                      )[0];
                      await setCompanyGlobal(companyInRow);
                      dispatch(
                        getProductByIdWatcher(
                          result?.rows[0].product_id,
                          async (productResp) => {
                            const productInRow = productResp;
                            await setProductGlobal(productInRow);
                          },
                          (productError) => { }
                        )
                      );
                    },
                    (error) => { }
                  )
                );
              }
            }
          },
          (error) => {
            setResponseData([]);
            setCount(0);
            setMsmeLeadList([]);
            setAlert(true);
            setSeverity("error");
            setAlertMessage(error?.response?.data?.message);
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          }
        )
      );
    }
  };

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_msme_lead_read", "tag_msme_lead_read_write",
      ])
    )
      getLeadList(filter);
    if (!isTagged) getLeadList(filter);
  }, [filter]);
  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const statusToDisplay = [];

  const handleStatus = (event) => {
    setStatus(event.value);
  };
  const handleAlertDownload = (msg, severity) => {
    setAlert(true);
    setSeverity(severity);
    setAlertMessage(msg);
  };

  const handleChangePage = (event, newPage) => {
    setPage(event);
    filter.page = event;
    filter.limit = rowsPerPage;
    getLeadList(filter);
  };

  const onSearchClick = (data) => {
    setCompany(data.company);
    setProduct(data?.product);
    setPage(0);
    setFilter({
      partner_id: data.company?.value || null,
      product_id: data.product?.value || null,
      from_date: data.fromDate,
      to_date: data.toDate,
      str: data.searchText,
      page: 0,
      limit: rowsPerPage,
      status: data?.product?.isLoc
        ? data?.status.value === "disbursed"
          ? "active"
          : data?.status?.value
        : data?.status?.value,
      is_msme: data.searchText,
    });
  };

  return (
    <div style={{ margin: "0px 24px 24px 24px" }}>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <div className="filter-div">
        <MsmeBasicFilter
          company={company}
          product={product}
          isLocation={true}
          onSearchClick={onSearchClick}
          isCustomDatePicker={true}
          isViewSearch={true}
          isViewFromDate={true}
          isViewToDate={true}
          mandatoryFields={{
            company: true,
            partner: true,
            product: true,
            fromDate: true,
            toDate: true,
          }}
          statusList={Object.values(LeadStatus)}
          isViewStatus={true}
          status=""
          allowGlobalSearch={true}
          globalSearchText="Lead"
        />
      </div>

      {!msmeLeadList.length && (
        <div style={styles.containerStyle}>
          <div>
            <img
              src={LeadLoanLineImage}
              alt="Loan Image"
              style={styles.imageStyle}
            />
          </div>
          <h2 style={styles.textStyle}>
            Kindly fill the above fields to get started
          </h2>
        </div>
      )}

      {msmeLeadList.length && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ display: 'flex' }}>
                <div style={{ marginRight: '20px' }}>
                  <DownloadMsmeFile checkAccessTags = {checkAccessTags} isTagged={isTagged} disabled={!msmeLeadList.length} filter={filter} company={company ? company : companyGlobal} product={product ? product : productGlobal} handleAlert={() => handleAlertDownload} />
                </div>
            </div>
          </div>
          <div style={{ marginBottom: '40px' }}>
            <Table
              customStyle={styles.tableStyle}
              customCellCss={{ width: 'fit-content', marginLeft: '5px' }}
              columns={[
                { id: 'loan_app_id', label: 'LOAN APP ID' },
                { id: 'customer_name', label: 'CUSTOMER NAME' },
                { id: 'loan_amount', label: 'LOAN AMOUNT' },
                { id: 'application_date', label: 'APPLICATION DATE' },
                { id: 'status', label: 'STATUS' },
                { id: 'action', label: 'ACTION' },
              ]}
              data={msmeLeadList}
            />
            <Pagination onPageChange={handleChangePage} totalItems={count} itemsPerPage={rowsPerPage} />
          </div>
        </>
      )}
      {isLoading && <Preloader />}
    </div>
  );
}

const useStyles = ({ innerWidth, innerHeight }) => {
  return {
    inputBoxCss: {
      marginTop: "8px",
      width: "200px",
      maxHeight: "none",
      minHeight: "330px",
      zIndex: 1,
    },
    statusInputBoxCss: {
      marginTop: "8px",
      width: "240px",
      maxHeight: "none",
      minHeight: "320px",
      zIndex: 1,
    },
    containerStyle: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "53vh",
      backgroundColor: "#F5F7FF",
      borderRadius: "35px",
      marginLeft: "15%",
      marginRight: "25%",
      marginTop: "80px",
    },
    imageStyle: {
      marginTop: "5vh",
      width: "100%",
      maxWidth: "400px",
      height: "auto",
    },
    tableStyle: {
      width: "100%",
      height: "auto",
      display: "grid",
      gridTemplateColumns: "20% 20% 16% 20% 16% 8%",
      overflowX: "hidden",
      marginLeft: "0px",
      color: "#161719",
    },
    textStyle: {
      fontSize: "20px",
      lineHeight: "48px",
      fontFamily: "Montserrat-SemiBold",
      fontWeight: "600",
      lineHeight: "150%",
      color: "#212E57",
      padding: "30px",
    },
    downloadButtonStyle: {
      width: "109px",
      height: "40px",
      border: "1px solid #475BD8",
      color: "#475BD8",
      borderRadius: "26px",
      color: "rgb(71, 91, 216)",
      fontSize: "12px",
      display: "flex",
      justifyContent: "center",
      boxShadow: "none",
      backgroundColor: "white",
    },
    searchLeadIdtext: {
      paddingLeft: "1.1em",
      fontSize: "14px",
      fontFamily: "Montserrat-Semibold",
      fontWeight: 600,
      lineHeight: "150%",
      color: "var(--neutrals-neutral-60, #767888)",
    },
  };
};

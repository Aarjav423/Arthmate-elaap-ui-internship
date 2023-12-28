import * as React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-sdk/dist/components/Button";
import Table from "react-sdk/dist/components/Table";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import List from "react-sdk/dist/components/List/List";
import ListItem from "react-sdk/dist/components/ListItem/ListItem";
import "react-sdk/dist/styles/_fonts.scss";
import useDimensions from "../../../hooks/useDimensions";
import { storedList } from "../../../util/localstorage";
import { AlertBox } from "../../../components/CustomAlertbox";
import LeadLoanLineImage from "../../../views/lending/images/newleadloanscreen.svg";
import Preloader from "../../../components/custom/preLoader";
import Img from "../../../views/lending/images/download-button.svg";
import imgH from "../../../views/lending/images/download-button-hover.svg";
import { loansData } from "./loansDataJson";
import StatusIcon from "../../components/StatusIcon/StatusIcon";
import LoanStatusIcon from "../../components/StatusIcon/LoanStatusIcon";
import "./loans.style.css";
import { LoanStatusList } from "msme/config/LoanStatus"
import DownloadLoanFiles from "../../../views/lending/DownloadLoanFiles";
import MsmeBasicFilter from "../../../components/Filter/msmeBasicFilter";
import {
  getBorrowerDetailsWatcher,
} from "../../../actions/borrowerInfo";
import { getAllCompaniesWatcher } from "../../../actions/company";
import { getProductByIdWatcher } from "../../../actions/product";
import { checkAccessTags } from "../../../util/uam";
import RepaymentDemographics from "../../../views/lending/repaymentDemographics";
import RepaymentScheduleDemographics from "../../../views/lending/repaymentScheduleDemographics";
import RepaymentScheduleListDemographics from "../../../views/lending/repaymentScheduleListDemographics";
import TransactionsHistoryList from "../../../views/lending/transactionsHistoryList";
import ChargesDemographic from "../../../views/lending/chargesDemographic";
import RefundDemographics from "../../../views/lending/RefundDemographics";
import ChargeRecordForm from "../../../views/lending/Charges/chargeRecordForm";
import StatementOfAccount from "../../../views/lending/statementOfAccount";
import StatusLogs from "../../../views/lending/StatusLogs";

const user = { _id: storedList('user')?._id, id: storedList('user')?.id };

let companyInRow = {};
let productInRow = {};

export default function Loans(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const isLoading = useSelector((state) => state.profile.loading);
  const useAsyncState = initialState => {
    const [state, setState] = useState(initialState);

    const asyncSetState = value => {
      return new Promise(resolve => {
        setState(value);

        setState(current => {
          resolve(current);

          return current;
        });
      });
    };

    return [state, asyncSetState];
  };
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [customDate, setCustomDate] = useState(true);
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [msmeLoansList, setMsmeLoansList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [status, setStatus] = useState("");
  const [companyUser, setCompanyUser] = useState(false);
  const [searchBy, setSearchBy] = useState("");
  const [showActionList, setShowActionList] = useState(false);
  const { innerWidth, innerHeight } = useDimensions();
  const styles = useStyles({ innerWidth, innerHeight });
  const [loanStatus, setLoanStatus] = useState(null);
  const [filter, setFilter] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [loanSchemaId, setLoanSchemaId] = useState("");
  const [queue, setLoanQueue] = useState([]);
  const [persistLoanQueue, setPersistLoanQueue] = useState([]);
  const [companyGlobal, setCompanyGlobal] = useAsyncState(null);
  const [productGlobal, setProductGlobal] = useAsyncState(null);
  const [selectedRow, setSelectedRow] = useState({});
  const [repaymentSchedule, setRepaymentScheduleModel] = useState(false);
  const [repaymentScheduleList, setRepaymentScheduleListModel] = useState(false);
  const [transactionHistoryList, setTransactionHistoryListModel] = useState(false);
  const [repayment, setRepaymentModel] = useState(false);
  const [refundModel, setRefundModel] = useState(false);
  const [chargeRecordModel, setChargeRecordModel] = useState(false);
  const [statementOfAccount, setStatementOfAccount] = useState(false);
  const [openStatusLogs, setOpenStatusLogs] = useState(false);
  const [OpenFeesAndCharges, setFeesAndCharges] = useState(false);
  const [openRepaymentSchedule, setOpenRepaymentSchedule] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const fetchQues = () => {
    dispatch(
      getBorrowerDetailsWatcher(
        {
          ...filter,
          searchData: searchData,
          pagination: { page: page, limit: rowsPerPage },
          is_msme: true
        },
        result => {
          if (!result?.rows?.length) {
            setLoanQueue([]);
            setPersistLoanQueue([]);
          }

          if (!company || !product) {
            dispatch(
              getAllCompaniesWatcher(
                async companies => {
                  companyInRow = companies.filter(
                    item => item._id === result?.rows[0].company_id
                  )[0];
                  await setCompanyGlobal(companyInRow);
                  dispatch(
                    getProductByIdWatcher(
                      result?.rows[0].product_id,
                      async productResp => {
                        const productInRow = productResp;
                        if (!productInRow.allow_loc) {
                          setLoanQueue(
                            result?.rows.map((item, index) => ({
                              "customer_name": `${item?.first_name ? item?.first_name : ""} ${item?.middle_name ? item?.middle_name : ""} ${item?.last_name ? item?.last_name : ""}`,
                              "loan_id": item?.loan_id,
                              "loan_app_id": item?.loan_app_id,
                              "application_date": item?.loan_app_date,
                              "loan_amount": new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(item?.sanction_amount),
                              "status": <LoanStatusIcon status={item?.status} />,
                              "company_id": item?.company_id,
                              "product_id": item?.product_id,
                            }))
                          );
                          setPersistLoanQueue(result?.rows);
                          setCount(result?.count);
                        } else {
                          showAlert("No records found", "error");
                        }
                        await setProductGlobal(productInRow);
                      },
                      productError => { }
                    )
                  );
                },
                error => { }
              )
            );
          } else {
            setLoanQueue(
              result?.rows.map((item, index) => ({
                "customer_name": `${item?.first_name ? item?.first_name : ""} ${item?.middle_name ? item?.middle_name : ""} ${item?.last_name ? item?.last_name : ""}`,
                "loan_id": item?.loan_id,
                "loan_app_id": item?.loan_app_id,
                "application_date": item?.loan_app_date,
                "loan_amount": new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(item?.sanction_amount),
                "status": <LoanStatusIcon status={item?.status} />,
                "company_id": item?.company_id,
                "product_id": item?.product_id,
                "partner_loan_id": item?.partner_loan_id
              }))
            );
            setPersistLoanQueue(result?.rows);
            setCount(result?.count);
          }
        },
        error => {
          setLoanQueue([]);
          setPersistLoanQueue([]);
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  };

  useEffect(() => {
    if (
      isTagged &&
      filter &&
      checkAccessTags(["tag_msme_loan_read", "tag_msme_loan_read_write"])
    )
      fetchQues();
    if (!isTagged && filter) fetchQues();
  }, [filter, page]);

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const statusToDisplay = [];

  const handleStatus = (event) => {
    setStatus(event.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(event);
  };

  const handleSearch = () => {
    setMsmeLoansList(
      loansData().map((item, index) => ({
        customer_name: item?.cust_name,
        loan_id: item?.loan_id,
        loan_app_id: item?.loan_app_id,
        application_date: item?.app_date,
        loan_amount: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(item?.loan_amt),
        status: <LoanStatusIcon status={item?.status} />,
        action: <Link>{item?.action}</Link>,
      }))
    );
  };
  const handleActionClick = (row) => {
        setSelectedRow(row);
    setShowActionList(!showActionList);
    // setAnchorEl(row); // Pass the row as the anchor element
    // setIsPopupOpen(true); // Open the pop-up
  };

  const handleCallback = () => {
    setShowActionList(!showActionList);
  };

  function ActionMenu() {
    const options = [
      {
        label: "Loan Details",
        disable: false,
      },
      {
        label: "Repayment",
        disable: false,
      },
      {
        label: "Repayment Schedule",
        disable: false
      },
      {
        label: "Transaction History",
        disable: false,
      },
      {
        label: "Refund",
        disable: false,
      },
      {
        label: "Settlement Offer",
        disable: false,
      },
      {
        label: "Loan Recon",
        disable: false,
      },
      {
        label: "Record Charge",
        disable: false,
      },
      {
        label: "Status Change Logs",
        disable: false,
      },
      {
        label: "Fees And Charges",
        disable: false,
      },
      {
        label: "Statement of account",
        disable: false
      },
      {
        label: "Waiver Request",
        disable: false,
      },
      {
        label: "Foreclosure Details",
        disable: false,
      },
    ];

    return (
      <>
        {showActionList ? (
          <div
            style={{
              position: "absolute",
              top: "32%",
              right: "0%",
              zIndex: 10,
            }}
          >
            <List
              open={showActionList}
              noScroll={true}
              handleCallback={handleCallback}
            >
              {options.map((option) => (
                <ListItem
                  key={option.label}
                  disabled={option.disable}
                  onClick={() => handleActionMenuItemClick(option.label)}
                >
                  {option.label}
                </ListItem>
              ))}
            </List>
          </div>
        ) : null}
      </>
    );
  }

  const handleOpenInNewPage = (url, page) => {
    window.open(`${url}`, `${page || "_self"}`);
  };

  const handleActionMenuItemClick = async (action) => {
    switch (action) {
      case "Loan Details":
        handleOpenInNewPage(
          `/admin/msme/loan_details/${selectedRow.loan_id}/${selectedRow.company_id}/${selectedRow.product_id}`
          );
          break;
      case "Repayment":
        setShowActionList(false);
                setSelectedRow(selectedRow);
        if (company?.value && product?.value) {
          companyInRow = company;
          productInRow = product;
          setRepaymentModel(true);
          break;
        }
        dispatch(
          getAllCompaniesWatcher(
            result => {
              companyInRow = result.filter(
                item => selectedRow.company_id === item._id
              )[0];
                            dispatch(
                getProductByIdWatcher(
                  selectedRow.product_id,
                  productResp => {
                    productInRow = productResp;
                    setRepaymentModel(true);
                  },
                  productError => { }
                )
              );
            },
            error => { }
          )
        );

        break;
      case "Repayment Schedule":
        setShowActionList(false);
        setSelectedRow(selectedRow);
        if (company?.value && product?.value) {
          companyInRow = company;
          productInRow = product;
          setRepaymentScheduleListModel(true);
          break;
        }
        dispatch(
          getAllCompaniesWatcher(
            result => {
              companyInRow = result.filter(() => selectedRow.company_id)[0];
              dispatch(
                getProductByIdWatcher(
                  selectedRow.product_id,
                  productResp => {
                    productInRow = productResp;
                    setRepaymentScheduleListModel(true);
                  },
                  productError => { }
                )
              );
            },
            error => { }
          )
        );
        break;
      case "Transaction History":
        setShowActionList(false);
        setSelectedRow(selectedRow);
        setTransactionHistoryListModel(true);
        break;
      case "Refund":
        setShowActionList(false);
        setSelectedRow(selectedRow);
        setRefundModel(true);
        break;
      case "Settlement Offer":
        setShowActionList(false);
        handleOpenInNewPage(
          `/admin/msme/settlement-request/${selectedRow.loan_id}/${selectedRow.company_id}/${selectedRow.product_id}`
        );
        break;
      case "Loan Recon":
        setShowActionList(false);
        handleOpenInNewPage(
          `/admin/msme/loan-recon-details/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`
        );
        break;
      case "Statement of account":
        setShowActionList(false);
        setSelectedRow(selectedRow);
        setStatementOfAccount(true);
        break;
      case "Record Charge":
        setShowActionList(false);
        setSelectedRow(selectedRow);
        if (company?.value && product?.value) {
          await setProductGlobal(product);
          await setCompanyGlobal(company);
          setChargeRecordModel(true);
          break;
        } else {
          dispatch(
            getAllCompaniesWatcher(
              async result => {
                companyInRow = result.filter(() => selectedRow.company_id)[0];
                await setCompanyGlobal(companyInRow);
                dispatch(
                  getProductByIdWatcher(
                    selectedRow.product_id,
                    async productResp => {
                      productInRow = productResp;
                      await setProductGlobal(productInRow);
                      setChargeRecordModel(true);
                    },
                    productError => { }
                  )
                );
              },
              error => { }
            )
          );
        }
        break;
      case "Status Change Logs":
        setShowActionList(false);
        setSelectedRow(selectedRow);
        setOpenStatusLogs(true);
        break;
      case "Fees And Charges":
        setShowActionList(false);
        handleOpenInNewPage(
          `/admin/msme/charges/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`
        );
        break;
      case "Waiver Request":
        setShowActionList(false);
        handleOpenInNewPage(
          `/admin/msme/waiver-request-list/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`
        );
        break;
      case "Foreclosure Details":
        setShowActionList(false);
        handleOpenInNewPage(
          `/admin/msme/foreclosure-offers-requests/${selectedRow.loan_id}/${selectedRow.company_id}/${selectedRow.product_id}`
        );
        break;
    }
  };

  const handleClose = (message, type) => {
    setRepaymentScheduleModel(false);
    setRepaymentScheduleListModel(false);
    setTransactionHistoryListModel(false);
    setRepaymentModel(false);
    if (message) {
      showAlert(message, type);
      fetchQues();
    }
  };

  const [showUploadComponent, setShowUploadComponent] = useState(false)

  const showUploadFunction = () => {
    setShowUploadComponent(true)
  }

  const onSearchClick = data => {
    const locActiveData = {
      label: "Active",
      value: "active"
    };
    setSearchData({ ...data, isLoanQueue: true });
    setCompany(data.company);
    setProduct(data?.product);
    setFromDate(data.fromDate);
    setToDate(data?.toDate);
    setLoanStatus(data?.status);
    setPage(0);
    setFilter({
      company_id: data.company?.value,
      product_id: data.product?.value,
      from_date: data.fromDate,
      to_date: data.toDate,
      str: data.searchText,
      loan_schema_id: data.product?.loan_schema_id,
      loan_status: data?.product?.isLoc
        ? data?.status.value === "disbursed"
          ? locActiveData
          : Object.keys(LoanStatusList).some(obj =>
            LoanStatusList[obj].label === data?.status?.label && LoanStatusList[obj].value === data?.status?.value
          ) ? data?.status : ""
        : Object.keys(LoanStatusList).some(obj =>
          LoanStatusList[obj].label === data?.status?.label && LoanStatusList[obj].value === data?.status?.value
        ) ? data?.status : "",
      minAmount: data?.minAmount,
      maxAmount: data?.maxAmount
    });
    setLoanSchemaId(data.product?.loan_schema_id);
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
      <ActionMenu />
      {repayment && (
        <RepaymentDemographics
          onModalClose={handleClose}
          title={
            companyInRow.lms_version === "origin_lms"
              ? "Repayment V2"
              : "Repayment"
          }
          data={selectedRow}
          loanSchemaId={loanSchemaId}
          isOriginLms={companyInRow.lms_version === "origin_lms"}
          product={product || productInRow}
          isOpen={repayment}
        />
      )}
      {refundModel ? (
        <RefundDemographics
          data={selectedRow}
          openPopup={refundModel}
          setOpenPopup={setRefundModel}
        />
      ) : null}
      {statementOfAccount ? (
        <StatementOfAccount
          data={selectedRow}
          onModalClose={handleClose}
          openDialog={statementOfAccount}
          setOpenDialog={setStatementOfAccount}
        // company={company}
        // product={product}
        />
      ) : null}
      {chargeRecordModel ? (
        <ChargeRecordForm
          data={selectedRow}
          onModalClose={handleClose}
          openDialog={chargeRecordModel}
          setOpenDialog={setChargeRecordModel}
          company={companyGlobal}
          product={productGlobal}
        />
      ) : null}
      {openStatusLogs ? (
        <StatusLogs
          data={selectedRow}
          openDialog={openStatusLogs}
          setOpenDialog={setOpenStatusLogs}
          showAlert={showAlert}
        />
      ) : null}

      {repaymentScheduleList && (
        <RepaymentScheduleListDemographics
          onModalClose={handleClose}
          title="Repayment Schedule List"
          data={selectedRow}
          loanSchemaId={loanSchemaId}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          company={companyInRow}
          product={productInRow}
        />
      )}
      {openRepaymentSchedule && (
        <RepaymentScheduleDemographics
          openPopup={openRepaymentSchedule}
          setOpenPopup={setOpenRepaymentSchedule}
          data={selectedRow}
        />
      )}
      {transactionHistoryList && (
        <TransactionsHistoryList
          onModalClose={handleClose}
          title="Transaction History"
          data={selectedRow}
          loanSchemaId={loanSchemaId}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      )}
      {OpenFeesAndCharges && (
        <ChargesDemographic
          onModalClose={handleClose}
          title="Repayment Schedule"
          data={selectedRow}
          loanSchemaId={loanSchemaId}
        />
      )}
      <div className="filter-div">
        <MsmeBasicFilter
          company={company}
          product={product}
          fromDate={fromDate}
          toDate={toDate}
          isViewSearch={true}
          isLocation={true}
          onSearchClick={onSearchClick}
          isViewFromDate={true}
          isViewToDate={true}
          isCustomDatePicker={true}
          mandatoryFields={{
            company: true,
            partner: true,
            product: true,
            fromDate: true,
            toDate: true
          }}
          statusList={Object.values(LoanStatusList)}
          isViewStatus={true}
          status={loanStatus}
          allowGlobalSearch={true}
          isLoc={false}
          pageName={"loanQueue"}
          globalSearchText="Loan"
        />
      </div>
      {!queue.length && (
        <div style={styles.containerStyle}>
          <div>
            <img
              src={LeadLoanLineImage}
              alt="Lead Image"
              style={styles.imageStyle}
            />
          </div>
          <h2 style={styles.textStyle}>
            Kindly fill the above fields to get started
          </h2>
        </div>
      )}
      {queue.length && (
        <React.Fragment>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >

            {isTagged ? (
              checkAccessTags(["tag_msme_loan_read", "tag_msme_loan_read_write"]) ? (
                <div style={{ marginRight: "10px" }}>
                  <DownloadLoanFiles
                    filter={filter}
                    searchData={searchData}
                    loanData={queue}
                    company={company ? company : companyGlobal}
                    product={product ? product : productGlobal}
                    disabled={persistLoanQueue.length ? false : true}
                    handleAleart={(error, message, type) =>
                      showAlert(
                        error?.response?.data?.message || message,
                        type
                      )
                    }
                    fromDate={fromDate}
                    toDate={toDate}
                  />
                </div>
              ) : null
            ) : (
              <div>
                <DownloadLoanFiles
                  filter={filter}
                  searchData={searchData}
                  loanData={queue}
                  company={company?.value ? company : companyGlobal}
                  product={product?.value ? product : productGlobal}
                  disabled={persistLoanQueue.length ? false : true}
                  handleAleart={(error, message, type) =>
                    showAlert(error?.response?.data?.message || message, type)
                  }
                  fromDate={fromDate}
                  toDate={toDate}
                />
              </div>
            )}

          </div>

          <div style={{ marginBottom: "40px" }}>
            <Table
              customStyle={styles.tableStyle}
              customCellCss={{ width: "fit-content", marginLeft: "5px" }}
              columns={[
                { id: "loan_id", label: "LOAN ID" },
                { id: "customer_name", label: "CUSTOMER NAME" },
                { id: "loan_app_id", label: "PARTNER LOAN ID" },
                { id: "application_date", label: "APPLICATION DATE" },
                { id: "loan_amount", label: "LOAN AMOUNT" },
                { id: "status", label: "STATUS" },
              ]}
              actions={{ handleActionClick }}
              data={queue}
              handleActionClick={handleActionClick}
            />
            <Pagination
              onPageChange={handleChangePage}
              rowsPerPageOptions={[10, 20, 30]}
              totalItems={count}
              itemsPerPage={10}
            />
          </div>
        </React.Fragment>
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
      overflowX: "hidden",
      marginLeft: "0px",
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
      fontSize: "14px",
      fontFamily: "Montserrat-Semibold",
      fontWeight: 600,
      lineHeight: "150%",
      color: "var(--neutrals-neutral-60, #767888)",
    },
  };
};

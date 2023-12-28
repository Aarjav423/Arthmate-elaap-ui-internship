import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import moment from "moment";
// import IconButton from "@mui/material/IconButton";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import BasicFilter from "../../components/Filter/basicFilter";
import RepaymentDemographics from "./repaymentDemographics";
import RepaymentScheduleDemographics from "./repaymentScheduleDemographics";
import RepaymentScheduleListDemographics from "./repaymentScheduleListDemographics";
import TransactionsHistoryList from "./transactionsHistoryList";
import ChargesDemographic from "./chargesDemographic";
import { storedList } from "../../util/localstorage";
import {
  getBorrowerDetailsWatcher,
  loanDisbursementWatcher,
  getCustomerIdWatcher
} from "../../actions/borrowerInfo";
// import { Button, Divider } from "@mui/material";
import { connect } from "react-redux";
import DownloadLoanFiles from "./DownloadLoanFiles";
// import TablePagination from "@mui/material/TablePagination";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import { loanStatusList } from "../../util/helper";
import Preloader from "../../components/custom/preLoader";
import { AlertBox } from "../../components/AlertBox";
import RefundDemographics from "./RefundDemographics";
import ChargeRecordForm from "./Charges/chargeRecordForm";
import { checkAccessTags } from "../../util/uam";
import StatusLogs from "./StatusLogs";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import StatementOfAccount from "./statementOfAccount";
import KycIncompleteScreen from "../lending/kycIncomplete";
import { getAllCompaniesWatcher } from "../../actions/company";
import { getProductByIdWatcher } from "../../actions/product";
import GenericTable from "./leadss";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import Table from "react-sdk/dist/components/Table/Table";
import List from "react-sdk/dist/components/List/List";
import ListItem from "react-sdk/dist/components/ListItem/ListItem";
// import Table from "../../../node_modules/react-sdk/dist/components/Table/Table";
import "react-sdk/dist/styles/_fonts.scss";
import LeadLoanLineImage from "./images/newleadloanscreen.svg";
import InfoIcons from "./images/info-circle.svg";

const statusToDisplay = {
  open: "Open",
  batch: "Batch",
  manual: "Manual KYC",
  kyc_data_approved: "KYC Data Approved",
  credit_approved: "Credit Approved",
  co_lender_approval_pending: "Co-Lender Approval Pending",
  disbursal_approved: "Disbursement Approved",
  disbursal_pending: "Pending Disbursal",
  disbursement_initiated: "Disbursement Initiated",
  disbursed: "Active",
  rejected: "Rejected",
  cancelled: "Cancelled",
  line_in_use: "Line in use",
  expired: "Expired",
  active: "Active",
  closed: "Closed",
  manual: "KYC Incomplete",
  foreclosed: "Foreclosed"
};

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: "#5e72e4",
//     color: theme.palette.common.black
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     color: theme.palette.common.black
//   }
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover
//   },
//   // hide last border
//   "&:last-child td, &:last-child th": {
//     border: 0
//   }
// }));

let selectedRow = {};
let companyInRow = {};
let productInRow = {};
let loanStatusListall = [...loanStatusList];

const LoanQueue = props => {
  const isLoading = useSelector(state => state.profile.loading);
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
  const history = useHistory();
  const [filter, setFilter] = useState("");
  const [queue, setLoanQueue] = useState([]);
  const [loanSchemaId, setLoanSchemaId] = useState("");
  const [repaymentSchedule, setRepaymentScheduleModel] = useState(false);
  const [repaymentScheduleList, setRepaymentScheduleListModel] =
    useState(false);

  const [transactionHistoryList, setTransactionHistoryListModel] =
    useState(false);
  const [repayment, setRepaymentModel] = useState(false);
  // const [refundModel, setRefundModel] = useState(false);
  const [chargeRecordModel, setChargeRecordModel] = useState(false);
  const dispatch = useDispatch();
  //alert
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);
  const [companyGlobal, setCompanyGlobal] = useAsyncState(null);
  const [productGlobal, setProductGlobal] = useAsyncState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [persistLoanQueue, setPersistLoanQueue] = useState([]);
  const [isNoFilterData, setIsNoFilterData] = useState(null);
  const [isOpenAdvanceSearch, setisOpenAdvanceSearch] = useState(null);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loanStatus, setLoanStatus] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const user = storedList("user");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [openStatusLogs, setOpenStatusLogs] = useState(false);
  const [OpenFeesAndCharges, setFeesAndCharges] = useState(false);
  const [showActionList, setShowActionList] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openRepaymentSchedule, setOpenRepaymentSchedule] = useState(false);
  // const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [manualKycPopUp, setManualKycPopUp] = useState(false);
  const open = Boolean(anchorEl);
  const [statementOfAccount, setStatementOfAccount] = useState(false);
  const [popUpItemData, setPopUpItemData] = useState({});

  // const [listPosition, setListPosition] = useState({ top: 32, right: 0 });
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const closePopup = () => {
    setShowActionList(false);
    // setIsPopupOpen(false);
  };
  // Add a click event listener to close the pop-up when clicking outside
  //  useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (isPopupOpen && !event.target.closest(".popup-container")) {
  //       closePopup();
  //     }
  //   };

  //   window.addEventListener("click", handleClickOutside);

  //   return () => {
  //     window.removeEventListener("click", handleClickOutside);
  //   };
  // }, [isPopupOpen]);

  const handleClick = (event, row) => {
    setSelectedRow(row);
    setShowActionList(true);
    setAnchorEl(event.currentTarget);
  };
  const handleCloseActionMenu = () => {
    setAnchorEl(null);
  };
  const fetchQues = () => {
    console.log("fetch");
    dispatch(
      getBorrowerDetailsWatcher(
        {
          ...filter,
          searchData: searchData,
          pagination: { page: page, limit: rowsPerPage }
        },
        result => {
          if (!result?.rows?.length) {
            setLoanQueue([]);
            setPersistLoanQueue([]);
          }

          if (!company?.value || !product?.value) {
            dispatch(
              getAllCompaniesWatcher(
                async companies => {
                  const companyInRow = companies.filter(
                    item => item._id === result?.rows[0].company_id
                  )[0];
                  await setCompanyGlobal(companyInRow);
                  dispatch(
                    getProductByIdWatcher(
                      result?.rows[0].product_id,
                      async productResp => {
                        const productInRow = productResp;
                        if (!productInRow.allow_loc) {
                          setLoanQueue(result?.rows);
                          setPersistLoanQueue(result?.rows);
                          setCount(result?.count);
                        } else {
                          showAlert("No records found", "error");
                        }
                        await setProductGlobal(productInRow);
                      },
                      productError => {}
                    )
                  );
                },
                error => {}
              )
            );
          } else {
            setLoanQueue(result?.rows);
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
      checkAccessTags(["tag_loan_queue_read", "tag_loan_queue_read_write"])
    )
      fetchQues();
    if (!isTagged && filter) fetchQues();
  }, [filter, page]);

  const PushDataInStatus = () => {
    loanStatusListall.push(
      {
        label: "Validation Error",
        value: "validation_error"
      },
      {
        label: "In Review",
        value: "in_review"
      }
    );

    statusToDisplay["validation_error"] = "Validation Error";
    statusToDisplay["in_review"] = "In Review";
  };
  useEffect(() => {
    if (location.pathname === props.match.path) {
      PushDataInStatus();
    }
  }, [location.pathname]);

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
    setMinAmount(data?.minAmount);
    setMaxAmount(data?.maxAmount);
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
          : loanStatusListall.some(obj =>
            obj.label === data?.status?.label && obj.value === data?.status?.value
          ) ? data?.status : ""
        : loanStatusListall.some(obj =>
          obj.label === data?.status?.label && obj.value === data?.status?.value
        ) ? data?.status : "",
      minAmount: data?.minAmount,
      maxAmount: data?.maxAmount
    });
    setLoanSchemaId(data.product?.loan_schema_id);
  };

  const handleOpenRepaymentSchedule = row => {
    setSelectedRow(row);
    setOpenRepaymentSchedule(true);
  };

  const handleOpenDocuments = (row, mode = false) => {
    if (mode) {
      window.open(
        `/admin/template/loandoclist/${row.company_id}/${row.product_id}/${row.loan_app_id}/xml`,
        "_blank"
      );
    } else {
      window.open(
        `/admin/template/loandoclist/${row.company_id}/${row.product_id}/${row.loan_app_id}/pdf`,
        "_blank"
      );
    }
  };

  function ActionMenu() {
    const options = [
      {
        label: "Loan Profile Details",
        disable: isTagged
          ? !checkAccessTags([
              "tag_loan_queue_read_write",
              "tag_loan_details_read",
              "tag_loan_details_read_write"
            ])
          : false
      },
      {
        label: "Documents",
        disable: isTagged
          ? !checkAccessTags([
              "tag_loan_queue_read_write",
              "tag_loan_documents_read",
              "tag_loan_documents_read_write"
            ])
          : false
      },
      {
        label: "Validation Doc",
        disable: isTagged
          ? !checkAccessTags([
              "tag_loan_queue_read_write",
              "tag_loan_documents_read",
              "tag_loan_documents_read_write"
            ]) ||
            selectedRow.loan_status === "rejected" ||
            selectedRow.loan_status === "cancelled"
          : selectedRow.loan_status === "rejected" ||
            selectedRow.loan_status === "cancelled"
      },
      {
        label: "Upload Repayment Schedules",
        disable: isTagged
          ? !checkAccessTags([
              "tag_upload_repayment_schedule_read_write",
              "tag_loan_queue_read_write"
            ])
          : false
      },
      {
        label: "Repayment",
        disable: isTagged
          ? !checkAccessTags([
              "tag_repayment_v2_read_write",
              "tag_loan_queue_read_write"
            ])
          : false
      },
      {
        label: "Repayment Schedule",
        disable: isTagged
          ? !checkAccessTags([
              "tag_repayment_schedule_list_read",
              "tag_repayment_schedule_export",
              "tag_loan_queue_read_write"
            ])
          : false
      },
      {
        label: "Refund",
        disable: isTagged
          ? !checkAccessTags([
              "tag_refund_request_read",
              "tag_refund_request_read_write",
              "tag_loan_queue_read_write"
            ])
          : false
      },
      {
        label: "Settlement Offer",
        disable: true
          ? !checkAccessTags([
              "tag_loan_queue_settlement_read",
              "tag_loan_queue_settlement_read_write"
            ]) || selectedRow.status !== "disbursed"
          : false
      },
      {
        label: "Statement of account",
        disable: isTagged
          ? !checkAccessTags(["tag_loan_queue_soa_read_write"]) ||
            (selectedRow.status !== "disbursed" &&
              selectedRow.status !== "closed" &&
              selectedRow.status !== "foreclosed")
          : false
      },
      {
        label: "Loan Recon",
        disable: isTagged
          ? !checkAccessTags([
              "tag_loan_recon_details_read",
              "tag_loan_queue_read_write"
            ])
          : false
      },
      {
        label: "Record Charge",
        disable: isTagged
          ? !checkAccessTags([
              "tag_apply_charge_read_write",
              "tag_loan_queue_read_write"
            ])
          : false
      },
      {
        label: "Status Change Logs",
        disable: isTagged
          ? !checkAccessTags([
              "tag_loan_queue_read_write",
              "tag_status_logs_read"
            ])
          : false
      },
      {
        label: "Fees And Charges",
        disable: isTagged
          ? !checkAccessTags([
              "tag_loan_queue_read_write",
              "tag_fees_charges_history_read"
            ])
          : false
      },
      {
        label: "Waiver Request",
        disable: isTagged
          ? !checkAccessTags([
              "tag_loan_queue_read_write",
              "tag_loan_queue_request_waiver"
            ])
          : false
      },
      {
        label: "Foreclosure Details",
        disable: isTagged
          ? !checkAccessTags(["tag_foreclosure_read_write"])
          : false
      },
      {
        label: "Force Close",
        disable: isTagged
          ? !checkAccessTags(["tag_loan_queue_force_closure_read", 'tag_loan_queue_force_closure_write'])
          : false
      },
      {
        label: "Force Cancel",
        disable: isTagged
          ? !checkAccessTags(["tag_loan_queue_force_cancel_r", 'tag_loan_queue_force_cancel_w'])
          : false
      },
    ];

    if (!product?.isLoc) {
      options.splice(5, 0, {
        label: "Transaction History",
        disable: isTagged
          ? !checkAccessTags([
              "tag_transaction_history_list_read",
              "tag_loan_queue_read_write"
            ])
          : false
      });
    } else {
      options.splice(2, 0, {
        label: "Drawdown Request",
        disable: isTagged
          ? !checkAccessTags([
              "tag_loan_queue_read_write",
              "tag_drawdown_request_read_write"
            ])
          : false
      });
      options.splice(5, 0, {
        label: "Transaction ledger",
        disable: isTagged
          ? !checkAccessTags([
              "tag_transaction_ledger_read",
              "tag_loan_queue_read_write"
            ])
          : false
      });
    }

    return (
      <>
        {/* {showActionList ? (
          <div>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button"
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseActionMenu}
              PaperProps={{
                style: {
                  width: "26ch"
                }
              }}
            >
              {options.map(option => (
                <MenuItem
                  key={option.label}
                  disabled={option.disable}
                  onClick={() => takeAction(option.label)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </div>
        ) : null} */}
        {showActionList ? (
          <div
            style={{
              position: "absolute",
              top: "32%",
              right: "0%",
              zIndex: 10
            }}
          >
            <List
              //       customStyle={{
              //         position: "absolute",
              // top: "50%", // Adjust as needed
              // right: "40%", // Adjust as needed
              // width: "240px",
              // transform: "translateY(-50%)", // Vertically center the popup
              // zIndex: 10000000
              //       }}
              open={showActionList}
              noScroll={true}
              handleCallback={handleCallback}
            >
              {options.map(option => (
                <ListItem
                  key={option.label}
                  disabled={option.disable}
                  onClick={() => takeAction(option.label)}
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

  const takeAction = async action => {
    switch (action) {
      case "Loan Profile Details":
        setShowActionList(false);
        if (company?.value) {
          companyInRow = company;
          handleOpenInNewPage(
            `/admin/loan/details/${companyInRow.lms_version}/${selectedRow.loan_id}/${selectedRow.product_id}/${selectedRow.company_id}/${filter.loan_schema_id}/1`
          );
          break;
        }
        dispatch(
          getAllCompaniesWatcher(
            result => {
              companyInRow = result.filter(
                item => item._id === selectedRow.company_id
              )[0];
              dispatch(
                getProductByIdWatcher(
                  selectedRow.product_id,
                  productResp => {
                    productInRow = productResp;
                    handleOpenInNewPage(
                      `/admin/loan/details/${companyInRow.lms_version}/${selectedRow.loan_id}/${selectedRow.product_id}/${selectedRow.company_id}/${productInRow.loan_schema_id}/1`
                    );
                  },
                  productError => {}
                )
              );
            },
            error => {}
          )
        );
        break;
      case "Documents":
        setShowActionList(false);
        handleOpenInNewPage(
          `/admin/template/loandoclist/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_app_id}/pdf`
        );
        break;
      case "Validation Doc":
        handleOpenDocuments(selectedRow, true);
        break;
      case "Upload Repayment Schedules":
        setShowActionList(false);
        handleOpenRepaymentSchedule(selectedRow);
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
                  productError => {}
                )
              );
            },
            error => {}
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
                  productError => {}
                )
              );
            },
            error => {}
          )
        );
        break;
      case "Transaction History":
        setShowActionList(false);
        setSelectedRow(selectedRow);
        setTransactionHistoryListModel(true);
        break;
      case "Transaction ledger":
        setShowActionList(false);
        handleOpenInNewPage(
          `/admin/lending/loan/drawdown_ledger/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`
        );
        break;
      case "Refund":
        setShowActionList(false);
        handleOpenInNewPage(
          `/admin/loan/refund/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`
        );
        break;
      case "Settlement Offer":
        setShowActionList(false);
        handleOpenInNewPage(
          `/admin/settlement-request/${selectedRow.loan_id}/${selectedRow.company_id}/${selectedRow.product_id}`
        );
        break;
      case "Statement of account":
        setShowActionList(false);
        setSelectedRow(selectedRow);
        setStatementOfAccount(true);
        break;
      case "Loan Recon":
        setShowActionList(false);
        handleOpenInNewPage(
          `/admin/lending/loan-recon-details/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`
        );
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
                    productError => {}
                  )
                );
              },
              error => {}
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
          `/admin/loan/charges/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`
        );
        break;
      case "Waiver Request":
        setShowActionList(false);
        handleOpenInNewPage(
          `/admin/waiver-request-list/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`
        );
        break;
      case "Foreclosure Details":
        setShowActionList(false);
        handleOpenInNewPage(
          `/admin/foreclosure-offers-requests/${selectedRow.loan_id}/${selectedRow.company_id}/${selectedRow.product_id}`
        );
        break;
        case "Force Close":
          setShowActionList(false);
          handleOpenInNewPage(`/admin/force-close/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`);
          break;
      case "Force Cancel":
        setShowActionList(false);
        handleOpenInNewPage(`/admin/force-cancellation/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`);
        break;
      case "Drawdown Request":
        setShowActionList(false);
        handleOpenInNewPage(
          `/admin/lending/loan/loc_drawdown_request/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`
        );
        break;
    }
  };

  const handleOpenRepaymentScheduleList = row => {
    selectedRow = row;
    setRepaymentScheduleListModel(true);
  };

  const handleOpenTransactionHistoryList = row => {
    selectedRow = row;
    setTransactionHistoryListModel(true);
  };

  const handleOpenRepayment = row => {
    selectedRow = row;
    setRepaymentModel(true);
  };
  const handleOpenRefundDetails = row => {
    selectedRow = row;
    setRefundModel(true);
  };
  const handleOpenSoaDetails = row => {
    selectedRow = row;
    setStatementOfAccount(true);
  };

  const handleOpenChargeRecordForm = row => {
    selectedRow = row;
    setChargeRecordModel(true);
  };

  const handleTransferMoney = row => {
    let loanObject = {};
    loanObject = {
      company_id: filter.company_id,
      company_code: filter.company_code,
      loan_schema_id: filter.loan_schema_id,
      product_id: filter.product_id,
      loan_id: row.loan_id,
      partner_loan_id: row.partner_loan_id,
      partner_borrower_id: row.partner_borrower_id,
      borrower_id: row.borrower_id,
      status: "disbursed",
      sanction_amount: row.sanction_amount,
      user_id: user._id
    };
    dispatch(
      loanDisbursementWatcher(
        loanObject,
        result => {
          fetchQues();
          return showAlert(
            `Disbursment initiated successfully for ${row.applied_amount} INR.`,
            "success"
          );
        },
        error => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
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

  const handleOpenStatusLogs = row => {
    selectedRow = row;
    setOpenStatusLogs(true);
  };

  const handleopenCloseKycIncompletePopup = () => {
    setManualKycPopUp(prevState => {
      return !prevState;
    });
  };

  useEffect(() => {
    if (props?.borrowerInfo) {
      setLoanQueue(props?.borrowerInfo?.data?.rows ?? queue);
      setPersistLoanQueue(props?.borrowerInfo?.data?.rows ?? queue);
      setCount(props?.borrowerInfo?.data?.count || count);
    }
    if (!company?.value) {
      setCompany(props?.borrowerInfo?.filter?.company);
      setProduct(props?.borrowerInfo?.filter?.product);
      setFromDate(props?.borrowerInfo?.filter?.fromDate);
      setToDate(props?.borrowerInfo?.filter?.toDate);
      setLoanStatus(props?.borrowerInfo?.filter?.status);
      setMinAmount(props?.borrowerInfo?.filter?.minAmount);
      setMaxAmount(props?.borrowerInfo?.filter?.maxAmount);
    }
  }, [props?.borrowerInfo]);

  const handleFilterData = data => {
    const filterdData = persistLoanQueue?.filter(record => {
      if (data.selectedField === "created_at") {
        return (
          moment(record[data?.selectedField]).format("YYYY-MM-DD") ===
          data.searchValue
        );
      }

      if (data.selectedField === "customer_name") {
        const name = `${record?.first_name} ${record.last_name}`;
        return name.toLowerCase() === data.searchValue.toLowerCase();
      }

      return record[data?.selectedField] === data.searchValue;
    });
    if (!filterdData.length) {
      showAlert("No Records found for search criteria.", "error");
    }
    setLoanQueue(filterdData);
  };

  const handleResetFilterData = () => {
    setLoanQueue(persistLoanQueue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(event);
  };

  const handleOpenInNewPage = (url, page) => {
    window.open(`${url}`, `${page || "_blank"}`);
  };

  const handleKycIncomplete = row => {
    setManualKycPopUp(true);
    setPopUpItemData({ ...row });
  };

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "white",
      color: "black",
      maxWidth: 260,
      fontSize: "12px",
      border: "1px solid #e5efe8",
      padding: "10px",
      fontFamily: "Montserrat-Regular",
      boxShadow: theme.shadows[2]
    }
  }));

  const handleCustomerProfilePage = (loanAppId, companyId, productId) => {
    if(isTagged && checkAccessTags(["tag_customers_read"]) ){
      let data = {
        user_id: user._id,
        company_id: companyId,
        product_id: productId,
        loan_app_id: loanAppId
      }
      new Promise((resolve, reject) => {
        dispatch(getCustomerIdWatcher(data, resolve, reject));
      })
        .then((response) => {
          let customerId = response;
          window.open(`/admin/customer/customerProfile/${customerId}`);
        })
        .catch((error) => {
          showAlert(error.response.data.message, "error");
        });
      }
  };

  const columns = [
    {
      id: "fullName",
      label: "CUSTOMER NAME",
      format: (row) => (
        <span>
          <Link onClick={() => handleCustomerProfilePage(row?.loan_app_id, row?.company_id, row?.product_id)}> {`${row?.first_name ?? ""} ${row?.last_name ?? ""}`} </Link>
        </span>
      )
    },
    { id: "loan_id", label: "LOAN ID" },
    { id: "partner_loan_id", label: "PARTNER LOAN ID" },
    {
      id: "created_at",
      label: "APPLICATION DATE",
      format: row => moment(row.created_at).format("YYYY-MM-DD")
    },
    {
      id: "product_type",
      label: "PRODUCT TYPE",
      format: row => (product?.isLoc ? "Line" : "Loan")
    },
    {
      id: "amount",
      label: product?.isLoc ? "SANCTIONED LIMIT" : "LOAN AMOUNT",
      format: row =>
        product?.isLoc
          ? new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR"
            }).format(row.limit_amount) ?? ""
          : new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR"
            }).format(row.sanction_amount)
    },
    {
      id: "status",
      label: "STATUS",
      format: row =>
        row.status === "manual" ? (
          <>
            <Tooltip
              title="Doc is Incomplete. Please click to add doc details"
              placement="top"
              arrow
            >
              <Link onClick={() => handleKycIncomplete(row)}>
                {statusToDisplay[row.status]}
              </Link>
            </Tooltip>
          </>
        ) : row.status === "validation_error" ? (
          <>
            {statusToDisplay[row.status]}
            <div>
              <HtmlTooltip
                title={
                  <div>
                    {row?.validations ? row.validations[0].remarks : ""}
                  </div>
                }
              >
                <img src={InfoIcons} alt="hello" />
              </HtmlTooltip>
            </div>
          </>
        ) : row.status === "rejected" ? (
          <>
            {statusToDisplay[row.status]}
            <div>
              <HtmlTooltip
                title={
                  <div>
                    <div>
                      <span style={{ fontFamily: "Montserrat-SemiBold" }}>
                        Rejection reason:{" "}
                      </span>
                      {row?.reason ? getReason(row.reason):""}
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      {" "}
                      <span style={{ fontFamily: "Montserrat-SemiBold" }}>
                        Rejection remark:{" "}
                      </span>{" "}
                      {row?.reason ? row.remarks : ""}
                    </div>
                    <div style={{ marginTop: "10px", color: "gray" }}>
                      {row?.reason ? row.rejected_by : ""}
                    </div>
                    <div style={{ color: "gray" }}>
                      {row?.reason
                        ? moment(row.rejection_date_time).format(
                            "DD-MM-YYYY, h:mm a"
                          )
                        : ""}
                    </div>
                  </div>
                }
              >
                <img src={InfoIcons} alt="hello" />
              </HtmlTooltip>
            </div>
          </>
        ) : (
          statusToDisplay[row.status]
        )
    }
    // No need for the "Action" column with the icon here
  ];
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    position: "absolute"
  });

  const getReason = reason => {
    let reasonData;
    try {
      reasonData = JSON.parse(reason);
      let responseCode = reasonData?.responseCode
        ? reasonData.responseCode
        : "";
      let message = reasonData?.message ? reasonData.message : "";
      return "" + responseCode + "-" + message;
    } catch (error) {
      return reason;
    }
  };

  const handleActionClick = row => {
    setSelectedRow(row);
    setShowActionList(!showActionList);
    setAnchorEl(row); // Pass the row as the anchor element
    // setIsPopupOpen(true); // Open the pop-up
  };
  const handleCallback = () => {
    setShowActionList(!showActionList);
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "53vh",
    backgroundColor: "#F5F7FF",
    borderRadius: "35px",
    marginLeft: "15%",
    marginRight: "25%",
    marginTop: "80px"
  };

  const imageStyle = {
    marginTop: "5vh",
    width: "100%",
    maxWidth: "400px",
    height: "auto"
  };

  return (
    <div>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <ActionMenu />
      {repaymentSchedule && (
        <RepaymentScheduleDemographics
          onModalClose={handleClose}
          title="Repayment Schedule"
          data={selectedRow}
          loanSchemaId={loanSchemaId}
        />
      )}
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
      <div>
        <div>
          <div
            style={{
              padding: "4px",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px"
            }}
          >
            <BasicFilter
              company={company}
              product={product}
              fromDate={fromDate}
              toDate={toDate}
              isViewSearch={true}
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
              statusList={loanStatusListall}
              isViewStatus={true}
              isViewMinAmount={true}
              isViewMaxAmount={true}
              status={loanStatus}
              minAmount={minAmount}
              maxAmount={maxAmount}
              allowGlobalSearch={true}
              isLoc={false}
              pageName={"loanQueue"}
            />
          </div>
          {queue.length ? (
            <div
              style={{
                //  padding: "20px",
                // maxWidth: "calc(100%)",
                // width:"80%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                marginTop: "32px"
                // marginRight: "0.7vw"
              }}
            >
              {isTagged ? (
                checkAccessTags(["tag_loan_queue_export"]) ? (
                  <div style={{ marginRight: "10px" }}>
                    <DownloadLoanFiles
                      filter={filter}
                      searchData={searchData}
                      loanData={queue}
                      company={company?.value ? company : companyGlobal}
                      product={product?.value ? product : productGlobal}
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
          ) : null}

          {/* {queue.length ? (
              <div>
              <div style={{ width: "1275px" , padding:"20px" }}>
                <Table
                  customStyle={{ width: "100%"  , maxWidth:"100%"}}
                  data={queue}
                  columns={columns}
                  actions={{ handleActionClick }}
                  handleActionClick={handleActionClick}
                />
                <Pagination
                  onPageChange={handleChangePage}
                  totalItems={count}
                  itemsPerPage={10}
                />
              </div>
              </div>
            ) : null} */}

          {!queue.length && (
            <div style={containerStyle}>
              <div>
                <img
                  src={LeadLoanLineImage}
                  alt="Lead Image"
                  style={imageStyle}
                />
              </div>
              <h2
                style={{
                  fontSize: "27px",
                  lineHeight: "48px",
                  fontFamily: "Montserrat-SemiBold",
                  padding: "30px"
                }}
              >
                Kindly fill the above fields to get started
              </h2>
            </div>
          )}

          {queue.length ? (
            <div style={{ padding: "8px 20px 20px 20px", maxWidth: "100%" }}>
              <Table
                customStyle={{ width: "100%" }}
                data={queue}
                columns={columns}
                actions={{ handleActionClick }}
                handleActionClick={handleActionClick}
              />
              <Pagination
                onPageChange={handleChangePage}
                totalItems={count}
                itemsPerPage={10}
              />
            </div>
          ) : null}
        </div>
      </div>
      {isLoading && <Preloader />}
      {manualKycPopUp ? (
        <KycIncompleteScreen
          reSearchFilter={fetchQues}
          setKycPopUp={handleopenCloseKycIncompletePopup}
          row_data={popUpItemData}
        />
      ) : null}
    </div>
  );
};

export default LoanQueue;

import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { styled } from "@material-ui/core/styles";
import { tableCellClasses } from "@mui/material/TableCell";
// import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import KycIncompleteScreen from "../lending/kycIncomplete"
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import BasicFilter from "../../components/Filter/basicFilter";
import { getProductByIdWatcher } from "../../actions/product";
import RepaymentDemographics from "./repaymentDemographics";
import RepaymentScheduleDemographics from "./repaymentScheduleDemographics";
import RefundDemographics from "./RefundDemographics";
import ChargeRecordForm from "./Charges/chargeRecordForm";
import RepaymentScheduleListDemographics from "./repaymentScheduleListDemographics";
import { getAllCompaniesWatcher } from "../../actions/company";
import ChargesDemographic from "./chargesDemographic";
import StatusLogs from "./StatusLogs";
import DownloadLoanFiles from "./DownloadLoanFiles";
import moment from "moment";
import {
  getBorrowerDetailsWatcher,
  loanDisbursementWatcher,
} from "../../actions/borrowerInfo";
import { loanStatusList, statusToDisplay } from "../../util/helper";
import Preloader from "../../components/custom/preLoader";
import { AlertBox } from "../../components/AlertBox";
import { checkAccessTags } from "../../util/uam";
import { storedList } from "../../util/localstorage";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DownloadLeadFiles from "./DownloadLeadFile";
import { Button, Divider } from "@mui/material";
import StatementOfAccount from "./statementOfAccount";
const user = storedList("user");
import List from "react-sdk/dist/components/List/List"
import ListItem from "react-sdk/dist/components/ListItem/ListItem"
import Pagination from "react-sdk/dist/components/Pagination/Pagination"
import Table from "react-sdk/dist/components/Table/Table"
import "react-sdk/dist/styles/_fonts.scss";
import LeadLoanLineImage from "./images/newleadloanscreen.svg"


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

let selectedRow = {};
let companyInRow = {};
let productInRow = {};

export default function LineQueue(props) {
  const isLoading = useSelector(state => state.profile.loading);
  const history = useHistory();
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
  const [filter, setFilter] = useState("");
  const [queue, setLoanQueue] = useState([]);
  const [loanSchemaId, setLoanSchemaId] = useState("");
  const [repaymentSchedule, setRepaymentScheduleModel] = useState(false);
  const [repaymentScheduleList, setRepaymentScheduleListModel] =
    useState(false);
  const [repayment, setRepaymentModel] = useState(false);
  const [refundModel, setRefundModel] = useState(false);
  const [chargeRecordModel, setChargeRecordModel] = useState(false);
  const dispatch = useDispatch();
  //alert
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [company, setCompany] = useAsyncState(null);
  const [product, setProduct] = useAsyncState(null);
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
  const [statementOfAccount, setStatementOfAccount] = useState(false);
  const [popUpItemData, setPopUpItemData] = useState({});
  const [manualKycPopUp, setManualKycPopUp] = useState(false);
  const [openRepaymentSchedule,setOpenRepaymentSchedule]=useState(false);
  const open = Boolean(anchorEl);

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const handleClick = (event, row) => {
    setSelectedRow(row);
    setShowActionList(true);
    setAnchorEl(event.currentTarget);
  };
  const handleCloseActionMenu = () => {
    setAnchorEl(null);
  };
  const fetchQues = () => {
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
                        await setProduct(productInRow);
                        await setProductGlobal(productInRow);

                        if (productInRow.allow_loc) {
                          setLoanQueue(result?.rows);
                          setPersistLoanQueue(result?.rows);
                          setCount(result?.count);
                        } else {
                          showAlert("No records found", "error");
                        }
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
          : loanStatusList.some(obj =>
            obj.label === data?.status?.label && obj.value === data?.status?.value
          ) ? data?.status : ""
        : loanStatusList.some(obj =>
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
        label: "Statement of account",
        disable: isTagged
          ? !checkAccessTags(["tag_loan_queue_soa_read_write"]) ||
            (selectedRow.status !== "line_in_use" &&
              selectedRow.status !== "closed")
          : false
      },
      {
        label: "Recon",
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
        label: "Status Logs",
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
      }
    ];
    if (product?.isLoc || product?.allow_loc) {
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
        {showActionList ? (
          <div style={{
      position: "absolute",
      top: "32%",
      right: "0%",
      zIndex: 10
    }}>
            <List
        //      customStyle={{
        //         // position: "absolute",
        //         // top: "465px",
        //         // left: "775px",
        //         // width: "240px",
        //         position: "absolute",
        // top: "50%", // Adjust as needed
        // marginRight:"190px",
        // // right: "20%", // Adjust as needed
        // width: "240px",
        // height:"800px",
        // transform: "translateY(-90%)", // Vertically center the popup
        // zIndex: 10000000
        //       }}
              // id="long-menu"
              // MenuListProps={{
              //   "aria-labelledby": "long-button"
              // }}
              // anchorEl={anchorEl}
              open={open}
              handleCallback={handleCallback}
              customStyle={{maxHeight:"800px"}}
              // onClose={handleCloseActionMenu}
              
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

  const takeAction = action => {
    switch (action) {
      case "Loan Profile Details":
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
                item => selectedRow.company_id === item._id
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
        setRepaymentScheduleListModel(true);
        break;
      case "Transaction ledger":
        handleOpenInNewPage(
          `/admin/lending/loan/drawdown_ledger/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`
        );
        break;
      case "Refund":
        setShowActionList(false);
        setSelectedRow(selectedRow);
        setRefundModel(true);
        break;
      case "Statement of account":
        setShowActionList(false);
        setSelectedRow(selectedRow);
        setStatementOfAccount(true);
        break;
      case "Recon":
        handleOpenInNewPage(
          `/admin/lending/loan-recon-details/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`
        );
        break;
      case "Record Charge":
        setShowActionList(false);
        setSelectedRow(selectedRow);
        setChargeRecordModel(true);
        break;
      case "Status Logs":
        setShowActionList(false);
        setSelectedRow(selectedRow);
        setOpenStatusLogs(true);
        break;
      case "Fees And Charges":
        handleOpenInNewPage(
          `/admin/loan/charges/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`
        );
        break;
      case "Waiver Request":
        handleOpenInNewPage(
          `/admin/loan/waiver_request/${selectedRow.company_id}/${selectedRow.product_id}/${selectedRow.loan_id}`
        );
        break;
      case "Foreclosure Details":
        handleOpenInNewPage(
          `/admin/foreclosure-offers-requests/${selectedRow.loan_id}/${selectedRow.company_id}/${selectedRow.product_id}`
        );
        break;
      case "Drawdown Request":
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
    setManualKycPopUp((prevState) => {
      return !prevState;
    })
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

  const handleKycIncomplete = (row) => {
    setManualKycPopUp(true)
    setPopUpItemData({...row})
  };

  const columns = [
    {
      id: "fullName",
      label: "CUSTOMER NAME",
      format: (row) => `${row?.first_name ?? ""} ${row?.last_name ?? ""}`
    },
    { id: "loan_id", label: "LOAN ID" },
    { id: "partner_loan_id", label: "PARTNER LOAN ID" },
    {
      id: "created_at",
      label: "DATE",
      format: (row) => moment(row.created_at).format("YYYY-MM-DD")
    },
    {
      id: "product_type",
      label: "AVAILABLE LIMIT",
      format: (row) => (row.loc_available_balance >= 0
        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(row.loc_available_balance)
        : "NA")
    },
    {
      id: "amount",
      label: "CREDIT LIMIT",
      format: (row) => (row.loc_credit_limit
        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(row.loc_credit_limit) : "NA" )
    },
    {
      id: "status",
      label: "STATUS",
      format: (row) =>
        row.status === "manual" ? (
          <Tooltip
            title="Doc is Incomplete. Please click to add doc details"
            placement="top"
            arrow
          >
            <Link onClick={() => handleKycIncomplete(row)}>
              {statusToDisplay[row.status]}
            </Link>
          </Tooltip>
        ) : (
          statusToDisplay[row.status]
        )
    }
    // No need for the "Action" column with the icon here
  ];
  const handleCallback = () =>{
    setShowActionList(!showActionList);
  }

  const handleActionClick = (row) => {
    setSelectedRow(row);
    setShowActionList(!showActionList);
    setAnchorEl(row); // Pass the row as the anchor element
    // setIsPopupOpen(true); // Open the pop-up
    handleCallback()
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '53vh',
    backgroundColor: '#F5F7FF',
    borderRadius:"35px",
    marginLeft:"15%",
    marginRight:"25%",
    marginTop:"80px"
  };

  const imageStyle = {
    marginTop:"5vh",
    width: '100%',
    maxWidth: '400px',
    height: 'auto',
  };

  return (
    <div>
      {/* <div> */}
          {alert ? (
            <AlertBox
              severity={severity}
              msg={alertMessage}
              onClose={handleAlertClose}
            />
          ) : null}
        <ActionMenu />
      {/* </div> */}
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
        />
      ) : null}
      {chargeRecordModel ? (
        <ChargeRecordForm
          data={selectedRow}
          onModalClose={handleClose}
          openDialog={chargeRecordModel}
          setOpenDialog={setChargeRecordModel}
          company={company}
          product={product}
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
          title="Repayment schedule list"
          data={selectedRow}
          loanSchemaId={loanSchemaId}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          company={company}
          product={product}
        />
      )}
      {openRepaymentSchedule&&<RepaymentScheduleDemographics openPopup={openRepaymentSchedule} setOpenPopup={setOpenRepaymentSchedule} data={selectedRow} />}
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
                toDate: true
              }}
              statusList={loanStatusList}
              isViewStatus={true}
              status=""
              allowGlobalSearch={true}
              isLoc={true}
              pageName={"lineQueue"}
            />
          </div>

          {queue.length ? (
          <div
           style={{display:"flex" , justifyContent:"flex-end" , alignItems:"flex-end" , maxWidth: "100%" , marginRight:"1.3vw"}}>
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
                      showAlert(error?.response?.data?.message || message, type)
                    }
                    fromDate={fromDate}
                    toDate={toDate}
                  />
                </div>
              ) : null
            ) : (
              <div style={{ marginRight: "10px" }}>
                <DownloadLeadFiles
                  filter={filter}
                  company={company?.value ? company : companyGlobal}
                  product={product?.value ? product : productGlobal}
                  handleAlert={() => handleAlertDownload}
                />
              </div>
            )}
          </div>) : ""}

          { !(queue.length) && <div style={containerStyle}>
    <div>
      <img src={LeadLoanLineImage} alt="Lead Image" style={imageStyle} />
    </div>
    <h2 style={{fontSize:"27px" , lineHeight:"48px" , fontFamily:"Montserrat-SemiBold", padding:"30px"}}>Kindly fill the above fields to get started</h2>
  </div>}


          {queue.length ? (
  <div style={{ padding: "20px", maxWidth: "100%"}}>
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

          {/* {queue.length ? (
            <Grid xs={12}>
              {isTagged ? (
                checkAccessTags([
                  "tag_loan_queue_read",
                  "tag_loan_queue_read_write"
                ]) ? (
                  <TableContainer
                    sx={{
                      mt: 4
                    }}
                    component={Paper}
                  >
                    <Table
                      sx={{
                        minWidth: 700
                      }}
                      aria-label="customized table"
                      id="pdf"
                    >
                      <TableHead>
                        <TableRow>
                          <StyledTableCell> Customer name </StyledTableCell>
                          <StyledTableCell> Loan ID </StyledTableCell>
                          <StyledTableCell> Partner Loan ID </StyledTableCell>
                          <StyledTableCell> Date </StyledTableCell>
                          <StyledTableCell> Available limit </StyledTableCell>
                          <StyledTableCell> Credit limit </StyledTableCell>
                          <StyledTableCell> Status </StyledTableCell>
                          <StyledTableCell> Action </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {queue &&
                          queue.map(item => (
                            <StyledTableRow key={item._id}>
                              <StyledTableCell scope="row">
                                {`${item?.first_name ?? ""} ${
                                  item?.last_name ?? ""
                                }`}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {item?.loan_id}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {item?.partner_loan_id}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {moment(item.created_at).format("YYYY-MM-DD")}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                {item.loc_available_balance >= 0
                                  ? item.loc_available_balance
                                  : "NA"}
                              </StyledTableCell>

                              <StyledTableCell scope="row">
                               {item?.loc_credit_limit ||"NA"}  
                              </StyledTableCell>

                              <StyledTableCell scope="row">
                                {item.status == "manual" ? (
                                  <Tooltip
                                    title="Doc is Incomplete. Please click to add doc details"
                                    placement="top"
                                    arrow
                                  >
                                    <Link
                                      onClick={event => {
                                        handleKycIncomplete(item);
                                      }}
                                    >
                                      {statusToDisplay[item.status]}
                                    </Link>
                                  </Tooltip>
                                ) : (
                                  statusToDisplay[item.status]
                                )}
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                <Tooltip title="Actions" placement="top" arrow>
                                  <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    color="primary"
                                    aria-controls={
                                      open ? "long-menu" : undefined
                                    }
                                    aria-expanded={open ? "true" : undefined}
                                    aria-haspopup="true"
                                    onClick={event => handleClick(event, item)}
                                  >
                                    <MoreVertIcon />
                                  </IconButton>
                                </Tooltip>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                      </TableBody>
                    </Table>
                    {count ? (
                      <TablePagination
                        component="div"
                        count={count}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[10]}
                      />
                    ) : null}
                  </TableContainer>
                ) : null
              ) : (
                <TableContainer
                  sx={{
                    mt: 4
                  }}
                  component={Paper}
                >
                  <Table
                    sx={{
                      minWidth: 700
                    }}
                    aria-label="customized table"
                    id="pdf"
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell> Customer name </StyledTableCell>
                        <StyledTableCell> Loan ID </StyledTableCell>
                        <StyledTableCell> Partner Loan ID </StyledTableCell>
                        <StyledTableCell> Date </StyledTableCell>
                        <StyledTableCell> Available limit </StyledTableCell>
                        <StyledTableCell> Credit limit </StyledTableCell>
                        <StyledTableCell> Status </StyledTableCell>
                        <StyledTableCell> Action </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {queue &&
                        queue.map(item => (
                          <StyledTableRow key={item._id}>
                            <StyledTableCell scope="row">
                              {`${item?.first_name ?? ""} ${
                                item?.last_name ?? ""
                              }`}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item?.loan_id}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item?.partner_loan_id}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {moment(item.created_at).format("YYYY-MM-DD")}
                            </StyledTableCell>

                            <StyledTableCell scope="row">
                              {item.loc_available_balance >= 0
                                ? item.loc_available_balance
                                : "NA"}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              {item?.loc_credit_limit ||"NA"}  
                            </StyledTableCell>

                            <StyledTableCell scope="row">
                              {item.status == "manual" ? (
                                <Tooltip
                                  title="Doc is Incomplete. Please click to add doc details"
                                  placement="top"
                                  arrow
                                >
                                  <Link
                                    onClick={event => {
                                      handleKycIncomplete(item);
                                    }}
                                  >
                                    {statusToDisplay[item.status]}
                                  </Link>
                                </Tooltip>
                              ) : (
                                statusToDisplay[item.status]
                              )}
                            </StyledTableCell>
                            <StyledTableCell scope="row">
                              <Tooltip title="Actions" placement="top" arrow>
                                <IconButton
                                  aria-label="more"
                                  id="long-button"
                                  color="primary"
                                  aria-controls={open ? "long-menu" : undefined}
                                  aria-expanded={open ? "true" : undefined}
                                  aria-haspopup="true"
                                  onClick={event => handleClick(event, item)}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                              </Tooltip>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                  {count ? (
                    <TablePagination
                      component="div"
                      count={count}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      rowsPerPageOptions={[10]}
                    />
                  ) : null}
                </TableContainer>
              )}
            </Grid>
          ) : null} */}
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
}

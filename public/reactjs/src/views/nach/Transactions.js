import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../colendingLoans/view.css";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import { verifyDateAfter1800 } from "../../util/helper";
import moment from "moment";
import Button from "react-sdk/dist/components/Button";
import Table from "react-sdk/dist/components/Table";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import { storedList } from "../../util/localstorage";
import SelectCompany from "../../components/Company/SelectCompany";
import CustomDatePicker from "../../components/DatePicker/datePickerCustom";
import { enachDetailsTransactionWatcher } from "../../../src/actions/enachTransaction"
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import "react-sdk/dist/styles/_fonts.scss";
import UploadPopup from "react-sdk/dist/components/Popup/UploadPopup";
import { AlertBox } from "../../components/CustomAlertbox";
import { Link } from "react-router-dom";
import LeadLoanLineImage from "../lending/images/newleadloanscreen.svg";
import { checkAccessTags } from "../../util/uam";
import PresentmentCreation from "./PresentmentPopupComponent";
import Preloader from "../../components/custom/preLoader";
import CustomizeTemplates from "../loanSchema/templateTabs";
import RefreshIcon from "../lending/images/RefresgIcon.svg";
import InfoIncon from "../lending/images/info-circle.svg"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import { downloadPresentmentFileWatcher, batchTransactionDataWatcher, uploadPresentmentFileWatcher } from '../../actions/batchTransaction';

const user = storedList("user");

const Transactions = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.profile.loading);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [customDate, setCustomDate] = useState(true);
  const [company, setCompany] = useState(user?.type === 'company' ? { label: user?.company_name, value: user?.company_id } : "");
  const [nachDetails, setNachDetails] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [status, setStatus] = useState("");
  const [companyUser, setCompanyUser] = useState(user?.type === 'company');
  const [searchBy, setSearchBy] = useState("");
  const [isSearchBy, setIsSearchBy] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState("");
  const [link, setLink] = useState("");
  const [pageType, setPageType] = useState("All Transactions");
  const [selectedRow, setSelectedRow] = useState({});
  const [company_id_subscription, setCompany_id_subscription] = useState("");
  const history = useHistory();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [allowedFileType, setAllowedFileType] = useState(".csv");
  const [saving, setSaving] = useState(false);
  const [batchPage, setBatchPage] = useState(0);
  const [batchRowsPerPage, setBatchRowsPerPage] = useState(10);
  const [batchCount, setBatchCount] = useState(0);
  const [batchTransactionData, setBatchTransactionData] = useState([]);
  const [viewTransaction, setViewTransaction] = useState(false);
  const [rowPresentment, setRowPresentment] = useState();
  const [searchKey, setSearchKey] = useState("");

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'white',
      color: "black",
      maxWidth: 180,
      fontSize: "12px",
      border: '1px solid #e5efe8',
      padding: "10px",
      fontFamily: "Montserrat-Regular",
      boxShadow: theme.shadows[2]
    },
  }));

  const [presentmentData, setPresentmentData] = useState({
    scheduledOndate: null,
    amount: null,
    remark: "",
    UMRN: "",
    registrationID: ""
  });

  const getBatchTransactionData = (page, rowsPerPage) => {
    const payload = {
      user_id: user._id,
      company_id: company?.value,
      fromDate: fromDate,
      toDate: toDate,
      page: page,
      limit: rowsPerPage,
      fileType: 'nach_presentment'
    };
    new Promise((resolve, reject) => {
      dispatch(batchTransactionDataWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setBatchCount(response?.count);
        setBatchTransactionData(response?.data);
        if (!response?.count) showAlert("No data found", "error");
      })
      .catch((error) => {
        showAlert(error.response.data.message, "error");
      });
  };

  const handleFileChange = event => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    setFile(event.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      setFileBase64(reader.result);
    };
    setFileName(fileObj.name);
    event.target.value = null;
  };

  const handleUpload = () => {
    const data = {
      user_id: user._id,
      company_id: company?.value,
      base64: fileBase64.toString(),
      file_type: "nach_presentment",
      file_code: "0",
      file_name: fileName,
      file_extension_type: 'csv',
    };
    new Promise((resolve, reject) => {
      dispatch(uploadPresentmentFileWatcher(data, resolve, reject));
    })
      .then(() => {
        showAlert("File uploaded", "success");
        setSaving(false);
        setOpenDialog(!openDialog);
        setIsUploadOpen(!isUploadOpen);
        setFileBase64("");
        setFile(null);
        setFileName("");
        getBatchTransactionData(0, batchRowsPerPage);
      })
      .catch(error => {
        showAlert(error.response.data.message, "error");
        setSaving(false);
        setFileBase64("");
        setFile(null);
        setFileName("");
      });
  };

  const handleClose = () => {
    setOpenDialog(!openDialog);
    setIsUploadOpen(!isUploadOpen);
    setFileBase64("");
    setFile(null);
    setFileName("");
  };


  const renderUploadFile = () => (
    <UploadPopup
      heading="Upload File"
      isOpen={isUploadOpen}
      onClose={handleClose}
      customStyles={{
        height: "100vh",
        position: "absolute",
        width: "543px",
        right: 0,
        top: 0,
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
      accept={allowedFileType}
      onUpload={handleUpload}
      onFileSelect={handleFileChange}
      filename={fileName}
    >
    </UploadPopup>
  )

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  useEffect(() => {
    let filterPage = page;
    if (searchBy) filterPage = 1;
    fetchNachDetails(filterPage, rowsPerPage);
  }, [page, rowsPerPage, searchBy]);

  useEffect(() => {
    if (pageType == "Batch Transactions") getBatchTransactionData(batchPage, batchRowsPerPage);
  }, [batchPage, batchRowsPerPage]);

  const statusMappings = { "S": "Success", "F": "Failed", "I": "In Progress" }
  const uniqueValues = [...new Set(Object.values(statusMappings))];
  const statusToDisplay = uniqueValues?.map((value) => ({
    label: value,
    value: Object.keys(statusMappings).filter(
      (key) => statusMappings[key] === value
    )
  }));

  const showAlert = (msg, type, data, link) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setData(data);
    setLink(link);
    if (data || link) {
      handleSearch();
    }
    if (!data || !link) {
      setTimeout(() => {
        handleAlertClose();
      }, 3000);
    }
  };

  useEffect(() => {
    if (!isOpen && viewTransaction) {
      window.open(`/admin/transactions-details/${rowPresentment}`);
      setViewTransaction(false);
    }
    else {
      setViewTransaction(false);
    }
  }, [isOpen, viewTransaction])

  const handleViewTransaction = (presentmentTxnId) => {
    setViewTransaction(true);
    setRowPresentment(presentmentTxnId);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
    setData("");
    setLink("");
  };

  const handleChangePage = (event) => {
    setPage(event+1);
  };

  const handleBatchChangePage = (event, newPage) => {
    setBatchPage(event);
    getBatchTransactionData(event, batchRowsPerPage);
  };

  const inputBoxCss = {
    marginTop: "8px",
    width: "200px",
    maxHeight: "none",
    minHeight: "330px",
    zIndex: 1
  };

  const statusInputBoxCss = {
    marginTop: "8px",
    width: "200px",
    maxHeight: "none",
    minHeight: "320px",
    zIndex: 1
  };


  const handleStatus = (event) => {
    setStatus(event.value[0]);
  };

  const fetchNachDetails = (page, rowsPerPage, isSearchByLocal = false) => {
    const payload = {
      status: status,
      rows_per_page: rowsPerPage,
      page: page,
      user_id: user._id,
      from_date: fromDate,
      to_date: toDate,
      company_id: company?.value,
      search_by: searchBy
    };
    new Promise((resolve, reject) => {
      dispatch(enachDetailsTransactionWatcher(payload, resolve, reject));
    })
      .then(response => {
        setNachDetails(response?.data["data-lst"].map((item, index) => ({
          'PRE TXN ID': item?.presentment_txn_id,
          'TXN ID': <span style={{ marginLeft: "-24px" }}>
            {item?.presentment_txn_id}{" "}
          </span>,
          request_id : item?.request_id,
          'mandateId': item?.external_ref_num,
          'VALID TILL': moment(item?.created_at).format(
            "YYYY-MM-DD"
          ),
          'scheduledOn': moment(item?.scheduled_on).format(
            "YYYY-MM-DD"
          ),
          'amount': new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item?.amount),
          'txnUtrNumber': item?.txn_reference ? item.txn_reference : "NA",
          'TXN DATE & TIME': item?.txn_reference_datetime ? moment(item?.txn_reference_datetime).format("DD-MM-YYYY") + ", "  +item?.txn_reference_datetime.slice(11, 16) : "NA",
          'status': <>{item?.txn_status === 'F' ?
              <div>
                <div style={{ display: "flex" }}>
                  <div style={handleStatusCss(item?.txn_status || "I")}>
                    {statusMappings[item?.txn_status || "I"]}
                  </div>
                  <HtmlTooltip
                    title={
                      <div>{item?.reason_description ? `${item?.reason_code}-${item?.reason_description}` : item?.txn_error_msg }</div>
                    }
                  >
                  <img style={{ marginLeft: "8px", cursor: "pointer" }} src={InfoIncon} alt="hello" />
                </HtmlTooltip>
                </div>
                {!item.retry && checkAccessTags(["tag_nach_portal_transactions_all_transactions_rw"]) ? <div style={{ color: "black", marginTop: "3px" }}>
                  <img onClick={() => {
                    setSelectedRow(item)
                    handleOpenRetryPresentmentPopup(item);
                    setCompany_id_subscription(item.company_id)
                    setIsOpen(true)
                  }} style={{ cursor: "pointer", marginLeft: "3px" }} className="RefreshIcon" src={RefreshIcon} alt="hi" /> <span style={{ fontSize: "12px" }}> Represent</span>
                </div> : <div></div>}
              </div> : <div style={handleStatusCss(item?.txn_status || "I")}>{statusMappings[item?.txn_status || "I"]}</div>}</>
        })));
        setIsSearchBy(isSearchByLocal)
        setCount(response?.count)
        if (!response?.count) showAlert("No data found", "error");
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message || "Error while fetching details", "error");
        setNachDetails([])
      });
  }

  const handleStatusCss = (status) => {
    let content;
    switch (status) {
      case 'I':
        content = {
          color: "#DB8400",
          backgroundColor: "#FFF5E6",
          height: "22px",
          fontSize: "12px",
          border: "1px solid #DB8400",
          borderRadius: "2px",
          display: "flex",
          justifyContent: "center",
          padding: "5px",
          textAlign: "center",
          alignItems: "center",
        }
        break;
      case 'S':
        content = {
          color: "#008042",
          backgroundColor: "#EEFFF7",
          height: "22px",
          fontSize: "12px",
          border: "1px solid #008042",
          borderRadius: "2px",
          display: "flex",
          justifyContent: "center",
          padding: "5px",
          textAlign: "center",
          alignItems: "center",
        }
        break;
      case 'F':
        content = {
          color: "#B30000",
          backgroundColor: "#FFECEC",
          height: "22px",
          fontSize: "12px",
          border: "1px solid #B30000",
          borderRadius: "2px",
          display: "flex",
          justifyContent: "center",
          padding: "5px",
          textAlign: "center",
          alignItems: "center",
          maxWidth: "60px"
        }
        break;
      default:
        content = {}
        break;
    }
    return content
  }

  const handleFileDownload = (id) => {
    let data = {
      id: id,
      user_id: user._id,
      company_id: company?.value,
    }
    new Promise((resolve, reject) => {
      dispatch(downloadPresentmentFileWatcher(data, resolve, reject));
    })
      .then((response) => {
        window.open(response, '_blank');
      })
      .catch((error) => {
        showAlert(error.response.data.message, "error");
      });
  };

  const handleSearch = () => {
    if (searchBy) {
      fetchNachDetails(1, rowsPerPage, true);
    } else {
      fetchNachDetails(page, rowsPerPage);
      getBatchTransactionData(batchPage, batchRowsPerPage);
    }
  };


  const changeActiveTab = (tabName) => {
    const tabClickHandlers = {
      "all transactions": handleDetails,
      "batch transactions": handleDocuments
    };
    const tabClickHandler = tabClickHandlers[tabName];

    if (tabClickHandler) {
      tabClickHandler();
    }
  };

  const handleDocuments = () => {
    setPageType("Batch Transactions");
    getBatchTransactionData(0, batchRowsPerPage);
  };

  const handleDetails = () => {
    setPageType("All Transactions");
  };


  const AllTransactioncolumns = [
    {
      id: "TXN ID",
      label: <span style={{ marginLeft: "-24px" }}>{"TXN ID"}</span>,
    },
    {
      id : "request_id",
      label: "REG ID",
      format : (item) => item.request_id
    },
    { id: "mandateId", label: "EXT REF NO." },

    {
      id: "VALID TILL",
      label: "CREATED ON",
    },
    { id: "scheduledOn", label: "SCHEDULED ON" },
    { id: "amount", label: "AMOUNT" },
    { id: "txnUtrNumber", label: "TXN REF NO." },
    {
      id: "TXN DATE & TIME",
      label: "TXN DATE & TIME",
    },
    {
      id: "status",
      label: <div>STATUS</div>,
    }
  ]

  const BatchTransactioncolumns = [
    {
      id: "REQUEST ID",
      label: <span style={{ marginLeft: "-24px" }}>{"FILE NAME"}</span>,
      format: (row) => (
        <span style={{ marginLeft: "-24px" }}>
          <Link onClick={() => handleFileDownload(row._id)}> {row.file_name} </Link>
        </span>
      )
    },
    {
      id: "VALID TILL",
      label: "UPLOAD DATE",
      format: (row) =>
        moment(row.created_at).format(
          "DD-MM-YYYY"
        )
    },
    { id: "created_by", label: "UPLOADED BY" },
    { id: "total_records", label: "RECORDS" },
    { id: "total_success_records", label: (<div style={{ fontSize: "14px" }}>SUCCESSFUL <br /> RECORDS</div>) },
    { id: "total_failure_records", label: (<div style={{ fontSize: "14px" }}>FAILED <br /> RECORDS</div>) },
    { id: "validation_status", label: "FILE STATUS" },
    { id: "record_status", label: "RECORD STATUS" },
    {
      id: "status",
      label: <div>STATUS</div>,
      format: (row) => row.remarks ?
        <div>  <HtmlTooltip
          title={row.remarks}
        >
          <img style={{ marginLeft: "8px", cursor: "pointer" }} src={InfoIncon} alt="hello" />
        </HtmlTooltip> </div> : ""
    }
  ];

  const handleOpenRetryPresentmentPopup = (row) => {
    setSelectedRow(row);
    setIsOpen(true);
    setCompany_id_subscription(row?.company_id)
    setPresentmentData((prevState) => ({
      ...prevState,
      UMRN: row?.mandate_id,
      subscriptionId: row?.request_id,
      amount: row?.amount,
      remark: row?.txn_error_msg,
      scheduledOn: row.scheduled_on,
      oldTxnId : row.presentment_txn_id
    }));
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '53vh',
    backgroundColor: '#F5F7FF',
    borderRadius: "35px",
    marginLeft: "15%",
    marginRight: "25%",
    marginTop: "80px"
  };
  const imageStyle = {
    marginTop: "5vh",
    width: '100%',
    maxWidth: '400px',
    height: 'auto',
  };

  return (
    <>
      {isOpen ?
        <PresentmentCreation
          isEdit={true}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          presentmentData={presentmentData}
          setPresentmentData={setPresentmentData}
          company_id_subscription={company_id_subscription}
          page={page}
          rowstxnHistoryPerPage={rowsPerPage}
          reload={fetchNachDetails}
        />
        : null}
      {isUploadOpen ? renderUploadFile() : null}
      <div style={{ margin: "0px 24px 24px 24px" }} >
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
            data={data}
            link={link}
          />
        ) : null}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "20px"
          }}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            <SelectCompany
              placeholder="Company"
              company={company}
              onCompanyChange={(value) => {
                setIsSearchBy(false)
                setCompany(value);
              }}
              isDisabled={companyUser}
              customStyle={inputBoxCss}
              height="56px"
              width="200px"
            />
            <CustomDatePicker
              placeholder="Duration"
              width="200px"
              onDateChange={(date) => {
                if (date.state == "custom") {
                  setCustomDate(false);
                  setFromDate("");
                  setToDate("");
                } else {
                  setCustomDate(true);
                  setFromDate(date.fromDate);
                  setToDate(date.toDate);
                }
              }}
            />
            {!customDate ? (
              <BasicDatePicker
                placeholder="From date"
                value={fromDate || null}
                onDateChange={(date) => {
                  setFromDate(
                    verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                      ? moment(date).format("YYYY-MM-DD")
                      : date
                  );
                }}
                style={{ width: "200px", borderRadius: "8px" }}
              />
            ) : null}
            {!customDate ? (
              <BasicDatePicker
                placeholder={"To date"}
                value={toDate || null}
                onDateChange={(date) => {
                  setToDate(
                    verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                      ? moment(date).format("YYYY-MM-DD")
                      : date
                  );
                  if (date === null) {
                  }
                }}
                style={{ width: "200px", borderRadius: "8px" }}
              />
            ) : null}
            {pageType == "All Transactions" ? (
            <InputBox
              label="Select Status"
              isDrawdown={true}
              options={statusToDisplay}
              onClick={(event) => handleStatus(event)}
              customClass={{ width: "200px", height: "58px" }}
              customDropdownClass={statusInputBoxCss}
            />
            ) : null}
            <Button
              buttonType="primary"
              label="Search"
              customStyle={{
                width: "145px",
                height: "56px",
                padding: "13px 44px",
                borderRadius: "8px",
                fontSize: "16px"
              }}
              onClick={() => {
                if (searchBy) {
                  setSearchBy("");
                  setSearchKey("");
                } else {
                  handleSearch();
                }
              }}
            />
          </div>
          <div>
            {pageType == "Batch Transactions" && isTagged && checkAccessTags(["tag_nach_portal_transactions_batch_txn_read_write"]) ? (
              <Button
                buttonType="primary"
                label="Upload File"
                customStyle={{
                  width: "140px",  
                  height: "48px",   
                  padding: "0px",   
                  borderRadius: "8px",   
                  fontSize: "14px"   
                }}
                onClick={() => {
                  setIsUploadOpen(!isUploadOpen)
                  setOpenDialog(!openDialog)
                }}
              />
            ) : null}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ marginLeft: "-21.5px" }}>
            <CustomizeTemplates
              templatesdata={["All Transactions", "Batch Transactions"]}
              initialState={"All Transactions"}
              onIndexChange={changeActiveTab}
            />
          </span>
          {pageType == "All Transactions" ? (
            <div>
              <InputBox
                label="Search by Txn ID, Reg ID, Ext Ref No., Txn Ref No."
                isDrawdown={false}
                initialValue={searchKey}
                onClick={(event) => {
                  if(event.target && searchKey) {
                    setSearchBy(searchKey);
                  } else {
                    setSearchKey(event.value);
                    if (event.value === "") setSearchBy("");
                  }
                }}
                isSearch={true}
                customClass={{
                  width: "450px",
                  maxWidth: "none",
                  height: "56px",
                  borderRadius: "72px",
                  fontFamily: "Montserrat-Regular"
                }}
                customInputClass={{
                  maxWidth: "none",
                  width: "430px",
                  marginLeft: "5px"
                }}
              />
            </div>
          ) : null}
        </div>

        <div>
          <div>
            {pageType == "All Transactions" && nachDetails.length ? (
              <>
                <Table
                  customStyle={{
                    display: "grid",
                    gridTemplateColumns: "15% 14% 14% 8% 9% 5.5% 14.5% 13% 10%",
                    fontFamily: 'Montserrat-Medium',
                    overflow: "hidden",
                    width: "100%",
                    wordBreak: "break-all"
                  }}
                  data={nachDetails}
                  columns={AllTransactioncolumns}
                  rowClickFunction={handleViewTransaction}
                  rowClickValue={"PRE TXN ID"}
                />
                <Pagination
                  itemsPerPage={rowsPerPage}
                  totalItems={count}
                  rowsPerPageOptions={[10, 20, 30]}
                  onPageChange={handleChangePage}
                  showOptions={true}
                  setRowLimit={setRowsPerPage} />
              </>
            ) : pageType == "All Transactions" && (!nachDetails.length) ? (
              <>
                <div style={containerStyle}>
                  <div>
                    <img src={LeadLoanLineImage} alt="Lead Image" style={imageStyle} />
                  </div>
                  <h2 style={{ fontSize: "27px", lineHeight: "48px", fontFamily: "Montserrat-SemiBold", padding: "30px" }}>Kindly fill the above fields to get started</h2>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <div>
            {pageType == "Batch Transactions" && batchTransactionData.length > 0 && isTagged && checkAccessTags(["tag_nach_portal_transactions_batch_txn_read", "tag_nach_portal_transactions_batch_txn_read_write"]) ? (
              <div>
                <Table
                  customStyle={{
                    display: "grid",
                    gridTemplateColumns: "16% 13% 14% 9% 9% 9% 11% 11% 8%",
                    fontFamily: 'Montserrat-Medium',
                    overflow: "hidden",
                    width: "100%"
                  }}
                  data={batchTransactionData}
                  columns={BatchTransactioncolumns}
                />
                <Pagination
                  itemsPerPage={batchRowsPerPage}
                  totalItems={batchCount}
                  rowsPerPageOptions={[10, 20, 30]}
                  setRowLimit={setBatchRowsPerPage}
                  onPageChange={handleBatchChangePage}
                  showOptions={true} />
              </div>
            ) : pageType == "Batch Transactions" && (!batchTransactionData.length) ? (
              <>
                <div style={containerStyle}>
                  <div>
                    <img src={LeadLoanLineImage} alt="Lead Image" style={imageStyle} />
                  </div>
                  <h2 style={{ fontSize: "27px", lineHeight: "48px", fontFamily: "Montserrat-SemiBold", padding: "30px" }}>Kindly fill the above fields to get started</h2>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        {isLoading && <Preloader />}
      </div>
    </>
  );
};
export default Transactions;
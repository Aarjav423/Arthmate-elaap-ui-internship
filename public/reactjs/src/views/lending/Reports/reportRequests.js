import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { storedList } from "../../../util/localstorage";
import { AlertBox } from "../../../components/AlertBox";
import Table from "react-sdk/dist/components/Table";
import {
  getReportRequestsWatcher,
  generateReportRequestWatcher,
  downloadReportRequestFileWatcher
} from "../../../actions/reportRequests";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import moment from "moment";
import "react-sdk/dist/styles/_fonts.scss";
import Button from "react-sdk/dist/components/Button";
import downloadIcon from "../images/download-button.svg";
import downloadIconHover from "../images/download-button-hover.svg";
import { Tooltip } from "@mui/material";
import ReportRequestCriteria from "./ReportRequestCriteria";
import { checkAccessTags } from "../../../util/uam";
import "react-sdk/dist/styles/_fonts.scss";


const ReportRequests = () => {
  const dispatch = useDispatch();
  const URLdata = window.location.href;
  const user = storedList("user");
  const reportName = URLdata.split("/").slice(-1)[0];
  const isLoc = ["LOC_due_report"].includes(reportName);
  const statusDropdownRequired = ["Enach_subscription_report"].includes(reportName)
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;
  const hasReportReadAccess = 
    isTagged
      ? ((reportName === "LOC_due_report" && checkAccessTags(["tag_LOC_due_report_read", "tag_LOC_due_report_read_write"])) ||
      (reportName === "Enach_subscription_report" && checkAccessTags(["tag_report_enach_subscription_read", "tag_report_enach_subscription_read_write"])))
        ? true
        : false
      : true;
  const hasReportReadWriteAccess = 
    isTagged
      ? ((reportName === "LOC_due_report" && checkAccessTags(["tag_LOC_due_report_read_write"]))||
      (reportName === "Enach_subscription_report" && checkAccessTags(["tag_report_enach_subscription_read_write"])))
        ? true
        : false
      : true;

  const enachStatusList = [
  { "label": "All", "value": null},
  { "label": "Success", "value": "success" },
  { "label": "Failed", "value": "failed" },
  { "label": "In Progress", "value": "in-progress" },
  ]
  
  const statusList = (reportName === "Enach_subscription_report") ? enachStatusList : null;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [reports, setReports] = useState([]);
  const [count, setCount] = useState(0);
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");


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


  const getReportRequests = () => {
    if (!hasReportReadAccess) {
      return;
    }
    const payload = {
      report_name: reportName,
      page: page,
      limit: rowsPerPage,
      userData: {
        company_id: user.type === "company" ? user.company_id : "",
        user_id: user._id,
        product_id: ""
      }
    };
    
    new Promise((resolve, reject) => {
      dispatch(getReportRequestsWatcher(payload, resolve, reject));
    })
    .then(response => {
      setReports(response.rows);
      setCount(response.count);
    })
    .catch(error => {
      showAlert(error?.response?.data?.message, "error");
    });
  };

  const handleDownloadReport = ( request ) => {
    if (!hasReportReadWriteAccess) {
      return;
    }
    const payload = {
      request_id: request._id,
      userData: {
        company_id: user.type === "company" ? user.company_id : "",
        user_id: user._id,
        product_id: ""
      }
    }

    new Promise((resolve, reject) => {
      dispatch(downloadReportRequestFileWatcher(payload, resolve, reject));
    })
    .then(response => {
      showAlert(response?.message, "success");
      window.open(response.signed_url, '_blank');
    })
    .catch(error => {
      showAlert(error?.response?.data.message, "error");
    });
  }

  const getStatusDisplay = ( request ) => {
    if (request.status === 'In-progress') {
      return (
        <Tooltip
          title="We're currently working on generating the report, and it will take some time. 
            When the report is ready, the download button will become available."
        >
          <div
            style={{
              display: 'flex',
              fontFamily: 'Montserrat-Medium',
              padding: '2px 8px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: '500',
              lineHeight: '150%',
              color: '#DB8400',
              borderRadius: '4px',
              border: '1px solid #DB8400',
              background: '#FFF5E6'
            }}
          >
            <span>In Progress</span>
          </div>
        </Tooltip>
      );
    } else if (request.status === 'Generated') {
      return (
        <Button
          id="reportDownload"
          buttonType="link-button"
          imageButton={downloadIcon}
          imageButtonHover={downloadIconHover}
          iconButton="btn-secondary-download-button"
          onClick={() => handleDownloadReport(request)}
        />
      );
    } else if (request.status === 'No-data') {
      return (
        <Tooltip
          title="No data found for the request report."
        >
          <div
            style={{
              display: 'flex',
              fontFamily: 'Montserrat-Medium',
              padding: '2px 8px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: '500',
              lineHeight: '150%',
              color: '#CC0000',
              borderRadius: '4px',
              border: '1px solid #CC0000',
              background: '#FFF5E6'
            }}
          >
            <span>No Data</span>
          </div>
        </Tooltip>
      );
    }
  }

  const columns = [
    {id:'title', label:'TITLE'},
    {id:'requested_by', label:'REQUESTED BY'},
    {id:'requested_date', label:'REQUESTED DATE & TIME'},
    {id:'status', label:'DOWNLOAD'}
  ];

  const data = reports 
    ? reports.map(row => {
        return {
          title: row.file_name,
          requested_by: row.requested_by,
          requested_date: moment(row.requested_date).format('DD-MM-YYYY HH:mm:ss'),
          status: getStatusDisplay(row)
        }
      })
    : [];

  const handleGenerateReportRequest = ( requestData ) => {
    if (!hasReportReadWriteAccess) {
      return;
    }
    const payload = {
      userData: {
        company_id: requestData?.company?.value,
        user_id: user._id,
        product_id: requestData?.product?.value
      },

      submitData: {
        company_id: requestData?.company?.value,
        company_code: requestData?.company?.code,
        company_name: requestData?.company?.label,
        product_id: requestData?.product?.value,
        product_name: requestData?.product?.label,
        from_date: requestData?.fromDate,
        to_date: requestData?.toDate,
        status:requestData?.status?.value,
        report_name: reportName
      }
    };

    new Promise((resolve, reject) => {
      dispatch(generateReportRequestWatcher(payload, resolve, reject));
    })
      .then(response => {
        showAlert(response?.message, "success");
        getReportRequests();
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  useEffect(() => {
    getReportRequests();
  }, [page, rowsPerPage]);


  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}

      <ReportRequestCriteria
        reportName={reportName}
        pageName="reportRequests"
        isLoc={isLoc}
        handleGenerate={handleGenerateReportRequest}
        isGenerateDisabled={!hasReportReadWriteAccess}
        isStatusDropdownRequired={statusDropdownRequired}
        isStatusList={statusList}
        initialStatus={(reportName === "Enach_subscription_report") ? "All" : null}
      />

      {reports && 
        <div
          style={{
            margin: '0 24px 40px 24px',
            borderRadius: '15px',
            borderLeft: '1px solid #EDEDED',
            borderRight: '1px solid #EDEDED',
            borderBottom: '1px solid #EDEDED'
          }}
        >
          <Table
            columns={columns}
            data={data}
            customStyle={{
              display: "grid", 
              gridTemplateColumns: "57% 20% 15% 8%",
              fontFamily: 'Montserrat-Medium',
              borderBottomLeftRadius: '0',
              borderBottomRightRadius: '0',
              whiteSpace: "nowrap",
              overflowX: 'hidden',
              overflowY: 'hidden',
            }}
          />
          <Pagination
            totalItems={count}
            itemsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 15, 20]}
            onPageChange={setPage}
            setRowLimit={setRowsPerPage}
            showOptions={true}
          />
        </div>
      }
    </>
  );
}

export default ReportRequests;

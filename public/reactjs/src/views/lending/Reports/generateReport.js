import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import InfoIcon from "@mui/icons-material/Info";
import {Button, Divider} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {
  downloadKycComplianceReportsWatcher,
  generateKycComplianceReportsWatcher,
  getKycComplianceReportsWatcher
} from "../../../actions/kycComplianceReport";
import {
  downloadRepaymentDueReportWatcher,
  generateRepaymentDueReportsWatcher,
  getRepaymentDueReportsWatcher
} from "../../../actions/repaymentDueReports";
import {
  downloadRepaymentReportWatcher,
  generateRepaymentReportsWatcher,
  getRepaymentReportsWatcher
} from "../../../actions/repaymentReports";
import {
  downloadCibilReportWatcher,
  downloadDisbursementFailureReportWatcher,
  downloadeReportsWatcher,
  downloadInsuranceReportWatcher,
  downloadRefundReportWatcher,
  generateDisbursementFailureReportsWatcher,
  generateInsuranceReportsWatcher,
  generateRefundReportsWatcher,
  generateReportsWatcher,
  getCibilWatcher,
  getDisbursementFailureWatcher,
  getInsuranceWatcher,
  getRefundWatcher,
  getReportsWatcher
} from "../../../actions/reports";
import {
  downloadSubventionReportsWatcher,
  generateSubventionReportsWatcher,
  getSubventionReportsWatcher
} from "../../../actions/subventionReport";
import BasicFilter from "../../../components/Filter/basic";

import {
  downloadLocDrawdownReportWatcher,
  generateLocDrawdownReportsWatcher,
  getLocDrawdownReportsWatcher
} from "../../../actions/locDrawdownReport";

import TablePagination from "@mui/material/TablePagination";
import moment from "moment";
import {useDispatch} from "react-redux";
import {
  downloadCkycReportWatcher,
  generateCkycReportsWatcher,
  getCkycReportsWatcher
} from "../../../actions/ckycReport";
import {downloadDPDReportsWatcher, generateDPDReportsWatcher, getDPDReportsWatcher} from "../../../actions/dpdReport";
import {
  downloadInstallmentAndRepaymentReportsWatcher,
  generateInstallmentAndRepaymentReportsWatcher,
  getInstallmentAndRepaymentReportsWatcher
} from "../../../actions/installmentAndRepaymentReport";
import {
  downloadInsuranceBillingReportsWatcher,
  generateInsuranceBillingReportsWatcher,
  getInsuranceBillingReportsWatcher
} from "../../../actions/insuranceBillingReport";
import {
  downloadMonthlyCollectionReportsWatcher,
  downloadServiceUsageReportsWatcher,
  getMonthlyCollectionReportsWatcher,
  getServiceUsageReportsWatcher
} from "../../../actions/monthlyCollectionReport";
import {
  downloadRepaymentScheduleReportWatcher,
  generateRepaymentScheduleReportsWatcher,
  getRepaymentScheduleReportsWatcher
} from "../../../actions/repaymentScheduleReport";
import {
  downloadScreenReportWatcher,
  generateScreenReportsWatcher,
  getScreenReportsWatcher
} from "../../../actions/screenReport";
import {AlertBox} from "../../../components/AlertBox";
import {
  downloadDataInXLSXFormat,
  downloadGenericReports,
  downloadMonthlyReportDataInXLSXFormat
} from "../../../util/helper";
import {storedList} from "../../../util/localstorage";

import {
  downloadDailyCollectionReportsWatcher,
  downloadDailyLeadReportsWatcher,
  downloadDailyLoanReportsWatcher,
  getDailyCollectionReportsWatcher,
  getDailyLeadReportsWatcher,
  getDailyLoanReportsWatcher
} from "../../../actions/dailyCollectionReport";
import {StyledTableCell, StyledTableRow} from "../../../components/custom/TableElements";
import {checkAccessTags} from "../../../util/uam";
import {monthMapping} from "../../../util/reports-data";

const GenerateReport = () => {
  const [isGenerateButtonDisabled, setIsGenerateButtonDisabled] = useState(false);
  const URLdata = window.location.href;
  const user = storedList("user");
  const dispatch = useDispatch();
  const [reports, setReports] = useState([]);
  const [filterdData, setFilterdData] = useState({});
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [page, setPage] = useState(0);
  const [count, setCount] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showStatus, setShowStatus] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const [reportName, setReportName] = useState(URLdata.split("/").slice(-1)[0]);
  const [screenReportFlag, setScreenReportFlag] = useState(false);
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;
  const todayDate=new Date().toISOString().slice(0, 10);
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

  //Functions for fetching reports
  const handleGetReport = () => {
    const payload = {
      page: page,
      limit: rowsPerPage,
      userData: {
        company_id: user.type === "company" ? user.company_id : "",
        user_id: user._id,
        product_id: ""
      }
    };
    if (reportName.indexOf("Screening_report") > -1) {
      getScreenReports(payload);
    }
    if (reportName.indexOf("Disbursement_transactions") > -1) {
      getDisbursementReports(payload);
    }
    if (reportName.indexOf("Repayment_due_report") > -1) {
      getRepaymentDueReports(payload);
    }
    if (reportName.indexOf("KYC_compliance_report") > -1) {
      getKycComplianceReports(payload);
    }
    if (reportName.indexOf("Repayment_report") > -1) {
      getRepaymentReports(payload);
    }
    if (reportName.indexOf("Subvention_invoice_report") > -1) {
      getSubventionReport(payload);
    }
    if (reportName.indexOf("DPD_report") > -1) {
      getDPDReport(payload);
    }
    if (reportName.indexOf("Installment_and_repayment_recon_report") > -1) {
      getInstallmentAndRepaymentReport(payload);
    }
    if (reportName.indexOf("Monthly_insurance_billing_report") > -1) {
      getInsuranceBillingReport(payload);
    }
    if (reportName.indexOf("Repayment_schedule_report") > -1) {
      getRepaymentScheduleReport(payload);
    }
    if (reportName.indexOf("CKYC_upload_&_update") > -1) {
      getCkycReports(payload);
    }
    if (reportName.indexOf("LOC_drawdown") > -1) {
      getLocDrawdownReports(payload);
    }
    if (reportName.indexOf("Refund_report") > -1) {
      getRefundReports(payload);
    }
    if (reportName.indexOf("Insurance_report") > -1) {
      getInsuranceReports(payload);
    }
    if (reportName.indexOf("Disbursement_inprogress_Report") > -1) {
      getInProgressReports(payload);
    }
    if (reportName.indexOf("Bureau_report") > -1) {
      getBureauReports(payload);
    }
  };

  const getRefundReports = payload => {
    dispatch(
      getRefundWatcher(
        payload,
        response => {
          setReports(response.rows);
          setCount(response?.count);
        },
        error => {
          showAlert(error?.response?.data?.message, "error");
        }
      )
    );
  };

  const getInsuranceReports = payload => {
    dispatch(
      getInsuranceWatcher(
        payload,
        response => {
          setReports(response.rows);
          setCount(response?.count);
        },
        error => {
          showAlert(error?.response?.data?.message, "error");
        }
      )
    );
  };

  const getInProgressReports = payload => {
    dispatch(
      getDisbursementFailureWatcher(
        payload,
        response => {
          setReports(response.rows);
          setCount(response?.count);
        },
        error => {
          showAlert(error?.response?.data?.message, "error");
        }
      )
    );
  };

  const getBureauReports = payload => {
    dispatch(
      getCibilWatcher(
        payload,
        response => {
          setReports(response.rows);
          setCount(response?.count);
          if (!response.rows.length) showAlert("No records found", "error");
        },
        error => {
          showAlert(error?.response?.data?.message, "error");
        }
      )
    );
  };

  const getLocDrawdownReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getLocDrawdownReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getDisbursementReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getRepaymentDueReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getRepaymentDueReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getRepaymentReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getRepaymentReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getKycComplianceReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getKycComplianceReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getSubventionReport = payload => {
    new Promise((resolve, reject) => {
      dispatch(getSubventionReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getDPDReport = payload => {
    new Promise((resolve, reject) => {
      dispatch(getDPDReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getInstallmentAndRepaymentReport = payload => {
    new Promise((resolve, reject) => {
      dispatch(
        getInstallmentAndRepaymentReportsWatcher(payload, resolve, reject)
      );
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getInsuranceBillingReport = payload => {
    new Promise((resolve, reject) => {
      dispatch(getInsuranceBillingReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getRepaymentScheduleReport = payload => {
    new Promise((resolve, reject) => {
      dispatch(getRepaymentScheduleReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getScreenReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getScreenReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count); 
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  //function to get list of all ckyc reports generated on ui
  const getCkycReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getCkycReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setReports([]);
  };

  //Functions for generating reports
  const handleGenerateReport = () => {
    if (reportName.indexOf("Screening_report") > -1) {
      generateScreeningReport();
      return;
    }
    if (
      !(reportName.indexOf("CKYC_upload_&_update") > -1) &&
      !(reportName.indexOf("KYC_compliance_report") > -1) &&
      !filterdData?.company?.value
    ) {
      return showAlert("Please select company.", "error");
    }
    if (reportName.indexOf("Repayment_report") > -1) {
      if (filterdData.isCreation) {
        if (!filterdData?.fromCreationDate)
          return showAlert("Please select from creation date.", "error");
        if (!filterdData?.toCreationDate)
          return showAlert("Please select to creation date.", "error");
      } else if (!filterdData.fromDate && !filterdData?.fromCreationDate) {
        return showAlert(
          "Please select from repayment date or from creation date.",
          "error"
        );
      } else {
        if (!filterdData.fromDate)
          return showAlert("Please select from repayment date.", "error");
        if (!filterdData.toDate)
          return showAlert("Please select to repayment date.", "error");
      }
    } else {
      if (reportName.indexOf("CKYC_upload_&_update") > -1) {
        if (!filterdData.fromDate)
          return showAlert("Please select Date.", "error");
      } else if (!(reportName.indexOf("KYC_compliance_report") > -1)&&!(reportName.indexOf("DPD_report") > -1)) {
        if (!filterdData.fromDate)
          return showAlert("Please select fromDate.", "error");
        if (!filterdData.toDate)
          return showAlert("Please select toDate.", "error");
      }
    }
    if (reportName.indexOf("Disbursement_transactions") > -1) {
      generateDisbursementReport();
    }
    if (reportName.indexOf("Repayment_due_report") > -1) {
      generateRepaymentDueReport();
    }
    if (reportName.indexOf("KYC_compliance_report") > -1) {
      generateKycComplianceReport();
    }
    if (reportName.indexOf("Repayment_report") > -1) {
      generateRepaymentReport();
    }
    if (reportName.indexOf("Subvention_invoice_report") > -1) {
      generateSubventionReport();
    }
    if (reportName.indexOf("DPD_report") > -1) {
      generateDPDReport();
    }
    if (reportName.indexOf("Installment_and_repayment_recon_report") > -1) {
      generateInstallmentAndRepaymentReport();
    }
    if (reportName.indexOf("Monthly_insurance_billing_report") > -1) {
      generateInsuranceBillingReport();
    }
    if (reportName.indexOf("Repayment_schedule_report") > -1) {
      generateRepaymentScheduleReport();
    }
    if (reportName.indexOf("CKYC_upload_&_update") > -1) {
      generateCKYCReport();
    }
    if (reportName.indexOf("LOC_drawdown") > -1) {
      generateLocDrawdownReport();
    }
    if (reportName.indexOf("Refund_report") > -1) {
      generateRefundReport();
    }
    if (reportName.indexOf("Insurance_report") > -1) {
      generateInsuranceReport();
    }
    if (reportName.indexOf("Disbursement_inprogress_Report") > -1) {
      generateInProgressReport();
    }
  };

  const generateLocDrawdownReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        from_date: filterdData?.fromDate,
        to_date: filterdData.toDate,
        product_id: filterdData?.product?.value,
        status: filterdData?.status?.value
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateLocDrawdownReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  const generateDisbursementReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        from_date: filterdData?.fromDate,
        to_date: filterdData.toDate,
        product_id: filterdData?.product?.value,
        status: filterdData?.status?.value
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  const generateRefundReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        from_date: filterdData?.fromDate,
        to_date: filterdData.toDate,
        product_id: filterdData?.product?.value,
        status: filterdData?.status?.value
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateRefundReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  const generateInsuranceReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        from_date: filterdData?.fromDate,
        to_date: filterdData.toDate,
        product_id: filterdData?.product?.value,
        status: filterdData?.status?.value
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateInsuranceReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };
  const generateInProgressReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        from_date: filterdData?.fromDate,
        to_date: filterdData.toDate,
        product_id: filterdData?.product?.value,
        status: filterdData?.status?.value
      }
    };
    new Promise((resolve, reject) => {
      dispatch(
        generateDisbursementFailureReportsWatcher(payload, resolve, reject)
      );
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  const generateRepaymentDueReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        from_date: filterdData?.fromDate,
        to_date: filterdData.toDate,
        product_id: filterdData?.product?.value
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateRepaymentDueReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  const generateRepaymentReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        from_date: filterdData?.fromDate || filterdData.fromCreationDate,
        to_date: filterdData.toDate || filterdData.toCreationDate,
        product_id: filterdData?.product?.value,
        isCreation: filterdData?.isCreation
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateRepaymentReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  const generateKycComplianceReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        from_date: filterdData?.fromDate,
        to_date: filterdData.toDate,
        product_id: filterdData?.product?.value,
        status: filterdData?.status?.value
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateKycComplianceReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  const generateSubventionReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        product_id: filterdData?.product?.value,
        from_date: filterdData?.fromDate,
        to_date: filterdData.toDate
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateSubventionReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  const generateDPDReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        product_id: filterdData?.product?.value,
        from_date: filterdData?.fromDate,
        to_date: filterdData.toDate
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateDPDReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  const generateInstallmentAndRepaymentReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        product_id: filterdData?.product?.value,
        from_date: filterdData?.fromDate,
        to_date: filterdData.toDate
      }
    };
    new Promise((resolve, reject) => {
      dispatch(
        generateInstallmentAndRepaymentReportsWatcher(payload, resolve, reject)
      );
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  const generateInsuranceBillingReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        product_id: filterdData?.product?.value,
        from_date: filterdData?.fromDate,
        to_date: filterdData.toDate
      }
    };
    new Promise((resolve, reject) => {
      dispatch(
        generateInsuranceBillingReportsWatcher(payload, resolve, reject)
      );
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  const generateRepaymentScheduleReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        product_id: filterdData?.product?.value,
        from_date: filterdData?.fromDate,
        to_date: filterdData.toDate
      }
    };
    new Promise((resolve, reject) => {
      dispatch(
        generateRepaymentScheduleReportsWatcher(payload, resolve, reject)
      );
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  // function to generate ckyc_report
  const generateCKYCReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        user_id: user._id
      },
      submitData: {
        date: filterdData?.fromDate
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateCkycReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  // function to generate screening report
  const generateScreeningReport = () => {
    setIsGenerateButtonDisabled(true);
    const payload = {
      userData: {
        company_id: filterdData?.company?.value,
        user_id: user._id,
        product_id: filterdData?.product?.value
      },
      submitData: {
        company_id: filterdData?.company?.value,
        from_date: filterdData.fromDate ? filterdData.fromDate : "",
        to_date: filterdData.toDate ? filterdData.toDate : "",
        product_id: filterdData?.product?.value,
        status: filterdData?.status?.value
      }
    };
    new Promise((resolve, reject) => {
      dispatch(generateScreenReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        handleGetReport();
        showAlert(response?.message, "success");
        setIsGenerateButtonDisabled(false);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        setIsGenerateButtonDisabled(false);
      });
  };

  //Functions for downloading reports
  const handleDownloadReport = (id, name) => {
    const payload = {
      userData: {
        user_id: user._id
      },
      submitData: {
        id: id
      }
    };
    if (reportName.indexOf("Disbursement_transactions_report") > -1) {
      downloadDisbursementReport(
        payload,
        "Disbursement_transactions_report_" + name
      );
    }
    if (reportName.indexOf("Repayment_due_report") > -1) {
      downloadRepaymentDueReport(payload, "Repayment_due_report_" + name);
    }
    if (reportName.indexOf("KYC_compliance_report") > -1) {
      downloadKycComplianceReport(payload, "KYC_compliance_report_" + name);
    }
    if (reportName.indexOf("Repayment_report") > -1) {
      downloadRepaymentReport(payload, "Repayment_report_" + name);
    }
    if (reportName.indexOf("Subvention_invoice_report") > -1) {
      downloadSubventionReport(payload, "Subvention_invoice_report_" + name);
    }
    if (reportName.indexOf("DPD_report") > -1) {
      downloadDPDReport(payload, "DPD_report_" + name);
    }
    if (reportName.indexOf("Installment_and_repayment_recon_report") > -1) {
      downloadInstallmentAndRepaymentReport(
        payload,
        "Installment_and_repayment_recon_report_" + name
      );
    }
    if (reportName.indexOf("Monthly_insurance_billing_report") > -1) {
      downloadInsuranceBillingReport(
        payload,
        "Monthly_insurance_billing_report_" + name
      );
    }
    if (reportName.indexOf("Repayment_schedule_report") > -1) {
      downloadRepaymentScheduleReport(
        payload,
        "Repayment_schedule_report_" + name
      );
    }
    if (reportName.indexOf("CKYC_upload_&_update") > -1) {
      downloadCkycReport(payload, name);
    }
    if (reportName.indexOf("Monthly_collections_report") > -1) {
      downloadMonthlyCollectionReport(
        payload,
        "Monthly_collection_report_" + name
      );
    }
    if (reportName.indexOf("Daily_collections_report") > -1) {
      downloadDailyCollectionReport(payload, "Daily_collection_report_" + name);
    }
    if (reportName.indexOf("Lead_report") > -1) {
      downloadDailyLeadReport(payload, name);
    }
    if (reportName.indexOf("Loan_report") > -1) {
      downloadDailyLoanReport(payload, name);
    }
    if (reportName.indexOf("Screening_report") > -1) {
      downloadScreenReport(payload, "Screen_report_.xlsx");
    }
    if (reportName.indexOf("Service_usage_report") > -1) {
      checkAccessTags(["tag_service_usage_report_read_write"])
        ? downloadServiceUsageReport(payload, name)
        : null;
    }
    if (reportName.indexOf("LOC_drawdown") > -1) {
      checkAccessTags(["tag_LOC_drawdown_read_write"])
        ? downloadLocDrawdownReport(payload, "LOC_drawdown_" + name)
        : null;
    }
    if (reportName.indexOf("Refund_report") > -1) {
      downloadRefundReport(payload, "Refund_report_" + name);
    }

    if (reportName.indexOf("Insurance_report") > -1) {
      downloadInsuranceReport(payload, "Insurance_report_" + name);
    }

    if (reportName.indexOf("Disbursement_inprogress_Report") > -1) {
      downloadInProgressReport(
        payload,
        "Disbursement_inprogress_report_" + name
      );
    }
    if (reportName.indexOf("Bureau_report") > -1) {
      downloadCibilReport(payload,name);
    }
  };
  //method to download screen report
  const downloadScreenReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadScreenReportWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadLocDrawdownReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadLocDrawdownReportWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadMonthlyCollectionReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(
        downloadMonthlyCollectionReportsWatcher(payload, resolve, reject)
      );
    })
      .then(response => {
        return downloadMonthlyReportDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadServiceUsageReport = async (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadServiceUsageReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        const encodedStr = encodeURIComponent(response);
        const uint8Array = new Uint8Array(encodedStr.length);
        for (let i = 0; i < encodedStr.length; i++) {
          uint8Array[i] = encodedStr.charCodeAt(i);
        }
        const newBuffer = new ArrayBuffer(uint8Array.length);
        const newUint8Array = new Uint8Array(newBuffer);
        newUint8Array.set(uint8Array);
        const buffer = Buffer.from(response);
        const arrayBuffer = buffer.buffer;
        const fileName = name;
        const blob = new Blob([arrayBuffer], {
          type: "application/vnd.ms-excel"
        });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadDailyCollectionReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadDailyCollectionReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadMonthlyReportDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadDailyLeadReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadDailyLeadReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadGenericReports(
          response,
          name,
          "application/vnd.ms-excel"
        );
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadDailyLoanReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadDailyLoanReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadGenericReports(
          response,
          name,
          "application/vnd.ms-excel"
        );
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadDisbursementReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadeReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadRefundReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadRefundReportWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadInsuranceReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadInsuranceReportWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadInProgressReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(
        downloadDisbursementFailureReportWatcher(payload, resolve, reject)
      );
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadCibilReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadCibilReportWatcher(payload, resolve, reject));
    })
      .then(response => {
        const blob = new Blob([response], { type: "text/plain" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadRepaymentDueReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadRepaymentDueReportWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadKycComplianceReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadKycComplianceReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadRepaymentReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadRepaymentReportWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadSubventionReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadSubventionReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadDPDReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadDPDReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadInstallmentAndRepaymentReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(
        downloadInstallmentAndRepaymentReportsWatcher(payload, resolve, reject)
      );
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadInsuranceBillingReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(
        downloadInsuranceBillingReportsWatcher(payload, resolve, reject)
      );
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const downloadRepaymentScheduleReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(
        downloadRepaymentScheduleReportWatcher(payload, resolve, reject)
      );
    })
      .then(response => {
        return downloadDataInXLSXFormat(name, response);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  // function to download ckyc zip filw whenn clicking on down load icon
  const downloadCkycReport = (payload, name) => {
    new Promise((resolve, reject) => {
      dispatch(downloadCkycReportWatcher(payload, resolve, reject));
    })
      .then(response => {
        return downloadGenericReports(response, name, "application/zip");
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };
  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags(["tag_reports_read", "tag_reports_read_write"])
    )
      handleGetReport();
    if (!isTagged) handleGetReport();
  }, [page]);

  const handleSetData = data => {
    setFilterdData(data);
  };

  useEffect(() => {
    if (
      reportName.indexOf("Disbursement_transactions") > -1 ||
      reportName.indexOf("Refund_report") > -1
    ) {
      setShowStatus(true);
      setStatusData([
        { label: "Success", value: "success" },
        { label: "Fail", value: "fail" }
      ]);
    }
    if (reportName.indexOf("KYC_compliance_report") > -1) {
      setShowStatus(true);
      setStatusData([
        { label: "Compliant", value: "compliant" },
        { label: "Non compliant", value: "non_compliant" },
        { label: "CKYC not done", value: "ckyc_status" }
      ]);
    }
    if (reportName.indexOf("Screening_report") > -1) {
      setScreenReportFlag(true);
    }
  }, []);

  const getMonthlyCollectionReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getMonthlyCollectionReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getServiceUsageReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getServiceUsageReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
        window.open(
          `/admin/lending/generate-reports/Service_usage_report`,
          "_self"
        );
      });
  };

  const getDailyCollectionReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getDailyCollectionReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        setReports([]);
        setCount(0);
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getDailyLeadReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getDailyLeadReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        setReports([]);
        setCount(0);
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const getDailyLoanReports = payload => {
    new Promise((resolve, reject) => {
      dispatch(getDailyLoanReportsWatcher(payload, resolve, reject));
    })
      .then(response => {
        setReports(response.rows);
        setCount(response?.count);
      })
      .catch(error => {
        setReports([]);
        setCount(0);
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const handleSearchClick = () => {
    let type =
      reportName.indexOf("Monthly_collections_report") > -1
        ? "monthly"
        : reportName.indexOf("Daily_collections_report") > -1
        ? "daily"
        : reportName.indexOf("Lead_report") > -1
        ? "lead"
        : reportName.indexOf("Loan_report") > -1
        ? "loan"
        : reportName.indexOf("Service_usage_report") > -1
        ? "service"
        : reportName.indexOf("Bureau_report") > -1
        ? "bureau" : "";
    if (type !== "service" && type !== "lead" && type !== "loan" && type != "monthly" && type != "daily" && type !== "bureau") {
      if (!filterdData?.company?.value) {
        return showAlert("Please select company.", "error");
      }
    }
    if (type !== "service" && type !== "lead" && type !== "loan" && type != "monthly" && type != "daily" && type !== "bureau") {
      if (!filterdData?.product?.value) {
        return showAlert("Please select product.", "error");
      }
    }
    if (type !== "service") {
      if (!filterdData?.month || filterdData.month === "Invalid date") {
        return showAlert("Please select month.", "error");
      }
    }
    if (!filterdData?.year || filterdData.year === "Invalid date") {
      return showAlert("Please select year.", "error");
    }
    if (type === "lead" || type === "loan") {
      if (!filterdData?.day || filterdData.day === "Invalid date") {
        return showAlert("Please select day.", "error");
      }
    }

    const payload = {
      company_id: filterdData?.company?.value,
      user_id: user._id,
      product_id: filterdData?.product?.value,
      month: filterdData.month,
      year: filterdData.year,
      page: page,
      limit: rowsPerPage
    };
    if (type === "monthly") {
      getMonthlyCollectionReports(payload);
    }
    if (type === "service") {
      getServiceUsageReports(payload);
    }
    if (type === "bureau") {
      getBureauReports(payload)
    }
    if (type === "daily") {
      payload.day =
        filterdData.day && filterdData.day !== "Invalid date"
          ? filterdData.day
          : null;
      getDailyCollectionReports(payload);
    }
    if (type === "lead") {
      payload.day =
        filterdData.day && filterdData.day !== "Invalid date"
          ? filterdData.day
          : null;
      getDailyLeadReports(payload);
    }
    if (type === "loan") {
      payload.day =
        filterdData.day && filterdData.day !== "Invalid date"
          ? filterdData.day
          : null;
      getDailyLoanReports(payload);
    }
  };

  const checkReportAndAccessTags = type => {
    if (reportName === "Refund_report") {
      return checkAccessTags([
        "tag_refund_report_read",
        "tag_refund_report_read_write"
      ]);
    } else if (reportName === "Insurance_report") {
      return checkAccessTags([
        "tag_insurance_report_read",
        "tag_insurance_report_read_write"
      ]);
    } else if (reportName === "Disbursement_inprogress_Report") {
      return checkAccessTags([
        "tag_report_disbursement_inprogress_read",
        "tag_report_disbursement_inprogress_read_write"
      ]);
    } else if (reportName === "Bureau_report") {
      return checkAccessTags([
        "tag_bureau_report_read",
        "tag_bureau_report_read_write"
      ]);
    } else return true;
  };

  const checkReportAndAccessTagsWrite = () => {
    if (reportName === "Refund_report") {
      return checkAccessTags(["tag_refund_report_read_write"]);
    } else if (reportName === "Insurance_report") {
      return checkAccessTags(["tag_insurance_report_read_write"]);
    } else if (reportName === "Disbursement_inprogress_Report") {
      return checkAccessTags(["tag_report_disbursement_inprogress_read_write"]);
    } else if (reportName === "Bureau_report") {
      return checkAccessTags(["tag_bureau_report_read_write"]);
    } else return true;
  };

  const getReportTitle = (item) => {
    if (item.report_name === "subvention_invoice") {
      return `Subvention_Invoice_Report_${item.company_name ?? "NA"}_${item.product_name ?? "all"}_${
          item.from_date ?? "NA"}_${item.to_date ?? "NA"}_report.xlsx`
    }
    if (item.report_name === "dpd") {
      return `DPD_Report_${item.company_name ?? "NA"}_${item.product_name ?? "all"}_${
        item.from_date ?? todayDate}_${item.to_date ?? ""}_report.xlsx`
    }
    if (item.report_name === "kyc_compliance") {
      return `KYC_compliance_report_${item.company_name ?? "NA"}_${item.product_name ?? "all"}_${
          item.from_date ?? "NA"}_${item.to_date ?? "NA"}_report.xlsx`
    }
    if (item.report_name === "disbursement") {
      return `Disbursement_transactions_report_${item.company_name ?? "NA"}_${item.product_name ?? "all"}_${
          item.from_date ?? "NA"}_${item.to_date ?? "NA"}_report.xlsx`
    }
    if (item.report_name === "loc_drawdown_report") {
      return `${item.company_name ?? "NA"}_${item.product_name ?? "all"}_${
          item.from_date ?? "NA"}_${item.to_date ?? "NA"}_report.xlsx`
    }
    if (item.report_name === "repayment") {
      return `Repayment_report_${item.company_name ?? "NA"}_${item.product_name ?? "all"}_${
          item.from_date ?? "NA"}_${item.to_date ?? "NA"}_report.xlsx`
    }
    if (item.report_name === "repayment_due") {
      return `Repayment_due_report_${item.company_name ?? "NA"}_${item.product_name ?? "all"}_${
          item.from_date ?? "NA"}_${item.to_date ?? "NA"}_report.xlsx`
    }
    if (item.report_name === "insurance-billing-records") {
      return `Monthly_insurance_billing_report_${item.company_name ?? "NA"}_${item.product_name ?? "all"}_${
          item.from_date ?? "NA"}_${item.to_date ?? "NA"}_report.xlsx`
    }
    if (item.report_name === "repayment_schedule") {
      return `Repayment_schedule_report_${item.company_name ?? "NA"}_${item.product_name ?? "all"}_${
          item.from_date ?? "NA"}_${item.to_date ?? "NA"}_report.xlsx`
    }
    if (item.report_name === "recon-instalment-repayment") {
      return `Installment_and_repayment_recon_report_${item.company_name ?? "NA"}_${item.product_name ?? "all"}_${
          item.from_date ?? "NA"}_${item.to_date ?? "NA"}_report.xlsx`
    }
    if (item.report_name === "monthly_collection_report") {
      return `Monthly_collections_report_${item.month ?? "NA"}_${item.year ?? "NA"}_report.xlsx`
    }
    if (item.report_name === "service_usage_report") {
      return `Service_usage_report_${monthMapping[item.month] ?? "NA"}_${item.year ? item.year : "NA"}_report.xlsx`
    }
    if (item.report_name === "daily_collection_report") {
      return `Daily_collections_report_${item.day ?? "NA"}_${item.month ?? "NA"}_${item.year ?? "NA"}_report.xlsx`
    }
    if (reportName === "Lead_report") {
      return `daily_lead_report_${filterdData.year}-${filterdData.month}-${filterdData.day}.xlsx`
    }
    if (item.report_name === "ckyc_upload_and_update" || item.report_name === "screen_report") {
      return `${item.file_name}`
    }
    if (item.report_type === "cibil") {
      const url = item.report_s3_url
      return url.substring(url.lastIndexOf("/") + 1)
    }

    return `${item.company_name ?? "NA"}_${item.product_name ?? "all"}_${
          item.from_date ?? "NA"}_${item.to_date ?? "NA"}_report.xlsx`
  }

  return (
    <>
      {checkReportAndAccessTags() ? (
        <div>
          {alert ? (
            <AlertBox
              severity={severity}
              msg={alertMessage}
              onClose={handleAlertClose}
            />
          ) : null}
          <Typography
            sx={{
              mt: 2,
              ml: 2
            }}
            variant="h6"
          >
            {reportName.replace(/_+/g, " ")}
            {reportName === "Repayment_schedule_report" ? (
              <Tooltip title="Loan Disbursement Date">
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            ) : null}
            {reportName === "DPD_report"? (
              <Tooltip title="Loan creation date will be used to search. The date filter is non mandatory selection, if not selected then system will download the dpd report as of today for the selected company and product">
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            ) : null}
          </Typography>
          <CardContent>
            {true &&
              checkReportAndAccessTagsWrite() && (
                <Grid xs={12}>
                  <BasicFilter
                    reportName={reportName}
                    isViewSerach={false}
                    isScreenFlag={screenReportFlag}
                    isCustomDatePicker={
                      reportName === "Repayment_report" ? false : true
                    }
                    isServiceUsage={
                      reportName.indexOf("Service_usage_report") > -1
                        ? true
                        : false
                    }
                    isViewMonthDropdown={
                      reportName.indexOf("Monthly_collections_report") > -1 ||
                      reportName.indexOf("Daily_collections_report") > -1 ||
                      reportName.indexOf("Lead_report") > -1 ||
                      reportName.indexOf("Loan_report") > -1 ||
                      reportName.indexOf("Service_usage_report") > -1 ||
                      reportName.indexOf("Bureau_report") > -1
                        ? true
                        : false
                    }
                    isViewYearDropdown={
                      reportName.indexOf("Monthly_collections_report") > -1 ||
                      reportName.indexOf("Daily_collections_report") > -1 ||
                      reportName.indexOf("Lead_report") > -1 ||
                      reportName.indexOf("Loan_report") > -1 ||
                      reportName.indexOf("Service_usage_report") > -1 ||
                      reportName.indexOf("Bureau_report") > -1
                        ? true
                        : false
                    }
                    isViewDayDropdown={
                      reportName.indexOf("Daily_collections_report") > -1 ||
                      reportName.indexOf("Lead_report") > -1 ||
                      reportName.indexOf("Loan_report") > -1
                        ? true
                        : false
                    }
                    isViewStatus={showStatus}
                    statusList={statusData}
                    reportButton={true}
                    sendData={data => handleSetData(data)}
                    isProductCheck={false}
                    isDisabledFromDateDropdown={
                      reportName.indexOf("Monthly_collections_report") > -1 ||
                      reportName.indexOf("Daily_collections_report") > -1 ||
                      reportName.indexOf("Lead_report") > -1 ||
                      reportName.indexOf("Loan_report") > -1 ||
                      reportName.indexOf("Service_usage_report") > -1 ||
                      reportName.indexOf("Screening_report") > -1 ||
                      reportName.indexOf("KYC_compliance_report") > -1 ||
                      reportName.indexOf("Disbursement_transactions") > -1 ||
                      reportName.indexOf("Refund_report") > -1 ||
                      reportName.indexOf("Repayment_due_report") > -1 ||
                      reportName.indexOf("Subvention_invoice_report") > -1 ||
                      reportName.indexOf("DPD_report") > -1 ||
                      reportName.indexOf(
                        "Installment_and_repayment_recon_report"
                      ) > -1 ||
                      reportName.indexOf("Monthly_insurance_billing_report") >
                        -1 ||
                      reportName.indexOf("Repayment_schedule_report") > -1 ||
                      reportName.indexOf("LOC_drawdown") > -1 ||
                      reportName.indexOf("Insurance_report") > -1 ||
                      reportName.indexOf("Disbursement_inprogress_Report") >
                        -1 ||
                      reportName.indexOf("Bureau_report") > -1
                        ? false
                        : true
                    }
                    isViewFromDate={
                      reportName.indexOf("Monthly_collections_report") > -1 ||
                      reportName.indexOf("Daily_collections_report") > -1 ||
                      reportName.indexOf("Lead_report") > -1 ||
                      reportName.indexOf("Loan_report") > -1 ||
                      reportName.indexOf("Service_usage_report") > -1 ||
                      reportName.indexOf("Bureau_report") > -1
                        ? false
                        : true
                    }
                    isViewToDate={
                      reportName.indexOf("Monthly_collections_report") > -1 ||
                      reportName.indexOf("Daily_collections_report") > -1 ||
                      reportName.indexOf("Lead_report") > -1 ||
                      reportName.indexOf("Loan_report") > -1 ||
                      reportName.indexOf("Service_usage_report") > -1 ||
                      reportName.indexOf("Bureau_report") > -1
                        ? false
                        : true
                    }
                    isRepaymentReport={
                      reportName.indexOf("Repayment_report") > -1
                    }
                    isCKYCReport={
                      reportName.indexOf("CKYC_upload_&_update") > -1
                    }
                    isLeadReport={reportName.indexOf("Lead_report") > -1}
                    isLoanReport={reportName.indexOf("Loan_report") > -1}
                    isViewCompanyProductFilter={
                      (reportName.indexOf("Monthly_collections_report") > -1 ||
                      reportName.indexOf("Daily_collections_report") > -1 ||
                          reportName.indexOf("Bureau_report") > -1) ? false : true}
                  />       
                </Grid>    
              )}

            {true && (
              <Grid
                xs={12}
                sx={{
                  margin: "10px 0"
                }}
              >
                {reportName.indexOf("Monthly_collections_report") > -1 ||
                reportName.indexOf("Daily_collections_report") > -1 ||
                reportName.indexOf("Lead_report") > -1 ||
                reportName.indexOf("Loan_report") > -1 ||
                reportName.indexOf("Service_usage_report") > -1 ||
                reportName.indexOf("Bureau_report") > -1 ? (
                  <Grid
                    m={1}
                    sx={{ mt: 5 }}
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSearchClick}
                    >
                      Search
                    </Button>
                  </Grid>
                ) : checkReportAndAccessTagsWrite() ? (
                  <Grid
                    m={1}
                    sx={{ mt: 5 }}
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={isGenerateButtonDisabled || (isTagged && !checkAccessTags(["tag_reports_read_write"]))}
          
                      onClick={handleGenerateReport}
                      
                    >
                      Generate report
                    </Button>
                  </Grid>
                ) : null}

                <Grid>
                  <Divider />
                </Grid>
              </Grid>
            )}
            {reports.length ? (
              checkReportAndAccessTags ? (
                <Grid xs={12}>
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
                    >
                      <TableHead>
                        <TableRow>
                          <StyledTableCell> Title </StyledTableCell>
                          <StyledTableCell> Requested by </StyledTableCell>
                          <StyledTableCell>
                            Generation date and time
                          </StyledTableCell>
                          <StyledTableCell> Download</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reports &&
                          reports.map(item => (
                            <StyledTableRow key={item._id}>
                              <StyledTableCell scope="row">
                                {getReportTitle(item)}
                              </StyledTableCell>
                              {item.report_name === "service_usage_report" ||
                              reportName === "Lead_report" ||
                              reportName === "Loan_report" ? (
                                <StyledTableCell scope="row">
                                  {user?.username}
                                </StyledTableCell>
                              ) : (
                                <StyledTableCell scope="row">
                                  {item?.requested_by_name || "NA"}
                                </StyledTableCell>
                              )}
                              {reportName === "Lead_report" ||
                              reportName === "Loan_report" ? (
                                <StyledTableCell scope="row">
                                {moment.utc(item?.generated_time).format("YYYY-MM-DD")}
                              </StyledTableCell>
                              ) :
                               (
                              <StyledTableCell scope="row">
                                {moment(item?.created_at).format("YYYY-MM-DD")}
                              </StyledTableCell>
                               )}
                              <StyledTableCell scope="row">
                                <Tooltip
                                  title="Download File"
                                  placement="top"
                                  arrow
                                >
                                  <IconButton
                                    aria-label="Download File"
                                    color="primary"
                                    onClick={() =>
                                      handleDownloadReport(
                                        item._id,
                                        item.report_name ===
                                          "ckyc_upload_and_update"
                                          ? `${item.file_name}`
                                          : item.report_name ===
                                            "monthly_collection_report"
                                          ? `${item.month}_${
                                              item.year
                                            }_report.xlsx`
                                          : item.report_name ===
                                            "service_usage_report"
                                          ? `Service_usage_report_${
                                              monthMapping[item.month]
                                                ? monthMapping[item.month]
                                                : item.month
                                            }_${item.year}_report.xlsx`
                                          : item.report_name ===
                                            "daily_collection_report"
                                          ? `${item.day ? item?.day : "NA"}_${
                                              item.month
                                            }_${item.year}_report.xlsx`
                                          : reportName === "Lead_report"
                                          ? `daily_lead_report_${filterdData.year}-${filterdData.month}-${filterdData.day}.xlsx`
                                          : reportName === "Loan_report"
                                          ? `daily_loan_report_${filterdData.year}-${filterdData.month}-${filterdData.day}.xlsx`
                                          : item.report_type === "cibil"
                                          ? item.report_s3_url.substring(item.report_s3_url.lastIndexOf("/") + 1)
                                          :`${
                                              item.company_name
                                                ? item.company_name
                                                : "NA"
                                            }_${
                                              item.product_name
                                                ? item.product_name
                                                : "all"
                                            }_${
                                              item.from_date
                                                ? item.from_date
                                                : todayDate
                                            }_${
                                              item.to_date ? item.to_date : "_"
                                            }_report.xlsx`
                                      )
                                    }
                                  >
                                    <ArrowCircleDownIcon />
                                  </IconButton>
                                </Tooltip>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                      </TableBody>
                    </Table>
                    {reportName.indexOf("Service_usage_report") < 0 && count ? (
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
                </Grid>
              ) : null
            ) : null}
          </CardContent>
        </div>
      ) : null}
    </>
  );
};

export default GenerateReport;

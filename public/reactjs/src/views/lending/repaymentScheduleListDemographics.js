import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {
  repaymentScheduleForLocWatcher,
  repaymentScheduleForRaiseDueWatcher,
  repaymentScheduleListWatcher
} from "../../actions/repaymentSchedule";
import {AlertBox} from "../../components/AlertBox";
import DownloadRepaymentScheduleList from "./DownloadRepaymentScheduleList";
import {storedList} from "../../util/localstorage";
import {checkAccessTags} from "../../util/uam";
import Table from "react-sdk/dist/components/Table/Table";
import moment from "moment/moment";
import Pagination from "react-sdk/dist/components/Pagination/Pagination"
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import { Link } from "react-router-dom";

export default function RepaymentScheduleDemographics(props) {
  const {
    open,
    data,
    loanSchemaId,
    onModalClose,
    title,
    openDialog,
    setOpenDialog,
    company,
    product,
    onError,
    ...other
  } = props;

  let columns = [
    {
      id : "loan_id",
      label:"LOAN ID",
      // label : <span style={{marginLeft:"-20px"}}>{"LOAN ID"}</span>,
      // format : exi => (<span style={{marginLeft:"-20px"}}>{exi.loan_id}</span>)
    },
    {
      id: "emi_no",
      label:"INSTALLMENT NO.",
      // label: <span style={{whiteSpace:"nowrap",marginLeft:"-50px"}}>{"INSTALLMENT NO."}</span>,
      // format : exi => (<span>{exi.emi_no}</span>)
    },
    {
      id: "emi_amount",
      label:"AMOUNT DUE",
      format: (rowData) => <div>₹{getVal(rowData?.emi_amount).toLocaleString('en-IN')}</div>
      // label: <span style={{whiteSpace:"nowrap"}}>{"AMOUNT DUE"}</span>,
      // format: exi => `\u20B9${getVal(exi.emi_amount).toLocaleString('en-IN')}`
    },
    {
      id: "principal",
      label: "PRINCIPAL",
      format: (rowData) => <div>₹{getVal(rowData?.prin).toLocaleString('en-IN')}</div>
      // format: exi => `\u20B9${getVal(exi.prin).toLocaleString('en-IN')}`
    },
    {
      id: "interest",
      label: "INTEREST",
      format: (rowData) => <div>₹{getVal(rowData?.int_amount).toLocaleString('en-IN')}</div>
      // format: exi => `\u20B9${getVal(exi.int_amount).toLocaleString('en-IN')}`
    },
    {
      id: "due_date",
      label: "DUE DATE",
      format: rowData => moment(rowData.due_date).format("DD-MM-YYYY")
    },
    {
      id: "action",
      label: "ACTION",
      format: (rowData) => rowData.processed !== "Y" && checkAccessTags(["tag_repayment_schedule_raise_due_write"]) ? <div><Link onClick={() => handleRaiseDue(rowData)}>Raise Due</Link> </div>  : "NA"
      // format: exi => exi.processed !== "Y" && checkAccessTags(["tag_repayment_schedule_raise_due_write"]) &&
      //     (<button style={{
      //       border:"none",
      //       outline:"none",
      //       background:"white",
      //       color:"#475BD8",
      //       fontSize:"14px"
      //     }}
      //         onClick={() => handleRaiseDue(exi)}
      //     >
      //       Raise Due
      //     </button>)
    }
  ]
  const user = storedList("user");
  const [loanId, setLoanId] = useState(data.loan_id);
  const [companyId, setCompanyId] = useState(data.company_id);
  const [productId, setProductId] = useState(data.product_id);
  const [repaymentScheduleList, setRepaymentScheduleList] = useState({});
  const [responseData, setResponseData] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;
  const dispatch = useDispatch();

  const handleChangePage = (newPage) => {
    setPage(newPage);
    const f = newPage * rowsPerPage;
    const l = newPage * rowsPerPage + rowsPerPage;
    const data = responseData.slice(f, l);
    setRepaymentScheduleList(data);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setAlertMessage("");
    setSeverity("");
  };

  const getVal = value => {
    if (value?.$numberDecimal !== undefined) {
      return parseFloat(value.$numberDecimal.toString());
    } else if (typeof value === "object") {
      return parseFloat(value.toString());
    }
    return value;
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  useEffect(() => {
    if (responseData.length) {
      setRepaymentScheduleList(responseData.slice(page * rowsPerPage, (page + 1) * rowsPerPage))
      return
    }
    if (product?.isLoc) fetchRepaymentScheduleListForLoc();
    else fetchRepaymentScheduleList();
  }, [page,rowsPerPage]);

  const fetchRepaymentScheduleList = () => {
    const payload = {
      loan_id: loanId,
      company_id: companyId,
      product_id: productId,
      page: page,
      limit: rowsPerPage
    };
    new Promise((resolve, reject) => {
      dispatch(repaymentScheduleListWatcher(payload, resolve, reject));
    })
      .then(response => {
        if (response.data?.count > 0) {
          setResponseData(response.data.rows);
          setRepaymentScheduleList(response.data.rows.slice(0, rowsPerPage));
          setCount(response.data.count);
          setOpenDialog(true);
        } else if (
          response.data?.count === 0 &&
          response.data?.count !== undefined
        ) {
          setOpenDialog(false);
          onModalClose("No Data Found for this Loan.", "error");
        } else {
          setOpenDialog(false);
          onModalClose(response?.message, "error");
        }
      })
      .catch(error => {
        setOpenDialog(false);
        onModalClose(error?.response?.data?.message, "error");
      });
  };

  const fetchRepaymentScheduleListForLoc = () => {
    const payload = {
      loan_id: loanId,
      company_id: companyId,
      product_id: productId
    };
    new Promise((resolve, reject) => {
      dispatch(repaymentScheduleForLocWatcher(payload, resolve, reject));
    })
      .then(response => {
        if (response?.count > 0) {
          setResponseData(response.rows);
          setRepaymentScheduleList(response.rows.slice(0, rowsPerPage));
          setCount(response.count);
          setOpenDialog(true);
        } else if (response?.count === 0 && response?.count !== undefined) {
          setOpenDialog(false);
          onModalClose("No Data Found for this Loan.", "error");
        } else {
          setOpenDialog(false);
          onModalClose(response?.message, "error");
        }
      })
      .catch(error => {
        setOpenDialog(false);
        onModalClose(error?.response?.data?.message, "error");
      });
  };

  const handleClose = () => {
    setOpenDialog(false);
    onModalClose("", "");
  };

  const handleRaiseDue = data => {
    const params = {
      company_id: data.company_id,
      product_id: data.product_id,
      loan_id: data.loan_id,
      emi_no: data.emi_no
    };
    dispatch(
      repaymentScheduleForRaiseDueWatcher(
        params,
        result => {
          showAlert(result.message, "success");
        },
        error => {
          showAlert(
            error?.response?.data?.message ||
              "error raising repayment date",
            "error"
          );
        }
      )
    );
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
      {openDialog && (
        <FormPopup
              isOpen={openDialog}
              heading="Repayment Schedule List"
              onClose={handleClose}
              customStyles={{width:"85%",height:"80%",display:"block" , overflowY:"auto" }}
              customHeaderStyle={{padding:"0px 16px 0px 16px" }}
        >
          <div style={{marginTop:"-100px",padding:"8px"}}>
            {isTagged ? (
                checkAccessTags(["tag_repayment_schedule_list_export"]) ? (
                    <DownloadRepaymentScheduleList
                        data={responseData}
                        showAlert={showAlert}
                        company={company}
                        product={product}
                        loanId={loanId}
                        disabled={
                          !checkAccessTags(["tag_repayment_schedule_list_export"])
                        }
                    />
                ) : null
            ) : (
                <DownloadRepaymentScheduleList
                    data={responseData}
                    showAlert={showAlert}
                    company={company}
                    product={product}
                    loanId={loanId}
                />
            )}
            {repaymentScheduleList.length ? (
                <Table
                    data={repaymentScheduleList}
                    columns={columns}
                    customStyle={{width:"100%"}}
                >
                </Table>
            ) : null}
            {count && (
                <Pagination
                    onPageChange={(newPage,rowsPerPage) => handleChangePage(newPage,rowsPerPage)}
                    totalItems={count}
                    itemsPerPage={rowsPerPage}
                    showOptions={true}
                    rowsPerPageOptions={[5,10,15]}
                    setRowLimit={setRowsPerPage}
                >
                </Pagination>)}
          </div>
        </FormPopup>)}
    </>
  );
}

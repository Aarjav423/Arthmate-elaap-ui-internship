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
import CustomDatePicker from "../../components/DatePicker/datePickerCustom";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import "react-sdk/dist/styles/_fonts.scss";
import UploadPopup from "react-sdk/dist/components/Popup/UploadPopup";
import { AlertBox } from "../../components/CustomAlertbox";
import { Link } from "react-router-dom";
import { checkAccessTags } from "../../util/uam";
import Preloader from "../../components/custom/preLoader";
import { getBulkUploadDataWatcher, uploadBulkFileWatcher, downloadBulkUploadFileWatcher } from '../../actions/nachBulkUpload';

const user = storedList("user");

const NachBulkUpload = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.profile.loading);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [customDate, setCustomDate] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [count, setCount] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [allowedFileType, setAllowedFileType] = useState("");
  const [fileTypeName, setFileTypeName] = useState("");
  const [fileExtensionType, setFileExtensionType] = useState("");
  const [saving, setSaving] = useState(false);

  const isTagged =
  process.env.REACT_APP_BUILD_VERSION > 1
    ? user?.access_metrix_tags?.length
    : false;

  useEffect(() => {
    getBulkData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  useEffect(()=> {
    getBulkData(0,10);
  },[]);

  const getBulkData = (page, rowsPerPage) => {
    const payload = {
      user_id: user._id,
      fromDate: fromDate,
      toDate: toDate,
      page: page,
      limit: rowsPerPage,
      fileType: Object.keys(displayFileType)
    };
    new Promise((resolve, reject) => {
      dispatch(getBulkUploadDataWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setCount(response?.count);
        setData(response?.data);
      })
      .catch((error) => {
        showAlert(error.response.data?.message, "error");
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
    if (checkAccessTags(["tag_nach_portal_bulk_upload_w"]) || ( fileTypeName == "transaction_confirmation" && checkAccessTags(["tag_nach_portal_bulk_upload_transaction_confirmation_w"])) || ( fileTypeName == "bank_mandate_acknowledgement" && checkAccessTags(["tag_nach_portal_bulk_upload_bank_mandate_acknowledgement_w"]))) {
      const data = {
        user_id: user._id,
        base64: fileBase64.toString(),
        file_type: fileTypeName,
        file_name: fileName,
        file_extension_type: fileExtensionType
      };
      new Promise((resolve, reject) => {
        dispatch(uploadBulkFileWatcher(data, resolve, reject));
      })
      .then(() => {
        showAlert("File uploaded", "success");
        setSaving(false);
        setIsOpen(!isOpen);
        setFileBase64("");
        setFile(null);
        setFileName("");
        setPage(0);
        setRowsPerPage(10);
        getBulkData(0, 10);
      })
      .catch(error => {
        showAlert(error.response.data.message, "error");
        setSaving(false);
        setFileBase64("");
        setFile(null);
        setFileName("");
      });
    }
  };

  const handleClose = () => {
    setIsOpen(!isOpen);
    setFileBase64("");
    setFile(null);
    setFileName("");
    setFileExtensionType("");
  };

  const handleFiletypeChange = (value) => {
    if(value.label === "Transaction Confirmation") {
      setFileTypeName("transaction_confirmation");
      setAllowedFileType(".xlsx")
      setFileExtensionType("xlsx");
    }
    if(value.label === "Bank Mandate Acknowledgement") {
      setFileTypeName("bank_mandate_acknowledgement");
      setAllowedFileType(".xlsx")
      setFileExtensionType("xlsx");
    }
  };

  const renderUploadFile = () => (
    <UploadPopup
      heading="Upload File"
      isOpen={isOpen}
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
    <div style={{marginBottom:"32vh",display:"flex",flexDirection:"column",alignItems:"center"}}>
    <InputBox
        label="Select File type"
        isDrawdown={true}
        initialValue={""}
        options={uploadFileType}
        customClass={{
          minWidth: "100%",
          height: "56px",
          borderRadius: "8px",
          float:"left",
          fontSize : "17px",
          marginBottom: "10px"
        }}
        customDropdownClass={{marginTop:"8px", zIndex:"1" }}
        onClick={handleFiletypeChange}
    >
    </InputBox>
    </div>
    </UploadPopup>
  )

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleChangePage = (event) => {
    setPage(event);
  };

  const handleFileDownload = (id) => {
    let data = {
      id: id,
      user_id: user._id,
    }
    new Promise((resolve, reject) => {
      dispatch(downloadBulkUploadFileWatcher(data, resolve, reject));
    })
      .then((response) => {
        window.open(response, '_blank');
      })
      .catch((error) => {
        showAlert(error.response.data.message, "error");
      });
  };

  const handleSearch = () => {
    getBulkData(page, rowsPerPage);
  };

  const columns = [
    {
      id: "REQUEST ID",
      label: <span style={{ marginLeft: "-24px" }}>{"FILE NAME"}</span>,
      format: (row) => (
        <span style={{ marginLeft: "-24px" }}>
          <Link onClick={() => handleFileDownload(row._id)}> {row.file_name} </Link>
        </span>
      )
    },
    { id:"file_type", label: "FILE TYPE",
      format: (row) => {
        return displayFileType[row.file_type]
      }      
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
    { id: "total_success_records", label: (<div style={{ fontSize: "13px" }}>SUCCESSFUL <br /> RECORDS</div>) },
    { id: "total_failure_records", label: (<div style={{ fontSize: "13px" }}>FAILED <br /> RECORDS</div>) },
    { id: "validation_status", label: "FILE STATUS" },
    { id: "record_status", label: "RECORD STATUS" },
  ];

  return (
    <>
      {isOpen ? renderUploadFile() : null}
      <div style={{ margin: "0px 24px 24px 24px" }} >
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
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
              onClick={handleSearch}
            />
          </div>
          <div>
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
                  setIsOpen(!isOpen)
                }}
                isDisabled={(isTagged && checkAccessTags(["tag_nach_portal_bulk_upload_w", "tag_nach_portal_bulk_upload_transaction_confirmation_w", "tag_nach_portal_bulk_upload_bank_mandate_acknowledgement_w"])) ? false: true}
              />
          </div>
        </div>
        <div>
          <Table
              customStyle={{
                display: "grid",
                gridTemplateColumns: "16% 15% 10% 13% 7% 9% 9% 10% 11%",
                fontFamily: 'Montserrat-Medium',
                overflow: "hidden",
                width: "100%",
                wordBreak: "break-all"
              }}
              data={data}
              columns={columns}
            />
            <Pagination
              itemsPerPage={rowsPerPage}
              totalItems={count}
              rowsPerPageOptions={[10, 20, 30]}
              onPageChange={handleChangePage}
              showOptions={true}
              setRowLimit={setRowsPerPage} />
        </div>
        {isLoading && <Preloader />}
      </div>
    </>
  );
};

const uploadFileType = [
  { label : "Transaction Confirmation" },
  { label : "Bank Mandate Acknowledgement" },
]

const displayFileType = {
  "transaction_confirmation": "Transaction Confirmation",
  "bank_mandate_acknowledgement" : "Bank Mandate Acknowledgement",
};

export default NachBulkUpload;
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {downloadUTRReportsWatcher} from "../../actions/reports";
import {AlertBox} from "../../components/AlertBox";
import {colendersListWatcher, getUTRfilesWatcher, utrUploadWatcher} from "../../actions/colenders.js";
import {downloadDataInXLSXFormat} from "../../util/helper";
import moment from "moment";
import {checkAccessTags} from "../../util/uam";
import {storedList} from "../../util/localstorage";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button/Button"
import Table from "react-sdk/dist/components/Table/Table"
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import UploadPopup from "react-sdk/dist/components/Popup/UploadPopup";
import Img from "../lending/images/document-upload.svg";
import Imgh from "../lending/images/document-upload.svg";

const BulkUpload = () => {
  const user = storedList("user")
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [filter, setFilter] = useState("");
  const [column, setColumn] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [file, setFile] = useState(null);
  const [filetype_name, setFileType_name] = useState("");
  const [fileName, setFileName] = useState("");
  const [co_lender_name, setCo_lender_name] = useState("");
  const [colendersList, setColendersList] = useState("");
  const [colenderShortCode, setColenderShortCode] = useState("");
  const [colenderNames, setColenderNames] = useState([]);
  const [allowedFileType, setAllowedFileType ] = useState("")
  const [saving, setSaving] = useState(false);
  const [utrFiles, setUtrFiles] = useState([]);
  const [utrFilesList, setUtrfilesList] = useState([]);
  const [isOpen, setisOpen] = useState(false);
  const [isOpenRemarks, setIsOpenRemarks] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [openDialog,setOpenDialog]=useState(false);
  const [openDialogRemarks, setOpenDialogRemarks] = useState(false);
  const isTagged =
      process.env.REACT_APP_BUILD_VERSION > 1
          ? user?.access_metrix_tags?.length
          : false;
  const columns = [
    {
      label : (<span style={{fontSize:"15px"}}>{"FILE NAME"}</span>),
      format : fileDetail => (<>
          <style>
              {`
                div.namespan {
                    white-space: nowrap; 
                    overflow: hidden; 
                    color: #475BD8;
                    width: 110.4px;
                    max-width : 110.4px;
                    text-overflow: ellipsis;
                }
                div.namespan .link {
                    display:"flex";
                    visibility: hidden;
                    color:white;
                    background-color: #152067;
                    text-align: center;
                    border-radius: 8px;
                    padding: 5px 0;
                    position: absolute;
                    z-index: 1;
                    padding: 10px;
                    left: 5%;
                    margin-top: -4%;
                }
                div.namespan .link::after {
                    content: " ";
                    position: absolute;
                    top: 100%;
                    left: 18%;
                    margin-left: -10px;
                    border-width: 10px;
                    border-style: solid;
                    border-color: #152067 transparent transparent transparent;
                }
                div.namespan:hover .link {
                    visibility: visible;
                }
              `}
          </style>
          <div className="namespan">
              <span
                  onClick={()=> downloadDisbursementReport(fileDetail._id,fileDetail.file_name)}
                  style={{
                      pointerEvents: (fileDetail.file_type === 2 || fileDetail.file_type === 3 || fileDetail.is_approved) ? "" : "none",
                      color: !(fileDetail.file_type === 2 || fileDetail.file_type === 3 || fileDetail.is_approved) ? "black" : "#5e72e4"
              }}
              >
                  {fileDetail.file_name}
              </span>
              <span className="link">{fileDetail.file_name}</span>
          </div>
      </>)
    },
    {
      label :(<span style={{marginLeft:"-25px",fontSize:"15px"}}>{"FILE TYPE"}</span>),
      format : fileDetail => (
          <>
              <style>
                  {`
                    div.filetype {
                        white-space: nowrap; 
                        overflow: hidden; 
                        width: 110.4px;
                        max-width : 110.4px;
                        text-overflow: ellipsis;
                        margin-left:-40px;
                    }
                    div.filetype .filespan {
                        display:"flex";
                        visibility: hidden;
                        color:white;
                        background-color: #152067;
                        text-align: center;
                        border-radius: 8px;
                        padding: 5px 0;
                        position: absolute;
                        z-index: 1;
                        padding: 10px;
                        left: 15%;
                        margin-top: -4%;
                    }
                    div.filetype .filespan::after {
                        content: " ";
                        position: absolute;
                        top: 100%;
                        left: 18%;
                        margin-left: -10px;
                        border-width: 10px;
                        border-style: solid;
                        border-color: #152067 transparent transparent transparent;
                    }
                    div.filetype:hover .filespan {
                        visibility: visible;
                    }
                  `}
              </style>
              <div className="filetype">
                  {filterFileType.find(file => fileDetail.file_type == file.value)?.label ?? "NA"}
                  <span className="filespan">
                      {filterFileType.find(file => fileDetail.file_type == file.value)?.label}
                  </span>
              </div>
          </>)
    },
    {
      label : (<span style={{fontSize:"15px"}}>{"CO-LENDER"}</span>),
      format : fileDetail => (
          <>
              <style>
                  {`
                    div.colender {
                        white-space: nowrap; 
                        overflow: hidden; 
                        width: 110.4px;
                        max-width : 110.4px;
                        text-overflow: ellipsis;
                    }
                    div.colender .colenderspan {
                        display:"flex";
                        visibility: hidden;
                        color:white;
                        background-color: #152067;
                        text-align: center;
                        border-radius: 8px;
                        padding: 5px 0;
                        position: absolute;
                        z-index: 1;
                        padding: 10px;
                        left: 28%;
                        margin-top: -4%;
                    }
                    div.colender .colenderspan::after {
                        content: " ";
                        position: absolute;
                        top: 100%;
                        left: 18%;
                        margin-left: -10px;
                        border-width: 10px;
                        border-style: solid;
                        border-color: #152067 transparent transparent transparent;
                    }
                    div.colender:hover .colenderspan {
                        visibility: visible;
                    }
                  `}
              </style>
              <div className="colender">
                  {fileDetail.co_lender_name}
                  <span className="colenderspan">
                      {fileDetail.co_lender_name}
                  </span>
              </div>
          </>)
    },
    {
      label : (<span style={{whiteSpace:"nowrap",fontSize:"15px"}}>{"UPLOAD DATE"}</span>),
      format : fileDetail => (<span>{moment(fileDetail.created_at).format("DD-MM-YYYY")}</span>)
    },
    {
      label : (<span style={{fontSize:"15px"}}>{"#RECORDS"}</span>),
      format : fileDetail => (<span>{fileDetail.total_records}</span>)
    },
    {
      label : (<span style={{fontSize:"15px"}}>{"#SUCCESSFUL RECORDS"}</span>),
      format : fileDetail => (<span>{fileDetail.total_success_records}</span>)
    },
    {
      label : (<span style={{fontSize:"15px"}}>{"#FAILED RECORDS"}</span>),
      format : fileDetail => (<span>{fileDetail.total_failure_records}</span>)
    },
    {
      label : (<span style={{fontSize:"15px"}}>{"VALIDATION STATUS"}</span>),
      format : fileDetail => (<span>{validationStatus[fileDetail.validation_status]}</span>)
    },
    {
      label : (<span style={{fontSize:"15px"}}>{"REMARK"}</span>),
      format : fileDetail => (
          <>
              <style>
                  {`
                    div.remark::before {
                      display: flex;
                      justify-content: center;
                      content: "!";
                      border-radius: 60%;
                      border: 1px solid #475BD8;
                      width: 1.375rem;
                      height: 1.375rem;
                      text-align: center;
                      color: #475BD8;
                      font-weight: 600;
                    }
                  `}
              </style>
              <div className="remark"
                   onClick={() => {
                       setIsOpenRemarks(!isOpenRemarks)
                       setOpenDialogRemarks(!openDialogRemarks)
                       handleRemarks(fileDetail)
                   }}
              >
              </div>
          </>
)}
  ]

  const validationStatus = {
    0: "Approved",
    1: "Fail",
    2: "Success",
    3: "Awaiting for approval",
    4: "Rejected"
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  React.useEffect(() => {
    if (
        isTagged &&
        checkAccessTags([
          "tag_colending_bulk_upload_read",
          "tag_colending_bulk_upload_read_write"
        ])
    )
      fetchUTRfilesList();
    if (!isTagged) fetchUTRfilesList();
  }, []);

  const fetchUTRfilesList = () => {
    const payload = {};
    new Promise((resolve, reject) => {
      dispatch(getUTRfilesWatcher(payload, resolve, reject));
    })
        .then(response => {
          setUtrFiles(response.rows.sort((a,b)=>a._id < b._id ? 1 : -1));
          setUtrfilesList(response.rows.sort((a,b)=>a._id <b._id ? 1 : -1));
        })
        .catch(error => {
          showAlert(error.response.data.message, "error");
        });
  };

  React.useEffect(() => {
    fetchColendersList();
  }, []);

  const compare = (a, b) => {
    if (a.co_lender_name < b.co_lender_name) {
      return -1;
    }
    if (a.co_lender_name > b.co_lender_name) {
      return 1;
    }
    return 0;
  };

  const fetchColendersList = (value) => {
    const payload = {};
    let names = [];
    let shortCode = [];
    if(!value || value !== "CBI Approval File") {
      new Promise((resolve, reject) => {
        dispatch(colendersListWatcher(payload, resolve, reject));
      })
          .then(res => {
            for (let i = 0; i < res.length; i++) {
              names.push(res[i].co_lender_name);
              shortCode.push(res[i].co_lender_shortcode);
            }
            const sortedArray = names.sort();
            const sortByCode = shortCode.sort();
            setColenderShortCode(sortByCode);
            setColenderNames(sortedArray);
            setColendersList(res.sort(compare));
          })
          .catch(error => {
            showAlert(error.res.data.message, "error");
          });
    } else {
      new Promise((resolve, reject) => {
        dispatch(colendersListWatcher(payload, resolve, reject));
      })
          .then(res => {
            res.filter(ele => process.env.REACT_APP_CO_LENDER_SHORTCODE.includes(ele.co_lender_shortcode))
                .map(ele => {
                  names.push(ele.co_lender_name);
                  shortCode.push(ele.co_lender_shortcode);
                })
            const sortedArray = names.sort();
            const sortByCode = shortCode.sort();
            setColenderShortCode(sortByCode);
            setColenderNames(sortedArray);
            setColendersList(res.sort(compare));
          })
          .catch(err => showAlert(err.res.data.message, "error"))
    }
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleFilterChange = e => {
    setFilter(e.value)
    setColumn(null)
  };

  const handleColumnChange = e => {
    setColumn(e.value);
    setUtrFiles(utrFilesList);
  };

  const handleFiletypeChange = (value) => {
    if(value.label === "Escrow UTR") {
      setFileType_name("ESCROW_UTR");
      setAllowedFileType(".xlsx")
    }
    if(value.label === "Borrower UTR") {
      setFileType_name("BORROWER_UTR");
      setAllowedFileType(".xlsx")
    }
    if(value.label === "CBI Approval File") {
      setFileType_name("CBI_APPROVAL_FILE");
      setAllowedFileType(".xlsx")
    }
    if(value.label === "Repayment Schedule") {
      setFileType_name("REPAYMENT_SCHEDULE");
      setAllowedFileType(".txt")
    }
    if(value.label === "Loan Mapping File") {
      setFileType_name("LOAN_MAPPING_FILE");
      setAllowedFileType(".xlsx")
    }
    fetchColendersList(value.label) // fetch co-lender-list based on file type
  };

  const handleReset = () => {
    setColumn("");
    setFilter("");
    setUtrFiles(utrFilesList);
  };

  const handleRemarks = (data) => {
    setRemarks(data.rejection_remarks)
  };

  const filterData = item => {
    if (filter === "file_type" && item.file_type == column) {
      return true
    }
    if (filter === "co_lender" && item.co_lender_name.trim() == column.trim()) {
      return true
    }
    if (filter === "upload_date" && column.trim() === moment(item.created_at).format("DD-MM-YYYY")) {
      return true
    }
    return false
  };

  const handleSearch = () => {
    if (column != 0 && !column) {
      showAlert("Please enter value", "error");
    } else if (!filter) {
      showAlert("Please select filter", "error");
    } else if (!filter && !column) {
      showAlert("Please select filter", "error");
    } else {
      setUtrFiles(utrFilesList.filter(filterData));
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const downloadDisbursementReport = (id, name) => {
    let payload = {
      id: id
    };
    new Promise((resolve, reject) => {
      dispatch(downloadUTRReportsWatcher(payload, resolve, reject));
    })
        .then(response => {
          return downloadDataInXLSXFormat(name, response);
        })
        .catch(error => {
          showAlert(error?.response?.data?.message, "error");
        });
  };

  const handleChange = async function(colender) {
    setCo_lender_name(colender.label)
    setColenderShortCode(colender.code)
  };

  const [fileBase64, setFileBase64] = useState("");
  const handleClick = () => {
    if (!filetype_name) {
      showAlert("Please select file type", "error");
    } else if (!co_lender_name) {
      showAlert("Please select Colender", "error");
    }
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

  const handleSubmit = () => {
    handleClick()
    if (!co_lender_name) {
      showAlert("Please enter data in manditory fields ", "error");
    } else {
      const data = {
        file: fileBase64.toString(),
        co_lender_name: co_lender_name,
        co_lender_shortcode: colenderShortCode,
        file_type: filetype_name,
        file_name: fileName
      };
      new Promise((resolve, reject) => {
        dispatch(utrUploadWatcher(data, resolve, reject));
      })
          .then(() => {
            showAlert("File uploaded", "success");
            setSaving(false);
            window.open(`/admin/co_lending/bulk_upload`, "_self");
          })
          .catch(error => {
            showAlert(error.response.data.message, "error");
            setSaving(false);
          });
    }
  };

  const handleClose = () => {
    setOpenDialog(!openDialog);
    setisOpen(!isOpen);
    setFileBase64("");
    setFile(null);
    setFileName("");
  };

  const handleCloseRemarks = () => {
    setIsOpenRemarks(!isOpenRemarks)
    setOpenDialogRemarks(!openDialogRemarks);
  };

  const renderBulkUploadFile = () => (
    <UploadPopup
        heading="Bulk Upload File"
        isOpen={true}
        onClose={handleClose}
        customStyles={{
            height:"100vh",
            position:"absolute",
            width:"543px",
            right:0,
            top:0,
            zIndex:1,
            display:"flex",
            flexDirection:"column",
            justifyContent:"space-between"
        }}
        accept={allowedFileType}
        onUpload={handleSubmit}
        onFileSelect={handleFileChange}
        filename={fileName}
    >
      <div style={{marginBottom:"15vh",display:"flex",flexDirection:"column",alignItems:"center",gap:25}}>
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
        <InputBox
            label="Select Co-lender"
            isDrawdown={true}
            initialValue={""}
            options={colendersList.map(colender => {
              return {
                label : colender.co_lender_name,
                code : colender.co_lender_shortcode
              }
            })}
            customClass={{
              minWidth: "100%",
              height: "56px",
              borderRadius: "8px",
              float:"left",
              fontSize : "17px"
            }}
            customDropdownClass={{marginTop:"8px", zIndex:"1" }}
            onClick={handleChange}
        >
        </InputBox>
      </div>
    </UploadPopup>
  )

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        {alert ? (
          <AlertBox
              severity={severity}
              msg={alertMessage}
              onClose={handleAlertClose}
          />
        ) : null}
      </div>
      {openDialogRemarks && (
        <FormPopup
            onClose={handleCloseRemarks}
            isOpen={openDialogRemarks}
            heading={"Remarks"}
        >
          <span>{remarks}</span>
        </FormPopup>
      )}
      <div style={{display:"flex",marginLeft:"16px",marginTop:"16px",flexDirection:"column"}}>
        {isOpen ? renderBulkUploadFile() : null}
          <div style={{marginLeft:"16px",display:"flex",flexDirection:"column"}}>
              <div>
                  <div style={{float:"left",display:"flex",gap:"16px"}}>
                      <InputBox
                          label="Filter"
                          isDrawdown={true}
                          options={filters}
                          onClick={handleFilterChange}
                          initialValue={""}
                          customClass={{
                              width: "220px",
                              height: "56px",
                              borderRadius: "8px",
                              fontSize : "17px"
                          }}
                          customDropdownClass={{marginTop:"8px", zIndex:"1" }}
                      >
                      </InputBox>
                      {filter === "file_type" ? (
                          <InputBox
                              label="Filter"
                              isDrawdown={true}
                              options={filterFileType}
                              onClick={handleColumnChange}
                              initialValue={""}
                              customClass={{
                                  width: "220px",
                                  height: "56px",
                                  borderRadius: "8px",
                                  fontSize : "17px",
                              }}
                              customDropdownClass={{marginTop:"8px", zIndex:"1"}}
                          >
                          </InputBox>
                      ) : (
                          <InputBox
                              label="Value"
                              onClick={handleColumnChange}
                              initialValue={column}
                              customClass={{
                                  width: "220px",
                                  height: "56px",
                                  borderRadius: "8px",
                                  fontSize : "17px",
                              }}>
                          </InputBox>
                      )}
                      <Button
                          label="Search"
                          buttonType="primary"
                          onClick={handleSearch}
                          customStyle={{
                              width: "120px",
                              height: "56px",
                              borderRadius: "8px",
                              fontSize : "15px"
                          }}
                      >
                      </Button>
                      <Button
                          label="Reset"
                          buttonType="secondarys"
                          onClick={handleReset}
                          customStyle={{
                              width: "120px",
                              height: "56px",
                              color: "#475BD8",
                              borderRadius: "8px",
                              backgroundColor:"#FFFFFF",
                              fontSize : "15px",
                              marginLeft:"-6px",
                              borderRadius: "8px",
                              border: "1px solid #475BD8"
                          }}
                      >
                      </Button>
                  </div>
                  <div style={{float:"right",marginRight:"25px"}}>
                      <Button
                          imageButton={Img}
                          imageButtonHover={Imgh}
                          iconButton='btn-secondary-download-button'
                          label="Upload Bulk File"
                          buttonType="primary"
                          customStyle={{
                              width: "220px",
                              height: "56px",
                              padding: "0px 0px 0px 0px",
                              borderRadius: "8px",
                              fontSize : "15px",
                              display:"flex"
                          }}
                          onClick={() => {
                              setisOpen(!isOpen)
                              setOpenDialog(!openDialog)}}
                          disabled={isTagged && !checkAccessTags(["tag_colending_bulk_upload_read_write"])}
                      >
                      </Button>
                  </div>
              </div>
              {utrFiles.length ? (
                  <div>
                      <Table
                          data={utrFiles.slice(page * rowsPerPage, (page + 1) * rowsPerPage)}
                          columns={columns}
                          customStyle={{width:"98%"}}
                      >
                      </Table>
                  </div>
              ) : null}
              {utrFiles.length ? (
                  <div>
                      <Pagination
                          onPageChange={(newPage) => handleChangePage(newPage,rowsPerPage)}
                          totalItems={utrFiles.length}
                          itemsPerPage={rowsPerPage}
                          showOptions={true}
                          rowsPerPageOptions={[5,10,15]}
                          setRowLimit={setRowsPerPage}
                      >
                      </Pagination>
                  </div>
              ) : null}
          </div>
      </div>
    </>
  )};

const filters = [
  { label : "File type", value : "file_type" },
  { label : "Co-lender", value : "co_lender" },
  { label : "Upload date", value: "upload_date" },
]

const filterFileType = [
  { label : "Escrow UTR Upload", value : "0" },
  { label : "Borrower UTR Upload", value : "1" },
  { label : "CBI Approval File", value : "2" },
  { label : "Repayment Schedule File", value : "3" },
  { label : "Loan Mapping File", value : "4" }
]

const uploadFileType = [
  { label : "Escrow UTR" },
  { label : "Borrower UTR" },
  { label : "CBI Approval File" },
  { label : "Repayment Schedule" },
  { label : "Loan Mapping File" }
]
export default BulkUpload;
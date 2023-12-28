import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@material-ui/core/styles";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import IconButton from "@mui/material/IconButton";
import moment from "moment";
import { storedList } from "../../util/localstorage";
import {
  colendersListWatcher,
  submitFileUploadApprovalWatcher
} from "../../actions/colenders.js";
import { checkAccessTags } from "../../util/uam";
import { AlertBox } from "../../components/AlertBox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import { SelectAll } from "@material-ui/icons";
import TextField from "@mui/material/TextField";
const { getBulkApprovalFiles } = require("../../apis/colenders");
import { verifyDateAfter1800 } from "../../util/helper";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button/Button";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import Table from "react-sdk/dist/components/Table/Table";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import FrontPageImage from "../lending/images/newleadloanscreen.svg";

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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = props => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white"
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const bulkUploadApproval = () => {
  const [colenderNames, setColenderNames] = useState([]);
  const user = storedList("user");
  const [product, setProduct] = useState([]);
  const [productsArray, setProductArray] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [colendersList, setColendersList] = useState("");
  const [co_lender, setColender] = React.useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [colenderShortCode, setColenderShortCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [productId, setProductId] = useState("");
  const [enableSearch, setEnableSearch] = useState(false);
  const [colenderLoans, setColenderLoans] = useState("");
  const [colendLoans, setColendLoans] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [alert, setAlert] = useState(false);
  const [filetype_name, setFileType_name] = useState("");
  const [utrFilesList, setUtrfilesList] = useState([]);
  const [utrFiles, setUtrFiles] = useState([]);
  const [filetype, setFiletype] = useState([
    "Escrow UTR",
    "Borrower UTR",
    "CBI Approval File",
    "Repayment Schedule",
    "Loan Mapping File"
  ]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isOpenRemarks, setIsOpenRemarks] = useState(false);
  const [openDialogRemarks, setOpenDialogRemarks] = useState(false);
  const [column, setColumn] = useState("");
  const [validation, setValidation] = useState(3);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [payloadData, setPayloadData] = useState("");
  const [checked, setChecked] = useState([]);
  const fileTypes = {
    0: "Escrow UTR",
    1: "Borrower UTR",
    2: "CBI Approval File",
    3: "Repayment Schedule",
    4: "Loan Mapping File"
  };

  const fileTypeNumber = {
    ESCROW_UTR: 0,
    BORROWER_UTR: 1,
    CBI_APPROVAL_FILE: 2,
    REPAYMENT_SCHEDULE: 3,
    LOAN_MAPPING_FILE: 4
  };

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleSearch = async () => {
    if (!colenderShortCode) return showAlert("Please select Co-lender", "error");
    if (!filetype_name) return showAlert("Please select File Type", "error");
    if(!fromDate) return showAlert("Please select From and To Date","error");
    const response = await getBulkApprovalFiles(
      colenderShortCode,
      fileTypeNumber[filetype_name],
      validation,
      fromDate,
      toDate
    );
    const data = response.data;
    setUtrFiles(
      data.uploadAllFiles.map(item => {
        return {
          ...item,
          checked: false
        };
      })
    );
    setSelectAll(false);
    setPage(0);
    if (data?.uploadAllFiles.length === 0){
      showAlert("No data Available","error")
    }
  };

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (user?.type === "co-lender") {
      handleChange(null, "co-lender", user.co_lender_name, "selectOption");
      setColender(user?.co_lender_name);
    }
    if (
      isTagged &&
      checkAccessTags([
        "tag_disbursement_approval_read",
        "tag_disbursement_approval_read_write"
      ])
    )
      fetchColendersList();
    if (!isTagged) fetchColendersList();
  }, [colenderLoans]);

  function labelItem(item) {
  return {"label":item,"value":item};
  }

  const fetchColendersList = () => {
    const payload = {};
    let names = [];
    new Promise((resolve, reject) => {
      dispatch(colendersListWatcher(payload, resolve, reject));
    })
      .then(res => {
        for (var i = 0; i < res?.length; i++) {
          names.push(res[i].co_lender_name);
        }
        const sortedArray = names?.sort();
        const  colenderNamesObject= sortedArray.map(labelItem);
        setColenderNames(colenderNamesObject);
        setColendersList(res);
      })
      .catch(err => {
        showAlert(err.res.data.message, "error");
      });
  };

  const handleChange = async (event, label, value, reason) => {
    setColender(value);
    const indexOfColender = colendersList
      ? colendersList?.map(e => e.co_lender_name).indexOf(value)
      : null;
    const co_lender = colendersList[indexOfColender];
    const co_lender_id = co_lender?.co_lender_shortcode;
    setColenderShortCode(co_lender_id);
    setCompanyName(null);
    setSelectedProduct("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(event);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClear = () => {
    setColumn("");
  };

  const handleFiletypeChange = (event, value) => {
    if (value === "Escrow UTR") setFileType_name("ESCROW_UTR");
    if (value === "Borrower UTR") setFileType_name("BORROWER_UTR");
    if (value === "CBI Approval File") setFileType_name("CBI_APPROVAL_FILE");
    if (value === "Repayment Schedule") setFileType_name("REPAYMENT_SCHEDULE");
    if (value === "Loan Mapping File") setFileType_name("LOAN_MAPPING_FILE");
  };

  const handleCloseRemarks = () => {
    setIsOpenRemarks(!isOpenRemarks);
    setOpenDialogRemarks(!openDialogRemarks);
  };

  const handleColumnChange = e => {
    setColumn(e.target.value);
  };

  const isRemarksEmpty = column.trim() === '';

  const renderCommentPopup = () => (
    <> 
    <FormPopup
          customStyles={popupContainerStyles}
          heading="Reject"
          isOpen={openDialogRemarks}
          onClose={handleCloseRemarks}
        >
          <TextField
          sx={{ mt: 8,width: "100%", height: "128px" }}
          id="outlined-basic"
          label="Reason"
          variant="outlined"
          multiline 
          rows={4}   
          value={column}
          onChange={handleColumnChange}
        />
          <div
          style={{
            display: "flex"
          }}
        >
          <Button
            label="Cancel"
            buttonType="secondary"
            customStyle={{
              width:"100%",
              height: "48px",
              padding: "13px 44px",
              borderRadius: "8px",
              border: "1px solid #475BD8",
              marginTop:"63vh",
              color:"#475BD8"
            }}
            onClick={handleCloseRemarks}
          />
          <Button
            label="Reject"
            buttonType="secondary"
            isDisabled={isRemarksEmpty}
            customStyle={{
              width:"100%",
              height: "48px",
              padding: "13px 44px",
              borderRadius: "8px",
              backgroundColor: "#C00",
              borderColor:"#C00",
              color: "#fff",
              marginTop:"63vh"
            }}
            onClick={handleReject}
          />
        </div>
      </FormPopup>
    </>
  );

  const handleApprove = () => {
    let payload = [];
    selectedRecords.map(record => {
      (record.validation_status = 0),
        (record.rejection_remarks = ""),
        (record.updated_by = user.email);
      record.user_id = user._id;
      payload.push(record);
    });
    setPayloadData(payload);
    dispatch(
      submitFileUploadApprovalWatcher(
        payload,
        response => {
          handleSearch();
          showAlert("Saved", "success");
        },
        error => {
          showAlert(error?.response?.data?.message, "error");
        }
      )
    );
    setSelectAll(!SelectAll);
    setSelectedRecords([]);
  };

  const handleReject = () => {
    let payload = [];
    selectedRecords.map(record => {
      (record.validation_status = 4),
        (record.rejection_remarks = column),
        (record.updated_by = user.email);
      record.user_id = user._id;
      payload.push(record);
    });
    setPayloadData(payload);
    setIsOpenRemarks(!isOpenRemarks);
    setOpenDialogRemarks(!openDialogRemarks);
    dispatch(
      submitFileUploadApprovalWatcher(
        payload,
        response => {
          handleSearch();
          showAlert("Saved", "success");
        },
        error => {
          showAlert(error?.response?.data?.message, "error");
        }
      )
    );
    setSelectAll(!SelectAll);
    setSelectedRecords([]);
  };

  React.useEffect(
    () => {
      if (utrFiles?.length && selectedRecords?.length === utrFiles?.length) {
        setSelectAll(true);
      }
      if (selectedRecords?.length == 0) {
        setSelectAll(false);
      }
    },
    [selectedRecords],
    [utrFiles]
  );

  const handleSelectAll = data => {
    if (data?.target?.checked) {
      setSelectAll(!selectAll);
      setSelectedRecords(
        utrFiles.map(item => {
          return {
            ...item,
            checked: !selectAll
          };
        })
      );
      setUtrFiles(
        utrFiles.map(item => {
          return {
            ...item,
            checked: !selectAll
          };
        })
      );
    }
    if (!data?.target?.checked) {
      setSelectAll(!selectAll);
      setUtrFiles(
        utrFiles.map(item => {
          return {
            ...item,
            checked: !selectAll
          };
        })
      );
      setSelectedRecords([]);
    }
  };

  const handleSingleRecord = (data, event) => {
    let newRecords = [...utrFiles];
    const rowToChange = newRecords.findIndex(item => {
      return item._id === data._id;
    });
    newRecords[rowToChange].checked = !newRecords[rowToChange].checked;
    setUtrFiles(newRecords);
    if (event?.target?.checked) {
      setSelectedRecords([...selectedRecords, data]);
    }
    if (!event?.target?.checked) {
      let selectedFiles = [...selectedRecords];
      const index = selectedFiles.findIndex(item => {
        return item._id === data._id;
      });
      selectedFiles.splice(index, 1);
      setSelectedRecords(selectedFiles);
      setSelectAll(false);
    }
  };
 
  const sampleData = utrFiles &&
                      utrFiles
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((data, index) => ({
    "Select All":<div style={{cursor:"pointer"}} >
      <Checkbox color="primary" checked={data?.checked} onChange={e => handleSingleRecord(data, e)}/>
      </div>,
    "FILE NAME":data.file_name,
    "FILE TYPE":fileTypes[data.file_type],
    "UPLOAD DATE": data.created_at? moment(data.created_at).format("YYYY-MM-DD"): "",
    "CO-LENDER": data.co_lender_name
  }));

  const popupContainerStyles = {
    position: "fixed",
    top: "50%",
    right: 0, // Align the popup to the right
    transform: "translateY(-50%)",
    overflow:"hidden",
   // Use the full viewport height
    width:"27%" ,
    maxWidth:"27%",
   // Set the desired width
  // Allow the popup to expand as needed
    zIndex: 100000000,
    marginLeft:"23%",
    maxHeight:"100%",
    height:"100%"
    // overflow: "auto" // Ensure the popup is on top of other content

  };
  const inputBoxCss={
      marginTop:"8px",
      width:"210px",
      maxHeight:"500px",
      zIndex:1
	  }
  const inputBoxCssRemarks = {
    height: "128px",
    maxWidth:"500px",
    padding: "0px 16px",
    marginTop: "100px"
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
    marginTop:"70px"
  };

  const imageStyle = {
    marginTop:"5vh",
    width: '100%',
    maxWidth: '400px',
    height: 'auto',
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
      {isOpenRemarks ? renderCommentPopup() : null}
      <div>
        <div style={{display:"flex", flexDirection:"row",marginTop:"20px"}}>
          <div>
            <InputBox 
                label="Co-Lender"
                isDrawdown={user?.type === "co-lender" ? false : true}
                options={colenderNames}
                onClick={(event, value, reason) => {
                  setProduct([]);
                  handleChange(event, "co-lender", event.value, reason);
                }}
                customClass={{height:"58px",marginLeft:"24px",width:"210px"}}
                customDropdownClass={inputBoxCss}
                initialValue ={user?.type === "co-lender" ? user?.co_lender_name : co_lender}
                isDisabled={user?.type === "co-lender" ? true : false}
            />
          </div>
          <div>
            <InputBox 
                label="File type"
                isDrawdown={true}
                options={filetype.map(labelItem)}
                onClick={(event, value) => handleFiletypeChange(event, event.value)}
                customClass={{height:"58px",marginLeft:"16px",width:"210px"}}
                customDropdownClass={inputBoxCss}
            />
          </div>
          <div style={{ width:"200px",marginLeft:"16px"}}>
              <BasicDatePicker
                placeholder="From date"
                disabled={!co_lender}
                value={fromDate}
                onDateChange={date => {
                  if (date == null) {
                    setFromDate(null);
                  } else {
                    setFromDate(
                      verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                        ? moment(date).format("YYYY-MM-DD")
                        : date
                    );
                  }
                }}
              />
            </div>
            <div style={{ width:"200px",marginLeft:"16px"}}>
              <BasicDatePicker
                disabled={!fromDate}
                placeholder="To date"
                value={fromDate && toDate ? toDate : null}
                onDateChange={date => {
                  if (date == null) {
                    setToDate("");
                  } else {
                    setToDate(
                      verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                        ? moment(date).format("YYYY-MM-DD")
                        : date
                    );
                  }
                }}
              />
          </div>
          <div style={{marginLeft:"16px"}}>
             <Button label="Search" 
              buttonType="primary" 
              customStyle={{height:"58px",width:"145px",borderRadius:"8px",fontSize:"15px"}}
              onClick={handleSearch}
              //isDisabled={colenderShortCode && filetype_name && fromDate ? false : true}
            />
          </div>
        </div>
        {selectedRecords.length ? (
        <div style={{ display: "flex", float: "right",marginTop:"10px" }}>
          <Button 
            label="Approve"
            buttonType="secondary"
            customStyle={{height:"40px", width:"94px", fontSize:"14px", borderRadius:"5px",padding:"8px 16px",
              backgroundColor: !selectedRecords.length ? "#b8bab9" : "#008042",borderColor:"#008042",
              color: "#fff"
            }}
            onClick={handleApprove}
          />
          <Button
            label="Reject"
            buttonType="secondary"
            customStyle={{ height:"40px", width:"94px", fontSize:"14px",borderRadius:"5px",padding:"8px 16px",
              backgroundColor: !selectedRecords.length ? "#b8bab9" : "#C00", borderColor:"#C00",
              color: "#fff",
              marginLeft: "8px",
              marginRight: "25px"
            }}
            onClick={() => {
              setIsOpenRemarks(!isOpenRemarks);
              setOpenDialogRemarks(!openDialogRemarks);
            }}
          />
        </div>
        ): null}
        <div>
            { !(utrFiles.length) && <div style={containerStyle}>
            <div>
              <img src={FrontPageImage} alt="Front page Image" style={imageStyle} />
            </div>
            <h2 style={{fontSize:"27px" , lineHeight:"48px" , fontFamily:"Montserrat-SemiBold" , padding:"30px"}}>Kindly fill the above fields to get started</h2>
            </div>}
        </div>
        {utrFiles.length ? (
        <div style={{ display: "flex", flexDirection: "column", marginTop:"50px"}}>
          {isTagged ? (
            checkAccessTags([
              "tag_disbursement_approval_read",
              "tag_disbursement_approval_read_write"
            ]) ? (
              <div>
                <Table customStyle={{marginLeft:"24px" ,width:"97%"}}
                  columns={[
                  { id: "Select All", label: <Checkbox
                          color="primary"
                          onChange={handleSelectAll}
                          checked={selectAll}
                        /> },
                  { id: 'FILE NAME', label: 'FILE NAME' },
                  {id:" ",label:" "},
                  { id: 'FILE TYPE', label: 'FILE TYPE' },
                  { id: 'UPLOAD DATE', label: 'UPLOAD DATE' },
                  { id: 'CO-LENDER', label: 'CO-LENDER' },
                  ]} data={sampleData} />
                <Pagination itemsPerPage={rowsPerPage} 
                totalItems={utrFiles.length} 
                rowsPerPageOptions={[10, 20, 30]} 
                onPageChange={handleChangePage} 
                showOptions={true}
                setRowLimit={setRowsPerPage}/>
              </div>
            ) : null
          ) : (
            <div>
                <Table customStyle={{marginLeft:"24px" ,width:"97%"}}
                  columns={[
                  { id: 'FILE NAME', label: 'FILE NAME' },
                  {id:" ",label:" "},
                  { id: 'FILE TYPE', label: 'FILE TYPE' },
                  { id: 'UPLOAD DATE', label: 'UPLOAD DATE' },
                  { id: 'CO-LENDER', label: 'CO-LENDER' }
                  ]} data={sampleData} />
                <Pagination itemsPerPage={rowsPerPage} 
                totalItems={utrFiles.length} 
                rowsPerPageOptions={[10, 20, 30]} 
                onPageChange={handleChangePage} 
                showOptions={true}
                setRowLimit={setRowsPerPage}/>
              </div>
          )}
        </div>
        ): null}
      </div>
    </>
  );
};

export default bulkUploadApproval;

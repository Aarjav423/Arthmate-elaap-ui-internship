import React, { useState, useRef } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import CardContent from "@mui/material/CardContent";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import { Button, TableBody } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import { AlertBox } from "../../components/AlertBox";
import { storedList } from "../../util/localstorage";
import { getBulkFileDetails, postOperationFileDetails, downloadRepaymentFile } from "../../apis/operationBulkUpload"
import { Autocomplete, Card, Link } from "@mui/material";
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CustomDatePicker from "../../components/DatePicker/customDatePicker";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import FileUploadIcon from '@mui/icons-material/FileUploadOutlined'
import moment  from "moment";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { checkAccessTags } from "../../util/uam";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const OperationBulkUplood = () => {
    const user = storedList('user');
    const [filterType,setFilterType] = useState("")
    const [filterTypeValue, setFilterTpyeValue] = useState([])
    const [filterValue, setFilterValue] = useState("")
    const [isDateFilter, setIsDateFilter] = useState(false)
    const [customDate,setCustomDate] = useState(true)
    const [fromDate,setFromDate] = useState("")
    const [toDate,setToDate] = useState("")
    const [fileType,setFileType] = useState("")
    const [fileName,setFileName] = useState("")
    const [isNotValidFileName,setNotValidFileName] = useState(false)
    const [fileNameError, setFileNameError] = useState("")
    const [fileTypeError,setFileTypeError] = useState("")
    const [isNotValidFileType, setNotValidFileType] = useState(false)
    const [fileExtentionHelperText, setFileExtentionHelperText] = useState("")
    const [acceptedExtn, setAcceptedExtn] = useState("")
    const [base64, setBase64] = useState("")
    const [isDateAsc, setDateAsc] = useState(true)
    const inputRef = useRef(null);
    const [repaymentFileDetails, setRepaymentFileDetails] = useState([])
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(10)
    const [count, setCount] = useState(0)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [severity, setSeverity] = useState("")
    const [isPopUp, setPopUp] = useState(false)
    const isTagged = process.env.REACT_APP_BUILD_VERSION > 1 ? 
                        user?.access_metrix_tags?.length : false

    const setFilterValues = () => {
        if (filterType === "File Status") {
            setIsDateFilter(false)
            setFilterTpyeValue(FILE_STATUS)
            return 
        }
        if (filterType === "File Type") {
            setIsDateFilter(false)
            setFilterTpyeValue(FILE_TYPE)
            return
        }
        if (filterType === "Record Status") {
            setIsDateFilter(false)
            setFilterTpyeValue(RECORD_STATUS)
            return
        }
        if (filterType == "Upload Date") {
            setIsDateFilter(true)
            return            
        }
    }
    
    const handleUploadFileClick = () => {
        if (!fileType) {
            setFileTypeError("Please provide file type")
            setNotValidFileType(true)
            return
        } 
        inputRef.current.click();
    };

    const handleFileChange = event => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
            const fileBase64 = reader.result.split(",")[1]
            setBase64(fileBase64)
        };
        setFileName(fileObj.name);
    }

    React.useEffect(() => {
        if (fileType === "Origin Repayment File") {
            setFileExtentionHelperText(`Upload in .csv format`)
            setAcceptedExtn(".csv")
            return
        }
        return 
    },[fileExtentionHelperText,fileType])

    React.useEffect(() => {
        if (!fileName) return 
        const extn = fileName.split(".")[1]
        if (fileType === "Origin Repayment File") {
            setNotValidFileName(extn !== "csv")
            setFileNameError(extn !== "csv" ? "Please provide .csv file" : null)
            setFileExtentionHelperText("")
            return
        }
    },[
        fileName,
        fileType,
        isNotValidFileName,
        fileNameError,
        fileExtentionHelperText
    ])

    React.useEffect(() => {
        if (fromDate && toDate) {
            validateDateRange(fromDate, toDate, showAlert);
            return 
        }
        return
    },[fromDate, toDate])

    const handleRest = () => {
        setFilterType("")
        setFilterTpyeValue("")
        setFilterValue("")
        setFromDate("")
        setToDate("")
        setIsDateFilter(false)
        setCustomDate(true)
    }

    const handleClickOpen = () => {
        setPopUp(true);
    };
    
    const handlePopupClose = () => {
        handleDiscard()
        setPopUp(false);
    };    
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleAlertClose = () => {
        setAlert(false);
        setSeverity('');
        setAlertMessage('');
    };

    const showAlert =(alertMessage, severity) => {
        setAlert(true);
        setSeverity(severity);
        setAlertMessage(alertMessage);
        setTimeout(() => {
        handleAlertClose();
        }, 3000);
    }
    
    const handleDownloadFile = async(file) => {
        const payload = {
            user_id : user.id,
            s3_url : file.s3_url,
            id : file._id
        }
        const response = await downloadRepaymentFile(payload)
        if (!response) {
            showAlert("Error while downloading repayment file", "error");
        }
        const blob = new Blob([response], { type: "text/csv" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = file.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleDiscard = () => {
        setFileType("")
        setNotValidFileType(false)
        setFileName("")
        setNotValidFileName(false)
        setAcceptedExtn("")
        setFileExtentionHelperText("")
    } 

    React.useEffect(() => {
        fetchBulkFileDetails();
    }, [
        page,
        limit,
        isDateAsc
    ]);

    React.useEffect(() => {
        setFilterValues();
    }, [filterType])

    const fetchBulkFileDetails = () => {
        if (validateDateRange(fromDate,toDate,showAlert)) return
        const req = {
            user_id: user._id,
            page,
            limit,
            sort : isDateAsc,
            stage : FILE_STATUS_CODE[filterValue],
            file : FILE_CODE[filterValue],
            from : fromDate,
            to : toDate,
            record_stage : RECORD_STAGE[filterValue]
        };
        getBulkFileDetails(req)
        .then(response => {
            setRepaymentFileDetails(response.data?.data.rows)
            setCount(response.data?.data.count)
        })
        .catch(error => showAlert(error.response.data.message, "error"))
    };

    const validateDateRange = (fromDate, toDate, showAlert) => {
        let firstDate = new Date(fromDate);
        let secondDate = new Date(toDate);
        firstDate.setDate(firstDate.getDate() + 365);
        if (firstDate < secondDate) {
            showAlert("Date range is more than one year", 'error')
            setTimeout(() => {
                setFromDate("")
                setToDate("")
            },2000) 
            return true
        }
    }
    
    const handleSearch = () => {
        if (!filterType) {
            showAlert("Please select filter", 'warning')
            return
        }
        if (!isDateFilter && !filterValue) {
            showAlert("Please select value", 'warning')
            return
        }
        if (isDateFilter && !fromDate) {
            showAlert("Please select value", 'warning')
            return
        }
        if (isDateFilter && !toDate) {
            showAlert("Please select value", 'warning')
            return
        }
        fetchBulkFileDetails()
        return
    }

    const handleFileSubmit =()=>{
        if (!fileType) {
            setNotValidFileType(true)
            setFileTypeError("Please provide file type")
            return 
        }
        if (!fileName) {
            setNotValidFileName(true)
            setFileNameError("Please provide a file")
            return
        }
        handlePopupClose()
        uploadNewFileToS3()
    }

    const uploadNewFileToS3 =()=>{
        const req = {
            user_id : user._id,
            file_type : fileType,
            file_code : FILE_CODE[fileType],
            file_name: fileName,
            base64 : base64
        }
        postOperationFileDetails(req)
        .then(response => {
            showAlert(response.data.message,"success")
            fetchBulkFileDetails('')
        })
        .catch(error => {
            showAlert(error.response.data.message,"error")
            fetchBulkFileDetails('')
        })
    }

    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value));
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#5e72e4',
        color: theme.palette.common.black
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: theme.palette.common.black
        }
    }));

    return (
        <Grid item xs={12}>
            <Typography sx={{ mt: 2, mb: 2 }} variant="h6">
                Bulk Upload
            </Typography>
            <div
                style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}
            >
            {alert ? (
            <AlertBox
                severity={severity}
                msg={alertMessage}
                onClose={handleAlertClose}
            />
            ) : null}
            <Autocomplete
                disablePortal
                id="filter-select"
                options={FILTER_TYPE}
                value={filterType}
                onChange={(event,newValue) => {
                    setFilterType(newValue.label)
                    setFilterValue("")
                }}
                sx={{ mb: '5cm', mt: 2, ml : 1, mr : 1, minWidth: '4.5cm'}}
                renderInput={(params) => <TextField {...params} label="Filter"/>}
            />
            {!isDateFilter ? (
            <Autocomplete
                disablePortal
                id="value-select"
                options={filterTypeValue}
                value={filterValue}
                onChange={(event,newValue) => {
                    setFilterValue(newValue)
                }}
                sx={{ mb: '5cm', mt: 2, mr : 0, minWidth: '4.5cm'}}
                renderInput={(params) => <TextField {...params} label="Value"/>}
            />) : null}
            {isDateFilter ? (<>
            <Grid xs={2} item sx={{ ml: -2, mb: '4.5cm', mr: -2}}>
                <CustomDatePicker
                    placeholder="Select duration"
                    onDateChange={date => {
                        if (date.state == "custom") {
                            setCustomDate(false);
                            setFromDate("");
                            setToDate("");
                        } else {
                            setCustomDate(true);
                            setFromDate(date.fromDate);
                            setToDate(date.toDate);
                        }
                    }} />
                </Grid></>) : null}
                {!customDate ? (<>
                    <Grid xs={2} item sx={{ ml: -1, mb: '4.5cm' }}>
                        <BasicDatePicker
                            placeholder="From date"
                            value={fromDate || null}
                            onDateChange={date => {
                                setFromDate(moment(date).format("YYYY-MM-DD"))
                            }} />
                    </Grid>
                    <Grid xs={2} item sx={{ ml: -3, mr: -2, mb: '4.5cm' }}>
                        <BasicDatePicker
                            placeholder={"To date"}
                            value={toDate || null}
                            onDateChange={date => {
                                setToDate(moment(date).format("YYYY-MM-DD"))
                            }} />
                        </Grid></>
                ) : null}
            {customDate ? (<>
            <Button
                sx={{ml : 5}}
                style={{
                    position : 'relative',
                    backgroundColor: "#5e72e4",
                    color : 'white',
                    marginLeft: "10px",
                    marginBottom : "4.5cm"
                }}
                onClick={handleSearch}
            >
                Search
            </Button>
            <Button
                style={{
                backgroundColor: "#5e72e4",
                color : 'white',
                marginLeft: "10px",
                marginBottom : "4.5cm"
                }}
                onClick={handleRest}
            >
                Reset
            </Button></>) : null}
            {!customDate ? (<>
            <Button
                sx={{ ml: -1 }}
                style={{
                    position: 'relative',
                    backgroundColor: "#5e72e4",
                    color: 'white',
                    marginLeft: "10px",
                    marginBottom: "4.5cm"
                }}
                onClick={handleSearch}
                >
                    Search
                </Button>
                <Button
                    style={{
                        backgroundColor: "#5e72e4",
                        color: 'white',
                        marginLeft: "10px",
                        marginBottom: "4.5cm"
                    }}
                    onClick={handleRest}
                >
                    Reset
                </Button></>) : null}
            <Button
                disabled={isTagged
                    ? !checkAccessTags([
                        "tag_operations_bulk_upload_read_write"
                      ])
                    : false}
                style={{
                float: "left",
                backgroundColor: "#5e72e4",
                color: "#fff",
                marginLeft: "auto",
                marginRight: "15px"
                }}
                onClick={handleClickOpen}
            >
                <FileUploadIcon>
                </FileUploadIcon>
                Upload New File
            </Button>
            <BootstrapDialog
                onClose={handlePopupClose}
                aria-labelledby="add-scheme-popup-title"
                open={isPopUp}
            >
                <BootstrapDialogTitle id="add-scheme-popup-title" onClose={handlePopupClose} style={{color: "#fff",backgroundColor: "#5e72e4"}}>
                Upload File
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Card style={{width:'10cm'}}>
                        <CardContent style={{width:'10cm'}}>
                            <Autocomplete
                                disablePortal
                                id="file-type-select"
                                options={FILE_TYPE}
                                value={fileType}
                                onChange={(event,newValue) => {
                                    setFileType(newValue)
                                    setNotValidFileType(false)
                                }}
                                style={{width:'9.15cm',marginBottom : '0.5cm'}}
                                renderInput={(params) => <TextField {...params} label="File type"
                                                            helperText={isNotValidFileType? `${fileTypeError}` : null}
                                                            error ={isNotValidFileType}
                                                            style={{width:'9.15cm',marginBottom : '0.5cm'}}/>}
                            />
                            <input
                                style={{ display: "none" }}
                                ref={inputRef}
                                type="file"
                                accept={acceptedExtn}
                                value={""}
                                onChange={handleFileChange}
                            />
                            <TextField
                                variant="outlined"
                                label="File Name"
                                type="text"
                                name="fileName"
                                autoComplete="off"
                                value={fileName}
                                helperText={isNotValidFileName? `${fileNameError}` : `${fileExtentionHelperText}`}
                                error ={isNotValidFileName}
                                style={{width : '5cm', marginBottom : '0.5cm'}}
                            />
                            <Button style={{
                                color : "#5e72e4",
                                backgroundColor : "whitesmoke", 
                                float : "right"}}
                                onClick={handleUploadFileClick}
                                >
                                <FileUploadIcon/>
                                    Upload File
                            </Button>
                            <Button
                                style={{
                                backgroundColor: "#5e72e4",
                                color : 'white',
                                float : 'right',
                                width : '3cm'
                                }}
                                onClick={handleFileSubmit}
                            >
                                Submit
                            </Button>
                            <Button
                                style={{
                                backgroundColor: "#5e72e4",
                                color : 'white',
                                float : 'center',
                                width : '3cm'
                                }}
                                onClick={handleDiscard}
                            >
                                Discard
                            </Button>
                            </CardContent>
                    </Card>
                </DialogContent>
            </BootstrapDialog>
            </div>
            <CardContent sx={{mt : -14}}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="left">File Name</StyledTableCell>
                                <StyledTableCell align="center">File Type</StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button style={{color:'black'}}
                                    onClick={() =>{
                                        setDateAsc(!isDateAsc)}}>
                                        Upload Date
                                    {isDateAsc ? (<ArrowDropDownIcon/>) : (<ArrowDropUpIcon/>)}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align="center">#Records</StyledTableCell>
                                <StyledTableCell align="center">#Successful Records</StyledTableCell>
                                <StyledTableCell align="center">#Failed Records</StyledTableCell>
                                <StyledTableCell align="center">File Status</StyledTableCell>
                                <StyledTableCell align="right">Record Status</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {repaymentFileDetails.length ? 
                        (<TableBody>
                            {repaymentFileDetails.map((file,index) => (
                            <TableRow key={index}>
                                <StyledTableCell align="left">
                                    <Link
                                    >
                                        <Button
                                        style={{color : "#5e72e4"}}
                                        disabled={file.validation_stage === 2}
                                        onClick={() => {
                                            handleDownloadFile(file)
                                        }}
                                        >
                                        {file.file_name}
                                        </Button>
                                    </Link>
                                    </StyledTableCell>
                                <StyledTableCell align="center">{file.file_type}</StyledTableCell>
                                <StyledTableCell align="center">{moment(file.created_at).format("DD/MM/YYYY")}</StyledTableCell>
                                <StyledTableCell align="center">{file.total_records ?? ""}</StyledTableCell>
                                <StyledTableCell align="center">{file.total_success_records ?? ""}</StyledTableCell>
                                <StyledTableCell align="center">{file.total_failure_records ?? ""}</StyledTableCell>
                                <StyledTableCell align="center">{file.validation_status}</StyledTableCell>
                                <StyledTableCell align="center">{file.record_status ?? ""}</StyledTableCell>
                            </TableRow>))}
                        </TableBody>) : 
                        (<TableBody align="center">No scheme details to show</TableBody>)}
                    </Table>
                </TableContainer>
                <TablePagination
                    sx={{
                        ".MuiTablePagination-toolbar": {
                        color: "rgb(41, 39, 39)",
                        height: "35px",
                        margin: "none"
                        },

                        ".MuiTablePagination-selectLabel": {
                        marginBottom: "0px"
                        },
                        ".MuiTablePagination-displayedRows": {
                        marginBottom: "-1px"
                        },
                        ".MuiTablePagination-select": {
                        paddingTop: "6px"
                        }
                    }}
                    rowsPerPageOptions={[10, 30, 70, 100]}
                    component="div"
                    count={count}
                    rowsPerPage={limit}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    />
            </CardContent>
        </Grid>
    )
}

const FILTER_TYPE = [
    { label : 'File Status' },
    { label : 'File Type' },
    { label : 'Record Status' },
    { label : 'Upload Date' }
]

const FILE_STATUS = [
    'In Review',
    'Approved',
    'In Progress',
    'Processed',
    'Rejected'
]

const FILE_TYPE = [
    'Origin Repayment File'
]

const RECORD_STATUS = [
    'Success',
    'Failed',
    'Partial Success'
]

const RECORD_STAGE = {
    "Success" : 0,
    "Failed" : 1,
    "Partial Success" : 2
}

const FILE_CODE = {
    "Origin Repayment File" : 0
}
const FILE_STATUS_CODE = {
    "In Review" : 0,
    "Approved" : 1,
    "In Progress" : 2,
    "Processed" : 3,
    "Rejected" : 4
}

export default OperationBulkUplood


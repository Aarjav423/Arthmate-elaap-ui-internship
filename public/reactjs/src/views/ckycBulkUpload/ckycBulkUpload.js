import React, {useState} from "react";
import {useDispatch} from "react-redux";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import CardContent from "@mui/material/CardContent";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import {styled} from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import {Button, TableBody} from "@material-ui/core";
import {AlertBox} from "../../components/AlertBox";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import {
  CkycUploadReportWatcher,
  getCkycUploadReportWatcher,
  downloadCkycFileReportWatcher
} from "../../actions/ckycReport";
import Autocomplete from "@mui/material/Autocomplete";
import {useRef} from "react";
import {Link} from "react-router-dom";
import moment from "moment";
import {checkAccessTags} from "../../util/uam";
import {storedList} from "../../util/localstorage";
const user = storedList("user");
const {getColendersProduct} = require("../../apis/colenders");

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5e72e4",
    color: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.black
  }
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const ckycBulkUpload = () => {
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
  const [product_name, setProduct_name] = useState("");
  const [co_lender_name, setCo_lender_name] = useState("");
  const [showButtonA, setShowButtonA] = useState(false);
  const [showButtonB, setShowButtonB] = useState(false);
  const [showButtonC, setShowButtonC] = useState(false);
  const [showButtonD, setShowButtonD] = useState(false);
  const [showButtonE, setShowButtonE] = useState(false);
  const [showButtonF, setShowButtonF] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [productId, setProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productsArray, setProductArray] = useState("");
  const [co_lender, setColender] = React.useState("");
  const [colendersList, setColendersList] = useState("");
  const [colenderShortCode, setColenderShortCode] = useState("");
  const [product, setProduct] = useState([]);
  const [colenderID, setColenderID] = useState("");
  const [colenderNames, setColenderNames] = useState([]);
  const [filetype, setFiletype] = useState([
    "CKYC response file(.txt)"
  ]);
  const inputStyle = {display: "none"}; // assigned to input makes it invisible
  const root = document.querySelector("#root");
  const [saving, setSaving] = useState(false);
  const [utrFiles, setUtrFiles] = useState([]);
  const [utrFilesList, setUtrfilesList] = useState([]);

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;
  let isApproved = 0;
  let id = "";

  const validationStatus = {
    0: "Approved",
    1: "Fail",
    2: "Success"
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
        "tag_upload_read",
        "tag_upload_read_write"
      ])
    )
    fetchCkycfilesList();
    if (!isTagged) fetchCkycfilesList();
  }, []);

  const fetchCkycfilesList = () => {
    const payload = {};
    new Promise((resolve, reject) => {
      dispatch(getCkycUploadReportWatcher(payload, resolve, reject));
    })
      .then(response => {
        for (let ele of response.rows) {
          ele.created_at = moment(ele.created_at).format("YYYY-MM-DD");
        }
        setUtrFiles(response.rows.filter(filterData));
        setUtrfilesList(response.rows);
      })
      .catch(error => {
        showAlert(error.response.data.message, "error");
      });
  };

  const compare = (a, b) => {
    if (a.co_lender_name < b.co_lender_name) {
      return -1;
    }
    if (a.co_lender_name > b.co_lender_name) {
      return 1;
    }
    return 0;
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleFilterChange = e => {
    setColumn("");
    setFilter(e.target.value);
    setUtrFiles(utrFilesList);
  };

  const handleColumnChange = e => {
    setColumn(e.target.value);
    setUtrFiles(utrFilesList);
  };

  const handleFiletypeChange = (event, value) => {
    if(value === "CKYC response file(.txt)")
    setFileType_name("CKYC_UPLOAD_FILE");
  };
  
  const handleReset = () => {
    setColumn("");
    setFilter("");
    setUtrFiles(utrFilesList);
  };

  const filterData = item => {
    if (filter == "" || column == "") {
      return true;
    } else if (item.hasOwnProperty(filter)) {
      if (
        typeof item[filter] == "string" &&
        item[filter].toLowerCase() == column.toLowerCase()
      ) {
        return true;
      } else if (item[filter] == column) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handleSearch = () => {
    if (filter && !column) {
      showAlert("Please enter value", "error");
    } else if (!filter && column) {
      showAlert("Please select filter", "error");
    } else if (!filter && !column) {
      showAlert("Please select filter", "error");
    } else {
      setUtrFiles(utrFilesList.filter(filterData));
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const downloadCkycFileReport = (id, name) => {
    let payload = {
      id: id
    };
    new Promise((resolve, reject) => {
      dispatch(downloadCkycFileReportWatcher(payload, resolve, reject));
    })
      .then(response => {
        const file = new Blob([response], { type: 'application/txt' });
        saveAs(file, `ckyc_file_report.txt`);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };


  const inputRef = useRef(null);
  const [fileBase64, setFileBase64] = useState("");
  const handleClick = () => {
    if (!filetype_name) {
      showAlert("Please select file type", "error");
    } else {
      inputRef.current.click();
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
    if (!filetype_name) {
      showAlert("Please select file type ", "error");
    } else {
      let fileObj = utrFilesList.find(item => item.file_name===fileName)
      if (fileObj){
        showAlert("File with same name already uploaded", "error");
      }
      else {
        const data = {
          file: fileBase64.toString(),
          file_type: filetype_name,
          file_name: fileName
        };
        new Promise((resolve, reject) => {
          dispatch(CkycUploadReportWatcher(data, resolve, reject));
        })
        .then(response => {
          showAlert("File uploaded", "success");
          setSaving(false);
          window.open(`/admin/ckyc-bulk-upload`, "_self");
        })
        .catch(error => {
          showAlert(error.response.data.message, "error");
          setSaving(false);
        });
      }
    }
  };

  return (
    <Grid item xs={12}>
      <Typography sx={{mt: 2, mb: 2}} variant="h6">
        Bulk File Upload
      </Typography>
      <div style={{display: "flex", alignItems: "center", marginLeft: "10px"}}>
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}
        <FormControl sx={{m: 1, minWidth: 120}}>
          <InputLabel id="demo-simple-select-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter}
            label="Filter"
            onChange={handleFilterChange}
          >
            <MenuItem value={"file_type"}>File type</MenuItem>
            <MenuItem value={"created_at"}>Upload date</MenuItem>
          </Select>
        </FormControl>

        {(!(filter === "file_type") && (
          <TextField
            id="outlined-basic"
            label="Value"
            variant="outlined"
            value={column}
            onChange={handleColumnChange}
          />
        )) ||
          (filter === "file_type" && (
            <FormControl sx={{m: 1, minWidth: 120}}>
              <InputLabel id="demo-simple-select-label">Filter</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={column}
                label="Filter"
                onChange={handleColumnChange}
              >
                <MenuItem value={"CKYC_UPLOAD_FILE"}>CKYC response file(.txt)</MenuItem>
              </Select>
            </FormControl>
          ))}

        <Button
          style={{
            backgroundColor: "#5e72e4",
            color: "#fff",
            marginLeft: "10px"
          }}
          onClick={handleSearch}
        >
          Search
        </Button>
        <Button
          style={{
            backgroundColor: "#5e72e4",
            color: "#fff",
            marginLeft: "10px"
          }}
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 700}} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">File Name </StyledTableCell>
                <StyledTableCell align="left">File Type </StyledTableCell>
                <StyledTableCell align="left">Upload Date</StyledTableCell>
                <StyledTableCell align="left"># Records</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {utrFiles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data, index) => {
                  id = data._id;
                    if(data.file_type === 2 || data.file_type ===3){
                      isApproved =1;
                    }
                    else{
                    if (data.is_approved === true) {
                      isApproved = 1;
                    }
                   else {
                    isApproved = 0;
                  }}
                  return (
                    <StyledTableRow key={index}>
                      <Link
                        onClick={() => {
                          downloadCkycFileReport(data._id, data.file_name);
                        }}
                        to="/admin/ckyc-bulk-upload"
                      >
                        <StyledTableCell>{data.file_name}</StyledTableCell>
                      </Link>
                      <StyledTableCell>
                        {data.file_type}
                      </StyledTableCell>
                      <StyledTableCell>
                        {data.created_at
                          ? moment(data.created_at).format("YYYY-MM-DD")
                          : ""}
                      </StyledTableCell>
                      <StyledTableCell>{data.total_records}</StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{
            "& .MuiTablePagination-toolbar": {
              display: "flex",
              alignItems: "baseline"
            },
            float: "left",
            marginTop: "20px",
            marginLeft: "-20px"
          }}
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={utrFiles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        ></TablePagination>
        <Button
          size="medium"
          style={{
            float: "right",
            backgroundColor: "green",
            color: "#fff",
            marginRight: "auto",
            marginTop: "20px"
          }}
          disabled={
            isTagged
              ? !checkAccessTags(["tag_upload_read_write"])
              : false
          }
          onClick={() => {
            setShowButtonA(!showButtonA),
              setShowButtonB(!showButtonB),
              setShowButtonC(!showButtonC),
              setShowButtonD(!showButtonD),
              setShowButtonE(!showButtonE),
              setShowButtonF(!showButtonF);
          }}
        >
          Upload Bulk File
        </Button>
        <Grid container>
          {showButtonA && (
            <Grid item xs={3}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={filetype}
                value={filetype_name}
                onChange={(event, value) => handleFiletypeChange(event, value)}
                sx={{mb: 2, minWidth: "100%"}}
                renderInput={params => (
                  <TextField {...params} label="Select File type" />
                )}
              />
            </Grid>
          )}
    
          {showButtonF && (
            <Grid item xs={3}>
              <input
                style={{display: "none"}}
                ref={inputRef}
                type="file"
                accept=".txt"
                onChange={handleFileChange}
              />
              <Button
                style={{
                  backgroundColor: "green",
                  color: "#fff",
                  marginTop: "5px"
                }}
                onClick={handleClick}
              >
                choose upload file
              </Button>
            </Grid>
          )}
          
        </Grid>
        <Typography
            style={{
              color: "black",
              marginTop: "5px",
              marginLeft: "0px"
            }}
          >
            {fileName}
          </Typography>
        <div style={{alignItems: "center", justifyContent: "center"}}>
          {showButtonD && (
            <Button
              style={{
                backgroundColor: "#5e72e4",
                color: "#fff",
                textAlign: "center",
                marginTop: "20px"
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )}
          {showButtonE && (
            <Button
              style={{
                backgroundColor: "#5e72e4",
                color: "#fff",
                marginTop: "20px",
                marginLeft: "20px"
              }}
              onClick={() => {
                window.open(`/admin/ckyc-bulk-upload`, "_self");
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Grid>
  );
};

export default ckycBulkUpload;

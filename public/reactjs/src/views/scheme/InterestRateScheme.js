import React, { useEffect, useState } from "react";
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
import Switch from "@mui/material/Switch";
import { Button, TableBody } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import AddIcon from '@mui/icons-material/Add';
import TablePagination from "@mui/material/TablePagination";
import { AlertBox } from "../../components/AlertBox";
import { storedList } from "../../util/localstorage";
import { getAllScheme, updateScheme, postSchemeDetails } from '../../apis/interestRateScheme'
import { Autocomplete, Card } from "@mui/material";
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from '@mui/material/DialogContentText'

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

const InterestRateScheme = () => {
    const [scheme, setScheme] = useState("")
    const [schemeName, setSchemeName] = useState("")
    const [isNotValidSchemeName, setNotValidSchemeName] = useState(false)
    const [schemeNameError,setSchemeNameError] = useState("")
    const [interestRate, setInterestRate] = useState("")
    const [isNotValidInterestRate, setNotValidInterestRate] = useState(false)
    const [interestRateError,setInterestRateError] = useState("")
    const [intRateType, setIntRateType] = useState("")
    const [isNotValidIntType,setNotValidIntType] = useState(false)
    const [intRateTypeError, setIntRateTypeError] = useState("")
    const [penalRate,setPenalRate] = useState("")
    const [isNotValidPenalRate, setNotValidPenalRate] = useState(false)
    const [penalRateError, setPenalRateError] = useState("")
    const [bounceCharge, setBounceCharge] = useState("")
    const [isNotValidBounceChare, setNotValidBounceCharge] = useState(false)
    const [bounceChargeError, setBounceChargeError] = useState("")
    const [repaymentDays, setRepaymentDays] = useState("")
    const [isNotValidRepaymentDays,setIsNotValidRepaymentDays] = useState(false)
    const [repaymentDaysError, setRepaymentDaysError] = useState("")
    const [schemeDetails, setSchemeDetails] = useState([])
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);
    const user = storedList('user');
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [isPopUp, setPopUp] = useState(false)
    const [isUpdateStatusPop, setUpdateStatusPop] = useState(false)
    const [mappedProducts, setMappedProducts] = useState(0)
    const [updatableScheme, setUpdatableScheme] = useState()
    
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
        }, 4000);
    }
    
    const handleSchemeNameInput =(event) => {
        setSchemeName(event.target.value)
        let tempName = event.target.value
        setNotValidSchemeName(!/^[a-zA-Z0-9\s]*$/gm.exec(tempName))
        setSchemeNameError("Please provide alphanumeric value")
    }

    const handleInterestRateInput = (event) => {
        const tempIntRate = event.target.value;
        if (tempIntRate === "") {
          setInterestRate("");
          setNotValidInterestRate(false);
          setInterestRateError("");
        } else {
          const floatValue = parseFloat(tempIntRate);
          if (floatValue <= 100) {
            const isValidInput = /^\d+(\.\d{0,2})?$/.test(tempIntRate);
            if (isValidInput) {
              setInterestRate(tempIntRate);
              setNotValidInterestRate(false);
              setInterestRateError("Please enter valid value");
            }
          }
        }
      };
      
      const handlePenalRateInput = (event) => {
        const tempPenalRate = event.target.value;
        if (tempPenalRate === "") {
            setPenalRate("");
            setNotValidPenalRate(false);
            setPenalRateError("");
        } else {
        const floatValue = parseFloat(tempPenalRate);
         if (floatValue <= 100) {
         const isValidInput = /^\d+(\.\d{0,2})?$/.test(tempPenalRate);
         if (isValidInput) {
            setPenalRate(tempPenalRate);
            setNotValidPenalRate(false);
            setPenalRateError("Please enter valid value");
         }
        }
      }
    };
    const handleBounceChargeInput = (event) => {
        const tempBounceChare = event.target.value;
        if (/^\d{0,8}(\.\d{0,2})?$/.test(tempBounceChare)) {
          setBounceCharge(tempBounceChare);
          setNotValidBounceCharge(false);
          setBounceChargeError("Please enter valid value")
        }
      };
      const handleRepaymentDaysInput = (event) => {
        const tempRepaymentdays = event.target.value;
        if (/^\d{0,8}$/.test(tempRepaymentdays)) {
          setRepaymentDays(tempRepaymentdays);
          setIsNotValidRepaymentDays(false);
          setRepaymentDaysError("Please enter valid value")
        }
     }; 

    const handleDiscard = () => {
        setSchemeName("")
        setInterestRate("")
        setIntRateType("")
        setPenalRate("")
        setBounceCharge("")
        setRepaymentDays("")
        setNotValidSchemeName(false)
        setNotValidInterestRate(false)
        setNotValidIntType(false)
        setNotValidPenalRate(false)
        setNotValidBounceCharge(false)
        setIsNotValidRepaymentDays(false)
        setSchemeNameError("")
        setInterestRateError("")
        setIntRateTypeError("")
        setBounceChargeError("")
        setPenalRateError("")
    } 

    React.useEffect(() => {
        fetchSchemeDetails();
    }, [page,limit]);

    const fetchSchemeDetails = (search) => {
        const req = {
            user_id: user._id,
            page,
            limit,
            search : isNaN(search) ? search : parseInt(search)
        };
        getAllScheme(req)
        .then(response => {
            setSchemeDetails(response.data?.data.rows)
            setCount(response.data?.data.count)
        })
        .catch(error => showAlert(error.response.data.message, "error"))
    };

    const updateSchemeStatus = (schemeDetails) => {
        setUpdateStatusPop(false)
        const req = {
            user_id: user._id,
            scheme_id : schemeDetails._id,
            status : schemeDetails.status ? "0" : "1"
        }
        updateScheme(req)
        .then(response => {
            showAlert(response.data.message,"success")
            fetchSchemeDetails(scheme)
        })
        .catch(error => showAlert(error.response.data.message,"error"))
    }

    const handleSchemeAdd =()=>{
        if (!schemeName) {
            setNotValidSchemeName(true)
            setSchemeNameError("Please provide scheme name")
            return 
        }
        if (!intRateType) {
            setNotValidIntType(true)
            setIntRateTypeError("Please select interest type")
            return
        }
        if (!interestRate) {
            setNotValidInterestRate(true)
            setInterestRateError("Please provide interest rate")
            return
        }
        if (!penalRate) {
            setNotValidPenalRate(true)
            setPenalRateError("Please provide penal rate")
            return
        }
        if (!bounceCharge) {
            setNotValidBounceCharge(true)
            setBounceChargeError("Please provide bounce charge")
            return
        }
        if (!repaymentDays) {
            setIsNotValidRepaymentDays(true)
            setRepaymentDaysError("Please provide repayment Days")
            return
            }

        addSchemeDetails()
    }

    const addSchemeDetails =()=>{
        const req = {
            user_id : user._id,
            scheme_name : schemeName,
            interest_type : intRateType.label,
            interest_rate : interestRate,
            penal_rate : penalRate,
            bounce_charge : bounceCharge,
            repayment_days: repaymentDays
        }
        postSchemeDetails(req)
        .then(response => {
            showAlert(response.data.message,"success")
            handlePopupClose()
            fetchSchemeDetails('')
        })
        .catch(error => {
            showAlert(error.response.data.message,"error")
            fetchSchemeDetails('')
        })
    }

    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value));
    }

    const handleUpdateStatusPopUpClose = () => {
        setUpdateStatusPop(false)
    }

    const handleStatusSwitchChange = (schemeDetails) => {
        if (!schemeDetails.status) {
            updateSchemeStatus(schemeDetails)
            return
        } 
        if (schemeDetails.status && !schemeDetails.product_count) {
            updateSchemeStatus(schemeDetails)
            return
        }
        setUpdateStatusPop(schemeDetails.product_count)
        setMappedProducts(schemeDetails.product_count)
        setUpdatableScheme(schemeDetails)
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
                Interest Rate Scheme
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
            <TextField
                variant="outlined"
                label="Search scheme"
                type="text"
                name="searchScheme"
                autoComplete="off"
                placeholder="Search scheme"
                value={scheme}
                onChange={e => {
                  setScheme(e.target.value);
                }}
                style={{marginLeft: "6px"}}
            />
            <Button
                style={{
                backgroundColor: "#5e72e4",
                color : 'white',
                marginLeft: "10px"
                }}
                onClick={() =>{
                    fetchSchemeDetails(scheme)
                }}
            >
                Search
            </Button>
            <Button
                style={{
                float: "right",
                backgroundColor: "#5e72e4",
                color: "#fff",
                marginLeft: "auto",
                marginRight: "15px"
                }}
                onClick={handleClickOpen}
            >
                <AddIcon></AddIcon>
                Add New Scheme
            </Button>
            <BootstrapDialog
                onClose={handlePopupClose}
                aria-labelledby="add-scheme-popup-title"
                open={isPopUp}
            >
                <BootstrapDialogTitle id="add-scheme-popup-title" onClose={handlePopupClose} style={{color: "#fff",backgroundColor: "#5e72e4"}}>
                Add New Scheme
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Card style={{width:'10cm'}}>
                        <CardContent style={{width:'10cm'}}>
                            <TextField
                                variant="outlined"
                                label="Scheme Name"
                                type="text"
                                name="searchName"
                                autoComplete="off"
                                placeholder="Ex : 'ABC102'"
                                value={schemeName}
                                onChange={handleSchemeNameInput}
                                helperText={isNotValidSchemeName? `${schemeNameError}` : null}
                                error ={isNotValidSchemeName}
                                style={{width:'9.15cm',marginBottom : '0.5cm'}}
                            />
                            <Autocomplete
                                disablePortal
                                id="interest-type-select"
                                options={interestRateType}
                                value={intRateType}
                                onChange={(event,newValue) => {
                                    setIntRateType(newValue)
                                    setNotValidIntType(false)
                                }}
                                style={{width:'9.15cm',marginBottom : '0.5cm'}}
                                renderInput={(params) => <TextField {...params} label="Interest Type" helperText={isNotValidIntType? `${intRateTypeError}` : null}
                                error={isNotValidIntType}/>}
                            />
                            <TextField
                                variant="outlined"
                                label="Interest Rate"
                                type="text"
                                name="interestRate"
                                autoComplete="off"
                                placeholder="Ex: '12' or '12.5' or 12.45'"
                                value={interestRate}
                                onChange={handleInterestRateInput}
                                helperText={isNotValidInterestRate? `${interestRateError}` : null}
                                error ={isNotValidInterestRate}
                                style={{width:'9.15cm',marginBottom : '0.5cm'}}
                            />
                            <TextField
                                variant="outlined"
                                label="Penal Interest"
                                type="text"
                                name="penalRate"
                                autoComplete="off"
                                placeholder="Ex: '12' or '12.5' or 12.45'"
                                value={penalRate}
                                onChange={handlePenalRateInput}
                                helperText={isNotValidPenalRate? `${penalRateError}` : null}
                                error ={isNotValidPenalRate}
                                style={{width:'9.15cm',marginBottom : '0.5cm'}}
                            />
                            <TextField
                                variant="outlined"
                                label="Bounce Charge"
                                type="text"
                                name="bounceCharge"
                                autoComplete="off"
                                placeholder="Ex: '12' or '12.5' or 12.45'"
                                value={bounceCharge}
                                onChange={handleBounceChargeInput}
                                helperText={isNotValidBounceChare? `${bounceChargeError}` : null}
                                error ={isNotValidBounceChare}
                                style={{width:'9.15cm',marginBottom : '0.5cm'}}
                            />
                              <TextField
                                  variant="outlined"
                                  label="Repayment Days"
                                  type="number"
                                  name="repaymentDays"
                                  autoComplete="off"
                                  placeholder="Ex: '12'"
                                  value={repaymentDays}
                                  onChange={handleRepaymentDaysInput}
 	                             helperText={isNotValidRepaymentDays? `${repaymentDaysError}` : null}
                                  error ={isNotValidRepaymentDays}
                                  style={{width:'9.15cm',marginBottom : '0.5cm'}}
                              />
                            <Button
                                style={{
                                backgroundColor: "#5e72e4",
                                color : 'white',
                                float : 'right',
                                width : '3cm'
                                }}
                                onClick={handleSchemeAdd}
                            >
                                Add
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
            <CardContent>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Scheme ID</StyledTableCell>
                                <StyledTableCell align="center">Scheme Name</StyledTableCell>
                                <StyledTableCell align="center">Interest Type</StyledTableCell>
                                <StyledTableCell align="center">Interest Rate</StyledTableCell>
                                <StyledTableCell align="center">Penal Rate</StyledTableCell>
                                <StyledTableCell align="center">Bounce Charge</StyledTableCell>
                                <StyledTableCell align="center">Repayment Days</StyledTableCell>
                                <StyledTableCell align="center">Status</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {schemeDetails.length ? 
                        (<TableBody>
                            {schemeDetails.map((scheme,index) => (
                            <TableRow key={index}>
                                <StyledTableCell align="center">{scheme._id}</StyledTableCell>
                                <StyledTableCell align="center">{scheme.scheme_name}</StyledTableCell>
                                <StyledTableCell align="center">{scheme.interest_type}</StyledTableCell>
                                <StyledTableCell align="center">{scheme.interest_rate}%</StyledTableCell>
                                <StyledTableCell align="center">{scheme.penal_rate}%</StyledTableCell>
                                <StyledTableCell align="center">{scheme.bounce_charge}</StyledTableCell>
                                <StyledTableCell align="center">{scheme.repayment_days}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <div>
                                        <Switch
                                            checked={scheme.status}
                                            value={scheme.status}
                                            onChange={() => handleStatusSwitchChange(scheme)}
                                        ></Switch>
                                        <Dialog
                                            open={isUpdateStatusPop}
                                            onClose={handleUpdateStatusPopUpClose}
                                            aria-labelledby="alert-dialog-update-status"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-update-status" align="center">
                                            {"Are you sure?"}
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description" align="center">
                                                    The scheme you are trying to deactive is already mapped to {mappedProducts} products
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleUpdateStatusPopUpClose}
                                                    style={{
                                                    color : '#5e72e4',
                                                    float : 'center',
                                                    width : '3cm',
                                                    borderBlockColor : '#5e72e4',
                                                    borderInlineStartColor : '#5e72e4',
                                                    borderInlineEndColor : '#5e72e4'
                                                    }}
                                                    autoFocus>
                                                    No
                                                </Button>
                                                <Button onClick={()=> updateSchemeStatus(updatableScheme)} 
                                                    style={{
                                                        backgroundColor: "#5e72e4",
                                                        color : 'white',
                                                        float : 'center',
                                                        width : '3cm'
                                                        }}
                                                    autoFocus>
                                                    Yes
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </div>
                                </StyledTableCell>
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
                    rowsPerPageOptions={[5, 10, 15]}
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

const interestRateType = [
    {label : 'Rear-end'},
    {label : 'Upfront'}
]

export default InterestRateScheme

import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { AlertBox } from "../../components/AlertBox";
import { checkAccessTags } from "../../util/uam";
import { styled } from "@material-ui/core/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Autocomplete from "@mui/material/Autocomplete";
import { Button } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from "@material-ui/core/styles";
import {
    accountHolderListWatcher,
    addAccountHolderWatcher,
    editAccountHolderWatcher
} from "../../actions/bankDetails.js";
import Box from "@material-ui/core/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { storedList } from "../../util/localstorage";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles({
    button: {
        '&:hover': {
            backgroundColor: '#fff',
            color: '#3c52b2',
        },
    }
})

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


const BankDetails = () => {
    const user = storedList("user");
    const classes = useStyles()
    const [errors, setErrors] = useState({
        bank_name_error: false,
        bank_account_number_error: false,
        confirm_account_number_error: false,
        bank_ifsc_error: false,
        account_holder_name_error: false,
        bank_account_type_error: false
    })
    const [alert, setAlert] = useState(false);
    const [submitType, setSubmitType] = useState("Insert");
    const [alertMessage, setAlertMessage] = useState("");
    const [updateId, setUpdateId] = useState("");
    const [severity, setSeverity] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [allAccountHolderNamesList, setAllAccountHolderNamesList] = useState([]);
    const [accountHolderList, setAccountHolderList] = useState([]);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isOpen, setisOpen] = useState(false);
    const [formData, setFormData] = useState({
        bank_name: '',
        bank_account_number: '',
        confirm_account_number: '',
        bank_ifsc: '',
        account_holder_name: '',
        bank_account_type: ''
    });
    const [editOrgData, setEditOrgData] = useState({});

    const isTagged =
        process.env.REACT_APP_BUILD_VERSION > 1
            ? user?.access_metrix_tags?.length
            : false;

    const dispatch = useDispatch();

    useEffect(() => {
        if (
            isTagged &&
            checkAccessTags([
                "tag_master_bank_details_read",
                "tag_master_bank_details_read_write"
            ])
        ) {
            fetchBankDetailsList();
        }
        if (!isTagged) fetchBankDetailsList();
    }, []);

    const handleFormOnChange = async (label, value) => {
        let regex;
        switch (label) {
            case "bank_name":
                regex = new RegExp(/^[A-Za-z0-9\s.]+$/);
                break;
            case "bank_account_number":
                regex = new RegExp(/^[a-zA-Z0-9]+$/);
                break;
            case "confirm_account_number":
                regex = new RegExp(/^[a-zA-Z0-9]+$/);
                break;
            case "bank_ifsc":
                regex = new RegExp(/^[A-Z]{4}0[A-Z0-9]{6}$/);
                break;
            case "account_holder_name":
                regex = new RegExp(/.*/);
                break;
            default:
                regex = new RegExp(/^[a-zA-Z0-9]+$/);
                break;
        }
        if (value) {
            if (label == "bank_ifsc") {
                value = value.toUpperCase();
            }
            if (label == "confirm_account_number") {
                let isValidated = regex.test(value);
                let isNotEqual = (value !== formData.bank_account_number) ? true : false
                setErrors({
                    ...errors,
                    [label + "_error"]: !isValidated
                });
                if (isNotEqual) {
                    setErrors({
                        ...errors,
                        [label + "_error"]: true
                    });
                }
            }
            else {
                let isValidated = regex.test(value);
                setErrors({
                    ...errors,
                    [label + "_error"]: !isValidated,
                });
            }
        } else {
            setErrors({
                ...errors,
                [label + "_error"]: false,
            });
        }
        setFormData({
            ...formData,
            [`${label}`]: value,
        });
    }
    //function to gaet dropDownNames
    const fetchBankDetailsDropDownList = async () => {
        const payload = {
            search: accountHolderName,
            page: page,
            limit: 1000,
            user_id: user._id
        };
        new Promise((resolve, reject) => {
            dispatch(accountHolderListWatcher(payload, resolve, reject));
        })
            .then(res => {
                setCount(res.count);
                const filteredArray = (res.data).map((item,index) => ({
                    key: item.bene_bank_account_holder_name,
                    value: index
                }));
                setAllAccountHolderNamesList(filteredArray);
            })
            .catch(error => {
                showAlert(error?.response?.data?.message || "Something went wrong!", "error");
            });
    };

    //function to fetch bankDetails
    const fetchBankDetailsList = () => {
        const payload = {
            search: accountHolderName,
            page: page,
            limit: rowsPerPage,
            user_id: user._id
        };
        new Promise((resolve, reject) => {
            dispatch(accountHolderListWatcher(payload, resolve, reject));
        })
            .then(res => {
                setCount(res.count);
                setAccountHolderList(res.data);
                fetchBankDetailsDropDownList();
            })
            .catch(error => {
                showAlert(error?.response?.data?.message || "Something went wrong!", "error");
            });
    };

    const handleSearch = () => {
        setPage(0);
        const payload = {
            search: accountHolderName,
            page: page,
            limit: rowsPerPage,
            user_id: user._id
        };
        new Promise((resolve, reject) => {
            dispatch(accountHolderListWatcher(payload, resolve, reject));
        })
            .then(res => {
                setCount(res.count);
                setAccountHolderList(res.data);
                if (!res.count) {
                    showAlert("No records found", "error");
                }
            })
            .catch(error => {
                showAlert(error.message, "error");
            });
    };

    const handleChangePage = async (event, newPage) => {
        setPage(newPage);
        const payload = {
            search: accountHolderName,
            page: newPage,
            limit: rowsPerPage,
            user_id: user._id
        };
        new Promise((resolve, reject) => {
            dispatch(accountHolderListWatcher(payload, resolve, reject));
        })
            .then(res => {
                setCount(res.count);
                setAccountHolderList(res.data);
            })
            .catch(error => {
                showAlert(error?.response?.data?.message, "error");
            });
    };

    const handleChange = async (event) => {
        setAccountHolderName(event.target.textContent);
    };

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

    const handleChangeRowsPerPage = event => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);

        // Fetch bank details list with updated rowsPerPage
        const payload = {
            search: accountHolderName,
            page: 0, // Reset page to 0
            limit: newRowsPerPage, // Use the new rowsPerPage value
            user_id: user._id
        };
        new Promise((resolve, reject) => {
            dispatch(accountHolderListWatcher(payload, resolve, reject));
        })
            .then(res => {
                setCount(res.count);
                setAccountHolderList(res.data);
            })
            .catch(error => {
                showAlert(error?.response?.data?.message, "error");
            });
    };

    const handleClose = () => {
        handleFormReset();
        setisOpen(!isOpen);
        setSubmitType("Insert")
    };

    const handleFormReset = () => {
        setErrors({
            bank_name_error: false,
            bank_account_number_error: false,
            confirm_account_number_error: false,
            bank_ifsc_error: false,
            account_holder_name_error: false,
            bank_account_type_error: false
        })
        setFormData({
            bank_name: '',
            bank_account_number: '',
            confirm_account_number: '',
            bank_ifsc: '',
            account_holder_name: '',
            bank_account_type: '',
        })
    };
    const handleFormResetToOrgValue = () => {
        setErrors({
            bank_name_error: false,
            bank_account_number_error: false,
            confirm_account_number_error: false,
            bank_ifsc_error: false,
            account_holder_name_error: false,
            bank_account_type_error: false
        })
        setFormData({
            bank_name: editOrgData.bene_bank_name,
            bank_account_number: editOrgData.bene_bank_acc_num,
            bank_ifsc: editOrgData.bene_bank_ifsc,
            account_holder_name: editOrgData.bene_bank_account_holder_name,
            bank_account_type: editOrgData.bene_bank_account_type,
            confirm_account_number: editOrgData.bene_bank_acc_num
        })
    };

    const handleFormSubmit = () => {
        if (submitType == "Insert") {
            const payload = {
                bene_bank_name: formData.bank_name,
                bene_bank_acc_num: formData.bank_account_number,
                bene_bank_ifsc: formData.bank_ifsc,
                bene_bank_account_holder_name: formData.account_holder_name,
                bene_bank_account_type: formData.bank_account_type
            };
            new Promise((resolve, reject) => {
                dispatch(addAccountHolderWatcher(payload, resolve, reject));
            })
                .then(res => {
                    handleFormReset();
                    showAlert("Bank details added successfully", "success");
                    fetchBankDetailsList();
                    setisOpen(!isOpen)
                })
                .catch(error => {
                    handleFormReset();
                    showAlert(error?.response?.data?.message || "Something went wrong!", "error");
                    fetchBankDetailsList();
                    setisOpen(!isOpen)
                });
        } else if (submitType == "Update") {
            const payload = {
                id: updateId,
                bene_bank_name: formData.bank_name,
                bene_bank_acc_num: formData.bank_account_number,
                bene_bank_ifsc: formData.bank_ifsc,
                bene_bank_account_holder_name: formData.account_holder_name,
                bene_bank_account_type: formData.bank_account_type
            };
            new Promise((resolve, reject) => {
                dispatch(editAccountHolderWatcher(payload, resolve, reject));
            })
                .then(res => {
                    showAlert("Bank details Updated Successfully", "success");
                    handleClose();
                    fetchBankDetailsList();
                })
                .catch(error => {
                    showAlert(error?.response?.data?.message || "Something went wrong!", "error");
                    handleClose();
                    fetchBankDetailsList();
                });
        }
    }
    const openFormEdit = (data) => {
        setEditOrgData(data)
        setFormData({
            bank_name: data.bene_bank_name,
            bank_account_number: data.bene_bank_acc_num,
            bank_ifsc: data.bene_bank_ifsc,
            account_holder_name: data.bene_bank_account_holder_name,
            bank_account_type: data.bene_bank_account_type,
            confirm_account_number: data.bene_bank_acc_num
        })
        setSubmitType("Update")
        setUpdateId(data._id)
        setisOpen(!isOpen);
    }

    const renderBankFormPopup = () => (
        <>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={isOpen}
                maxWidth={"lg"}
            >
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                    style={{ backgroundColor: "#233450", color: "white" }}
                >
                    {" "}
                    {submitType == "Update" ? "Edit Bank Details" : "Add Bank Details"}
                </BootstrapDialogTitle>
                <div style={{ backgroundColor: '#fff', width: '430px', margin: '15px 15px' }}>
                    <TextField
                        label="Enter Bank Name"
                        id="bank_name"
                        type="text"
                        value={formData.bank_name}
                        onChange={(event) => {
                            handleFormOnChange('bank_name', event.target.value)
                        }}
                        error={errors.bank_name_error === true}
                        helperText={
                            errors.bank_name_error === true
                                ? "Enter a valid bank name."
                                : ""
                        }
                        size="medium"
                        fullWidth sx={{ mb: 2 }} />
                    <TextField
                        label="Enter Account number"
                        id="bank_account_number"
                        type="password"
                        value={formData.bank_account_number}
                        onChange={(event) => {
                            handleFormOnChange('bank_account_number', event.target.value)
                        }}
                        error={errors.bank_account_number_error === true}
                        helperText={
                            errors.bank_account_number_error === true
                                ? "Enter a valid Account Number."
                                : ""
                        }
                        size="medium"
                        fullWidth sx={{ mb: 2 }} />
                    <TextField
                        label="Confirm Account number"
                        type="text"
                        id="confirm_account_number"
                        value={formData.confirm_account_number}
                        onChange={(event) => {
                            handleFormOnChange('confirm_account_number', event.target.value)
                        }}
                        error={errors.confirm_account_number_error === true}
                        helperText={
                            errors.confirm_account_number_error === true
                                ? "Account Number mismatched."
                                : ""
                        }
                        size="medium"
                        fullWidth sx={{ mb: 2 }} />
                    <TextField
                        label="Enter IFSC"
                        id="bank_ifsc"
                        onChange={(event) => {
                            handleFormOnChange('bank_ifsc', event.target.value)
                        }}
                        value={formData.bank_ifsc}
                        error={errors.bank_ifsc_error === true}
                        helperText={
                            errors.bank_ifsc_error === true
                                ? "Invalid IFSC"
                                : ""
                        }
                        size="medium"
                        fullWidth sx={{ mb: 2 }} />
                    <TextField
                        label="Enter Account Holder Name"
                        id="account_holder_name"
                        onChange={(event) => {
                            handleFormOnChange('account_holder_name', event.target.value)
                        }}
                        error={errors.account_holder_name_error === true}
                        helperText={
                            errors.account_holder_name_error === true
                                ? "Invalid Account Holder Name"
                                : ""
                        }
                        size="medium"
                        value={formData.account_holder_name}
                        fullWidth sx={{ mb: 2 }} />
                    <TextField
                        select
                        label="Select Account Type"
                        id="bank_account_type"
                        //value={formData.bank_account_type}
                        onChange={(event) => {
                            handleFormOnChange('bank_account_type', event.target.value)
                        }}
                        error={errors.bank_account_type_error === true}
                        value={formData.bank_account_type}
                        helperText={
                            errors.bank_account_type_error === true
                                ? "Invalid Account Type."
                                : ""
                        }
                        size="medium"
                        fullWidth sx={{ mb: 2 }} >
                        <MenuItem value="Savings">Savings</MenuItem>
                        <MenuItem value="Current">Current</MenuItem>
                    </TextField>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: "5px", marginBottom: "0px" }}>
                        <Button onClick={submitType == "Update" ? handleFormResetToOrgValue : handleClose} variant="outlined" className={classes.button} style={{ marginRight: '10px', width: '50%', paddingTop: "10px", paddingBottom: "10px", textTransform: "none" }}>{submitType == "Update" ? "Reset" : "Discard"}</Button>
                        <Button onClick={handleFormSubmit} variant="contained" style={{ width: '50%', paddingTop: "10px", paddingBottom: "10px", textTransform: "none" }}>{submitType == "Update" ? "Save" : "Add"}</Button>
                    </div>
                </div>
            </BootstrapDialog>
        </>
    );


    return (
        <>
            {alert ? (
                <AlertBox
                    severity={severity}
                    msg={alertMessage}
                    onClose={handleAlertClose}
                />
            ) : null}
            <Typography sx={{ mt: 2, ml: 2 }} variant="h6">
                Bank Details
            </Typography>
            {isOpen ? renderBankFormPopup() : null}
            <CardContent>
                <Grid container style={{ marginLeft: "0px", marginBottom: "20px", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Grid item xs={6} sm={3} md={3} style={{ marginLeft: "-13px", display: "flex", alignItems: "center" }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={allAccountHolderNamesList}
                            getOptionLabel={option => option.key}
                            onChange={(event) => {
                                handleChange(event);
                            }}
                            sx={{ mb: 2, width: "100%" }}
                            renderOption={(props, option) => (
                                <Box component="li" {...props} key={option.value}>
                                    {option.key}
                                </Box>
                            )}
                            renderInput={params => (
                                <TextField {...params} label="Account Holder Name" />
                            )}
                        />
                        <Button
                            className="ml-2"
                            style={{ paddingLeft: "25px", paddingTop: "15px", paddingBottom: "15px", paddingRight: "25px", textTransform: "none", marginBottom: "15px" }}
                            variant="contained"
                            onClick={handleSearch}
                            disabled={accountHolderName === ""}
                        >
                            Search
                        </Button>
                    </Grid>
                    <Grid>
                        <Button
                            size="medium"
                            style={{
                                backgroundColor: !(isTagged && checkAccessTags(["tag_master_bank_details_read_write"])) ? "#eaeaea" : "#5E72E4",
                                color: !(isTagged && checkAccessTags(["tag_master_bank_details_read_write"])) ? "#c0c0c0" : "#fff",
                                textTransform: "none",
                                paddingLeft: "25px",
                                paddingRight: "25px",
                                paddingTop: "15px",
                                paddingBottom: "15px"
                            }}
                            disabled={!(isTagged && checkAccessTags(["tag_master_bank_details_read_write"]))}
                            onClick={() => {
                                setisOpen(!isOpen);
                            }}
                        >
                            <AddIcon /> Add Bank Details
                        </Button>
                    </Grid>
                </Grid>


                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="left">Account Holder Name</StyledTableCell>
                                <StyledTableCell align="left">Bank Name</StyledTableCell>
                                <StyledTableCell align="left">Account Number</StyledTableCell>
                                <StyledTableCell align="left">IFSC</StyledTableCell>
                                <StyledTableCell align="left">Account Type</StyledTableCell>
                                <StyledTableCell align="left">Penny Drop Status</StyledTableCell>
                                <StyledTableCell align="left">Edit</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accountHolderList.map((data, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell scope="row">
                                        {data.bene_bank_account_holder_name}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row">
                                        {data.bene_bank_name}
                                    </StyledTableCell>
                                    <StyledTableCell scope="row">
                                        {data.bene_bank_acc_num}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {data.bene_bank_ifsc}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {data.bene_bank_account_type}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{data?.penny_drop_status || "Failure"}</StyledTableCell>
                                    <StyledTableCell scope="row">
                                        <Button
                                            disabled={(isTagged && checkAccessTags(["tag_master_bank_details_read_write"])) ? data?.penny_drop_status === 'Success' : true}
                                            onClick={() => openFormEdit(data)}
                                        >
                                            <EditOutlinedIcon style={{ color: (isTagged && checkAccessTags(["tag_master_bank_details_read_write"])) ? data?.penny_drop_status === "Success" ? "#666666" : "#0765F2" : "#666666" }} />
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
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
                    rowsPerPageOptions={[10, 20, 30]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </CardContent>
        </>
    );
};

export default BankDetails;

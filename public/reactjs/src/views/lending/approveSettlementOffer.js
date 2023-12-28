
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, styled } from "@material-ui/core/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import TextField from "@mui/material/TextField";
//import { Button, TableBody } from "@material-ui/core";
import moment from "moment";
import { settlementDecisionWatcher } from "../../actions/loanRequest";
import { storedList } from "../../util/localstorage";
import { AlertBox } from "../../components/AlertBox";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button/Button";
import Table from "react-sdk/dist/components/Table"


export default function approveSettlementOffer(props) {

    const dispatch = useDispatch();
    const user = storedList("user");
    const { open, closePopup, row, loanId, companyId, productId, offerInvalidPopup } = props;
    const [openDialog, setOpenDialog] = useState(open);
    const [comment, setComment] = useState(row?.approver_comment ? row.approver_comment : "")
    const [showButtons, setShowButtons] = useState(row?.approver_comment ? false : true);
    const [alertBox, setAlertBox] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const customStyle = {
        height: "60px", width: "100%", maxWidth: "100%", paddingTop: "0.5%", marginTop: "3%"
    }
    const modalStyle = {
        width: "27%", height: "100%", maxHeight: "100%", marginLeft: "37%", paddingTop: "2%", display: "flex", flexDirection: "column", float: "right"
    }
    const customStyle1 = {
        height: "100%", width: "100%", maxWidth: "100%", marginTop: "0%"
    }

    const handleCloseDialog = () => {
        setOpenDialog(!open);
        closePopup();
    };

    const showAlert = (msg, type) => {
        setAlertBox(true);
        setSeverity(type);
        setAlertMessage(msg);
        setTimeout(() => {
            handleAlertClose();
        }, 4000);
    };

    const handleAlertClose = () => {
        setAlertBox(false);
        setSeverity("");
        setAlertMessage("");
    };

    const handleDecision = (decision) => {
        offerInvalidPopup(false)
        const data = {
            loan_id: loanId,
            company_id: companyId,
            product_id: productId,
            user_id: user._id,
            request_id: row._id,
            approver_comment: comment,
            status: decision
        };
        new Promise((resolve, reject) => {
            dispatch(settlementDecisionWatcher(data, resolve, reject));
        })
            .then(response => {
                if (response.success === false) {
                    showAlert(response.message, "error")
                }
                else {
                    showAlert(response.message, "success")
                    location.reload();
                }
            })
            .catch(error => {
                showAlert(error.response.data.message, "error");
            });
    }
    const columns = [
        { id: "settlement_date", label:  <span style={{marginLeft:"-15px" , width:"150px"}}>{"DATE OF RETURN"}</span>, format: (row) =>  <span style={{marginLeft:"-15px" , width:"150px"}}>{moment(row.requested_date).format("YYYY-MM-DD")}</span>},
        { id: "settlement_amount", label:  <span style={{width:"200px"}}>{"SETTLEMENT AMOUNT"}</span>,  format: (row) =>  <span style={{width:"200px"}}>₹{(row.settlement_amount).toLocaleString('en-IN')}</span> }
    ];

    return (
        <>
            {alertBox ? (
                <AlertBox
                    severity={severity}
                    msg={alertMessage}
                    onClose={handleAlertClose}
                />
            ) : null}

            <FormPopup
                heading="Review Settlement Offer"
                open={openDialog}
                isOpen={openDialog}
                onClose={handleCloseDialog}
                customStyles={modalStyle}
            >
                <Table
                    customStyle={{ width: "100%" }}
                    data={row?.tranches || []}
                    columns={columns}
                />

                <div style={{marginTop:"20px"}}>
                    <TextField
                        style={{ marginRight: "25px" }}
                        id="outlined-basic"
                        label={showButtons ? "comment" : "Approver's Comment"}
                        placeholder="For e.g for a settlement offer of INR 50000 to be paid till 18th of may 2023,if the user makes a payment of INR 50000 or more till 3rd june settlement offer should be considered settled"
                        variant="outlined"
                        value={comment}
                        InputProps={{
                            readOnly: !showButtons,
                        }}
                        onChange={(event) => setComment(event.target.value)}
                        sx={{ minWidth: "100%" }}
                        multiline={true}
                    />
                </div>
            {
                showButtons ? 
                <div style={{ display: "flex", alignItems: "center",position:"fixed", bottom:"0", width:"92%" , marginBottom:"18px"}}>
                    <Button
                        id='reject'
                        label='Reject'
                        buttonType="secondary"
                        onClick={() => { handleDecision("rejected") }}
                        customStyle={{ borderRadius: "16px", height: "9%", width: "50%", backgroundColor: "white", color: "#C00", fontSize: "80%", borderRadius: "8px", border: "1px solid #C00" , backgroundColor:"white", boxShadow:"none"}}
                    />
                    <Button
                        id='approve'
                        label='Approve'
                        buttonType='primary'
                        onClick={() => { handleDecision("approved") }}
                        customStyle={{ borderRadius: "8px", width: "50%", height: "9%", fontSize: "80%" }}
                    />
                </div>
                :
                null
            }

            </FormPopup>
        </>
    )
}



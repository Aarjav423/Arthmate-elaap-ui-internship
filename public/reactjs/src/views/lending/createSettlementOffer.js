
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, styled } from "@material-ui/core/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import moment from "moment";
import { settlementRequestWatcher } from "../../actions/loanRequest";
import { storedList } from "../../util/localstorage";
import { AlertBox } from "../../components/AlertBox";
import { verifyDateAfter1800 } from "../../util/helper";
import FormPopUp from "react-sdk/dist/components/Popup/FormPopup";
import Button from "react-sdk/dist/components/Button";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";

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

export default function createSettlementOffer(props) {

  const dispatch = useDispatch();
  const user = storedList("user");
  const { open, closePopup, loanId, companyId, productId, offerInvalidPopup } = props;
  const [openDialog, setOpenDialog] = useState(open);
  const [disabled, setDisabled] = useState(true);
  const [tranches, setTranches] = useState([{ settlement_date: "", settlement_amount: "", errorDate: false, errorAmount: false }])
  const [comment, setComment] = useState("")
  const [alertBox, setAlertBox] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  const customStyle = {
    height: "60px", width: "100%", maxWidth: "100%", paddingTop: "0.5%", marginTop: "3%"
  }
  const modalStyle = {
    position:"absolute",width: "30%", height: "100%", maxHeight: "100%", marginLeft: "35%", paddingTop: "2%", display: "flex", flexDirection: "column", float:"right",overflowY:"scroll"
  }
  const customStyle1 = {
    height: "100%", width: "100%", maxWidth: "100%", marginTop: "6px"
  }

  useEffect(() => {
    handleTotalAmount();
  }, []);

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

  const handleAddTranch = () => {
    let count = tranches.length
    if (tranches[count - 1]["settlement_date"] === "") {
      setDisabled(true)
      showAlert("please select date of return", "error")
    }
    else if (tranches[count - 1]["settlement_amount"] === "") {
      setDisabled(true)
      showAlert("please enter settlement amount", "error")
    }
    else if (tranches[count - 1]["errorDate"] === true) {
      setDisabled(true)
    }
    else if (tranches[count - 1]["errorAmount"] === true) {
      setDisabled(true)
    }
    else {
      if (disabled === false) {
        if (count < 5) {
          setTranches([...tranches, { settlement_date: "", settlement_amount: "", errorDate: false, errorAmount: false }])
        }
      }
    }
  }

  const handleDelete = (index) => {
    if (index !== 0) {
      const deleteTranch = [...tranches]
      deleteTranch.splice(index, 1)
      setTranches(deleteTranch);
      setDisabled(false)
    }
  }

  const handleDecimalLimit = (event) => {
    const { value } = event.target;
    if (event.keyCode >= 48 && event.keyCode <= 57) {
      const regex = /^[0-9]+\.[0-9]{2}$/;
      if (regex.test(value)) {
        event.preventDefault();
      }
    }
  };

  const handleChange = (event, index) => {
    let { name, value } = event.target
    if(name === "₹ settlement amount") name =  "settlement_amount"
    const onChangeTranch = [...tranches]
    onChangeTranch[index][name] = value
    onChangeTranch[index]["errorAmount"] = false
    setTranches(onChangeTranch)
    if (value > 0 || value === "") {
      setDisabled(false)
    }
    else {
      onChangeTranch[index]["errorAmount"] = true
      setDisabled(true)
    }
  }

  const handleSettlemetDate = (date, index) => {
    setDisabled(false)
    const onChangeTranch = [...tranches]
    onChangeTranch[index]["errorDate"] = false
    if (tranches.length !== 1) {
      let count = tranches.length - 2
      let currentDate = new Date(moment(date).format("YYYY-MM-DD"))
      let previousDate = new Date(moment(tranches[count]["settlement_date"]).format("YYYY-MM-DD"))
      if (currentDate <= previousDate) {
        onChangeTranch[index]["errorDate"] = true
        setDisabled(true)
      }
      else {
        onChangeTranch[index]["errorDate"] = false
        setDisabled(false)
      }
    }
    for (let i = 1; i < tranches.length; i++) {
      if (new Date(tranches[i]["settlement_date"]) <= new Date(tranches[i - 1]["settlement_date"])) {
        onChangeTranch[i]["errorDate"] = true // Dates are not in ascending order
        setDisabled(true)
      }
      else {
        onChangeTranch[i]["errorDate"] = false
        setDisabled(false)
      }
    }
  }

  const handleTotalAmount = () => {
    let total = 0
    for (let i = 0; i < tranches.length; i++) {
      total = (Number(tranches[i].settlement_amount) + total)
    }
    setTotalAmount(total)
  }

  const handleSubmit = (event, index) => {
    offerInvalidPopup(false)
    for (let i = 0; i < tranches.length; i++) {
      if (tranches[i].settlement_amount === "") {
        tranches[i].errorAmount = true
      }
      if (tranches[i].settlement_date === "") {
        tranches[i].errorDate = true
      }
    }
    if (!disabled) {
      const data = {
        loan_id: loanId,
        company_id: companyId,
        product_id: productId,
        user_id: user._id,
        requestor_comment: comment,
        tranches: tranches
      };
      new Promise((resolve, reject) => {
        dispatch(settlementRequestWatcher(data, resolve, reject));
      })
        .then(response => {
          showAlert(response.message, "success")
          location.reload();
        })
        .catch(error => {
          showAlert(error.response.data.message, "error");
        });
    }
    else {
      showAlert("please enter valid amount and date", "error");
    }
  }

  return (
    <>
      {alertBox ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}

      {/* <FormPopUp
        onClose={handleCloseDialog}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        maxWidth={"lg"}
        style={{ marginBottom: "100px" }}
      > */}
      <FormPopUp
        heading="Create New Settlement Offer"
        open={openDialog}
        isOpen={openDialog}
        onClose={handleCloseDialog}
        customStyles={modalStyle}
      >

        <div style={{ marginBottom: "20px" }}>
          {
            tranches.map((value, index) =>
              <div key={index} style={{ display: "flex", flexDirection: "column", rowGap: "15px", marginTop: "20px" }} >
                <BasicDatePicker
                  name="settlement_date"
                  placeholder="Date of return"
                  error={value.errorDate}
                  helperText={value.errorDate
                    ? "Selected date must be greater than previous date"
                    : ""}
                  value={value.settlement_date}
                  onDateChange={date => {
                    const onChangeTranch = [...tranches];
                    if (date == "Invalid Date" || date == null) {
                      onChangeTranch[index]["settlement_date"] = null;
                    } else {
                      onChangeTranch[index]["settlement_date"] = verifyDateAfter1800(moment(date).format("YYYY-MM-DD")) ? moment(date).format("YYYY-MM-DD") : date;
                      handleSettlemetDate(verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                        ? moment(date).format("YYYY-MM-DD")
                        : date, index);
                    }
                    setTranches(onChangeTranch);
                  }} />
                {/* <TextField
                  name="settlement_amount"
                  id="outlined-basic"
                  label="₹ Settlement Amount"
                  variant="outlined"
                  error={value.errorAmount}
                  helperText={value.errorAmount
                    ? "Enter valid amount greater than 0"
                    : ""}
                  value={value.settlement_amount}
                  onChange={(event) => {
                    handleChange(event, index), handleTotalAmount()
                  }}
                  onKeyDown={handleDecimalLimit} /> */}
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <InputBox
                    label="₹ Settlement Amount"
                    id={'settlement_amount'}
                    error={value.errorAmount}
                    onClick={(event) => {
                      event.target = event;
                      handleChange(event, index), handleTotalAmount()
                    }}
                    helperText={value.errorAmount
                      ? "Enter valid amount greater than 0"
                      : ""
                    }
                    isDisabled={false}
                    accordianResp = {true}
                    customClass={customStyle}
                    customInputClass={customStyle1}
                    customErrorClass = {{marginTop:"12px"}}
                  />
                  <HighlightOffRoundedIcon
                    color="error"
                    onClick={() => { handleDelete(index) }}
                    style={{ marginLeft: "10px", marginTop:"29.5px" }} />
                </div>
              </div>
            )
          }

          <div style={{marginTop:"20px"}}>
            TOTAL- {totalAmount>=0?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalAmount):"NA"}
          </div>
          <Link style ={{marginTop:"35px", color: "#475BD8" , fontFamily: "Montserrat-Regular", fontSize: "12px", fontStyle: "normal", fontWeight: "900"}}
            onClick={handleAddTranch}>Add settlement tranch</Link>
        </div>
        <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",width:"94%",position:"fixed"}}>
        <div>
          <TextField
            id="outlined-basic"
            label="Add Comment"
            placeholder="For e.g for a settlement offer of INR 50000 to be paid till 18th of may 2023,if the user makes a payment of INR 50000 or more till 3rd june settlement offer should be considered settled"
            variant="outlined"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            sx={{ minWidth: "99%" }}
            multiline={true}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", bottom:"0", width:"99%" , marginBottom:"12%",paddingTop:"48%",marginTop:"48%",position:"relative"}}>
          <Button
            id='cancel'
            label='Cancel'
            buttonType="secondary"
            onClick={(handleCloseDialog)}
            customStyle={{ borderRadius: "16px", height: "9%", width: "49%", marginRight: "2%",color: "rgb(71, 91, 216)" , fontSize: "80%", borderRadius: "8px", border: "1px solid #475BD8" , backgroundColor:"white", boxShadow:"none",border: "1px solid #475BD8" }}

          />
          <Button
          id='submit' 
          label='Submit' 
          buttonType='primary' 
          onClick={handleSubmit} 
          customStyle={{ borderRadius: "8px", width: "49%", height: "9%", fontSize: "80%" }} />

        </div>
        </div>
      </FormPopUp>
    </>
  )
}


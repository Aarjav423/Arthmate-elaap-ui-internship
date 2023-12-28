import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { storedList } from "../../../util/localstorage";
import {
  getChargeTypesWatcher,
  applyChargeWatcher
} from "../../../actions/charges";
import BasicDatePicker from "../../../components/DatePicker/basicDatePicker";
import { verifyDateAfter1800 } from "../../../util/helper";
import InputBox from "react-sdk/dist/components/InputBox/InputBox"
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import Button from "react-sdk/dist/components/Button/Button";
import "react-sdk/dist/styles/_fonts.scss"

export default function ChargeTypeRecord(props) {
  const { data, onModalClose, openDialog, setOpenDialog, company, product } =
    props;
  const [loanId, setLoanId] = useState(data.loan_id);
  const [companyId, setCompanyId] = useState(data.company_id);
  const [productId, setProductId] = useState(data.product_id);
  const [chargeTypeList, setChargeTypeList] = useState([]);
  const [chargeType, setChargeType] = useState("");
  const [chargeApplicationDate, setChargeApplicationDate] = useState("");
  const [amount, setAmount] = useState("");

  const dispatch = useDispatch();
  const user = storedList("user");
  
  const handleChange = event => {
      let { value } = event;
      value = value.replace(/[,₹A-Za-z]/g, "");
      setAmount(value);
  };

  useEffect(() => {
   setAmount(product.bounceCharges
               ?? product.bounce_charges
               ?? 0 );
    new Promise((resolve, reject) => {
      dispatch(getChargeTypesWatcher(resolve, reject));
    })
      .then(result => {
        let list = [];
        result.data.map(item => {
          list.push({
            label: item.charge_type,
            id: item.charge_id
          });
        });
        setChargeTypeList(list);
      })
      .catch(error => {
      });
  }, []);

  const handleApplyCharges = () => {
    const payload = {
      loan_id: loanId,
      charge_name: chargeType.label,
      charge_id: chargeType.id,
      company_id: companyId,
      product_id: productId,
      charge_application_date: moment(chargeApplicationDate).format(
        "YYYY-MM-DD"
      ),
      user_id: user._id,
      charge_amount: amount
    };
    new Promise((resolve, reject) => {
      dispatch(applyChargeWatcher(payload, resolve, reject));
    })
      .then(response => {
        onModalClose(response.message, "success");
      })
      .catch(error => {
        onModalClose(error?.response?.data?.message, "error");
      });
    setOpenDialog(false);
  };

  const handleClose = () => {
    setOpenDialog(false);
    onModalClose("", "");
  };

  const styleButton = {
    display: "flex",
    width: "50%",
    padding: "13px 44px",
    borderRadius: "8px",
    height: "48px",
    fontFamily: "Montserrat-Regular",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: "150%"
  };

  const styleInputBox = {
    color: "#141519",
    fontFamily: "Montserrat-Regular",
    fontSize: "16px",
    fontWeight: "400"
  };

  return (
    <>
      <FormPopup
        heading="Record Charge"
        isOpen={openDialog}
        onClose={handleClose}
        customHeaderStyle={{
          fontSize: "24px",
          fontFamily: "Montserrat-Bold",
          fontWeight: "700",
          lineHeight: "150%",
          color: "#303030"
        }}
        customStyles={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          width: "28%",
          height: "100%",
          padding: "24px",
          borderRadius: "8px",
          background: "#FFF",
          marginLeft: "36%"
        }}
        customStyles1={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}
      >
        <div 
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "32px"
          }}
        >
          <InputBox
            id="record-charge-select-charge"
            label="Select Charge"
            isDrawdown={true}
            options={chargeTypeList}
            onClick={chargeType => setChargeType(chargeType)}
            customClass={{
              ...styleInputBox,
              minWidth: "100%",
              height: "62px"
            }}
            customDropdownClass={{
              ...styleInputBox,
              zIndex: "2",
              marginTop: "16px",
              marginRight: "-8px"
            }}
          />

          <BasicDatePicker
            placeholder={"Charge Application Date"}
            value={chargeApplicationDate || null}
            onDateChange={date => {
              setChargeApplicationDate(
                verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                  ? moment(date).format("YYYY-MM-DD")
                  : date
              );
            }}
            style={{
              ...styleInputBox,
              width: "100%"
            }}
          />
			
           <InputBox
            id="record-charge-amount"
            label={chargeType.label === "Bounce Charge" ? 
              "Amount(Exclusive of GST)":
              "Amount"
              }
            initialValue={
              "\u20B9" + Number(chargeType.label === "Bounce Charge"
	                ? amount
	                : 0).toLocaleString('en-IN')
            }
            onClick={handleChange}
            customClass={{
              minWidth: "100%",
              height: "62px"
            }}
            customInputClass={{
              ...styleInputBox,
              minWidth: "100%"
            }}
          /> 
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly"
          }}
        >
          <Button
            id="record-charge-cancel-button"
            buttonType="secondary"
            label="Cancel"
            onClick={handleClose}
            customStyle={{
              ...styleButton,
              color: "#475BD8",
              border: "1px solid #475BD8",
              boxShadow: "none"
            }}
          />

          <Button
            id="record-charge-cancel-button"
            buttonType="primary"
            label="Submit"
            onClick={handleApplyCharges}
            customStyle={styleButton}
          />
        </div>
      </FormPopup>
    </>
  );
}

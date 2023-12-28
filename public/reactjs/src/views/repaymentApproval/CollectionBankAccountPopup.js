import React, {useState, useEffect} from 'react';
import {useDispatch} from "react-redux";
import FormPopup from 'react-sdk/dist/components/Popup/FormPopup';
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import Button from 'react-sdk/dist/components/Button';
import {
  approveRepaymentsWatcher
} from "../../actions/repaymentApproval";
import { collectionBankDetailsWatcher } from '../../actions/collectionBankDetailsWatcher';

const CollectionBankAccountPopup = ({
  isOpen, 
  setIsOpen, 
  showAlert, 
  company, 
  product, 
  user, 
  page, 
  rowsPerPage, 
  setPage, 
  getRepaymentPendingList, 
  selectedRecords
}) => {

  const dispatch = useDispatch();

  const [bank, setBank] = useState("");

  const [options, setOptions] = useState([]);

  const onClose = () => {
    setIsOpen(false);
  }

  const changeBank = (value) => {
    setBank(value);
  }

  const handleSubmit = () => {

    const bankName = bank.label.split('-')[0].trim();
    const bankAccountNumber = bank.label.split('-')[1].trim();

    const data = {
      company_id: company.value,
      product_id: product.value,
      user_id: user._id,
      page,
      limit: rowsPerPage,
      status: "Y",
      bankName: bankName,
      bankAccountNumber: bankAccountNumber
    };
    setPage(0);
    const payload = { data, selectedRecords };
    dispatch(
      approveRepaymentsWatcher(
        payload,
        response => {
          showAlert(response?.message, "success");
          onClose();
          getRepaymentPendingList(0);
        },
        error => {
          showAlert(error.response.data.message, "error");
          getRepaymentPendingList(0);
        }
      )
    );
  };

  useEffect(() => {
    dispatch(
      collectionBankDetailsWatcher(
        response => {
          let tempOptions = [];
          response.map(bank => tempOptions.push({label: `${bank.bank_name} - ${bank.bank_acc_num}`}))
          setOptions(tempOptions);
        }
      )
    )
  }, [])

  //Styles
  const buttonStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly", 
    position: "absolute",
    bottom: "2%",
    left: 0,
    width: "100%"
  } 

  const cancelButtonStyle = {
    borderRadius: "5%",
    width: "45%"
  }

  const inputBoxStyle = {
    maxWidth: "none", 
    width: "100%",
    height: "60px",
    fontFamily: "Montserrat-Regular"
  }

  const dropdownStyle = {
    width: "103%", 
    marginTop: "4%",
  }

  const customStyles = {
    position: "fixed",
    left: "auto",
    right: "-260px",
    height: "98%",
    overflowX: "hidden"
  }

  const customStyles1 = {
    paddingTop: "15%"
  }

  const customHeaderStyle = {
    position: "absolute",
    paddingRight: "5%"
  }

  return (
    <FormPopup 
      heading="Select Collection Bank Account" 
      isOpen={isOpen} 
      onClose={onClose} 
      customStyles={customStyles} 
      customStyles1={customStyles1}
      customHeaderStyle={customHeaderStyle}
    >
        <InputBox 
          isDrawdown={true}
          label="Select Account"
          options={options}
          customClass={inputBoxStyle}
          customDropdownClass={dropdownStyle}
          onClick={bank => {
            changeBank(bank);
          }}
          drawdownNextLine={true}
        />
      <div style={buttonStyles}>
        <Button label="Cancel" buttonType='secondary' customStyle={cancelButtonStyle} onClick={onClose}/>
        <Button label="Submit" buttonType='primary' customStyle={cancelButtonStyle} isDisabled={!bank ? true : false} onClick={handleSubmit}/>
      </div>
    </FormPopup>
  )
}

export default CollectionBankAccountPopup;
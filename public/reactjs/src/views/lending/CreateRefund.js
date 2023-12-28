import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import FormPopUp from 'react-sdk/dist/components/Popup/FormPopup';
import Button from 'react-sdk/dist/components/Button';
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import Table from 'react-sdk/dist/components/Table';
import moment from 'moment';
import { AlertBox } from '../../components/AlertBox';
import { useParams } from 'react-router-dom';
import { initiateRefundWatcher, initiateExcessRefundWatcher } from '../../actions/refund';
import { storedList } from '../../util/localstorage';

export default function TdsRefundRequest({ handleClose, data }) {
  const params = useParams();
  const dispatch = useDispatch();
  const [isopen, setIsOpen] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('interest');
  const [totalAmount, setTotalAmount] = useState('');
  const user = storedList('user');

  const handleOnChange = async (value) => {
    setSelectedFileType(value);
    if (value === 'interest') {
      setIsDisabled(Number(data?.interest_refund?.amount) > 0 ? false : true);
    }
    if (value === 'excess') {
      setIsDisabled(Number(totalAmount) > 0 ? false : true);
    }
  };

  const styleRadioCheckboxInput = {
    height: '16px',
    width: '16px',
    verticalAlign: 'middle',
  };

  const styleRadioCheckboxLabel = {
    marginLeft: '8px',
    color: '#141519',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '150%',
  };

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
    setSeverity('');
    setAlertMessage('');
  };

  const columns = [
    { id: 'utr_number', label: <span style={{ width: '200px', marginLeft: '-20px', color: 'black' }}>{'UTR No.'}</span>, format: (row) => <span style={{ width: '200px', marginLeft: '-20px' }}>{row?.utr_number}</span> },
    { id: 'utr_date_time', label: <span style={{ width: '200px', color: 'black' }}>{'UTR DATE'}</span>, format: (row) => <span style={{ width: '200px' }}>{moment(row?.utr_date_time).format('DD-MM-YYYY')}</span> },
    { id: 'amount', label: <span style={{ width: '200px', color: 'black' }}>{'EXCESS AMOUNT'}</span>, format: (row) => <span style={{ width: '200px' }}>₹{(row?.amount).toLocaleString('en-IN')}</span> },
  ];

  const updateTotal = (value) => {
    const amount = data?.excess_ledgers?.length ? data?.excess_ledgers[0]?.amount : data?.total_excess_ledgers_amount;
    let received = value?.replace(/[^.0-9]/g, '')?.split('.');
    received = received.length > 2 ? received.slice(0, 2).join('.') : received.join('.');
    if (!isNaN(received) && Number(received) <= Number(amount)) {
      setTotalAmount(received);
      setIsDisabled(Number(value) > 0 ? false : true);
    } else {
      setIsDisabled(true);
    }
  };

  const handleSubmit = (event) => {
    let payload = {
      company_id: params.company_id,
      product_id: params.product_id,
      loan_id: params.loan_id,
      user_id: user?.id ?? user?._id,
    };
    try {
      if (selectedFileType === 'interest') {
        if (parseFloat(data?.interest_refund?.amount) <= 0) throw new Error('Interest refund amount must be greater than zero.');
        payload = {
          ...payload,
          refund_days: data?.interest_refund?.refund_days,
          net_disbur_amt: data?.interest_refund?.amount,
          refund_amount: data?.interest_refund?.amount,
        };
        dispatch(
          initiateRefundWatcher(
            payload,
            (response) => {
              showAlert(response?.message ?? 'Interest refund initiated successfully.', 'success');
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            },
            (error) => {
              showAlert(error?.response?.data?.message ?? 'Technical error, please try again.', 'error');
            },
          ),
        );
      }
      if (selectedFileType === 'excess') {
        if (parseFloat(totalAmount) <= 0) throw new Error('Excess refund amount must be greater than zero.');
        payload = {
          ...payload,
          excess_amount: totalAmount,
        };
        dispatch(
          initiateExcessRefundWatcher(
            payload,
            (response) => {
              showAlert(response?.message ?? 'Excess interest refund initiated successfully.', 'success');
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            },
            (error) => {
              showAlert(error?.response?.data?.message ?? 'Technical error, please try again.', 'error');
            },
          ),
        );
      }
    } catch (error) {
      showAlert(error?.response?.data?.message ?? error?.message ?? 'Technical error, please try again.', 'error');
    }
  };

  return (
    <>
      <FormPopUp
        heading={'Create Refund'}
        isOpen={isopen}
        onClose={handleClose}
        customStyles={{
          position: 'fixed',
          width: '30%',
          height: '100%',
          maxHeight: '100%',
          marginLeft: '35%',
          paddingTop: '2%',
          display: 'flex',
          flexDirection: 'column',
          float: 'right',
          overflowY: 'auto',
        }}
      >
        {alert ? <AlertBox severity={severity} msg={alertMessage} onClose={handleAlertClose} /> : null}
        <div
          style={{
            fontFamily: 'Montserrat-Regular',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <div
            style={{
              width: '98%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                width: '100%',
                color: '#141519',
                fontFamily: 'Montserrat-Semibold',
                fontSize: '18px',
                fontWeight: '600',
                lineHeight: '150%',
              }}
            >
              Select refund type
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                height: '24px',
                gap: '24px',
              }}
            >
              <div>
                <input
                  id="interest-input-1"
                  type="radio"
                  name="interest_required"
                  value={'interest'}
                  onChange={(event) => {
                    handleOnChange(event.target.value);
                  }}
                  style={styleRadioCheckboxInput}
                  checked={selectedFileType === 'interest'}
                />
                <label htmlFor="interest-input-1" style={styleRadioCheckboxLabel}>
                  Interest refund
                </label>
              </div>
              <div>
                <input
                  id="excess-input-0"
                  type="radio"
                  name="excess_required"
                  value={'excess'}
                  onChange={(event) => {
                    handleOnChange(event.target.value);
                  }}
                  style={styleRadioCheckboxInput}
                  checked={selectedFileType === 'excess'}
                />
                <label htmlFor="excess-input-0" style={styleRadioCheckboxLabel}>
                  Excess refund
                </label>
              </div>
            </div>
          </div>

          {selectedFileType == 'interest' && (
            <div style={{ marginTop: '40px', fontFamily: 'Montserrat-Medium', color: 'black', fontSize: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
                <span>No. of Refund Days</span>
                <span style={{ fontFamily: 'Montserrat-Regular' }}>{data?.interest_refund?.refund_days ?? '0'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', marginTop: '16px' }}>
                <span>Refund Amount</span>
                <span style={{ fontFamily: 'Montserrat-Regular' }}> {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data?.interest_refund?.amount ?? '0.00')}</span>
              </div>
            </div>
          )}

          {selectedFileType == 'excess' && (
            <div>
              <div style={{ marginTop: '40px' }}>{data?.interest_refund?.status == 'Active' && <Table customStyle={{ display: 'grid', gridTemplateColumns: '35% 30% 35%', width: '100%', overflowX: 'hidden' }} data={data?.excess_ledgers || []} columns={columns} />}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <div>
                  {' '}
                  <span style={{ fontFamily: 'Montserrat-Semibold', color: 'black', fontSize: '14px' }}>Excess Amount Available</span>
                  <InputBox
                    label="Total Amount"
                    customClass={{
                      marginTop: '6%',
                      height: '60px',
                      width: '100%',
                      maxWidth: '100%',
                    }}
                    initialValue={data?.excess_ledgers?.length ? data?.excess_ledgers[0]?.amount : data?.total_excess_ledgers_amount}
                    isDisabled={true}
                  />
                </div>

                <div style={{ marginLeft: '15px' }}>
                  <span style={{ fontFamily: 'Montserrat-Semibold', color: 'black', fontSize: '14px' }}>Refund Amount</span>
                  <InputBox
                    label="Enter Amount*"
                    id={'Enter Amount'}
                    customClass={{
                      marginTop: '6%',
                      height: '60px',
                      width: '100%',
                      maxWidth: '100%',
                    }}
                    initialValue={totalAmount}
                    onClick={(event) => updateTotal(event.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              width: '90%',
              display: 'flex',
              bottom: '4vh',
              position: 'absolute',
            }}
          >
            <Button
              id="cancel"
              label="Cancel"
              buttonType="secondary"
              onClick={handleClose}
              customStyle={{
                width: '49%',
                marginRight: '2%',
                color: 'rgb(71, 91, 216)',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #475BD8',
                backgroundColor: 'white',
                boxShadow: 'none',
              }}
            />
            <Button
              id="submit"
              label="Submit"
              buttonType="secondary"
              onClick={(event) => handleSubmit(event)}
              isDisabled={isDisabled}
              customStyle={{
                borderRadius: '8px',
                width: '49%',
                fontSize: '16px',
                backgroundColor: isDisabled ? '#E5E5E8' : '#475BD8',
                color: isDisabled ? '#C0C1C8' : '#FFFFFF',
              }}
            />
          </div>
        </div>
      </FormPopUp>
    </>
  );
}

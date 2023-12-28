import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import offerImage from '../../assets/images/Offer_image.svg';
import InfoIcon from '../../assets/images/info-circle (3) (1).svg';
import SuccessIcon from '../../../assets/img/successIcon.svg';
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import TextField from '@mui/material/TextField';
import './OfferGenerate.style.css';
import { getBicDataWatcher } from "../../actions/msme.action"
import useDimensions from '../../../hooks/useDimensions';
import { setObjectKeysToDefault } from '../../../util/helper';
import { offerGenerateJson } from './offerGenerateJson';
import Button from 'react-sdk/dist/components/Button';
import { checkAccessTags } from '../../../util/uam';
import { storedList } from '../../../util/localstorage';
import { LeadStatus } from '../../config/LeadStatus';
import { updateLeadDetailsWatcher, getLeadOfferWcher } from '../../actions/lead.action';
import FormPopup from 'react-sdk/dist/components/Popup/FormPopup';
import { updateLeadDeviationWatcher, ammendOfferAPIWatcher } from '../../actions/msme.action';
import CustomButton from "react-sdk/dist/components/Button/Button";

const offerFormDetails = offerGenerateJson();

export const OfferGenerate = (props) => {
  const { customStyle, loanAppId, MSMECompanyId, MSMEProductId, showAlert, leadStatus, fetchLeadDetails } = props;
  const [offer, setOffer] = React.useState(setObjectKeysToDefault(offerFormDetails, 'defaultValue'));
  const [offerError, setOfferError] = React.useState({});
  const dispatch = useDispatch();
  const [updatePopup, setUpdatePopup] = React.useState(false);
  const [ammendOffer, setAmmendOffer] = React.useState(false);
  const [loanAmount, setLoanAmount] = React.useState("");
  const [tenure, setTenure ] = React.useState("");
  const [interestRate, setInterestRate] = React.useState("")
  const [remarks, setRemarks] = React.useState('');
  const [infoMessage, setInfoMessage] = React.useState('');
  const { innerWidth, innerHeight } = useDimensions();
  const [showSearchButton, setShowSearchButton] = React.useState(false);
  const [loanId, setLoanId] = React.useState('');
  const navigate = useHistory();
  const styles = useStyles({ innerWidth, innerHeight });
  const modalStyle = {
    width: '29%',
    height: '100%',
    maxHeight: '100%',
    marginLeft: '35%',
    paddingTop: '2%',
    marginRight: '1%',
    overflowY: 'auto',
  };

  const customStyleButton = {
    fontFamily: 'Montserrat-Regular',
    fontSize: '16px',
    padding: '8px 24px',
    fontWeight: 600,
    lineHeight: '24px',
    border: '1px solid #134CDE',
    gap: '10px',
    height: '40px',
    width: 'max-content',
    borderRadius: '40px',
    gap: '10px',
    backgroundColor: "#fff",
  };

  const customAmendButtonStyle = {
    fontFamily: 'Montserrat-Regular',
    fontSize: '16px',
    padding: '8px 24px',
    fontWeight: 600,
    lineHeight: '24px',
    border: '1px solid #134CDE',
    gap: '10px',
    height: '40px',
    width: 'max-content',
    borderRadius: '40px',
    gap: '10px',
    background:"linear-gradient(180deg, #134CDE 0%, #163FB7 100%, #163FB7 100%)",
  };

  const user = storedList('user');
  const history = useHistory();
  React.useEffect(() => {
    if (leadStatus == LeadStatus.offer_deviation.value) {
      setInfoMessage('Please review the generated offer');
    }
    if (leadStatus == LeadStatus.offer_generated.value) {
      setInfoMessage('Offer extended to the Partner');
    }
    if (leadStatus == LeadStatus.follow_up_doc.value) {
      setInfoMessage('Additional Documents requested successfully');
    }
    if (leadStatus == LeadStatus.follow_up_kyc.value) {
      setInfoMessage('Follow-up KYC requested successfully');
    }
    if (leadStatus === LeadStatus.new.value) {
      setShowSearchButton(true);
    }
  }, [leadStatus]);

  React.useEffect(() => {
    if (loanAppId) {
      checkDataExistence(loanAppId);
    }
  }, [loanAppId]);

  // Function to check data existence based on loan_app_id
  const checkDataExistence = async (loanAppId) => {

    const payload = {
      loanAppId: loanAppId,
      user: user,
      user_id: user?._id,
      product_id: MSMEProductId,
      company_id: MSMECompanyId,
    };
    new Promise((resolve, reject) => {

      dispatch(getBicDataWatcher(payload, resolve, reject));
    })
      .then((response) => {
        if (response.success) {
          setShowSearchButton(true);
          setLoanId(response.loan_id);
        } else {
          setShowSearchButton(false);
          setLoanId('');
        }
      })
      .catch((error) => { console.error('Error checking data existence:', error); })
  };
  
  const handleSearch = () => {
    if (leadStatus === LeadStatus.new.value){
      history.push(`/admin/msme/loans/loan_creation/${loanAppId}/`);
    }
    else{
      history.push(`/admin/msme/loan_details/${loanId}/${MSMECompanyId}/${MSMEProductId}`);
    }
    
  };

  const customButton = {
    borderRadius: '8px',
    width: '240px',
    height: '56px',
    fontSize: '16px',
  };

  const getLeadOffer = () => {
    const payload = {
      loan_app_id: loanAppId,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      user: user,
    };
    new Promise((resolve, reject) => {
      dispatch(getLeadOfferWcher(payload, resolve, reject));
    })
      .then((response) => {
        let offerData = { ...offerFormDetails };
        offerData.interest_rate = +response.data.offered_int_rate;
        offerData.loan_amount = +response.data.offered_amount;
        offerData.tenure = +response.data.tenure;
        offerData.responsibility = response.data.responsibility;

        setOffer(offerData);
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  React.useEffect(() => {
    if (loanAppId) {
      getLeadOffer();
    }
  }, []);

  React.useEffect(()=>{
    setLoanAmount(offer.loan_amount);
    setTenure(offer.tenure);
    setInterestRate(offer.interest_rate)

	  },[offer])

  
  React.useEffect(() => {
    if (loanAppId) getLeadOffer();
  }, [loanAppId]);

  const handleUpdate = () => {
    setUpdatePopup(true);
  };

  const handleUpdateRemarks = () => {
    const payload = {
      loan_app_id: loanAppId,
      msme_company_id: MSMECompanyId,
      msme_product_id: MSMEProductId,
      user_id: user._id,
      action: 'request_to_update',
      remarks: remarks,
    };
    new Promise((resolve, reject) => {
      dispatch(updateLeadDeviationWatcher(payload, resolve, reject));
    })
      .then((response) => {
        showAlert('Remarks Updated Succesfully', 'success');
        fetchLeadDetails();
        setUpdatePopup(false);
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  const handleClose = () => {
    setUpdatePopup(false);
  };

  const handleAmmend = () => {
    setAmmendOffer(true);
  }

  const handleCancel = () => {
    setLoanAmount(offer.loan_amount);
    setTenure(offer.tenure);
    setInterestRate(offer.interest_rate);
    setAmmendOffer(false);
  }

  const handleReset = () => {
    setLoanAmount(offer.loan_amount);
    setTenure(offer.tenure);
    setInterestRate(offer.interest_rate);
  }

  const handleSubmit = () => {
    const payload = {
      user:user,
      loan_app_id:loanAppId,
      offered_amount: Number(loanAmount),
      offered_int_rate: Number(interestRate),
      offered_tenure: Number(tenure),
      msme_company_id: MSMECompanyId,
      msme_product_id: MSMEProductId,
      user_id:user._id
    }
    new Promise((resolve, reject) => {
      dispatch(ammendOfferAPIWatcher(payload, resolve, reject));
    })
      .then((response) => {
        showAlert("Offer Generated Successfully", "success");
        getLeadOffer();
        setAmmendOffer(false);
        fetchLeadDetails();
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, "error");
      });

    }

  const handleApprove = () => {
    const payload = {
      loan_app_id: loanAppId,
      msme_company_id: MSMECompanyId,
      msme_product_id: MSMEProductId,
      user_id: user._id,
      action: 'approve',
    };
    new Promise((resolve, reject) => {
      dispatch(updateLeadDeviationWatcher(payload, resolve, reject));
    })
      .then((response) => {
        showAlert('Remarks Updated Succesfully', 'success');
        fetchLeadDetails();
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  const handleAmmendPartner = () => {
    setAmmendOffer(true);
  }

  const hanldleAccept = (value) => {
    const payload = {
      loanAppId: loanAppId,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      user: user._id,
      status: LeadStatus.new.value,
      remarks: LeadStatus.new.label,
    };
    new Promise((resolve, reject) => {
      dispatch(updateLeadDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        showAlert(response?.message, 'success');
        setTimeout(() => {
          history.push(`/admin/msme/loans/loan_creation/${loanAppId}/`);
        }, 3000);
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  return (
    <>
      {updatePopup ? (
        <FormPopup heading="Request an Update" open={updatePopup} isOpen={updatePopup} onClose={handleClose} customStyles={modalStyle}>
          <div style={{ fontSize: '16px', color: '#767888', fontFamily: 'Montserrat-SemiBold', marginBottom: '4%' }}>You can request for update only</div>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Comment"
            placeholder="Please Add Comment"
            size="string"
            rows={15}
            multiline
            required
            autoFocus
            value={remarks}
            onChange={(event) => {
              setRemarks(event.target.value);
            }}
            inputProps={{
              style: {
                height: '32vh',
                marginTop: '2%',
                fontFamily: 'Montserrat-Regular',
                fontSize: '0.87vw',
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: '92%',
                fontFamily: 'Montserrat-Regular',
              },
            }}
          />
          <div style={{ display: 'flex', marginTop: '85%' }}>
            <Button label="Cancel" buttonType="secondary" onClick={handleClose} customStyle={customButton} />
            <Button label="Submit" buttonType="primary" onClick={handleUpdateRemarks} customStyle={customButton} />
          </div>
        </FormPopup>
      ) : null}
      {((offer.responsibility === 'credit' && checkAccessTags(['tag_offer_deviation_credit'])) || (offer.responsibility === 'risk' && checkAccessTags(['tag_offer_deviation_risk']))) ? (
        <>
          <div style={{ backgroundColor: `${leadStatus == LeadStatus.offer_deviation.value || leadStatus == LeadStatus.follow_up_kyc.value ? '#FFF5E6' : '#EEFFF7'}`, height: '80px', width: '98.2%', marginBottom: '1%', borderRadius: '8px', border: `${leadStatus == LeadStatus.offer_deviation.value || leadStatus == LeadStatus.follow_up_kyc.value ? '1px solid #EDA12F' : '1px solid #008042'}` }}>
            <div style={{ display: 'flex', alignItems:'center',height:"100%"}}>
              <img src={leadStatus == LeadStatus.offer_deviation.value || leadStatus == LeadStatus.follow_up_kyc.value ? InfoIcon : SuccessIcon} style={{ marginLeft: '2%', width:'22px' }} />
              {leadStatus == LeadStatus.offer_deviation.value || leadStatus == LeadStatus.follow_up_kyc.value ? <div style={{ marginLeft: '1%', color: '#EDA12F', fontSize: '18px', fontFamily: 'Montserrat-SemiBold' }}>{infoMessage}</div> : <div style={{ marginLeft: '1%', color: '#008042', fontSize: '18px', fontFamily: 'Montserrat-SemiBold' }}>{infoMessage}</div>}
            </div>
          </div>
        </>
      ) : null}
      <div className="containerStyle" style={customStyle}>
        <div>
          <img className="offerImage" src={offerImage} alt="Offer Image" />
        </div>
        <div style={{ width: '100%' }}>
          <h2 className="offerHead">Offer Generated</h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginRight: '20px',
              marginLeft: '10px',
            }}
          >
            <InputBox
              customClass={styles['textStyleHead']}
              customInputClass={styles['textStyleData']}
              id={offerFormDetails['loan_amount']['id']}
              label={offerFormDetails['loan_amount']['label']}
              // type={offerFormDetails["loan_amount"]["type"]}
              name={offerFormDetails['loan_amount']['name']}
              // autoComplete="off"
              placeholder={offerFormDetails['loan_amount']['placeholder']}
              isRequired={offerFormDetails['loan_amount']['isRequired']}
              initialValue={loanAmount}
              error={offerError['loan_amount']}
              helperText={offerError['loan_amount']}
              isDrawdown={false}
              isDisabled={ammendOffer?false:true}
	            onClick={e => setLoanAmount(e.value)}
            />

            <InputBox
              customClass={styles['textStyleHead']}
              customInputClass={styles['textStyleData']}
              id={offerFormDetails['tenure']['id']}
              label={offerFormDetails['tenure']['label']}
              // type={offerFormDetails["tenure"]["type"]}
              name={offerFormDetails['tenure']['name']}
              // autoComplete="off"
              placeholder={offerFormDetails['tenure']['placeholder']}
              isRequired={offerFormDetails['tenure']['isRequired']}
              initialValue={tenure}
              error={offerError['tenure']}
              helperText={offerError['tenure']}
              isDrawdown={false}
              isDisabled={ammendOffer?false:true}
	            onClick={e => setTenure(e.value)}
            />

            <InputBox
              customClass={styles['textStyleHead']}
              customInputClass={styles['textStyleData']}
              id={offerFormDetails['interest_rate']['id']}
              label={offerFormDetails['interest_rate']['label']}
              type={offerFormDetails['interest_rate']['type']}
              name={offerFormDetails['interest_rate']['name']}
              // autoComplete="off"
              placeholder={offerFormDetails['interest_rate']['placeholder']}
              isRequired={offerFormDetails['interest_rate']['isRequired']}
              initialValue={interestRate}
              error={offerError['interest_rate']}
              helperText={offerError['interest_rate']}
              isDrawdown={false}
              isDisabled={ammendOffer?false:true}
	            onClick={e => setInterestRate(e.value)}
            />
          </div>
          {checkAccessTags(['tag_msme_lead_view_ext_btn_offer']) && leadStatus === LeadStatus.offer_generated.value ? !ammendOffer?(
            <div style={{ marginTop: '24px', marginBottom: '24px' }} className="offer-detail-buttons">
              <Button label="Amend" onClick={handleAmmendPartner} isDisabled={false} buttonType="secondary" customStyle={customStyleButton}></Button>
              <Button label="Accept" onClick={hanldleAccept} isDisabled={false} buttonType="primary" customStyle={customAmendButtonStyle}></Button>
            </div>
          ):
          <>
           <div style={{ marginTop: '24px', marginBottom: '24px' }} className="offer-detail-buttons">
                <Button label="Cancel" buttonType="secondary" customStyle={customStyleButton} onClick={handleCancel} />
                <Button label="Reset" buttonType="secondary" isDisabled={loanAmount!=offer.loan_amount||tenure!=offer.tenure||interestRate!=offer.interest_rate?false:true} customStyle={customStyleButton} onClick={handleReset}/>
                <Button label="Submit" buttonType="primary" isDisabled={loanAmount==offer.loan_amount&&tenure==offer.tenure&&interestRate==offer.interest_rate?true:false} customStyle={customAmendButtonStyle} onClick={handleSubmit} />
              </div>
          </>
           : null}
          {((offer.responsibility === 'credit' && checkAccessTags(['tag_offer_deviation_credit'])) || (offer.responsibility === 'risk' && checkAccessTags(['tag_offer_deviation_risk']))) && leadStatus == LeadStatus.offer_deviation.value ? !ammendOffer?(
            <>
              <div style={{ display: 'flex', paddingTop: '2%', paddingBottom:"1%", marginLeft:"auto", justifyContent:"end", paddingRight:"3%" }}>   
                <Button label="Request an Update" buttonType="link-button" isDisabled={leadStatus == LeadStatus.offer_deviation.value ? false : true} customStyle={{ fontSize: '16px', marginRight: '3%', padding:"1%", boxShadow:"none", textDecoration:"none", color: `${leadStatus == LeadStatus.offer_deviation.value ? '#134CDE' : '#CCCDD3'}` }} onClick={handleUpdate} />
                <Button label="Amend" buttonType="link-button" isDisabled={leadStatus == LeadStatus.offer_deviation.value ? false : true} customStyle={{ fontSize: '16px', marginRight: '3%', padding:"1%", boxShadow:"none",  textDecoration:"none", color: `${leadStatus == LeadStatus.offer_deviation.value ? '#134CDE' : '#CCCDD3'}` }} onClick={handleAmmend}/>
                <Button label="Approve" buttonType="link-button" isDisabled={leadStatus == LeadStatus.offer_deviation.value ? false : true} customStyle={{ fontSize: '16px', padding:"1%", boxShadow:"none",  textDecoration:"none", color: `${leadStatus == LeadStatus.offer_deviation.value ? '#134CDE' : '#CCCDD3'}`}} onClick={handleApprove} />
              </div>
            </>
          ):
          <>
           <div style={{ marginTop: '24px', marginBottom: '24px' }} className="offer-detail-buttons">
                <Button label="Cancel" buttonType="secondary" customStyle={customStyleButton} onClick={handleCancel} />
                <Button label="Reset" buttonType="secondary" isDisabled={loanAmount!=offer.loan_amount||tenure!=offer.tenure||interestRate!=offer.interest_rate?false:true} customStyle={customStyleButton} onClick={handleReset}/>
                <Button label="Submit" buttonType="primary" isDisabled={loanAmount==offer.loan_amount&&tenure==offer.tenure&&interestRate==offer.interest_rate?true:false} customStyle={customAmendButtonStyle} onClick={handleSubmit} />
              </div>
          </> : null}
           {showSearchButton && checkAccessTags(["tag_msme_lead_read"]) ? (
            <CustomButton label="Back to loan details" buttonType="primary" customStyle={{ height: "40px", fontSize: "16px", padding: "5px 24px 5px 24px", width: "32%", marginRight: "10px", marginLeft: "66%",borderRadius: "30px", marginTop: "20px" }} onClick={() => { handleSearch(); }} />
      ) : null}
        </div>
      </div>
    </>
  );
};
const useStyles = ({ innerWidth, innerHeight }) => {
  return {
    textStyleHead: {
      background: '#F1F1F3',
      borderRadius: '10px',
      height: '65px',
      borderColor: '#D8D9DE',
      textAlign: 'left',
      /* background: #F1F1F3; */
      color: '#767888',
      marginRight: '10px',
      width: '100%'
    },
    textStyleData: {
      textAlign: 'left',
      background: '#F1F1F3',
      fontSize: innerWidth > 1400 ? '14px' : '12px',
      width: '100%',

      // @mediaScreen and (maxWidth: 971px){
      //     fontSize: small;
      // }
    },
    // button: {
    //   height: "40px",
    //   width: "160px",
    //   borderRadius: "20px",
    //   marginLeft: "16px",
    //   fontSize: "14px",
    //   padding: 0,
    //   textAlign:'center',
    //   alignItems:'center',
    //   backgroundColor:'#475BD8',
    //   color:'#FFF',
    //   fontFamily:'Montserrat-Regular'
    // },
    // buttonLoader: {
    //   border: "3px solid white",
    //   borderTop: "3px solid transparent",
    //   marginLeft:'40%'
    // },
    // dropdown: {
    //   zIndex: 1000,
    //   marginTop: "8px",
    //   width: innerWidth > 900 ? "37vw" : innerWidth > 600 ? "45vw" : "70vw",
    // },
  };
};

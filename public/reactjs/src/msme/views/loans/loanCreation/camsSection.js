import React, { useState, useEffect } from 'react';
import EditableAccordian from 'react-sdk/dist/components/EditableAccordian';
import { useDispatch } from 'react-redux';
import { GSTData, CamsData, FinancialData, ConsumerBureau } from './camsData';
import '../../../views/financialDoument/FinancialDocument.css';
import { getCamsDataWatcher, updateCamsDataWatcher } from 'actions/camsDetails';
import { AlertBox } from 'components/AlertBox';
import { storedList } from 'util/localstorage';
import ArrowDown from '../../../assets/ArrowDown.svg';
import ArrowUp from '../../../assets/ArrowUp.svg';
import { sanitizeResponse } from '../../../../util/msme/helper';
import { LeadNewStatus } from '../../../config/LeadStatus';
import { checkAccessTags } from '../../../../util/uam';
import { getBookLoanDetailsWatcher } from '../../../actions/bookLoan.action';

const user = storedList('user');

const parentButtonStyle = {
    position: 'relative',
    padding: "20px",
    width: '100%',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'right',
};

const buttonSaveStyle = {
    padding: '12px 24px',
    borderRadius: '40px',
    backgroundColor: "#fff",
    cursor: 'pointer',
    outline: 'none',
    border: '1px solid #134cde',
    gap: '10px',
    color: '#134cde',
    width: 'max-content',
};

const buttonNextStyle = {
    padding: '12px 24px',
    borderRadius: '40px',
    cursor: 'pointer',
    outline: 'none',
    border: 'none',
    gap: '10px',
    background: 'linear-gradient(180deg, #134CDE 0%, #163FB7 100%, #163FB7 100%)',
    color: 'white',
    width: 'max-content',
};

const CamsSection = (props) => {
    const [stateData, setStateData] = useState({});
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [alert, setAlert] = useState(false);
    const [openSection, setOpenSection] = useState(null);
    const [updatedState, setUpdatedState] = useState(null);
    const [validationData, setValidationData] = useState({});
    const [editable, setEditable] = useState(true);
    const [availableConsumerBureau , setAvailableConsumerBureau] = useState([]);
    const dispatch = useDispatch();

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const disCardFun = () => {
        if (checkAccessTags(['tag_msme_lead_view_int_read_write']) && !(props?.leadStatus === LeadNewStatus.Approved || props?.leadStatus === LeadNewStatus.New)) {
            setEditable(true);
        } else {
            setEditable(false);
        }
    };

    useEffect(() => {
        if (props?.leadStatus) {
            disCardFun();
        }
    }, [props?.leadStatus]);




    const getCamsData = () => {
        const payload = {
            loan_app_id: props.loanAppId,
            company_id: props.companyId,
            user_id: user.id ? user.id : user._id,
            product_id: props.productId,
        };
        new Promise((resolve, reject) => {
            dispatch(getCamsDataWatcher(payload, resolve, reject));
        })
            .then((response) => {
                updateStateArrayValue(response?.data);

                setUpdatedState(response?.data);
            })
            .catch((error) => {
                console.log('error::', error);
                showAlert(error?.response?.data?.message || 'Failed to fetch cams data.', 'error');
            });
    };
   const getLoanRequestDataApi = () => {
    const payload = {
      loan_app_id: props.loanAppId,
      companyId: props.companyId,
      productId: props.productId,
      user: user,
    };
    new Promise((resolve, reject) => {
      dispatch(getBookLoanDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        let tempConsumerBureau = [];
        if(response){
            ConsumerBureau.map((item , index) => {
                if(index < response[`co_applicant_details`].length +1 ){
                    tempConsumerBureau.push(item);
                }
            })
            setAvailableConsumerBureau(tempConsumerBureau);    
        }
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message || "Error while fetching loan details", "error");
      });
   }


    // PATCH UPDATE CAMS DATA API
    const updateCamsData = async () => {
        const replaceStringVl = (data) => {
            const newData = {};
            for (const key in data) {
                newData[key.replace('string_vl_', '')] = data[key];
            }
            return newData;
        };
        const updatedStateData = replaceStringVl(stateData);
        try {
            const payload = {
                loan_app_id: props.loanAppId,
                company_id: props.companyId,
                user_id: user.id ? user.id : user._id,
                product_id: props.productId,
                ...updatedStateData,
            };

            for (let key in payload) {
                if (payload[key] === '') {
                    delete payload[key];
                }
            }


            new Promise((resolve, reject) => {
                dispatch(updateCamsDataWatcher(payload, resolve, reject));
            })
                .then((response) => {
                    setAlert(true);
                    setSeverity('success');
                    setAlertMessage(response?.message);
                    setTimeout(() => {
                        handleAlertClose();
                    }, 4000);

                })
                .catch((error) => {
                    setAlert(true);
                    setSeverity('error');
                    setAlertMessage(error?.message);
                    setTimeout(() => {
                        handleAlertClose();
                    }, 4000);
                });
        } catch (error) {
            console.error('Error in getCamsData:', error);
        }
    };

    const showAlert = (msg, type) => {
        const element = document.getElementById('TopNavBar');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
        setAlert(true);
        setSeverity(type);
        setAlertMessage(msg);
        setTimeout(() => {
            handleAlertClose();
        }, 3000);
    };

    const change = (e) => {
        const { name, value } = e.target;
        setStateData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (props.companyId && props.productId && props.loanAppId) {
            getLoanRequestDataApi();
            getCamsData();
        }
    }, [props.companyId, props.productId, props.loanAppId]);

    const handleAlertClose = () => {
        setAlert(false);
        setSeverity('');
        setAlertMessage('');
    };

    const saveNext = () => {
        updateCamsData();
    };

    const updateStateArrayValue = (response) => {
        const tempStateArray = {};
        const tempErrorArray = {};

        GSTData[0].data?.map((obj) => {
            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;
            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        CamsData[0].data?.map((obj) => {
            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;

            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        CamsData[1].data?.map((obj) => {
            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;

            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        CamsData[2].data?.map((obj) => {
            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;

            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        CamsData[3].data?.map((obj) => {
            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;

            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        CamsData[4].data?.map((obj) => {
            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;

            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        FinancialData[0].data?.map((obj) => {
            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;
            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        FinancialData[1].data?.map((obj) => {
            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;
            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        FinancialData[2].data?.map((obj) => {
            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;
            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        ConsumerBureau[0].data?.map((obj) => {
            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;
            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        ConsumerBureau[1].data?.map((obj) => {
            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;
            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        ConsumerBureau[2].data?.map((obj) => {
            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;
            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        ConsumerBureau[3].data?.map((obj) => {
            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;
            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        ConsumerBureau[4].data?.map((obj) => {

            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;
            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        ConsumerBureau[5].data?.map((obj) => {

            const stateKey = `${obj.type}_vl_${obj.field}`;
            const errorKey = `${obj.type}_vl_${obj.field}State`;
            if (response[`${obj.field}`] != undefined && String(response[`${obj.field}`]).length > 0) {
                tempStateArray[stateKey] = sanitizeResponse(response[`${obj.field}`]);
            } else {
                tempStateArray[stateKey] = '';
            }
            tempErrorArray[errorKey] = '';
        });

        setStateData(tempStateArray);
        setValidationData(tempErrorArray);
    };

    const styles = {
        accordionSection: {
            border: '1px solid #C4C8D3',
            marginBottom: '10px',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            width: '97.2%',
            margin: 'auto',
            paddingBottom: openSection == 'section1' ? ' 22px' : '0px',
        },

        accordionSectionBureau: {
            border: '1px solid #C4C8D3',
            marginBottom: '10px',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            width: '97.2%',
            margin: 'auto',
            paddingBottom: openSection == 'section2' ? ' 22px' : '0px',
        },

        accordionHeader: {
            //   backgroundColor: '#FAFAFA',
            padding: '18px',
            cursor: 'pointer',
            fontSize: '1.125rem',
            color: '#1C1C1C',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between',
        },

        accordionContent: {
            padding: '10px',
            display: 'none',
        },
    };

    const msmeCamsData = CamsData.filter(obj => obj.title !== 'Crime Check' && obj.title !== 'Hunter');

    return (
        <>
            <EditableAccordian
                accordionData={GSTData}
                customClass={{
                    width: '97.3%',
                    marginLeft: '1.25%',
                    alignSelf: 'center',
                }}
                stateData={stateData}
                isEditable={editable}
                onChange={change}
                key={'cam'}
                validationData={{}}
            />

            <div style={{ marginTop: '1.23rem' }}>
                <div style={styles.accordionSection} className="accordion-section">
                    <div style={styles.accordionHeader} className="accordion-header" onClick={() => toggleSection('section2')}>
                        <div> Financial Statements </div>{' '}
                        <div>
                            <img src={openSection ? ArrowUp : ArrowDown} alt="ArrowDown" />
                        </div>
                    </div>
                    {openSection === 'section2' && (
                        <div className="accordion-content">
                            <EditableAccordian
                                accordionData={FinancialData}
                                customClass={{
                                    width: '97.3%',
                                    marginLeft: '1.25%',
                                    alignSelf: 'center',
                                }}
                                stateData={stateData}
                                onChange={change}
                                isEditable={editable}
                                key={'cam'}
                                validationData={{}}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '1.23rem' }}>
                <div style={styles.accordionSectionBureau} className="accordion-section">
                    <div style={styles.accordionHeader} className="accordion-header" onClick={() => toggleSection('section3')}>
                        <div> Consumer Bureau </div>
                        <div>
                            <img src={openSection ? ArrowUp : ArrowDown} alt="ArrowDown" />
                        </div>
                    </div>
                    {openSection === 'section3' && (
                        <div className="accordion-content">
                            <EditableAccordian
                                accordionData={availableConsumerBureau}
                                customClass={{
                                    width: '97.3%',
                                    marginLeft: '1.25%',
                                    alignSelf: 'center',
                                }}
                                stateData={stateData}
                                isEditable={editable}
                                onChange={change}
                                key={'cam'}
                                validationData={{}}
                            />
                        </div>
                    )}
                </div>
            </div>

            <EditableAccordian
                accordionData={props?.isMsme ? msmeCamsData :CamsData}
                customClass={{
                    width: '97.3%',
                    marginLeft: '1.25%',
                    alignSelf: 'center',
                }}
                stateData={stateData}
                isEditable={editable}
                onChange={change}
                key={'cam'}
                validationData={{}}
            />

            <div style={parentButtonStyle} className="parentButtonStyle">
                {!checkAccessTags(['tag_offer_deviation_risk']) ?
                    <>
                      {props?.isMsme ? null :
                      <>
                        <button style={buttonSaveStyle} className="buttonSave">
                            Discard
                        </button>
                        <button onClick={saveNext} style={buttonNextStyle} className="buttonNext">
                            Submit
                        </button> 
                       </> 
                    }
                    </> 
                : null}
            </div>

            {alert ? <AlertBox severity={severity} msg={alertMessage} onClose={handleAlertClose} /> : null}
        </>
    );
};

export default CamsSection;

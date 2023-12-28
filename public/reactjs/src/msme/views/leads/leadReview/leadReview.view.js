import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import TabButton from 'react-sdk/dist/components/TabButton';
import 'react-sdk/dist/styles/_fonts.scss';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { AlertBox } from '../../../../components/CustomAlertbox';

import useDimensions from 'hooks/useDimensions';
import { storedList } from '../../../../util/localstorage';
import { leadsAccordionData } from '../leadsDataJson';
import Popup from 'react-sdk/dist/components/Popup/Popup';
import Button from 'react-sdk/dist/components/Button/Button';
import { convertDataIntoAccordionData, deepCopy, toOrdinalCounting, toSnakeCase } from '../../../../util/msme/helper';
import { CustomAccordion, DocumentsList, OfferGenerate, Tooltip } from '../../../components/msme.component';
import docJsonData from './leadDocumentsData.json';
import StatusIcon from '../../../components/StatusIcon/StatusIcon';
import InfoIcon from '../../../../assets/img/info-circle.svg';
import { AuditLog } from '../../../components/AuditLog/AuditLog';
import SanctionLenderLead from '../sanctionAndLender/sanctionLenderLead.view';
import { CreateLoan } from 'msme/views/msme.view';
import { Natch } from 'msme/views/msme.view';
import './leadReview.style.css';
import LeadOfferDetails from './leadOfferDetails';
import CrossCircle from '../../../../assets/img/close-circle.svg';
import { getMsmeActivityLogsWatcher, getMsmeLeadReviewDetailsWatcher, updateLeadDetailsWatcher, commentDetailsWatcher, getLeadOfferWcher } from '../../../actions/lead.action';
import { LeadStatus } from '../../../config/LeadStatus';
import { COMMENT_FIELDS } from './fields';
import { setObjectKeysToDefault, toCamel } from 'util/helper';
import { ActionPopup } from '../../../components/ActionPopup/ActionPopup.component';
import { checkAccessTags } from '../../../../util/uam';
import Preloader from '../../../../components/custom/preLoader';
import Animation from './Animation.gif';
import { getMsmeLoanDocumentsWatcher } from 'msme/actions/bookLoan.action';
import { documentCode as DocumentCodeList } from 'msme/config/docCode';
import {docSectionCode} from 'msme/config/docSectionCode'
import CamsSection from 'msme/views/loans/loanCreation/camsSection';
import LeadReviewForm from './leadReviewForm/leadReviewForm';
const user = { _id: storedList('user')?._id, id: storedList('user')?.id };

const typeFields = {
  approve: 'Approve',
  sectionApprove: 'Approve',
  reject: 'Reject',
  addComment: 'Add Comment',
  requestUpdate: 'Request an Update',
};

const commentDataDefault = setObjectKeysToDefault(COMMENT_FIELDS);
const mapSubSection = {
  primary_applicant: 'primary',
  entity_details: 'entity',
  'co-applicant_details': 'co_borrower',
  guarantor_details: 'guarantor',
  financial_documents: 'financial_doc',
  additional_documents: 'additional_doc',
};

/**
 *
 * @param {*} props
 * @returns
 */
export default function LeadReview(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const isLoading = useSelector((state) => state.profile.loading);
  const [offer, setOffer] = useState();
  const [accordionData, setAccordionData] = useState([]);
  const [leadData, setLeadData] = useState({});
  const [actionId, setActionId] = useState({});
  const [actiontype, setActionType] = useState({});
  const [data, setData] = useState(commentDataDefault);
  const [type, setType] = useState('addComment');

  const [companyId, setCompanyId] = useState('');
  const [productId, setProductId] = useState('');
  const [dataErrors, setDataErrors] = useState(commentDataDefault);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const paramsData = useLocation().search.split('=').slice(-1);
  const selectedTab = decodeURIComponent(paramsData);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [disableApproveBtn, setDisableApproveBtn] = useState('false');
  const [leadStatus, setLeadStatus] = useState('');
  const [loanDocuments, setLoanDocuments] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [flag, setFlag] = useState(false);
  const [sectionRemarks, setSectionRemarks] = useState({});
  const [validationRemarks, setValidationRemarks] = useState({});
  const [commentFields , setCommentFields] = useState(COMMENT_FIELDS);
  let tabsAvailable = ['Lead Details', 'Documents', 'Cams'];
  // "Lead Details",
  // "Documents",
  // "Loan Details",
  // "SL & LBA",
  // "NACH",
  if (checkAccessTags(['tag_msme_lead_view_int_read', 'tag_msme_lead_view_int_read_write'])) {
    tabsAvailable = ['Lead Details', 'Documents', 'Cams'];
  }
  const [leadDetailSection, setLeadDetailSection] = useState(tabsAvailable.includes(selectedTab) ? selectedTab.toLowerCase() : tabsAvailable[0].toLowerCase());
  const history = useHistory();
  const params = useParams();
  const loanAppId = params.id;
  // const { lead_status } = history.location.state || {};

  const { innerWidth, innerHeight } = useDimensions();
  const styles = useStyles({ innerWidth, innerHeight });

  useEffect(() => {
    if (!isEdit) {
      fetchLeadDetails();
    }
    //formattedData(leadsAccordionData());
  }, [history, isEdit]);

  useEffect(() => {
    if (Object.keys(leadData).length != 0) {
      formattedData(leadData);
    }
  }, [leadData]);

  useEffect(() => {
    fetchActivityLogs();
    getLoanDocuments();
  }, []);

  const initializeLoanDocuments = (documents) => {
    const subsectionsDocList = [];
    for (const key in docSectionCode) {
      if (docSectionCode.hasOwnProperty(key)) {
        if (key === 'Co-Applicant' || key === 'Guarantor') {
          const DocList = documents.filter((item) => docSectionCode[key].includes(item.code));
          if (DocList.length) {
            const groupedCoApplicantDocList = DocList.reduce((acc, obj) => {
              const key = obj.borrower_id;

              if (!acc[key]) {
                acc[key] = [];
              }

              acc[key].push(obj);

              return acc;
            }, {});
            let count = 1;
            for (const newkey in groupedCoApplicantDocList) {
              if (groupedCoApplicantDocList.hasOwnProperty(newkey)) {
                const subsectionDocList = {
                  title: `${key}-${count}`,
                };
                subsectionDocList['docs'] = groupedCoApplicantDocList[newkey];
                subsectionsDocList.push(subsectionDocList);
                count = count + 1;
              }
            }
          }
        }else if(key ==='Financial Documents'){
          let DocListFinancialSection = documents.filter((item) => docSectionCode[key].includes(item.code));
          const bankStatementDoc = DocListFinancialSection.filter((item)=>item.code === DocumentCodeList.msme_bank_statement)
          if(bankStatementDoc.length){
            DocListFinancialSection = DocListFinancialSection.filter((item)=>item.code !== DocumentCodeList.msme_bank_statement)
            for(let i = 0; i<bankStatementDoc[0].additional_file_url.length; i++){
              if(bankStatementDoc[0].additional_file_url[i]){
                let newBankDoc = {...bankStatementDoc[0]};
                newBankDoc.file_url = bankStatementDoc[0].additional_file_url[i];
                newBankDoc.doc_index = i;
                newBankDoc.file_type = `${newBankDoc.file_type} ${toOrdinalCounting(i+1)} year`
                DocListFinancialSection.push(newBankDoc)
              }else{
                break;
              }
            }
          }
          const subsectionDocList = {
            title: key,
          };
          subsectionDocList['docs'] = DocListFinancialSection;
          if (subsectionDocList['docs'].length) subsectionsDocList.push(subsectionDocList);
        }
         else {
          const subsectionDocList = {
            title: key,
          };
          subsectionDocList['docs'] = documents.filter((item) => docSectionCode[key].includes(item.code));
          if (subsectionDocList['docs'].length) subsectionsDocList.push(subsectionDocList);
        }
      }
    }
    setLoanDocuments(subsectionsDocList);
  };

  const getLoanDocuments = () => {
    const { companyId, productId } = history.location.state || {};
    const payload = {
      loanAppID: params.id,
      companyId: companyId,
      productId: productId,
      user: user,
    };
    new Promise((resolve, reject) => {
      dispatch(getMsmeLoanDocumentsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        initializeLoanDocuments(response);
      })
      .catch((error) => {
        showAlert(error.response?.data?.message, 'error');
      });
  };

  const fetchActivityLogs = () => {
    const { companyId, productId } = history.location.state || {};
    const payload = {
      loanAppId: params.id,
      companyId,
      productId,
      user: user,
    };
    new Promise((resolve, reject) => {
      dispatch(getMsmeActivityLogsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setAuditLogs(response);
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  const fetchLeadDetails = () => {
    const { companyId, productId } = history.location.state || {};

    const payload = {
      loanAppId: params.id,
      companyId,
      productId,
      user: user,
    };

    new Promise((resolve, reject) => {
      dispatch(getMsmeLeadReviewDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setCompanyId(response.company_id);
        setProductId(response.product_id);
        delete response.company_id;
        delete response.product_id;
        setLeadStatus(response.lead_status);
        delete response.lead_status;
        setLeadData(response);
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  const handleLeadStatus = (value) => {
    const { companyId, productId } = history.location.state || {};
    const payload = {
      loanAppId: params.id,
      companyId,
      productId,
      user: user._id,
      status: value,
      remarks: data.comment ?? " ",
    };

    new Promise((resolve, reject) => {
      dispatch(updateLeadDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setOpenDialog(false);
        showAlert(response?.message, 'success');
        fetchActivityLogs();
        fetchLeadDetails();
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  const handlePopupSubmit = (actionId, title, type) => {
    let sequence = 100;

    if (actionId && actionId.split('_')[0] === 'co-applicant') {
      sequence = +(actionId.split('_')[1] - 1) + 300;
      actionId = 'co-applicant_details';
    } else if (actionId && actionId.split('_')[0] === 'guarantor') {
      sequence = +(actionId.split('_')[1] - 1) + 400;
      actionId = 'guarantor_details';
    } else if (actionId === 'primary_applicant') {
      sequence = 100;
    } else if (actionId === 'entity_details') {
      sequence = 200;
    } else if (actionId === 'shareholding_pattern') {
      sequence = 700;
    } else if (actionId === 'financial_documents') {
      sequence = 500;
    } else if (actionId === 'additional_documents') {
      sequence = 600;
    }
    const { companyId, productId } = history.location.state || {};
    const payload = {
      companyId,
      productId,
      user: user,
      type: 'remarks',
      remarks: type == 'sectionApprove' ? 'Approved' : data.comment,
      loan_app_id: params.id,
      category: mapSubSection[actionId],
      status: type == 'sectionApprove' ? 'approved' : 'deviation',
      sequence: sequence,
    };
    new Promise((resolve, reject) => {
      dispatch(commentDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        fetchActivityLogs();
        fetchLeadDetails();
        setOpenDialog(false);
        showAlert(response?.message, 'success');
        setData('');
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity('');
    setAlertMessage('');
  };

  const handleAddComment = (title, id, remarks) => {
    setTitle(title);
    setActionId(id);
    setActionType('remarks');
    setType('addComment');
    setOpenDialog(true);
    setData({
      comment: remarks,
    });
  };
  const resetAll = (title, id) => {
    setTitle(title);
    setActionId(id);
    setActionType('');
    setType('');
    setOpenDialog(false);
  };
 const handleCommentField = (flag) =>{
  let tempField = commentFields;
  tempField[`comment`][`isRequired`] = flag;
  return tempField;
 }

  const handleApprove = (title, id) => {
    setTitle(title);
    setActionId(id);
    setTitle(typeFields['approve']);
    setType('approve');
    setOpenDialog(true);
    setCommentFields(handleCommentField(false));
  };

  const handleSectionApprove = (title, id) => {
    setActionId(id);
    setTitle(typeFields['sectionApprove']);
    setType('sectionApprove');
    handlePopupSubmit(id, typeFields['sectionApprove'], 'sectionApprove');
  };

  const handleReject = () => {
    setTitle(typeFields['reject']);
    setType('reject');
    setOpenDialog(true);
    setCommentFields(handleCommentField(true));
  };

  const handleRequestUpdate = () => {
    const { companyId, productId } = history.location.state || {};

    setTitle(typeFields['requestUpdate']);
    setType('requestUpdate');
    setOpenDialog(true);
    setCommentFields(handleCommentField(true));
  };

  const formatAccordHeader = (label) => <span style={styles['accordionHeader']}>{label.toUpperCase()}</span>;
  const formatAccordBody = (value) => <span style={styles['accordionBody']}>{typeof value === 'string' && value.trim() ? value : 'N/A'}</span>;

  const formatStatus = (value) => <StatusIcon status={value.toLowerCase()} />;

  const formatValidationChecklistStatus = (value, remarks) => (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '105px' }}>
        <StatusIcon status={value.toLowerCase()} />
        {value == 'in_review' || value == 'rejected' ? <Tooltip content={remarks ? remarks : ''} /> : <div style={{ width: '21px', height: '18px', backgroundColor: 'transparent' }} />}
      </div>
    </React.Fragment>
  );

  const bottomComponent = (title, id, remarks) => {
    let isRiskTag = false;
    let isRiskResponsible = false;
    if (checkAccessTags(['tag_offer_deviation_risk'])) {
      isRiskTag = true;
    }
    if (offer?.responsibility && offer?.responsibility.toLowerCase() === 'risk') {
      isRiskResponsible = true;
    }    
    return checkAccessTags(['tag_msme_lead_view_int_lead_details_btn_others']) ? (
      (isRiskResponsible && isRiskTag) || (!isRiskResponsible && !isRiskTag) ? (
        <div style={styles['leadReviewBottomComponent']}>
          <Button buttonType="custom" label={remarks ? 'Update Comment' : 'Add Comment'} onClick={() => handleAddComment(title, id, remarks)} isDisabled={false} customStyle={styles['customStyleButtonComment']} />
          <Button
            buttonType="custom"
            label="Approve"
            onClick={() => {
              handleSectionApprove(title, id);
            }}
            isDisabled={false}
            customStyle={styles['customStyleButton']}
          />
        </div>
      ) : null
    ) : null;
  };

  const getLeadOffer = () => {
    const { companyId, productId } = history.location.state || {};
    const payload = {
      loan_app_id: loanAppId,
      companyId: companyId,
      productId: productId,
      user: user,
    };
    new Promise((resolve, reject) => {
      dispatch(getLeadOfferWcher(payload, resolve, reject));
    })
      .then((response) => {
        console.log(response.data, 'offer responbse >>>');
        setOffer(response.data);
      })
      .catch((error) => {
        // showAlert(error?.response?.data?.message, 'error');
      });
  };

  useEffect(() => {
    getLeadOffer();
  }, []);

  const formattedData = (leadArray) => {
    let leadReviewData = leadArray;
    let tempReviewData = deepCopy(leadReviewData);
    const statusCheck = {};
    const bottomComponents = {};
    let tempRemarks = {};
    let tempValidationRemarks = {};

    for (let lead in tempReviewData) {
      let accordionStatus = tempReviewData[lead].status;

      if (tempReviewData[lead].status) {
        statusCheck[lead] = formatStatus(tempReviewData[lead].status);
        delete tempReviewData[lead].status;
      }

      if (tempReviewData[lead].validation_checklist_remarks) {
        tempValidationRemarks = {
          ...tempValidationRemarks,
          ...tempReviewData[lead].validation_checklist_remarks,
        };
        delete tempReviewData[lead].validation_checklist_remarks;
      }

      if (Object.keys(tempReviewData[lead]).length && lead != 'co-applicant_details' && lead != 'guarantor_details' && leadStatus === LeadStatus.lead_deviation.value && accordionStatus === 'in_review') {
        bottomComponents[lead] = bottomComponent(toCamel(lead, true), lead, tempReviewData[lead].remarks);
      }

      if (tempReviewData[lead]) {
        tempRemarks[lead] = tempReviewData[lead].remarks;
        delete tempReviewData[lead].remarks;
      }
    }

    var coapplicant_details = tempReviewData['co-applicant_details'] ? Object.keys(tempReviewData['co-applicant_details']) : [];
    var guarantor_details = tempReviewData['guarantor_details'] ? Object.keys(tempReviewData['guarantor_details']) : [];

    for (let coapplicant of coapplicant_details) {
      let accordionStatus = tempReviewData['co-applicant_details'][coapplicant].status;
      if (tempReviewData['co-applicant_details'][coapplicant].status) {
        statusCheck[coapplicant] = formatStatus(tempReviewData['co-applicant_details'][coapplicant].status);
        delete tempReviewData['co-applicant_details'][coapplicant].status;
      }

      if (tempReviewData['co-applicant_details'][coapplicant].validation_checklist_remarks) {
        tempValidationRemarks = {
          ...tempValidationRemarks,
          ...tempReviewData['co-applicant_details'][coapplicant].validation_checklist_remarks,
        };
        delete tempReviewData['co-applicant_details'][coapplicant].validation_checklist_remarks;
      }

      if (Object.keys(tempReviewData['co-applicant_details'][coapplicant]).length && leadStatus === LeadStatus.lead_deviation.value && accordionStatus === 'in_review') {
        bottomComponents[coapplicant] = bottomComponent(toCamel(coapplicant, true), coapplicant, tempReviewData['co-applicant_details'][coapplicant].remarks);
      }

      if (tempReviewData['co-applicant_details'][coapplicant]) {
        tempRemarks[coapplicant] = tempReviewData['co-applicant_details'][coapplicant].remarks;
        delete tempReviewData['co-applicant_details'][coapplicant].remarks;
      }
    }

    for (let guarantor of guarantor_details) {
      let accordionStatus = tempReviewData['guarantor_details'][guarantor].status;
      if (tempReviewData['guarantor_details'][guarantor].status) {
        statusCheck[guarantor] = formatStatus(tempReviewData['guarantor_details'][guarantor].status);
        delete tempReviewData['guarantor_details'][guarantor].status;
      }

      if (tempReviewData['guarantor_details'][guarantor].validation_checklist_remarks) {
        tempValidationRemarks = {
          ...tempValidationRemarks,
          ...tempReviewData['guarantor_details'][guarantor].validation_checklist_remarks,
        };
        delete tempReviewData['guarantor_details'][guarantor].validation_checklist_remarks;
      }

      if (Object.keys(tempReviewData['guarantor_details'][guarantor]).length && leadStatus === LeadStatus.lead_deviation.value && accordionStatus === 'in_review') {
        bottomComponents[guarantor] = bottomComponent(toCamel(guarantor, true), guarantor, tempReviewData['guarantor_details'][guarantor].remarks);
      }

      if (tempReviewData['guarantor_details'][guarantor]) {
        tempRemarks[guarantor] = tempReviewData['guarantor_details'][guarantor].remarks;
        delete tempReviewData['guarantor_details'][guarantor].remarks;
      }
    }
    setSectionRemarks(tempRemarks);
    setValidationRemarks(tempValidationRemarks);

    let data = convertDataIntoAccordionData(
      tempReviewData,
      formatAccordHeader,
      formatAccordBody,
      ['validation_checklist'],
      {
        validation_checklist: (value, key) => {
          return formatValidationChecklistStatus(value, tempValidationRemarks[key]);
        },
      },
      statusCheck,
      bottomComponents,
      [...coapplicant_details, ...guarantor_details],
    );

    let allApproved = data.every((item) => item.rightComponent.props.status.toUpperCase() === 'APPROVED');
    setDisableApproveBtn(!allApproved);

    setAccordionData(data);
  };

  const handleNavigate = (navState) => {
    history.replace(`/admin/msme/leads/${params.id}?tab=${navState}`);
  };

  const leadStatusMappings = {
    approve: 'offer_in_progress',
    reject: 'rejected',
    requestUpdate: 'pending',
  };

  return (
    <div style={{ padding: '0px 24px 24px 24px', backgroundColor: '#fafafa' }}>
      <div
        style={{
          display: leadDetailSection === 'lead details' ? 'flex' : null,
          flexDirection: leadDetailSection === 'lead details' ? 'row' : null,
        }}
      >
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ margin: '24px 0px 24px 0px' }}>
              {tabsAvailable.map((navMenu, index) => {
                return <TabButton label={navMenu} isDisabled={false} key={index} onClick={() => handleNavigate(navMenu)} selected={navMenu.toLowerCase() === leadDetailSection.toLowerCase()} setSelectedOption={setLeadDetailSection} />;
              })}
            </div>
            {(leadDetailSection === 'lead details' || leadDetailSection === 'documents') && leadStatus === LeadStatus?.lead_deviation.value ? (
              <div style={styles.leadReviewEditViewContainer} onClick={() => setIsEdit(!isEdit)}>
                {isEdit ? 'View' : 'Edit'}
              </div>
            ) : (
              <div />
            )}
          </div>
          {leadDetailSection === 'lead details' && (
            <React.Fragment>
              <div className="lead-review-detail-container">
                {leadStatus === LeadStatus?.offer_in_progress.value ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <img src={Animation} alt="Animation" style={{ height: '200px', width: '200px' }} />
                    </div>
                    {/* <div className="text-style" style={{ fontFamily: 'Montserrat-Semibold' }}>
                      Creating your personalised offer/loan. Please hold on for a moment. Thank you for your patience!
                    </div> */}
                  </div>
                ) : null}

                {leadStatus === LeadStatus.rejected.value ? (
                  <div>
                    <div className="alert-container" style={{ backgroundColor: '#FFECEC', border: '2px solid #C00', borderRadius: '8px' }}>
                      <img style={{ margin: '17px 0px 0px 16px' }} alt="icon" src={CrossCircle} className="menuIcon" />
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div className="alert-container-title" style={{ fontFamily: 'Montserrat-SemiBold', color: '#C00' }}>
                            Offer rejected
                          </div>
                          <div className="alert-container-msg" style={{ fontFamily: 'Montserrat-Medium' }}>
                            We are sorry to inform that your application is rejected. Please try again later.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {(leadStatus == LeadStatus.offer_generated.value || leadStatus == LeadStatus.offer_deviation.value || leadStatus == LeadStatus.follow_up_doc.value || leadStatus == LeadStatus.follow_up_kyc.value) && <OfferGenerate customStyle={{ margin: '0px' }} loanAppId={params.id} MSMECompanyId={history.location.state?.companyId} MSMEProductId={history.location.state?.productId} showAlert={showAlert} leadStatus={leadStatus} fetchLeadDetails={fetchLeadDetails} />}
                {!isEdit ? (
                  <div>
                    <CustomAccordion accordionData={accordionData} customRightComponentContainer={{ marginTop: '20px' }} />
                  </div>
                ) : (
                  <div>
                    <LeadReviewForm companyId={companyId} productId={productId} loanAppId={loanAppId} leadData={leadData} fetchActivityLogs={fetchActivityLogs} />
                  </div>
                )}
              </div>
               <div className="lead-review-button-container">
                <div />
                {checkAccessTags(['tag_msme_lead_view_int_lead_details_btn_others']) && !isEdit ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {leadStatus === LeadStatus.lead_deviation.value && (
                      <Button
                        buttonType="custom"
                        customStyle={{
                          ...styles['button'],
                          backgroundColor: '#FFFFFF',
                          color: '#475BD8',
                          border: '1px solid #475BD8',
                        }}
                        customLoaderClass={styles['buttonLoader']}
                        isLoading={isLoading}
                        isDisabled={false}
                        label={'Request an Update'}
                        onClick={() => {
                          handleRequestUpdate();
                        }}
                      />
                    )}

                    {leadStatus !== LeadStatus.new.value && leadStatus !== LeadStatus.rejected.value && leadStatus !== LeadStatus.approved.value && (
                      <Button
                        buttonType="custom"
                        customStyle={{
                          ...styles['button'],
                          backgroundColor: '#FFFFFF',
                          color: '#CC0000',
                          border: '1px solid #CC0000',
                        }}
                        customLoaderClass={styles['buttonLoader']}
                        isLoading={isLoading}
                        isDisabled={false}
                        label={'Reject'}
                        onClick={() => {
                          handleReject();
                        }}
                      />
                    )}

                    {leadStatus === LeadStatus.lead_deviation.value && (
                      <Button
                        buttonType="custom"
                        customStyle={
                          disableApproveBtn
                            ? {
                                ...styles['button'],
                                backgroundColor: 'var(--neutrals-neutral-30, #CCCDD3)',
                                color: 'var(--base-white, #FFF)',
                              }
                            : {
                                ...styles['button'],
                                backgroundColor: '#FFFFFF',
                                color: '#008042',
                                border: '1px solid #008042',
                              }
                        }
                        customLoaderClass={styles['buttonLoader']}
                        isLoading={isLoading}
                        isDisabled={disableApproveBtn}
                        label={'Approve'}
                        onClick={() => {
                          handleApprove();
                        }}
                      />
                    )}
                  </div>
                ) : null}
              </div>
            </React.Fragment>
          )}

          {leadDetailSection === 'documents' && (
            <>
              <DocumentsList loanDocuments={loanDocuments} companyId={companyId} productId={productId} loanAppId={loanAppId} fetchLoanDocuments={getLoanDocuments} isEdit={isEdit} />
            </>
          )}
          {leadDetailSection === 'loan details' && <CreateLoan />}
          {leadDetailSection === 'sl & lba' && <SanctionLenderLead />}
          {leadDetailSection === 'nach' && <Natch />}

          {leadDetailSection === 'cams' && <CamsSection leadStatus={leadStatus} companyId={companyId} productId={productId} loanAppId={loanAppId} />}
        </div>
        {leadDetailSection === 'lead details' ? <AuditLog data={auditLogs} /> : null}
      </div>
      <ActionPopup
        heading={title}
        fields={commentFields}
        data={data}
        setData={setData}
        dataErrors={dataErrors}
        setDataErrors={setDataErrors}
        isModalOpen={openDialog}
        button={{
          primary: {
            label: type === 'reject' ? 'Reject' : type == 'approve' ? 'Approve' : 'Submit',
            style: {
              background: type == 'reject' ? '#CC0000' : 'linear-gradient(180deg, #134CDE 0%, #163FB7 100%, #163FB7 100%)',
            },
            action: (props) => {
              if (type == 'sectionApprove') {
                return;
              }

              if (type == 'addComment') {
                handlePopupSubmit(actionId, title, type);
                resetAll(true);
              } else {
                handleLeadStatus(leadStatusMappings[type]);
              }
            },
          },
          secondary: {
            label: 'Cancel',
            style: styles['negativeButton'],
            action: (props) => {
              setOpenDialog(false);
              console.log('negative action');
              setData('');
            },
          },
        }}
        buttonText={'Comment'}
        onClickOutsideModal={() => {
          setOpenDialog(false);
        }}
        callback={(isModalOpen) => {
          if (!isModalOpen) {
            setData('');
            setOpenDialog(false);
          }
        }}
      />
      {alert ? <AlertBox severity={severity} msg={alertMessage} onClose={handleAlertClose} /> : null}
      {isLoading && <Preloader />}
    </div>
  );
}

const useStyles = ({ innerWidth, innerHeight }) => {
  return {
    accordionHeader: {
      fontFamily: 'Montserrat-Regular',
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '17px',
      letterSpacing: '0em',
      textAlign: 'left',
      color: '#6B6F80',
    },
    accordionBody: {
      fontFamily: 'Montserrat-Medium',
      fontSize: '16px',
      lineHeight: '17px',
      letterSpacing: '0em',
      textAlign: 'left',
      color: '#151515',
    },
    leadReviewBottomComponent: {
      paddingBottom: '20px',
      display: 'flex',
      justifyContent: 'flex-end',
      marginRight: '20px',
    },
    customStyleButton: {
      backgroundColor: '#008042',
      color: 'white',
      height: '40px',
      width: '120px',
      fontSize: '13px',
      padding: '12px 24px',
      borderRadius: '40px',
      gap: '10px',
    },
    negativeButton: {
      background: '#FFFFFF',
      color: '#475BD8',
      border: '1px solid #475BD8',
    },
    button: {
      height: '40px',
      width: '200px',
      borderRadius: '20px',
      marginLeft: '16px',
      fontSize: '14px',
      padding: 0,
      textAlign: 'center',
      alignItems: 'center',
      backgroundColor: '#475BD8',
      color: '#FFF',
      fontFamily: 'Montserrat-Regular',
    },
    buttonLoader: {
      border: '3px solid white',
      borderTop: '3px solid transparent',
      marginLeft: '40%',
    },
    leadReviewBottomComponent: {
      paddingBottom: '20px',
      display: 'flex',
      justifyContent: 'flex-end',
      marginRight: '20px',
    },
    customStyleButton: {
      backgroundColor: '#008042',
      color: 'white',
      fontFamily: 'Montserrat-Regular',
      fontWeight: 600,
      height: '40px',
      width: 'max-content',
      fontSize: '14px',
      lineHeight: '21px',
      padding: '8px 24px',
      borderRadius: '40px',
      gap: '10px',
    },
    customStyleButtonComment: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 600,
      backgroundColor: '#FFF',
      borderColor: '#134CDE',
      color: '#134CDE',
      height: '40px',
      width: 'max-content',
      fontSize: '14px',
      lineHeight: '21px',
      padding: '8px 24px',
      borderRadius: '40px',
      gap: '10px',
    },
    leadReviewEditViewContainer: {
      width: '66px',
      alignSelf: 'center',
      fontSize: '14px',
      fontFamily: 'Montserrat-Medium',
      color: '#134CDE',
      cursor: 'pointer',
    },
    button: {
      height: '48px',
      width: 'max-content',
      borderRadius: '40px',
      gap: '10px',
      fontSize: '16px',
      lineHeight: '24px',
      padding: '12px 24px',
      textAlign: 'center',
      alignItems: 'center',
      backgroundColor: '#475BD8',
      color: '#FFF',
      fontFamily: 'Montserrat-Regular',
    },
    buttonLoader: {
      border: '3px solid white',
      borderTop: '3px solid transparent',
      marginLeft: '40%',
    },
  };
};

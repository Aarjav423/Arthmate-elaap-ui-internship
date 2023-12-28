import React, { useState, useEffect } from 'react';
import UploadFileInput from '../../components/uploadFileInput/UploadFileInput';
import Button from 'react-sdk/dist/components/Button';
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import { AlertBox } from '../../../components/CustomAlertbox';
import { storedList } from '../../../util/localstorage';
import { useDispatch, useSelector } from 'react-redux';
import { patchMsmeDetailsWatcher, putMsmeDraftSaverWatcher, patchMsmeDocDeleteWatcher, subSectionDeleteWatcher } from '../../actions/msme.action';
import { ITRInputTittle, GSTInputArray, FSInputTittle, BankList, BankType } from './data';
import './FinancialDocument.css';
import '../bookLoans/bookLoans.style.css';
import { getBookLoanDetailsWatcher, getMsmeLoanDocumentsWatcher } from 'msme/actions/bookLoan.action';
import { SectionData } from 'msme/config/sectionData';
import getSectionStatus from '../bookLoans/GetLeadSectionStatus/GetLeadSectionStatus';
import { documentCode } from 'msme/config/docCode';
import { getLeadStatusWatcher } from '../../actions/lead.action';
import { LeadNewStatus } from '../../config/LeadStatus';
import Preloader from '../../../components/custom/preLoader';
import getSubSectionRemarks from "../bookLoans/GetLeadSectionStatus/GetLeadSubSectionRemarks"

const UploadComponent = (props) => {
  const initialCheckboxes = {
    check1: false,
    check2: false,
    check3: false,
    check4: false,
  };

  const documentCodes = {
    ITR: [documentCode.itr1, documentCode.itr2],
    GSTR: [documentCode.gstr],
    FS: [documentCode.financial_statement1, documentCode.financial_statement2, documentCode.financial_statement3],
    BS: [documentCode.msme_bank_statement],
  };

  const sectionStatus = ['deviation', 'approved', 'rejected'];

  const handleCheckboxChange = (id) => {
    setCheckboxes({
      ...checkboxes,
      [id]: !checkboxes[id],
    });
    if (checkboxes[id] && documentList.length) {
      setDisabled(true);
      handleCheckboxDeselect(id);
    }
    if (id === 'check2' && checkboxes[id] === true) {
      handleGstrSectionDelete();
    }
  };

  const handleGstrSectionDelete = (id) => {
    const payload = {
      loan_app_id: loanAppId,
      section_code: 500,
      sub_section_code: 'financial_doc_gst',
      tokenData: {
        user_id: user?._id,
        product_id: MSMEProductId,
        company_id: MSMECompanyId,
      },
    };
    new Promise((resolve, reject) => {
      dispatch(subSectionDeleteWatcher(payload, resolve, reject));
    })
      .then((response) => {})
      .catch((error) => {});
  };

  const handleCheckboxDeselect = (id) => {
    const index = Object.keys(initialCheckboxes).indexOf(id);
    const keys = Object.keys(documentCodes);
    const key = keys[index];

    const correspondingArray = documentCodes[key];
    const payload = {
      loanAppId: loanAppId,
      tokenData: {
        user: user,
        user_id: user?._id,
        product_id: MSMEProductId,
        company_id: MSMECompanyId,
      },
      code: correspondingArray,
    };
    new Promise((resolve, reject) => {
      if (id === 'check4' && checkboxes[id] === true) {
        handleFinanceDocumentDraft(true);
      }
      dispatch(patchMsmeDocDeleteWatcher(payload, resolve, reject));
    })
      .then((response) => {
        getLoanDocuments();
      })
      .catch((error) => {});
  };

  const [checkboxes, setCheckboxes] = useState(initialCheckboxes);

  const [disable, setDisabled] = useState(true);

  const { setNavIconPrefixState, setNavState, loanAppId, MSMECompanyId, MSMEProductId, navIconPrefixState, documents } = props;
  const user = { _id: storedList('user')?._id, id: storedList('user')?.id };
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.profile.loading);
  const [loader, setLoader] = useState(false);
  const [ITRstate, setITRstate] = useState({});
  const [GSTstate, setGSTstate] = useState({});
  const [FSIstate, setFSIstate] = useState({});
  const [BankDetailstate, setBankDetailstate] = useState({});
  const [BankStatementstate, setBankStatementstate] = useState({});
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('');
  let intervalId, fileInterval;
  const [GSTIn, setGSTIn] = useState('');
  const sectionName = 'financial-documents';
  const [disableFields, setDisableFields] = useState(false);
  const [disableDraftButton, setDisableDraftButton] = useState(false);
  const [sectionStatusCheck, setSectionStatusCheck] = useState('');
  const [allDocuments, setAllDocuments] = useState(documents);
  const [statusObject, setStatusObject] = useState('');
  const [entityDetails, setEntityDetails] = useState(false);
  const [leadStatus, setLeadStatus] = useState('');
  const [documentList, setDocumentList] = useState([]);
  const [isLeadRejected, setIsLeadRejected] = useState(false);
  const [bankInputItems, setBankInputItems] = useState([
    {
      id: 'bs1',
      name: '6 Month Bank Statement',
      fileSize: 'PDF upto 10MB',
      acceptFileType: '.pdf',
      fileType: 'file',
      documentCode: documentCode.msme_bank_statement,
      docIndex: 0,
    },
  ]);

  const [gstinItems, setGstinItem] = useState([
    {
      id: 'gst1',
      name: 'GST Certificate',
      fileSize: 'JPG, JPEG, PNG, PDF upto 5MB',
      acceptFileType: '.jpg, .jpeg, .png, .pdf',
      fileType: 'file',
      documentCode: documentCode.gst_certificate,
    },
  ]);

  const [gstrItems, setGstrItems] = useState([
    {
      id: 'gst2',
      name: 'GSTR',
      fileSize: 'PDF upto 10MB',
      acceptFileType: '.pdf',
      fileType: 'file',
      documentCode: documentCode.gstr,
    },
  ]);
  const [bankStatementCount, setBankStatementCount] = useState(0);
  const [gstinDisable, setGSTinDisable] = useState(false);
  const [gstButtonState, setGstButtonState] = useState('button');
  const [gstBorder, setGstBorder] = useState('border: 1px solid #BBBFCC');
  useEffect(() => {
    if (loanAppId && MSMECompanyId && MSMEProductId) {
      getLoanDocuments();
      fetchLeadStatus();
      fetchLoanDetails();
    }
  }, []);

  useEffect(() => {
    if (loanAppId && MSMECompanyId && MSMEProductId) {
      getLoanDocuments();
    }
  }, [entityDetails]);

  useEffect(() => {
    if (leadStatus && statusObject) {
      if (leadStatus === LeadNewStatus.Pending && statusObject.section_status === LeadNewStatus.InProgress) {
        setDisabled(false);
      }
    }
  }, [leadStatus, statusObject]);

  const fetchLeadStatus = () => {
    const payload = {
      loan_app_id: loanAppId,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      user: user,
      user_id: user?._id,
    };
    new Promise((resolve, reject) => {
      dispatch(getLeadStatusWatcher(payload, resolve, reject));
    })
      .then((response) => {
        let financialSection = response?.find((item) => item?.section_code === 'financial_doc');
        setStatusObject(response?.find((item) => item?.section_code === 'financial_doc'));
        if (financialSection?.section_status === 'approved') {
          setDisableDraftButton(true);
        } else if (financialSection?.section_status === 'rejected') {
          setIsLeadRejected(true);
        }
        if (financialSection?.subsections) {
          let gstinDocCheck = financialSection?.subsections.find((item) => item?.sub_section_code === 'financial_doc_gst');
          if (['approved', 'deviation'].includes(gstinDocCheck?.sub_section_status)) {
            setGSTinDisable(true);
            setGstBorder('1px solid green');
            setGstButtonState('icon');
          }
        }
        if (response?.find((item) => item?.section_code === 'entity')) {
          let entity = response?.find((item) => item?.section_code === 'entity');
          let subsection = entity?.subsections?.find((item) => item?.sub_section_code === 'entity_gst');
          let gstCheck = subsection?.validation_checklist?.find((item) => item?.validation_code === 'GST_CHECK');
          if (gstCheck) {
            setEntityDetails(true);
          }
        }
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  const [financialDocuments, setFinancialDocuments] = useState(
    ITRInputTittle.map((givenObj) => {
      const matchingObj = documents?.find((otherObj) => otherObj.code === givenObj.documentCode);
      if (matchingObj) {
        return {
          ...givenObj,
          s3_url: matchingObj.file_url,
          doc: matchingObj,
        };
      }
      return givenObj;
    }),
  );

  const [gstrDocuments, setGstrDocuments] = useState(
    gstinItems.map((givenObj) => {
      const matchingObj = documents?.find((otherObj) => otherObj.code === (givenObj?.documentCode ? givenObj?.documentCode : ''));
      if (matchingObj) {
        return {
          ...givenObj,
          s3_url: matchingObj.file_url,
          doc: matchingObj,
        };
      }
      return givenObj;
    }),
  );

  const [gstr, setGstr] = useState(
    gstrItems.map((givenObj) => {
      const matchingObj = documents?.find((otherObj) => otherObj.code === (givenObj?.documentCode ? givenObj?.documentCode : ''));
      if (matchingObj) {
        return {
          ...givenObj,
          s3_url: matchingObj.file_url,
          doc: matchingObj,
        };
      }
      return givenObj;
    }),
  );

  const [fsDocuments, setFsDocuments] = useState(
    FSInputTittle.map((givenObj) => {
      const matchingObj = documents?.find((otherObj) => otherObj.code === (givenObj?.documentCode ? givenObj?.documentCode : ''));
      if (matchingObj) {
        return {
          ...givenObj,
          s3_url: matchingObj.file_url,
          doc: matchingObj,
        };
      }
      return givenObj;
    }),
  );

  const [bankDocuments, setBankDocuments] = useState(
    bankInputItems.map((givenObj) => {
      const matchingObj = documents?.find((otherObj) => otherObj.code === (givenObj?.documentCode ? givenObj?.documentCode : ''));
      if (matchingObj) {
        return {
          ...givenObj,
          s3_url: matchingObj.file_url,
          doc: matchingObj,
        };
      }
      return givenObj;
    }),
  );

  const checkBoxList = [
    { id: 'check1', value: 'ITR', label: 'ITR' },
    { id: 'check2', value: 'GSTR', label: 'GSTR' },
    {
      id: 'check3',
      value: 'Financial Statement',
      label: 'Financial Statement',
    },
    { id: 'check4', value: 'Bank Statement', label: 'Bank Statement' },
  ];

  const customSaveButton = {
    fontSize: '16px',
    color: '#134CDE',
    border: '1px solid #134CDE',
    width: '10rem',
    padding: '10px 24px',
    borderRadius: '40px',
  };

  const customSubmitButton = {
    display: 'inline - flex',
    height: '48px',
    width: '11rem',
    padding: '8px 24px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    color: '#FFF',
    fontFamily: 'Montserrat-Regular',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '150%',
    flexShrink: '0',
    borderRadius: '40px',
    background: disable ? '#CCCDD3' : 'linear-gradient(180deg, #134CDE 0%, #163FB7 100%)',
  };

  useEffect(() => {
    if (loanAppId) {
      fetchLoanDetails();
    }
  }, [loanAppId]);

  useEffect(() => {
    if (navIconPrefixState['Financial Docs'] === 'success') {
      setDisableFields(true);
    }
  }, []);

  const handleDropdownBankNameChange = (event, data) => {
    setBankDetailstate((prevData) => ({
      ...prevData,
      borro_bank_name: event?.label ?? null,
      borro_bank_code: event?.value ?? null,
    }));
  };
  const handleDropdownAccTypeChange = (event, data) => {
    setBankDetailstate((prevData) => ({
      ...prevData,
      borro_bank_type: event?.label ?? null,
    }));
  };

  const handleAccNoChange = (event) => {
    setBankDetailstate((prevData) => ({
      ...prevData,
      borro_bank_acc_num: event.value ?? null,
    }));
  };
  const handlePasswordChange = (event) => {
    setBankDetailstate((prevData) => ({
      ...prevData,
      doc_key: event.value ?? null,
    }));
  };
  const showAlert = (msg, type) => {
    const element = document.getElementById('TopNavBar');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const getLoanDocuments = (count = 0) => {
    setLoader(true);
    const payload = {
      loanAppID: loanAppId,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      user: user,
      user_id: user?._id,
    };
    new Promise((resolve, reject) => {
      dispatch(getMsmeLoanDocumentsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        if (response && Array.isArray(response)) {
          const codes = Object.keys(documentCodes)
            .map((key) => documentCodes[key])
            .flat();
          const total_docs = response.filter((doc) => codes.includes(doc.code));
          setDocumentList((prevState) => total_docs);
          if (response.some((item) => documentCodes.ITR.includes(item.code))) {
            checkboxes['check1'] = true;
          }
          if (response.some((item) => documentCodes.FS.includes(item.code))) {
            checkboxes['check3'] = true;
          }
          if (response.some((item) => documentCodes.GSTR.includes(item.code))) {
            checkboxes['check2'] = true;
          }
          if (response.some((item) => documentCodes.BS.includes(item.code))) {
            checkboxes['check4'] = true;
            const financialDocDetails = response.filter((item) => item.code === documentCode.msme_bank_statement);
            setBankDetailstate((prevData) => ({
              ...prevData,
              doc_key: financialDocDetails.length ? financialDocDetails[0].doc_key : '',
            }));
          }
          if (response) {
            setFinancialDocuments(
              ITRInputTittle.map((givenObj) => {
                const matchingObj = response?.find((otherObj) => otherObj.code === givenObj.documentCode);
                if (matchingObj) {
                  return {
                    ...givenObj,
                    s3_url: matchingObj.file_url,
                    doc: matchingObj,
                  };
                }
                return givenObj;
              }),
            );
            setGstrDocuments(
              gstinItems.map((givenObj) => {
                const matchingObj = response?.find((otherObj) => otherObj.code === givenObj.documentCode);
                if (matchingObj) {
                  return {
                    ...givenObj,
                    s3_url: matchingObj.file_url,
                    doc: matchingObj,
                  };
                }
                return givenObj;
              }),
            );
            setGstr(
              gstrItems.map((givenObj) => {
                const matchingObj = response?.find((otherObj) => otherObj.code === givenObj.documentCode);
                if (matchingObj) {
                  return {
                    ...givenObj,
                    s3_url: matchingObj.file_url,
                    doc: matchingObj,
                  };
                }
                return givenObj;
              }),
            );
            setFsDocuments(
              FSInputTittle.map((givenObj) => {
                const matchingObj = response?.find((otherObj) => otherObj.code === givenObj.documentCode);
                if (matchingObj) {
                  return {
                    ...givenObj,
                    s3_url: matchingObj.file_url,
                    doc: matchingObj,
                  };
                }
                return givenObj;
              }),
            );
            if (response?.some((otherObj) => otherObj.code === documentCode.msme_bank_statement)) {
              const matchingObj = response?.find((otherObj) => otherObj.code === documentCode.msme_bank_statement);
              const bankInputItemsUpdate = [];
              const bankDocumentsUpdate = [];
              matchingObj?.additional_file_url?.map((item) => {
                if (item) {
                  if (bankDocumentsUpdate.length) {
                    bankInputItemsUpdate.push({
                      id: `bs${bankInputItemsUpdate.length + 1}`,
                      name: `${bankInputItemsUpdate.length ? 'Add Statement' : '6 Month Bank Statement'}`,
                      fileSize: 'PDF upto 10MB',
                      acceptFileType: '.pdf',
                      fileType: 'file',
                      documentCode: documentCode.msme_bank_statement,
                      docIndex: bankDocumentsUpdate.length,
                    });
                  }
                  bankDocumentsUpdate.push({
                    id: `bs${bankInputItemsUpdate.length + 1}`,
                    name: `${bankInputItemsUpdate.length ? 'Add Statement' : '6 Month Bank Statement'}`,
                    fileSize: 'PDF upto 10MB',
                    acceptFileType: '.pdf',
                    fileType: 'file',
                    documentCode: documentCode.msme_bank_statement,
                    docIndex: bankInputItemsUpdate.length,
                    s3_url: item,
                    doc: matchingObj,
                  });
                }
              });
              setBankDocuments(bankDocumentsUpdate);
              setBankInputItems([...bankInputItems, ...bankInputItemsUpdate]);
              setBankStatementCount(matchingObj?.additional_file_url?.length);
              if (matchingObj?.additional_file_url?.length === count) {
                clearInterval(fileInterval);
              }
            } else {
              setBankDocuments(
                bankInputItems.map((givenObj) => {
                  return givenObj;
                }),
              );
            }
          }
          setDisabled((prevState) => (total_docs.length ? false : true));
          setLoader(false);
        }
      })
      .catch((error) => {
        showAlert(error.response?.data?.message, 'error');
        setLoader(false);
        if (fileInterval) clearInterval(fileInterval);
      });
  };
  const handleFinanceDocumentDraft = (flag) => {
    setDisableDraftButton(true);
    let postData = {
      section: 'financial-documents',
      borro_bank_code: '',
      borro_bank_name: '',
      borro_bank_branch: '',
      borro_bank_acc_num: '',
      borro_bank_ifsc: '',
      borro_bank_type: '',
      doc_key: '',
      doc_code: documentCode.msme_bank_statement,
    };
    if (!flag) {
      postData.borro_bank_name = BankDetailstate.borro_bank_name ?? '';
      postData.borro_bank_acc_num = BankDetailstate.borro_bank_acc_num ?? '';
      postData.borro_bank_type = BankDetailstate.borro_bank_type ?? '';
      postData.doc_key = BankDetailstate.doc_key ?? '';
      postData.borro_bank_code = BankDetailstate.borro_bank_code ?? '';
      postData.fina_docs_gstin = BankDetailstate.fina_docs_gstin ?? GSTIn ?? '';
    }
    const payload = {
      loan_app_id: loanAppId,
      tokenData: {
        user: user,
        user_id: user?._id,
        product_id: MSMEProductId,
        company_id: MSMECompanyId,
        loan_app_id: loanAppId,
      },
      bodyData: postData,
    };
    new Promise((resolve, reject) => {
      dispatch(putMsmeDraftSaverWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setDisableDraftButton(false);
        if (!flag) showAlert('Draft saved successfully', 'success');
        fetchLoanDetails();
        getLoanDocuments();
      })
      .catch((error) => {
        showAlert(error?.message ?? 'Error while saving draft', 'error');
      });
  };

  const bankStatementStyle = {
    marginTop: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    columnGap: '42px',
  };

  const bankInputBoxStyle = {
    height: '58px',
    maxWidth: '45vw',
    width: '319px',
    marginBottom: '30px',
  };

  const headingStyle = {
    marginTop: '20px',
    position: 'relative',
    top: '10px',
    fontWeight: '600',
    color: '#32325d',

    marginBottom: '14px',
  };

  const uploadTittleStyle = {
    position: 'relative',
    top: '10px',
    fontWeight: '600',
    color: '#32325d',

    marginBottom: '14px',
  };

  const stateMentButton = {
    border: 'none',
    outLine: 'none',
    background: 'transparent',
    color: '#134CDE',
    padding: '10px 16px 10px 5px',
    marginTop: '20px',
    fontFamily: 'Montserrat',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    letterSpacing: '0px',
    textAlign: 'left',
  };

  const h6passwordStyle = {
    marginTop: '60px',
  };

  const handleSubmit = (event) => {
    if (isLeadRejected) {
      return showAlert(`Your lead has been rejected`, 'error');
    }

    let matchingObj = {};
    const postData = {
      section: 'financial-documents',
      fina_docs_gstin: '',
      borro_bank_code: '',
      borro_bank_name: '',
      borro_bank_branch: '',
      borro_bank_acc_num: '',
      borro_bank_ifsc: '',
      borro_bank_type: '',
      doc_key: '',
      doc_code: documentCode.msme_bank_statement,
    };
    if (BankDetailstate) {
      postData.borro_bank_name = BankDetailstate.borro_bank_name ?? '';
      postData.borro_bank_acc_num = BankDetailstate.borro_bank_acc_num ?? '';
      postData.borro_bank_type = BankDetailstate.borro_bank_type ?? '';
      postData.doc_key = BankDetailstate.doc_key ?? '';
      postData.borro_bank_code = BankDetailstate.borro_bank_code ?? '';
    }
    if (GSTIn) {
      postData.fina_docs_gstin = GSTIn;
    }
    const data = {
      loanAppID: loanAppId,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      user: user,
      user_id: user?._id,
    };
    new Promise((resolve, reject) => {
      dispatch(getMsmeLoanDocumentsWatcher(data, resolve, reject));
    }).then((response) => {
      matchingObj = response?.find((otherObj) => otherObj.code === documentCode.gstr);
      if (checkboxes['check2']) {
        if (!matchingObj) showAlert('Please Upload GSTR', 'error');
        else {
          postFinancialDetails(postData);
        }
      } else {
        postFinancialDetails(postData);
      }
    });
  };

  const setStatusCheckApi = async (loanAppID, sectionCode, subSectionCode, dispatch, flag) => {
    intervalId = setInterval(async () => {
      try {
        let status = await getSectionStatus(loanAppID, user, MSMECompanyId, MSMEProductId, sectionCode, subSectionCode, dispatch, flag);
        let subSectionRemarks = await getSubSectionRemarks(
          loanAppID,
          user,
          MSMECompanyId,
          MSMEProductId,
          sectionCode,
          subSectionCode,
          dispatch
        );
        const status_list = ['approved', 'deviation', 'rejected', 'failed'];
        let sectionStatus = status?.section_status ?? '';

        if (typeof status == 'object') {
          if ([status?.sub_section_status].includes('approved')) {
            status = 'approved';
          } else if ([status?.sub_section_status].includes('deviation')) {
            status = 'deviation';
          } else {
            status = status?.sub_section_status;
          }
        } else {
          status = status?.toLowerCase();
        }
        if (status_list.includes(status)) {
          clearInterval(intervalId);
        }
        if (subSectionCode === SectionData.financial_docs.financial_doc_section_submit.sub_section_code) {
          if (status === 'approved' && sectionStatus == 'approved') {
            setNavState('Additional Docs');
            setNavIconPrefixState((prevState) => ({
              ...prevState,
              'Financial Docs': 'success',
            }));
            setSectionStatusCheck('completed');
          } else if (status == 'rejected' || sectionStatus == 'rejected') {
            showAlert('Submit Rejected', 'error');
            setGstButtonState('button');
            setSectionStatusCheck('');
            setIsLeadRejected(true);
          }
        }

        if (subSectionCode === SectionData.financial_docs.financial_doc_gst.sub_section_code) {
          if (['approved', 'deviation'].includes(status)) {
            setGstBorder('1px solid green');
            showAlert('GSTIN Verified Successfully', 'success');
            setGstButtonState('icon');
            setGSTinDisable(true);
          }
          if (status == 'rejected') {
            showAlert(subSectionRemarks || 'GST Rejected', 'error');
            setGstButtonState('button');
          }
          if (status == 'failed') {
            showAlert('Something went Wrong', 'error');
            setGstButtonState('button');
          }
        }

        if (sectionStatus == 'approved') {
          if (subSectionCode === SectionData.financial_docs.financial_doc_section_submit.sub_section_code) {
            setNavState('Additional Docs');
            setNavIconPrefixState((prevState) => ({
              ...prevState,
              'Financial Docs': 'success',
            }));
            setSectionStatusCheck('completed');
          }
          clearInterval(intervalId);
        } else if (sectionStatus == 'deviation') {
          if (subSectionCode === SectionData.financial_docs.financial_doc_section_submit.sub_section_code) {
            setNavState('Additional Docs');
            setNavIconPrefixState((prevState) => ({
              ...prevState,
              'Financial Docs': 'success',
            }));
            setSectionStatusCheck('completed');
          }
          clearInterval(intervalId);
        } else if (sectionStatus == 'rejected') {
          clearInterval(intervalId);
        }
      } catch (error) {
        clearInterval(intervalId);
      }
    }, 10000);
  };

  const addBankStatement = () => {
    const newItemId = `bs${bankInputItems?.length + 1}`;
    const newItem = {
      id: newItemId,
      name: bankInputItems.length === 0 ? '6 Month Bank Statement' : 'Add Statement',
      fileSize: 'PDF up to 10MB',
      acceptFileType: '.pdf',
      fileType: 'file',
      documentCode: documentCode.msme_bank_statement,
      docIndex: bankDocuments.length,
    };

    if (bankDocuments.length < 12) {
      setBankInputItems([...bankInputItems, newItem]);
      setBankDocuments([...bankDocuments, newItem]);
    } else {
      setAlert({
        open: true,
        severity: 'warning',
        alertMessage: 'You have reached the maximum number of bank statements',
      });
    }
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity('');
    setAlertMessage('');
  };

  const removeBankStatement = (id) => {
    const updatedItems = bankInputItems.filter((item) => item.id !== id);
    const updatedBankItems = bankDocuments.filter((item) => item.id !== id);
    setBankInputItems(updatedItems);
    setBankDocuments(updatedBankItems);
    deleteBankStatement(id);
  };

  const handleDataFromChild = (event, docs) => {
    setLoader(true);
    setDisabled(false);
    const type = String(event).split('');
    if (type.length > 2 && type[0] == 'b' && type[1] == 's') {
      fileInterval = setInterval(() => {
        getLoanDocuments(bankStatementCount == docs.length ? bankStatementCount : bankStatementCount + 1);
      }, 3000);
    } else {
      getLoanDocuments();
    }
  };

  const deleteBankStatement = (id) => {
    const payload = {
      loanAppId: loanAppId,
      tokenData: {
        user: user,
        user_id: user?._id,
        product_id: MSMEProductId,
        company_id: MSMECompanyId,
      },
      code: documentCodes.BS,
      codeIndex: id?.split('bs')?.reverse()?.[0],
    };
    if (payload.code && payload.codeIndex) {
      new Promise((resolve, reject) => {
        dispatch(patchMsmeDocDeleteWatcher(payload, resolve, reject));
      })
        .then((response) => {
          getLoanDocuments();
        })
        .catch((error) => {
          getLoanDocuments();
        });
    }
  };

  const topHeadingStyle = {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '700',
    fontSize: '24px',
    lineHeight: '36px',
    color: '#161719',
  };

  const setInitialData = (response) => {
    let financialStatus = response;
    let updatedData = {
      ...BankDetailstate,
    };

    if (financialStatus && Object.values(financialStatus).length) {
      if (financialStatus.financial_documents) {
        updatedData = {
          ...updatedData,
          ...financialStatus.financial_documents,
          doc_key: '',
        };
        if (updatedData.borro_bank_acc_num || updatedData.borro_bank_name || updatedData.borro_bank_type) checkboxes['check4'] = true;
      }
    }

    setBankDetailstate((prevData) => ({
      ...prevData,
      ...updatedData,
    }));

    if (financialStatus.bankStatements?.length) {
      let bankInputItems = financialStatus.bankStatements.map((item) => {
        return {
          id: `bs${bankInputItems?.length + 1}`,
          name: item,
          fileSize: 'PDF upto 10MB',
          acceptFileType: '.pdf',
        };
      });
      setBankInputItems(bankInputItems);
    }
    if (financialStatus.financial_documents.fina_docs_gstin) {
      setGSTIn(financialStatus.financial_documents.fina_docs_gstin);
    }
  };

  const fetchLoanDetails = () => {
    new Promise((resolve, reject) => {
      dispatch(
        getBookLoanDetailsWatcher(
          {
            loan_app_id: loanAppId,
            user: user,
            user_id: user?._id,
          },
          resolve,
          reject,
        ),
      );
    })
      .then((response) => {
        setInitialData(response);
        setLeadStatus(response?.lead_status);
        setLoader(false);
      })
      .catch((error) => {});
  };

  const postFinancialDetails = (payload) => {
    payload = {
      ...payload,
      user: user,
      user_id: user?._id,
      msme_product_id: MSMEProductId,
      msme_company_id: MSMECompanyId,
      loan_app_id: loanAppId,
      section_sequence_no: SectionData.financial_docs.section_sequence_no,
      section_name: SectionData.financial_docs.section_name,
      sub_section_code: SectionData.financial_docs.financial_doc_section_submit.sub_section_code,
      sub_section_name: SectionData.financial_docs.financial_doc_section_submit.sub_section_name,
      sub_section_sequence_no: SectionData.financial_docs.financial_doc_section_submit.sub_section_sequence_no,
      section_code: SectionData.financial_docs.section_code,
    };
    new Promise((resolve, reject) => {
      dispatch(patchMsmeDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setSectionStatusCheck('inProgress');
        setStatusCheckApi(loanAppId, SectionData.financial_docs.section_code, SectionData.financial_docs.financial_doc_section_submit.sub_section_code, dispatch, true);
        setTimeout(() => {
          showAlert(response?.message, 'success');
        }, 3100);
        getLoanDocuments();
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  const change = (e, type, name) => {
    if (e.value) {
      setGSTIn(e.value);
    }
    const buttonLable = e.target?.textContent;
    if (buttonLable === 'Verify') {
      if (name === 'gstin_value') {
        const payload = {
          loanAppID: loanAppId,
          companyId: MSMECompanyId,
          productId: MSMEProductId,
          user: user,
          user_id: user?._id,
        };
        new Promise((resolve, reject) => {
          dispatch(getMsmeLoanDocumentsWatcher(payload, resolve, reject));
        }).then((response) => {
          const matchingObj = response?.find((otherObj) => otherObj.code === documentCode.gst_certificate);
          if (matchingObj) {
            gstValueVerify(GSTIn, name, type);
          } else {
            showAlert('please upload GST Certificate', 'error');
          }
        });
      }
    }
  };

  const gstValueVerify = async (value, name, type) => {
    setGstButtonState('loader');
    if (name === 'gstin_value') {
      await callValidator(
        {
          fina_docs_gstin: value,
          sequence: 1101,
          section_code: 'financial_doc',
          section_name: 'Financial Document',
          sub_section_code: 'financial_doc_gst',
          section_sequence_no: 500,
          sub_section_name: 'Financial Document GST Check',
          sub_section_sequence_no: 1,
        },
        'gst',
      );
    }
  };

  const callValidator = async (payload, stage) => {
    const body = {
      ...payload,
      section: 'financial-documents',
      loan_app_id: loanAppId,
      company_id: MSMECompanyId,
      user: user,
      user_id: user?._id,
      product_id: MSMEProductId,
      msme_company_id: MSMECompanyId,
      msme_product_id: MSMEProductId,
    };
    new Promise((resolve, reject) => {
      dispatch(patchMsmeDetailsWatcher(body, resolve, reject));
    })
      .then((response) => {
        setStatusCheckApi(loanAppId, body.section_code, body.sub_section_code, dispatch, false);
      })
      .catch((error) => {
        if (stage === 'gst') setGstButtonState('button');
        showAlert(error?.response?.data?.message ?? error?.message ?? 'error while saving draft', 'error');
      });
  };

  return (
    <React.Fragment>
      <div
        style={{
          padding: '0px 100px 0px 20px',
          height: checkboxes.check4 ? '1100px' : '640px',
        }}
      >
        <h2 style={topHeadingStyle}>Upload Financial Documents</h2>
        <p className="paraUpload">Select at least 1 document</p>
        <div className="checkBoxStyle">
          {checkBoxList.map((checkbox) => (
            <div style={{ display: 'flex', marginRight: '20px' }} key={checkbox.id}>
              <input className="inputCheckBoxStyle" type="checkbox" checked={checkboxes[checkbox.id]} onChange={() => handleCheckboxChange(checkbox.id)} disabled={disableFields} />
              <label className="lableStyle-financialDoument">{checkbox.label}</label>
            </div>
          ))}
        </div>
        <div className="uploadComponent">
          <div className="ITRComponentStyle">
            {checkboxes.check1 && (
              <UploadFileInput onDataCallback={(event) => handleDataFromChild(event, financialDocuments)} items={financialDocuments} title="ITR" setState={setITRstate} loanAppId={loanAppId} MSMECompanyId={MSMECompanyId} MSMEProductId={MSMEProductId} sectionName={sectionName} isChange={sectionStatus.includes(statusObject?.section_status) ? false : true} backgroundColorBlur={disableFields ? true : false} data={{ company_id: MSMECompanyId, product_id: MSMEProductId }} showAlert={showAlert} />
            )}
            {checkboxes.check2 && (
              <div>
                <h2 style={headingStyle}>GSTR</h2>
                <div style={{ display: 'flex', width: 'max-content' }}>
                  {!entityDetails ? <UploadFileInput items={gstrDocuments} title="" setState={setGSTstate} loanAppId={loanAppId} MSMECompanyId={MSMECompanyId} MSMEProductId={MSMEProductId} sectionName={sectionName} isChange={sectionStatus.includes(statusObject?.section_status) ? false : true} backgroundColorBlur={disableFields ? true : false} data={{ company_id: MSMECompanyId, product_id: MSMEProductId }} showAlert={showAlert} /> : null}
                  {!entityDetails ? (
                    <InputBox
                      isBoxType={gstButtonState}
                      Buttonlabel={'Verify'}
                      initialValue={disableFields ? GSTIn : (GSTIn ?? '').toUpperCase() ?? ''}
                      isDisabled={gstinDisable || disableFields}
                      id={'gstin'}
                      label={'GSTIN'}
                      isDrawdown={false}
                      onClick={(event) => change(event, 'GST', 'gstin_value')}
                      customClass={{
                        height: '58px',
                        width: '720px',
                        marginRight: '36.5px',
                        marginLeft: '36.5px',
                        marginTop: '21px',
                        border: gstBorder,
                      }}
                      customInputClass={{
                        maxWidth: '720px',
                      }}
                    />
                  ) : null}
                  <UploadFileInput onDataCallback={(event) => handleDataFromChild(event, gstr)} items={gstr} title="" setState={setGSTstate} loanAppId={loanAppId} MSMECompanyId={MSMECompanyId} MSMEProductId={MSMEProductId} sectionName={sectionName} isChange={sectionStatus.includes(statusObject?.section_status) ? false : true} backgroundColorBlur={entityDetails ? false : disableFields || !gstinDisable ? true : false} data={{ company_id: MSMECompanyId, product_id: MSMEProductId }} showAlert={showAlert} />
                </div>
              </div>
            )}
            {checkboxes.check3 && (
              <UploadFileInput items={fsDocuments} onDataCallback={(event) => handleDataFromChild(event, fsDocuments)} title="Financial Statement" setState={setFSIstate} loanAppId={loanAppId} MSMECompanyId={MSMECompanyId} MSMEProductId={MSMEProductId} sectionName={sectionName} isChange={sectionStatus.includes(statusObject?.section_status) ? false : true} backgroundColorBlur={disableFields ? true : false} data={{ company_id: MSMECompanyId, product_id: MSMEProductId }} showAlert={showAlert} />
            )}
            {checkboxes.check4 && (
              <div>
                <h2 style={headingStyle}>Bank Statement</h2>
                <h4 style={headingStyle}>Enter Bank Account Details</h4>

                <div style={bankStatementStyle}>
                  <InputBox label="Bank Name" isDrawdown={disableFields ? false : true} customClass={bankInputBoxStyle} initialValue={BankDetailstate.borro_bank_name} isDisabled={disableFields ? true : false} customDropdownClass={{ marginTop: '7px', zIndex: 5 }} options={BankList} onClick={(value) => handleDropdownBankNameChange(value)} />
                  <InputBox label="Bank A/C No." type={'number'} isDrawdown={false} customClass={bankInputBoxStyle} customDropdownClass={{ marginTop: '7px', zIndex: 5 }} initialValue={BankDetailstate.borro_bank_acc_num} isDisabled={disableFields ? true : false} onClick={(e) => handleAccNoChange(e)} />

                  <InputBox label="Bank A/C Type" isDrawdown={disableFields ? false : true} customClass={bankInputBoxStyle} initialValue={BankDetailstate.borro_bank_type} isDisabled={disableFields ? true : false} customDropdownClass={{ marginTop: '7px', zIndex: 5 }} options={BankType} onClick={(value) => handleDropdownAccTypeChange(value)} />
                </div>

                <h3 style={uploadTittleStyle}>Upload Bank Statement</h3>
                <UploadFileInput setState={setBankStatementstate} removeItem={removeBankStatement} onDataCallback={(event) => handleDataFromChild(event, bankDocuments)} items={bankDocuments} loanAppId={loanAppId} MSMECompanyId={MSMECompanyId} MSMEProductId={MSMEProductId} sectionName={sectionName} hideRemove={disableFields ? true : false} isChange={sectionStatus.includes(statusObject?.section_status) ? false : true} data={{ company_id: MSMECompanyId, product_id: MSMEProductId }} showAlert={showAlert} />

                <div>
                  {bankDocuments.length < 12 && !loader && (
                    <button onClick={!loader && addBankStatement} style={stateMentButton} disabled={disableFields || loader ? true : false}>
                      Add more bank statement
                    </button>
                  )}
                  <h4 style={h6passwordStyle}>If the files are password-protected, please provide the password.</h4>

                  <InputBox label="Enter File Password" isDrawdown={false} customClass={bankInputBoxStyle} initialValue={BankDetailstate.doc_key} customDropdownClass={{ marginTop: '7px', zIndex: 5 }} onClick={(e) => handlePasswordChange(e)} isDisabled={disableFields ? true : false} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {alert ? <AlertBox severity={severity} msg={alertMessage} onClose={handleAlertClose} /> : null}

      <div className={`${Object.values(checkboxes).some((value) => value === true) ? 'book-loan-button-container ' : 'book-loan-button-container-absolute-bottom '}book-loan-button-alignment-double-button`}>
        {props.type == 'view' ? null : (
          <React.Fragment>
            <Button
              id="submitAndNext"
              onClick={handleSubmit}
              isDisabled={disable}
              isLoading={sectionStatusCheck == 'inProgress' ? true : false}
              label="Submit & Next"
              buttonType="linksss"
              customStyle={customSubmitButton}
              customLoaderClass={{
                borderTop: '4px solid #fff',
              }}
            />

            {!disableDraftButton && leadStatus === LeadNewStatus.Draft ? (
              <Button
                id="saveDraft"
                label="Save as Draft"
                buttonType="secondary"
                customStyle={customSaveButton}
                onClick={() => {
                  handleFinanceDocumentDraft(false);
                }}
                isDisabled={disableDraftButton}
              />
            ) : null}
          </React.Fragment>
        )}
      </div>
      {(isLoading || loader) && <Preloader />}
    </React.Fragment>
  );
};

export default UploadComponent;

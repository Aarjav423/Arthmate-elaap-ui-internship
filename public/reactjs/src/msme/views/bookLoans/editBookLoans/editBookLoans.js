import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import 'react-sdk/dist/styles/_fonts.scss';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import useDimensions from 'hooks/useDimensions';
import { storedList } from '../../../../util/localstorage';
import { setObjectKeysToDefault, toCamel } from 'util/helper';
import BookLoans from '../bookLoans.view';
import { bookLoansFormJsonFields } from '../bookLoansFormJson';
import { getBookLoanDetailsWatcher, getMsmeLoanDocumentsWatcher } from '../../../actions/bookLoan.action';
import { AlertBox } from 'components/CustomAlertbox';
import { LeadStatus, LeadNewStatus, LeadMapping } from '../../../config/LeadStatus';
import { additionalDocumentsMapping, coApplicantsMapping, entityDetailsMapping, financialDocumentsMapping, guarantorDetailsMapping, primaryApplicantMapping } from '../bookLoanMapData';

import { getLeadStatusWatcher } from '../../../actions/lead.action';
import { 
  formatLeadStatus, 
  extractRegexElementFromJson, 
  formatLeadRemarks, 
  formatSubSectionLeadStatus, 
  deepCopy,
  formatLeadSectionObject
} from '../../../../util/msme/helper';

const user = { _id: storedList('user')?._id, id: storedList('user')?.id };
const BOOK_LOAN_FORM_JSON = bookLoansFormJsonFields();

const fetchObjectsByDept = (deptName) => {
  const matchingObjects = {};
  for (let object of BOOK_LOAN_FORM_JSON) {
    if (object.dept === deptName) {
      let updatedObject = {
        ...object,
        field: `${object.type}_vl_${object.field}`,
      };
      matchingObjects[updatedObject.field] = updatedObject;
    }
  }

  return matchingObjects; // Return the array of matching objects
};

const sanitizedData = (data, keys = [], type = "view",leadStatus,status) => {
  const tempData = deepCopy(data);

  if (leadStatus == "pending" && status=="deviation" && type=="edit") {
    if (Array.isArray(tempData)) {
      for (let i = 0; i < tempData.length; i++) {
        if (tempData[i]) {
          for (let key of keys) {
            if (tempData[i][key]) {
              delete tempData[i][key]
            }
          }
        }
      }
    } else {
      for (let key of keys) {
        if (tempData && tempData[key]) {
          delete tempData[key]
        }
      }
    }
  }

  return tempData;
}

/**
 *
 * @param {*} props
 * @returns
 */
export default function EditBookLoans(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const isLoading = useSelector((state) => state.profile.loading);
  const [customerDocs, setCustomerDocs] = useState();
  const location = useLocation();
  const [applicantDetails, setApplicantDetails] = useState(setObjectKeysToDefault(fetchObjectsByDept('Applicant Details')));
  const [coApplicantsData, setCoApplicantsData] = useState([setObjectKeysToDefault(fetchObjectsByDept('Co-Applicant Details'))]);

  const [entityDetails, setEntityDetails] = useState(setObjectKeysToDefault(fetchObjectsByDept('Entity Details')));
  const [guarantorsData, setGuarantorsData] = useState(setObjectKeysToDefault(fetchObjectsByDept('Guarantor Details')));
  const [financialDocumentsDetails, setFinancialDocumentsDetails] = useState(setObjectKeysToDefault(fetchObjectsByDept('Financial Documents')));
  const [additionalDocumentsDetails, setAdditionalDocumentsDetails] = useState({});
  const [loanDetailsStatus, setLoanDetailsStatus] = useState({});
  const [leadComment, setLeadComment] = useState({});
  const [leadCommentOb, setLeadCommentOb] = useState({});
  const [loanDetailsSubsectionStatus,setLoanDetailsSubsectionStatus]= useState({});
  const [shouldFetch, setShouldFetch] = useState(0);
  const [loanDetailsData, setLoanDetailsData] = useState({});
  const [ loanSectionObject, setLoanSectionObject] = useState({})
  const [shouldFetchDocument, setShouldFetchDocument] = useState(0)

  const type = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

  const [navPrefixStateEdit, setNavPrefixStateEdit] = useState({
    'Applicant Details': null,
    'Entity Details': null,
    'Co-Applicant Details': null,
    'Guarantor Details': null,
    'Financial Docs': null,
    'Additional Docs': null,
    Offer: null,
  });

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    severity: '',
  });

  const { innerWidth, innerHeight } = useDimensions();
  const styles = useStyles({ innerWidth, innerHeight });

  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    fetchBookLoanDetails();
    getLoanDocuments();
  }, [shouldFetch]);

  useEffect(() => {
    if(shouldFetchDocument) getLoanDocuments();
  },[shouldFetchDocument])

  const showAlert = (msg, type) => {
    setAlert({
      show: true,
      message: msg,
      severity: type,
    });
  };

  const fetchBookLoanDetails = () => {
    const { companyId, productId } = history.location.state || {};

    const payload = {
      loan_app_id: params.id,
      companyId: companyId,
      productId: productId,
      user: user,
    };

    new Promise((resolve, reject) => {
      dispatch(getBookLoanDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setLoanDetailsData(response);
        fetchLeadStatus();
      })
      .catch((error) => {
        //showAlert(error?.response?.data?.message, "error");
      });
  };

  const fetchLeadStatus = () => {
    const { companyId, productId } = history.location.state || {};

    const payload = {
      loan_app_id: params.id,
      companyId: companyId,
      productId: productId,
      user: user,
    };

    new Promise((resolve, reject) => {
      dispatch(getLeadStatusWatcher(payload, resolve, reject));
    })
      .then((response) => {
        const formatLead = formatLeadStatus(response);
        const formattedLeadComment = formatLeadRemarks(response);
        setLeadComment(formattedLeadComment);
        const formatSubSectionLead = formatSubSectionLeadStatus(response);
        setLoanDetailsStatus(formatLead);
        const leadStatusObj = formatLeadSectionObject(response)
        setLoanSectionObject(leadStatusObj)
        setLoanDetailsSubsectionStatus(formatSubSectionLead);
      })
      .catch((error) => {
        //showAlert(error?.response?.data?.message, "error");
      });
  };

  useEffect(() => {
    if (Object.keys(loanDetailsStatus).length) {
      processLeadData();
    }
  }, [loanDetailsStatus]);

  useEffect(() => {
    if (Object.keys(leadComment).length) {
      processLeadComment();
    }
  }, [leadComment]);

  const processLeadComment = ()=>{

    const co_applicant_status = extractRegexElementFromJson(leadComment, /^co-applicant_details_\d+$/);
    const guarantor_status = extractRegexElementFromJson(leadComment, /^guarantor_details_\d+$/);

    let leadCommentOb = {
      ...leadComment,
      'Applicant Details': leadComment.primary ? leadComment.primary : null,
      'Entity Details': leadComment.entity ? leadComment.entity : null,
      'Co-Applicant Details': checkStatus(co_applicant_status , loanDetailsData["co_applicant_details"]),
      'Guarantor Details': checkStatus(guarantor_status , loanDetailsData["guarantor_details"]),
    };

    if (loanDetailsData['entity_details']['entity_type'] !== 'Proprietor') {
      leadCommentOb = {
        ...leadCommentOb,
        Shareholding: leadComment.share_holding ? leadComment.share_holding : null,
      };
    }

    leadCommentOb = {
      ...leadCommentOb,
      'Financial Docs': leadComment.financial_doc ? leadComment.financial_doc : null,
      'Additional Docs': leadComment.additional_doc ? leadComment.additional_doc : null,
      Offer: leadComment.offer ? leadComment.offer : null,
    };

    setLeadCommentOb(leadCommentOb)
  }

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
        setCustomerDocs(response);
      })
      .catch((error) => {
        showAlert(error.response?.data?.message, 'error');
      });
  };

  const processLeadData = () => {

    const co_applicant_status = extractRegexElementFromJson(loanDetailsStatus, /^co-applicant_details_\d+$/);
    const guarantor_status = extractRegexElementFromJson(loanDetailsStatus, /^guarantor_details_\d+$/);

    let leadStatusOb = {
      'Applicant Details': loanDetailsStatus.primary ? loanDetailsStatus.primary : null,
      'Entity Details': loanDetailsStatus.entity ? loanDetailsStatus.entity : null,
      'Co-Applicant Details': checkStatus(co_applicant_status , loanDetailsData["co_applicant_details"]),
      'Guarantor Details': checkStatus(guarantor_status , loanDetailsData["guarantor_details"]),
    };

    if (loanDetailsData['entity_details']['entity_type'] !== 'Proprietor') {
      leadStatusOb = {
        ...leadStatusOb,
        Shareholding: loanDetailsStatus.share_holding ? loanDetailsStatus.share_holding : null,
      };
    }

    leadStatusOb = {
      ...leadStatusOb,
      'Financial Docs': loanDetailsStatus.financial_doc ? loanDetailsStatus.financial_doc : null,
      'Additional Docs': loanDetailsStatus.additional_doc ? loanDetailsStatus.additional_doc : null,
      Offer: loanDetailsStatus.offer ? loanDetailsStatus.offer : null,
    };

    let tempEditable = {};

    if (type == 'edit') {
      if (loanDetailsData.lead_status != LeadNewStatus['Pending'] && loanDetailsData.lead_status != LeadNewStatus['Draft'] && loanDetailsData.lead_status != LeadNewStatus['FollowUpDoc'] && loanDetailsData.lead_status != LeadNewStatus['FollowUpKyc']) {
        showAlert('Lead is not applicable for edit', 'error');
        return;
      }

      for (let key in leadStatusOb) {
        if (leadStatusOb[key] && leadStatusOb[key] != LeadNewStatus['Rejected'] ) {
          if (loanDetailsData.lead_status == LeadNewStatus.Draft && leadStatusOb[key] == LeadNewStatus.Approved) {
            tempEditable[key] = 'success';
          }else if (loanDetailsData.lead_status == LeadNewStatus.Draft && leadStatusOb[key] == LeadNewStatus.Deviation) {
            tempEditable[key] = 'deviation';
          } else if(loanDetailsData.lead_status == LeadNewStatus['Pending'] && leadStatusOb[key] == LeadNewStatus['InProgress']){
            tempEditable[key] = 'deviation';
          }else if (leadStatusOb[key] == LeadNewStatus['Approved'] && (loanDetailsData.lead_status == LeadNewStatus['Pending'] || loanDetailsData.lead_status == LeadNewStatus['FollowUpDoc'] || loanDetailsData.lead_status != LeadNewStatus['FollowUpKyc'])) {
            if(loanDetailsData.lead_status == LeadNewStatus['Pending'] && key=="Additional Docs"){
              tempEditable[key] = 'deviation';
            }else{
              tempEditable[key] = 'success';
            }
          }
        }else if(leadStatusOb[key] == LeadNewStatus['Rejected']){
          showAlert(`Your lead has been rejected`, 'error');
        }else if((key === 'Co-Applicant Details' || key === 'Guarantor Details' ) && loanDetailsData.lead_status == LeadNewStatus['Pending'] && !leadStatusOb[key]){
          tempEditable[key] = 'success';
        }
      }
    } else if (type == 'view') {
      //this is a mock for view
      for (let key in leadStatusOb) {
        if (leadStatusOb[key] && leadStatusOb[key] != LeadNewStatus['Rejected']) {
          if (leadStatusOb[key] != LeadNewStatus['InProgress']) {
            tempEditable[key] = leadStatusOb[key]=="approved"?"success":leadStatusOb[key];
          }else if (leadStatusOb[key] == LeadNewStatus['InProgress']){
            tempEditable[key] = 'deviation';
          }
        }
      }
    }

    setNavPrefixStateEdit({ ...leadStatusOb, ...tempEditable });

    populateApplicantDetails(tempEditable['Applicant Details']);
    populateCoApplicantDetails(tempEditable['Co-Applicant Details']);
    populateGuarantorDetails(tempEditable['Guarantor Details']);
    populateEntityDetails(tempEditable['Entity Details']);
    populateFinancialDocumentDetails(tempEditable['Financial Docs']);
    populateAdditionalDocumentDetails(tempEditable['Additional Docs']);
  };

  const populateApplicantDetails = (state) => {
    let data = primaryApplicantMapping(loanDetailsData);
    data= sanitizedData(data,['aadhaar_vl_aadhaar_value'],type,loanDetailsData?.lead_status,state)
    setApplicantDetails(data);
  };

  const populateCoApplicantDetails = (state) => {
    let data = coApplicantsMapping(loanDetailsData);
    data= sanitizedData(data,['aadhaar_vl_cb_aadhaar'],type,loanDetailsData?.lead_status,state)
    setCoApplicantsData(data);
  };

  const populateEntityDetails = (state) => {
    let data = entityDetailsMapping(loanDetailsData);
    setEntityDetails(data);
  };

  const populateGuarantorDetails = (state) => {
    let data = guarantorDetailsMapping(loanDetailsData);
    data= sanitizedData(data,['aadhaar_vl_guar_aadhaar'],type,loanDetailsData?.lead_status,state)
    setGuarantorsData(data);
  };

  const populateFinancialDocumentDetails = (state) => {
    let data = financialDocumentsMapping(loanDetailsData);

    setFinancialDocumentsDetails(data);
  };

  const populateAdditionalDocumentDetails = (state) => {
    let data = additionalDocumentsMapping(loanDetailsData);
    setAdditionalDocumentsDetails(data);
  };

  return (
    <React.Fragment>
      <BookLoans
        leadComment={leadCommentOb}
        fetchedApplicantDetails={applicantDetails}
        fetchedCoApplicantDetails={coApplicantsData}
        fetchedEntityDetails={entityDetails}
        fetchedGuarantorDetails={guarantorsData}
        financialDocumentsDetails={financialDocumentsDetails}
        additionalDocumentsDetails={additionalDocumentsDetails}
        navPrefixStateEdit={navPrefixStateEdit}
        loanDetailsSubsectionStatus={loanDetailsSubsectionStatus}
        leadStatus={loanDetailsData.lead_status}
        loanDetailsStatus={loanDetailsStatus}
        customerDocs={customerDocs}
        loanAppId={params.id}
        shouldFetch={shouldFetch}
        setLoanSectionObject={setLoanSectionObject}
        setShouldFetch={setShouldFetch}
        loanSectionObject={loanSectionObject}
        setShouldFetchDocument={setShouldFetchDocument}
      />
      {alert.show ? (
        <AlertBox
          severity={alert.severity}
          msg={alert.message}
          onClose={() => setAlert({ show: false, severity: "", message: "" })}
        />
      ) : null}
    </React.Fragment>
  );
}

const useStyles = ({ innerWidth, innerHeight }) => {
  return {};
};

function checkStatus(data , object  = []) {
  if (Object.keys(data).length === 0) return null;

  let status=LeadNewStatus['Approved']

  for (let key in data) {
    if (!data[key]) {
      return null;
    }

    if (data[key] == LeadNewStatus['Rejected']) {
      return LeadNewStatus['Rejected'];
    }

    if (data[key] == LeadNewStatus['InProgress']) {
      return LeadNewStatus['InProgress'];
    }
    if (data[key] == LeadNewStatus['Deviation']) {
      status= LeadNewStatus['Deviation'];
    }
  }

  if(object?.length  !== Object.keys(data).length ){
    return LeadNewStatus['InProgress'];
  }
  return status;
}

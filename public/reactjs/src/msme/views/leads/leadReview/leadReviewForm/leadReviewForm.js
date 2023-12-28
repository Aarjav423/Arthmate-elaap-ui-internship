import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import TabButton from 'react-sdk/dist/components/TabButton';
import 'react-sdk/dist/styles/_fonts.scss';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import useDimensions from 'hooks/useDimensions';
import { storedList } from '../../../../../util/localstorage';
import Popup from 'react-sdk/dist/components/Popup/Popup';
import Button from 'react-sdk/dist/components/Button/Button';
import { convertDataIntoAccordionData, deepCopy, formatLeadSectionObject, formatLeadStatus, formatSubSectionLeadStatus, toSnakeCase } from '../../../../../util/msme/helper';
import { CustomAccordion, DocumentsList, OfferGenerate, Tooltip } from '../../../../components/msme.component';
import '../leadReview.style.css';
import { setObjectKeysToDefault, toCamel } from 'util/helper';
import { getBookLoanDetailsWatcher } from '../../../../actions/bookLoan.action';
import LeadReviewApplicantDetailsForm from './leadReviewApplicantDetailsForm';
import { getLeadStatusWatcher } from 'msme/actions/lead.action';
import LeadReviewCoApplicantDetailsForm from './leadReviewCoApplicantDetailsForm';
import LeadReviewGuarantorDetailsForm from './leadReviewGuarantorDetailsForm';
import LeadReviewFinancialDocumentsForm from './leadReviewFinancialDocumentForm';
import LeadReviewEntityDetailsForm from './leadReviewEntityDetailsForm';
import { createMsmeActivityLogWatcher } from 'msme/actions/lead.action';
const user = { _id: storedList('user')?._id, id: storedList('user')?.id };

const sectionType = {
  primary: 'primary applicant',
  entity: 'entity',
  co_borrower: 'co-applicant',
  guarantor: 'guarantor',
  financial_doc: 'financial documents',
};

export default function LeadReviewForm(props) {
  const { companyId, productId, loanAppId, leadData, fetchActivityLogs } = props;

  const [loanDetailsData, setLoanDetailsData] = useState({});
  const [leadStatusObject, setLeadStatusObject] = useState({});
  const [accordionData, setAccordionData] = useState([]);
  const [loanDetailsSubsectionStatus, setLoanDetailsSubsectionStatus] = useState({});
  const [shouldFetch, setShouldFetch] = useState(0);

  const { innerWidth, innerHeight } = useDimensions();
  const styles = useStyles({ innerWidth, innerHeight });

  const dispatch = useDispatch();

  useEffect(() => {
    if (companyId && productId && loanAppId && leadData) {
      fetchBookLoanDetails();
      fetchLeadStatus();
    }
  }, [companyId, productId, loanAppId, leadData, shouldFetch]);

  useEffect(() => {
    if (loanDetailsData && leadStatusObject && loanDetailsSubsectionStatus && Object.values(loanDetailsData).length && Object.values(leadStatusObject).length && Object.values(loanDetailsSubsectionStatus).length) {
      formattedData();
    }
  }, [loanDetailsData, leadStatusObject, loanDetailsSubsectionStatus]);

  const fetchBookLoanDetails = () => {
    const payload = {
      loan_app_id: loanAppId,
      companyId: companyId,
      productId: productId,
      user: user,
    };

    new Promise((resolve, reject) => {
      dispatch(getBookLoanDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setLoanDetailsData(response);
      })
      .catch((error) => {
        //showAlert(error?.response?.data?.message, "error");
      });
  };

  const fetchLeadStatus = () => {
    const payload = {
      loan_app_id: loanAppId,
      companyId: companyId,
      productId: productId,
      user: user,
    };
    new Promise((resolve, reject) => {
      dispatch(getLeadStatusWatcher(payload, resolve, reject));
    })
      .then((response) => {
        const leadStatusObj = formatLeadSectionObject(response);
        setLeadStatusObject(leadStatusObj);
        const formatSubSectionLead = formatSubSectionLeadStatus(response);
        setLoanDetailsSubsectionStatus(formatSubSectionLead);
      })
      .catch((error) => {
        //showAlert(error?.response?.data?.message, "error");
      });
  };

  const createMsmeActivityLog = (section, index) => {
    const payload = {
      companyId: loanDetailsData.company_id,
      productId: loanDetailsData.product_id,
      type: 'credit_update',
      remarks: `Credit Manager updated ${sectionType[section]}${index || index == 0 ? ` ${parseInt(index) + 1}` : ''} details`,
      loan_app_id: loanDetailsData.loan_app_id,
      category: section,
      user: user,
    };

    new Promise((resolve, reject) => {
      dispatch(createMsmeActivityLogWatcher(payload, resolve, reject));
    })
      .then((response) => {
        fetchActivityLogs();
      })
      .catch((error) => {
        //error
      });
  };

  const bottomComponent = (title) => {
    return (
      <div style={styles['leadReviewBottomComponent']}>
        {title == 'primary_applicant' ? <LeadReviewApplicantDetailsForm loanDetailsData={loanDetailsData} leadStatusObject={leadStatusObject} loanDetailsSubsectionStatus={loanDetailsSubsectionStatus} setShouldFetch={setShouldFetch} createMsmeActivityLog={createMsmeActivityLog} /> : <div />}
        {title == 'entity_details' ? <LeadReviewEntityDetailsForm loanDetailsData={loanDetailsData} leadStatusObject={leadStatusObject} loanDetailsSubsectionStatus={loanDetailsSubsectionStatus} setShouldFetch={setShouldFetch} createMsmeActivityLog={createMsmeActivityLog} /> : <div />}
        {title.includes('co-applicant') ? <LeadReviewCoApplicantDetailsForm loanDetailsData={loanDetailsData} leadStatusObject={leadStatusObject} loanDetailsSubsectionStatus={loanDetailsSubsectionStatus} setShouldFetch={setShouldFetch} index={title?.split('_')[1] - 1} createMsmeActivityLog={createMsmeActivityLog} /> : <div />}
        {title.includes('guarantor') ? <LeadReviewGuarantorDetailsForm loanDetailsData={loanDetailsData} leadStatusObject={leadStatusObject} loanDetailsSubsectionStatus={loanDetailsSubsectionStatus} setShouldFetch={setShouldFetch} index={title?.split('_')[1] - 1} createMsmeActivityLog={createMsmeActivityLog} /> : <div />}
        {title == 'financial_documents' ? <LeadReviewFinancialDocumentsForm loanDetailsData={loanDetailsData} leadStatusObject={leadStatusObject} loanDetailsSubsectionStatus={loanDetailsSubsectionStatus} setShouldFetch={setShouldFetch} createMsmeActivityLog={createMsmeActivityLog} /> : <div />}
      </div>
    );
  };

  const formattedData = () => {
    let leadReviewData = leadData;
    let tempReviewData = deepCopy(leadReviewData);
    const statusCheck = {};
    let tempData = {};
    const bottomComponents = {};

    for (let lead in tempReviewData) {
      if (tempReviewData[lead].status) {
        statusCheck[lead] = tempReviewData[lead].status;
        delete tempReviewData[lead].status;
      }

      tempData[lead] = {};

      if (Object.keys(tempReviewData[lead]).length && lead != 'co-applicant_details' && lead != 'guarantor_details') {
        bottomComponents[lead] = bottomComponent(lead);
      }
    }

    var coapplicant_details = tempReviewData['co-applicant_details'] ? Object.keys(tempReviewData['co-applicant_details']) : [];
    var guarantor_details = tempReviewData['guarantor_details'] ? Object.keys(tempReviewData['guarantor_details']) : [];

    for (let coapplicant of coapplicant_details) {
      if (Object.keys(tempReviewData['co-applicant_details'][coapplicant]).length) {
        tempData['co-applicant_details'][coapplicant] = {};
        bottomComponents[coapplicant] = bottomComponent(coapplicant);
      }
    }

    for (let guarantor of guarantor_details) {
      if (Object.keys(tempReviewData['guarantor_details'][guarantor]).length) {
        tempData['guarantor_details'][guarantor] = {};
        bottomComponents[guarantor] = bottomComponent(guarantor);
      }
    }

    let data = convertDataIntoAccordionData(tempData, null, null, ['validation_checklist'], {}, {}, bottomComponents, [...coapplicant_details, ...guarantor_details]);

    setAccordionData(data);
  };

  return (
    <div>
      <CustomAccordion accordionData={accordionData} customRightComponentContainer={{ marginTop: '20px' }} />
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
    },
  };
};

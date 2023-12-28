import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { loanCreationJsonFields } from "../loanCreation/loanCreationJson";
import { CustomAccordion, DocumentsList, Tooltip } from "../../../components/msme.component";
import useDimensions from "hooks/useDimensions";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getBorrowerDetailsByIdWatcher } from "../../../../actions/borrowerInfo";
import Preloader from "../../../../components/custom/preLoader";
import TabButton from "react-sdk/dist/components/TabButton";
import SanctionLenderLead from "../../leads/sanctionAndLender/sanctionLenderLead.view";
import { Natch } from "msme/views/msme.view";
import Validation from "../../../../views/lending/manage/validation";
import { AlertBox } from "../../../../components/CustomAlertbox";
import { getMsmeLeadReviewDetailsWatcher } from 'msme/actions/lead.action';
import { storedList } from 'util/localstorage';
import { convertDataIntoAccordionData } from 'util/msme/helper';
import StatusIcon from 'msme/components/StatusIcon/StatusIcon';
import { deepCopy } from 'util/msme/helper';
import Button from 'react-sdk/dist/components/Button';
import { LeadStatus } from 'msme/config/LeadStatus';
import { AuditLog } from 'msme/components/AuditLog/AuditLog';
import { getMsmeActivityLogsWatcher } from 'msme/actions/lead.action';
import { getMsmeLoanDocumentsWatcher } from 'msme/actions/bookLoan.action';
import {docSectionCode} from 'msme/config/docSectionCode';
import {documentCode as documentCodeList} from 'msme/config/docCode'
import CamsSection from '../loanCreation/camsSection';
import { checkAccessTags } from 'util/uam';
import { toOrdinalCounting } from 'util/msme/helper';

const user = { _id: storedList('user')?._id, id: storedList('user')?.id };
const User = storedList('user');

export default function loanDetailsAccordion(props) {
    const { innerWidth, innerHeight } = useDimensions();
    const isLoading = useSelector((state) => state.profile.loading);
    const styles = useStyles({ innerWidth, innerHeight });
    const { loan_id, company_id, product_id } = useParams();
    const [loanData, setLoanData] = useState(null);
    const dispatch = useDispatch();
    const paramsData = useLocation().search.split("=").slice(-1);
    const selectedTab = decodeURIComponent(paramsData);
    const [validationData, setValidationData] = useState({});
    const [loanDetailsData, setLoanDetailsData] = useState(null);
    const [leadDetailData, setLeadDetailData] = useState({});
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [sectionRemarks, setSectionRemarks] = useState({});
    const [validationRemarks, setValidationRemarks] = useState({});
    const [disableApproveBtn, setDisableApproveBtn] = useState('false');
    const [accordionData, setAccordionData] = useState([]);
    const [leadStatus, setLeadStatus] = useState('');
    const [auditLogs, setAuditLogs] = useState([]);
    const [loanDocuments, setLoanDocuments] = useState([]);

    const tabsAvailable = checkAccessTags(['tag_msme_lead_view_int_read']) || checkAccessTags(['tag_msme_lead_view_int_read_write'])? [
        "Lead Details",
        "Documents",
        "Cams",
        "Loan Details",
        "SL & LBA",
        "NACH",
    ]:[
        "Loan Details",
        "SL & LBA",
        "NACH"
    ];
    const [leadDetailSection, setLeadDetailSection] = useState(
        tabsAvailable.includes(selectedTab)
            ? selectedTab.toLowerCase()
            : tabsAvailable[0].toLowerCase()
    );
    const params = useParams();
    const history = useHistory();

    const objectsNotRequired = ["bene_confirm_bank_acc_no","borro_confirm_bank_acc_no"]
    const newArray = loanCreationJsonFields.filter(obj => !objectsNotRequired.includes(obj.field));
    const groupedData = newArray.reduce((result, item) => {
        if (!result[item.dept]) {
            result[item.dept] = [];
        }
        result[item.dept].push({
            title: item.title,
            type: item.type,
            field: item.field,
            isOptional: item.isOptional,
            validationmsg: item.validationmsg,
        });
        return result;
    }, {});

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
            const bankStatementDoc = DocListFinancialSection.filter((item)=>item.code === documentCodeList.msme_bank_statement)
            if(bankStatementDoc.length){
              DocListFinancialSection = DocListFinancialSection.filter((item)=>item.code !== documentCodeList.msme_bank_statement)
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
      const payload = {
        loanAppID: loanDetailsData.loan_app_id,
        companyId: company_id,
        productId: product_id,
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
      const payload = {
        loanAppId: loanDetailsData.loan_app_id,
        companyId: company_id,
        productId: product_id,
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

    const fetchLoandetails = () => {
        const params = {
            company_id: company_id,
            product_id: product_id,
            loan_id: loan_id,
        };
        dispatch(
            getBorrowerDetailsByIdWatcher(
                params,
                result => {
                    let loanData = result.data;
                    loanData['processing_fees_amt'] = parseFloat(loanData['processing_fees_amt']) + parseFloat(loanData['gst_on_pf_amt'] ?? 0)
                    delete loanData.gst_on_pf_amt
                    setValidationData({ ...result.data, "loanStatus": loanData.status })
                    setLoanDetailsData({...result.data});
                    setLoanData(Object.keys(groupedData).map((dept) => {
                        return {
                            title: dept === "Enter Bank Beneficiary Details" ? "Bank Beneficiary Details" : dept === "Enter Borrower Bank Details" ? "Borrower Bank Details" : dept,
                            data: groupedData[dept].map((item) => ({
                                head: <span style={styles["accordionHeader"]}>{item.title.toUpperCase()}</span>,
                                body: <span style={styles["accordionBody"]}>{ item?.field === "loan_amt" ?  (loanData["sanction_amount"]  ? loanData["sanction_amount"] : "N/A") : (loanData[item?.field] ? loanData[item?.field] : "N/A")} </span>,
                            })),
                        };
                    }))
                },
                error => {
                    //   return showAlert(error.response.data.message, "error");
                }
            )
        );
    };

    const formatAccordHeader = (label) => <span style={styles['accordionHeader']}>{label.toUpperCase()}</span>;
    const formatAccordBody = (value) => <span style={styles['accordionBody']}>{typeof value === 'string' && value.trim() ? value : 'N/A'}</span>;
    const formatValidationChecklistStatus = (value, remarks) => (
        <React.Fragment>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '105px' }}>
            <StatusIcon status={value.toLowerCase()} />
            {value == 'in_review' || value == 'rejected' ? <Tooltip content={remarks ? remarks : ''} /> : <div style={{ width: '21px', height: '18px', backgroundColor: 'transparent' }} />}
          </div>
        </React.Fragment>
      );

    const fetchLeadDetails = () => {
        const payload = {
          loanAppId: loanDetailsData.loan_app_id,
          companyId: company_id,
          productId: product_id,
          user: user,
        };
    
        new Promise((resolve, reject) => {
          dispatch(getMsmeLeadReviewDetailsWatcher(payload, resolve, reject));
        })
          .then((response) => {
              delete response.company_id;
              delete response.product_id;
              setLeadStatus(response.lead_status);
              delete response.lead_status;
              setLeadDetailData(response);
          })
          .catch((error) => {
            showAlert(error?.response?.data?.message, 'error');
          });
      };

      const formatStatus = (value) => <StatusIcon status={value.toLowerCase()} />;

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
    

    useEffect(() => {
        fetchLoandetails();
    }, []);

    useEffect(()=>{
        if(loanDetailsData && loanDetailsData.loan_app_id){
            fetchLeadDetails();
            fetchActivityLogs();
            getLoanDocuments();
        }
    }, [loanDetailsData])

    useEffect(() => {
        if (Object.keys(leadDetailData).length != 0) {
          formattedData(leadDetailData);
        }
      }, [leadDetailData]);

    const handleNavigate = (navState) => {
        history.replace(`/admin/msme/loan_details/${loan_id}/${company_id}/${product_id}?tab=${navState}`);
    };

    const onValidationError = message => {
        showAlert(message, "error");
    };

    const onValidationSuccess = message => {
        showAlert(message, "success");
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
        setSeverity("");
        setAlertMessage("");
    };

    return (
        <div style={{ margin: "24px 0px 24px 24px" }}>
            {alert ? (
                <AlertBox
                    severity={severity}
                    msg={alertMessage}
                    onClose={handleAlertClose}
                />
            ) : null}
            {tabsAvailable.map((navMenu, index) => {
                return (
                    <TabButton
                        label={navMenu}
                        isDisabled={false}
                        key={index}
                        onClick={() => handleNavigate(navMenu)}
                        selected={
                            navMenu.toLowerCase() === leadDetailSection.toLowerCase()
                        }
                        setSelectedOption={setLeadDetailSection}
                    />
                );
            })}
          <div
            style={{
              display: leadDetailSection === 'lead details' ? 'flex' : null,
              flexDirection: leadDetailSection === 'lead details' ? 'row' : null,
            }}
          >
            {leadDetailSection === "lead details" && <CustomAccordion accordionData={accordionData} customRightComponentContainer={{ marginTop: '20px' }} />}
            {leadDetailSection === "lead details" && <AuditLog data={auditLogs} />}
            {leadDetailSection === "documents" && <DocumentsList loanDocuments={loanDocuments} companyId={company_id} productId={product_id} loanAppId={loanDetailsData?.loan_app_id} fetchLoanDocuments={getLoanDocuments} isEdit={false} />}
            {leadDetailSection === "cams" && <CamsSection leadStatus={leadStatus} companyId={company_id} productId={product_id} loanAppId={loanDetailsData?.loan_app_id} />}
            {leadDetailSection === "loan details" &&
                <div>
                    <div style={{ marginRight: "30px" }}>
                        <Validation
                            data={validationData}
                            onError={onValidationError}
                            onSuccess={onValidationSuccess}
                            lmsVersion={"origin_lms"}
                            isMsme={true}
                        />
                    </div>
                    <CustomAccordion accordionData={loanData} />
                </div>
            }
            {leadDetailSection === "sl & lba" && <SanctionLenderLead />}
            {leadDetailSection === "nach" && <Natch />}
        </div>
            {isLoading && <Preloader />}
        </div>
    )
}

const useStyles = ({ innerWidth, innerHeight }) => {
    return {
        accordionHeader: {
            fontFamily: "Montserrat-Regular",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "17px",
            letterSpacing: "0em",
            textAlign: "left",
            color: "#6B6F80",
        },
        accordionBody: {
            fontFamily: "Montserrat-Medium",
            fontSize: "16px",
            lineHeight: "17px",
            letterSpacing: "0em",
            textAlign: "left",
            color: "#151515",
        }
    };
};



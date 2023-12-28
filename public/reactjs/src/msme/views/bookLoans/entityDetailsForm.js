import * as React from "react";
import { bookLoansFormJsonFields } from "./bookLoansFormJson";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storedList } from "../../../util/localstorage";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button";
import "react-sdk/dist/styles/_fonts.scss"
//import BasicFilter from "../../../components/Filter/basicFilter";
import BasicDatePicker from "../../../components/DatePicker/basicDatePicker";
import { verifyDateAfter1800 } from "../../../util/helper";
import { validateData } from "../../../util/validation";
import { entityType } from "msme/config/entityType";
import Alert from "react-sdk/dist/components/Alert/Alert";
import UploadFileInput from "../../components/uploadFileInput/UploadFileInput";
import { SectionData } from "msme/config/sectionData";
import getSectionStatus from "./GetLeadSectionStatus/GetLeadSectionStatus";
import getSubSectionRemarks from "./GetLeadSectionStatus/GetLeadSubSectionRemarks"
import moment from "moment";
import { LeadNewStatus } from '../../config/LeadStatus';
import { getBookLoanDetailsWatcher, getMsmeLoanDocumentsWatcher } from 'msme/actions/bookLoan.action';

import {
    getStatesData,
    getPincodeData,
    States,
    Cities
} from "../../../constants/country-state-city-data";
import { patchMsmeDetailsWatcher, putMsmeDraftSaverWatcher } from "../../actions/msme.action";
import { getGstStatusIDWatcher } from "./../../actions/bookLoan.action";

import {
    GSTIN,
    Shop_Establishment_Certificate,
    Entity_KYC_Partnership_Upload,
    Entity_KYC_Authority_Letter_Upload,
    URC_Certificate,
} from "./uploadKycData";

import './bookLoans.style.css'
import { NamedTimeZoneImpl } from "@fullcalendar/core";
import { getLeadStatusWatcher } from "../../actions/lead.action";

const user = { _id: storedList('user')?._id, id: storedList('user')?.id };
const sectionName = "entity-details";
let interval;
import { getMsmeSubmissionStatusWatcher } from "../../actions/msme.action"
const BOOK_LOAN_FORM_JSON = bookLoansFormJsonFields();

const fetchObjectFieldsByDept = (deptName) => {
    const matchingObjects = [];
    for (let object of BOOK_LOAN_FORM_JSON) {
        if (object.dept === deptName) {
            matchingObjects.push(object.field);
        }
    }
    return matchingObjects; // Return the array of matching objects
};

const disabledFields = {
    view: [
        ...fetchObjectFieldsByDept("Entity Details"),
        ...fetchObjectFieldsByDept("Entity Details 1"),
        ...fetchObjectFieldsByDept("Communication Address"),
        ...fetchObjectFieldsByDept("Registered Address"),
        ...fetchObjectFieldsByDept("Entity-KYC pvtLtd"),
        ...fetchObjectFieldsByDept('Entity-KYC pvtLtd URC'),
        ...fetchObjectFieldsByDept("Entity-KYC partnership verify"),
        ...fetchObjectFieldsByDept("Entity-KYC partnership upload"),
        ...fetchObjectFieldsByDept("Entity-KYC Authority Letter upload"),
        ...fetchObjectFieldsByDept("Entity-KYC proprietor verify"),
    ],
    edit: [],
};


export default function EntityDetailsForm(props) {


    const dispatch = useDispatch();
    const useAsyncState = initialState => {
        const [state, setState] = useState(initialState);

        const asyncSetState = value => {
            return new Promise(resolve => {
                setState(value);

                setState(current => {
                    resolve(current);

                    return current;
                });
            });
        };

        return [state, asyncSetState];
    };

    const { setNavState, setNavIconPrefixState, loanAppId, entityData, setEntityData, navIconPrefixState, MSMECompanyId, MSMEProductId, leadStatus,setLeadStatus,setShowShareHolding,documents,setShouldFetch } = props;
    const store = useSelector((state) => state);
    const [statusObject, setStatusObject] = useState('')
    const [stateData, setStateData] = useState(entityData ?? {});
    const [validationData, setValidationData] = useState({});
    const [selectedFileType, setSelectedFileType] = useState('GSTIN');
    const [selectedEntityType, setSelectedEntityType] = useState(entityData ? entityData[`string_vl_select_entity_type`] : null);
    const [viewRegAddress, setViewRegAddress] = useState(true);
    const [newFile, setNewFile] = useState("");
    const [validForm, setValidForm] = useState(false);
    const [states, setStatesState] = useState(States);
    const [commCity, setCommCityState] = useState([]);
    const [regCity, setRegCityState] = useState([]);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [showDocuments, setShowDocuments] = useState(false)
    const [isFormDisabled, setIsFormDisabled] = useState(false)
    const [urcBorder, setUrcBorder] = useState("border: 1px solid #BBBFCC");
    const [gstBorder, setGstBorder] = useState("border: 1px solid #BBBFCC");
    const [isUrcVerified, setIsUrcVerified] = useState(false);
    const [isPanVerified, setIsPanVerified] = useState(false);
    const [urcButtonState, setUrcButtonState] = useState("button");
    const [cinBorder, setCinBorder] = useState("border: 1px solid #BBBFCC");
    const [isCinVerified, setIsCinVerified] = useState(false);
    const [cinButtonState, setCinButtonState] = useState("button");
    const [gstButtonState, setGstButtonState] = useState("button");
    const [disableDraftButton, setDisableDraftButton] = useState(false);
    const [base64String, setBase64String] = useState('');
    const [gstCertificateFileName, setGstCertificateFileName] = useState('');
    const [gstVerify, setGstVerify] = useState();
    const [sectionStatusCheck, setSectionStatusCheck] = useState("");
    const [isLeadRejected,setIsLeadRejected] = useState(false);
    const sectionStatus = ["deviation", "approved", "rejected", "failed"]
    const [documentStateData, setDocumentStateData] = useState({
        gst_certificate_value: false,
        udhyam_certificalte_value: false,
        entity_kyc_partnerShip_moa: false,
        entity_kyc_partnerShip_aoa: false,
        entity_kyc_partnerShip_by_laws: false,
        entity_kyc_partnerShip_llom: false,
        entity_kyc_partnerShip_rc: false,
        entity_kyc_partnerShip_al: false,
        entity_kyc_partnerShip_als: false,
        urc_certificate_value: false,
    });
    const [panButtonState, setPanButtonState] = useState("button");
    const [backgroundColorBlur, setBackgroundColorBlur] = useState(true);
    const [panBorder, setPanBorder] = useState("border: 1px solid #BBBFCC");
    const [showGstinSection, setShowGstinSection] = useState(false);
    let intervalId;

    useEffect(() => {
        if ((props.type == "edit" || props.type == "view") && entityData) {
            handleEditView();
        }
    }, [props.type, entityData,props.loanDetailsSubsectionStatus]);

    const handleEditView= async()=>{
        setStateData(entityData);
        setViewRegAddress(entityData.address_same ? false : true);
        if(props.loanDetailsSubsectionStatus && props.loanDetailsSubsectionStatus[200]){
            const sectionStatus= props.loanDetailsSubsectionStatus[200]
            if(sectionStatus['entity_udyam']=="approved" || sectionStatus['entity_udyam']=="deviation"){
                setIsUrcVerified(true);
                setUrcButtonState("icon")
                setUrcBorder("1px solid green");
                if (entityData && entityData.udyam_vintage_flag && entityData.udyam_vintage_flag !== "approved") {
                    setShowGstinSection(true);
                }
            }
            if (sectionStatus['entity_pan'] == "approved" || sectionStatus['entity_pan'] == "deviation") {
                setIsPanVerified(true);
                setPanButtonState("icon")
                setPanBorder("1px solid green");
            }
            if(sectionStatus["entity_gst"]=="approved" || sectionStatus["entity_gst"]=="deviation"){
                setGstBorder("1px solid green");
                showAlert("GSTIN Verified Successfully", "success");
                setGstButtonState("icon");
            }
        }
        if(props.loanDetailsStatus &&  props.loanDetailsStatus['entity']=="rejected"){
            setIsLeadRejected(true);
        }
    }

    const inputBoxCss = {
        marginTop: "8px",
        maxHeight: "500px",
        zIndex: 1,
        //padding: "0px 16px",
        width: "105%"
    }
    const fileInputRef = useRef(null);
    const headingCss = {
        color: "var(--neutrals-neutral-100, #161719)",
        fontFamily: "Montserrat-semibold",
        fontSize: "24px",
        fontWeight: 700,
        lineHeight: "150%",
        marginBottom: "24px",
        marginTop: "44px"
    }
    const inputBoxDropdownCss = {
        marginTop: "8px",
        maxHeight: "500px",
        width: "485px",
        zIndex: 1,
        padding: "0px 5px"
    }
    const radioCss = {
        color: "var(--neutrals-neutral-100, #161719)",
        fontFamily: "Montserrat-Regular",
        fontSize: "16px",
        fontWeight: "500",
        lineHeight: "20px"
    }
    const radioInputCss = {
        accentColor: '#134CDE',
        marginRight: "8px",
        marginBottom: "4px",
        height: "20px",
        width: "20px",
        verticalAlign: "middle"
    }
    const customSubHeaderStyle = {
        fontFamily: "Montserrat-SemiBold",
        marginLeft: "2%",
        color: "#161719",
        fontSize: "1.2vw",
        marginRight: "1%"
    }
    const getLoanData = (stage = "urc") => {
        if (loanAppId && MSMECompanyId && MSMEProductId) {
            const payload = {
                loan_app_id: loanAppId,
                companyId: MSMECompanyId,
                productId: MSMEProductId,
                user: user,
            };
            new Promise((resolve, reject) => {
                dispatch(getBookLoanDetailsWatcher(payload, resolve, reject));
            })
            .then((response) => {
                setLeadStatus(response?.lead_status);
                let entityDetails = response?.entity_details || {};
                if (stage === "urc") {
                    if (entityDetails && entityDetails.udyam_vintage_flag && entityDetails.udyam_vintage_flag !== "approved") {
                        setShowGstinSection(true);
                    }
                    if(entityDetails && entityDetails.udyam_vintage_flag){
                        setStateData({...stateData,udyam_vintage_flag:entityDetails.udyam_vintage_flag})
                    }
                }
                else if (stage === "gst") {
                    if (entityDetails && entityDetails.gst_vintage_flag && entityDetails.gst_vintage_flag !== "approved") {
                        setSelectedFileType("Shop Establishment Certificate");
                    }
                    if(entityDetails && entityDetails.gst_vintage_flag){
                        setStateData({...stateData,gst_vintage_flag:entityDetails.gst_vintage_flag})
                    }
                }
                
            }).catch((e) => {
                showAlert("Something went Wrong", "error")
            })
        }
    }
    const showAlert = (msg, type) => {
        const element = document.getElementById('TopNavBar');

        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        }

        setAlert(true);
        setSeverity(type);
        setAlertMessage(msg);

        setTimeout(() => {
            handleAlertClose();
        }, 3000);
    };
    const handleGetCommCities = async (value, name) => {
        setCommCityState(Cities(value));
    };
    const handleGetRegCities = async (value, name) => {
        setRegCityState(Cities(value));
    };
    const change = (e, type, name) => {
        // debugger;
        const buttonText = e.target?.textContent;
        const valued = buttonText;
        if (valued === "Verify") {
            if (name === "entity_kyc_proprietor_urc" || name === "entity_kyc_pvtLtd_urc") urcVerify(name, type);
            if (name === "entity_kyc_pvtLtd_cin_llpin") cinVerify(name, type);
            if (name === "gstin_value") gstValueVerify(name, type);
            if (name === "entity_kyc_pvtLtd_pan") verifyPan(name, type);
            if (name === "entity_kyc_partnerShip_pan") verifyPan(name, type);
        } else {
            let values = e.value;
            if (name === "entity_kyc_pvtLtd_pan" || name === "entity_kyc_partnerShip_pan") {
                values = e.value.toUpperCase();
                if (values?.length >= 10) {
                    values = values.substring(0, 10);
                }
            } else if (name === "comm_addr_pincode" || name === "reg_addr_pincode") {
                values = e.value;
                if (values?.length >= 6) {
                    values = values.substring(0, 6);
                }
            } else if (name === "comm_addr_ln1" || name === "reg_addr_ln1") {
                values = e.value;
                if (values?.length >= 40) {
                  values = values.substring(0, 40);
                }
              }
            const value = values;

            let field = `${type}_vl_${name}`;

            let isValid = validateData(
                field.substring(0, field.indexOf("_vl_")).toLowerCase(),
                value
            );

            if (field.indexOf('comm') != -1 && !viewRegAddress) {
                const perField = field.replace('comm', 'reg');
                let isValidData = validateData(
                    perField.substring(0, perField.indexOf("_vl_")).toLowerCase(),
                    value
                );
                setStateData(prevState => ({
                    ...prevState,
                    [perField]: value
                }));
                setValidationData(prevState => ({
                    ...prevState,
                    [`${perField}State`]: !isValidData ? "has-danger" : ""
                }));

            }
            if (field === "string_vl_per_addr_ln1") {
                if (value.length <= 4) {
                    isValid = false;
                }
            }
            setStateData(prevState => ({
                ...prevState,
                [field]: value
            }));

            setValidationData(prevState => ({
                ...prevState,
                [`${field}State`]: !isValid ? "has-danger" : ""
            }));

        }
    };
    useEffect(() => {
        if (!entityData) {
            setInitialState()
            handleRegisteredAddress(true);
        }
        setStateData(prevState => ({
            ...prevState,
            "string_vl_select_entity_type": selectedEntityType
        }));
        if (selectedEntityType && (selectedEntityType !== 'Proprietor' && selectedEntityType !== "OPC")) {
            setShowShareHolding(true);
        } else {
            setShowShareHolding(false);
        }

    }, [selectedEntityType])
    const commonFieldValidation = (forceCall = false) => {
        if (selectedEntityType) {
            let vlForm = 1;
            let vlDocument = 0
            bookLoansFormJsonFields().map((item, idx) => {
                if (item.dept == "Entity Details" ||
                    item.dept == "Communication Address" ||
                    item.dept == "Registered Address") {
                    if (item.isOptional == false) {
                        if (!stateData[`${item.type}_vl_${item.field}`]) {
                            vlForm = 0;
                            if (forceCall) {

                                setValidationData(prevState => ({
                                    ...prevState,
                                    [`${item.type}_vl_${item.field}State`]: "has-danger"
                                }));
                            }
                        }

                    }
                }

            })
            if (forceCall) return vlForm
            if (selectedEntityType === "Proprietor" && urcButtonState === "icon") {
                if (showGstinSection) {
                    if (selectedFileType === "Shop Establishment Certificate" && documentStateData.udhyam_certificalte_value) {
                        vlDocument = 1
                    }
                    if (stateData.gst_vintage_flag==="approved" && selectedFileType === "GSTIN" && documentStateData.gst_certificate_value && gstButtonState === "icon") {
                        vlDocument = 1
                    }
                } else {
                    vlDocument = 1
                }
               
            }
            if ((selectedEntityType == "Society" || selectedEntityType == "Trust") && panButtonState === "icon" && (documentStateData.entity_kyc_partnerShip_moa && documentStateData.entity_kyc_partnerShip_aoa && documentStateData.entity_kyc_partnerShip_by_laws && documentStateData.entity_kyc_partnerShip_llom && documentStateData.entity_kyc_partnerShip_rc && documentStateData.entity_kyc_partnerShip_al)) {
                vlDocument = 1
            }
            if (selectedEntityType == "partnership" && panButtonState === "icon" && documentStateData.entity_kyc_partnerShip_als) {
                vlDocument = 1
            }

            if (
                (selectedEntityType == "Public Limited" ||
                    selectedEntityType == "Private Limited" ||
                    selectedEntityType == "LLP" ||
                    selectedEntityType == "OPC") &&
                panButtonState === "icon" &&
                urcButtonState === "icon" &&
                cinButtonState === "icon") {
                    if (showGstinSection) {
                        if (selectedFileType === "Shop Establishment Certificate" && documentStateData.udhyam_certificalte_value) {
                            vlDocument = 1
                        }
                        if (selectedFileType === "GSTIN" && documentStateData.gst_certificate_value && gstButtonState === "icon") {
                            vlDocument = 1
                        }
                    } else {
                        vlDocument = 1
                    }

            }
            if (vlForm && vlDocument) {
                setValidForm(true);
            }
            else {
                setValidForm(false);
            }
        }
    }
    useEffect(() => {

        commonFieldValidation(false);
    }, [stateData, gstButtonState, urcButtonState, cinButtonState, documentStateData, panButtonState, showGstinSection])

    const getSubSectionStatus = (loanAppId, stage, sub_section_code, section_sequence_no) => {
        const data = {
            user_id: user._id,
            userId: user._id,
            company_id: MSMECompanyId,
            product_id: MSMEProductId,
            msme_company_id: MSMECompanyId,
            msme_product_id: MSMEProductId,
            loan_app_id: loanAppId,
            codeId: code,
            sequenceId: sequence,
        };
        new Promise((resolve, reject) => {
            dispatch(getMsmeSubmissionStatusWatcher(data, resolve, reject));
        })
            .then((response) => {
                const status_list = ["approved", "deviation", "rejected", "failed"];
                const status = response?.status.toLowerCase();
                if (status_list.includes(status)) clearInterval(interval);
                if (stage === "pan" && section_sequence_no === 200 && sub_section_code === "entity_pan") {
                    if (status == "approved") {
                        showAlert("Pan Verified Successfully", "success")
                        setPanButtonState("icon")
                        setIsPanVerified(true);
                        setPanBorder("1px solid green");
                    }
                    if (status == "deviation") {
                        showAlert(response?.remarks || "Pan deviation", "error")
                        setPanButtonState("button")
                    }
                    if (status == "rejected") {
                        showAlert(response?.remarks || "Pan Rejected", "error")
                        setPanButtonState("button")
                    }
                    if (status == "failed") {
                        showAlert(response?.remarks || "Something went Wrong", "error")
                        setPanButtonState("button")
                    }
                }
                if (stage == "cin" && section_sequence_no === 200 && sub_section_code === "entity_cin") {
                    if (status == "approved") {
                        setIsCinVerified(true);
                        showAlert("CIN Verified Successfully", "success")
                        setCinButtonState("icon")
                        setCinBorder("1px solid green");
                    }
                    if (status == "deviation") {
                        showAlert(response?.remarks || "CIN deviation", "error")
                        setCinButtonState("button")
                    }
                    if (status == "rejected") {
                        showAlert(response?.remarks || "CIN Rejected", "error")
                        setCinButtonState("button")
                    }
                    if (status == "failed") {
                        showAlert(response?.remarks || "Something went Wrong", "error")
                        setCinButtonState("button")
                    }
                }
                if (stage === "urc" && section_sequence_no === 200 && sub_section_code === "entity_udyam") {
                    if (status == "approved") {
                        setIsUrcVerified(true);
                        getLoanData();
                        showAlert("URC Number Verified Successfully", "success")
                        setUrcButtonState("icon")
                        setUrcBorder("1px solid green");
                    }
                    if (status == "deviation") {
                        showAlert(response?.remarks || "URC deviation", "error")
                        setUrcButtonState("button")
                    }
                    if (status == "rejected") {
                        showAlert(response?.remarks || "URC Rejected", "error")
                        setUrcButtonState("button")
                    }
                    if (status == "failed") {
                        showAlert(response?.remarks || "Something went Wrong", "error")
                        setUrcButtonState("button")
                    }
                }
                if (stage === "gst" && section_sequence_no === 200 && sub_section_code === "entity_gst") {
                    if (status == "approved") {
                        setGstBorder("1px solid green");
                        showAlert("GSTIN Verified Successfully", "success");
                        setGstButtonState("icon")
                    }
                    if (status == "deviation") {
                        showAlert(response?.remarks || "GST deviation", "error")
                        setGstButtonState("button")
                    }
                    if (status == "rejected") {
                        showAlert(response?.remarks || "GST Rejected", "error")
                        setGstButtonState("button")
                    }
                    if (status == "failed") {
                        showAlert(response?.remarks || "Something went Wrong", "error")
                        setGstButtonState("button")
                    }
                }
            })
            .catch((error) => {
                if (stage === "urc") setUrcButtonState("button");
                if (stage == "cin") setCinButtonState("button");
                if (stage === "pan") setPanButtonState("button");
                if (stage === "gst") setGstButtonState("button");
                showAlert(error?.response?.data?.message ?? error?.message ?? "error while saving draft", "error");
            });
    };

    const scheduleStatusApi = (loanAppId, stage, sub_section_code, section_sequence_no) => {
        interval = setInterval(() => {
            getSubSectionStatus(loanAppId, stage, sub_section_code, section_sequence_no);
        }, 3000);
    }

    const gstStatusCheck = async (payload, stage) => {
        const checkData = {
            user_id: user._id,
            company_id: MSMECompanyId,
            msme_company_id: MSMECompanyId,
            product_id: MSMEProductId,
            msme_product_id: MSMEProductId,
            loan_app_id: loanAppId,
            "loan_app_id": loanAppId,
            "entity_name": stateData[`string_vl_entity_name_value`] ?? " ",
            "com_city": stateData[`string_vl_comm_addr_city`] ?? " ",
            "com_state": stateData[`string_vl_comm_addr_state`] ?? " ",
            "com_pincode": stateData[`pincode_vl_comm_addr_pincode`] ?? " ",
            "res_city": stateData[`string_vl_reg_addr_city`] ?? " ",
            "res_state": stateData[`string_vl_reg_addr_state`] ?? " ",
            "res_pincode": stateData[`pincode_vl_reg_addr_pincode`] ?? " ",
        };
        new Promise((resolve, reject) => {
            dispatch(getGstStatusIDWatcher(checkData, resolve, reject));
        })
            .then((response) => {
                return response
            })
            .catch((error) => {
                return error
            })
    }

    const setSubStatusCheckApi = async (
        loanAppID,
        sectionCode,
        subSectionCode,
        dispatch
    ) => {
        intervalId = setInterval(async () => {
            try {
                let status = await getSectionStatus(
                    loanAppID,
                    user,
                    MSMECompanyId,
                    MSMEProductId,
                    sectionCode,
                    subSectionCode,
                    dispatch
                );
                let subSectionRemarks = await getSubSectionRemarks(
                    loanAppID,
                    user,
                    MSMECompanyId,
                    MSMEProductId,
                    sectionCode,
                    subSectionCode,
                    dispatch
                )
                const status_list = ["approved", "deviation", "rejected", "failed"];
                status = status.toLowerCase();
                if (status_list.includes(status)) clearInterval(intervalId);
                if (subSectionCode === "entity_pan") {
                    if (status == "approved") {
                        setIsPanVerified(true);
                        showAlert("Pan Verified Successfully", "success");
                        setPanButtonState("icon");
                        setPanBorder("1px solid green");
                    }
                    if (status == "rejected") {
                        showAlert(subSectionRemarks, "error");
                        setPanButtonState("button");
                    }
                    if (status == "failed") {
                        showAlert("Something went Wrong", "error");
                        setPanButtonState("button");
                    }
                }
                if (subSectionCode === "entity_cin") {
                    if (status == "approved") {
                        setIsCinVerified(true);
                        showAlert("CIN Verified Successfully", "success");
                        setCinButtonState("icon");
                        setCinBorder("1px solid green");
                    }
                    if (status == "rejected") {
                        showAlert(subSectionRemarks, "error");
                        setCinButtonState("button");
                    }
                    if (status == "failed") {
                        showAlert("Something went Wrong", "error");
                        setCinButtonState("button");
                    }
                }
                if (subSectionCode === "entity_udyam") {
                    if (status == "approved" || status == "deviation") {
                        setIsUrcVerified(true);
                        getLoanData();
                        showAlert("URC Number Verified Successfully", "success");
                        setUrcButtonState("icon");
                        setUrcBorder("1px solid green");
                    }
                    if (status == "rejected") {
                        showAlert(subSectionRemarks, "error");
                        setUrcButtonState("button");
                    }
                    if (status == "failed") {
                        showAlert("Something went Wrong", "error");
                        setUrcButtonState("button");
                    }
                }
                if (subSectionCode === "entity_gst") {
                    if (status == "approved" || status == "deviation") {
                        setGstBorder("1px solid green");
                        showAlert("GSTIN Verified Successfully", "success");
                        setGstButtonState("icon");
                        getLoanData("gst");
                    }
                    if (status == "rejected") {
                        showAlert(subSectionRemarks, "error");
                        setGstButtonState("button");
                    }
                    if (status == "failed") {
                        showAlert("Something went Wrong", "error");
                        setGstButtonState("button");
                    }
                }
            } catch (error) {
                clearInterval(intervalId);
                if (subSectionCode === "entity_udyam") setUrcButtonState("button");
                if (subSectionCode == "entity_cin") setCinButtonState("button");
                if (subSectionCode === "entity_pan") setPanButtonState("button");
                if (subSectionCode === "entity_gst") setGstButtonState("button");
                showAlert(
                    error?.response?.data?.message ??
                    error?.message ??
                    "Something went wrong, please try again.",
                    "error"
                );
            }
        }, 20000);
    };

    const callValidator = async (payload, stage) => {
        const body = {
            ...payload,
            user_id: user._id,
            company_id: MSMECompanyId,
            product_id: MSMEProductId,
            msme_company_id: MSMECompanyId,
            msme_product_id: MSMEProductId,
            loan_app_id: loanAppId,
            section: "entity-details",
            address_same: viewRegAddress ? 0 : 1,
            loan_app_id: loanAppId,
            entity_type: selectedEntityType,
            entity_name: stateData[`string_vl_entity_name_value`] ?? " ",
            date_of_incorporation: stateData[`date_vl_doi_value`] ?? " ",
            com_addr_ln1: stateData[`string_vl_comm_addr_ln1`] ?? " ",
            com_addr_ln2: stateData[`string_vl_comm_addr_ln2`] ?? " ",
            com_city: stateData[`string_vl_comm_addr_city`] ?? " ",
            com_state: stateData[`string_vl_comm_addr_state`] ?? " ",
            com_pincode: stateData[`pincode_vl_comm_addr_pincode`] ?? " ",
            res_addr_ln1: stateData[`string_vl_reg_addr_ln1`] ?? " ",
            res_addr_ln2: stateData[`string_vl_reg_addr_ln2`] ?? " ",
            res_city: stateData[`string_vl_reg_addr_city`] ?? " ",
            res_state: stateData[`string_vl_reg_addr_state`] ?? " ",
            res_pincode: stateData[`pincode_vl_reg_addr_pincode`] ?? " ",
            gst_certificate: base64String,
            gst_certificate_file_name: gstCertificateFileName,
        };
        new Promise((resolve, reject) => {
            dispatch(patchMsmeDetailsWatcher(body, resolve, reject));
        })
            .then((response) => {
                setSubStatusCheckApi(
                    loanAppId,
                    body.section_code,
                    body.sub_section_code,
                    dispatch
                );
            })
            .catch((error) => {
                if (stage === "urc") setUrcButtonState("button");
                if (stage == "cin") setCinButtonState("button");
                if (stage === "pan") setPanButtonState("button");
                if (stage === "gst") setGstButtonState("button");
                showAlert(
                    error?.response?.data?.message ??
                    error?.message ??
                    "error while saving draft",
                    "error"
                );
            });
    };


    const cinVerify = async (name, type) => {
        if (!stateData[`${type}_vl_${name}`] || stateData[`${type}_vl_${name}`] == "" || stateData[`${type}_vl_${name}`] == null) {
            setValidationData(prevState => ({
                ...prevState,
                [`${type}_vl_${name}State`]: "has-danger"
            }));
            showAlert("Kindly check for errors in fields", "error")
            setTimeout(() => {
                handleAlertClose();
            }, 4000);
            return
        }
        setCinButtonState("loader");
        if (name === "entity_kyc_pvtLtd_cin_llpin") {
            const data = {
                cin_no: stateData[`${type}_vl_${name}`],
                section_code: "entity",
                section_name: "Entity Details",
                sub_section_code: "entity_cin",
                section_sequence_no: 200,
                sub_section_name: "Entity CIN Check",
                sub_section_sequence_no: 4,
            };
            await callValidator(data, "cin");
        } else {
            setCinButtonState("button")
            showAlert("CIN not verified please try again", "error")
            setTimeout(() => {
                handleAlertClose();
            }, 4000);
            setCinBorder("1px solid red");
        }
        if (cinButtonState == "loader") {
            setCinButtonState("button")
        }
    }

    const urcVerify = async (name, type) => {
        let valid = commonFieldValidation(true);
        if (!stateData[`${type}_vl_${name}`] || stateData[`${type}_vl_${name}`] == "" || stateData[`${type}_vl_${name}`] == null) {
            setValidationData(prevState => ({
                ...prevState,
                [`${type}_vl_${name}State`]: "has-danger"
            }));
            showAlert("Kindly check for errors in fields", "error")
            setTimeout(() => {
                handleAlertClose();
            }, 4000);
            return
        }
        if (!valid) {
            showAlert("Kindly check for errors in fields", "error")
            setTimeout(() => {
                handleAlertClose();
            }, 4000);
            return
        }
        setUrcButtonState("loader")
        if (name === "entity_kyc_proprietor_urc" || name === "entity_kyc_pvtLtd_urc") {
            const data = {
                urc_no: stateData[`${type}_vl_${name}`],
                section_code: "entity",
                section_name: "Entity Details",
                sub_section_code: "entity_udyam",
                section_sequence_no: 200,
                sub_section_name: "Entity Udyam Check",
                sub_section_sequence_no: 2,
            };
            await callValidator(data, "urc");
        } else {
            setUrcButtonState("button")
            showAlert("URC not verified please try again", "error")
            setTimeout(() => {
                handleAlertClose();
            }, 4000);
            setUrcBorder("1px solid red");
        }
    }

    const gstValueVerify = async (name, type) => {
        let valid = commonFieldValidation(true);
        if (!valid) {
            showAlert("Kindly check for errors in fields", "error")
            setTimeout(() => {
                handleAlertClose();
            }, 4000);
            return
        }
        setBackgroundColorBlur(false);
        if (!stateData[`${type}_vl_${name}`] || stateData[`${type}_vl_${name}`] == "" || stateData[`${type}_vl_${name}`] == null) {
            setValidationData(prevState => ({
                ...prevState,
                [`${type}_vl_${name}State`]: "has-danger"
            }));
            showAlert("Kindly check for errors in fields", "error")
            setTimeout(() => {
                handleAlertClose();
            }, 4000);
            return
        }
        setGstButtonState("loader")
        if (name === "gstin_value") {
            const data = {
                gst_no: stateData[`${type}_vl_${name}`],
                section_code: "entity",
                section_name: "Entity Details",
                sub_section_code: "entity_gst",
                section_sequence_no: 200,
                sub_section_name: "Entity GST Check",
                sub_section_sequence_no: 3,
            };
            await callValidator(data, "gst");
        } else {
            setGstButtonState("button")
            showAlert("Please provide additional supporting document.Vintage less than 1 year.", "error")
            setTimeout(() => {
                handleAlertClose();
            }, 4000);
            setGstBorder("1px solid red");
        }
    }

    const verifyPan = async (name, type) => {
        let valid = commonFieldValidation(true);
        if (!stateData[`${type}_vl_${name}`] || stateData[`${type}_vl_${name}`] == "" || stateData[`${type}_vl_${name}`] == null) {
            setValidationData(prevState => ({
                ...prevState,
                [`pan_vl_${name}State`]: "has-danger"
            }));
            showAlert("Kindly check for errors in fields", "error")
            setTimeout(() => {
                handleAlertClose();
            }, 4000);
            return
        }
        if (!valid || validationData[`${type}_vl_${name}State`] === "has-danger") {
            showAlert("Kindly check for errors in fields", "error")
            setTimeout(() => {
                handleAlertClose();
            }, 4000);
            return
        }
        setBackgroundColorBlur(false);
        setPanButtonState("loader")
        if (type === "pan") {
            const data = {
                pan_no: stateData[`${type}_vl_${name}`],
                section_code: "entity",
                section_name: "Entity Details",
                sub_section_code: "entity_pan",
                section_sequence_no: 200,
                sub_section_name: "Entity PAN Check",
                sub_section_sequence_no: 1,
            };
            await callValidator(data, "pan");
        } else {
            setPanButtonState("button")
            showAlert("Pan verified please try again", "error")
            setTimeout(() => {
                handleAlertClose();
            }, 4000);
            setPanBorder("1px solid red");
        }
    };

    const dropDownChange = (value, name, type = "") => {
        const buttonText = value.target?.textContent;
        const valued = buttonText;
        if (valued === "Verify") {
            if (name === "entity_kyc_proprietor_urc") urcVerify(name, type);
            if (name === "gstin_value") gstValueVerify(name, type);
        }
        // if(value.ctrlKey===false) setShowDocuments(true);
        else if (name === "gst_certificate_value" ||
            name === "udhyam_certificalte_value" ||
            name === "entity_kyc_partnerShip_moa" ||
            name === "entity_kyc_partnerShip_aoa" ||
            name === "entity_kyc_partnerShip_coi" ||
            name === "entity_kyc_partnerShip_LOD" ||
            name === "entity_kyc_partnerShip_al" ||
            name === "entity_kyc_partnerShip_rc" ||
            name === "entity_kyc_partnerShip_llom" ||
            name === "entity_kyc_partnerShip_by_laws" ||
            name === "entity_kyc_partnerShip_als") {
            fileInputRef.current.click(name);
            setNewFile(name);
        }
        else {
            if (name.indexOf('comm') != -1 && !viewRegAddress) {
                const perField = `string_vl_${name.replace('comm', 'reg')}`;
                let isValidData = validateData(
                    perField.substring(0, perField.indexOf("_vl_")).toLowerCase(),
                    value.value
                );
                setStateData(prevState => ({
                    ...prevState,
                    [perField]: value.value
                }));
                setValidationData(prevState => ({
                    ...prevState,
                    [`${perField}State`]: !isValidData ? "has-danger" : ""
                }));
            }
            setStateData(prevState => ({
                ...prevState,
                [`string_vl_${name}`]: value?.value ?? ""
            }));
            setValidationData(prevState => ({
                ...prevState,
                [`string_vl_${name}State`]: ""
            }));
            if (name == "select_entity_type") {
                setSelectedEntityType(value.key)
            }
            if (name === "reg_addr_state") {
                handleGetRegCities(value, name);
                if (stateData.string_vl_reg_addr_city) {
                    setStateData((prevState) => ({
                        ...prevState,
                        [`string_vl_reg_addr_city`]: "",
                    }));
                }
            }
            if (name === "comm_addr_state") {
                handleGetCommCities(value, name);
                if (stateData.string_vl_comm_addr_city) {
                    setStateData((prevState) => ({
                        ...prevState,
                        [`string_vl_comm_addr_city`]: "",
                    }));
                }
            }
        }
    };
    const changeDateSelected = (value, name) => {
        const date = verifyDateAfter1800(moment(value).format("YYYY-MM-DD"))
            ? moment(value).format("YYYY-MM-DD")
            : value;
        const isValid = validateData(
            name.substring(0, name.indexOf("_vl_")).toLowerCase(),
            date
        );
        setStateData(prevState => ({
            ...prevState,
            [name]: date
        }));
        setValidationData(prevState => ({
            ...prevState,
            [`${name}State`]: !isValid ? "has-danger" : ""
        }));
    };
    const handleAlertClose = () => {
        setAlert(false);
        setSeverity("");
        setAlertMessage("");
    };
    const fetchObjectsByDept = (deptName) => {
        const matchingObjects = [];
        for (const object of bookLoansFormJsonFields()) {
            if (object.dept === deptName) {
                matchingObjects.push(object);
            }
        }

        return matchingObjects; // Return the array of matching objects
    }
    const handleFileInputChange = (field, event, type) => {
        const selectedFile = event.target.files[0].name;
        const stateField = `${type}_vl_${newFile}`
        setStateData((prevState) => ({
            ...prevState,
            [stateField]: selectedFile,
        }))

    };
    const saveDraftFunction = () => {
        setDisableDraftButton(true);
        let data = {
            "section": "entity-details",
            "address_same": viewRegAddress ? 0 : 1,
            "entity_type": selectedEntityType,
            "entity_name": stateData[`string_vl_entity_name_value`] ?? " ",
            "date_of_incorporation": stateData[`date_vl_doi_value`] ?? " ",
            "com_addr_ln1": stateData[`string_vl_comm_addr_ln1`] ?? " ",
            "com_addr_ln2": stateData[`string_vl_comm_addr_ln2`] ?? " ",
            "com_city": stateData[`string_vl_comm_addr_city`] ?? " ",
            "com_state": stateData[`string_vl_comm_addr_state`] ?? " ",
            "com_pincode": stateData[`pincode_vl_comm_addr_pincode`] ?? " ",
            "res_addr_ln1": stateData[`string_vl_reg_addr_ln1`] ?? " ",
            "res_addr_ln2": stateData[`string_vl_reg_addr_ln2`] ?? " ",
            "res_city": stateData[`string_vl_reg_addr_city`] ?? " ",
            "res_state": stateData[`string_vl_reg_addr_state`] ?? " ",
            "res_pincode": stateData[`pincode_vl_reg_addr_pincode`] ?? " ",
            "pan_no": stateData[`pan_vl_${selectedEntityType === "Private Limited" ? "entity_kyc_pvtLtd_pan" : (selectedEntityType === "Partnership" || selectedEntityType == "Society" || selectedEntityType == "Trust") ? "entity_kyc_partnerShip_pan" : " "}`] ?? " ",
            "urc_no": stateData[`string_vl_${selectedEntityType == "Private Limited" ? "entity_kyc_pvtLtd_urc" : selectedEntityType == "Partnership" ? "entity_kyc_partnerShip_urc" : "entity_kyc_proprietor_urc"}`] ?? " ",
            "cin_no": stateData[`string_vl_entity_kyc_pvtLtd_cin_llpin`] ?? " ",
            "gst_no": stateData[`string_vl_gstin_value`] ?? " ",
        }
        
        let bodyObject = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== null && value !== " " && value !== ""));

        const payload =
        {
            loan_app_id: loanAppId,
            tokenData: {
                user_id: user._id,
                company_id: MSMECompanyId,
                msme_company_id: MSMECompanyId,
                product_id: MSMEProductId,
                msme_product_id: MSMEProductId,
                loan_app_id: loanAppId,
            },
            bodyData: bodyObject
        }
        new Promise((resolve, reject) => {
            dispatch(putMsmeDraftSaverWatcher(payload, resolve, reject));
        })
            .then(response => {
                setDisableDraftButton(false);
                showAlert("Draft saved successfully", "success");
            })
            .catch((error) => {
                showAlert(error?.message ?? "error while saving draft", "error");
            });
    }

    useEffect(() => {
        if (!viewRegAddress) {
            bookLoansFormJsonFields().map((item, idx) => {
                if (item.dept == "Registered Address") {
                    let addressField = `${item.type}_vl_${item.field}`
                    setStateData(prevState => ({
                        ...prevState,
                        [addressField]: null
                    }));
                    let field = item.field.replace('reg', 'comm');
                    const value = stateData[`${item.type}_vl_${field}`]
                    if (value) {
                        let perField = `${item.type}_vl_${item.field}`;
                        let isValid = validateData(
                            perField.substring(0, perField.indexOf("_vl_")).toLowerCase(),
                            value
                        );
                        setStateData(prevState => ({
                            ...prevState,
                            [perField]: value
                        }));
                        setValidationData(prevState => ({
                            ...prevState,
                            [`${perField}State`]: !isValid ? "has-danger" : ""
                        }));
                    }
                }
            })
        }
        else {
            if (!entityData) {
                bookLoansFormJsonFields().map((item, idx) => {
                    if (item.dept == "Registered Address") {
                        let field = `${item.type}_vl_${item.field}`;
                        setStateData(prevState => ({
                            ...prevState,
                            [field]: null
                        }));

                    }
                })
            }
        }
    }, [viewRegAddress])

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const base64String = event.target.result.split(',')[1];
                setBase64String(base64String);
                const fileName = selectedFile.name;
                setGstCertificateFileName(fileName);
            };
            reader.readAsDataURL(selectedFile);
        }
    };


    const handleRegisteredAddress = (forceCall = false) => {
        if (forceCall === true) {
            setViewRegAddress(true);
        } else {
            setViewRegAddress(!viewRegAddress);
        }


    }
    const renderFields = (dept) => {
        let deptArray = fetchObjectsByDept(dept)
        return (
            <div style={{ display: 'grid', rowGap: "24px", gridTemplateColumns: "32.8% 32.8% 32.8%", columnGap: "2%", width: "98%" }}>
                {deptArray &&
                    deptArray.map((row, index) => {
                        return (
                            <>
                                {
                                    row.field === "comm_addr_state" ||
                                        row.field === "comm_addr_city" ||
                                        row.field === "reg_addr_state" ||
                                        row.field === "reg_addr_city" ||
                                        row.field === "comm_addr_sub_area" ||
                                        row.field === "reg_addr_sub_area" ||
                                        row.field === "gender" ||
                                        row.field === "select_entity_type" ?
                                        <>
                                            <InputBox
                                                id={row.field}
                                                label={row.title}
                                                options={
                                                    row.field === "select_entity_type" ? entityType
                                                        : row.title === "State" ? states
                                                            : row.field === "comm_addr_city" ? commCity
                                                                : row.field === "reg_addr_city" ? regCity
                                                                    : row.options
                                                }
                                                isDrawdown={(urcButtonState === "icon" || panButtonState === "icon" || (disabledFields[props.type] && disabledFields[props.type].includes(row.field))) ? false : row.dept == "Registered Address" ? row.isDrawdown && !viewRegAddress ? false : row.isDrawdown : true}
                                                initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                                                onClick={value =>
                                                    dropDownChange(value, row.field, row.type)
                                                }
                                                isDisabled={(disabledFields[props.type] && disabledFields[props.type].includes(row.field)) || (!viewRegAddress && row.dept == "Registered Address") ? true : (urcButtonState === "icon" || panButtonState === "icon" || panButtonState === "icon" || cinButtonState === "icon") ? true : false}
                                                customDropdownClass={inputBoxCss}
                                                customClass={{ height: "3.5rem", width: "27.5rem", maxWidth: "100%" }}
                                                customInputClass={{
                                                    minWidth: "100%",
                                                    backgroundColor: "#fff",
                                                    marginTop: !((urcButtonState === "icon" || panButtonState === "icon") ? false : row.dept == "Registered Address" ? row.isDrawdown && !viewRegAddress ? false : row.isDrawdown : true) ? "-3px" : "0px"
                                                }}
                                                error={
                                                    row.checked.toLowerCase() === "true"
                                                        ? validationData[
                                                        `${row.type}_vl_${row.field}State`
                                                        ] === "has-danger"
                                                        : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                        validationData[
                                                        `${row.type}_vl_${row.field}State`
                                                        ] === "has-danger"
                                                }
                                                helperText={
                                                    row.checked.toLowerCase() === "true"
                                                        ? validationData[
                                                            `${row.type}_vl_${row.field}State`
                                                        ] === "has-danger"
                                                            ? row.validationMsg
                                                            : ""
                                                        : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                        (validationData[
                                                            `${row.type}_vl_${row.field}State`
                                                        ] === "has-danger"
                                                            ? row.validationMsg
                                                            : "")
                                                }
                                            // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                                            />
                                        </>
                                        : row.type === "pan" ? (
                                            <>
                                                <InputBox
                                                    isBoxType={panButtonState}
                                                    Buttonlabel={
                                                        navIconPrefixState["Entity Details"] == "success"
                                                            ? ""
                                                            : "Verify"
                                                    }
                                                    id={row.field}
                                                    label={row.title}
                                                    isDrawdown={false}
                                                    // initialValue={""}
                                                    initialValue={(
                                                        stateData[`${row.type}_vl_${row.field}`] ?? ""
                                                    ).toUpperCase()}
                                                    onClick={(event) => change(event, "pan", row.field)}
                                                    // onClick={(event) => change(event, row.type, row.field)}
                                                    // isDisabled={row.field === "age" || isFormDisabled? true : false}
                                                    // onClick={(event) => change(event, row.type, row.field)}
                                                    isDisabled={(disabledFields[props.type] && disabledFields[props.type].includes(row.field))}
                                                    customDropdownClass={inputBoxCss}
                                                    customClass={{
                                                        height: "56px",
                                                        width: "100%",
                                                        maxWidth: "100%",
                                                        border: panBorder,
                                                        pointerEvents: panButtonState === "icon" ? "none" : "",
                                                    }}
                                                    customInputClass={{
                                                        marginTop:
                                                            (props.type != "edit" &&
                                                                loanAppId &&
                                                                row.field != "aadhaar_value") ||
                                                                row.field === "age" ||
                                                                (row.dept == "Permanent Address" &&
                                                                    !viewPerAddress) ||
                                                                isFormDisabled
                                                                ? "-3px"
                                                                : "0px",
                                                        maxWidth: "82%",
                                                        backgroundColor: "#fff",
                                                    }}
                                                    error={
                                                        row.checked.toLowerCase() === "true"
                                                            ? validationData[
                                                            `${row.type}_vl_${row.field}State`
                                                            ] === "has-danger"
                                                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                            validationData[
                                                            `${row.type}_vl_${row.field}State`
                                                            ] === "has-danger"
                                                    }
                                                    helperText={
                                                        row.checked.toLowerCase() === "true"
                                                            ? validationData[
                                                                `${row.type}_vl_${row.field}State`
                                                            ] === "has-danger"
                                                                ? row.validationMsg
                                                                : ""
                                                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                            (validationData[
                                                                `${row.type}_vl_${row.field}State`
                                                            ] === "has-danger"
                                                                ? row.validationMsg
                                                                : "")
                                                    }
                                                // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                                                />
                                            </>
                                        ) :
                                            row.field === "entity_kyc_proprietor_urc" ||
                                                row.field === "entity_kyc_pvtLtd_urc" ?
                                                <>
                                                    <InputBox
                                                        isBoxType={urcButtonState}
                                                        Buttonlabel={navIconPrefixState['Entity Details'] == "success" ? "" : "Verify"}
                                                        id={row.field}
                                                        label={row.title}
                                                        isDrawdown={false}
                                                        // initialValue={""}
                                                        initialValue={stateData[`${row.type}_vl_${row.field}`]}
                                                        onClick={(event) => change(event, row.type, row.field)}
                                                        // onClick={(event) => change(event, row.type, row.field)}
                                                        // isDisabled={row.field === "age" || isFormDisabled? true : false}
                                                        // onClick={(event) => change(event, row.type, row.field)}
                                                        isDisabled={
                                                            (disabledFields[props.type] && disabledFields[props.type].includes(row.field)) || 
                                                            (row.field === "age") || 
                                                            (!viewRegAddress && row.dept == "Registered Address") ||
                                                            ((selectedEntityType == "Public Limited" || selectedEntityType == "Private Limited" || selectedEntityType == "LLP" || selectedEntityType == "OPC") && (cinButtonState !== "icon")) || 
                                                            ((selectedEntityType == "Public Limited" || selectedEntityType == "Private Limited" || selectedEntityType == "LLP" || selectedEntityType == "OPC") && !documentStateData.urc_certificate_value) || 
                                                            (selectedEntityType === "Proprietor" && !documentStateData.urc_certificate_value) ? true : false
                                                        }
                                                        customDropdownClass={inputBoxCss}
                                                        customClass={{
                                                            height: "56px",
                                                            width: "100%",
                                                            maxWidth: "100%",
                                                            border: urcBorder,
                                                            pointerEvents: urcButtonState === "icon" ? "none" : ""
                                                        }}
                                                        customInputClass={{
                                                            marginTop: ((loanAppId && row.field != "aadhaar_value") || (row.field === "age") || ((row.dept == "Permanent Address" && !viewPerAddress) || isFormDisabled)) ? "-3px" : "0px",
                                                            maxWidth: "82%",
                                                            backgroundColor: "#fff",
                                                        }}
                                                        error={
                                                            row.checked.toLowerCase() === "true"
                                                                ? validationData[
                                                                `${row.type}_vl_${row.field}State`
                                                                ] === "has-danger"
                                                                : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                                validationData[
                                                                `${row.type}_vl_${row.field}State`
                                                                ] === "has-danger"
                                                        }
                                                        helperText={
                                                            row.checked.toLowerCase() === "true"
                                                                ? validationData[
                                                                    `${row.type}_vl_${row.field}State`
                                                                ] === "has-danger"
                                                                    ? row.validationMsg
                                                                    : ""
                                                                : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                                (validationData[
                                                                    `${row.type}_vl_${row.field}State`
                                                                ] === "has-danger"
                                                                    ? row.validationMsg
                                                                    : "")
                                                        }
                                                    // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                                                    />
                                                </>
                                                :
                                                row.field === "entity_kyc_pvtLtd_cin_llpin" ? (
                                                    <>
                                                        <InputBox
                                                            isBoxType={cinButtonState}
                                                            Buttonlabel={
                                                                navIconPrefixState["Entity Details"] == "success"
                                                                    ? ""
                                                                    : "Verify"
                                                            }
                                                            id={row.field}
                                                            label={row.title}
                                                            isDrawdown={false}
                                                            // initialValue={""}
                                                            initialValue={(
                                                                stateData[`${row.type}_vl_${row.field}`] ?? ""
                                                            ).toUpperCase()}
                                                            onClick={(event) => change(event, row.type, row.field)}
                                                            // onClick={(event) => change(event, row.type, row.field)}
                                                            // isDisabled={row.field === "age" || isFormDisabled? true : false}
                                                            // onClick={(event) => change(event, row.type, row.field)}
                                                            isDisabled={(disabledFields[props.type] && disabledFields[props.type].includes(row.field)) ||
                                                                ((selectedEntityType == "Public Limited" || selectedEntityType == "Private Limited" || selectedEntityType == "LLP" || selectedEntityType == "OPC") && (panButtonState !== "icon")) ? true : false}
                                                            customDropdownClass={inputBoxCss}
                                                            customClass={{
                                                                height: "56px",
                                                                width: "100%",
                                                                maxWidth: "100%",
                                                                border: cinBorder,
                                                                pointerEvents: cinButtonState === "icon" ? "none" : "",
                                                            }}
                                                            customInputClass={{
                                                                marginTop:
                                                                    (props.type != "edit" &&
                                                                        loanAppId &&
                                                                        row.field != "aadhaar_value") ||
                                                                        row.field === "age" ||
                                                                        (row.dept == "Permanent Address" &&
                                                                            !viewPerAddress) ||
                                                                        isFormDisabled
                                                                        ? "-3px"
                                                                        : "0px",
                                                                maxWidth: "82%",
                                                                backgroundColor: "#fff",
                                                            }}
                                                            error={
                                                                row.checked.toLowerCase() === "true"
                                                                    ? validationData[
                                                                    `${row.type}_vl_${row.field}State`
                                                                    ] === "has-danger"
                                                                    : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                                    validationData[
                                                                    `${row.type}_vl_${row.field}State`
                                                                    ] === "has-danger"
                                                            }
                                                            helperText={
                                                                row.checked.toLowerCase() === "true"
                                                                    ? validationData[
                                                                        `${row.type}_vl_${row.field}State`
                                                                    ] === "has-danger"
                                                                        ? row.validationMsg
                                                                        : ""
                                                                    : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                                    (validationData[
                                                                        `${row.type}_vl_${row.field}State`
                                                                    ] === "has-danger"
                                                                        ? row.validationMsg
                                                                        : "")
                                                            }
                                                        // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                                                        />
                                                    </>
                                                ) :
                                                    row.field === "entity_kyc_pvtLtd_pan" ||
                                                        row.field === "entity_kyc_pvtLtd_urc" ||
                                                        row.field === "entity_kyc_pvtLtd_pan" ||
                                                        row.field === "entity_kyc_proprietor_urc" ||
                                                        row.field === "entity_kyc_partnerShip_pan"
                                                        ?
                                                        <>
                                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                                <InputBox
                                                                    id={row.field}
                                                                    label={row.title}
                                                                    isBoxType="button"
                                                                    // Buttonlabel="Verify"
                                                                    Buttonlabel={navIconPrefixState['Entity Details'] === "success" ? "" : "Verify"}

                                                                    options={
                                                                        row.field === "select_entity_type"
                                                                            ?
                                                                            entityType
                                                                            : row.options
                                                                    }
                                                                    isDrawdown={false}
                                                                    initialValue={stateData[`${row.type}_vl_${row.field}`]}
                                                                    // onClick={value =>
                                                                    //     dropDownChange(value, row.field)
                                                                    // }
                                                                    onClick={(event) => change(event, row.type, row.field)}
                                                                    isDisabled={(disabledFields[props.type] && disabledFields[props.type].includes(row.field)) || row.field === "age" || (!viewRegAddress && row.dept == "Registered Address") ? true : false}
                                                                    customDropdownClass={inputBoxCss}
                                                                    customClass={{ height: "3.5rem", width: "27.5rem", maxWidth: "100%" }}
                                                                    customInputClass={{ minWidth: "100%", backgroundColor: "#fff" }}
                                                                    error={
                                                                        row.checked.toLowerCase() === "true"
                                                                            ? validationData[
                                                                            `${row.type}_vl_${row.field}State`
                                                                            ] === "has-danger"
                                                                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                                            validationData[
                                                                            `${row.type}_vl_${row.field}State`
                                                                            ] === "has-danger"
                                                                    }
                                                                    helperText={
                                                                        row.checked.toLowerCase() === "true"
                                                                            ? validationData[
                                                                                `${row.type}_vl_${row.field}State`
                                                                            ] === "has-danger"
                                                                                ? row.validationMsg
                                                                                : ""
                                                                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                                            (validationData[
                                                                                `${row.type}_vl_${row.field}State`
                                                                            ] === "has-danger"
                                                                                ? row.validationMsg
                                                                                : "")
                                                                    }
                                                                // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                                                                />
                                                            </div>
                                                        </>
                                                        :
                                                        row.field === "gstin_value" ||
                                                            row.field === "gst_certificate_value" ||
                                                            row.field === "udhyam_certificalte_value" ||
                                                            row.field === "entity_kyc_partnerShip_urc" ||
                                                            row.field === "entity_kyc_partnerShip_authority_letter" ||
                                                            row.field === "udhyam_certificalte_value" ||
                                                            row.field === "entity_kyc_partnerShip_moa" ||
                                                            row.field === "entity_kyc_partnerShip_aoa" ||
                                                            row.field === "entity_kyc_partnerShip_coi" ||
                                                            row.field === "entity_kyc_partnerShip_LOD" ||
                                                            row.field === "entity_kyc_partnerShip_al" ||
                                                            row.field === "entity_kyc_partnerShip_rc" ||
                                                            row.field === "entity_kyc_partnerShip_llom" ||
                                                            row.field === "entity_kyc_partnerShip_by_laws" ||
                                                            row.field === "entity_kyc_partnerShip_als"
                                                            ?
                                                            <>
                                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                                    <InputBox
                                                                        id={row.field}
                                                                        label={row.title}
                                                                        isBoxType="button"
                                                                        Buttonlabel={navIconPrefixState['Entity Details'] === "success" ? "" : row.field === "gst_certificate_value" ||
                                                                            row.field === "udhyam_certificalte_value" ||
                                                                            row.field === "entity_kyc_partnerShip_moa" ||
                                                                            row.field === "entity_kyc_partnerShip_aoa" ||
                                                                            row.field === "entity_kyc_partnerShip_coi" ||
                                                                            row.field === "entity_kyc_partnerShip_LOD" ||
                                                                            row.field === "entity_kyc_partnerShip_moa" ||
                                                                            row.field === "entity_kyc_partnerShip_aoa" ||
                                                                            row.field === "entity_kyc_partnerShip_coi" ||
                                                                            row.field === "entity_kyc_partnerShip_LOD" ||
                                                                            row.field === "entity_kyc_partnerShip_al" ||
                                                                            row.field === "entity_kyc_partnerShip_rc" ||
                                                                            row.field === "entity_kyc_partnerShip_llom" ||
                                                                            row.field === "entity_kyc_partnerShip_by_laws" ||
                                                                            row.field === "entity_kyc_partnerShip_als" ? "Upload" : "Verify"}
                                                                        options={
                                                                            row.field === "select_entity_type"
                                                                                ?
                                                                                entityType
                                                                                : row.options
                                                                        }
                                                                        isDrawdown={false}
                                                                        initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                                                                        onClick={value =>
                                                                            dropDownChange(value, row.field, row.type)
                                                                        }
                                                                        isDisabled={(disabledFields[props.type] && disabledFields[props.type].includes(row.field)) || row.field === "age" || (!viewRegAddress && row.dept == "Registered Address") ? true : false}
                                                                        customDropdownClass={inputBoxCss}
                                                                        customClass={{ height: "3.5rem", width: "27.5rem", maxWidth: "100%", border: urcBorder }}
                                                                        customInputClass={{ minWidth: "100%", backgroundColor: "#fff" }}
                                                                        error={
                                                                            row.checked.toLowerCase() === "true"
                                                                                ? validationData[
                                                                                `${row.type}_vl_${row.field}State`
                                                                                ] === "has-danger"
                                                                                : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                                                validationData[
                                                                                `${row.type}_vl_${row.field}State`
                                                                                ] === "has-danger"
                                                                        }
                                                                        helperText={
                                                                            row.checked.toLowerCase() === "true"
                                                                                ? validationData[
                                                                                    `${row.type}_vl_${row.field}State`
                                                                                ] === "has-danger"
                                                                                    ? row.validationMsg
                                                                                    : ""
                                                                                : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                                                (validationData[
                                                                                    `${row.type}_vl_${row.field}State`
                                                                                ] === "has-danger"
                                                                                    ? row.validationMsg
                                                                                    : "")
                                                                        }
                                                                    // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                                                                    />
                                                                    {row.field === "gst_certificate_value" || row.field === "udhyam_certificalte_value" ||
                                                                        row.field === "entity_kyc_partnerShip_moa" ||
                                                                        row.field === "entity_kyc_partnerShip_aoa" ||
                                                                        row.field === "entity_kyc_partnerShip_coi" ||
                                                                        row.field === "entity_kyc_partnerShip_LOD" ||
                                                                        row.field === "entity_kyc_partnerShip_al" ||
                                                                        row.field === "entity_kyc_partnerShip_rc" ||
                                                                        row.field === "entity_kyc_partnerShip_llom" ||
                                                                        row.field === "entity_kyc_partnerShip_by_laws" ||
                                                                        row.field === "entity_kyc_partnerShip_als" ?
                                                                        <p
                                                                            style={{
                                                                                color: '#767888',
                                                                                fontFamily: 'Montserrat-Regular',
                                                                                marginLeft: '10px',
                                                                                fontSize: '13px'
                                                                            }}
                                                                        >
                                                                            JPG, JPEG, PNG, PDF upto 5MB
                                                                        </p>
                                                                        :
                                                                        ""
                                                                    }
                                                                    {row.field === "gst_certificate_value" ||
                                                                        row.field === "entity_kyc_partnerShip_moa" ||
                                                                        row.field === "entity_kyc_partnerShip_aoa" ||
                                                                        row.field === "entity_kyc_partnerShip_coi" ||
                                                                        row.field === "entity_kyc_partnerShip_LOD" ||
                                                                        row.field === "entity_kyc_partnerShip_al" ||
                                                                        row.field === "entity_kyc_partnerShip_rc" ||
                                                                        row.field === "entity_kyc_partnerShip_llom" ||
                                                                        row.field === "entity_kyc_partnerShip_by_laws" ||
                                                                        row.field === "entity_kyc_partnerShip_als" ? <input
                                                                        type="file"
                                                                        ref={fileInputRef}
                                                                        style={{ display: 'none' }}
                                                                        id={row.field}
                                                                        onChange={(e) => { handleFileInputChange(row.field, e, row.type) }}
                                                                    /> : null}
                                                                </div>
                                                            </>
                                                            :
                                                            row.type === "date" ?
                                                                <>
                                                                    {/* <Typography>
                                                    {`${row.title}`}{" "}
                                                    <span style={{ color: "red" }}>
                                                        {row.isOptional === false ? ` *` : ""}
                                                    </span>
                                                </Typography> */}
                                                                    <BasicDatePicker
                                                                        disableFutureDate={true}
                                                                        disabled={((disabledFields[props.type] && disabledFields[props.type].includes(row.field)) || urcButtonState === "icon" || panButtonState === "icon") ? true : isFormDisabled ? true : false}
                                                                        placeholder={"Date of Incorporation"}
                                                                        value={stateData[`${row.type}_vl_${row.field}`] || null}
                                                                        onDateChange={date =>
                                                                            changeDateSelected(date, `${row.type}_vl_${row.field}`)
                                                                        }
                                                                        format="dd-MM-yyyy"
                                                                        error={
                                                                            row.checked.toLowerCase() === "true"
                                                                                ? validationData[
                                                                                `${row.type}_vl_${row.field}State`
                                                                                ] === "has-danger"
                                                                                : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                                                validationData[
                                                                                `${row.type}_vl_${row.field}State`
                                                                                ] === "has-danger"
                                                                        }
                                                                        helperText={
                                                                            row.checked.toLowerCase() === "true"
                                                                                ? validationData[
                                                                                    `${row.type}_vl_${row.field}State`
                                                                                ] === "has-danger"
                                                                                    ? row.validationMsg
                                                                                    : ""
                                                                                : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                                                (validationData[
                                                                                    `${row.type}_vl_${row.field}State`
                                                                                ] === "has-danger"
                                                                                    ? row.validationMsg
                                                                                    : "")
                                                                        }
                                                                    />
                                                                </>
                                                                :
                                                                <>
                                                                    <InputBox
                                                                        id={row.field}
                                                                        label={row.title}
                                                                        type={
                                                                            row.field === "comm_addr_pincode" ||
                                                                                row.field === "reg_addr_pincode"
                                                                                ? "number"
                                                                                : "text"
                                                                        }
                                                                        isDrawdown={false}
                                                                        initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                                                                        onClick={(event) => change(event, row.type, row.field)}
                                                                        isDisabled={(urcButtonState === "icon" || panButtonState == "icon") ? true : (disabledFields[props.type] && disabledFields[props.type].includes(row.field)) || row.field === "age" || (!viewRegAddress && row.dept == "Registered Address") ? true : false}
                                                                        customDropdownClass={inputBoxCss}
                                                                        customClass={{ height: "3.5rem", width: "27.5rem", maxWidth: "100%" }}
                                                                        customInputClass={{
                                                                            minWidth: "100%",
                                                                            backgroundColor: "#fff",
                                                                            marginTop: ((urcButtonState === "icon" || panButtonState == "icon") ? true : (disabledFields[props.type] && disabledFields[props.type].includes(row.field)) || row.field === "age" || (!viewRegAddress && row.dept == "Registered Address") ? true : false) ? "-3px" : "0px"
                                                                        }}
                                                                        error={
                                                                            row.checked.toLowerCase() === "true"
                                                                                ? validationData[
                                                                                `${row.type}_vl_${row.field}State`
                                                                                ] === "has-danger"
                                                                                : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                                                validationData[
                                                                                `${row.type}_vl_${row.field}State`
                                                                                ] === "has-danger"
                                                                        }
                                                                        helperText={
                                                                            row.checked.toLowerCase() === "true"
                                                                                ? validationData[
                                                                                    `${row.type}_vl_${row.field}State`
                                                                                ] === "has-danger"
                                                                                    ? row.validationMsg
                                                                                    : ""
                                                                                : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                                                                                (validationData[
                                                                                    `${row.type}_vl_${row.field}State`
                                                                                ] === "has-danger"
                                                                                    ? row.validationMsg
                                                                                    : "")
                                                                        }
                                                                    // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                                                                    />
                                                                </>
                                }
                            </>
                        );
                    })
                }
            </div >
        )
    }
    const handleRadioButton = (event) => {
        setSelectedFileType(event.target.value);
    };
    const setInitialState = () => {
        const tempStateObj = {};
        const tempErrorObj = {};
        bookLoansFormJsonFields().map((item, idx) => {
            if (item.dept == "Entity Details" ||
                item.dept == "Communication Address" ||
                item.dept == "Registered Address" ||
                item.dept == `${selectedEntityType === "Proprietor" ? "Entity-KYC proprietor verify" : selectedEntityType === "Partnership" ? "Entity-KYC partnership upload" : "Entity-KYC pvtLtd"}` ||
                item.dept == `${selectedEntityType === "Partnership" ? "Entity-KYC partnership verify" : ""}`
                || item.dept == `${selectedFileType === "GSTIN" ? "GSTIN" : "Shop Establishment Certificate"}`
            ) {
                const stateKey = `${item.type}_vl_${item.field}`;
                const errorKey = `${item.type}_vl_${item.field}State`;
                tempStateObj[stateKey] = "";
                tempErrorObj[errorKey] = "";

            }

        })
        setStateData(tempStateObj);
        setValidationData(tempErrorObj);
    }
    const handleSubmit = (event) => {
        if(isLeadRejected){
            return showAlert(`Your lead has been rejected`,"error");
        }
        
        const postData = {};
        let formValidated = true;

        // Object.keys(stateData).forEach((item) => {
        //     if (
        //         stateData[item]?.length > 0 &&
        //         !validateData(
        //             item.substring(0, item.indexOf("_vl_")).toLowerCase(),
        //             stateData[item]
        //         )
        //     ) {
        //         setValidationData((prevState) => ({
        //             ...prevState,
        //             [`${item}State`]: "has-danger",
        //         }));
        //         formValidated = false;
        //     }
        //     if (
        //         stateData[item].length == 0
        //     ) {
        //         setValidationData((prevState) => ({
        //             ...prevState,
        //             [`${item}State`]: "has-danger",
        //         }));
        //         formValidated = false;
        //     }
        // });
        if (formValidated) {
            // Object.keys(stateData).forEach((item) => {
            //     if (stateData[item].length > 0) {
            //         postData[item.substring(item.indexOf("_vl_") + 4, item.length)] =
            //             stateData[item];
            //     }
            // });
            //postData.loan_app_id = loan_app_id;
            setSectionStatusCheck('inProgress')
            postData.user_id = user._id;
            const payload = {
                user_id: user._id,
                company_id: MSMECompanyId,
                msme_company_id: MSMECompanyId,
                product_id: MSMEProductId,
                msme_product_id: MSMEProductId,
                loan_app_id: loanAppId,
                "loan_app_id": loanAppId,
                "section": "entity-details",
                "entity_type": selectedEntityType,
                "entity_name": stateData[`string_vl_entity_name_value`] ?? " ",
                "date_of_incorporation": stateData[`date_vl_doi_value`] ?? " ",
                "com_addr_ln1": stateData[`string_vl_comm_addr_ln1`] ?? " ",
                "com_addr_ln2": stateData[`string_vl_comm_addr_ln2`] ?? " ",
                "com_city": stateData[`string_vl_comm_addr_city`] ?? " ",
                "com_state": stateData[`string_vl_comm_addr_state`] ?? " ",
                "com_pincode": stateData[`pincode_vl_comm_addr_pincode`] ?? " ",
                "res_addr_ln1": stateData[`string_vl_reg_addr_ln1`] ?? " ",
                "res_addr_ln2": stateData[`string_vl_reg_addr_ln2`] ?? " ",
                "res_city": stateData[`string_vl_reg_addr_city`] ?? " ",
                "res_state": stateData[`string_vl_reg_addr_state`] ?? " ",
                "res_pincode": stateData[`pincode_vl_reg_addr_pincode`] ?? " ",
                "pan_no": stateData[`pan_vl_${selectedEntityType == "Private Limited" ? "entity_kyc_pvtLtd_pan" : (selectedEntityType == "Partnership"|| selectedEntityType == "Society" || selectedEntityType == "Trust" )? "entity_kyc_partnerShip_pan" : " "}`] ?? " ",
                "urc_no": stateData[`string_vl_${selectedEntityType == "Private Limited" ? "entity_kyc_pvtLtd_urc" : selectedEntityType == "Partnership" ? "entity_kyc_partnerShip_urc" : "entity_kyc_proprietor_urc"}`] ?? " ",
                "cin_no": stateData[`string_vl_entity_kyc_pvtLtd_cin_llpin`] ?? " ",
                "gst_no": stateData[`string_vl_gstin_value`] ?? " ",
                "gst_certificate": stateData[`string_vl_gstin_value`] ?? " ",
                "shop_est_certificate": " ",
                "authority_letter": " ",
                "moa_file": " ",
                "aoa_file": " ",
                "coi_file": " ",
                "directors_file": " ",
                section_sequence_no: SectionData.entity.section_sequence_no,
                section_name: SectionData.entity.section_name,
                sub_section_code:
                    SectionData.entity.entity_section_submit.sub_section_code,
                sub_section_name:
                    SectionData.entity.entity_section_submit.sub_section_name,
                sub_section_sequence_no:
                    SectionData.entity.entity_section_submit.sub_section_sequence_no,
                section_code: SectionData.entity.section_code
            }

            dispatch(
                patchMsmeDetailsWatcher(
                    payload,
                    async (result) => {
                        setEntityData(stateData);
                        setStatusCheckApi(
                            loanAppId,
                            SectionData.entity.section_code,
                            SectionData.entity.entity_section_submit.sub_section_code,
                            dispatch
                        );
                    },
                    (error) => { }
                ))
        } else {
            showAlert("Kindly check for errors in fields", "error");
            setTimeout(() => {
                handleAlertClose();
            }, 4000);
        }
    };
    const setStatusCheckApi = async (
        loanAppID,
        sectionCode,
        subSectionCode,
        dispatch
    ) => {
        intervalId = setInterval(async () => {
            try {
                const status = await getSectionStatus(
                    loanAppID,
                    user,
                    MSMECompanyId,
                    MSMEProductId,
                    sectionCode,
                    subSectionCode,
                    dispatch
                );
                if (status == "approved") {
                    if (
                        subSectionCode ===
                        SectionData.entity.entity_section_submit.sub_section_code
                    ) {
                        setNavState("Co-Applicant Details");
                        setNavIconPrefixState(prevState => ({
                            ...prevState,
                            "Entity Details": "success"
                        }));
                        setSectionStatusCheck('completed');
                        if(setShouldFetch){
                            setShouldFetch((prev)=>prev+1);
                        }
                    }
                    clearInterval(intervalId);
                } else if (status == "deviation") {
                    if (
                        subSectionCode ===
                        SectionData.entity.entity_section_submit.sub_section_code
                    ) {
                        setNavState("Co-Applicant Details");
                        setNavIconPrefixState(prevState => ({
                            ...prevState,
                            "Entity Details": "success"
                        }));
                        setSectionStatusCheck('completed');
                    }
                    clearInterval(intervalId);
                } else if (status == "rejected") {
                    setIsLeadRejected(true)
                    clearInterval(intervalId);
                }
            } catch (error) {
                clearInterval(intervalId);
            }
        }, 4000);
    };

    const customSaveButton = {
        fontSize: "16px",
        color: "#134CDE",
        border: "1px solid #134CDE",
        width:"max-content",
        padding: "10px 24px",
        borderRadius: "40px",
    }

    //urc certificate
    const [entityProprietorURCDoc, setEntityProprietorURCDoc] = useState(URC_Certificate.map((givenObj)=>{
        const matchingObj = documents?.find(docObject => docObject.code === givenObj.documentCode); 
        if(matchingObj){
            return {
                ...givenObj, 
                s3_url: matchingObj.file_url,
                doc: matchingObj
            }
        }
        return givenObj;
    }))

    //entityKYCPatnerShip

    const [entityPatnerShipDoc, setEntityPatnerShipItem] = useState(Entity_KYC_Partnership_Upload.map((givenObj) => {
        const matchingObj = documents?.find((otherObj) => otherObj.code === givenObj.documentCode);
        if (matchingObj) {
            return {
                ...givenObj,
                s3_url: matchingObj.file_url,
                doc: matchingObj
            };
        }
        else {
            return givenObj;
        }
    }))


    //shopEstablishMent
    const [entity_KYC_Authority_Letter_Upload, setEntity_KYC_Authority_Letter_Upload] = useState(Entity_KYC_Authority_Letter_Upload.map((givenObj) => {
        const matchingObj = documents?.find((otherObj) => otherObj.code === givenObj.documentCode);
        if (matchingObj) {
            return {
                ...givenObj,
                s3_url: matchingObj.file_url,
                doc: matchingObj
            };
        }
        else {
            return givenObj;
        }
    }))

    //shopEstablishMent
    const [shopEstablishment, setShopEstablishment] = useState(Shop_Establishment_Certificate.map((givenObj) => {
        const matchingObj = documents?.find((otherObj) => otherObj.code === givenObj.documentCode);
        if (matchingObj) {
            return {
                ...givenObj,
                s3_url: matchingObj.file_url,
                doc: matchingObj
            };
        }
        else {
            return givenObj;
        }
    }))

    //GSTIN
    const [gstin, setGstIn] = useState(GSTIN.map((givenObj) => {
        const matchingObj = documents?.find((otherObj) => otherObj.code === givenObj.documentCode);
        if (matchingObj) {
            return {
                ...givenObj,
                s3_url: matchingObj.file_url,
                doc: matchingObj
            };
        }
        else {
            return givenObj;
        }
    }))


    useEffect(() => {
        if (MSMEProductId || MSMECompanyId) {
            fetchLeadStatus();
            getLoanDocuments();
        }
    }, [])

    const fetchLeadStatus = () => {
        const payload = {
            loan_app_id: loanAppId,
            companyId: MSMECompanyId,
            productId: MSMEProductId,
            user: user,
        };
        new Promise((resolve, reject) => {
            dispatch(getLeadStatusWatcher(payload, resolve, reject));
        })
            .then((response) => {
                setStatusObject(response.find(item => item.section_code === "entity"))
            })
            .catch((error) => {
                showAlert(error?.response?.data?.message, "error");
            });
    };


    const getLoanDocuments = () => {
        const payload = {
            loanAppID: loanAppId,
            companyId: MSMECompanyId,
            productId: MSMEProductId,
            user: user,
        };
        new Promise((resolve, reject) => {
            dispatch(getMsmeLoanDocumentsWatcher(payload, resolve, reject));
        })
            .then((response) => {

                if (response) {

                    let tempDocState = {...documentStateData};
                    setEntityPatnerShipItem(Entity_KYC_Partnership_Upload.map((givenObj) => {
                        const matchingObj = response?.find((otherObj) => otherObj.code === givenObj.documentCode);
                        if (matchingObj) {
                            return {
                                ...givenObj,
                                s3_url: matchingObj.file_url,
                                doc: matchingObj
                            };
                        }
                        return givenObj;
                    }))
                    //entityLetter

                    setEntity_KYC_Authority_Letter_Upload(Entity_KYC_Authority_Letter_Upload.map((givenObj) => {
                        const matchingObj = response?.find((otherObj) => otherObj.code === givenObj.documentCode);
                        if (matchingObj) {
                            return {
                                ...givenObj,
                                s3_url: matchingObj.file_url,
                                doc: matchingObj
                            };
                        }
                        return givenObj;
                    }))
                    //GST
                    
                    setGstIn(GSTIN.map((givenObj) => {
                        const matchingObj = response?.find((otherObj) => otherObj.code === givenObj.documentCode);
                        if (matchingObj) {
                            tempDocState['gst_certificate_value']=true;
                            return {
                                ...givenObj,
                                s3_url: matchingObj.file_url,
                                doc: matchingObj
                            };
                        }
                        return givenObj;
                    }))

                    //shopEstablishment
                    setShopEstablishment(Shop_Establishment_Certificate.map((givenObj) => {
                        const matchingObj = response?.find((otherObj) => otherObj.code === givenObj.documentCode);
                        if (matchingObj) {
                            tempDocState['udhyam_certificalte_value']=true;
                            return {
                                ...givenObj,
                                s3_url: matchingObj.file_url,
                                doc: matchingObj
                            };
                        }
                        return givenObj;
                    }))

                    //UrcCertificate
                    setEntityProprietorURCDoc(URC_Certificate.map((givenObj) => {
                        const matchingObj = response?.find((otherObj) => otherObj.code === givenObj.documentCode);
                        if (matchingObj) {
                            tempDocState['urc_certificate_value'] = true;
                            return {
                                ...givenObj,
                                s3_url: matchingObj.file_url,
                                doc: matchingObj
                            };
                        }
                        return givenObj;
                    }))

                    setDocumentStateData((prev) => {
                        return {
                            ...prev,
                            ...tempDocState
                        }
                    })
                }
            })
            .catch((error) => {
                showAlert(error.response?.data?.message, "error");
            });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "98%", marginLeft: "1.7%", justifyContent: "space-around" }}>
            <h4 style={{ color: "var(--neutrals-neutral-100, #161719)", fontFamily: "Montserrat-semibold", fontSize: "24px", fontWeight: 700, lineHeight: "150%", marginBottom: "24px" }}>Entity Details</h4>
            <div>
                {renderFields("Entity Details 1")}
            </div>
            {selectedEntityType ?
                <>
                    <div style={{ marginTop: "20px" }}>
                        {renderFields("Entity Details")}
                    </div>
                    <h4 style={{ ...headingCss, marginBottom: "16px" }}>Communication Address</h4>
                    <div>
                        {renderFields("Communication Address")}
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <h4 style={{ ...headingCss, marginBottom: "16px" }}>Registered Address</h4>
                      
                            <>
                                <input
                                    style={{ marginLeft: "16px", marginTop: "2.1rem", width: "1rem", height: "1rem" }}
                                    type="checkbox"
                                    onClick={handleRegisteredAddress}
                                    disabled={urcButtonState === "icon" || panButtonState === "icon" ? true : false}
                                    checked={!viewRegAddress}
                                >
                                </input>
                                <div
                                    style={{ fontFamily: "Montserrat-Regular", fontSize: "0.9vw", marginLeft: "8px", color: "#767888", marginTop: "2.1rem" }}>
                                    Same as Communication address
                                </div>
                            </>
                           
                        
                    </div>
                    {
                        <div>
                            {renderFields("Registered Address")}
                        </div>
                    }
                    <h4 style={headingCss}>Entity KYC</h4>
                    <div>
                        {(() => {
                            if (selectedEntityType === "Proprietor") {
                                return (
                                    <div style={{display:'flex', gap: '3%'}}>
                                        <div style={{display:'inline', marginTop: '0'}}>
                                        <UploadFileInput
                                            backgroundColorChange={false}
                                            items={entityProprietorURCDoc}
                                            title=""
                                            showAlert={showAlert}
                                            setDocumentStateData={setDocumentStateData}
                                            sectionName={sectionName}
                                            data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
                                            loanAppId={loanAppId}
                                            backgroundColorBlur={
                                                props.type && (props.type == "view" || props.type === "edit") ? false : backgroundColorBlur
                                            }
                                            MSMECompanyId={MSMECompanyId}
                                            MSMEProductId={MSMEProductId}
                                            isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
                                            shouldDelete={true}
                                        />
                                        </div>
                                        <div style={{marginTop:'1.2%', width:"100%"}}>
                                            {renderFields('Entity-KYC proprietor verify')}
                                        </div>
                                    </div>
                                );
                            }
                            else if (selectedEntityType === "Partnership" || selectedEntityType === "Society" || selectedEntityType === "Trust") {
                                return renderFields("Entity-KYC partnership verify")
                            } else {
                                return (
                                    <>
                                      <div style={{ display: 'flex', position: 'relative', marginBottom: '2%' }}>
                                        <div style={{ flexBasis: '100%' }}>{renderFields('Entity-KYC pvtLtd')}</div>
                                        <div style={{ position: 'absolute', right: '0', top: '-20px' }}>
                                        </div>
                                      </div>
                                      <div style={{display:'flex'}}>
                                          <UploadFileInput
                                            backgroundColorChange={false}
                                            items={entityProprietorURCDoc}
                                            title=""
                                            showAlert={showAlert}
                                            setDocumentStateData={setDocumentStateData}
                                            sectionName={sectionName}
                                            data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
                                            loanAppId={loanAppId}
                                            backgroundColorBlur={(selectedEntityType == 'Public Limited' || selectedEntityType == 'Private Limited' || selectedEntityType == 'LLP' || selectedEntityType == 'OPC') && cinButtonState !== 'icon' ? true : props.type && (props.type == 'view' || props.type === 'edit') ? false : backgroundColorBlur}
                                            MSMECompanyId={MSMECompanyId}
                                            MSMEProductId={MSMEProductId}
                                            isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
                                            shouldDelete={true}
                                            // customWidth="26rem"
                                            customMaxWidth='22.5vw'
                                          />
                                    <div style={{marginLeft:'2.6%',marginTop:'1.8%', minWidth:'100%'}}>
                                      {renderFields('Entity-KYC pvtLtd URC')}
                                      </div>
                                      </div>
                                    </>
                                  );
                            }
                        })()
                        }
                    </div>
                    {/* additional supporting documents */}
                    <p style={{ color: "var(--neutrals-neutral-100, #161719)", fontFamily: "Montserrat-Regular", fontSize: "20px", fontWeight: "600", marginTop: "40px" }}>
                        {(isPanVerified || navIconPrefixState['Entity Details'] === "success") && (selectedEntityType == "Society" || selectedEntityType == "Trust") || (showGstinSection && isUrcVerified && (selectedEntityType == "Proprietor" || selectedEntityType == "Private Limited" || selectedEntityType == "Public Limited" || selectedEntityType == "LLP" || selectedEntityType == "OPC")) || (isPanVerified && selectedEntityType == "Partnership") ? 
                     "Upload additional supporting documents" : ""}</p>
                    {(isPanVerified || navIconPrefixState['Entity Details'] === "success") && (selectedEntityType == "Society" || selectedEntityType == "Trust") ?
                        <div style={{}}>
                            <div style={{ display: 'grid', gridTemplateColumns: "32.16% 32.16% 32.16%", width: "98%", columnGap: "1%" }}>
                                {/* {entityPatnerShipDoc.map((item, idx) => {
                                    return (
                                        <div key={idx} > 
                                        <UploadFileInput 
                                        key={idx} 
                                        backgroundColorChange={false}
                                         items={[item]} 
                                         title="" 
                                         showAlert={showAlert}
                                        
                                           setDocumentStateData={setDocumentStateData} 
                                        //    isSubmit={navIconPrefixState['Entity Details'] === "success"} 
                                           sectionName={sectionName} 
                                           data={{ company_id: MSMECompanyId, product_id: MSMEProductId }} 
        
                                            loanAppId={loanAppId}
                                                          
                                            backgroundColorBlur={
                                              props.type && (props.type == "view" || props.type==="edit") ? false : backgroundColorBlur
                                            }                        
                                         
                                            MSMECompanyId={MSMECompanyId}
                                            MSMEProductId={MSMEProductId}
                                            isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
                                            shouldDelete={true}
                                           
                                           /></div>
                                    )
                                })} */}

                                <div style = {{width : "1040px"}}>
                                    <UploadFileInput
                                        backgroundColorChange={false}
                                        items={entityPatnerShipDoc}
                                        title=""
                                        showAlert={showAlert}
                                        setDocumentStateData={setDocumentStateData}
                                        sectionName={sectionName}
                                        data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
                                        loanAppId={loanAppId}
                                        backgroundColorBlur={
                                            props.type && (props.type == "view" || props.type === "edit") ? false : backgroundColorBlur
                                        }
                                        MSMECompanyId={MSMECompanyId}
                                        MSMEProductId={MSMEProductId}
                                        isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
                                        shouldDelete={true}
                                    />
                                </div>
                            </div>
                        </div>
                        :
                        (isPanVerified && selectedEntityType == "Partnership")
                            ?
                            <>
                                {
                                    <UploadFileInput
                                        backgroundColorChange={false}
                                        items={entity_KYC_Authority_Letter_Upload}
                                        title="" showAlert={showAlert}
                                        isSubmit={navIconPrefixState['Entity Details'] === "success"}
                                        loanAppId={loanAppId} data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
                                        sectionName={sectionName}
                                        backgroundColorBlur={
                                            props.type && (props.type == "view" || props.type === "edit") ? false : backgroundColorBlur
                                        }
                                        setDocumentStateData={setDocumentStateData}
                                        MSMECompanyId={MSMECompanyId}
                                        MSMEProductId={MSMEProductId}
                                        isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
                                        shouldDelete={true}
                                    />
                                }
                            </>
                            :
                            <>
                                {showGstinSection && isUrcVerified && (selectedEntityType == "Proprietor" || selectedEntityType == "Private Limited" || selectedEntityType == "Public Limited" || selectedEntityType == "LLP" || selectedEntityType == "OPC") ?
                                    <div style={{ display: "flex", flexDirection: "row", columnGap: "5%" }}>
                                        <label style={radioCss}><input type="radio" value="GSTIN" checked={selectedFileType === 'GSTIN'} onChange={handleRadioButton} style={radioInputCss} />GSTIN</label>
                                        <label style={radioCss}><input type="radio" value="Shop Establishment Certificate" checked={selectedFileType === 'Shop Establishment Certificate'} onChange={handleRadioButton} style={radioInputCss} />Shop Establishment Certificate</label>
                                    </div>
                                    :
                                    ""
                                }

                                {showGstinSection ?
                                    selectedFileType === "GSTIN" ?
                                        <div style={{ marginTop: "16px" }}>
                                            {isUrcVerified && (selectedEntityType == "Proprietor" || selectedEntityType == "Private Limited") ?
                                                <div style={{ display: 'flex', rowGap: "24px", columnGap: "2%", width: "98%" }}>
                                                    <div style={{
                                                        marginTop: "-20px"
                                                    }}>
                                                        {/* <input type="file" onChange={handleFileSelect} /> */}
                                                        {/* <button onClick={gstStatusCheck}>GST Test UI</button> */}
                                                        {/* <InputBox 
                                                        label={"GSTIN"}
                                                        onClick={handleFileSelect}
                                                        type='file'
                                                        /> */}
                                                        <UploadFileInput
                                                            backgroundColorChange={true}
                                                            // onDataCallback={handleFileSelect} 
                                                            items={gstin} title=""
                                                            showAlert={showAlert}
                                                            loanAppId={loanAppId}
                                                            setDocumentStateData={setDocumentStateData}
                                                            customWidth={true} sectionName={sectionName}
                                                            onFileUpload={e => handleFileSelect(e)}
                                                            data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
                                                            backgroundColorBlur={
                                                                props.type && (props.type == "view" || props.type === "edit") ? false : backgroundColorBlur
                                                            }
                                                            MSMECompanyId={MSMECompanyId}
                                                            MSMEProductId={MSMEProductId}
                                                            isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
                                                            shouldDelete={true}
                                                        />
                                                    </div>

                                                    <div style={{

                                                    }}>
                                                        <InputBox
                                                            isBoxType={gstButtonState}
                                                            Buttonlabel={navIconPrefixState['Entity Details'] == "success" ? "" : "Verify"}
                                                            id={"gstin_value"}
                                                            label={"GSTIN"}
                                                            isDrawdown={false}
                                                            initialValue={stateData[`${"string"}_vl_${"gstin_value"}`]}
                                                            onClick={(event) => change(event, "string", "gstin_value")}
                                                            customDropdownClass={inputBoxCss}
                                                            customClass={{
                                                                height: "56px",
                                                                width: "20vw",
                                                                border: gstBorder,
                                                                pointerEvents: gstButtonState === "icon" ? "none" : ""
                                                            }}
                                                            customInputClass={{
                                                                marginTop: ((loanAppId && "gstin_value" != "aadhaar_value") || ("gstin_value" === "age") || isFormDisabled) ? "-3px" : "0px",
                                                                maxWidth: "82%",
                                                                backgroundColor: "#fff",
                                                            }}
                                                            error={
                                                                "true" === "true"
                                                                    ? validationData[
                                                                    `${"string"}_vl_${"gstin_value"}State`
                                                                    ] === "has-danger"
                                                                    : stateData[`${"string"}_vl_${"gstin_value"}`] !== "" &&
                                                                    validationData[
                                                                    `${"string"}_vl_${"gstin_value"}State`
                                                                    ] === "has-danger"
                                                            }
                                                            helperText={
                                                                "true" === "true"
                                                                    ? validationData[
                                                                        `${"string"}_vl_${"gstin_value"}State`
                                                                    ] === "has-danger"
                                                                        ? "Invalid GSTIN"
                                                                        : ""
                                                                    : stateData[`${"string"}_vl_${"gstin_value"}`] !== "" &&
                                                                    (validationData[
                                                                        `${"string"}_vl_${"gstin_value"}State`
                                                                    ] === "has-danger"
                                                                        ? "Invalid GSTIN"
                                                                        : "")
                                                            }
                                                        />
                                                    </div>

                                                </div>
                                                :
                                                null
                                            }
                                        </div>
                                        :
                                        selectedFileType === "Shop Establishment Certificate" ?
                                            <div style={{ marginTop: "16px" }}>
                                                {isUrcVerified && (selectedEntityType == "Proprietor" || selectedEntityType == "Private Limited" || selectedEntityType == "Public Limited" || selectedEntityType == "LLP" || selectedEntityType == "OPC") ?
                                                    <UploadFileInput
                                                        backgroundColorChange={true}
                                                        items={shopEstablishment}
                                                        title="" showAlert={showAlert}
                                                        isSubmit={navIconPrefixState['Entity Details'] === "success"}
                                                        loanAppId={loanAppId}
                                                        sectionName={sectionName}
                                                        data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}

                                                        backgroundColorBlur={
                                                            props.type && (props.type == "view" || props.type === "edit") ? false : backgroundColorBlur
                                                        }
                                                        setDocumentStateData={setDocumentStateData}
                                                        MSMECompanyId={MSMECompanyId}
                                                        MSMEProductId={MSMEProductId}
                                                        isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
                                                        shouldDelete={true}
                                                    />
                                                    : null
                                                }
                                            </div>
                                            : null
                                    : null
                                }
                            </>
                    }</>
                    :
                    <><div style={{marginBottom:"40%"}}></div></>
                }
                    {props.type == 'view' || navIconPrefixState['Entity Details'] == "success" ? null :
                        <div className="book-loan-button-container book-loan-button-alignment-double-button">
                            <Button
                                label="Verify & Next"
                                onClick={handleSubmit}
                                buttonType="linkssss"
                                isLoading={sectionStatusCheck === 'inProgress' ? true : false}
                                customStyle={{
                                    display: "inline - flex",
                                    height: "48px",
                                    width: 'max-content',
                                    padding: "10px 24px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "16px",
                                    color: "#FFF",
                                    fontFamily: "Montserrat-Regular",
                                    pointerEvents: validForm === false ? "none" : "auto",
                                    fontSize: "16px",
                                    fontWeight: "800",
                                    lineHeight: "150%",
                                    flexShrink: "0",
                                    borderRadius: "40px",
                                    background: validForm
                                        ? "var(--primary-blue-button-gradient, linear-gradient(180deg, #134CDE 0%, #163FB7 100%, #163FB7 100%))"
                                        : "var(--neutrals-neutral-30, #CCCDD3)"
                                }}
                                customLoaderClass={{
                                    borderTop: '4px solid #fff',
                                }}
                            ></Button>
                          {leadStatus ==="draft" ?<>
                          <Button
                                id='saveDraft'
                                label='Save as Draft'
                                buttonType="secondary"
                                customStyle={customSaveButton}
                                onClick={saveDraftFunction}
                                isDisabled={disableDraftButton}
                            />
                            </>
                         :null }
                        </div >}
                    {alert ? (
                        <Alert
                            severity={severity}
                            message={alertMessage}
                            handleClose={handleAlertClose}
                        />
                    ) : null}
        </div >
    );
};
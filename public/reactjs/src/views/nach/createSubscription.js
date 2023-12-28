import React, { useEffect, useState } from 'react';
import { useSelector,useDispatch } from "react-redux";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import Button from "react-sdk/dist/components/Button/Button";
import "react-sdk/dist/styles/_fonts.scss";
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import SelectCompany from "../../components/Company/SelectCompany";
import { storedList } from "../../util/localstorage";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import { verifyDateAfter1800 } from "../../util/helper";
import moment from "moment";
import { validateData } from "../../util/validation";
import { createSubscriptionWatcher, getLoanDetailsNachWatcher } from "../../actions/enach";
import Preloader from "../../components/custom/preLoader";
import "react-sdk/dist/styles/_fonts.scss";
const user = storedList("user");

export default function createSubscription(props) {
    const { data, onModalClose, openDialog, setOpenDialog, showAlert , mandatePurpose, liveBankDetails } = props;
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.profile.loading);
    const [companyUser, setCompanyUser] = useState(user?.type === 'company');
    const [company, setCompany] = useState(user?.type === 'company' ? { label: user?.company_name, value: user?.company_id } : "");
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [validationData, setValidationData] = useState({})
    const [errorMessage, setErrorMessage] = useState({})
    const [isSMS, setIsSMS] = useState(true)
    const [isEmail, setIsEmail] = useState(true)
    const [isCancelled, setIsCancelled] = useState(true)
    const [companyError, setCompanyError] = useState(false)
    const [authenticationModes, setAuthenticaionModes] = useState([]);
    const [externalRefNum, setExternalRefNum] = useState("");
    const defaultMandatePurpose = mandatePurpose?.find(item => item.value === process?.env?.REACT_APP_ENACH_MANDATE_PURPOSE_LOAN_REPAYMENT);
    const liveBanks = liveBankDetails
        ?  Object.keys(liveBankDetails).map(bank => {
                return {
                    id: liveBankDetails[bank]?.bankName,
                    label: liveBankDetails[bank]?.bankName,
                    value: liveBankDetails[bank]?.bankId,
                    accessMode: liveBankDetails[bank]?.accessMode,
                }
            })
        : [];
    const [stateData, setStateData] = useState({
        customer_mobile_code: "+91",
        purpose_of_mandate: defaultMandatePurpose?.value,
        is_email_required: isEmail,
        is_sms_required: isSMS,
    })
    const styleButton = {
        display: "flex",
        width: "50%",
        padding: "13px 44px",
        borderRadius: "8px",
        height: "48px",
        fontFamily: "Montserrat-Regular",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: "600",
        lineHeight: "150%",
        marginBottom: "24px",
    };

    const customDropDownCss = {
        marginTop: "8px",
        zIndex: 2,
        color:"var(--neutral-100, #161719)"
    }

    const authenticationModeMap = [
        { id: "Aadhaar", label: "Aadhaar", value: "A" },
        { id: "Debit Card", label: "Debit Card", value: "D" },
        { id: "Net banking", label: "Net banking", value: "N" }
    ];

    const dataValidation = (type, value, name) => {
        const isValid = validateData(type, value)
        if (!isValid) {
            setValidationData(prevState => ({
                ...prevState,
                [name]: true
            }));
            setErrorMessage(prevState => ({
                ...prevState,
                [name]: `Please enter a valid ${name.replace(/_/g, ' ')}`
            }));
        }
        else {
            setValidationData(prevState => ({
                ...prevState,
                [name]: false
            }));
            setErrorMessage(prevState => ({
                ...prevState,
                [name]: ""
            }));
        }
    }

    const removeKey = (keyToRemove) => {
        const updatedObject = { ...stateData };
        delete updatedObject[keyToRemove];
        setStateData(updatedObject);
    };

    const handleChange = (event, name, type, validationType) => {
        if (type === "Dropdown") {
            dataValidation(validationType, event.label, name)
            setStateData({ ...stateData, [name]: event?.value ? event.value : event.label })

            if (name === 'bank') {
                setAuthenticaionModes(liveBanks.find(item => item.value === event.value)?.accessMode
                        ?.map(item => {return authenticationModeMap.find(authMode => authMode.value === item)}));
            }

        }
        else if (type === "Input") {
            dataValidation(validationType, event?.value, name)
            if (!event?.value) {
                removeKey(name)
            }
            else {
                setStateData({ ...stateData, [name]: event?.value })
            }
            if (name === 'external_ref_num') {
                setExternalRefNum(event?.value);
            }
        }
        else if (type === "Date") {
            dataValidation(validationType, event, name)
            setStateData({ ...stateData, [name]: event })
        }
        else {
            dataValidation(validationType, event?.value, name)
            setStateData({ ...stateData, [name]: event?.value })
        }
    }

    useEffect(
        () => {
            if (externalRefNum) fetchLoanDetailsNach();
        },
        [externalRefNum]
    );

    const fetchLoanDetailsNach = () => {
        const payload = {
            company_id: company?.value,
            user_id: user?._id,
            external_ref_num: externalRefNum,
        };
        new Promise((resolve, reject) => {
            dispatch(getLoanDetailsNachWatcher(payload, resolve, reject));
        })
            .then(response => {
                setStateData({
                    ...stateData,
                    customer_name: `${response?.data?.first_name} ${response?.data?.middle_name ? response?.data?.middle_name + " " : ""}${response?.data?.last_name}`,
                    customer_pan: response?.data?.pan || "",
                    customer_email_id: response?.data?.email_id || "",
                    customer_mobile_no: response?.data?.mobile || "",
                });
            })
            .catch((error) => {});
    }

    const handleCreate = () => {
        const combinedArray = [...customerFields, ...subscriptionFields, ...bankFields];
        let formValidated = false
        let errorMessage = ""
        let submitData = {
            ...stateData,
            ["consent"]: "Y",
            ["consent_timestamp"]: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            ["corporate_name"]: process.env.REACT_APP_ENACH_CORPORATE_NAME,
            ["utility_number"]: process.env.REACT_APP_ENACH_UTILITY_NUMBER,
        }
        if (!company)
            setCompanyError(true)
        combinedArray.forEach(obj => {
            if (obj["isRequired"] === true) {
                if (!stateData[obj.name]) {
                    setValidationData(prevState => ({
                        ...prevState,
                        [obj.name]: true
                    }));
                    setErrorMessage(prevState => ({
                        ...prevState,
                        [obj.name]: `Please enter a valid ${obj.name.replace(/_/g, ' ')}`
                    }));
                    formValidated = true;
                    errorMessage = "Please fill mandatory fields"
                }
                if (validationData[obj.name]) {
                    formValidated = true;
                    errorMessage = "Kindly check for errors in fields"
                }
            }
        });
        if (!formValidated) {
            const payload = {
                submitData: submitData,
                userData: {
                    company_id: company?.value,
                    user_id: user?._id
                }
            };
            new Promise((resolve, reject) => {
                dispatch(createSubscriptionWatcher(payload, resolve, reject));
            })
                .then(response => {
                    onModalClose()
                    showAlert(response?.message || "Subscription requested successfully", "success", response?.data, response?.url);
                })
                .catch((error) => {
                    showAlert(error?.response?.data?.message || "Error while creating subscription", "error");
                });
        } else {
            showAlert(errorMessage, "error");
        }
    }

    const handleCheckBox = (event, name) => {
        if (name === "is_sms_required") {
            if (event.target.checked)
                setIsSMS(true)
            else
                setIsSMS(false)
        }
        if (name === "is_email_required") {
            if (event.target.checked)
                setIsEmail(true)
            else
                setIsEmail(false)
        }
        if (name === "until_cancelled") {
            setIsCancelled(!isCancelled)
            if (!isCancelled) {
                setEndDate("")
                setValidationData(prevState => ({
                    ...prevState,
                    ["end_date"]: false
                }));
                setErrorMessage(prevState => ({
                    ...prevState,
                    ["end_date"]: ""
                }))
                removeKey("end_date")
            }
        }
        if (name !== "until_cancelled")
            setStateData({ ...stateData, [name]: event.target.checked ? true : false });
    }

    const customerFields = [
        {
            label: "Title",
            name: "customer_title",
            isDropdown: true,
            options: [{ id: "Mr.", label: "Mr." }, { id: "Mrs.", label: "Mrs." }, { id: "Ms.", label: "Ms." }],
            customClass: [{ width: "21%", height: "56px" , marginBottom:"23px"}, { width: "21%", height: "56px"}],
            customDropdownClass: { ...customDropDownCss, minHeight: "161px" },
            type: "Dropdown",
            isRequired: false,
            validationType: "title"
        },
        {
            label: "Full Name*",
            name: "customer_name",
            isDropdown: false,
            options: [],
            customClass: { maxWidth: "none", width: "74%", height: "56px" },
            customDropdownClass: {},
            type: "Input",
            isRequired: false,
            validationType: "string"
        },
        {
            label: "Code",
            name: "customer_mobile_code",
            isDropdown: true,
            options: [{ id: "+91", label: "+91" }],
            customClass: { width: "21%", height: "56px" },
            customDropdownClass: { ...customDropDownCss, minHeight: "161px" },
            initialValue: "+91",
            type: "Dropdown",
            isRequired: false,
            validationType: "string"
        },
        {
            label: "Phone Number*",
            name: 'customer_mobile_no',
            isDropdown: false,
            options: [],
            customClass: { maxWidth: "none", width: "74%", height: "56px" },
            customDropdownClass: {},
            isRequired: false,
            type: "Input",
            validationType: "mobile"
        },
        {
            label: "Email ID",
            name: "customer_email_id",
            isDropdown: false,
            options: [],
            customClass: { maxWidth: "none", width: "47.5%", height: "56px" },
            customDropdownClass: {},
            type: "Input",
            isRequired: false,
            validationType: "email"
        },
        {
            label: "PAN*",
            name: "customer_pan",
            isDropdown: false,
            options: [],
            customClass: { maxWidth: "none", width: "47.5%", height: "56px" },
            customDropdownClass: {},
            type: "Input",
            isRequired: false,
            validationType: "pan"
        },
      
    ]

    const subscriptionFields = [
        {
            label: "External Ref No.*",
            name: "external_ref_num",
            isDropdown: false,
            options: [],
            customClass: { maxWidth: "none", width: "47.5%", height: "56px" },
            customDropdownClass: {},
            type: "Input",
            isRequired: false,
            validationType: "string"
        },
        {
            label: "Debit Frequency*",
            name: "emi_frequency",
            isDropdown: true,
            options: [
                { id: "Daily.", label: "Daily", value: "DAIL" },
                { id: "Weekly", label: "Weekly", value: "WEEK" },
                { id: "Monthly", label: "Monthly", value: "MNTH" },
                { id: "Bi- Monthly", label: "Bi- Monthly", value: "BIMN" },
                { id: "Yearly", label: "Yearly", value: "YEAR" },
                { id: "Adhoc", label: "Adhoc", value: "ADHO" },
                { id: "Intra Day", label: "Intra Day", value: "INDA" },
                { id: "RCUR", label: "RCUR", value: "RCUR" },
                { id: "Semi-annually", label: "Semi-annually", value: "MIAN" }
            ],
            customClass: { maxWidth: "none", width: "47.5%", height: "56px" },
            customDropdownClass: { ...customDropDownCss, marginTop: "8px" },
            type: "Dropdown",
            isRequired: false,
            validationType: "string"
        },
        {
            label: "Amount Type*",
            name: "amount_type",
            isDropdown: true,
            options: [
                { id: "Fixed Amount", label: "Fixed Amount", value: "FIXED_AMOUNT" },
                { id: "Maximum amount", label: "Maximum amount", value: "MAXIMUM_AMOUNT" },
            ],
            customClass: { maxWidth: "none", width: "47.5%", height: "56px" },
            customDropdownClass: { ...customDropDownCss, marginTop: "8px", minHeight: "131px" },
            type: "Dropdown",
            isRequired: false,
            validationType: "string"
        },
        {
            label: "Amount*",
            name: "amount",
            isDropdown: false,
            options: [],
            customClass: { maxWidth: "none", width: "47.5%", height: "56px" },
            customDropdownClass: {},
            type: "Input",
            isRequired: false,
            validationType: "float"
        },
        {
            label: "Start Date",
            name: "start_date",
            value: startDate,
            setValue: setStartDate,
            type: "Date",
            validationType: "date",
            isRequired: true

        },
        {
            label: "End Date",
            name: "end_date",
            value: endDate,
            setValue: setEndDate,
            type: "Date",
            isDisabled: isCancelled,
            validationType: "date",
            isRequired: !isCancelled,
        },
        {
            label: "E-Nach Reason*",
            name: "enach_reason",
            isDropdown: false,
            options: [],
            customClass: { maxWidth: "none", width: "47.5%", height: "56px", marginTop: "-10px" },
            customDropdownClass: {},
            type: "Input",
            isRequired: false,
            validationType: "string"
        },
        {
            label: "SMS",
            name:"is_sms_required",
            isRequired: false,
            type: "checkbox",
            value: isSMS
        },
        {
            label: "Email",
            name:"is_email_required",
            isRequired: false,
            type: "checkbox",
            value: isEmail
        },
        {
            label: "Purpose of Mandate*",
            name: "purpose_of_mandate",
            isDropdown: true,
            options: mandatePurpose,
            customClass: { maxWidth: "none", width: "98%", height: "56px" },
            customDropdownClass: { ...customDropDownCss, marginTop: "8px", minHeight: "315px" },
            type: "Dropdown",
            isRequired: false, 
            validationType: "string",
            initialValue: defaultMandatePurpose?.label,
        },
    ]

    const bankFields = [
        {
            label: "Bank Name*",
            name: "bank",
            isDropdown: true,
            options: liveBanks,
            customClass: { maxWidth: "none", width: "47.5%", height: "56px" },
            customDropdownClass: {...customDropDownCss, marginTop: "8px", minHeight: "131px" },
            type: "Dropdown",
            isRequired: true,
            validationType: "string"
        },
        {
            label: "Bank Account Number*",
            name: "account_no",
            isDropdown: false,
            options: [],
            customClass: { maxWidth: "none", width: "47.5%", height: "56px", padding:"8px 0px" },
            customDropdownClass: {},
            customInputClass: { maxWidth: "none", width: "100%" },
            type: "Input",
            isRequired: true,
            validationType: "alphanumEmpty"
        },
        {
            label: "Bank IFSC*",
            name: "ifsc_code",
            isDropdown: false,
            options: [],
            customClass: { maxWidth: "none", width: "47.5%", height: "56px" },
            type: "Input",
            isRequired: true,
            validationType: "ifsc"
        },
        {
            label: "Account Type*",
            name: "account_type",
            isDropdown: true,
            options: [
                { id: "Savings", label: "Savings", value: "SAVINGS" },
                { id: "Current", label: "Current", value: "CURRENT" },
            ],
            customClass: { maxWidth: "none", width: "47.5%", height: "56px" },
            customDropdownClass: { ...customDropDownCss, marginTop: "8px", minHeight: "131px" },
            type: "Dropdown",
            isRequired: true,
            validationType: "alphanumEmpty"
        },
        {
            label: "Authentication Mode",
            name: "authentication_mode",
            isDropdown: true,
            options: authenticationModes,
            customClass: { maxWidth: "none", width: "47.5%", height: "56px", padding:"8px 0px" },
            customDropdownClass: { ...customDropDownCss, marginTop: "8px", minHeight: "161px" , marginLeft:"3px"},
            type: "Dropdown",
            isRequired: false,
            validationType: "string"
        },
    ]
    return (
        <>
        <FormPopup
             heading="Create Registration"
            isOpen={openDialog}
            onClose={onModalClose}
            customHeaderStyle={{
                fontSize: "24px",
                fontFamily: "Montserrat-Bold",
                fontWeight: "700",
                lineHeight: "150%",
                color: "#303030"
            }}
            customStyles={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                width: "543px",
                height: "100%",
                padding: "24px",
                borderRadius: "8px",
                background: "#FFF",
                marginLeft: "35.5%",
                overflowY: "scroll"
            }}
            customStyles1={{
                display: "flex",
                height: "100%",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start"
            }}
        >
            <div style={{ display: "flex", width: "100%", alignItems: "flex-start", flexDirection: "column", gap: "24px", marginBottom: "24px" ,fontFamily: "Montserrat-Regular"}}>
                <SelectCompany
                    placeholder="Company"
                    company={company}
                    onCompanyChange={value => {
                        setCompany(value);
                        setStateData({ ...stateData, ["company_id"]: value.value })
                        if (value)
                            setCompanyError(false)
                    }}
                    isDisabled={companyUser}
                    error={companyError}
                    helperText={"Please select a company"}
                    customStyle={customDropDownCss}
                    height="56px"
                    width="98%"
                    maxWidth="none"
                />
                <div style={{
                    color: "var(--neutral-60, #767888)",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "600",
                    lineHeight: "150%"
                }}>
                    CUSTOMER DETAILS
                </div>
                <div style={{ display: "flex", flexDirection: "row", rowGap: "24px", columnGap: "16px", flexWrap: "wrap" }}>
                    {customerFields.map((item, index) => {
                        return (
                            <InputBox
                                key={index}
                                label={item?.label}
                                isDrawdown={item?.isDropdown}
                                options={item?.options}
                                initialValue={stateData[item.name] ?? ""}
                                error={validationData[item?.name]}
                                helperText={errorMessage[item?.name]}
                                onClick={(event) => handleChange(event, item?.name, item?.type, item?.validationType)}
                                customClass={item.label === "Title" ? validationData[item?.name] ? item?.customClass[0] :item?.customClass[1] :   item?.customClass}
                                customDropdownClass={item?.customDropdownClass}
                                isRequired={item?.isRequired}
                            />
                        )
                    })
                    }
                </div>
                <div style={{
                    color: "var(--neutral-60, #767888)",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "600",
                    lineHeight: "150%"
                }}>
                     REGISTRATION DETAILS
                </div>
                <div style={{ display: "flex", flexDirection: "row", rowGap: "24px", columnGap: "16px", flexWrap: "wrap" }}>
                    {subscriptionFields.map((item, index) => {
                        return (
                            (item?.type === "Input" || item?.type === "Dropdown" ? (
                                <InputBox
                                    key={index}
                                    label={item?.label}
                                    isDrawdown={item?.isDropdown}
                                    options={item?.options}
                                    initialValue={item?.initialValue}
                                    error={validationData[item?.name]}
                                    helperText={errorMessage[item?.name]}
                                    onClick={(event) => handleChange(event, item?.name, item?.type, item?.validationType)}
                                    customClass={item?.customClass}
                                    customDropdownClass={item?.customDropdownClass}
                                    isRequired={item?.isRequired}
                                />
                            ) : (item?.type === "Date" ?
                                <div style={{ display: "flex", flexDirection: "column", width: "47.5%" }}>
                                    <div>
                                        <BasicDatePicker
                                            placeholder={item?.label}
                                            value={item?.value || null}
                                            error={validationData[item?.name]}
                                            helperText={errorMessage[item?.name]}
                                            disabled={item?.isDisabled ? item?.isDisabled : false}
                                            onDateChange={date => {
                                                item?.setValue(
                                                    verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
                                                        ? moment(date).format("YYYY-MM-DD")
                                                        : date
                                                );
                                                let verifiedDate = verifyDateAfter1800(moment(date).format("YYYY-MM-DD")) ? moment(date).format("YYYY-MM-DD") : date
                                                handleChange(verifiedDate, item?.name, item?.type, item?.validationType)
                                            }}
                                            style={{ width: "100%", borderRadius: "8px" }}
                                        />
                                    </div>
                                    {item?.label === "End Date" ?
                                        <div style={{ display: "flex", alignItems: "baseline", marginTop: "8px", justifyContent: "flex-end" }}>
                                            <input style={{ marginRight: "8px" }} checked={isCancelled} onClick={(event) => { handleCheckBox(event, "until_cancelled") }} type="radio" id="until-cancelled-input" />
                                            <label style={{
                                                color: "var(--neutral-neutral-100, #141519)",
                                                fontFamily: "Montserrat-Medium",
                                                fontSize: "14px",
                                                fontStyle: "normal",
                                                fontWeight: "500",
                                                lineHeight: '20px'
                                            }}
                                            htmlFor="until-cancelled-input">Until cancelled</label>
                                        </div>
                                        : null}
                                </div>
                                : (item?.type === "checkbox" ?
                                    (
                                        <div style={{ display: "flex", alignItems: "baseline", marginTop: "5px" }}>
                                            <input style={{ marginRight: "8px" , backgroundColor:"#475BD8"}} checked={item?.value} onClick={(event) => { handleCheckBox(event, item?.name) }} type="checkbox" id={`${item.name}-input`} />
                                            <label style={{
                                                color: "var(--neutral-neutral-100, #141519)",
                                                fontFamily: "Montserrat-Medium",
                                                fontSize: "14px",
                                                fontStyle: "normal",
                                                fontWeight: "500",
                                                lineHeight: '20px'
                                            }}
                                            htmlFor={`${item.name}-input`}>{item?.label}</label>
                                        </div>
                                    )
                                    : null
                                )
                            ))
                        )
                    })
                    }
                </div>
                <div style={{
                    color: "var(--neutral-60, #767888)",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "600",
                    lineHeight: "150%"
                }}>
                    BANK DETAILS
                </div>
                <div style={{ display: "flex", flexDirection: "row", rowGap: "24px", columnGap: "16px", flexWrap: "wrap" }}>
                    {bankFields.map((item, index) => {
                        return (
                            <InputBox
                                key={index}
                                label={item?.label}
                                isDrawdown={item?.isDropdown}
                                options={item?.options}
                                error={validationData[item?.name]}
                                helperText={errorMessage[item?.name]}
                                onClick={(event) => handleChange(event, item?.name, item?.type, item?.validationType)}
                                customClass={item?.customClass}
                                customDropdownClass={item?.customDropdownClass}
                                customInputClass={item?.customInputClass}
                            />
                        )
                    })
                    }
                </div>
            </div>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    marginBottom: "24px",
                    marginTop: "40px"
                }}
            >
                <Button
                    id="create-subscription-cancel-button"
                    buttonType="secondary"
                    label="Cancel"
                    onClick={onModalClose}
                    customStyle={{
                        ...styleButton,
                        color: "#475BD8",
                        border: "1px solid #475BD8",
                        boxShadow: "none"
                    }}
                />

                <Button
                    id="create-subscription-cancel-button"
                    buttonType="primary"
                    label="Create"
                    onClick={
                        handleCreate
                    }
                    customStyle={styleButton}
                />
            </div>
        </FormPopup>
        {isLoading && <Preloader />}
        </>
    )
}


// APPLICANTDETAILS JSON

import {documentCode as DocumentListCode} from "msme/config/docCode"

export const KYCDocumentSelfieTittle = [
    {
        id: "Document_Selfie",
        name: "Applicant Selfie",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        acceptFileType: '.jpg, .jpeg, .png, .pdf',
        fileType:'file',
        documentCode: DocumentListCode.applicant_selfie,
        isRequired: true
    },
];

export const KYCDocumentPANTittle = [
    {
        id: "pan1",
        name: "PAN",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        acceptFileType: '.jpg, .jpeg, .png, .pdf',
        fileType: 'file',
        documentCode: DocumentListCode.applicant_pan,
        isRequired:true
    },
];

export const KYCDocumentPanXMLTittle = [
    {
        id: "panXML1",
        name: "PAN",
        fileSize: "XML/JSON  upto 5MB",
        acceptFileType: '.xml,.json',
        fileType: 'file',
        documentCode: DocumentListCode.applicant_pan_XML,
        isRequired: true
    },
];

export const KYCAadharTittle = [
    {
        id: "Aadhar_front1",
        name: "Aadhaar Front",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        acceptFileType:'.jpg, .jpeg, .png, .pdf',
        fileType: 'file',
        documentCode: DocumentListCode.applicant_aadhaar_front,
        isRequired: true
    },
    {
        id: "Aadhar_Back1",
        name: "Aadhaar Back (Optional)",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        acceptFileType: '.jpg, .jpeg, .png, .pdf',
        fileType: 'file',
        documentCode: DocumentListCode.applicant_aadhaar_back,
    },
];

export const AadharXML = [
    {
        id: "Aadhar_XML",
        name: "Aadhaar",
        fileSize: "XML/JSON  upto 5MB",
        acceptFileType: '.xml,.json',
        fileType: 'file',
        documentCode: DocumentListCode.applicant_aadhaar_XML,
        isRequired: true
    },
];

// COAPPLICANTFORM JSON

export const ApplicantSelfie = [
    {
        id: "Applicant_Selfie_1",
        name: "Applicant Photo",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        acceptFileType: '.jpg, .jpeg, .png, .pdf',
        fileType: 'file',
        documentCode: DocumentListCode.cb_selfie,
        isRequired: true
    },
];

export const PanInputTittle = [
    {
        id: "Pan_1",
        name: "PAN",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        acceptFileType: '.jpg, .jpeg, .png, .pdf',
        fileType: 'file',
        documentCode: DocumentListCode.cb_pan,
        isRequired: true
        
    },
];

export const PanInputTittleXML = [
    {
        id: "Pan_1",
        name: "PAN",
        fileSize: "XML/JSON  upto 5MB",
        acceptFileType: '.xml,.json',
        fileType: 'file',
        documentCode: DocumentListCode.cb_pan_XML,
        isRequired: true
    },
];

export const AadharInputTittle = [
    {
        id: "Aadhar_Front_1",
        name: "Aadhaar Front",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        acceptFileType: '.jpg, .jpeg, .png, .pdf',
        fileType: 'file',
        documentCode: DocumentListCode.cb_aadhaar_front,
        isRequired: true
    },
    {
        id: "Aadhar_Back_1",
        name: "Aadhaar Back (Optional)",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        acceptFileType: '.jpg, .jpeg, .png, .pdf',
        fileType: 'file',
        documentCode: DocumentListCode.cb_aadhaar_back,
        isRequired: false
    },
];


export const AadharInputTittleXML = [
    {
        id: "Aadhar_Front_1",
        name: "Aadhaar",
        fileSize: "XML/JSON  upto 5MB",
        acceptFileType: '.xml,.json',
        fileType: 'file',
        documentCode: DocumentListCode.cb_aadhaar_XML,
        isRequired: true
    },

];

// GuarantorKYC JSON

export const GuarantorSelfie = [
    {
        id: "Applicant_Selfie_1",
        name: "Applicant Photo",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        acceptFileType: '.jpg, .jpeg, .png, .pdf',
        fileType: 'file',
        documentCode: DocumentListCode.guar_selfie,
        isRequired:true
    },
];

export const Guarantor_PanTittle = [
    {
        id: "Pan_1",
        name: "PAN",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        acceptFileType: '.jpg, .jpeg, .png, .pdf',
        fileType: 'file',
        documentCode: DocumentListCode.guar_pan,
        isRequired:true
    },
];


export const AadharImage = [
    {
        id: "aadhar_front",
        name: "Aadhaar Front",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        acceptFileType: '.jpg, .jpeg, .png, .pdf',
        fileType: 'file',
        documentCode: DocumentListCode.guar_aadhaar_front,
        isRequired:true
    },

    {
        id: "Aadhar_back",
        name: "Aadhaar Back (Optional)",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        acceptFileType: '.jpg, .jpeg, .png, .pdf',
        fileType: 'file',
        documentCode: DocumentListCode.guar_aadhaar_back,
    },
];



export const Guarantor_PanInputTittleXML = [
    {
        id: "Pan_1",
        name: "PAN",
        fileSize: "XML/JSON upto 5MB",
        acceptFileType: '.xml,.json',
        fileType: 'file',
        documentCode: DocumentListCode.guar_pan_XML,
        isRequired:true
    },
];

export const Guarantor_AadharInputTittleXML = [
    {
        id: "Aadhar_Front_1",
        name: "Aadhaar",
        fileSize: "XML/JSON upto 5MB",
        acceptFileType: '.xml,.json',
        fileType: 'file',
        documentCode: DocumentListCode.guar_aadhaar_XML,
        isRequired:true
    },

];

//ENTITY JSON
export const GSTIN = [
    {
        id: "gst_certificate_value",
        name: "GSTIN Certificate",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        documentCode: DocumentListCode.gst_certificate
    },
];

export const URC_Certificate = [
    {
        id: 'urc_certificate_value',
        name: 'Udhyam Certificate',
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        documentCode: DocumentListCode.entity_udhyam_certificate,
    }
]

export const Shop_Establishment_Certificate = [
    {
        id: "udhyam_certificalte_value",
        name: "Upload Certificate",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        documentCode: DocumentListCode.entity_shop_establishment,
    },
];

export const Entity_KYC_Partnership_Upload = [
    {
        name: "MOA",
        id: "entity_kyc_partnerShip_moa",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        documentCode: DocumentListCode.entity_moa,
    },
    {
        name: "AOA",
        id: "entity_kyc_partnerShip_aoa",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        documentCode : DocumentListCode.entity_aoa,
    },
    {
        name: "By-laws",
        id: "entity_kyc_partnerShip_by_laws",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        documentCode : DocumentListCode.by_laws
    
    },
    {
        name: "Latest list of members",
        id: "entity_kyc_partnerShip_llom",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        documentCode : DocumentListCode.entity_list_members
    },
    {
        name: "Registration Certificate ",
        id: "entity_kyc_partnerShip_rc",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        documentCode : DocumentListCode.entity_registration_certificate
    },
    {
        name: "Authority Letter",
        id: "entity_kyc_partnerShip_al",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        documentCode : DocumentListCode.entity_authority_certificate
    },
];

export const Entity_KYC_Authority_Letter_Upload = [
    {
        name: "Authority Letter",
        id: "entity_kyc_partnerShip_als",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        documentCode : DocumentListCode.entity_authority_certificate
    }
];


//SHARE HOLDING
export const SHAREHOLDING = [
    {
        id: "certificate",
        name: "Shareholding Certificate",
        fileSize: "JPG, JPEG, PNG, PDF upto 5MB",
        acceptFileType: '.jpg, .jpeg, .png, .pdf',
        fileType:'file',
        documentCode : DocumentListCode.shareholding_pattern,
    },
];

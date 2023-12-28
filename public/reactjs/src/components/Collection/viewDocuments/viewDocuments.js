import React from 'react';
import { useState, useEffect} from "react";
import DocumentViewPopup from '../../../views/lending/DocumentViewPopup';
import { storedList } from "../../../util/localstorage";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    base64ToBlob,
} from "../../../util/collection/helper";
import {
    viewDocsWatcher
} from "../../../actions/loanDocuments"
import {
    viewLoanDocumentLogsWatcher
} from "../../../actions/collection/cases.action"


export default function ViewDocuments({ doc, userID, loanAppID, productID, companyID, viewDocumentComponent, setViewDocumentComponent }) {

    const dispatch = useDispatch();
    const user = storedList("user");
    const param = useLocation();
    const [viewDocument, setViewDocument] = useState(false);
    const [blobURL, setBlobUrl] = useState("");
    const [docKey, setDocKey] = useState("");
    const [docTitle, setDocTitle] = useState("");
    const [currentDoc, setCurrentDoc] = useState("");
    const [alert, setAlert] = useState("");
    const [fileData, setFileData] = useState("");
    const [fileName, setFileName] = useState("");
    const [docExtCode, setDocExtCode] = useState("");
    

    useEffect(() => {
        handleViewDoc(doc.file_url, doc.file_type, doc.file_type, doc.code, doc);
    }, [doc]);


    const handleDocumentPopUp = (pdf, fileType, field, doc, isDrawDown = false) => {

        try {
            let contentType = "application/pdf";

            if (pdf.indexOf(`data:${contentType};base64,`) >= 0) {
                pdf = pdf.replace(`data:${contentType};base64,`, "");
            }
            const blob = base64ToBlob(pdf, contentType);
            const blobUrl = URL.createObjectURL(blob);
            var file_name = doc.file_type;
            file_name = file_name[0].toUpperCase() + file_name.slice(1);
            file_name = file_name.replace(/_/g, " ");
            setBlobUrl(blobUrl);
            setDocKey("");
            setDocTitle(file_name);
            setCurrentDoc(doc);
            setDocExtCode(doc.code);
            setViewDocument(true);
        } catch (error) {

        }
    };

    const handleModalClose = () => {
        setViewDocument(false);
        setViewDocumentComponent(false);
        setAlert("");
        setFileData("");
        setFileName("");
    }

    const handleViewDoc = (awsurl, doctype, field, code, doc, isDrawDown = false) => {
        const user = storedList("user");
        let data = {
            awsurl,
            user_id: userID,
            loanAppID: loanAppID,
            company_id: companyID,
            product_id: productID,
        };
        dispatch(viewDocsWatcher(
            data,
            async (result) => {
                if (code === "130") {
                    try {
                        const buffer = Buffer.from(result.buffer);
                        const blob = await new Blob([buffer], {
                            type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                        });
                        const url = window.URL.createObjectURL(blob);
                        this.setState({ fileUrl: url }, () => {
                            const node = this.dowloadFileLinkRef.current;
                            node.download = result["originalname"];
                            node.click();
                        });

                    } catch (error) { }
                } else {
                    handleDocumentPopUp(result, doctype, field, doc);
                    // Call viewLoanDocumentLogsWatcher api
                    const payload = {
                        userID: userID,
                    };
                    new Promise((resolve, reject) => {
                        dispatch(viewLoanDocumentLogsWatcher(payload, resolve, reject));
                    })
                }
            },
            (error) => {

            }
        ))
    };

    return (
        <React.Fragment>
            <div>
                {viewDocument ? (
                    <DocumentViewPopup
                        title={docTitle}
                        handleClose={handleModalClose}
                        blobUrl={blobURL}
                        openDialog={viewDocument}
                        doc_key={docKey}
                        doc={currentDoc}
                    />
                ) : null}
            </div>
        </React.Fragment>
    );
}


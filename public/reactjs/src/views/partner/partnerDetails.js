import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  viewPartnerDetailsWatcher,
  fetchPartDocsWatcher,
  viewPartDocsWatcher
} from "../../actions/addPartner";
import { useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Typography from "@mui/material/Typography";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import Divider from "@mui/material/Divider";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import NavLink from "../../components/Link/navLink";
import DocumentViewPopup from "../lending/DocumentViewPopup";
import PartnerDocumentUploadPopup from "../lending/PartnerDocumentUploadPopup";
import { b64ToBlob } from "../../util/helper";
import { appendScript, removeScript } from "../../util/appendRemoveScript";

const PartnerDetails = props => {
  const { pid } = useParams();
  const dispatch = useDispatch();
  const [partnerData, setPartnerData] = useState(null);
  const [partnerDocumentArray, setPartnerDocumentArray] = useState([
    { name: "COI", code: "145" },
    { name: "MOA", code: "143" },
    { name: "AOA", code: "144" },
    { name: "Rating Document", code: "178" },
    { name: "Financials for last 2 Financial Years", code: "139" },
    { name: "Karza Report", code: "179" },
    { name: "Google Scan - Entity", code: "180" },
    { name: "Google Scan - Directors", code: "181" },
    { name: "Undertaking to make payment to Escrow Account", code: "182" },
    { name: "Anchor Approval CAM", code: "183" },
    { name: "Others", code: "009" }
  ]);
  const [viewDocument, setViewDocument] = useState(false);
  const [viewDocumentUpload, setViewDocumentUpload] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const labelStyle = {
    alignSelf: "center",
    fontSize: "14px"
  };

  const fieldStyle = {
    padding: "5px 10px 5px 10px",
    borderRadius: "5px",
    border: "1px solid #BFC1CD",
    background: "#F6F7F9",
    height: "auto",
    wordWrap: "break-word",
    width: "70%"
  };

  const formFieldStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "5px 0 10px 0"
  };
  useEffect(() => {
    appendScript(
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.min.js"
    );
    dispatch(
      viewPartnerDetailsWatcher(
        { partner_id: pid },
        async company => {
          setPartnerData(company);
        },
        error => {
        }
      )
    );
  }, []);

  useEffect(() => {
    if (partnerData?._id) fetchPartnerDocs();
  }, [partnerData]);

  useEffect(() => {
    if (currentDoc?.blobUrl) {
      setViewDocument(true);
    }
  }, [currentDoc]);

  const fetchPartnerDocs = () => {
    dispatch(
      fetchPartDocsWatcher(
        { company_id: pid },
        async docs => {
          let copyPartnerDocumentArray = JSON.parse(
            JSON.stringify(partnerDocumentArray)
          );
          docs?.data.forEach(element => {
            copyPartnerDocumentArray.forEach(item => {
              if (item.code === element.code) {
                item["doc_key"] = element.doc_key;
                item["file_url"] = element.file_url;
              }
            });
          });
          setPartnerDocumentArray(copyPartnerDocumentArray);
        },
        error => {
        }
      )
    );
  };

  const handleUploadDoc = doc => {
    setCurrentDoc(doc);
    setViewDocumentUpload(true);
  };

  const handleViewDoc = doc => {
    let data = {
      company_id: pid,
      file_url: doc.file_url
    };
    setCurrentDoc(doc);
    dispatch(
      viewPartDocsWatcher(
        { company_id: pid, file_url: doc.file_url },
        async docs => {
          handleDocumentPopUp(docs, null, doc);
        },
        error => {
        }
      )
    );
  };

  const handleDocumentPopUp = (pdf, field, doc) => {
    try {
      let contentType = "application/pdf";

      if (doc.code === "114" || doc.code === "116") {
        contentType = "text/*";
        pdf = pdf.replace(/^data:(.*,)?/, "");
      }

      if (pdf.indexOf(`data:${contentType};base64,`) >= 0)
        pdf = pdf.replace(`data:${contentType};base64,`, "");
      const blob = b64ToBlob(pdf, contentType);
      const blobUrl = URL.createObjectURL(blob);
      setCurrentDoc({
        blobUrl: blobUrl,
        doc_key: doc.doc_key,
        doc_title: doc.name,
        currentDoc: doc,
        code: doc.code
      });
    } catch (error) {
    }
  };
  return (
    <Grid container xs={12} style={{ padding: "10px 10px 0 40px" }}>
      {viewDocument ? (
        <DocumentViewPopup
          title={currentDoc?.doc_title}
          handleClose={() => {
            setViewDocument(false);
          }}
          blobUrl={currentDoc?.blobUrl}
          openDialog={viewDocument}
          doc_key={currentDoc?.doc_key}
          doc={currentDoc}
        />
      ) : null}
      {viewDocumentUpload ? (
        <PartnerDocumentUploadPopup
          handleClose={() => {
            setViewDocumentUpload(false);
          }}
          openDialog={viewDocumentUpload}
          doc={currentDoc}
          refreshLoanDocs={() => {
            fetchPartnerDocs();
          }}
          loanData={{
            company_id: pid
          }}
        />
      ) : null}
      {partnerData && (
        <Grid item xs={6}>
          <Grid item xs={12}>
            <Typography style={{ margin: "20px 20px 10px 0" }}>
              <HowToRegIcon style={{ marginRight: "10px" }} />
              Partner Details
            </Typography>

            <Grid item xs={12} style={formFieldStyle}>
              <Typography style={labelStyle}>Company ID</Typography>
              <Typography style={fieldStyle}>{partnerData._id}</Typography>
            </Grid>
            <Grid item xs={12} style={formFieldStyle}>
              <Typography style={labelStyle}>Company Name</Typography>
              <Typography style={fieldStyle}>{partnerData.name}</Typography>
            </Grid>
            <Grid item xs={12} style={formFieldStyle}>
              <Typography style={labelStyle}>CIN</Typography>
              <Typography style={fieldStyle}>{partnerData.cin}</Typography>
            </Grid>
            <Grid item xs={12} style={formFieldStyle}>
              <Typography style={labelStyle}>GSTIN</Typography>
              <Typography style={fieldStyle}>{partnerData.gstin}</Typography>
            </Grid>
            <Grid item xs={12} style={formFieldStyle}>
              <Typography style={labelStyle}>Address</Typography>
              <Typography style={fieldStyle}>
                {partnerData.company_address}
              </Typography>
            </Grid>
            <Grid item xs={12} style={formFieldStyle}>
              <Typography style={labelStyle}>Website</Typography>
              <Typography style={fieldStyle}>{partnerData.website}</Typography>
            </Grid>
            <Grid item xs={12} style={formFieldStyle}>
              <Typography style={labelStyle}>Business Phone</Typography>
              <Typography style={fieldStyle}>
                {partnerData.business_phone}
              </Typography>
            </Grid>
            <Grid item xs={12} style={formFieldStyle}>
              <Typography style={labelStyle}>LMS Version</Typography>
              <Typography style={fieldStyle}>
                {partnerData.lms_version}
              </Typography>
            </Grid>
            <Grid item xs={12} style={formFieldStyle}>
              <Typography style={labelStyle}>Short Code</Typography>
              <Typography style={fieldStyle}>
                {partnerData.short_code || "NA"}
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <Grid item xs={12}>
            <Typography style={{ margin: "10px 20px 10px 0" }}>
              <HowToRegIcon style={{ marginRight: "10px" }} />
              Director Details
            </Typography>
            {partnerData.directors.map((director, index) => {
              return (
                <Grid
                  key={`Director ${index + 1}`}
                  item
                  xs={12}
                  style={formFieldStyle}
                >
                  <Typography style={labelStyle}>{`Director ${index + 1
                    }`}</Typography>
                  <Typography style={fieldStyle}>{director}</Typography>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      )}

      <Grid item xs={6}>
        <Typography style={{ marginTop: "20px" }}>
          <TextSnippetIcon style={{ marginRight: "10px" }} />
          Documents
        </Typography>
        <Grid
          container
          rowSpacing={{ xs: 1 }}
          columnSpacing={{ xs: 1 }}
          style={{
            marginLeft: "20px",
            minHeight: "400px",
            marginTop: "10px"
          }}
        >
          {partnerDocumentArray.length &&
            partnerDocumentArray.map((item, index) => {
              return (
                <Grid
                  item
                  key={`${item.name}-${index}`}
                  xs={3}
                  style={{
                    padding: "0"
                  }}
                >
                  <div
                    style={{
                      margin: "5px auto",
                      width: "95%",
                      border: "1px solid #ccc",
                      height: "95%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-evenly"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        justifyContent: "space-evenly"
                      }}
                    >
                      <FileOpenIcon />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: "14px",
                        margin: "0 8px",
                        textAlign: "center"
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center"
                      }}
                    >
                      <>
                        {item?.file_url && (
                          <Grid xs={3} justifyContent={"center"}>
                            <NavLink
                              disabled={false}
                              handleClick={() => {
                                handleViewDoc(item);
                              }}
                              linkItem={"View"}
                            ></NavLink>
                          </Grid>
                        )}
                        <Grid item xs={6} justifyContent={"center"}>
                          <NavLink
                            disabled={false}
                            handleClick={() => {
                              handleUploadDoc(item);
                            }}
                            linkItem={"Upload"}
                          ></NavLink>
                        </Grid>
                      </>
                    </div>
                  </div>
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default PartnerDetails;

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TabPanel from "../../components/tabPanel";
import DrawDown from "../../components/drawDown";
import ReactBSAlert from "react-bootstrap-sweetalert";
import DocumentViewPopup from "./DocumentViewPopup";
import DocumentUploadPopup from "./DocumentUploadPopup";
import { appendScript, removeScript } from "../../util/appendRemoveScript";
import { b64ToBlob } from "../../util/helper";
import CustomizeTemplates from "../loanSchema/templateTabs";
import { tempXlsxToJsonWatcher } from "../../actions/loanType";
import CloseIcon from "@mui/icons-material/Close";
import {
  getLoanDocsWatcher,
  getProductDetailsWatcher,
  getDocDetailsWatcher,
  uploadLoanDocumentsWatcher,
  viewDocsWatcher,
  uploadDrawDownDocumentsWatcher,
  uploadLoanDocumentsXmlJsonWatcher,
  getDrawDownDocsWatcher
} from "../../actions/loanDocuments";
import { storedList } from "../../util/localstorage";
import { getBorrowerDetailsByIdWatcher } from "../../actions/borrowerInfo";
import { checkAccessTags } from "../../util/uam";
import { document } from "../../config/borrower";
import UploadCard from "react-sdk/dist/components/UploadCard"
const user = storedList("user");

class LoanDocList extends Component {
  constructor(props) {
    super(props);
    const URLdata = window.location.href;
    this.state = {
      loanType: "",
      docArray: [],
      isReportUploaded: false,
      docExtCode: "",
      tabIndex: 0,
      alert: false,
      templatesData: ["pre_approval", "post_approval", "post_disbursal"],
      company_id: URLdata.split("/").slice(-4)[0],
      product_id: URLdata.split("/").slice(-3)[0],
      loan_app_id: URLdata.split("/").slice(-2)[0],
      mode: URLdata.split("/").slice(-1)[0],
      doc_stage: "pre_approval",
      loanDocs: [],
      docCode: "",
      defaultLoanType: "",
      severity: "",
      alertMessage: "",
      fileData: null,
      fileName: "",
      loanData: "",
      showButton: true,
      fileUrl: "",
      doc_key: "",
      viewDocument: false,
      viewDocumentUpload: false,
      doc_title: "",
      currentDoc: "",
      passwordProtectedPDF: false,
      popupContent: false
    };
    this.dowloadFileLinkRef = React.createRef();
  }

  isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  getLoanDocs = () => {
    const user = storedList("user");
    const URLdata = window.location.href;
    const params = {
      company_id: this.state.company_id,
      product_id: this.state.product_id,
      doc_stage: this.state.doc_stage,
      loan_app_id: this.state.loan_app_id,
      user_id: user._id
    };
    new Promise((resolve, reject) => {
      this.props.getLoanDocsWatcher(params, resolve, reject);
    })
      .then((result) => {
        let new_result;
        if (this.state.mode == "xml") {
          new_result = result.filter(function (doc) {
            if (doc.name == "Aadhaar XML" || doc.code == "114") {
              return true;
            }
            if (doc.name == "PAN XML" || doc.code == "116") {
              return true;
            } else {
              return false;
            }
          });
          this.setState({ loanDocs: new_result });
          
        } else {
          new_result = result.filter(function (doc) {
            if (doc.name == "Aadhaar XML" || doc.code == "114") {
              return false;
            }
            if (doc.name == "PAN XML" || doc.code == "116") {
              return false;
            } else {
              return true;
            }
          });
          this.setState({ loanDocs: new_result });
        }
        let docExtArray = [];
        for (let ele of this.state.docArray) {
          if (ele.doc_code === this.state.currentDoc.code)
            docExtArray = ele.doc_ext;
        }
        if (
          docExtArray.includes(".xlsx") ||
          docExtArray.includes(".xls") ||
          docExtArray.includes(".csv")
        ) {
          this.setState({ isReportUploaded: true });
        }
        if (URLdata.split("/").slice(-8)[0] === "view_co_lender_cases") {
          this.setState({ showButton: false });
        }
      })
      .catch((error) => {
        this.handleResponsePopUp(
          error.response.data.message,
          "Error",
          true,
          false
        );

        this.setState({
          alert: true,
          severity: "error",
          alertMessage: error.response.data.message
        });
        setTimeout(() => {
          this.handleAlertClose();
        }, 4000);
      });
  };

  getProductDetails = () => {
    const user = storedList("user");
    const params = {
      product_id: this.state.product_id,
      user_id: user._id
    };
    new Promise((resolve, reject) => {
      this.props.getProductDetailsWatcher(params, resolve, reject);
    })
      .then((result) => {
        this.setState({ product_data: result });
        if (result.allow_loc == 1) {
          const data = this.state.templatesData;
          data.push("draw_down_document");
          this.setState({ templatesData: data });
        }
      })
      .catch((error) => {
        this.handleResponsePopUp(
          error.response.data.message,
          "Error",
          true,
          false
        );

        this.setState({
          alert: true,
          severity: "error",
          alertMessage: error.response.data.message
        });
        setTimeout(() => {
          this.handleAlertClose();
        }, 4000);
      });
  };

  getDocDetails = () => {
    const user = storedList("user");
    const params = {
      product_id: this.state.product_id,
      user_id: user._id
    };
    new Promise((resolve, reject) => {
      this.props.getDocDetailsWatcher(params, resolve, reject);
    })
      .then((result) => {
        this.setState({ product_data: result, docArray: result });
      })
      .catch((error) => {
        this.setState({
          alert: true,
          severity: "error",
          alertMessage: "unable to fetch doc details"
        });
        setTimeout(() => {
          this.handleAlertClose();
        }, 4000);
      });
  };

  getDrawDownDocs = () => {
    const user = storedList("user");
    const params = {
      company_id: this.state.company_id,
      product_id: this.state.product_id,
      doc_stage: this.state.doc_stage,
      loan_app_id: this.state.loan_app_id,
      user_id: user._id
    };

    new Promise((resolve, reject) => {
      this.props.getDrawDownDocsWatcher(params, resolve, reject);
    })
      .then((result) => {
        // this.setState({ loanDocs: result });
        this.setState({ drawDocs: result });
      })
      .catch((error) => {
        this.handleResponsePopUp(
          error.response.data.message,
          "Error",
          true,
          false
        );

        this.setState({
          alert: true,
          severity: "error",
          alertMessage: error.response.data.message
        });
        setTimeout(() => {
          this.handleAlertClose();
        }, 4000);
      });
  };

  componentDidMount = () => {
    if (
      this.isTagged &&
      checkAccessTags([
        "tag_documents_read",
        "tag_documents_read_write",
        "tag_loan_queue_read_write"
      ])
    ) {
      this.getLoanDocs();
      this.getProductDetails();
      this.getDocDetails();
    }

    if (!this.isTagged) {
      this.getProductDetails();
      this.getDocDetails();
      this.getLoanDocs();
    }
    appendScript(
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.min.js"
    );
  };

  componentDidUnmount() {
    removeScript(
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.min.js"
    );
  }

  changeActiveTab = (name) => {
    this.setState({ doc_stage: name}, () => {
      this.getLoanDocs();
      this.getDocDetails();
    });
  };

  handleAlertClose = () => {
    this.setState({ severity: "", alertMessage: "", alert: false });
  };

  handleModalClose = () => {
    this.setState({
      viewDocument: false,
      alert: "",
      fileData: "",
      fileName: "",
      viewDocumentUpload: false
    });
  };

  refreshLoanDocs = () => {
    this.getLoanDocs();
    this.getDocDetails();
  };

  handleResponsePopUp = (message, title, success, error) => {
    this.setState({
      alert: (
        <ReactBSAlert
          success={success}
          error={error}
          style={{ display: "block", marginTop: "-250px" }}
          title={title}
          onConfirm={() => this.handleModalClose()}
          confirmBtnBsStyle="success"
          btnSize="md"
        >
          {message}
        </ReactBSAlert>
      )
    });
  };

  handleUploadDrawFile = (usageId, code) => {
    const user = storedList("user");
    this.setState({ docCode: code });
    if (!this.state.docCode) {
      return this.handleResponsePopUp(
        "Please select document type",
        "Error",
        false,
        true
      );
    }
    if (!usageId || usageId == "") {
      return this.handleResponsePopUp(
        "Please enter a valid Usage/Request ID",
        "Error",
        false,
        true
      );
    }
    if (!this.state.fileData) {
      return this.handleResponsePopUp(
        "Please select file",
        "Error",
        false,
        true
      );
    }
    const data = {
      submitData: {
        loan_app_id: this.state.loan_app_id,
        drawdown_request_id: usageId,
        doc: [{ code: code, base64pdfencodedfile: this.state.fileData }]
      },
      userData: {
        company_id: this.state.company_id,
        product_id: this.state.product_id,
        user_id: user._id
      }
    };

    new Promise((resolve, reject) => {
      this.props.uploadDrawDownDocumentsWatcher(data, resolve, reject);
    })
      .then((result) => {
        delete data.submitData.base64pdfencodedfile;
        delete data.submitData.fileType;
        this.setState({
          fileData: "",
          fileName: "",
          docCode: ""
        });
        this.getDrawDownDocs(data);
        this.handleResponsePopUp(
          result.uploadDocumentData.message,
          "Success",
          true,
          false
        );
      })
      .catch((error) => {
        this.setState({
          docCode: ""
        });
        this.handleResponsePopUp(error?.response?.data, "Error", false, true);
      });
  };

  handleDrawDownDocumentPopUp = (pdf, fileType) => {
    if (pdf.indexOf("data:application/pdf;base64,") >= 0) {
      pdf = pdf.replace("data:application/pdf;base64,", "");
    }
    const contentType = "application/pdf";
    const blob = b64ToBlob(pdf, contentType);
    const blobUrl = URL.createObjectURL(blob);
    this.setState({
      popupContent: (
        <ReactBSAlert
          style={{
            display: "block",
            marginTop: "-350px",
            width: "900px",
            padding: "15px 4px 3px 3px",
            position: "relative"
          }}
          title={fileType}
          confirmBtnBsStyle="success"
          btnSize="md"
          showConfirm={false}
        >
          <div>
            <button
              type="button"
              className="close"
              style={{
                position: "absolute",
                top: "21px",
                right: "20px",
                zIndex: "999"
              }}
              onClick={() => this.setState({ popupContent: false })}
            >
              <CloseIcon />
            </button>
            <iframe
              src={blobUrl}
              type="application/pdf"
              width="100%"
              height="450px"
            />
          </div>
        </ReactBSAlert>
      )
    });
  };

  handleDocumentPopUp = (pdf, fileType, field, doc, isDrawDown = false) => {
    if (isDrawDown) {
      this.handleDrawDownDocumentPopUp(pdf, fileType);
    } else {
      try {
        let contentType = "application/pdf";

        if (document["xmlJsonType"]["get"].includes(field)) {
          contentType = "text/*";
          pdf = pdf.replace(/^data:(.*,)?/, "");
        }

        if (pdf.indexOf(`data:${contentType};base64,`) >= 0)
          pdf = pdf.replace(`data:${contentType};base64,`, "");
        const blob = b64ToBlob(pdf, contentType);
        const blobUrl = URL.createObjectURL(blob);

        this.setState(
          {
            blobUrl: blobUrl,
            doc_key: doc.doc_key,
            doc_title: doc.name,
            currentDoc: doc,
            docExtCode: doc.code
          },
          () => {
            this.setState({ viewDocument: true });
          }
        );
      } catch (error) {

      }
    }
  };

  handleViewDoc = (awsurl, doctype, field, code, doc, isDrawDown = false) => {
    const user = storedList("user");
    let data = {
      company_id: this.state.company_id,
      product_id: this.state.product_id,
      loan_app_id: this.state.loan_app_id,
      awsurl,
      user_id: user._id
    };
    new Promise((resolve, reject) => {
      this.props.viewDocsWatcher(data, resolve, reject);
    })
      .then(async (result) => {
        if (isDrawDown) {
          this.handleDocumentPopUp(result, doctype, field, doc, true);
        } else if (code === "130") {
          try {
            const buffer = Buffer.from(result.buffer);
            const blob = await new Blob([buffer], {
              type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            const url = window.URL.createObjectURL(blob);
            //const url = window.URL.createObjectURL(new Blob([result.buffer]));

            this.setState({ fileUrl: url }, () => {
              const node = this.dowloadFileLinkRef.current;
              node.download = result["originalname"];
              node.click();
            });
          } catch (error) { }
        } else {
          this.handleDocumentPopUp(result, doctype, field, doc);
        }
      })
      .catch((error) => {
      });
  };

  render() {
    const { classes, light } = this.props;
    const {
      templatesData,
      loanType,
      tabIndex,
      severity,
      alertMessage,
      defaultLoanType,
      alert,
      viewDocument,
      blobUrl,
      doc_key,
      doc_title,
      currentDoc,
      viewDocumentUpload,
      docArray
    } = this.state;

    const loantypeData =
      defaultLoanType && defaultLoanType
        ? defaultLoanType.map(type => {
          const obj = type;
          obj.value = type._id;
          obj.label = type.name;
          return obj;
        })
        : [{ value: "", label: "No records", isDisabled: true }];

    const handleBackToLoanQueue = () => {
      const url = "/admin/lending/loan_queue";
      this.props.history.push(url);
    };

    return (
      <>
        {this.state.popupContent !== false ? (
          <div>{this.state.popupContent}</div>
        ) : null}
        {viewDocument ? (
          <DocumentViewPopup
            title={doc_title}
            handleClose={this.handleModalClose}
            blobUrl={blobUrl}
            openDialog={viewDocument}
            doc_key={doc_key}
            doc={currentDoc}
          />
        ) : null}

        {viewDocumentUpload ? (
          <DocumentUploadPopup
            handleClose={this.handleModalClose}
            openDialog={viewDocument}
            doc={currentDoc}
            docArray={docArray}
            refreshLoanDocs={this.refreshLoanDocs}
            loanData={{
              company_id: this.state.company_id,
              product_id: this.state.product_id,
              loan_app_id: this.state.loan_app_id
            }}
          />
        ) : null}
        <a
          style={{ display: "none" }}
          download=""
          href={this.state.fileUrl}
          ref={this.dowloadFileLinkRef}
          rel="noopener noreferrer"
          target="_blank"
        />
        <div>
          {alert}
          <div>
            <div>
              <div>
                <CustomizeTemplates
                  templatesdata={["PRE APPROVAL", "POST APPROVAL", "POST DISBURSAL"]}
                  initialState = {"PRE APPROVAL"}
                  onIndexChange={(tabName) =>{
                    tabName = tabName.toLowerCase().replace(/\s+/g, '_')
                    this.changeActiveTab(tabName)
                  }
                  }
                />
              </div>
            </div>
            {this.state.doc_stage !== "draw_down_document" ? (
              <div >
                <div >
                  {this.state.loanDocs &&
                    Object.keys(this.state.loanDocs).map((template, index) => {
                      return (
                        <TabPanel value={tabIndex} index={index} key={template}>
                          <div style={{
                            display: "grid",
                            gridColumnGap: 0,
                            marginTop:"30px",
                            gridTemplateColumns: "25% 25% 25% 25%"
                          }}>
                            {this.state.loanDocs &&
                              this.state.loanDocs.map((doc, id) => {
                                if(window.location.href.split("/").slice(-8)[0] === "view_co_lender_cases" && !doc.value)
                                return(<></>)
                                else
                                return (
                                  <UploadCard
                                    key={id}
                                    hasDocument={doc.value ? true : false}
                                    heading={doc.name}
                                    isRequired={doc.checked === "TRUE" ? true : false}
                                    uploadOnClick={() => {
                                      this.setState(
                                        { currentDoc: doc },
                                        () => {
                                          this.setState({
                                            viewDocumentUpload: true
                                          });
                                        }
                                      );
                                    }}
                                    viewOnClick={() =>
                                      this.handleViewDoc(
                                        doc.value,
                                        doc.name,
                                        doc.field,
                                        doc.code,
                                        doc
                                      )
                                    }
                                    viewDisabled={
                                      this.isTagged
                                        ? !checkAccessTags([
                                          "tag_documents_read_write",
                                          "tag_documents_read",
                                          "tag_lead_list_read_write",
                                          "tag_loan_queue_read_write",
                                          "tag_collateral_read_write",
                                          "tag_loan_documents_read_write",
                                          "tag_loan_documents_read"
                                        ])
                                        : false
                                    }
                                    uploadDisabled={
                                      this.isTagged
                                        ? !checkAccessTags([
                                          "tag_documents_read_write",
                                          "tag_lead_list_read_write",
                                          "tag_loan_queue_read_write",
                                          "tag_collateral_read_write",
                                          "tag_loan_documents_read_write"
                                        ])
                                        : false
                                    }
                                    uploadRevoke={window.location.href.split("/").slice(-8)[0] === "view_co_lender_cases" ? true : false}
                                  />
                                );
                              })}
                          </div>
                        </TabPanel>
                      );
                    })}
                </div>
              </div>
            ) : (
              <DrawDown
                getDrawDownDocs={this.getDrawDownDocs}
                state={this.state}
                handleViewDoc={this.handleViewDoc}
              ></DrawDown>
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      tempXlsxToJsonWatcher,
      getLoanDocsWatcher,
      getProductDetailsWatcher,
      getDocDetailsWatcher,
      uploadLoanDocumentsWatcher,
      uploadLoanDocumentsXmlJsonWatcher,
      viewDocsWatcher,
      getBorrowerDetailsByIdWatcher,
      uploadDrawDownDocumentsWatcher,
      getDrawDownDocsWatcher
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(LoanDocList);

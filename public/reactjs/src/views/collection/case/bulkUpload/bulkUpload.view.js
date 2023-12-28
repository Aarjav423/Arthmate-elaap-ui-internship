import {
  assignCollectionCasesWatcher,
  getCollectionCaseCollIdsWatcher,
} from "../../../../actions/collection/cases.action";
import { getFosUsersWatcher } from "../../../../actions/collection/user.action";
import useDimensions from "hooks/useDimensions";
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-sdk/dist/components/Button/Button";
import { storedList } from "util/localstorage";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import downloadSvg from "../../../../assets/collection/images/download.svg";
import LmsSampleExcel from "../../../../assets/collection/files/LMS Sample.xlsx";
import uploadSvg from "../../../../assets/collection/images/upload.svg";
import Alert from "react-sdk/dist/components/Alert/Alert";

import "./bulkUpload.view.css";
import { findByAttribute } from "util/helper";
import { tempXlsxToJsonWatcher } from "../../../../actions/loanType";
import { downloadFile } from "util/collection/helper";

const user = storedList("user");

const bulkUploadMaximumLimit = 100;

export default function BulkUpload(props) {
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [fileData, setFileData] = useState([]);
  const fileInputRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [bulkUploadData, setBulkUploadData] = useState([]);
  const [collIds, setCollIds] = useState([]);

  useEffect(() => {
    if (bulkUploadData.length > 0) {
      selectBulkCases();
    }
  }, [bulkUploadData]);

  const selectBulkCases = () => {
    var tempSelected = [];
    var temp = [];
    bulkUploadData.forEach((element) => {
      temp.push({
        lms_id: element["LMS ID"],
      });
    });

    let payload = {
      cases: temp,
      user: user,
    };

    if (props.status) {
      payload = {
        ...payload,
        status: props.status,
      };
    }

    new Promise((resolve, reject) => {
      dispatch(getCollectionCaseCollIdsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        if (response.data.length == 0) {
          setAlert(true);
          setSeverity("error");
          setAlertMessage(
            "No LMS ID has been accepted. Please upload correct LMS IDs"
          );
        } else {
          var successMessage = `${response.data.length}/${bulkUploadData.length} cases in bulk upload file has been accepted.`;
          if (response.data.length == bulkUploadData.length) {
            successMessage = `All cases in bulk upload file has been accepted successfully.`;
          }

          setAlert(true);
          setSeverity("success");
          setAlertMessage(successMessage);

          props.onSuccess(response.data);
        }
        fileInputRef.current.value = "";
        setFileData([]);
      })
      .catch((error) => {
        const errorResponse = error?.response?.data?.message;
        setAlert(true);
        setSeverity("error");
        setAlertMessage(errorResponse);
      });
  };

  const styles = useStyles({ innerWidth, innerHeight });

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleFileSelect = (e, type) => {
    setLoading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    new Promise((resolve, reject) => {
      dispatch(tempXlsxToJsonWatcher(data, type, resolve, reject));
    })
      .then((response) => {
        const assignLmsData = response.result;
        if (
          !assignLmsData ||
          !assignLmsData[0] ||
          !assignLmsData[0]["LMS ID"]
        ) {
          setAlert(true);
          setSeverity("error");
          setAlertMessage("Please provide LMS ID in excel file");
          fileInputRef.current.value = "";
        } else if (assignLmsData.length > bulkUploadMaximumLimit) {
          setAlert(true);
          setSeverity("error");
          setAlertMessage(
            `Bulk Upload cannot exceed more than ${bulkUploadMaximumLimit} LMS IDs`
          );
          fileInputRef.current.value = "";
        } else {
          setFileData(assignLmsData);
          setBulkUploadData(assignLmsData);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response.data.message);
        setLoading(false);
      });
  };

  return (
    <div className="bulk-upload-container">
      <div>
        <p className="bulk-upload-text">
          <span style={{ color: "#060606", fontFamily: "Montserrat-SemiBold" }}>
            Important Note :&nbsp;&nbsp;
          </span>{" "}
          In order to upload cases through Microsoft Excel, first download our
          sample file and enter your data, then upload the same file by clicking
          the update excel file button on the page, then your all cases will be
          selected in the table.{" "}
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        style={{ display: "none" }}
        onChange={(e) => handleFileSelect(e, "bulk_upload")}
      />
      <div className="bulk-upload-button-container">
        <Button
          customStyle={{
            ...styles["button"],
            display:"flex",
            backgroundColor: "#F0F7FF",
            color: "#475BD8",
            border: "1px solid #475BD8",
          }}
          label={"Download Sample Excel"}
          buttonType="tertiary"
          isLoading={false}
          isDisabled={false}
          id="Download Sample Excel"
          iconButton="btn-secondary-download-button"
          imageButtonHover={downloadSvg}
          imageButton={downloadSvg}
          onClick={() => {
            downloadFile(LmsSampleExcel, "LMS Sample.xlsx");
          }}
        />
        <Button
          customStyle={{
            ...styles["button"],
            display:"flex",
            width:
              innerWidth > 1400 ? "12vw" : innerWidth > 900 ? "15vw" : "18vw",
            backgroundColor: "#475BD8",
            color: "#FFFFFF",
            border: "1px solid #475BD8"
          }}
          label={
            loading
              ? "Uploading..."
              : fileData.length > 0
              ? "Change Excel"
              : "Upload Excel"
          }
          buttonType="tertiary"
          isLoading={loading}
          isDisabled={false}
          id="Upload Excel"
          onClick={() => fileInputRef.current.click()}
          iconButton="btn-secondary-download-button"
          imageButtonHover={uploadSvg}
          imageButton={uploadSvg}
        />
        {alert ? (
          <Alert
            severity={severity}
            message={alertMessage}
            handleClose={handleAlertClose}
            style={{ position: "fixed", marginTop: "1vh" }}
          />
        ) : null}
      </div>
    </div>
  );
}

const useStyles = ({ innerWidth, innerHeight }) => {
  return {
    button: {
      height: "45px",
      width: innerWidth > 1400 ? "15vw" : innerWidth > 900 ? "20vw" : "22vw",
      borderRadius: "18px",
      fontSize: "14px",
      padding: 0,
      marginRight: "1.5vw",
    },
  };
};

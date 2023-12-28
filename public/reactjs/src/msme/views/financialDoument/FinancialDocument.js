import React, { useState, useEffect } from "react";
import UploadinputComponent from "../component/UploadinputComponent";

import "./FinancialDocument.css";

const FinancialDocument = () => {
  const checkBoxList = [
    { id: "check1", value: "ITR", label: "ITR" },
    { id: "check2", value: "GSTR", label: "GSTR" },
    {
      id: "check4",
      value: "Financial StateMent",
      label: "Financial StateMent",
    },
    { id: "check3", value: "Bank Statement", label: "Bank Statement" },
  ];

  const initialCheckboxes = {
    check1: false,
    check2: false,
    check3: false,
    check4: false,
  };
  const [checkboxes, setCheckboxes] = useState(initialCheckboxes);

  const handleCheckboxChange = (id) => {
    setCheckboxes({
      ...checkboxes,
      [id]: !checkboxes[id],
    });
  };

  useEffect(() => {
    console.log(initialCheckboxes.check1, "initialCheckboxes.check1");
  }, [checkboxes]);

  const BankInputTittle = [
    { id: "check1", name: "BS 1st Year" },
    { id: "check2", name: "BS 2st Year" },
    { id: "check3", name: "BS 3st Year" },
  ];

  const FSInputTittle = [
    { id: "check1", name: "FS 1st Year" },
    { id: "check2", name: "FS 1st Year" },
    { id: "check3", name: "FS 1st Year" },
  ];

  const ITRInputTittle = [
    { id: "check1", name: "ITR 1st Year" },
    { id: "check2", name: "ITR 2st Year" },
    { id: "check3", name: "ITR 3st Year" },
  ];

  const GSTInputArray = [
    { id: "check1", name: "GST 1st Year" },
    { id: "check2", name: "GST 2st Year" },
    { id: "check3", name: "GST 3st Year" },
  ];

  return (
    <div>
      <h2>Upload Financial Documents</h2>
      <p className="paraUpload">Select at least 1 document</p>

      <div className="checkBoxStyle">
        {checkBoxList.map((checkbox) => (
          <div key={checkbox.id}>
            <label
              style={{
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                marginRight: "40px",
                fontWeight: "500",
                fontFamily: "Montserrat",
              }}
            >
              <input
                className="inputCheckBoxStyle"
                type="checkbox"
                checked={checkboxes[checkbox.id]}
                onChange={() => handleCheckboxChange(checkbox.id)}
                style={{ width: "1rem", height: "1rem" }}
              />
              {checkbox.label}
            </label>
            {/* {checkboxes[checkbox.id] && <ITRComponent />} */}
          </div>
        ))}
      </div>

      <div className="uploadComponent">
        <div className="ITRComponentStyle">
          {checkboxes.check1 && (
            <UploadinputComponent array={ITRInputTittle} tittle="ITR" />
          )}
          {checkboxes.check2 && (
            <UploadinputComponent array={GSTInputArray} tittle="GST" />
          )}
          {checkboxes.check3 && (
            // <h2>h3llo</h2>

            <UploadinputComponent
              array={BankInputTittle}
              tittle="Bank Statement"
            />
          )}
          {checkboxes.check4 && (
            <UploadinputComponent
              array={FSInputTittle}
              tittle="Financial Statement"
            />
          )}
        </div>

        <div className="parentButtonStyle">
          <button className="buttonSave">Save as Draft</button>
          <button className="buttonNext">Save & Next</button>
        </div>
      </div>
    </div>
  );
};

export default FinancialDocument;

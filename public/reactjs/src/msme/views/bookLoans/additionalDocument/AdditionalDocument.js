import "../../financialDocument/FinancialDocument.css";
import AddDocument from "msme/views/financialDoument/addDocument";

import { useState } from "react";

const AdditionalDocument = () => {
  const [show, setShow] = useState(false);


  const textAreaStyle = {
    background: "white",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
    border: "none",
    borderRadius: "10px",
    padding: "4px",
  };
  const textAreaParentDiv = {
    marginTop: "60px",
  };
  const addDocument = () => {
    setShow(!show);
  };

  return (
    <div style={{ padding: "0px 10px" }}>
      <h2>Upload Additional Documents</h2>
      <p>Upload any other supporting document.</p>

      <button
        onClick={addDocument}
        style={{ width: "auto" }}
        className="buttonSave"
      >
        + Add Document
      </button>

      <div style={textAreaParentDiv}>
        <h3>Please provide any relevant information here</h3>
        <textarea
          style={textAreaStyle}
          id="w3review"
          name="w3review"
          rows="10"
          cols="120"
        >
          comment
        </textarea>
        <div className="parentButtonStyle">
          <button className="buttonSave">Save as Draft</button>
          <button className="buttonNext">Save & Next</button>
        </div>
      </div>

      {show && <AddDocument />}
    </div>
  );
};

export default AdditionalDocument;

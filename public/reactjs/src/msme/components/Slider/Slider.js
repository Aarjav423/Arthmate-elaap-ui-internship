import React, { useState } from "react";
import "react-sdk/dist/styles/_fonts.scss";
import leftArrowSign from "../../../views/colendingLoans/icons/leftArrow.svg";
import rightArrowSign from "../../../views/colendingLoans/icons/rightArrow.svg";
import "./Slider.style.css";

export const Slider = ({ children, width = "300px" }) => {
  const [initialArrowSign, setInitialArrowSign] = useState(leftArrowSign);
  const [showAuditLog, setShowAuditLog] = useState(false);

  const handleSignChange = () => {
    setInitialArrowSign(
      initialArrowSign === leftArrowSign ? rightArrowSign : leftArrowSign
    );
    setShowAuditLog(initialArrowSign === leftArrowSign);
  };

  return (
    <div
      className="container-style"
      style={{
        width: initialArrowSign === rightArrowSign ? width : "0px",
      }}
    >
      <div >
        <span
          style={{ cursor: "pointer", marginLeft: "-22px" }}
          onClick={handleSignChange}
        >
          <img className="icon-style" src={initialArrowSign} alt="svg icon" />
        </span>
      </div>
      {showAuditLog && <div className="sliderContent">{children}</div>}
    </div>
  );
};

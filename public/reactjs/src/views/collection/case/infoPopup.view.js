import React, { useState } from "react";
import InfoIcon from "assets/collection/images/Info.svg";

const styles = {
  infoPopupContainer: {
    position: "relative",
    display: "inline-block",
  },
  infoIcon: {
    fontSize: 18,
    cursor: "pointer",
  },
  infoPopup: {
    position: "absolute",
    bottom: "calc(100% + 15px)",
    left: "calc(100% + 108px)",
    transform: "translateX(-50%)",
    backgroundColor: "#152067",
    color: "white",
    borderRadius: 8,
    width: "max-content",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    zIndex: 1,
    visibility: "hidden",
    opacity: 0,
    transition: "visibility 0.2s, opacity 0.2s",
  },
  infoPopupArrow: {
    content: '""',
    position: "absolute",
    top: "100%",
    left: "14%",
    marginLeft: "-5px",
    borderWidth: "10px 10px 0",
    borderStyle: "solid",
    borderColor: "#152067 transparent transparent transparent",
  },
};

const InfoPopup = ({ content }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      style={styles.infoPopupContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span style={styles.infoIcon}>
        <img src={InfoIcon} alt="InfoIcon" />
      </span>

      <div
        style={{
          ...styles.infoPopup,
          visibility: isHovered ? "visible" : "hidden",
          opacity: isHovered ? 1 : 0,
        }}
      >
        {content}
        <span style={styles.infoPopupArrow}></span>
      </div>
    </div>
  );
};

export default InfoPopup;

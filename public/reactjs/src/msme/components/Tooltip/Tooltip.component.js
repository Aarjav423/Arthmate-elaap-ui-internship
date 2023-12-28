import React, { useState } from "react";
import InfoIcon from "../../../assets/img/info-circle.svg";

export const Tooltip = ({ content }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      style={styles.infoTooltipContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span style={styles.infoIcon}>
        <img src={InfoIcon} alt="InfoIcon" style={{width:'20px',height:'20px'}} />
      </span>

      <div
        style={{
          ...styles.infoTooltip,
          visibility: isHovered ? "visible" : "hidden",
          opacity: isHovered ? 1 : 0,
        }}
      >
        {content}
        <span style={styles.infoTooltipArrow}></span>
      </div>
    </div>
  );
};

const styles = {
  infoTooltipContainer: {
    position: "relative",
    display: "inline-block",
  },
  infoIcon: {
    fontSize: 18,
    cursor: "pointer",
  },
  infoTooltip: {
    position: "absolute",
    bottom: "calc(100% + 15px)",
    left: "96px",
    transform: "translateX(-50%)",
    backgroundColor: "#152067",
    color: "white",
    borderRadius: 8,
    width: "240px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    zIndex: 1,
    visibility: "hidden",
    opacity: 0,
    transition: "visibility 0.2s, opacity 0.2s",
    padding: '10px',
    maxWidth:'400px',
    minWidth:'120px'
  },
  infoTooltipArrow: {
    content: '""',
    position: "absolute",
    top: "100%",
    left: "10%",
    borderWidth: "10px 10px 0",
    borderStyle: "solid",
    borderColor: "#152067 transparent transparent transparent",
  },
};

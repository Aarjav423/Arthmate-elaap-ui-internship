import React, { useState, useEffect } from "react";
import "./style.css";
import error from "./assets/error-24.svg";
import success from "./assets/success-35.svg";
import info from "./assets/info-57.svg";

const Alert = ({ type, message, handleClose }) => {
    const [color, setColor] = useState("red");
    const [icons, setIcons] = useState(null);
    const [text, setText] = useState(null);
    const [bgColor, setBgColor] = useState(null);

    useEffect(() => {
        switch (type) {
            case "Failure":
                setColor("red");
                setIcons(error);
                setText("Failure");
                break;
            case "info":
                setColor("blue");
                setIcons(info);
                setText("info");

                break;
            case "success":
                setColor("#55a640");
                setIcons(success);
                setText("Successfully");
                setBgColor("#f4fef6");

                break;
            default:
                setColor("yellow");
                setIcons(error);
                setText("Warning");
        }
    }, [type]);

    const styleParentDiv = {
        border: `1.2px solid ${color}`,
        backgroundColor: bgColor,
        animation: 'alert - animation 0.5s ease-in -out',


    };

    const styleChildDiv = {
        display: "flex",
        alignItems: "center",
    };

    const iconImage = {
        height: "30px",
        width: "30px",
        margin: "10px 10px 30px 18px",
    };

    const buttonStyle = {
        color: "#272827",
        fontSize: "24px",
        marginBottom: "70px",
        marginTop: "10px",
        marginRight: "10px",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
    };



    useEffect(() => {
        setTimeout(() => {
            handleClose()
        }, 2500)
    }, [])


    return (
        <div className="styleParentDiv" style={styleParentDiv}>
            <div style={styleChildDiv}>
                {icons && <img style={iconImage} src={icons} alt={type} />}
                <div>
                    <p style={{ color: color, fontWeight: "bold" }}>{text}</p>
                    <p>{message}</p>
                </div>
            </div>
            <button onClick={handleClose} style={buttonStyle}>
                X
            </button>
        </div>
    );
};

export default Alert;

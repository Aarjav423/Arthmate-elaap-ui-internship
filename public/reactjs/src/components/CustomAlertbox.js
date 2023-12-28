import div from "@mui/material/Alert";
import CloseCircle from "../assets/img/close-circle.svg";
import CloseLine from "../assets/img/close-line.svg";
import TickCircle from "../assets/img/tick-circle.svg";
import { Link } from "react-router-dom";
import CopyIcon from "../assets/img/file-copy-line.svg";
import "react-sdk/dist/styles/_fonts.scss";
import { useState } from "react";

export const AlertBox = (props) => {
  const [isOpenCopied, setIsOpenCopied] = useState(false);
  const { severity, msg, onClose, data, link } = props;
  const handleClickAlertLink = () => {
    window.open(link) 
};
  const handleLinkCopied = () => {
    setIsOpenCopied(true);
    setTimeout(() => {
      setIsOpenCopied(false);
    }, 2000);
  }
  return (
    <>
      {severity !== "error" ? (
        <div
          style={{
            position: "fixed",
            right: "24px",
            top: "80px",
            padding: "0px 0px 16px 0px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "row",
            border: "1px solid #008042",
            width: "480px",
            height: "fit-content",
            borderRadius: "8px",
            backgroundColor: "#EEFFF7",
          }}
        >
          <img
            style={{
              marginLeft: "16px",
              marginTop: "17px",
              marginRight: "0px",
            }}
            alt="icon"
            src={TickCircle}
            className="menuIcon"
          />
        <div style={{display:"flex", justifyContent:"space-between", width:"440px"}}>
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                color: "#008042",
                fontFamily: "Montserrat-SemiBold",
                fontSize: "18px",
                alignSelf: "stretch",
                fontStyle: "normal",
                padding: "16px 17.5px 0px",
              }}
            >
              {msg}
            </div>

           {data && <div style={{ display: "flex", padding: "0px 17.5px",marginTop:"2px", wordBreak:"break-word", fontFamily: "Montserrat-Medium", fontSize: "14px" , color : "var(--neutral-100, #161719)"}}>{data}</div>}
            { link ? <div style={{ display: "flex", padding: "0px 17.5px" , wordBreak:"break-word", fontFamily: "Montserrat-Regular", fontSize: "14px"}}>
               <Link style={{color :"#475BD8"}} onClick={handleClickAlertLink}>https://omni-en-{data?.slice(-4)}</Link>
            <img
              onClick={() => {
                 navigator.clipboard.writeText(link);
                 handleLinkCopied();
                }}
              style={{ marginLeft: "8px", marginTop: "0px" ,height: "20px", width:"20px", cursor:"pointer"}}
              alt="copy icon"
              src={CopyIcon}
              className="menuIcon"
              /> 
              </div>: null}
           </div>

          <div style={{ display: "flex", float: "right" }}>
            <img
              onClick={() => onClose()}
              style={{ marginRight: "11px", marginTop: "15px" ,height: "24px", width:"24px"}}
              alt="icon"
              src={CloseLine}
              className="menuIcon"
            />
          </div>
        </div>
          
        </div>
      ) : (
        <div
          style={{
            position: "fixed",
            right: "24px",
            top: "80px",
            margin: "auto",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            float: "right",
            border: "1px solid #C00",
            width: "480px",
            height: "fit-content",
            borderRadius: "8px",
            backgroundColor: "#FFECEC",
            padding: "16px 17.5px",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#C00",
              fontFamily: "Montserrat-Bold",
              fontSize: "18px",
              alignSelf: "stretch",
              fontStyle: "normal",
            }}
          >
            <img
              style={{
                marginLeft: "0px",
                marginRight: "8px",
                marginTop: "0px",
              }}
              alt="icon"
              src={CloseCircle}
              className="menuIcon"
            />
        <div style={{display:"flex", justifyContent:"space-between", width:"440px"}}>
          <div>Please try again</div>

      <img
        onClick={() => onClose()}
        style={{ marginRight: "0px", marginTop: "0px" ,height: "24px", width:"24px"}}
        alt="icon"
        src={CloseLine}
        className="menuIcon"
      />
    </div>
            
          </div>

          <div
            style={{
              display: "flex",
              color: "#161719",
              fontFamily: "Montserrat-Medium",
              fontSize: "14px",
              alignSelf: "stretch",
              fontStyle: "normal",
              marginLeft: "28px",
            }}
          >
            {msg}
          </div>
        </div>
      )}
      {isOpenCopied && (
        <div style= {{ right: "428px", opacity:"0.5",
        top: "194px",zIndex:9999,position:"fixed" ,width : "74px", height:"39px", backgroundColor:"grey", color:"white", paddingTop: "7px",paddingLeft:"10px", borderRadius:"8px"}}>
         Copied
        </div>
      )}
    </>
  );
};

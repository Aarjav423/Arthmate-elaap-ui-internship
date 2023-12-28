import React, { useState } from "react";
import FormPopUp from "react-sdk/dist/components/Popup/FormPopup";
import CopyIcon from "../../assets/img/file-copy-line.svg"

const modalStyle = {
  position: "absolute",
  width: "30%",
  height: "100%",
  maxHeight: "100%",
  marginLeft: "35%",
  paddingTop: "2%",
  display: "flex",
  flexDirection: "column",
  float: "right",
};

export default function TokenGenPopup({ isOpen , setIsOpen, token}) {
  const [copied, setCopied] = useState(false);

  const handleClosePresentment = () => {
    setIsOpen(false);
  };

  const handleCopyClick = () => {
    setCopied(true);
  };

  return (
    <>
      <FormPopUp
        heading="Token Gen Key"
        open={isOpen}
        isOpen={isOpen}
        onClose={handleClosePresentment}
        customStyles={modalStyle}
      >
          <div style= {{width : "100%"}}>
            <div style ={{wordBreak : "break-word", marginTop:"10px"}}>

            {"Bearer " + token?.data ? token?.data : null}            </div>
            <div style ={{width:"100%", display:"flex",alignItems:"flex-end"}}>
            <img
              onClick={() => {
                 navigator.clipboard.writeText("Bearer " + token?.data ? token?.data : null);
                //  handleLinkCopied();
                }}
              style={{ marginLeft: "8px", marginTop: "0px" ,height: "20px", width:"20px", cursor:"pointer"}}
              alt="copy icon"
              src={CopyIcon}
            //   className="menuIcon"
            />
             </div>
            
            {/* <MdContentCopy
              onClick={handleCopyClick}
              style={{ cursor: "pointer" }}
              size={20}
              title="Copy to Clipboard"
            /> */}
          </div>
      </FormPopUp>
    </>
  );
}


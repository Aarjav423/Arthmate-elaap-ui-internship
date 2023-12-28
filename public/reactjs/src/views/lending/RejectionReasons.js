import * as React from "react";

import FormPopup from "react-sdk/dist/components/Popup/FormPopup"
const MaxWidthDialog = ({ openLog, data, handleCloseLog }) => {

  const handleClose = () => {
    handleCloseLog();
  };
  
  function dummyDrawdownData() {
	  return (
		  <div>
		  {data.map((name,index) => (
          	<h4 key={index} 
          		style={{
            		marginBottom: "10px",
            		color: "black",
            		wordWrap: "break-word",
            		width: "100%"
          		}}
          	>  
            {(index+1)+". "+name}  
          </h4>  
          ))} 
		  </div>
	  );
  }
 
  return (
    	<>
         { openLog ? (
          <div style={{zIndex:"100000000"}}>
      	  <FormPopup
        	  heading="Rejection Reasons"
        	  isOpen={""}
        	  onClose={handleClose}
        	  customHeaderStyle={{
          		fontSize: "24px",
          		fontFamily: "Montserrat-Bold",
          		fontWeight: "700",
          		lineHeight: "150%",
          		color: "#303030"
        	  }}
        	  customStyles={{
          		display: "flex",
          		flexDirection: "column",
          		gap: "24px",
          		width: "28%",
          		height: "100%",
          		padding: "24px",
          		borderRadius: "8px",
          		background: "#FFF",
          		marginLeft: "36%"
        	  }}
        	  customStyles1={{
          		display: "flex",
          		height: "100%",
          		flexDirection: "column",
          		justifyContent: "space-between",
          		alignItems: "flex-start"
        	  }}
      	  >
          {dummyDrawdownData()}
          </FormPopup>
       	  </div>
          ):
          (
            <div></div>
          )
        }
      </>
  );
};
export default MaxWidthDialog;


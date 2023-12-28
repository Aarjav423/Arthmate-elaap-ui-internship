import React from "react";
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import showcase from "../../../assets/img/showcase.jpg";
import componentStyles from "assets/theme/views/admin/dashboard.js";
import DashboardImage from "./DashboardImage.svg"
const useStyles = makeStyles(componentStyles);
import "react-sdk/dist/styles/_fonts.scss"

function Dashboard() {
  const classes = {
    ...useStyles()
  };

  const styles = theme => ({
    container: {
      position: "relative"
    },
    text: {
      position: "absolute",
      top: "15px",
      left: "32px"
    }
  });

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh', // Ensure the container covers the full viewport height
    backgroundColor: '#F5F7FF',
    borderRadius:"35px",
    margin:"25px"
  };

  const imageStyle = {
    width: '100%', // Adjust image width as needed
    maxWidth: '400px', // Set a maximum width for the image
    height: 'auto',
  };

  return (
    // <div style={{backgroundColor:"#F5F7FF"}}>
    // <div> <img src={DashboardImage}  alt="Dashboard Image" /> </div>
    // <h2>Data not available</h2>
    // <p>lorem is dummy text ,lorem is dummy text , lorem is dummy text , lorem is dummy text , lorem is dummy text </p>
    // </div>
    <div style={containerStyle}>
    {/* <div>
      <img src={DashboardImage} alt="Dashboard Image" style={imageStyle} />
    </div> */}
    <h2 style={{fontSize:"32px" , marginTop:"20px" , lineHeight:"48px" , fontFamily:"Montserrat-SemiBold" , color:"black"}}>Welcome to ELAAP</h2>
    <p style={{fontSize:"18px" , lineHeight:"27px" , textAlign:"center" ,fontFamily:"Montserrat-Medium" , color:"#838799"}} >
    Embedded Lending As A Platform
    </p>
    <div>
      <img src={DashboardImage} alt="Dashboard Image" style={imageStyle} />
    </div>
  </div>
  );
}

export default Dashboard;

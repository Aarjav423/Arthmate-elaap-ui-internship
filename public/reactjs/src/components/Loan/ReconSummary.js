
import * as React from "react";



const ReconSummary = props => {
  let { data } = props;
  const getVal = value => {
    if (value?.$numberDecimal !== undefined) {
      return parseFloat(value.$numberDecimal.toString());
    } else if (typeof value === "object") {
      return parseFloat(value.toString());
    }
    return value;
  };

  return (
    <>
      <div style={{backgroundColor:"#FFFFFF" , border:" 1px solid #EDEDED" , borderRadius:"8px" , marginLeft:"25px" ,marginRight:"20px",padding:"16px" , fontFamily:"Montserrat-SemiBold" , marginTop:"25px"}}>
        <h4 style={{fontSize:"18px" ,lineHeight:"150%" , fontFamily:"Montserrat-SemiBold" , color:"#141519"}}>Recon Summary</h4>
        <div style={{display:"grid" ,gridTemplateColumns:"25% 25% 25% 25%", marginTop:"24px", width:"100%"}}>
        <div style={{fontFamily:"Montserrat-Regular" , fontSize:"12px"}}>LOAN ID<div style={{color:"black" , fontFamily:"Montserrat-Medium", fontSize:"16px"}}>{data?.loan_id}</div></div>
        <div style={{ fontFamily:"Montserrat-Regular", fontSize:"12px" }} >CUSTOMER NAME<div style={{color:"black" , fontFamily:"Montserrat-Medium", fontSize:"16px" , width:"150px"}}>{data?.customer_name}</div></div>
        <div style={{ fontFamily:"Montserrat-Regular" , fontSize:"12px"}} >PRINCIPLE OS<div style={{color:"black" , fontFamily:"Montserrat-Medium", fontSize:"16px",width:"150px"}}>{data?.prin_os?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(data?.prin_os)):"NA"}</div></div>
        <div style={{fontFamily:"Montserrat-Regular" , fontSize:"12px"}} >INTEREST OS<div style={{color:"black" , fontFamily:"Montserrat-Medium" , fontSize:"16px",width:"150px"}}>{data?.int_os?new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(data?.int_os)):"NA"}</div></div>
        <div style={{fontFamily:"Montserrat-Regular" , fontSize:"12px" , marginTop:"24px"}} >ACCRUED INTEREST<div style={{color:"black" , fontFamily:"Montserrat-Medium" , fontSize:"16px",width:"150px"}}>{data?.accrual_interest || data?.accrual_interest===0 ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(data?.accrual_interest)):"NA"}</div></div>
        <div style={{ fontFamily:"Montserrat-Regular" , fontSize:"12px", marginTop:"24px"}} >DPD<div style={{color:"black" , fontFamily:"Montserrat-Medium" , fontSize:"16px",width:"150px"}}>{data?.dpd||data?.dpd===0?data?.dpd:"NA"}</div></div>
        <div style={{fontFamily:"Montserrat-Regular" , fontSize:"12px", marginTop:"24px"}} >EXCESS AMOUNT<div style={{color:"black" , fontFamily:"Montserrat-Medium" , fontSize:"16px",width:"150px"}}>{data?.excess_amount === 0 || data?.excess_amount ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getVal(data?.excess_amount) >= 0? getVal(data?.excess_amount): 0):"NA"}</div></div>   
      </div>
      </div>
    </>
  );
};

export default ReconSummary;

import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-sdk/dist/components/Button";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import "react-sdk/dist/styles/_fonts.scss"
import { storedList } from "../../util/localstorage";
import { checkAccessTags } from "../../util/uam";

const user = storedList("user");

const CustomerDetails = (props) => {
    const { custDetails } = props;
    const URLdata = window.location.href;
    const customer_id = URLdata.split("/").slice(-1)[0];
    const payload = {
        customer_id: customer_id
    };
    const [activeLoan, setActiveLoan] = useState(true);
    const [closedLoan, setClosedLoan] = useState(false);
    const [activeLine, setActiveLine] = useState(true);
    const [expiredLine, setExpiredLine] = useState(false);

    const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

    const customButtonClass = { height: '34px', width: "9vw", padding: '6px 24px', fontSize: '15px', borderRadius: '40px' };
    const customStyle = {
        height: "6vh", width: "90%", maxWidth: "100%", paddingTop: "0.6%", marginTop: "3%", backgroundColor: "#F4F4F4", fontSize: "0.6vw"
    }
    const customStyleSmall = {
        height: "6vh", width: "44%", maxWidth: "100%", paddingTop: "0.6%", marginTop: "3%", backgroundColor: "#F4F4F4", fontSize: "0.6vw", marginRight: "2%"
    }
    const customStyle1 = {
        height: "100%", width: "100%", maxWidth: "100%", paddingTop: "0.2%", fontSize: "133%", fontFamily: "Montserrat-Regular"
    }




    const handleLoanStatus = () => {
        setClosedLoan(!closedLoan);
        setActiveLoan(!activeLoan);
    }
    const handleLineStatus = () => {
        setActiveLine(!activeLine);
        setExpiredLine(!expiredLine);
    }

    const handleOpenLoanProfile = (loan) => {
        if(isTagged  && checkAccessTags(["tag_collateral_read_write", "tag_loan_details_read", "tag_loan_details_read_write", "tag_loan_queue_read_write"]))
        window.open(
            `/admin/loan/details/origin_lms/${loan.loan_id}/${loan.product_id}/${loan.company_id}/${loan.loan_schema_id}/1`,
            "_blank"
        );
    }


    return (<>{custDetails ? <div style={{ display: "flex", width: "100%" , marginTop: '15px'}}>
        <div style={{ float: "left", width: "45%" }}>
            <div className="Customer Details" style={{ marginLeft: "3%", marginBottom: "3%" }}>
                <div style={{ fontSize: "130%", marginTop: "1%", fontFamily: "Montserrat-Bold", color: "#161719" }}>Customer Details</div>
                <div style={{}}>{customer_id}</div>
                {custDetails ?
                    <>

                        <div style={{ marginBottom: "2%" }}>
                            <InputBox
                                label="Customer Name"
                                id={'customerName'}
                                isDisabled={true}
                                initialValue={custDetails['customerDetails']?.customer_name || "NA"}
                                customClass={customStyle}
                                customInputClass={customStyle1} />
                            <InputBox
                                label="Date of Birth"
                                id={'dob'}
                                isDisabled={true}
                                initialValue={custDetails['customerDetails']?.dob || "NA"}
                                customClass={customStyle}
                                customInputClass={customStyle1} />
                            <InputBox
                                label="PAN"
                                id={'pan'}
                                isDisabled={true}
                                initialValue={custDetails['customerDetails']?.pan || "NA"}
                                customClass={customStyle}
                                customInputClass={customStyle1} />
                            <div style={{ fontSize: "110%", marginTop: "4%", fontFamily: "Montserrat-SemiBold", color: "#161719" }}>Current Address</div>
                            <InputBox
                                label="Address Line 1"
                                id={'curraddressline1'}
                                isDisabled={true}
                                initialValue={custDetails['customerDetails']?.cur_addr_ln1 || "NA"}
                                customClass={customStyle}
                                customInputClass={customStyle1} />
                            <InputBox
                                label="Address Line 2"
                                id={'curraddressline2'}
                                isDisabled={true}
                                initialValue={custDetails['customerDetails']?.cur_addr_ln2 || "NA"}
                                customClass={customStyle}
                                customInputClass={customStyle1} />
                            <div style={{ display: "flex" }}>
                                <InputBox
                                    label="Pincode"
                                    id={'currPincode'}
                                    isDisabled={true}
                                    initialValue={custDetails['customerDetails']?.cur_pincode || "NA"}
                                    customClass={customStyleSmall}
                                    customInputClass={customStyle1} />
                                <InputBox
                                    label="City"
                                    id={'currCity'}
                                    isDisabled={true}
                                    initialValue={custDetails['customerDetails']?.cur_city || "NA"}
                                    customClass={customStyleSmall}
                                    customInputClass={customStyle1} />

                            </div>
                            <div style={{ display: "flex" }}>
                                <InputBox
                                    label="State"
                                    id={'currState'}
                                    isDisabled={true}
                                    initialValue={custDetails['customerDetails']?.cur_state || "NA"}
                                    customClass={customStyleSmall}
                                    customInputClass={customStyle1} />
                                <InputBox
                                    label="Type of Address"
                                    id={'currType'}
                                    isDisabled={true}
                                    initialValue={custDetails['customerDetails']?.type_of_addr || "NA"}
                                    customClass={customStyleSmall}
                                    customInputClass={customStyle1} />

                            </div>
                            <div style={{ fontSize: "110%", marginTop: "4%", fontFamily: "Montserrat-SemiBold", color: "#161719" }}>Permanent Address</div>
                            <InputBox
                                label="Address Line 1"
                                id={'peraddressline1'}
                                isDisabled={true}
                                initialValue={custDetails['customerDetails']?.per_addr_ln1 || "NA"}
                                customClass={customStyle}
                                customInputClass={customStyle1} />
                            <InputBox
                                label="Address Line 2"
                                id={'peraddressline2'}
                                isDisabled={true}
                                initialValue={custDetails['customerDetails']?.per_addr_ln2 || "NA"}
                                customClass={customStyle}
                                customInputClass={customStyle1} />
                            <div style={{ display: "flex" }}>
                                <InputBox
                                    label="Pincode"
                                    id={'perPincode'}
                                    isDisabled={true}
                                    initialValue={custDetails['customerDetails']?.per_pincode || "NA"}
                                    customClass={customStyleSmall}
                                    customInputClass={customStyle1} />
                                <InputBox
                                    label="City"
                                    id={'perCity'}
                                    isDisabled={true}
                                    initialValue={custDetails['customerDetails']?.per_city || "NA"}
                                    customClass={customStyleSmall}
                                    customInputClass={customStyle1} />

                            </div>
                            <div style={{ display: "flex" }}>
                                <InputBox
                                    label="State"
                                    id={'perState'}
                                    isDisabled={true}
                                    initialValue={custDetails['customerDetails']?.per_state || "NA"}
                                    customClass={customStyleSmall}
                                    customInputClass={customStyle1} />
                                <InputBox
                                    label="Type of Address"
                                    id={'type'}
                                    isDisabled={true}
                                    initialValue={custDetails['customerDetails']?.type_of_addr || "NA"}
                                    customClass={customStyleSmall}
                                    customInputClass={customStyle1} />

                            </div>

                        </div>


                    </>
                    : null}

            </div>

        </div>
        <div style={{ width: "1px", height: "90vh", backgroundColor: "#D8D9DE", marginRight: "4%" }}>

        </div>
        <div style={{ float: "right", width: "45%", marginTop: "0.25%", }}>
            <div className="Loan" style={{ color: `#${activeLoan ? 161719 : 767888}`, marginBottom: "2%" }}>
                <div style={{ fontFamily: "Montserrat-Bold", color: "#161719", fontSize: "135%" }}>Loans</div>
                {custDetails['customerLoanDetails'] && <>
                    <div style={{ fontFamily: "Montserrat-Regular", fontSize: "120%", color: "#767888", marginBottom: "2.5%" }}>Total Loan Exposure - {custDetails['customerLoanDetails']?.total_exposure == 0 || custDetails['customerLoanDetails']?.total_exposure ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(custDetails['customerLoanDetails']?.total_exposure) : "NA"}</div>
                    <div style={{ display: "flex", marginBottom: "2.5%" }}>

                        {custDetails['customerLoanDetails'] ? activeLoan ? <><Button buttonType="primary" label="Active" customStyle={customButtonClass} /> <Button buttonType="secondary" label="Closed" customStyle={customButtonClass} onClick={handleLoanStatus} /></> : <><Button buttonType="secondary" label="Active" customStyle={customButtonClass} onClick={handleLoanStatus} /> <Button buttonType="primary" label="Closed" customStyle={customButtonClass} /></> : null}</div>
                    <div style={{ overflowY: "auto", maxHeight: "35vh" }}>
                        {custDetails['customerLoanDetails'].data.map((loan, idx) => {
                            return (<>
                                {(loan.status == "active" && activeLoan) || (loan.status == "closed" && closedLoan) ?
                                    <div key={idx} style={{ border: "1px solid #E5E5E8", borderRadius: "8px", height: "23vh", marginBottom: "4%" }}>

                                        {activeLoan ? <div style={{ width: "4.3vw", height: "2.5vh", backgroundColor: "#EDEFFB", marginLeft: "2%", fontSize: "0.8vw", padding: "0.4%", marginTop: "1%", borderRadius: "4px", fontFamily: "Montserrat-SemiBold", color: `#475BD8` }}>Borrower</div> : <div style={{ width: "4.3vw", height: "2.5vh", backgroundColor: "#EDEFFB", borderRadius: "4px", marginLeft: "2%", fontSize: "0.8vw", padding: "0.4%", marginTop: "1%", fontFamily: "Montserrat-SemiBold", color: `#767888` }}>Borrower</div>}
                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1%", marginBottom: "1%" }}>
                                            <div style={{ fontFamily: "Montserrat-SemiBold", fontSize: "1.05vw", marginLeft: "2%" }}>
                                                {loan?.product_name}
                                            </div>
                                            <div style={{ fontFamily: "Montserrat-Regular", fontSize: "0.9vw", marginRight: "2%" }}>
                                                Loan ID : {(loan.status == "active" && activeLoan) ? <Link onClick={() => handleOpenLoanProfile(loan)}>{loan.loan_id}</Link> : loan.loan_id }
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontFamily: "Montserrat-Regular", fontSize: "0.9vw", marginLeft: "2%" }}>
                                                Loan Amount
                                            </div>
                                            <div style={{ fontFamily: "Montserrat-Regular", fontSize: "0.9vw", marginRight: "2%" }}>
                                                EMI
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1%" }}>
                                            <div style={{ fontFamily: "Montserrat-SemiBold", fontSize: "1vw", marginLeft: "2%" }}>
                                                {loan.loan_amount == 0 || loan.loan_amount ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(loan?.loan_amount) : "NA"}
                                            </div>
                                            <div style={{ fontFamily: "Montserrat-SemiBold", fontSize: "1vw", marginRight: "2%" }}>
                                                {loan.emis_due}/{loan.total_emis}
                                            </div>
                                        </div>
                                        <div style={{ width: "96%", height: "8px", backgroundColor: "#E5E5E8", marginLeft: "2%", marginRight: "2%", marginBottom: "1%", borderRadius: "10px" }}>{activeLoan ? <div style={{ width: `${loan?.emis_due / loan?.total_emis * 100}%`, height: "8px", backgroundColor: "#475BD8", borderRadius: "10px" }}></div> : <div style={{ width: `${loan?.emis_due / loan?.total_emis * 100}%`, height: "8px", backgroundColor: "#767888", borderRadius: "10px" }}></div>}</div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                          <div style={{display:"flex", flexDirection:"column", width:"200px", marginLeft: "2%" }}>
                                            <div style={{ fontFamily: "Montserrat-Regular", fontSize: "0.9vw" }}>
                                                Total Outstanding
                                            </div>
                                            <div style={{ fontFamily: "Montserrat-SemiBold", fontSize: "1vw" }}>
                                                {loan.total_outstanding == 0 || loan.total_outstanding ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(loan?.total_outstanding) : "NA"}
                                            </div>
                                          </div>
                                          <div style={{display:"flex", flexDirection:"column", width:"120px",alignItems:"center"}}>
                                            <div style={{ fontFamily: "Montserrat-Regular", fontSize: "0.9vw" }}>
                                                DPD
                                            </div>
                                            <div style={{ fontFamily: "Montserrat-SemiBold", fontSize: "1vw", marginLeft: "2%"}}>
                                                {loan?.dpd}
                                            </div>
                                          </div>
                                          <div style={{display:"flex", flexDirection:"column", width:"200px", alignItems:"end", marginRight:"2%"}}>
                                            <div style={{ fontFamily: "Montserrat-Regular", fontSize: "0.9vw" }}>
                                                Monthly EMI
                                            </div>
                                            <div style={{ fontFamily: "Montserrat-SemiBold", fontSize: "1vw" }}>
                                                {loan?.monthly_emi == 0 || loan?.monthly_emi ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(loan?.monthly_emi) : "NA"}
                                            </div>
                                          </div>
                                        </div>
                                    </div>
                                    : null}
                            </>
                            )
                        })}
                    </div>
                </>
                }
            </div>
            <div style={{ height: "1px", width: "100%", backgroundColor: "#D8D9DE", marginBottom: "2.5%" }}>

            </div>
            <div className="Line" style={{ color: `#${activeLine ? 161719 : 767888}` }}>
                <div style={{ fontFamily: "Montserrat-Bold", color: "#161719", fontSize: "135%" }}>Lines</div>
                {custDetails['customerLineDetails'] && <>
                    <div style={{ fontFamily: "Montserrat-Regular", fontSize: "120%", color: "#767888", marginBottom: "2.5%" }}>Total Line Exposure - {custDetails['customerLineDetails']?.total_exposure == 0 || custDetails['customerLineDetails']?.total_exposure ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(custDetails['customerLineDetails']?.total_exposure) : "NA"}</div>
                    <div style={{ display: "flex", marginBottom: "2.5%" }}>
                        {custDetails['customerLineDetails'] ? activeLine ? <><Button buttonType="primary" label="Active" customStyle={customButtonClass} /> <Button buttonType="secondary" label="Expired" customStyle={customButtonClass} onClick={handleLineStatus} /></> : <><Button buttonType="secondary" label="Active" customStyle={customButtonClass} onClick={handleLineStatus} /> <Button buttonType="primary" label="Expired" customStyle={customButtonClass} /></> : null}</div>
                    {custDetails['customerLineDetails'].data.map((loan, idx) => {
                        return (<>
                            {(loan.status == "active" && activeLine) || (loan.status == "expired" && expiredLine) ?
                                <div key={idx} style={{ border: "1px solid #E5E5E8", borderRadius: "8px", height: "18vh", marginBottom: "4%", overflowY: "auto", maxHeight: "25vh" }}>
                                    {activeLine ? <div style={{ width: "4.3vw", height: "2.5vh", borderRadius: "4px", backgroundColor: "#EDEFFB", marginLeft: "2%", fontSize: "0.8vw", padding: "0.4%", marginTop: "1%", fontFamily: "Montserrat-SemiBold", color: `#475BD8` }}>Borrower</div> : <div style={{ width: "4.3vw", height: "2.5vh", borderRadius: "4px", backgroundColor: "#EDEFFB", marginLeft: "2%", fontSize: "0.8vw", padding: "0.4%", marginTop: "1%", fontFamily: "Montserrat-SemiBold", color: `#767888` }}>Borrower</div>}
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1%", marginBottom: "2%" }}>
                                        <div style={{ fontFamily: "Montserrat-SemiBold", fontSize: "1.05vw", marginLeft: "2%", marginTop: "1%" }}>
                                            {loan?.product_name}
                                        </div>
                                        <div style={{ fontFamily: "Montserrat-Regular", fontSize: "0.9vw", marginRight: "2%" }}>
                                            Loan ID: {(loan.status == "active" && activeLine) ? <Link onClick={() => handleOpenLoanProfile(loan)}>{loan.loan_id}</Link> : loan.loan_id }
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5%" }}>
                                        <div style={{ fontFamily: "Montserrat-Regular", fontSize: "0.9vw", marginLeft: "2%" }}>
                                            Total Limit
                                        </div>
                                        <div style={{ fontFamily: "Montserrat-Regular", fontSize: "0.9vw", marginRight: "2%" }}>
                                            Available Limit
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1%" }}>
                                        <div style={{ fontFamily: "Montserrat-SemiBold", fontSize: "1vw", marginLeft: "2%" }}>
                                            {loan.total_limit == 0 || loan.total_limit ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(loan?.total_limit) : "NA"}
                                        </div>
                                        <div style={{ fontFamily: "Montserrat-SemiBold", fontSize: "1vw", marginRight: "2%" }}>
                                            {loan.available_limit == 0 || loan.available_limit ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(loan?.available_limit) : "NA"}
                                        </div>
                                    </div>
                                    <div style={{ width: "96%", height: "8px", backgroundColor: "#E5E5E8", marginLeft: "2%", marginRight: "2%", borderRadius: "10px" }}>{activeLine ? <div style={{ width: `${loan?.available_limit / loan?.total_limit * 100}%`, height: "8px", backgroundColor: "#475BD8", borderRadius: "10px" }}></div> : <div style={{ width: `${loan?.available_limit / loan?.total_limit * 100}%`, height: "8px", backgroundColor: "#767888", borderRadius: "10px" }}></div>}</div>

                                </div>
                                : null}

                        </>
                        )
                    })}

                </>}
            </div>
        </div>
    </div>
        : null} </>)
}

export default CustomerDetails;

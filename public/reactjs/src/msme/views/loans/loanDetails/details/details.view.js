import React, { useEffect, useState } from 'react'
import "./details.style.css"
import Accordion from "react-sdk/dist/components/Accordion/Accordion";
import jsonData from 'msme/views/loans/loanDetails/details/loanDetails.json';
function Details() {
    const [loanDetailData, setLoanDetailData] = useState([]);
    useEffect(() => {
        const detailsData = [];
        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                const title = key;
                const subtitle = "";
                const value = jsonData[key];
                const data = Object.keys(value).map((key) => ({
                    head: (
                        <span className='loan-details-accordion-head'>
                            {key}
                        </span>
                    ),
                    body:(
                        <span className='loan-details-accordion-body'>
                            {value[key]}
                        </span>
                    )
                }))
                detailsData.push({title, data,subtitle:""});
            }
        }
        setLoanDetailData(detailsData);
    }, [])
    return (
        <div className='details-container'>
            {loanDetailData.length>0 && <Accordion
                accordionData={loanDetailData}
                openDrawdown={true}
                customClass={{
                    backgroundColor: "#FFF",
                    marginRight: "25px",
                    marginTop: "35px",
                    cursor: "pointer",
                }}
                custumHeaderStyle={{
                    margin:"0.3rem 0 0.7rem 0rem"
                }}
            />}
        </div>
    )
}

export default Details

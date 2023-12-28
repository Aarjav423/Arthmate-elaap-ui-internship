import React from 'react'
import "./caseOverview.css"
import { convertIntoINR } from "util/collection/helper";
const SummaryCard = ({ icon, title, caseCount, caseAmount }) => {
    return (
        <div className='dashboard-overview-card-container-style'>
            <div className='dashboard-overview-card-icon-container'>
                <img
                    src={icon}
                    alt="DropDown Icon"
                    className='dashboard-overview-card-icon'
                />
            </div>
            <div className='dashboard-overview-card-title-container'>
                <div className='dashboard-overview-card-title'>{title}</div>
                <div className='dashboard-overview-card-amount'
                >{caseAmount?`₹ ${convertIntoINR(caseAmount)}`:'₹ 0'}</div>
            </div>
            <div className='dashboard-overview-card-case-count'>
                {`CASE-${caseCount?caseCount:0}`}
            </div>
        </div>
    )
}

export default SummaryCard

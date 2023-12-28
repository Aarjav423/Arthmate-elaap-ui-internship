import React, { useEffect, useState } from "react";
import SummaryCard from "./overviewCard";
import { getDashboardCaseOverviewWatcher } from "../../../../actions/collection/dashboard.action";
import { useDispatch } from "react-redux";
import allocationImg from "assets/collection/images/allocation_img.svg";
import fullyRecoveredImg from "assets/collection/images/fullyRecovered_img.svg";
import partPaidImg from "assets/collection/images/partPaid_img.svg";
import unpaidImg from "assets/collection/images/unpaid_img.svg";
import "./caseOverview.css";

const CaseOverview = ({ startDate, endDate, companyCode }) => {

    const dispatch = useDispatch();

    const [caseSummaryList, setCaseSummaryList] = useState({});

    const fetchCollectionCaseSummary = () => {
        const payload= {
            startDate, 
            endDate, 
            company_code:companyCode 
        }
        new Promise((resolve, reject) => {
            dispatch(getDashboardCaseOverviewWatcher(payload, resolve, reject));
        })
            .then((response) => {
                setCaseSummaryList(response.data);
            })
            .catch((error) => {
                console.log("error in fetch case Summary.");
            });
    };

    useEffect(() => {
        fetchCollectionCaseSummary();
    }, [companyCode]);


    return (
        <div className="dashboard-overview-container">
            <SummaryCard
                icon={allocationImg}
                title={"Allocations"}
                caseAmount={
                    caseSummaryList.fullyRecoveredAmount +
                    caseSummaryList.partialPaidAmount +
                    caseSummaryList.partialUnpaidAmount +
                    caseSummaryList.unpaidAmount
                }
                caseCount={
                    caseSummaryList.totalCasesFullyRecovered +
                    caseSummaryList.totalCasesPartialPaid +
                    caseSummaryList.totalCasesUnpaid
                }
            />
            <SummaryCard
                icon={fullyRecoveredImg}
                title={"Fully Recovered"}
                caseAmount={caseSummaryList.fullyRecoveredAmount}
                caseCount={caseSummaryList.totalCasesFullyRecovered}
            />
            <SummaryCard
                icon={partPaidImg}
                title={"Part Paid"}
                caseAmount={caseSummaryList.partialPaidAmount}
                caseCount={caseSummaryList.totalCasesPartialPaid}
            />
            <SummaryCard
                icon={unpaidImg}
                title={"Unpaid"}
                caseAmount={
                    caseSummaryList.partialUnpaidAmount + caseSummaryList.unpaidAmount
                }
                caseCount={
                    caseSummaryList.totalCasesPartialPaid +
                    caseSummaryList.totalCasesUnpaid
                }
            />
        </div>
    );
};

export default CaseOverview;

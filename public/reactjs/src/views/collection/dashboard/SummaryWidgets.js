import React, { useEffect, useState } from "react";

export default function SummaryWidgets({ caseSummaryData }) {
    const mainContailer = {
        display: "flex",
        background: "#FAFCFE",
        width: "600px",
        justifyContent: "space-around",
        borderRadius: "48px",
        marginLeft: "22px",
        padding: "14px",
    };

    const paraStyle = {
        margin: "0px",
        color: "#777",
        fontSize: "14px",
    };

    const headingStyle = {
        margin: "0px",
        textAlign: "center",
        fontSize: "18px",
    };



    return (
        <div>
            <h2 style={{ padding: "30px 0px 30px 40px" }}>Summary</h2>
            <div style={mainContailer} className="mainContailer">
                <>
                    <div>
                        <p style={paraStyle}>This Week</p>

                        <h3 style={headingStyle}>
                            {caseSummaryData &&
                                caseSummaryData.week != undefined &&
                                caseSummaryData.week + " Solved"}
                        </h3>
                    </div>
                    <div>
                        <p style={paraStyle}>Previous Week</p>
                        <h3 style={headingStyle}>
                            {caseSummaryData &&
                                caseSummaryData?.previousWeek != undefined &&
                                caseSummaryData?.previousWeek + " Solved"}
                        </h3>
                    </div>
                    <div>
                        <p style={paraStyle}>Today</p>
                        <h3 style={headingStyle}>
                            {caseSummaryData &&
                                caseSummaryData?.today != undefined &&
                                caseSummaryData?.today + " Solved"}
                        </h3>
                    </div>
                    <div>
                        <p style={paraStyle}>This Month</p>
                        <h3 style={headingStyle}>
                            {caseSummaryData &&
                                caseSummaryData?.month != undefined &&
                                caseSummaryData?.month + " Solved"}
                        </h3>
                    </div>
                </>
            </div>
        </div>
    );
}

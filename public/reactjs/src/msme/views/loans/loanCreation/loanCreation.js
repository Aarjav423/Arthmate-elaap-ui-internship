import React,{ useState, useEffect } from 'react'
import { useParams,useLocation,useHistory } from "react-router-dom";
import TabButton from "react-sdk/dist/components/TabButton";
import SanctionLenderLead from "../sanctionAndLender/sanctionLenderLoan.view";
import { CreateLoan } from "msme/views/msme.view";
import { Natch } from "msme/views/msme.view";

export default function loanCreation(props) {
    let tabsAvailable = ["Loan Details","SL & LBA","NACH"];
    const params = useParams();
    const paramsData = useLocation().search.split("=").slice(-1);
    const selectedTab = decodeURIComponent(paramsData);
    const history = useHistory();

    const handleNavigate = (navState) => {
        history.replace(`/admin/msme/loans/loan_creation/${params.id}?tab=${navState}`);
      };

    const [leadDetailSection, setLeadDetailSection] = useState(
    tabsAvailable.includes(selectedTab)
        ? selectedTab.toLowerCase()
        : tabsAvailable[0].toLowerCase()
    );
    return (
        <div style={{ padding: "0px 24px 24px 24px", backgroundColor: "#fafafa" }}>
        <div
        style={{
          display: leadDetailSection === "lead details" ? "flex" : null,
          flexDirection: leadDetailSection === "lead details" ? "row" : null,
        }}
      >
        <div style={{ width: "100%" }}>
            <div style={{ marginTop: "24px" }}>
                {tabsAvailable.map((navMenu, index) => {
                    return (
                        <TabButton
                            label={navMenu}
                            isDisabled={false}
                            key={index}
                            onClick={() => handleNavigate(navMenu)}
                            selected={
                                navMenu.toLowerCase() === leadDetailSection.toLowerCase()
                            }
                            setSelectedOption={setLeadDetailSection}
                        />
                    );
                })}
            </div>
            {leadDetailSection === "loan details" && <CreateLoan />}
            {leadDetailSection === "sl & lba" && <SanctionLenderLead />}
            {leadDetailSection === "nach" && <Natch />}
        </div>
        </div>
        </div>
    )
}


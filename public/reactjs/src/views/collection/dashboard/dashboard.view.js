import Table from "react-sdk/dist/components/Table";
import SummaryWidgets from "./SummaryWidgets";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import React, { useState, useEffect } from "react";
import { getDashboardFosSummaryWatcher } from "../../../actions/collection/dashboard.action";
import {
  getCaseSourcingPartnerWatcher,
  getCollectionCaseAssignWatcher,
} from "actions/collection/cases.action";
import useDimensions from "../../../hooks/useDimensions";
import FilterFos from "./filterfos";
import DepositionChart from "./depositionChart.view";
import { useDispatch } from "react-redux";
import Button from "react-sdk/dist/components/Button/Button";
import filterImage from "assets/collection/images/Filter_img.svg";
import dropDownImg from "assets/collection/images/dropdown_img.svg";
import CaseOverview from "./caseOverview/CaseOverview";
import {
  convertIntoINR,
  getDateInFormate,
  stringEllipsis,
} from "util/collection/helper";
// import Dexie from "dexie";
import Autocomplete from "components/Collection/Autocomplete/autoComplete";

import "./dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(false);
  const [payload, setPayload] = useState({});
  const [fosData, setFosData] = useState([]);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [caseSummaryData, setCaseSummaryData] = useState([]);
  const [companyCode, setCompanyCode] = useState("");
  const [sourcingPartner, setSourcingPartner] = useState([]);
  const [fosUserDropDown, setFosUserDropDown] = useState([]);
  const [fosAgentInputValue, setFosAgentInputValue] = useState("");
  const [sourcingPartnerOptions, setSourcingPartnerOptions] =
    useState(sourcingPartner);
  const [companyName, setCompanyName] = useState("");

  const { innerWidth, innerHeight } = useDimensions();

  useEffect(() => {
    fetchCollectionCaseAssignList();
  }, []);

  useEffect(() => {
    fetchCollectionSourcingPartnerList();
  }, [fosAgentInputValue]);

  useEffect(() => {
    fetchCollectionFosUserList();
  }, [payload, companyCode]);

  useEffect(() => {
    const regexPattern = new RegExp(`^${companyName.toLowerCase()}`);
    if (sourcingPartner.some((item) => item.company_name === companyName)) {
      setSourcingPartnerOptions(sourcingPartner);
    } else {
      setSourcingPartnerOptions(
        sourcingPartner?.filter((obj) =>
          regexPattern.test(obj.company_name.toLowerCase())
        )
      );
    }
  }, [companyName]);

  let payloadData = {
    assigned_end_date: payload?.assigned_end_date,
    assigned_start_date: payload?.assigned_start_date,
    minAmount: payload?.amountRange,
    maxAmount: payload?.amountRange,
    fosAgent: payload?.fosAgent,
    limit: limit,
    page: page + 1,
    sortBy: "name:desc",
    company_code: companyCode,
  };

  const fetchCollectionFosUserList = () => {
    new Promise((resolve, reject) => {
      dispatch(getDashboardFosSummaryWatcher(payloadData, resolve, reject));
    })
      .then((response) => {
        setCaseSummaryData(response?.data?.case_solved);
        setFosData(response?.data?.fos?.data);
        setTotalCount(response?.data?.fos?.totalResults || 10);
      })
      .catch((error) => { });
  };

  const fetchCollectionSourcingPartnerList = () => {
    let payload = {};
    new Promise((resolve, reject) => {
      dispatch(getCaseSourcingPartnerWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setSourcingPartner(response?.data);
        setSourcingPartnerOptions(response?.data);
      })
      .catch((error) => { });
  };

  const fetchCollectionCaseAssignList = () => {
    let payload = {};
    new Promise((resolve, reject) => {
      dispatch(getCollectionCaseAssignWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setFosUserDropDown(response?.data);
      })
      .catch((error) => { });
  };

  const columns = [
    {
      id: "fos_name",
      label: <div className="dashboard-table-row-header">Borrower Name</div>,
      format: (rowData) => (
        <div>
          {stringEllipsis(`${rowData.fos_name}`, 18)}
          <span className="dashboard-table-row-data-tooltip-text">{`${rowData.fos_name} `}</span>
        </div>
      ),
    },

    {
      id: "total_case_allocated",
      label: <div className="dashboard-table-row-header">Case Allocated</div>,
      format: (rowData) => (
        <div className="dashboard-table-row-data">
          {stringEllipsis(`${rowData.total_case_allocated}`, 18)}
          <span className="dashboard-table-row-data-tooltip-text">{`${rowData.total_case_allocated}`}</span>
        </div>
      ),
    },

    {
      id: "total_case_solved",
      label: <div className="dashboard-table-row-header">Solved Case</div>,
      format: (rowData) => (
        <div className="dashboard-table-row-data">
          {stringEllipsis(`${rowData.total_case_solved}`, 18)}
          <span className="dashboard-table-row-data-tooltip-text">{`${rowData.total_case_solved}`}</span>
        </div>
      ),
    },

    {
      id: "total_case_pending",
      label: <div className="dashboard-table-row-header">Pending</div>,
      format: (rowData) => (
        <div className="dashboard-table-row-data">
          {stringEllipsis(`${rowData.total_case_pending}`, 18)}
          <span className="dashboard-table-row-data-tooltip-text">{`${rowData.total_case_pending}`}</span>
        </div>
      ),
    },

    {
      id: "total_amount_collected",
      label: <div className="dashboard-table-row-header">Amount Collected</div>,
      format: (rowData) => (
        <div className="dashboard-table-row-data">
          {stringEllipsis(
            `₹ ${convertIntoINR(rowData.total_amount_collected)}`,
            18
          )}
          <span className="dashboard-table-row-data-tooltip-text">{`₹ ${convertIntoINR(
            rowData.total_amount_collected
          )}`}</span>
        </div>
      ),
    },

    {
      id: "total_amount_pending",
      label: <div className="dashboard-table-row-header">Amount Pending</div>,
      format: (rowData) => (
        <div className="dashboard-table-row-data">
          {stringEllipsis(
            `₹ ${convertIntoINR(rowData.total_amount_pending)}`,
            18
          )}
          <span className="dashboard-table-row-data-tooltip-text">{`₹ ${convertIntoINR(
            rowData.total_amount_pending
          )}`}</span>
        </div>
      ),
    },

    {
      id: "total_scheduled_visit",
      label: <div className="dashboard-table-row-header">Scheduled Visit </div>,
      format: (rowData) => (
        <div className="dashboard-table-row-data-last-item">
          {stringEllipsis(`${rowData.total_scheduled_visit}`, 18)}
          <span className="dashboard-table-row-data-tooltip-text">{`${rowData.total_scheduled_visit}`}</span>
        </div>
      ),
    },
  ];

  const handleFilter = () => {
    setFilter(true);
  };

  const handleCloseFilter = () => {
    setFilter(false);
  };

  const handleChangePage = async (newPage) => {
    setPage(newPage);
    setPayload({ ...payload, page: parseInt(page) + 1 });
  };

  const dashboardDivStyle = {
    border: "1px solid #EDEDED",
    margin: "10px 10px 30px",
    borderRadius: "36px",
  };

  const dashboardChildStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const filterImgStyle = {
    width: "18px",
    height: "18px",
    marginRight: "5px",
  };

  const dropDownImgStyle = {
    width: "18px",
    height: "18px",
  };

  const buttonCustomStyle = {
    width: "199px",
    height: "46px",
    fontFamily: "Montserrat-Regular",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "normal",
    borderRadius: "21px",
    color: "#1A1A1A",
    whiteSpace: "nowrap",
    borderRadius: "23px",
    border: "1px solid #DCDEE6",
    backgroundColor: "#FFF",
    boxShadow: "none",
  };

  const autoCompleteContainer = {
    position: "absolute",
    top: "25px",
    left: "33%",
  };

  async function setArrayInStore(db, storeName, id, sourcingPartner) {
    try {
      await db[storeName].put({ id, myArray: sourcingPartner });
    } catch (error) {
      console.error("Error adding/updating data:", error);
    }
  }

  // Define a function to retrieve an array from a Dexie store
  async function getArrayFromStore(db, storeName, id) {
    try {
      const result = await db[storeName].get(id);
      if (result) {
        return result.myArray;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      return null;
    }
  }

  // useEffect(() => {
  //   async function useDatabase() {
  //     const mySourcing = sourcingPartner;
  //     try {
  //       const db = new Dexie("sourcingPartnerDB");
  //       db.version(1).stores({
  //         theSourcingPartner: "++id,myArray",
  //       });
  //       await db.open();
  //       await setArrayInStore(db, "theSourcingPartner", 1, mySourcing);
  //       const retrievedData = await getArrayFromStore(
  //         db,
  //         "theSourcingPartner",
  //         1
  //       );
  //       if (retrievedData !== null) {
  //         // Use the retrievedData array as needed.
  //       }
  //     } catch (error) {
  //       console.error("Error setting up the database:", error);
  //     }
  //   }

  //   useDatabase();
  // }, [sourcingPartner]); 
  // Run this effect only once when the component mounts





  const sessionData = sessionStorage.setItem("company_code", companyCode);
  const mySessionData = sessionStorage.getItem("lastname");

  return (
    <>
      <div style={autoCompleteContainer}>
        <Autocomplete
          options={sourcingPartnerOptions?.map((data) => ({
            label: data.company_name,
            value: data.company_code,
          }))}
          placeholder="Select Sourcing Partner"
          value={companyName}
          setValue={(value) => setCompanyName(value)}
          onOptionSelect={(value) => setCompanyCode(value)}
          customInputStyle={{ borderRadius: "50%" }}
          customStyleParent={{
            width: innerWidth > 1200 ? "100%" : "85%",
            border: "1px solid grey",
            borderRadius: "35px",
            paddingLeft: "20px",
            paddingTop: "4px",
            height: "48px",
          }}
          customStyleContainer={{
            display: "flex",
          }}
          customStyleDropDownIcon={{
            padding: "0px 15px 0px 15px",
            cursor: "pointer",
          }}
          customStyleInput={{
            width: "300px",
          }}
          customStyleDropDown={{
            marginTop: "8px",
            width: innerWidth > 1200 ? "330px" : "275px",
          }}
        />
      </div>

      <CaseOverview companyCode={companyCode} />

      <DepositionChart companyCode={companyCode} />
      {filter ? (
        <FilterFos
          setPayload={setPayload}
          handleClose={handleCloseFilter}
          fosData={fosData}
          setFosData={setFosData}
          fosUserDropDown={fosUserDropDown}
          payloadData={payloadData}
          payload={payload}
        />
      ) : null}

      <div style={dashboardDivStyle}>
        <div style={dashboardChildStyle}>
          <SummaryWidgets caseSummaryData={caseSummaryData} />
          <div className="buttonDiv">
            <Button
              buttonType="secondary"
              customStyle={buttonCustomStyle}
              onClick={handleFilter}
              label={
                <React.Fragment>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ marginRight: "80px", fontSize: "15px" }}>
                      <img
                        src={filterImage}
                        alt="Filter Icon"
                        style={filterImgStyle}
                      />
                      Filter
                    </div>
                    <img
                      src={dropDownImg}
                      alt="DropDown Icon"
                      style={dropDownImgStyle}
                    />
                  </div>
                </React.Fragment>
              }
            />
          </div>
        </div>

        <div className="tableParentDashboard">
          <Table
            columns={columns}
            data={fosData}
            customStyle={{
              textAlign: "center",
              borderRadius: "0",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {fosData.length > 0 ? (
          <Pagination
            itemsPerPage={limit}
            totalItems={totalCount}
            onPageChange={handleChangePage}
            setRowLimit={setLimit}
          />
        ) : null}
      </div>
    </>
  );
};

export default Dashboard;

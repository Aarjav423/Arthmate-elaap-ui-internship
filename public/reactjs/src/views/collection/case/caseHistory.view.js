import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getCaseCollHistoryByIdWatcher,
  getCaseCollPaymentDataByIdWatcher,
} from "actions/collection/cases.action";
import { COLL_HISTORY_FIELDS } from "../case/staticFields.collHistory";
import {
  formatDateTime,
  convertIntoINR,
  stringEllipsis,
} from "../../../util/collection/helper";
import Accordion from "react-sdk/dist/components/Accordion/Accordion";
import Table from "react-sdk/dist/components/Table/Table";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import { useLocation } from "react-router-dom";
import "./caseHistory.view.css";
import Tab from "../../../components/tabComponent/tabComponent";

export default function CaseHistory({ param }) {
  const dispatch = useDispatch();
  const [caseHistoryDetailsData, setCaseHistoryDetailsData] = useState({});
  const [collCasePaymentData, setCollCasePaymentData] = useState([]);
  const [accordionData, setAccordionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPage, setTotalPage] = useState(0);
  const [activeTab, setActiveTab] = useState("Case History");
  const tabs = ["Case History", "FOS History"];

  useEffect(() => {
    fetchCaseCollectionHistory();
    fetchCaseCollPaymentData();
  }, []);

  const tabContent = {
    Tab1: <div>Content for Tab 1</div>,
    Tab2: <div>Content for Tab 2</div>,
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (tab === "FOS History") {
      fetchCaseCollPaymentData();
    }
  };

  const fetchCaseCollPaymentData = () => {
    const payload = {
      caseId: param.state.caseID,
    };
    new Promise((resolve, reject) => {
      dispatch(getCaseCollPaymentDataByIdWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setCollCasePaymentData(response.data);
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response?.data?.message);
        setTimeout(() => {
          handleAlertClose();
          setIsLoading(false);
        }, 4000);
      });
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 1 &&
      currentPage <= totalPage
    ) {
      setIsLoading(true);
      fetchCaseCollectionHistory();
    }
  };

  const fetchCaseCollectionHistory = () => {
    setIsLoading(true);
    const queryParams = {
      populate: "user",
      type: "visit",
      sortBy: "createdAt:desc",
      page: currentPage,
      limit: itemsPerPage,
    };
    const payload = {
      collId: param.state.collID,
      ...queryParams,
    };
    const fieldsToDelete = ["_id", "__v", "createdAt", "updatedAt", "date"];
    new Promise((resolve, reject) => {
      dispatch(getCaseCollHistoryByIdWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setCaseHistoryDetailsData(response.data);
        const formattedData = response.data.results.map((item) => {
          const title = `Collection ID - ${item.case_id}`;
          let subtitle = "";
          if (item["createdAt"]) {
            subtitle = formatDateTime(item.createdAt);
          }

          // Delete fields listed in fieldsToDelete array if they exist
          fieldsToDelete.forEach((field) => {
            if (item.hasOwnProperty(field)) {
              delete item[field];
            }
          });

          // Update scheduledAt and Date keys format if they exist
          if (item["scheduled_at"]) {
            item["scheduled_at"] = formatDateTime(item["scheduled_at"]);
          }

          if (item["timeSlot"]) {
            item["startTime"] = item["timeSlot"].startTime;
            item["endTime"] = item["timeSlot"].endTime;
            delete item["timeSlot"];
          }
          const itemWithoutDescription = { ...item };
          delete itemWithoutDescription.description;
          const data = Object.keys(itemWithoutDescription).map((key) => ({
            head: (
              <span
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "17px",
                  letterSpacing: "0em",
                  textAlign: "left",
                  color: "#424242",
                }}
              >
                {COLL_HISTORY_FIELDS[key]?.label || key}
              </span>
            ),
            body: (
              <span
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "17px",
                  letterSpacing: "0em",
                  textAlign: "left",
                  color: "#424242",
                }}
              >
                {itemWithoutDescription[key] === ""
                  ? "NA"
                  : COLL_HISTORY_FIELDS[key] &&
                    COLL_HISTORY_FIELDS[key].type == "amount"
                  ? `₹ ${convertIntoINR(itemWithoutDescription[key])}`
                  : `${itemWithoutDescription[key]}`}
              </span>
            ),
          }));
          return { title, data, subtitle };
        });
        setAccordionData((prevData) => [...prevData, ...formattedData]);
        setTotalPage(response.data.totalPages);
        setCurrentPage(currentPage + 1);
        setIsLoading(false);
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response?.data?.message);
        setTimeout(() => {
          handleAlertClose();
          setIsLoading(false);
        }, 4000);
      });
  };

  const LoadingComponent = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        Loading...
      </div>
    );
  };

  return (
    <div
      id="case-details-coll-history"
      className="case-history-container"
      onScroll={handleScroll}
    >
      <Tab
        tabs={tabs}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        tabContent={tabContent[activeTab]}
      />
      {activeTab === "Case History" &&
      accordionData &&
      accordionData.length > 0 ? (
        <>
          <Accordion
            key={accordionData}
            accordionData={accordionData}
            customClass={{
              backgroundColor: "#FFF",
              width: "95%",
              marginLeft: "35px",
              marginRight: "25px",
              marginTop: "35px",
              cursor: "pointer",
            }}
          />
          {isLoading && <LoadingComponent />}
        </>
      ) : activeTab === "FOS History" &&
        collCasePaymentData &&
        collCasePaymentData.length > 0 ? (
        <div style={{ marginLeft: "16px", marginRight: "16px" }}>
          <Table
            customStyle={{
              display: "grid",
              gridTemplateColumns: `14% 17% 14% 12% 14% 14% 17%`,
              height: "64px",
              overflowX: "hidden",
              overflowY: "hidden",
              wordBreak:"break-all"
            }}
            columns={[
              {
                id: "Agent Name",
                label: (
                  <div className="case-history-table-box"> Agent Name</div>
                ),
              },
              {
                id: "Visit Date-Time",
                label: (
                  <div className="case-history-table-box"> Visit Date-Time</div>
                ),
              },
              {
                id: "Collection Amount",
                label: (
                  <div className="case-history-table-box">
                    Collection Amount
                  </div>
                ),
              },
              {
                id: "Payment Mode",
                label: (
                  <div className="case-history-table-box">Payment Mode</div>
                ),
              },
              {
                id: "Collection Status",
                label: (
                  <div className="case-history-table-box">
                    Collection Status
                  </div>
                ),
              },
              {
                id: "Deposited Amount",
                label: (
                  <div className="case-history-table-box">Deposited Amount</div>
                ),
              },
              {
                id: "Deposition Date",
                label: (
                  <div className="case-history-table-box">Deposition Date</div>
                ),
              },
            ]}
            data={collCasePaymentData.map((item, index) => ({
              "Agent Name": (
                <div className="case-history-table-box">
                    {stringEllipsis(`${item.updatedBy.name}`, 15)}
                    <span className="case-history-table-data-tooltip-text">{`${item.updatedBy.name}`}</span>
                </div>
              ),
              "Visit Date-Time": (
                <div className="case-history-table-box">
                  {formatDateTime(item.paymentDate)}
                </div>
              ),
              "Collection Amount": (
                <div className="case-history-table-box">
                  <span
                    className="rupeeSign"
                    style={{ fontFamily: "Open Sans Regular" }}
                  >
                    ₹{" "}
                  </span>
                  {convertIntoINR(item.amount)}
                </div>
              ),
              "Payment Mode": (
                <div className="case-history-table-box">
                  {item.mode === "offline" ? item.method : item.mode}
                </div>
              ),
              "Collection Status": (
                <div className="case-history-table-box">{item.status}</div>
              ),

              "Deposited Amount": (
                <div className="case-history-table-box">
                  {item.is_deposited && item.mode === "offline" ? (
                    <div>
                      <span
                        className="rupeeSign"
                        style={{ fontFamily: "Open Sans Regular" }}
                      >
                        ₹{" "}
                      </span>
                      {convertIntoINR(item.amount)}
                    </div>
                  ) : (
                    "NA"
                  )}
                </div>
              ),

              "Deposition Date": (
                <div className="case-history-table-box">
                  {item.is_deposited
                    ? formatDateTime(item.depositionDate)
                    : "NA"}
                </div>
              ),
            }))}
          />
        </div>
      ) : (
        (isLoading && <div className="loading-text">Loading...</div>) || (
          <div className="loading-text">
            {activeTab === "Case History"
              ? "No Case History Data Available"
              : "No FOS History Data Available"}
          </div>
        )
      )}
    </div>
  );
}

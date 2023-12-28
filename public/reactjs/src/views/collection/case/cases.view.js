import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TabButton from "react-sdk/dist/components/TabButton";
import Button from "react-sdk/dist/components/Button/Button";
import {
  getCollectionListWatcher,
  assignCollectionCasesWatcher,
  getCollectionCaseAssignWatcher,
  getCollectionCaseLmsIdWatcher,
} from "actions/collection/cases.action";
import Table from "react-sdk/dist/components/Table/Table";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import CheckBox from "./components/checkbox/CheckBox";
import FilterComponent from "./FilterComponent";
import Popup from "react-sdk/dist/components/Popup/Popup";
import { getFosUsersWatcher } from "actions/collection/user.action";
import filterImage from "assets/collection/images/Filter_img.svg";
import dropDownImg from "assets/collection/images/dropdown_img.svg";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import useDimensions from "hooks/useDimensions";
import { storedList } from "util/localstorage";
import { useHistory } from "react-router-dom";
import { getDateInFormate, stringEllipsis } from "util/collection/helper";
import AssignCases from "./assignCases/assignCases.view";
import { getAgenciesWatcher } from "actions/collection/agency.action";
import Alert from "react-sdk/dist/components/Alert/Alert";
import "./case.view.css";
import { convertIntoINR } from "util/collection/helper";
import BulkUpload from "./bulkUpload/bulkUpload.view";
import { convertToFloat } from "util/collection/helper";
import SelectedCases from "./selectedCases/selectedCases.view";
import { deAssignCollectionCasesWatcher } from "actions/collection/cases.action";
import ConfirmationPopup from "react-sdk/dist/components/Popup/ConfirmationPopup";
import Autocomplete from "components/Collection/Autocomplete/autoComplete";
import { getCaseSourcingPartnerWatcher } from "actions/collection/cases.action";
const user = storedList("user");

const CollectionCaseList = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const [label, setLabel] = useState("Collection Cases");
  const [payload, setPayload] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedCases, setSelectedCases] = useState([]);
  const [caseType, setCaseType] = useState("new");
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFosUser, setSelectedFosUser] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const { innerWidth, innerHeight } = useDimensions();
  const [fosUserCaseList, setFosUserCaseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lmsIdList, setLmsIdList] = useState([]);
  const [lmsIdInputValue, setLmsIdInputValue] = useState("");
  const [openSelectedCasesModal, setOpenSelectedCasesModal] = useState(false);
  const [openSelectedCasesModalDeAssign, setOpenSelectedCasesModalDeAssign] = useState(false);
  const [openDeassignConfirmationPopup, setOpenDeassignConfirmationPopup] = useState(false);
  const [companyCode, setCompanyCode] = useState("");
  const [sourcingPartner, setSourcingPartner] = useState([]);
  const [sourcingPartnerOptions, setSourcingPartnerOptions] =
    useState(sourcingPartner);
  const [companyName, setCompanyName] = useState("");

  const navigate = useHistory();
  const [filterButton, setFilterButton] = useState(false);
  const styles = useStyles({ innerWidth, innerHeight });

  const casesList = store["fos"]["collectionCases"]
    ? Object.values(store["fos"]["collectionCases"])
    : [];
  const fosUsers = store["fos"]["activeFOS"]
    ? Object.values(store["fos"]["activeFOS"])
    : [];

  useEffect(() => {
    setPayload({ type: "new" });
    fetchAgencies();
    fetchCollectionCaseAssignList();
    fetchCollectionSourcingPartnerList();
  }, []);

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

  useEffect(() => {
    fetchCollectionCaseLmsIdList();
  }, [lmsIdInputValue]);

  useEffect(() => {
    fetchCollectionCasesList(payload);
  }, [payload, companyCode]);

  const applyCaseFilter = (filter) => {
    let {
      minAmount,
      maxAmount,
      minDPD,
      maxDPD,
      pincode,
      lmsId,
      assigned_to,
      ...remainingPayload
    } = payload;
    setPayload({ ...remainingPayload, ...filter });
  };

  const fetchAgencies = () => {
    new Promise((resolve, reject) => {
      dispatch(getAgenciesWatcher({}, resolve, reject));
    });
  };

  const fetchCollectionCasesList = () => {
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch(
        getCollectionListWatcher(
          { ...payload, populate: "assigned_to", company_code: companyCode, },
          resolve,
          reject
        )
      );
    })
      .then((response) => {
        setTotalCount(response?.totalResults || 10);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const fetchCollectionCaseAssignList = (filter) => {
    new Promise((resolve, reject) => {
      dispatch(getCollectionCaseAssignWatcher(filter, resolve, reject));
    })
      .then((response) => {
        setFosUserCaseList(response?.data);
      })
      .catch((error) => {
        setAlert(true);
        setTimeout(() => { }, 4000);
      });
  };

  const fetchCollectionCaseLmsIdList = () => {
    let payload = {
      pattern: lmsIdInputValue,
    };
    new Promise((resolve, reject) => {
      dispatch(getCollectionCaseLmsIdWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setLmsIdList(response?.data);
      })
      .catch((error) => {
        setAlert(true);
        setTimeout(() => { }, 4000);
      });
  };

  const handleDeAssignCases = async () => {
    const cases = selectedCases.map((item) => {
      return { collection_id: item };
    });

    console.log(cases);
    new Promise((resolve, reject) => {
      dispatch(
        deAssignCollectionCasesWatcher(
          { cases, user: user },
          resolve,
          reject
        )
      );
    })
      .then((response) => {
        fetchCollectionCasesList();
        fetchCollectionCaseAssignList();
        setSelectedCases([]);
        setAlert(true);
        setSeverity('success');
        setAlertMessage(response.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const closeFilter = () => {
    setFilterButton(false);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleChangePage = async (newPage) => {
    setPage(newPage);
    setPayload({ ...payload, page: parseInt(newPage) + 1 });
  };

  const handleNewCasesClick = () => {
    setPage(0);
    const { populate, ...newPayload } = payload;
    setPayload({
      ...newPayload,
      minAmount: null,
      maxAmount: null,
      minDPD: null,
      maxDPD: null,
      pincode: null,
      lms_id: null,
      assigned_to: null,
      type: "new",
      page: parseInt(page) + 1,
    });
  };

  const handleInProgressCasesClick = () => {
    setPage(0);
    setPayload({
      ...payload,
      minAmount: null,
      maxAmount: null,
      minDPD: null,
      maxDPD: null,
      pincode: null,
      lms_id: null,
      assigned_to: null,
      type: "inProgress",
      populate: "assigned_to",
      page: parseInt(page) + 1,
    });
  };

  const handleClosedCasesClick = () => {
    setPage(0);
    setPayload({
      minAmount: null,
      maxAmount: null,
      minDPD: null,
      maxDPD: null,
      pincode: null,
      lms_id: null,
      assigned_to: null,
      type: "close",
      populate: "assigned_to",
      page: parseInt(page) + 1,
    });
  };

  const changeActiveTab = (tabName) => {
    const tabClickHandlers = {
      new: handleNewCasesClick,
      "in progress": handleInProgressCasesClick,
      closed: handleClosedCasesClick,
    };
    const tabClickHandler = tabClickHandlers[tabName];
    if (tabClickHandler) {
      setSelectedCases([]);
      tabClickHandler();
    }
  };

  const handleSetTabValue = (e) => {
    let stageName = e.target.value.toLowerCase();
    changeActiveTab(stageName);
    setLmsIdInputValue("");
  };

  const handleFilter = () => {
    setFilterButton(true);
  };

  const handleAssignCasesButtonClick = (e) => {
    e.preventDefault();
    setOpenSelectedCasesModal(true);
    //setOpenDialog(true);
  };

  const handleDeAssignCasesButtonClick = (e) => {
    e.preventDefault();
    setOpenSelectedCasesModalDeAssign(true);
  };

  const handleAssignCases = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    {
      const cases = selectedCases.map((item) => {
        return { collection_id: item };
      });
      new Promise((resolve, reject) => {
        dispatch(
          assignCollectionCasesWatcher(
            { fos_user_id: selectedFosUser, cases, user: user },
            resolve,
            reject
          )
        );
      })
        .then((response) => { })
        .catch((error) => { });
    }
    setIsSubmitting(false);
    setOpenDialog(false);
  };

  const columns = () => {
    if (caseType === "new") {
      return [
        {
          id: "CheckBox",
          label: (
            <CheckBox
              style={{width:innerWidth>1250?'18px':'14px'}}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCases([
                    ...selectedCases,
                    ...casesList.map((item) => item.coll_id),
                  ]);
                } else {
                  const bSet = new Set(casesList.map((item) => item.coll_id));
                  const updatedSelectedCases = selectedCases.filter(
                    (item) => !bSet.has(item)
                  );
                  setSelectedCases(updatedSelectedCases);
                }
              }}
              checked={
                casesList?.length > 0 &&
                casesList
                  .map((item) => item.coll_id)
                  .every((item) => selectedCases.includes(item))
              }
            />
          ),
          format: (rowData) => (
            <CheckBox
            style={{width:innerWidth>1250?'18px':'14px'}}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCases([...selectedCases, rowData.coll_id]);
                } else {
                  setSelectedCases(
                    selectedCases.filter((item) => item != rowData.coll_id)
                  );
                }
              }}
              checked={selectedCases.includes(rowData.coll_id)}
            />
          ),
        },
        {
          id: "LMS_ID",
          label: <div className="case-table-row-header">LMS ID</div>,
          format: (rowData) => (
            <div className="case-table-row-data">
              {/*{`${stringEllipsis(rowData.lms_id, 12)}`}
              <span className="case-table-row-data-tooltip-text">{`${rowData.lms_id}`}</span>*/}
              {rowData.lms_id}
            </div>
          ),
        },
        {
          id: "Collection_ID",
          label: <div className="case-table-row-header"> Collection ID</div>,
          format: (rowData) => (
            <span
              onClick={() =>
                navigate.push(`cases/Borrower_Info`, {
                  caseID: rowData._id,
                  collID: rowData.coll_id,
                  loanAppID: rowData.loan_app_id,
                  companyID: rowData.company_id,
                  productID: rowData.product_id,
                  caseStatus:caseType === "new"
                    ? "open"
                    : caseType == "in progress"
                      ? "ongoing"
                      : "closed"
                })
              }
              style={{ cursor: "pointer", color: "#064586" }}
            >
              <div className="case-table-row-data-link">
                {/*{`${stringEllipsis(rowData.coll_id, 12)}`}
                <span className="case-table-row-data-tooltip-text">{`${rowData.coll_id}`}</span>*/}
                {rowData.coll_id}
              </div>
            </span>
          ),
        },
        {
          id: "Borrower Name",
          label: <div className="case-table-row-header"> Borrower Name </div>,
          format: (rowData) => (
            <div className="case-table-row-data">
              {stringEllipsis(`${rowData.first_name} ${rowData.last_name}`, 18)}
              <span className="case-table-row-data-tooltip-text">{`${rowData.first_name} ${rowData.last_name}`}</span>
            </div>
          ),
        },
        {
          id: "Sourcing Partner",
          label: <div className="case-table-row-header"> Sourcing Partner  </div>,
          format: (rowData) => (
            <div className="case-table-row-data">
              {rowData.company_name}
            </div>
          ),
        },
        {
          id: "Outstanding Amount",
          label: (
            <div className="case-table-row-header"> Outstanding Amount </div>
          ),
          format: (rowData) => (
            <div className="case-table-row-data">{`₹ ${convertIntoINR(
              convertToFloat(rowData.total_outstanding)
            )}`}</div>
          ),
        },

        {
          id: "DPD",
          label: <div className="case-table-row-header"> DPD</div>,
          format: (rowData) => (
            <div className="case-table-row-data">{`${rowData.overdue_days}`}</div>
          ),
        },
      ];
    } else if (caseType === "in progress") {
      return [
        {
          id: "CheckBox",
          label: (
            <CheckBox
            style={{width:innerWidth>1250?'18px':'14px'}}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCases([
                    ...selectedCases,
                    ...casesList.map((item) => item.coll_id),
                  ]);
                } else {
                  const bSet = new Set(casesList.map((item) => item.coll_id));
                  const updatedSelectedCases = selectedCases.filter(
                    (item) => !bSet.has(item)
                  );
                  setSelectedCases(updatedSelectedCases);
                }
              }}
              checked={
                casesList?.length > 0 &&
                casesList
                  .map((item) => item.coll_id)
                  .every((item) => selectedCases.includes(item))
              }
            />
          ),
          format: (rowData) => (
            <CheckBox
            style={{width:innerWidth>1250?'18px':'14px'}}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCases([...selectedCases, rowData.coll_id]);
                } else {
                  setSelectedCases(
                    selectedCases.filter((item) => item != rowData.coll_id)
                  );
                }
              }}
              checked={selectedCases.includes(rowData.coll_id)}
            />
          ),
        },
        {
          id: "LMS_ID",
          label: <div className="case-table-row-header">LMS ID</div>,
          format: (rowData) => (
            <div className="case-table-row-data">
              {/*{`${stringEllipsis(rowData.lms_id, 12)}`}
              <span className="case-table-row-data-tooltip-text">{`${rowData.lms_id}`}</span>*/}
              {rowData.lms_id}
            </div>
          ),
        },
        {
          id: "Collection_ID",
          label: <div className="case-table-row-header">Collection ID</div>,
          format: (rowData) => (
            <span
              onClick={() =>
                navigate.push(`cases/Borrower_Info`, {
                  caseID: rowData._id,
                  collID: rowData.coll_id,
                  loanAppID: rowData.loan_app_id,
                  companyID: rowData.company_id,
                  productID: rowData.product_id,
                  caseStatus:caseType === "new"
                    ? "open"
                    : caseType == "in progress"
                      ? "ongoing"
                      : "closed"
                })
              }
              style={{ cursor: "pointer", color: "#064586" }}
            >
              <div className="case-table-row-data-link">
                {/*{`${stringEllipsis(rowData.coll_id, 12)}`}
                <span className="case-table-row-data-tooltip-text">{`${rowData.coll_id}`}</span>*/}
                {rowData.coll_id}
              </div>
            </span>
          ),
        },
        {
          id: "Borrower Name",
          label: <div className="case-table-row-header">Borrower Name</div>,
          format: (rowData) => (
            <div className="case-table-row-data">
              {stringEllipsis(`${rowData.first_name} ${rowData.last_name}`, 18)}
              <span className="case-table-row-data-tooltip-text">{`${rowData.first_name} ${rowData.last_name}`}</span>
            </div>
          ),
        },
        {
          id: "Sourcing Partner",
          label: <div className="case-table-row-header"> Sourcing Partner  </div>,
          format: (rowData) => (
            <div className="case-table-row-data">
              {`${stringEllipsis(rowData.company_name, innerWidth > 1400 ? 18 : 16)}`}
              <span className="case-table-row-data-tooltip-text">{`${rowData.company_name}`}</span>
            </div>
          ),
        },
        {
          id: "Outstanding Amount",
          label: (
            <div className="case-table-row-header">Outstanding Amount</div>
          ),
          format: (rowData) => (
            <div className="case-table-row-data">{`₹ ${convertIntoINR(
              convertToFloat(rowData.total_outstanding)
            )}`}</div>
          ),
        },
        {
          id: "FOS Agent",
          label: <div className="case-table-row-header">FOS Agent</div>,
          format: (rowData) => (
            <div className="case-table-row-data">
              {rowData.assigned_to && rowData.assigned_to.name ? (
                <React.Fragment>
                  {stringEllipsis(rowData.assigned_to.name, 12)}
                  <span className="case-table-row-data-tooltip-text">
                    {rowData.assigned_to.name}
                  </span>
                </React.Fragment>
              ) : (
                "N/A"
              )}
            </div>
          ),
        },

        {
          id: "DPD",
          label: <div className="case-table-row-header">DPD</div>,
          format: (rowData) => (
            <div className="case-table-row-data">{`${rowData.overdue_days}`}</div>
          ),
        },
      ];
    } else {
      return [
        {
          id: "LMS_ID",
          label: <div className="case-table-row-header">LMS ID</div>,
          format: (rowData) => (
            <div className="case-table-row-data">
              {/*{`${stringEllipsis(rowData.lms_id, 12)}`}
              <span className="case-table-row-data-tooltip-text">{`${rowData.lms_id}`}</span>*/}
              {rowData.lms_id}
            </div>
          ),
        },
        {
          id: "Collection_ID",
          label: <div className="case-table-row-header">Collection ID</div>,
          format: (rowData) => (
            <span
              onClick={() =>
                navigate.push(`cases/Borrower_Info`, {
                  caseID: rowData._id,
                  collID: rowData.coll_id,
                  loanAppID: rowData.loan_app_id,
                  companyID: rowData.company_id,
                  productID: rowData.product_id,
                  caseStatus:
                    caseType === "new"
                      ? "open"
                      : caseType == "in progress"
                        ? "ongoing"
                        : "closed",
                })
              }
              style={{ cursor: "pointer", color: "#064586" }}
            >
              <div
                className="case-table-row-data-link"
              >
                {/*{`${stringEllipsis(rowData.coll_id, 12)}`}
                <span className="case-table-row-data-tooltip-text">{`${rowData.coll_id}`}</span>*/}
                {rowData.coll_id}
              </div>
            </span>
          ),
        },
        {
          id: "Borrower Name",
          label: <div className="case-table-row-header">Borrower Name</div>,
          format: (rowData) => (
            <div className="case-table-row-data">
              {stringEllipsis(
                `${rowData.first_name} ${rowData.last_name}`,
                innerWidth > 1600 ? 18 : 12
              )}
              <span className="case-table-row-data-tooltip-text">{`${rowData.first_name} ${rowData.last_name}`}</span>
            </div>
          ),
        },
        {
          id: "Sourcing Partner",
          label: (
            <div className="case-table-row-header"> Sourcing Partner </div>
          ),
          format: (rowData) => (
            <div className="case-table-row-data">
              {`${stringEllipsis(rowData.company_name, innerWidth > 1400 ? 20 : 12)}`}
              <span className="case-table-row-data-tooltip-text">{`${rowData.company_name}`}</span>
            </div>
          ),
        },
        {
          id: "Amount Close",
          label: <div className="case-table-row-header">Amount Close</div>,
          format: (rowData) => (
            <div className="case-table-row-data">{`₹ ${convertIntoINR(
              convertToFloat(rowData.net_amount_paid)
            )}`}</div>
          ),
        },

        {
          id: "FOS Agent",
          label: <div className="case-table-row-header">FOS Agent</div>,
          format: (rowData) => (
            <div className="case-table-row-data">
              {rowData.assigned_to && rowData.assigned_to.name ? (
                <React.Fragment>
                  {stringEllipsis(rowData.assigned_to.name, innerWidth > 1300 ? 12 : 8)}
                  <span className="case-table-row-data-tooltip-text">
                    {rowData.assigned_to.name}
                  </span>
                </React.Fragment>
              ) : (
                "N/A"
              )}
            </div>
          ),
        },
        {
          id: "Assign Date",
          label: <div className="case-table-row-header">Assign Date</div>,
          format: (rowData) => (
            <div className="case-table-row-data">
              {`${
                rowData.assigned_at
                  ? getDateInFormate(rowData.assigned_at)
                  : "N/A"
                }`}
            </div>
          ),
        },
        {
          id: "Closed Date",
          label: <div className="case-table-row-header">Closed Date</div>,
          format: (rowData) => (
            <div className="case-table-row-data">
              {`${
                rowData.updated_at
                  ? getDateInFormate(rowData.updated_at)
                  : rowData.updatedAt
                    ? getDateInFormate(rowData.updatedAt)
                    : "N/A"
                }`}
            </div>
          ),
        },
        {
          id: "DPD",
          label: <div className="case-table-row-header">DPD</div>,
          format: (rowData) => (
            <div className="case-table-row-data">
              {`${rowData.overdue_days}`}
            </div>
          ),
        },
      ];
    }
  };

  return (
    <>
      <div style={styles["autoCompleteContainer"]}>
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
      {filterButton ? (
        <FilterComponent
          applyCaseFilter={applyCaseFilter}
          closeFilter={closeFilter}
          fosUserCaseList={fosUserCaseList}
          lmsIdList={lmsIdList}
          lmsIdInputValue={lmsIdInputValue}
          setLmsIdInputValue={setLmsIdInputValue}
          payload={payload}
          setPayload={setPayload}
          status={
            caseType === "new"
              ? "open"
              : caseType == "in progress"
                ? "ongoing"
                : "closed"
          }
        />
      ) : null}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "0 20px",
        }}
      >
        <div className="collection-case-heading">{label}</div>
      </div>
      {caseType == "new" ? (
        <BulkUpload
          status={
            caseType === "new"
              ? "open"
              : caseType == "in progress"
                ? "ongoing"
                : "closed"
          }
          onSuccess={(collIds) => {
            setSelectedCases([...selectedCases, ...collIds]);
            setOpenSelectedCasesModal(true);
          }}
        />
      ) : (
        <div />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          justifyContent: "space-between",
          margin: "0 20px",
        }}
      >
        <div>
          {["New", "In Progress", "Closed"].map((template, index) => {
            return (
              <TabButton
                label={template}
                isDisabled={false}
                key={index}
                onClick={handleSetTabValue}
                selected={
                  template.toLowerCase() === caseType.toLowerCase()
                    ? true
                    : false
                }
                setSelectedOption={setCaseType}
              />
            );
          })}
        </div>

        <Button
          buttonType="secondary"
          customStyle={{
            width: "126px",
            height: "34px",
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
          }}
          onClick={handleFilter}
          label={
            <React.Fragment>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ marginRight: "25px" }}>
                  <img
                    src={filterImage}
                    alt="Filter Icon"
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "5px",
                    }}
                  />
                  Filter
                </div>
                <img
                  src={dropDownImg}
                  alt="DropDown Icon"
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                />
              </div>
            </React.Fragment>
          }
        />
      </div>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>Loading...</p>
        </div>
      ) : (
        <Table
          columns={columns()}
          data={casesList}
          customStyle={{
            marginLeft: "10px",
            width: "97%",
            display: "grid",
            gridTemplateColumns: `${caseType === "new"
              ? `6% ${innerWidth > 1400 ? "18%" : "19%"} ${innerWidth > 1400 ? "18%" : "20%"
              } 15% 21% 14% 5%`
              : caseType === "in progress"
                ? `6% ${innerWidth > 1400 ? "17%" : "19%"} ${innerWidth > 1400 ? "16%" : "17%"
                } 15% 14% 15% 10% 4%`
                : `${innerWidth > 1400 ? "19%" : "21%"} ${innerWidth > 1400 ? "16%" : "17%"
                } 11% ${innerWidth > 1400 ? "15%" : "11%"} 10% 8% 9% 9% 4%`
              }`,
            height: "4em",
          }}
        />
      )}
      {casesList.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: "16px",
          }}
        >
          <Pagination
            key={caseType}
            itemsPerPage={limit}
            totalItems={totalCount}
            onPageChange={handleChangePage}
            setRowLimit={setLimit}
          />
          <div style={{display:'flex'}}>
            {caseType === "in progress" && (
              <Button
                label={"De-Assign"}
                customStyle={styles["button"]}
                id="Assign Cases"
                onClick={handleDeAssignCasesButtonClick}
                buttonType="primary"
                isDisabled={selectedCases.length <= 0}
              />
            )}
            {caseType != "closed" && (
              <Button
                label={caseType === "new" ? "Assign Cases" : "Re-Assign"}
                customStyle={styles["button"]}
                id="Assign Cases"
                onClick={handleAssignCasesButtonClick}
                buttonType="primary"
                isDisabled={selectedCases.length <= 0}
              />
            )}
          </div>
        </div>
      )}
      {openSelectedCasesModal ? (
        <SelectedCases
          openSelectedCasesModal={openSelectedCasesModal}
          setOpenSelectedCasesModal={setOpenSelectedCasesModal}
          selectedCases={selectedCases}
          setSelectedCases={setSelectedCases}
          status={
            caseType === "new"
              ? "open"
              : caseType == "in progress"
                ? "ongoing"
                : "closed"
          }
          onProceed={() => {
            setOpenSelectedCasesModal(false);
            setOpenDialog(true);
          }}
          heading={caseType === 'new' ? "Selected Cases" : "Selected Re-assign Cases"}
          proceedText='Proceed'
        />
      ) : (
        <div />
      )}
      {openSelectedCasesModalDeAssign ? (
        <SelectedCases
          openSelectedCasesModal={openSelectedCasesModalDeAssign}
          setOpenSelectedCasesModal={setOpenSelectedCasesModalDeAssign}
          selectedCases={selectedCases}
          setSelectedCases={setSelectedCases}
          status={
            caseType === "new"
              ? "open"
              : caseType == "in progress"
                ? "ongoing"
                : "closed"
          }
          onProceed={() => {
            setOpenDeassignConfirmationPopup(true);
          }}
          heading="Selected De-assign Cases"
          proceedText='Continue'
        />
      ) : (
        <div />
      )}
      {openDeassignConfirmationPopup ? (
        <ConfirmationPopup
          isOpen={openDeassignConfirmationPopup}
          onClose={() => {
            setOpenDeassignConfirmationPopup(false);
          }}
          heading={"Confirm De-assign"}
          confirmationMessage={`Do you really want to De-assign the selected cases?`}
          customStyles={{
            width: "550px",
            height: "228px",
            border: "1px solid #E3E3E3",
            marginLeft: "110px",
            borderRadius: "8px",
            boxShadow: "0px 6px 21px 1px #00000040",
            backgroundColor: "#FFFFFF",
            top: "400px",
            left:"800px"
          }}
          customHeaderStyle={{
            fontFamily: "Montserrat-Regular",
            fontSize: "18px",
            fontWeight: "600",
            lineHeight: "24px",
            letterSpacing: "-0.25px",
            textAlign: "left",
            color: "#303030",
          }}
          customStyles1={{
            fontFamily: "Montserrat-Regular",
            fontSize: "16px",
            fontWeight: "500",
            lineHeight: "25px",
            letterSpacing: "0em",
            textAlign: "center",
            color: "#1C1C1C",
            marginTop: "60px",
          }}
          customYesButtonStyle={{
            color: "#FFFFFF",
            backgroundColor: "#475BD8",
            borderRadius: "26px",
            fontFamily: "Montserrat-Bold",
            border: "1px solid #475BD8",
            marginTop: "12px",
            width: "138px",
            height: "41px",
            fontFamily: "Montserrat-Regular",
            fontSize: "13px",
            fontWeight: "600",
            lineHeight: "15px",
            letterSpacing: "0em",
          }}
          customNoButtonStyle={{
            color: "#475BD8",
            backgroundColor: "white",
            borderRadius: "26px",
            marginLeft: "3%",
            border: "1px solid #475BD8",
            marginTop: "12px",
            width: "138px",
            height: "41px",
            fontFamily: "Montserrat-Regular",
            fontSize: "13px",
            fontWeight: "600",
            lineHeight: "15px",
            letterSpacing: "0em",
          }}
          handleConfirmed={()=>{
            handleDeAssignCases();
            setOpenDeassignConfirmationPopup(false);
            setOpenSelectedCasesModalDeAssign(false);
          }}
          yes={"Yes"}
          no={"No"}
        />
      ) : null}
      <Popup
        showPopup={2}
        drawdownData={[]}
        heading="Select FOS"
        customJsx={() => (
          <AssignCases
            onSuccess={(response) => {
              fetchCollectionCasesList();
              fetchCollectionCaseAssignList();
              setSelectedCases([]);
            }}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            selectedCases={selectedCases}
            setOpenDialog={setOpenDialog}
            onAlert={(severity, message) => {
              setAlert(true);
              setSeverity(severity);
              setAlertMessage(message);
            }}
          />
        )}
        customStyles={{
          width: innerWidth > 900 ? "40vw" : innerWidth > 600 ? "50vw" : "80vw",
          height: "95vh",
          marginRight: "2vh",
        }}
        customStylesForOutsideModal={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
        hideButton={true}
        isModalOpen={openDialog}
        buttonText={isSubmitting ? "Submitting" : "Submit"}
        onClickOutsideModal={() => {
          return;
        }}
        callback={(isModalOpen) => {
          if (!isModalOpen) {
            setOpenDialog(false);
          }
        }}
      />
      {alert ? (
        <Alert
          severity={severity}
          message={alertMessage}
          handleClose={handleAlertClose}
          style={{ position: "fixed", marginTop: "1vh" }}
        />
      ) : null}
    </>
  );
};

export default CollectionCaseList;

const useStyles = ({ innerWidth, innerHeight }) => {
  return {
    inputBox: {
      height: "55px",
      width: innerWidth > 900 ? "37vw" : innerWidth > 600 ? "45vw" : "70vw",
      maxWidth: "100vw",
      paddingTop: "5px",
    },
    button: {
      height: "40px",
      width: innerWidth > 1400 ? "10vw" : innerWidth > 900 ? "15vw" : "18vw",
      borderRadius: "20px",
      fontSize: "14px",
      padding: 0,
    },
    buttonLoader: {
      border: "3px solid white",
      borderTop: "3px solid transparent",
    },
    dropdown: {
      zIndex: 1000,
      marginTop: "10px",
    },
    autoCompleteContainer: {
      position: "absolute",
      top: "25px",
      left: "33%",
    }
  };
};

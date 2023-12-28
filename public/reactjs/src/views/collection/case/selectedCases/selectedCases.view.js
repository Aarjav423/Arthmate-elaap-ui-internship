import { getCollectionCaseSelectedWatcher } from "../../../../actions/collection/cases.action";
import useDimensions from "../../../../hooks/useDimensions";
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDateInFormate,
  stringEllipsis,
  convertIntoINR,
  convertToFloat,
} from "../../../../util/collection/helper";
import Button from "react-sdk/dist/components/Button/Button";
import { storedList } from "util/localstorage";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import Table from "react-sdk/dist/components/Table/Table";
import CheckBox from "../components/checkbox/CheckBox";
import Alert from "react-sdk/dist/components/Alert/Alert";

import "./selectedCases.view.css";

const user = storedList("user");

const selectedCasesLimitBigScreen = 8;
const selectedCasesLimitMediumScreen = 5;

export default function SelectedCases({
  openSelectedCasesModal,
  setOpenSelectedCasesModal,
  selectedCases,
  setSelectedCases,
  status,
  onProceed,
  heading = 'Selected Cases',
  proceedText = 'Proceed',
}) {
  const dispatch = useDispatch();
  const [selectedCasesList, setSelectedCasesList] = useState([]);
  const [limit, setLimit] = useState(
    window.innerHeight < 800
      ? selectedCasesLimitMediumScreen
      : selectedCasesLimitBigScreen
  );
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [loading, setLoading] = useState(false);
  const { innerWidth, innerHeight } = useDimensions();

  const styles = useStyles({ innerWidth, innerHeight });

  useEffect(() => {
    if (innerHeight < 800) {
      setLimit(selectedCasesLimitMediumScreen);
    } else {
      setLimit(selectedCasesLimitBigScreen);
    }
  }, [innerHeight]);

  useEffect(() => {
    if (openSelectedCasesModal) {
      fetchSelectedCases();
    }
  }, [openSelectedCasesModal, limit, page]);

  const fetchSelectedCases = () => {
    const temp = [];

    selectedCases.forEach((element) => {
      temp.push({
        collection_id: element,
      });
    });

    const payload = {
      cases: temp,
      limit: limit,
      page: page + 1,
      status: status,
      user: user,
    };
    new Promise((resolve, reject) => {
      dispatch(getCollectionCaseSelectedWatcher(payload, resolve, reject));
    })
      .then((response) => {
        const res = response.data;
        setSelectedCasesList(res.results);
        setTotalCount(res.totalResults);
      })
      .catch((error) => {
        const errorResponse = error?.response?.data?.message;
        setAlert(true);
        setSeverity("error");
        setAlertMessage(errorResponse);
      });
  };

  const handleChangePage = async (newPage) => {
    setPage(newPage);
  };

  const columns = () => {
    return [
      {
        id: "CheckBox",
        label: (
          <CheckBox
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedCases([
                  ...selectedCases,
                  ...selectedCasesList.map((item) => item.coll_id),
                ]);
              } else {
                const bSet = new Set(
                  selectedCasesList.map((item) => item.coll_id)
                );
                const updatedSelectedCases = selectedCases.filter(
                  (item) => !bSet.has(item)
                );
                setSelectedCases(updatedSelectedCases);
              }
            }}
            checked={
              selectedCasesList?.length > 0 &&
              selectedCasesList
                .map((item) => item.coll_id)
                .every((item) => selectedCases.includes(item))
            }
          />
        ),
        format: (rowData) => (
          <CheckBox
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
        label: <div className="selected-case-table-row-header">LMS ID</div>,
        format: (rowData) => (
          <div className="selected-case-table-row-data">{rowData.lms_id}</div>
        ),
      },
      {
        id: "Collection_ID",
        label: <div className="selected-case-table-row-header"> Collection ID</div>,
        format: (rowData) => (
          <div className="selected-case-table-row-data">{rowData.coll_id}</div>
        ),
      },
      {
        id: "Borrower Name",
        label: <div className="selected-case-table-row-header"> Borrower Name </div>,
        format: (rowData) => (
          <div className="selected-case-table-row-data">
            {stringEllipsis(`${rowData.first_name} ${rowData.last_name}`, 18)}
            <span className="selected-case-table-row-data-tooltip-text">{`${rowData.first_name} ${rowData.last_name}`}</span>
          </div>
        ),
      },
      {
        id: "Outstanding Amount",
        label: (
          <div className="selected-case-table-row-header"> Outstanding Amount </div>
        ),
        format: (rowData) => (
          <div className="selected-case-table-row-data">{`₹ ${convertIntoINR(
            convertToFloat(rowData.total_outstanding)
          )}`}</div>
        ),
      },

      {
        id: "DPD",
        label: <div className="selected-case-table-row-header"> DPD</div>,
        format: (rowData) => (
          <div className="selected-case-table-row-data">{`${rowData.overdue_days}`}</div>
        ),
      },
    ];
  };

  return (
    <FormPopup
      isOpen={openSelectedCasesModal}
      onClose={() => setOpenSelectedCasesModal(false)}
      heading={heading}
      customStyles={{
        width: "90vw",
        minHeight: "40vh",
        maxHeight: "96vh",
        overflowY: "none",
      }}
      customStyles1={{ overflow: "auto", maxHeight: "90vw" }}
    >
      <Table
        columns={columns()}
        data={selectedCasesList}
        customStyle={{
          display: "grid",
          gridTemplateColumns: `10% 23% 23% 16% 16% 10%`
        }}
      />
      <Pagination
        key={status}
        itemsPerPage={limit}
        totalItems={totalCount}
        onPageChange={handleChangePage}
        setRowLimit={setLimit}
      />
      <div className="selected-cases-proceed-button-container">
        <Button
          label={proceedText}
          customStyle={styles["button"]}
          id="Assign Cases"
          onClick={onProceed}
          buttonType="primary"
          isDisabled={selectedCases.length <= 0}
        />
      </div>
    </FormPopup>
  );
}

const useStyles = ({ innerWidth, innerHeight }) => {
  return {
    button: {
      height: "45px",
      width: "200px",
      borderRadius: "18px",
      fontSize: "14px",
      padding: 0,
      marginRight: "1.5vw",
      left: "40%",
      right: "50%",
    },
  };
};

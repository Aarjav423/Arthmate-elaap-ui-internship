import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-sdk/dist/components/Table/Table";
import Button from "react-sdk/dist/components/Button/Button";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import ToggleSwitch from "react-sdk/dist/components/ToggleSwitch/ToggleSwitch";
import EditIcon from "../../../assets/collection/images/edit_image.svg";
import addImage from "../../../assets/collection/images/add_image.svg";
import Typography from "@mui/material/Typography";
import Popup from "react-sdk/dist/components/Popup/Popup";
import Alert from "react-sdk/dist/components/Alert/Alert";
import { AddAgency, EditAgency } from "./agencyForm";
import { storedList } from "../../../util/localstorage";
import useDimensions from "hooks/useDimensions";
import { getAgenciesWatcher } from "actions/collection/agency.action";
import { updateCollectionAgencyWatcher } from "actions/collection/agency.action";

const user = storedList("user");

export default function CollectionAgency(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const { innerWidth, innerHeight } = useDimensions();

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isAgencyFormModalOpen, setIsAgencyFormModalOpen] = useState(false);
  const [goToPage, setGoToPage] = useState(null);
  const [agencyFormType, setAgencyFormType] = useState(0);
  const [selectedAgency, setSelectedAgency] = useState(null);

  const collectionAgency = Object.values(store["fos"]["collectionAgency"])

  useEffect(() => {
    fetchCollectionAgency();
  }, [page, rowsPerPage]);

  useEffect(() => {
    setGoToPage(null);
  }, [goToPage]);

  useEffect(() => {
    fetchCollectionAgency();
  }, []);

  const fetchCollectionAgency = () => {
    const payload = {
      page: parseInt(page) + 1,
      limit: rowsPerPage,
      pagination: true,
    };
    new Promise((resolve, reject) => {
      dispatch(getAgenciesWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setCount(response.data.totalResults)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const onClickAddAgency = () => {
    setAgencyFormType(0);
    setIsAgencyFormModalOpen(true);
  };

  const handleOpenEditIcon = (agency) => {
    setSelectedAgency(agency);
    setAgencyFormType(1);
    setIsAgencyFormModalOpen(true);
  };

  const handleToggleChange = (agencyId, isActive) => {
    new Promise((resolve, reject) => {
      dispatch(
        updateCollectionAgencyWatcher(
          { agencyId: agencyId, isActive: isActive, user: user },
          resolve,
          reject
        )
      );
    })
      .then((response) => {
        let agency = response.data;
        setAlert(true);
        setSeverity(`success`);
        setAlertMessage(
          `${agency["name"]}'s  status has been ${
            agency["isActive"] ? "activated" : "deactivated"
          }`
        );
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(`Please check your internet connectivity.`);
      });
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const onFormSuccess = (response, type) => {
    setAlert(true);
    setSeverity("success");
    setAlertMessage(response["message"]);
    setIsAgencyFormModalOpen(false);
    if (type == "add" && count - page * rowsPerPage >= rowsPerPage) {
      setPage(parseInt(count / rowsPerPage));
      setGoToPage(parseInt(count / rowsPerPage) + 1);
    }
  };

  let collectionAgencyData = collectionAgency.map((item, index) => {
    return {
      "key": Symbol(),
      "S.NO.": (page * rowsPerPage + index + 1).toString().padStart(2, "0"),
      "Agency Name": (
        <Typography
          sx={{
            fontFamily: "Montserrat-Regular",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: "17px",
            color: "#1C1C1C",
          }}
        >
          {item.name}
        </Typography>
      ),
      Status: (
        <ToggleSwitch
          checked={item.isActive}
          onChange={(value) => {
            handleToggleChange(item._id, !value);
          }}
        />
      ),

      Action: (
        <div
          style={{ cursor: "pointer", display: "flex", flexDirection: "row" }}
          onClick={() => {
            handleOpenEditIcon(item);
          }}
        >
          <img style={{ marginRight: "10px" }} src={EditIcon} alt="svg" />
        </div>
      ),
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          marginLeft: "16px",
          marginRight: "16px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#1C1C1C",
            fontFamily: "Montserrat-Regular",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "24px",
            letterSpacing: "-0.25px",
          }}
        >
          <b>Collection Agency</b>
        </Typography>
        <Button
          buttonType="secondary"
          customStyle={{
            width: "136px",
            height: "42px",
            backgroundColor: "#475BD8",
            fontFamily: "Montserrat-Regular",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            borderRadius: "21px",
            color: "#FFF",
            whiteSpace: "nowrap",
          }}
          onClick={onClickAddAgency}
          label={
            <React.Fragment>
              <img
                src={addImage}
                alt="Add Icon"
                style={{ marginRight: "2px" }}
              />
              Add Agency
            </React.Fragment>
          }
        />
      </div>
      <div style={{ marginLeft: "16px", marginRight: "16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p>Loading...</p>
          </div>
        ) : (
          <Table
            columns={[
              { id: "S.NO.", label: "S.NO." },
              { id: "Agency Name", label: "Agency Name" },
              { id: "Status", label: "Status" },
              { id: "Action", label: "Action" },
            ]}
            data={collectionAgencyData}
            columnStyles={{
              color: "#1C1C1C",
              fontFamily: "Montserrat-Regular",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "normal",
            }}
          />
        )}
        <div
          style={{
            width: "99%",
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: "-20px",
          }}
        >
          {collectionAgencyData.length>0 &&<Pagination
            itemsPerPage={rowsPerPage}
            totalItems={count}
            onPageChange={handleChangePage}
            setRowLimit={setRowsPerPage}
            goToPage={goToPage ? goToPage : null}
          />}
        </div>
      </div>
      <Popup
        showPopup={2}
        drawdownData={[]}
        customJsx={() => {
          if (agencyFormType == 1) {
            return (
              <EditAgency
                onSuccess={(response) => onFormSuccess(response, "edit")}
                selectedAgency={selectedAgency}
                onAlert={(severity, message) => {
                  setAlert(true);
                  setSeverity(severity);
                  setAlertMessage(message);
                }}
              />
            );
          }

          return (
            <AddAgency
              onSuccess={(response) => onFormSuccess(response, "add")}
              onAlert={(severity, message) => {
                setAlert(true);
                setSeverity(severity);
                setAlertMessage(message);
              }}
            />
          );
        }}
        heading={agencyFormType == 1 ? "Edit Agency" : "Add Agency"}
        customStyles={{
          width: innerWidth > 900 ? "40vw" : innerWidth > 600 ? "50vw" : "80vw",
          height: "95vh",
          marginRight: "2vh",
          paddingRight: 0,
        }}
        customStylesForOutsideModal={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
        hideButton={true}
        isModalOpen={isAgencyFormModalOpen}
        buttonText="Add Agency"
        onClickOutsideModal={() => {
          return;
        }}
        callback={(isModalOpen) => {
          if (!isModalOpen) {
            setIsAgencyFormModalOpen(false);
          }
        }}
      />
      {alert ? (
        <Alert
          severity={severity}
          message={alertMessage}
          handleClose={handleAlertClose}
        />
      ) : null}
    </div>
  );
}

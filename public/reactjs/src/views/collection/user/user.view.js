import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-sdk/dist/components/Table/Table";
import Button from "react-sdk/dist/components/Button/Button";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import ToggleSwitch from "react-sdk/dist/components/ToggleSwitch/ToggleSwitch";
import actionIcon from "../../../assets/collection/images/action.svg";
import addImage from "../../../assets/collection/images/add_image.svg";
import Typography from "@mui/material/Typography";
import Popup from "react-sdk/dist/components/Popup/Popup";
import Alert from "react-sdk/dist/components/Alert/Alert";
import { AddUser, EditUser } from "./userForm";
import {
  getFosUsersWatcher,
  updateFosUserWatcher,
} from "../../../actions/collection/user.action";
import { storedList } from "../../../util/localstorage";
import useDimensions from "hooks/useDimensions";
import { getAgenciesWatcher } from "actions/collection/agency.action";
import ConfirmationPopup from "react-sdk/dist/components/Popup/ConfirmationPopup";

const user = storedList("user");

export default function FosUsers(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const { innerWidth, innerHeight } = useDimensions();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [fosUsers, setFosUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [toggleStates, setToggleStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUserFormModalOpen, setIsUserFormModalOpen] = useState(false);
  const [goToPage, setGoToPage] = useState(null);
  const [userFormType, setUserFormType] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (selectedRowIndex || selectedRowIndex === 0) {
        const dialog = document.querySelector(".dialogContainer > .dialog");
        if (dialog && !dialog.contains(e.target)) {
          setSelectedRowIndex(null);
        }
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [selectedRowIndex]);

  useEffect(() => {
    setFosUsers(Object.values(store["fos"]["users"]));
  }, [store["fos"]["users"]]);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    setGoToPage(null);
  }, [goToPage]);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = () => {
    new Promise((resolve, reject) => {
      dispatch(getAgenciesWatcher({}, resolve, reject));
    });
  };

  const fetchData = async () => {
    const payload = {
      page: parseInt(page) + 1,
      limit: rowsPerPage,
      populate: "collection_agency_id",
    };
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch(getFosUsersWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setCount(response.totalResults);
        setToggleStates(response.results.map((user) => user.isActive));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(true);
      });
  };

  const handleChangePage = (newPage) => {
    setLoading(true);
    setPage(newPage);
  };

  const onClickAddFos = () => {
    setUserFormType(0);
    setIsUserFormModalOpen(true);
  };

  const handleOpenEditIcon = (user) => {
    setSelectedRowIndex(null);
    setSelectedUser(user);
    setUserFormType(1);
    setIsUserFormModalOpen(true);
  };

  const handleClose = () => {
    setOpenPopup(false);
  };

  const handleConfirmed = () => {
    setOpenPopup(false);
    new Promise((resolve, reject) => {
      dispatch(
        updateFosUserWatcher(
          { userId: selectedUser._id, isUpdatePassword: true, user: user },
          resolve,
          reject
        )
      );
    })
      .then((response) => {
        let user = response.data;
        setAlert(true);
        setSeverity(`success`);
        setAlertMessage(`The password for an FOS agent has been reset.`);
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(`Please check your internet connectivity.`);
      });
  };

  const handlePasswordReset = (user) => {
    setSelectedRowIndex(null);
    setSelectedUser(user);
    setOpenPopup(true);
  };

  const handleToggleChange = (userId, isActive, index) => {
    const updatedToggleStates = [...toggleStates];
    updatedToggleStates[index] = isActive;
    setToggleStates(updatedToggleStates);
    new Promise((resolve, reject) => {
      dispatch(
        updateFosUserWatcher(
          { userId: userId, isActive: isActive, user: user },
          resolve,
          reject
        )
      );
    })
      .then((response) => {
        let user = response.data;
        setAlert(true);
        setSeverity(`success`);
        setAlertMessage(
          `${user["name"]}'s  status has been ${
            user["isActive"] ? "activated" : "deactivated"
          }`
        );
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(
          error.response.data
            ? error.response.data.message
            : "Please check your internet connectivity"
        );
        setTimeout(() => {
          updatedToggleStates[index] = !isActive;
          setToggleStates(updatedToggleStates);
        }, 1000);
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
    setIsUserFormModalOpen(false);
    if (type == "add" && count - page * rowsPerPage >= rowsPerPage) {
      setPage(parseInt(count / rowsPerPage));
      setGoToPage(parseInt(count / rowsPerPage) + 1);
    }
  };

  let fosUsersData = fosUsers.map((item, index) => {
    return {
      "S.NO.": (page * rowsPerPage + index + 1).toString().padStart(2, "0"),
      "Agent Name": (
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
      Type: (
        <Typography
          sx={{
            fontFamily: "Montserrat-Regular",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: "17px",
            color: "#1C1C1C",
          }}
        >
          FOS Agent
        </Typography>
      ),
      Status: (
        <ToggleSwitch
          checked={toggleStates[index]}
          onChange={(value) => {
            handleToggleChange(item._id, !value, index);
          }}
        />
      ),
      Agency: (
        <Typography
          sx={{
            fontFamily: "Montserrat-Regular",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: "17px",
            color: "#1C1C1C",
          }}
        >
          {item.collection_agency_id && item.collection_agency_id.name
            ? item.collection_agency_id.name
            : "N/A"}
        </Typography>
      ),

      Action: (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            position: "relative",
            marginLeft: "21px",
          }}
        >
          <img
            onClick={() => {
              setSelectedRowIndex(index);
            }}
            style={{ cursor: "pointer" }}
            src={actionIcon}
            alt="svg"
          />
          {selectedRowIndex === index && (
            <div className="dialogContainer">
              <div
                className="dialog"
                style={{
                  position: "absolute",
                  width: "174px",
                  height: "52px",
                  bottom: "calc(100%)",
                  right: "calc(100% - 3px)",
                  backgroundColor: "#FEFEFE",
                  border: "1px solid #EDEDED",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px 0px #6F6F6F40",
                  zIndex: "2",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    fontFamily: "Montserrat-Regular",
                    fontSize: "12px",
                    fontWeight: "600",
                    lineHeight: "15px",
                    color: "#625E5E  ",
                  }}
                >
                  <span
                    style={{ margin: "auto", cursor: "pointer" }}
                    onClick={() => {
                      handleOpenEditIcon(item);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#475BD8";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#625E5E";
                    }}
                  >
                    Edit
                  </span>
                  |
                  <span
                    style={{ margin: "auto", cursor: "pointer" }}
                    onClick={() => {
                      handlePasswordReset(item);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#475BD8";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#625E5E";
                    }}
                  >
                    Reset Password
                  </span>
                </div>
              </div>
            </div>
          )}
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
          <b>Existing FOS</b>
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
          onClick={onClickAddFos}
          label={
            <React.Fragment>
              <img
                src={addImage}
                alt="Add Icon"
                style={{ marginRight: "2px" }}
              />
              Add FOS
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
              { id: "Agent Name", label: "Agent Name" },
              { id: "Type", label: "Type" },
              { id: "Agency", label: "Agency" },
              { id: "Status", label: "Status" },
              { id: "Action", label: "Action" },
            ]}
            data={fosUsersData}
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
          <Pagination
            itemsPerPage={rowsPerPage}
            totalItems={count}
            onPageChange={handleChangePage}
            setRowLimit={setRowsPerPage}
            goToPage={goToPage ? goToPage : null}
          />
        </div>
      </div>
      <Popup
        showPopup={2}
        drawdownData={[]}
        customJsx={() => {
          if (userFormType == 1) {
            return (
              <EditUser
                onSuccess={(response) => onFormSuccess(response, "edit")}
                selectedUser={selectedUser}
                onAlert={(severity, message) => {
                  setAlert(true);
                  setSeverity(severity);
                  setAlertMessage(message);
                }}
              />
            );
          }

          return (
            <AddUser
              onSuccess={(response) => onFormSuccess(response, "add")}
              onAlert={(severity, message) => {
                setAlert(true);
                setSeverity(severity);
                setAlertMessage(message);
              }}
            />
          );
        }}
        heading={userFormType == 1 ? "Edit FOS" : "Add FOS"}
        customStyles={{
          width: innerWidth > 900 ? "40vw" : innerWidth > 600 ? "50vw" : "80vw",
          height: "95vh",
          marginRight: "2vh",
          paddingRight: 0,
        }}
        customStylesForOutsideModal={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
        hideButton={true}
        isModalOpen={isUserFormModalOpen}
        buttonText="Add FOS"
        onClickOutsideModal={() => {
          return;
        }}
        callback={(isModalOpen) => {
          if (!isModalOpen) {
            setIsUserFormModalOpen(false);
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
      {openPopup ? (
        <ConfirmationPopup
          isOpen={openPopup}
          onClose={handleClose}
          heading={"Reset Password"}
          confirmationMessage={`Do you really want to reset your FOS Agent password?`}
          customStyles={{
            width: "550px",
            height: "228px",
            border: "1px solid #E3E3E3",
            marginLeft: "110px",
            borderRadius: "8px",
            boxShadow: "0px 6px 21px 1px #00000040",
            backgroundColor: "#FFFFFF",
            top: "240px",
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
          handleConfirmed={handleConfirmed}
          yes={"Yes"}
          no={"No"}
        />
      ) : null}
    </div>
  );
}

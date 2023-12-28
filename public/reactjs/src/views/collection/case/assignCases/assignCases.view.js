import { assignCollectionCasesWatcher } from "../../../../actions/collection/cases.action";
import { getFosUsersWatcher } from "../../../../actions/collection/user.action";
import useDimensions from "hooks/useDimensions";
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-sdk/dist/components/Button/Button";
import { storedList } from "util/localstorage";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";

import "./assignCases.view.css";
import { findByAttribute } from "util/helper";

const user = storedList("user");

export default function AssignCases(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const { innerWidth, innerHeight } = useDimensions();
  const [agency, setAgency] = useState();
  const [filterButton, setFilterButton] = useState(false);
  const [selectedFosUser, setSelectedFosUser] = useState();
  const [agenciesDropdown, setAgenciesDropdown] = useState([]);

  const styles = useStyles({ innerWidth, innerHeight });

  const fosUsers = store["fos"]["activeFOS"]
    ? Object.values(store["fos"]["activeFOS"])
    : [];

  useEffect(() => {
    populateAgencies();
  }, [store["fos"]["agencies"]]);

  const populateAgencies = () => {
    var tempAgencies = [];
    for (let element of Object.values(store["fos"]["agencies"])) {
      tempAgencies.push({
        label: element.name,
        value: element.id,
      });
    }
    setAgenciesDropdown(tempAgencies);
  };

  const fetchFosUsers = async (agencyId) => {
    const payload = {
      pagination: "false",
      collection_agency_id: agencyId,
    };
    new Promise((resolve, reject) => {
      dispatch(getFosUsersWatcher(payload, resolve, reject));
    })
      .then((response) => { })
      .catch((error) => {
        console.log("some error occurs in fetch fos users.", error);
      });
  };

  const handleAssignCases = async (e) => {
    e.preventDefault();
    props.setIsSubmitting(true);

    const cases = props.selectedCases.map((item) => {
      return { collection_id: item };
    });

    console.log;
    new Promise((resolve, reject) => {
      dispatch(
        assignCollectionCasesWatcher(
          { fos_user_id: selectedFosUser, cases, user: user },
          resolve,
          reject
        )
      );
    })
      .then((response) => {
        props.onAlert("success", response.message);
        props.onSuccess();
      })
      .catch((error) => {
        console.log(error);
      });
    props.setIsSubmitting(false);
    props.setOpenDialog(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div style={{ marginBottom: "20px", marginTop: "7vh" }}>
        <InputBox
          id={"select_agency"}
          label={"Select Collection Agency"}
          name={"select_collection_agency"}
          placeholder={"Select Collection Agency"}
          initialValue={agency}
          customDropdownClass={{
            ...styles["dropdown"],
          }}
          isRequired={true}
          isDrawdown={true}
          options={agenciesDropdown}
          onDrawdownSelect={(value) => {
            const ob = findByAttribute(
              Object.values(store["fos"]["agencies"]),
              "name",
              value
            );
            setAgency(value)
            fetchFosUsers(ob.id);
          }}
          customClass={styles["inputBox"]}
          error={false}
          helperText={"Helper text"}
          onClick={(e) => { }}
        />
      </div>

      <div
        style={{
          marginTop: "1vh",
          marginLeft: "0.8vw",
          maxHeight: innerWidth > 1400 ? "65vh" : "63vh",
          overflowY: "scroll",
        }}
      >
        {agency && fosUsers?.map((item) => {
          return (
            <div key={item.id}>
              <label className="assign-cases-radio-button-label">
                <input
                  type="radio"
                  value={item.id}
                  checked={selectedFosUser === item.id}
                  onChange={() => {
                    setSelectedFosUser(item.id);
                  }}
                  className="assign-cases-radio-button-input"
                />
                {item.name}
              </label>
            </div>
          );
        })}
      </div>
      <div className="assign-cases-submitButton-container">
        <Button
          label={"Assign"}
          buttonType="secondary"
          isLoading={props.isSubmitting}
          isDisabled={
            props.isSubmitting || !selectedFosUser ? true : false
          }
          id="Assign Cases"
          onClick={handleAssignCases}
          customStyle={{
            backgroundColor: `${!selectedFosUser ? "#8E8E8F" : "#475BD8"
              }`,
            cursor: !selectedFosUser ? 'not-allowed' : 'pointer',
            ...styles["button"]
          }}
        />
      </div>
    </form>
  );
}

const useStyles = ({ innerWidth, innerHeight }) => {
  return {
    inputBox: {
      height: "55px",
      width: innerWidth > 900 ? "37vw" : innerWidth > 600 ? "45vw" : "70vw",
      maxWidth: "100vw",
      paddingTop: "5px",
      border: "1px solid #BBBFCC",
    },
    button: {
      height: "40px",
      width: "160px",
      borderRadius: "20px",
      marginLeft: "16px",
      fontSize: "14px",
      padding: 0,
      boxShadow: "none",
      color: "#fff",
    },
    buttonLoader: {
      border: "3px solid white",
      borderTop: "3px solid transparent",
    },
    dropdown: {
      zIndex: 1000,
      marginTop: "8px",
      width: innerWidth > 900 ? "37vw" : innerWidth > 600 ? "45vw" : "70vw",
    },
  };
};

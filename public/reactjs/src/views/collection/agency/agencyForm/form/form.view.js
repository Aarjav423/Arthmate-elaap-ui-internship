import React, { useEffect, useState } from "react";
import "./form.view.css";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import useDimensions from "hooks/useDimensions";
import { COLLECTION_AGENCY_FORM_FIELDS } from "../formFields.agencyForm";
import { useSelector } from "react-redux";
import Button from "react-sdk/dist/components/Button";
import { toCamel } from "util/helper";
import { storedList } from "util/localstorage";

const user = storedList("user");
const collectionAgencyFormFields = COLLECTION_AGENCY_FORM_FIELDS;
export default function AgencyForm(props) {
  const store = useSelector((state) => state);
  const [formAgency, setFormAgency] = useState(props.formAgency);
  const [agencyErrors, setAgencyErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { innerWidth, innerHeight } = useDimensions();
  const styles = useStyles({ innerWidth, innerHeight });
  const onChangeValue = (e) => {
    setFormAgency({
      ...formAgency,
      [e.id]: e.value,
    });
  };

  const handleValidations = () => {
    let errors = {};
    for (let attribute in collectionAgencyFormFields) {
      if (
        collectionAgencyFormFields[attribute] &&
        collectionAgencyFormFields[attribute].isRequired
      ) {
        if (!formAgency[attribute] || formAgency[attribute].length === 0) {
          errors[attribute] = `${toCamel(
            collectionAgencyFormFields[attribute].label,
            true
          )} is required`;
        }
      }
    }
    return errors;
  };

  const onSubmit = () => {
    let errors = handleValidations();
    if (Object.keys(errors).length != 0) {
      setAgencyErrors(errors);
      return;
    }
    setIsLoading(true);
    setIsDisabled(true);
    props
      .onSubmit({ ...formAgency, user: user })
      .then((response) => {
        setIsLoading(false);
        setIsDisabled(false);
        props.onSuccess(response);
      })
      .catch((error) => {
        const errorResponse = error?.response?.data;

        if (errorResponse) {
          props.onAlert("error", errorResponse["message"]);
          errors = errorResponse["errors"];
          if (errors) {
            setAgencyErrors(errors);
          }
          setIsLoading(false);
          setIsDisabled(false);
        }
      });
  };

  return (
    <React.Fragment>
      <div style={{ paddingTop: "8vh" }}>
        <div style={{ overflowY: "scroll", maxHeight: "73vh" }}>
          <div className="agency-form-input-container">
            <InputBox
              customClass={styles["inputBox"]}
              customInputClass={styles["inputBoxInner"]}
              id={collectionAgencyFormFields["name"]["id"]}
              label={collectionAgencyFormFields["name"]["label"]}
              type={collectionAgencyFormFields["name"]["type"]}
              name={collectionAgencyFormFields["name"]["name"]}
              placeholder={collectionAgencyFormFields["name"]["placeholder"]}
              isRequired={collectionAgencyFormFields["name"]["isRequired"]}
              initialValue={formAgency["name"]}
              error={agencyErrors["name"]}
              helperText={agencyErrors["name"]}
              onClick={(e) => onChangeValue(e)}
            />
          </div>
        </div>
      </div>
      <div
        className="footer-container"
        style={{
          width: innerWidth > 900 ? "37vw" : innerWidth > 600 ? "45vw" : "70vw",
        }}
      >
        <div className="agency-form-button-container">
          <Button
            buttonType="custom"
            customStyle={styles["button"]}
            customLoaderClass={styles["buttonLoader"]}
            isLoading={isLoading}
            isDisabled={isDisabled}
            label={props.submitButtonText}
            onClick={() => {
              onSubmit();
            }}
          />
            {/* {props.submitButtonText} */}
        </div>
      </div>
    </React.Fragment>
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
    inputBoxInner: {
      width: "100%",
      backgroundColor: "#FFF",
    },
    button: {
      height: "40px",
      width: "160px",
      borderRadius: "20px",
      marginLeft: "16px",
      fontSize: "14px",
      padding: 0,
      textAlign: "center",
      alignItems: "center",
      backgroundColor: "#475BD8",
      color: "#FFF",
      fontFamily: "Montserrat-Regular",
    },
    buttonLoader: {
      border: "3px solid white",
      borderTop: "3px solid transparent",
      marginLeft: "40%",
    },
    dropdown: {
      zIndex: 1000,
      marginTop: "8px",
      width: innerWidth > 900 ? "37vw" : innerWidth > 600 ? "45vw" : "70vw",
    },
  };
};

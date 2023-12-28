import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { storedList } from "../../../util/localstorage";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button/Button";
import useDimensions from "../../../hooks/useDimensions";
import "./ActionPopup.style.css";
import { toCamel } from "util/helper";
import { TextField } from "@material-ui/core"; 
const user = storedList("user");

export const ActionPopupContent = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { innerWidth, innerHeight } = useDimensions();
  const dispatch = useDispatch();
  const styles = useStyles({ innerWidth, innerHeight });

  const onChangeValue = (e) => {
    const { id, value } = e.target;
  
    props.setData({
      ...props.data,
      [id]: value,
    });
  
    props.setDataErrors({
      ...props.dataErrors,
      [id]: null,
    });
  };

  const handleValidations = () => {
    var errors = {};

    for (let attribute in props.fields) {
      if (props.fields[attribute] && props.fields[attribute].isRequired) {
        if (!props.data[attribute] || props.data[attribute].length == 0) {
          errors[attribute] = ` ${toCamel(
            props.fields[attribute].label,
            true
          )} is required`;
        }
      }
    }

    return errors;
  };

  const onSecondaryAction = () => {
    if(props.button["secondary"].action){
      props.button["secondary"].action()
    }
  };

  const onPrimaryAction = () => {
    let errors = handleValidations();
    if (Object.keys(errors).length != 0) {
      props.setDataErrors(errors);
      return;
    }

    if(props.button["primary"].action){
      props.button["primary"].action()
    }
  };

  return (
    <React.Fragment>
      <div style={{ paddingTop: innerHeight > 800 ? "6vh" : "8vh" }}>
        <div style={{ maxHeight: "73vh" }}>
          <div className="action-popup-input-container">
            {Object.keys(props.fields).map((field, index) => (
              <React.Fragment key={index}> 
                <TextField  
                  id={props.fields[field]["id"]}
                  label={props.fields[field]["label"]}
                  type={props.fields[field]["type"]}
                  name={props.fields[field]["name"]}
                  style={{marginTop: "20px"}}
                  inputProps={{
                    style: {
                      color: "black"
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={6}
                  placeholder={props.fields[field]["placeholder"]}
                  required={props.fields[field]["isRequired"]}
                  value={props.data[field]}
                  error={props.dataErrors[field] ? true : false}
                  helperText={props.dataErrors[field]}
                  onChange={(e) => onChangeValue(e)}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div
        className="action-popup-footer-container"
        style={{
          width: innerWidth > 900 ? "37vw" : innerWidth > 600 ? "45vw" : "70vw",
        }}
      >
        <div className="action-popup-button-container">
          {props.button["secondary"] ? (
            <Button
              buttonType="custom"
              customStyle={
                props.button["secondary"]["style"]
                  ? {
                    ...styles["button"],
                    ...props.button["secondary"]["style"],
                  }
                  : { ...styles["button"] }
              }
              customLoaderClass={styles["buttonLoader"]}
              isLoading={isLoading}
              isDisabled={isDisabled}
              label={props.button["secondary"]["label"]?props.button["secondary"]["label"]:"Cancel"}
              onClick={() => {
                onSecondaryAction();
              }}
            />
          ) : (
            <div />
          )}
          {props.button["primary"] ? (
            <Button
              buttonType="custom"
              customStyle={
                props.button["primary"]["style"]
                  ? {
                    ...styles["button"],
                    ...props.button["primary"]["style"],
                  }
                  : { ...styles["button"] }
              }
              customLoaderClass={styles["buttonLoader"]}
              isLoading={isLoading}
              isDisabled={isDisabled}
              label={props.button["primary"]["label"]?props.button["primary"]["label"]:"Submit"}
              onClick={() => {
                onPrimaryAction();
              }}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

const useStyles = ({ innerWidth, innerHeight }) => {
  return {
    button: {
      height: "48px",
      width: "300px",
      borderRadius: "48px",
      marginLeft: "18px",
      fontSize: "16px",
      padding: "13px 44px",
      textAlign: "center",
      alignItems: "center",
      background: "linear-gradient(180deg, #134CDE 0%, #163FB7 100%, #163FB7 100%)",
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
    helperTextStyle: {
      // marginTop: "97px"
    }
  };
};

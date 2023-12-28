import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storedList } from "../../../../../util/localstorage";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button/Button";
import useDimensions from "../../../../../hooks/useDimensions";
import "./form.view.css";
import { getLocationPincodes } from "../../../../../actions/collection/location.action";
import { findByAttribute, toCamel } from "../../../../../util/helper";
import { FOS_USER_FORM_FIELDS } from "../formFields.userForm";

const user = storedList("user");
const fosUserFormFields = FOS_USER_FORM_FIELDS;

export default function UserForm(props) {
  const store = useSelector((state) => state);

  const [fosUser, setFosUser] = useState(props.formUser);
  const [fosUserErrors, setFosUserErrors] = useState(props.formUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [pincodesDropdown, setPincodesDropdown] = useState([]);
  const [districtsDropdown, setDistrictsDropdown] = useState([]);
  const [agenciesDropdown, setAgenciesDropdown] = useState([]);

  const { innerWidth, innerHeight } = useDimensions();
  const dispatch = useDispatch();
  const styles = useStyles({ innerWidth, innerHeight });

  React.useEffect(() => {
    setFosUser(props.formUser);
  }, [props.formUser]);

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPincodes();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fosUser["pincode"]]);

  React.useEffect(() => {
    populateAgencies();
  }, []);

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

  const fetchPincodes = () => {
    if (!fosUser["pincode"]) return;

    const payload = {
      q: fosUser["pincode"],
    };

    new Promise((resolve, reject) => {
      dispatch(getLocationPincodes(payload, resolve, reject));
    })
      .then((response) => {
        var tempPincodes = [];
        for (let element of response) {
          tempPincodes.push({
            label: element.pincode.toString(),
            value: element.pincode,
            districts: element.districts,
            states: element.states,
          });
        }
        setPincodesDropdown(tempPincodes);
        if (fosUser["pincode"] && fosUser["pincode"].length == 6) {
          onPincodeSelect(fosUser["pincode"], tempPincodes);
        }
      })
      .catch((error) => {});
  };

  const onChangeValue = (e) => {
    setFosUser({
      ...fosUser,
      [e.id]: e.value,
    });

    setFosUserErrors({
      ...fosUserErrors,
      [e.id]: null,
    });
  };

  const onPincodeSelect = (pincode, pincodesList) => {
    const selectedPincode = findByAttribute(pincodesList, "value", pincode);

    if (selectedPincode && selectedPincode.states[0]) {
      var tempDistricts = [];
      for (let element of selectedPincode.districts) {
        tempDistricts.push({
          label: element.toString(),
          value: element,
        });
      }

      setDistrictsDropdown(tempDistricts);

      setFosUser({
        ...fosUser,
        [fosUserFormFields["pincode"]["id"]]: pincode,
        [fosUserFormFields["district"]["id"]]: selectedPincode.districts[0],
        [fosUserFormFields["state"]["id"]]: selectedPincode.states[0],
      });

      setFosUserErrors({
        ...fosUserErrors,
        [fosUserFormFields["pincode"]["id"]]: null,
        [fosUserFormFields["district"]["id"]]: null,
        [fosUserFormFields["state"]["id"]]: null,
      });
    } else {
      setFosUser({
        ...fosUser,
        [fosUserFormFields["district"]["id"]]: null,
        [fosUserFormFields["state"]["id"]]: null,
      });

      setFosUserErrors({
        ...fosUserErrors,
        [fosUserFormFields["pincode"]["id"]]: "Please enter a valid pincode",
      });
    }
  };

  const handleValidations = () => {
    var errors = {};

    for (let attribute in fosUserFormFields) {
      if (
        fosUserFormFields[attribute] &&
        fosUserFormFields[attribute].isRequired
      ) {
        if (!fosUser[attribute] || fosUser[attribute].length == 0) {
          errors[attribute] = ` ${toCamel(
            fosUserFormFields[attribute].label,
            true
          )} is required`;
        }
      }
    }

    const emailRegex = /[a-z0-9]+@[a-z]+.[a-z]{2,3}/;
    const mobileRegex = /^([7-9]{1})([0-9]{9})$/;

    if (!errors["email"] && !emailRegex.test(fosUser["email"])) {
      errors["email"] = `Email is invalid`;
    }

    if (!errors["mobile"] && !mobileRegex.test(fosUser["mobile"])) {
      errors["mobile"] = `Mobile number is invalid`;
    }

    if (!errors["pincode"] && fosUser["pincode"] && fosUser["pincode"].toString().length != 6) {
      errors["pincode"] = `Pincode is invalid`;
    }

    return errors;
  };

  const onSubmit = () => {
    let errors = handleValidations();
    if (Object.keys(errors).length != 0) {
      setFosUserErrors(errors);
      return;
    }

    setIsLoading(true);
    setIsDisabled(true);
    props
      .onSubmit({ ...fosUser, user: user })
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
            setFosUserErrors(errors);
          }
        }
        setIsLoading(false);
        setIsDisabled(false);
      });
  };

  return (
    <React.Fragment>
      <div style={{ paddingTop: "8vh" }}>
        <div style={{ overflowY: "scroll", maxHeight: "73vh" }}>
          <div className="user-form-input-container">
            <InputBox
              customClass={styles["inputBox"]}
              customInputClass={styles["inputBoxInner"]}
              customDropdownClass={{
                ...styles["dropdown"],
              }}
              id={fosUserFormFields["collection_agency_id"]["id"]}
              label={fosUserFormFields["collection_agency_id"]["label"]}
              type={fosUserFormFields["collection_agency_id"]["type"]}
              name={fosUserFormFields["collection_agency_id"]["name"]}
              // autoComplete="off"
              placeholder={
                fosUserFormFields["collection_agency_id"]["placeholder"]
              }
              isRequired={
                fosUserFormFields["collection_agency_id"]["isRequired"]
              }
              isDrawdown={true}
              options={agenciesDropdown}
              initialValue={
                store["fos"]["agencies"][fosUser["collection_agency_id"]]
                  ? store["fos"]["agencies"][fosUser["collection_agency_id"]]
                      .name
                  : fosUser["collection_agency_id"]
              }
              error={fosUserErrors["collection_agency_id"]}
              helperText={fosUserErrors["collection_agency_id"]}
              onClick={(e) => onChangeValue(e)}
              onDrawdownSelect={(value) => {
                const ob = findByAttribute(
                  Object.values(store["fos"]["agencies"]),
                  "name",
                  value
                );

                var e = {
                  value: ob.id,
                  id: fosUserFormFields["collection_agency_id"]["id"],
                };
                onChangeValue(e);
              }}
            />
          </div>
          <div className="user-form-input-container">
            <InputBox
              customClass={styles["inputBox"]}
              customInputClass={styles["inputBoxInner"]}
              id={fosUserFormFields["name"]["id"]}
              label={fosUserFormFields["name"]["label"]}
              type={fosUserFormFields["name"]["type"]}
              name={fosUserFormFields["name"]["name"]}
              // autoComplete="off"
              placeholder={fosUserFormFields["name"]["placeholder"]}
              isRequired={fosUserFormFields["name"]["isRequired"]}
              initialValue={fosUser["name"]}
              error={fosUserErrors["name"]}
              helperText={fosUserErrors["name"]}
              onClick={(e) => onChangeValue(e)}
            />
          </div>
          <div className="user-form-input-container">
            <InputBox
              customClass={styles["inputBox"]}
              customInputClass={styles["inputBoxInner"]}
              id={fosUserFormFields["mobile"]["id"]}
              label={fosUserFormFields["mobile"]["label"]}
              type={fosUserFormFields["mobile"]["type"]}
              name={fosUserFormFields["mobile"]["name"]}
              // autoComplete="off"
              placeholder={fosUserFormFields["mobile"]["placeholder"]}
              isRequired={fosUserFormFields["mobile"]["isRequired"]}
              initialValue={fosUser["mobile"]}
              error={fosUserErrors["mobile"]}
              helperText={fosUserErrors["mobile"]}
              onClick={(e) => {
                if (e.value && e.value.toString().length > 10) {
                  if (
                    !fosUser["mobile"] ||
                    (fosUser["mobile"] &&
                      fosUser["mobile"].toString().length != 10)
                  ) {
                    onChangeValue({
                      id: fosUserFormFields["mobile"]["id"],
                      value: e.value.toString().substring(0, 10),
                    });
                  }
                  return;
                }

                onChangeValue(e);
              }}
            />
          </div>
          <div className="user-form-input-container">
            <InputBox
              customClass={styles["inputBox"]}
              customInputClass={styles["inputBoxInner"]}
              id={fosUserFormFields["email"]["id"]}
              label={fosUserFormFields["email"]["label"]}
              type={fosUserFormFields["email"]["type"]}
              name={fosUserFormFields["email"]["name"]}
              // autoComplete="off"
              placeholder={fosUserFormFields["email"]["placeholder"]}
              isRequired={fosUserFormFields["email"]["isRequired"]}
              initialValue={fosUser["email"]}
              error={fosUserErrors["email"]}
              helperText={fosUserErrors["email"]}
              onClick={(e) => onChangeValue(e)}
            />
          </div>
          <div className="user-form-input-container">
            <InputBox
              customClass={styles["inputBox"]}
              customInputClass={styles["inputBoxInner"]}
              id={fosUserFormFields["address_line_1"]["id"]}
              label={fosUserFormFields["address_line_1"]["label"]}
              type={fosUserFormFields["address_line_1"]["type"]}
              name={fosUserFormFields["address_line_1"]["name"]}
              // autoComplete="off"
              placeholder={fosUserFormFields["address_line_1"]["placeholder"]}
              isRequired={fosUserFormFields["address_line_1"]["isRequired"]}
              initialValue={fosUser["address_line_1"]}
              error={fosUserErrors["address_line_1"]}
              helperText={fosUserErrors["address_line_1"]}
              onClick={(e) => onChangeValue(e)}
            />
          </div>
          <div className="user-form-input-container">
            <InputBox
              customClass={styles["inputBox"]}
              customInputClass={styles["inputBoxInner"]}
              id={fosUserFormFields["address_line_2"]["id"]}
              label={fosUserFormFields["address_line_2"]["label"]}
              type={fosUserFormFields["address_line_2"]["type"]}
              name={fosUserFormFields["address_line_2"]["name"]}
              // autoComplete="off"
              placeholder={fosUserFormFields["address_line_2"]["placeholder"]}
              isRequired={fosUserFormFields["address_line_2"]["isRequired"]}
              initialValue={fosUser["address_line_2"]}
              error={fosUserErrors["address_line_2"]}
              helperText={fosUserErrors["address_line_2"]}
              onClick={(e) => onChangeValue(e)}
            />
          </div>
          <div className="user-form-input-container">
            <InputBox
              customClass={styles["inputBox"]}
              customInputClass={styles["inputBoxInner"]}
              customDropdownClass={styles["dropdown"]}
              id={fosUserFormFields["city"]["id"]}
              label={fosUserFormFields["city"]["label"]}
              type={fosUserFormFields["city"]["type"]}
              name={fosUserFormFields["city"]["name"]}
              // autoComplete="off"
              placeholder={fosUserFormFields["city"]["placeholder"]}
              isRequired={fosUserFormFields["city"]["isRequired"]}
              initialValue={fosUser["city"]}
              error={fosUserErrors["city"]}
              helperText={fosUserErrors["city"]}
              onClick={(e) => onChangeValue(e)}
            />
          </div>
          <div className="user-form-input-container">
            <InputBox
              customClass={styles["inputBox"]}
              customInputClass={styles["inputBoxInner"]}
              customDropdownClass={styles["dropdown"]}
              id={fosUserFormFields["pincode"]["id"]}
              label={fosUserFormFields["pincode"]["label"]}
              type={fosUserFormFields["pincode"]["type"]}
              name={fosUserFormFields["pincode"]["name"]}
              // autoComplete="off"
              placeholder={fosUserFormFields["pincode"]["placeholder"]}
              isRequired={fosUserFormFields["pincode"]["isRequired"]}
              isDrawdown={pincodesDropdown.length > 0 ? true : false}
              options={pincodesDropdown.length > 0 ? pincodesDropdown : []}
              onDrawdownSelect={(value) =>
                onPincodeSelect(value, pincodesDropdown)
              }
              initialValue={fosUser["pincode"]}
              error={fosUserErrors["pincode"]}
              helperText={fosUserErrors["pincode"]}
              regex={/^(?!000000|666666|999999)\d{6}$/s}
              onClick={(e) => {
                if (e.value && e.value.toString().length > 6) {
                  if (
                    !fosUser["pincode"] ||
                    (fosUser["pincode"] &&
                      fosUser["pincode"].toString().length != 6)
                  ) {
                    onChangeValue({
                      id: fosUserFormFields["pincode"]["id"],
                      value: parseInt(e.value.toString().substring(0, 6)),
                    });
                  }

                  return;
                }

                onChangeValue(e);
              }}
            />
          </div>
          <div className="user-form-input-container">
            <InputBox
              customClass={styles["inputBox"]}
              customInputClass={styles["inputBoxInner"]}
              customDropdownClass={{
                ...styles["dropdown"],
              }}
              id={fosUserFormFields["district"]["id"]}
              label={fosUserFormFields["district"]["label"]}
              type={fosUserFormFields["district"]["type"]}
              name={fosUserFormFields["district"]["name"]}
              // autoComplete="off"
              placeholder={fosUserFormFields["district"]["placeholder"]}
              isRequired={fosUserFormFields["district"]["isRequired"]}
              isDrawdown={districtsDropdown.length > 1 ? true : false}
              options={districtsDropdown.length > 1 ? districtsDropdown : []}
              initialValue={fosUser["district"]}
              error={fosUserErrors["district"]}
              helperText={fosUserErrors["district"]}
              isDisabled={districtsDropdown.length > 1 ? false : true}
              onClick={(e) => onChangeValue(e)}
              onDrawdownSelect={(value) => {
                var e = {
                  value: value,
                  id: fosUserFormFields["district"]["id"],
                };
                onChangeValue(e);
              }}
            />
          </div>
          <div className="user-form-input-container">
            <InputBox
              customClass={styles["inputBox"]}
              customInputClass={styles["inputBoxInner"]}
              id={fosUserFormFields["state"]["id"]}
              label={fosUserFormFields["state"]["label"]}
              type={fosUserFormFields["state"]["type"]}
              name={fosUserFormFields["state"]["name"]}
              // autoComplete="off"
              placeholder={fosUserFormFields["state"]["placeholder"]}
              isRequired={fosUserFormFields["state"]["isRequired"]}
              initialValue={fosUser["state"]}
              error={fosUserErrors["state"]}
              helperText={fosUserErrors["state"]}
              isDisabled={true}
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
        <div className="user-form-button-container">
          <div />
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
          >
            {props.submitButtonText}
          </Button>
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
      textAlign:'center',
      alignItems:'center',
      backgroundColor:'#475BD8',
      color:'#FFF',
      fontFamily:'Montserrat-Regular'
    },
    buttonLoader: {
      border: "3px solid white",
      borderTop: "3px solid transparent",
      marginLeft:'40%'
    },
    dropdown: {
      zIndex: 1000,
      marginTop: "8px",
      width: innerWidth > 900 ? "37vw" : innerWidth > 600 ? "45vw" : "70vw",
    },
  };
};

import * as React from "react";
import { storedList } from "../../../util/localstorage";
import useDimensions from "../../../hooks/useDimensions";
import Popup from "react-sdk/dist/components/Popup/Popup";
import "./ActionPopup.style.css";
import { ActionPopupContent } from "./ActionPopupContent.component";

const user = storedList("user");

export const ActionPopup = (props) => {
  const { innerWidth, innerHeight } = useDimensions();
  const styles = useStyles({ innerWidth, innerHeight });

  return (
    <Popup
      showPopup={2}
      drawdownData={[]}
      heading={props.heading}
      customJsx={() => (
        <ActionPopupContent
          onClose={props.onClose}
          fields={props.fields}
          data={props.data}
          setData={props.setData}
          dataErrors={props.dataErrors}
          setDataErrors={props.setDataErrors}
          button={props.button}
        />
      )}
      customStyles={styles["customPopupStyles"]}
      customStylesForOutsideModal={styles["customPopupStylesOustideModal"]}
      hideButton={true}
      isModalOpen={props.isModalOpen}
      buttonText={"Comment"}
      onClickOutsideModal={props.onClickOutsideModal}
      callback={props.callback}
    />
  );
};

const useStyles = ({ innerWidth, innerHeight }) => {
  return {
    customPopupStyles: {
      width: innerWidth > 900 ? "40vw" : innerWidth > 600 ? "50vw" : "80vw",
      height: "95vh",
      marginRight: "2vh",
    },
    customPopupStylesOustideModal: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
  };
};

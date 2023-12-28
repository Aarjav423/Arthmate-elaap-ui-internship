import * as React from "react";
import Accordion from "react-sdk/dist/components/Accordion/Accordion";
import "react-sdk/dist/styles/_fonts.scss";
import "./CustomAccordion.style.css";
import Preloader from "../../../components/custom/preLoader";

/**
 *
 * @param {*} param
 * @returns
 */
export const CustomAccordion = (props) => {
  const styles = useStyles({ innerWidth, innerHeight });
  return (
    <div className="custom-accordion-container">
      {props.accordionData && props.accordionData.length > 0 ? (
        <Accordion
          accordionData={props.accordionData}
          customClass={styles["customAccordionStyle"]}
          custumHeaderStyle={{
            paddingBottom: "15px",
          }}
          customValueClass={{wordBreak:'none'}}
          {...props}
        />
      ) : (
        <div>
        <div style={styles["customAccordionNoDataStyle"]}>
          No Data Available
        </div>
        <Preloader/>
        </div>
      )}
    </div>
  );
};

const useStyles = () => {
  return {
    customAccordionStyle: {
      alignSelf:'center',
      backgroundColor: "#FFF",
      maxWidth: "100%",
      cursor: "pointer",
    },
    customAccordionNoDataStyle: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
    },
  };
};

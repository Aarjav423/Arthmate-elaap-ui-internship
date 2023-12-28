import React, { useState } from "react";
import TabButton from "react-sdk/dist/components/TabButton"

export default function CustomizeTemplates(props) {
  const { templatesdata, initialState, onIndexChange, marginLeft, ...other } = props;
  const [seletedOption, setSelectedOption] = useState(initialState)

  const handleSetTabValue = (e) => {
    let stageName = e.target.value.toLowerCase()
    onIndexChange(stageName);
  };

  return (
    <>
      <div style={{
        // width: "80%",
        marginTop: "20px",
        marginLeft: marginLeft ? marginLeft : "21.5px"
      }}>
        {templatesdata &&
          templatesdata.map((template, index) => {
            return <TabButton
              label={template}
              isDisabled={false}
              key={index}
              onClick={handleSetTabValue}
              selected={template.toLowerCase() === seletedOption.toLowerCase() ? true : false}
              setSelectedOption={setSelectedOption}
            />;
          })}
      </div>
    </>
  );
}

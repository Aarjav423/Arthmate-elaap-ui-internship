import * as React from "react";

import { getActivityLogJSONWatcher } from "../../actions/loanRequest";
import { useDispatch } from "react-redux";
import TextPopup from "react-sdk/dist/components/Popup/TextPopup"
const MaxWidthDialog = ({ openLog, data, handleCloseLog, handleSetAleart }) => {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [activityData, setActivityData] = React.useState({});
  const dispatch = useDispatch();

 

  const handleClose = () => {
    handleCloseLog();
    // openLog(false);
    setActivityData({});
  };

  const fetchLoanActivityLog = () => {
    const params = {
      company_id: data.company_id,
      product_id: data.product_id,
      loan_app_id: data.loan_app_id,
      loan_schema_id: data.loan_schema_id,
    };

    dispatch(
      getActivityLogJSONWatcher(
        params,
        (result) => {
          setActivityData(result);
        },
        (error) => {
          handleClose();
          return handleSetAleart(error.response.data.message, "error", true);
        }
      )
    );
  };

  React.useEffect(() => {
    if (openLog && data) {
      fetchLoanActivityLog();
    }
  }, [openLog, data]);
  
  const renderBreResponse = () => {
    return (
      <ul>
        {activityData &&
          activityData?.breJson &&
          Object.keys(activityData?.breJson).map((key, index) => {
            return (
              <div key={index}>
                {key?.length ? (
                  <span style={{ display: "flex" }}>
                    {key} : {JSON.stringify(activityData?.breJson[key] ?? "NA")}
                  </span>
                ) : (
                  <span>
                    {key}: {activityData?.breJson[key] ?? "NA"}
                  </span>
                )}
              </div>
            );
          })}
      </ul>
    );
  };

  const renderLoanResponse = () => {
    return (
      <ul>
        {activityData &&
          activityData?.loanJson &&
          Object.keys(activityData?.loanJson?.body).map((key, index) => {
            return (
              <div key={index}>
                <span>
                  {key}: {activityData?.loanJson?.body[key] ?? "NA"}
                </span>
              </div>
            );
          })}
      </ul>
    );
  };

  const renderLeadResponse = () => {
    return (
      <ul>
        {activityData &&
          activityData?.leadJson &&
          Object.keys(activityData?.leadJson?.body).map((key, index) => {
            return (
              <div key={index}>
                <span>
                  {key}: {activityData?.leadJson?.body[key] ?? "NA"}
                </span>
              </div>
            );
          })}
      </ul>
    );
  };
  
  const renderReviewResponse = () => {
    return (
      <ul>
        {activityData &&
          activityData?.reviewJson &&
          Object.keys(activityData?.reviewJson).map((key, index) => {
            return (
              <div key={index}>
                <span>
                  {key}: {activityData?.reviewJson[key] ?? "NA"}
                </span>
              </div>
            );
          })}
      </ul>
    );
  };
  const dummyDrawdownData = [
    {
      title: "BRE",
      content: () => renderBreResponse(), 
    },
  
    {
      title: "Borrower API",
      content: ()=>renderLeadResponse(),
    },
    {
      title: "Loan API",
      content: ()=>renderLoanResponse(),
    },
    {
      title: "Send Enhanced Review API",
      content: ()=>renderReviewResponse(),
    },
  ];
  return (
    <>
      
         { openLog ? (
          <div style={{zIndex:"100000000"}}>
      <TextPopup 
         heading="Logs" isOpen={openLog} drawdownData={dummyDrawdownData} onClose={handleClose} customStyles={{zIndex:"1000000000"}}>
      
      </TextPopup>
       </div>
          )
          :
          (
            <div></div>
            )}
      
      </>
  );
};
export default MaxWidthDialog;


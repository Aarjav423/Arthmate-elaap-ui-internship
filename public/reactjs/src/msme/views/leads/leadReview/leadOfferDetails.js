import * as React from "react";
import "react-sdk/dist/styles/_fonts.scss";
import { storedList } from "../../../../util/localstorage";
import { leadsAccordionData } from "../leadsDataJson";
import {
  CustomAccordion,
  DocumentsList,
} from "../../../components/msme.component";
import "./leadReview.style.css";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button/Button";
import "react-sdk/dist/styles/_fonts.scss";
import OfferImage from "../../../../assets/img/offerImage.svg";

export default function LeadOfferDetails(props) {
  const inputBoxCustomClass = {
    height: "56px",
    width: "193px",
    backgroundColor: "var(--neutrals-neutral-0, #F1F1F3)",
    marginRight: "16px",
  };
  const inputBoxCustomInputClass = {
    width: "100%",
    backgroundColor: "var(--neutrals-neutral-0, #F1F1F3)",
    marginTop: "0px",
  };
  const customStyleButton = {
    height: "40px",
    width: "109px",
    fontSize: "16px",
    padding: "12px 24px",
    borderRadius: "40px",
    gap: "10px",
  }
  return (
    <>
      <div className="offer-detail-container">
        <img className="offer-detail-image" src={OfferImage} alt="OfferImage" />
        <div className="lead-review-content">
          <div
            style={{ fontFamily: "Montserrat-Bold" }}
            className="heading-offerGenerated"
          >
            Offer Generated
          </div>
          <div className="offer-detail-inputbox">
            <InputBox
              label={"Loan Amount"}
              isDrawdown={false}
              initialValue={"₹323232"}
              onClick={null}
              isDisabled={true}
              customClass={inputBoxCustomClass}
              customInputClass={inputBoxCustomInputClass}
            />
            <InputBox
              label={"Tenure"}
              isDrawdown={false}
              initialValue={"60 Months"}
              onClick={null}
              isDisabled={true}
              customClass={inputBoxCustomClass}
              customInputClass={inputBoxCustomInputClass}
            />
            <InputBox
              label={"Interest Rate"}
              isDrawdown={false}
              initialValue={"12%"}
              onClick={null}
              isDisabled={true}
              customClass={{ ...inputBoxCustomClass, marginRight: "24px" }}
              customInputClass={inputBoxCustomInputClass}
            />
          </div>
          <div className="offer-detail-buttons">
            <Button
              label="Amend"
              onClick={null}
              isDisabled={false}
              buttonType="primary"
              customStyle={customStyleButton}
            ></Button>
            <Button
              label="Accept"
              onClick={null}
              isDisabled={false}
              buttonType="secondary"
              customStyle={customStyleButton}
            ></Button>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState } from "react";
import "react-sdk/dist/styles/_fonts.scss";
import { Slider } from "../Slider/Slider";
import { formatTitle, formatDateTime } from "util/msme/helper";
import "./AuditLog.style.css";
import {activityLogNamingFormat} from "msme/config/activityLogNaming"

export const AuditLog = ({ data }) => {
  return (
    <Slider>
      <div className="audit-div">
        <div className="audit-header">AUDIT LOG</div>
        <div>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <>
                <div key={index} className="audit-title">
                {formatTitle(activityLogNamingFormat[item?.category]?activityLogNamingFormat[item?.category]:item?.category)}  {item.sequence>=300 && item.sequence<=700? `${1 + item.sequence%100 }`:'' } {item.sequence>=800 && item.sequence<=900? `${+item.sequence/100 - 7}`:'' }
                </div>

                <div className="audit-text">
                  <span className="log-header"> Name: </span>
                  <span style={{ color: "#767888" }}>
                    {item?.updated_by?.username}
                  </span>
                </div>
                <div className="audit-text">
                  <span className="log-header"> User ID: </span>
                  <span style={{ color: "#767888" }}>
                    {item?.updated_by?.email}
                  </span>
                </div>
                <div className="audit-text">
                  <span className="log-header"> Date & Time: </span>
                  <span className="log-value">
                    {formatDateTime(item.updatedAt)}
                  </span>
                </div>
                <div className="audit-text">
                  <span className="log-header"> Comment: </span>
                  <span className="log-value"> {item.remarks}</span>
                </div>
              </>
            ))
          ) : (
            <p className="log-empty">No audit logs found!</p>
          )}
        </div>
      </div>
    </Slider>
  );
};

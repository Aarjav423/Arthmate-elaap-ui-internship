import { Link } from "react-router-dom";
import * as React from "react";
import { useEffect, useState } from "react";
import { storedList } from "../../util/localstorage";
import moment from "moment";
import WaiverDetailsPopup from "../lending/waiver/WaiverDetailsPopup";
import Table from "react-sdk/dist/components/Table/Table";
import "react-sdk/dist/styles/_fonts.scss";

const statusToDisplay = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  expired: "Expired"
};
const user = storedList("user");

const WaiverRequest = (props) => {
  const {
    result,
    handleChangePage,
    count,
    page,
    company,
    product,
    accessTags,
    isForSingleLoan,
    onDataChange
  } = props;
  const customAccessTags = isForSingleLoan
    ? accessTags.indexOf("tag_loan_queue_request_waiver_read") > -1 ||
      accessTags.indexOf("tag_loan_queue_request_waiver_read_write") > -1
    : accessTags.indexOf("tag_service_request_waiver_read_write") > -1 ||
      accessTags.indexOf("tag_service_request_waiver_read") > -1;

  const [waiverDetailsPopupDisplay, setWaiverDetailsPopupDisplay] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const handleNavWaiverRequestDetails = (row) => {
    if (isForSingleLoan) {
      setSelectedRow(row);
      setWaiverDetailsPopupDisplay(true);
    } else {
      window.open(
        `/admin/waiver-request-details/${row.company_id}/${row.product_id}/${row.loan_id}/${row.sr_req_id}`,
        "_blank"
      );
    }
  };

  const handleNavLoanDetails = (row) => {
    window.open(
      `/admin/loan/details/${company.lms_version}/${row.loan_id}/${row.product_id}/${row.company_id}/${product.loan_schema_id}/1`,
      "_blank"
    );
  };

  const defaultColumns = [
    {id: "sr_req_id", label: "REQUEST ID"},
    {id: "requested_by", label: "REQUESTED BY"},
    {id: "created_at", label: "REQUEST DATE & TIME", format: (rowData) => moment(rowData.created_at).format("YYYY-MM-DD")},
    {id: "valid_till", label: "VALID TILL", format: (rowData) => moment(rowData.valid_till).format("YYYY-MM-DD")},
    {id: "status", label: "STATUS"}
  ];

  const nonSingleLoanColumns = [
    {id:"loan_id", label: "Loan id"},
    {id:"customer_name", label:"Customer name"},
    {id:"request_type", label:"Request type"}
  ];

  const columns = !isForSingleLoan ? 
  [defaultColumns[0], ...nonSingleLoanColumns, ...defaultColumns.slice(1)] : defaultColumns;

  const data = result.map((item) => {
    const row_item = {
      sr_req_id: customAccessTags ? (
          <div onClick={() => handleNavWaiverRequestDetails(item)}>
            <Link>{item.sr_req_id}</Link>
          </div>
        ) : (item.sr_req_id),
      requested_by: item.requested_by,
      created_at: item.created_at,
      valid_till: item.valid_till,
      status: statusToDisplay[item.status]
    }
    
    if (!isForSingleLoan) {
      row_item.loan_id = (accessTags.indexOf(
          "tag_service_request_waiver_read_write"
        ) > -1 ||
        accessTags.indexOf("tag_service_request_waiver_read") >
          -1) ? (
          <div onClick={() => handleNavLoanDetails(item)}>
            <Link>{item.loan_id}</Link>
          </div>
        ) : (item.loan_id);
      row_item.customer_name = item.customer_name;
      row_item.request_type = item.request_type || "";
    }
    return row_item;
  });

  return (
    <>
      <WaiverDetailsPopup
        openDialog={waiverDetailsPopupDisplay}
        handleClose={() => {
          if (onDataChange) onDataChange();
          setWaiverDetailsPopupDisplay(false);
        }}
        accessTags={accessTags}
        company_id={selectedRow.company_id}
        product_id={selectedRow.product_id}
        loan_id={selectedRow.loan_id}
        request_id={selectedRow.sr_req_id}
        type="details"
        isForSingleLoan={isForSingleLoan}
      />

      <div style={{ maxWidth: "100%", padding: "18px", marginLeft:"6.2px", marginTop:"10px"}}>
        <Table 
          columns={columns}
          data={data}
          customStyle={{
            fontFamily: "Montserrat-Medium",
            width: "100%",
            border: "1px solid #EDEDED"
          }}
        />
      </div>
    </>
  );
};

export default WaiverRequest;

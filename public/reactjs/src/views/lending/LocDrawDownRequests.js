import * as React from "react";
import { styled } from "@material-ui/core/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { drawDownRequestListWatcher } from "../../actions/transactionHistory";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment/moment";
import { AlertBox } from "../../components/AlertBox";
import { checkAccessTags } from "../../util/uam";
import { storedList } from "../../util/localstorage";
import DrawDownRequestUi from "../lending/drawDownRequestUi";
import { Link } from "react-router-dom";
import Button from "react-sdk/dist/components/Button";
const user = storedList("user");
import Table from "react-sdk/dist/components/Table/Table";
import InfoIcon from "../lending/images/info-circle.svg";
import { getProductByIdWatcher } from "../../actions/product";
import Pagination from "../../../node_modules/react-sdk/dist/components/Pagination/Pagination";

export default function LOCDrawdownRequests() {
  const dispatch = useDispatch();
  const { company_id, product_id, loan_id, loan_app_id } = useParams();
  const [drawdownList, setDrawdownList] = useState("");
  const [responseData, setResponseData] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [productData, setProductData] = useState({});
  const [sampleData, setSampleData] = useState([]);
  const [productDetails, setproductDetails] = useState({})
  const [linePF, setLinePF] = useState(false);
  const [firstDD, setFirstDD] = useState(false);
  const [limit, setLimit] = useState(10);
  var oldestEntry = null;
  var product = null;

  const statusToDisplay = {
    0: "In progress",
    1: "Disbursed",
    2: "In progress",
    9: "Error",
    4: "Rejected"
  };

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const handleChangePage = (event) => {
      setPage(event);
    };

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_drawdown_request_read",
        "tag_drawdown_request_read_write"
      ])
    )
    fetchDrawDownList();
        if (!isTagged) fetchDrawDownList();
    fetchProductDetails();
  }, [page]);

  const handleAlertClose = () => {
    setAlert(false);
    setAlertMessage("");
    setSeverity("");
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const fetchDrawDownList = () => {
    const payload = {
      loan_id: loan_id,
      company_id,
      product_id,
      page: page,
      limit: limit
    };
    new Promise((resolve, reject) => {
      dispatch(drawDownRequestListWatcher(payload, resolve, reject));
    })
      .then((response) => {
        if (response.data.length == 0) {
          setFirstDD(true);
        }
        setCount(response?.count)
        setProductData(response.productAndSchemeMappingData[0]);
        setSampleData(
          response?.data?.map((item, index) => ({
            "REQUEST ID": (
              <Link
                onClick={(event) => {
                  handleLocDetails(item);
                }}
              >
                {item._id ? item._id : "NA"}
              </Link>
            ),
            "USAGE ID":
              item?.loan_transaction_ledger.length > 0
                ? item.loan_transaction_ledger[0]._id
                : "NA",
            "DRAWDOWN AMOUNT": item?.drawdown_amount
              ? new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR"
                }).format(item?.drawdown_amount)
              : "NA",
            "USAGE FEE + GST": new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR"
            }).format(parseFloat(item?.usage_fees_including_gst).toFixed(2)),
            "NET DRAWDOWN AMOUNT": (
              <div style={{ display: "flex", flexDirection: "row" }}>
                {item?.net_drawdown_amount
                  ? new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR"
                    }).format(item.net_drawdown_amount)
                  : "NA"}
                {item?.processing_fees_including_gst ? (
                  <div style={{ cursor: "pointer" }}>
                    <Tooltip
                      title={`PF = ${item?.processing_fees_including_gst}`}
                    >
                      <img
                        style={{ marginLeft: "10px" }}
                        src={InfoIcon}
                        alt="svg"
                      />
                    </Tooltip>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ),
            "NO. OF EMI": item?.no_of_emi ? item.no_of_emi : "NA",
            "DRAWDOWN DATE":
              item?.loan_transaction_ledger.length > 0
                ? item.loan_transaction_ledger[0].disbursement_date_time &&
                  item.loan_transaction_ledger[0].disbursement_date_time != ""
                  ? moment(
                      item.loan_transaction_ledger[0].disbursement_date_time
                    ).format("YYYY-MM-DD")
                  : "NA"
                : "NA",
            "REPAYMENT DUE DATE":
              item?.loan_transaction_ledger.length > 0
                ? item.loan_transaction_ledger[0].repayment_due_date &&
                  item.loan_transaction_ledger[0].repayment_due_date != ""
                  ? moment(
                      item.loan_transaction_ledger[0].repayment_due_date
                    ).format("YYYY-MM-DD")
                  : "NA"
                : "NA",
            "INT RATE": item?.upfront_int
              ? new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR"
                }).format(item.upfront_int)
              : "NA",
            Status: item?.line_state_audit.length > 0 && 
            item?.line_state_audit[0]?.status === "Closed"? "Closed"
            : statusToDisplay[item.status] || 'NA'
          }))
        );
        setDrawdownList(response.data);
        let dataArray = response.data;
        if (response?.data?.length > 0) {
          oldestEntry = dataArray.reduce((oldest, current) => {
            const oldestDate = new Date(oldest.created_at);
            const currentDate = new Date(current.created_at);
            return currentDate < oldestDate ? current : oldest;
          });
        }
        setProductData(response.productAndSchemeMappingData[0]);
      })
      .catch((error) => {
        showAlert("No drawdown records found for the loan id", "error");
      });
  };
  const fetchProductDetails = () => {
  new Promise((resolve, reject) => {
    dispatch(getProductByIdWatcher(product_id, resolve, reject));
  })
    .then(response => {
     setproductDetails(response);
     product = response;
    })
    .catch((error) => {
      showAlert("Error while getting product details", "error");
    });
    };


  const handleOpenInNewPage = (url, page) => {
    window.open(`${url}`, `${page || "_blank"}`);
  };

  const handleLocDetails = (selectedRow) => {
    if (
      product?.line_pf === "drawdown" &&
      selectedRow._id === oldestEntry._id
    ) {
      handleOpenInNewPage(
        `/admin/lending/loan/loc_drawdown_request/${selectedRow.company_id}/${
          selectedRow.product_id
        }/${selectedRow.loan_id}/${selectedRow._id}/${
          selectedRow.loan_app_id
        }/${selectedRow.status}/${"true"}`,
        "_self"
      );
    } else {
      handleOpenInNewPage(
        `/admin/lending/loan/loc_drawdown_request/${selectedRow.company_id}/${
          selectedRow.product_id
        }/${selectedRow.loan_id}/${selectedRow._id}/${
          selectedRow.loan_app_id
        }/${selectedRow.status}/${"false"}`,
        "_self"
      );
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#5e72e4",
      color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      color: theme.palette.common.black
    }
  }));

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onclose={handleAlertClose}
        />
      ) : null}
      <div style={{ margin: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px"
          }}
        >
          <Button
            buttonType="primary"
            label="New Drawdown Request"
            onClick={() => {
              setIsOpen(true);
            }}
          />
        </div>
        <div>
          <div>
            <h4
              style={{
                fontSize: "20px",
                fontFamily: "Montserrat-SemiBold",
                fontWeight: 600,
                lineHeight: "150%"
              }}
            >
              Previous Drawdown Request
            </h4>
          </div>
        </div>
        {drawdownList ? (
          <div>
            <Table
              columns={[
                { id: "REQUEST ID", label: "REQUEST ID" },
                { id: "USAGE ID", label: "USAGE ID" },
                { id: "DRAWDOWN AMOUNT", label: "DRAWDOWN AMOUNT" },
                { id: "USAGE FEE + GST", label: "USAGE FEE + GST" },
                { id: "NET DRAWDOWN AMOUNT", label: "NET DRAWDOWN AMOUNT" },
                { id: "NO. OF EMI", label: "NO. OF EMI" },
                { id: "DRAWDOWN DATE", label: "DRAWDOWN DATE" },
                { id: "REPAYMENT DUE DATE", label: "REPAYMENT DUE DATE" },
                { id: "INT RATE", label: "INT RATE" },
                { id: "Status", label: "STATUS" }
              ]}
              data={sampleData}
            />
          </div>
        ) : null}
        {count ?  <Pagination
                onPageChange={handleChangePage}
                totalItems={count}
                itemsPerPage={10}
              /> : null }
      </div>
      <>
      {isOpen ? (
           <DrawDownRequestUi
             setIsOpen={setIsOpen}
             productData={productData}
             firstDD={firstDD}
             productDetails={productDetails}
           />
             ) : null}
      </>
    </>
  );
}
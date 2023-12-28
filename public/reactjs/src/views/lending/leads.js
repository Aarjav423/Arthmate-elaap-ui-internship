import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import List from "react-sdk/dist/components/List/List";
import ListItem from "react-sdk/dist/components/ListItem/ListItem";
import Table from "react-sdk/dist/components/Table/Table";

import { AlertBox } from "../../components/AlertBox";
import Preloader from "../../components/custom/preLoader";
import BasicFilter from "../../components/Filter/basicFilter";
import { leadStatusListed } from "../../util/helper";
import { storedList } from "../../util/localstorage";
import { checkAccessTags } from "../../util/uam";
import DownloadLeadFiles from "./DownloadLeadFile";
import LoanDemographics from "./loanDemographics";
import Log from "./log";
import { getAllCompaniesWatcher } from "../../actions/company";
import { getLoanRequestDataWatcher } from "../../actions/loanRequest";
import { getProductByIdWatcher } from "../../actions/product";

import "react-sdk/dist/styles/_fonts.scss";

const user = storedList("user");

import LeadLoanLineImage from "./images/newleadloanscreen.svg";

export default function Leads(props) {
  const isLoading = useSelector((state) => state.profile.loading);
  const useAsyncState = (initialState) => {
    const [state, setState] = useState(initialState);

    const asyncSetState = (value) => {
      return new Promise((resolve) => {
        setState(value);

        setState((current) => {
          resolve(current);

          return current;
        });
      });
    };

    return [state, asyncSetState];
  };
  const [filter, setFilter] = useState("");
  const [leads, setLeads] = useState([]);
  const dispatch = useDispatch();
  const [responseData, setResponseData] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //alert
  const [searchData, setSearchData] = useState(null);
  const [queue, setLeadQueue] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);
  const [severity, setSeverity] = useState("");
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [openLog, setOpenLog] = useState(false);
  // const [isPopupOpen, setIsPopupOpen] = useState(false);
  // Action menu
  const [showActionList, setShowActionList] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [companyGlobal, setCompanyGlobal] = useAsyncState(null);
  const [productGlobal, setProductGlobal] = useAsyncState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const handleClick = (event, row) => {
    setSelectedRow(row);
    setShowActionList(true);
    setAnchorEl(event.currentTarget);
  };
  const handleCloseActionMenu = () => {
    setAnchorEl(null);
  };

  const closePopup = () => {
    setShowActionList(false);
    // setIsPopupOpen(false);
  };

  const handleCallBack = () => {
    setShowActionList(!showActionList);
  };

  function ActionMenu() {
    const options = [
      {
        label: "Edit Lead",
        disable: isTagged
          ? !checkAccessTags([
              "tag_lead_list_read_write",
              "tag_lead_edit_read_write",
            ]) &&
            !(
              selectedRow.loan_status === "rejected" ||
              selectedRow.loan_status === "cancelled" ||
              selectedRow.status === "disbursed"
            )
          : selectedRow.loan_status === "rejected" ||
            selectedRow.loan_status === "cancelled" ||
            selectedRow.status === "disbursed",
      },
      { label: "Lead Details", disable: false },
      {
        label: "Documents",
        disable: isTagged
          ? !checkAccessTags([
              "tag_documents_read",
              "tag_documents_read_write",
              "tag_lead_list_read_write",
            ]) ||
            selectedRow.loan_status === "rejected" ||
            selectedRow.loan_status === "cancelled"
          : selectedRow.loan_status === "rejected" ||
            selectedRow.loan_status === "cancelled",
      },
      {
        label: "Xml Documents",
        disable: isTagged
          ? !checkAccessTags([
              "tag_documents_read",
              "tag_documents_read_write",
              "tag_lead_list_read_write",
            ]) ||
            selectedRow.loan_status === "rejected" ||
            selectedRow.loan_status === "cancelled"
          : selectedRow.loan_status === "rejected" ||
            selectedRow.loan_status === "cancelled",
      },
      {
        label: "Loan Details",
        disable: isTagged
          ? !(
              checkAccessTags([
                "tag_lead_list_read_write",
                "tag_loan_info_read_write",
                "tag_loan_info_read",
              ]) &&
              !(
                selectedRow.loan_status === "rejected" ||
                selectedRow.loan_status === "cancelled" ||
                selectedRow.status === "disbursed"
              )
            )
          : selectedRow.loan_status === "rejected" ||
            selectedRow.loan_status === "cancelled" ||
            selectedRow.status === "disbursed",
      },
      {
        label: "Cam Details",
        disable: isTagged
          ? !checkAccessTags([
              "tag_cams_details_read",
              "tag_cams_details_read_write",
              "tag_lead_list_read_write",
            ])
          : false,
      },
      { label: "Logs", disable: false },
      {
        label: "Selector Data",
        disable: isTagged
          ? !checkAccessTags([
              "tag_selector_details_read",
              "tag_selector_details_read_write",
              "tag_lead_list_read_write",
            ])
          : false,
      },
    ];
    if (product?.a_score || productGlobal?.a_score) {
      options.splice(5, 0, {
        label: "A Score Details",
        disable: isTagged
          ? !checkAccessTags([
              "tag_leads_ascore_read",
              "tag_leads_ascore_read_write",
              "tag_lead_list_read_write",
            ])
          : false,
      });
    }
    return (
      <>
        {showActionList ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "self-start",
            }}
          >
            <List
              customStyle={{
                position: "absolute",
                width: "240px",
                top: `${popupPosition.top - 250}px`,
                left: `${popupPosition.left - 400}px`,
                zIndex: 1000000,
              }}
              open={showActionList}
              noScroll={true}
              handleCallback={handleCallBack}
            >
              {options.map((option) => (
                <ListItem
                  key={option.label}
                  disabled={option.disable}
                  onClick={() => takeAction(option.label)}
                >
                  {option.label}
                </ListItem>
              ))}
            </List>
          </div>
        ) : null}
      </>
    );
  }

  const takeAction = (action) => {
    switch (action) {
      case "Edit Lead":
        handleNavEditLead(selectedRow);
        break;
      case "Lead Details":
        handleNavLeadDetails(selectedRow);
        break;
      case "Documents":
        handleOpenDocuments(selectedRow);
        break;
      case "Xml Documents":
        handleOpenDocuments(selectedRow, true);
        break;
      case "Loan Details":
        handleNextStage(selectedRow);
        break;
      case "Cam Details":
        handleOpenCampsForm(selectedRow);
        break;
      //
      case "A Score Details":
        handleOpenAScoreForm(selectedRow);
        if (company?.value && product?.value) {
          companyInRow = company;
          productInRow = product;
          break;
        }
        dispatch(
          getAllCompaniesWatcher(
            (result) => {
              companyInRow = result.filter(() => selectedRow.company_id)[0];
              dispatch(
                getProductByIdWatcher(
                  selectedRow.product_id,
                  (productResp) => {
                    productInRow = productResp;
                  },
                  (productError) => {}
                )
              );
            },
            (error) => {}
          )
        );
        //
        break;
      //
      case "Logs":
        setOpenLog(true);
        setSelectedRow(selectedRow);
        break;
      case "Selector Data":
        handleOpenSelectorForm(selectedRow);
        break;
    }
  };

  const getLeadList = async (filter) => {
    if (filter) {
      dispatch(
        getLoanRequestDataWatcher(
          filter,
          async (result) => {
            if (!result?.rows.length) {
              setAlert(true);
              setSeverity("error");
              setAlertMessage("No records found");
              setTimeout(() => {
                handleAlertClose();
              }, 4000);
            }
            setResponseData(result?.rows);
            setCount(result?.count);
            setLeads(result?.rows.slice(0, rowsPerPage));
            if (result?.rows.length) {
              if (!company?.value || !product?.value) {
                dispatch(
                  getAllCompaniesWatcher(
                    async (companies) => {
                      const companyInRow = companies.filter(
                        (item) => item._id === result?.rows[0].company_id
                      )[0];
                      await setCompanyGlobal(companyInRow);
                      dispatch(
                        getProductByIdWatcher(
                          result?.rows[0].product_id,
                          async (productResp) => {
                            const productInRow = productResp;
                            await setProductGlobal(productInRow);
                          },
                          (productError) => {}
                        )
                      );
                    },
                    (error) => {}
                  )
                );
              }
            }
          },
          (error) => {
            setResponseData([]);
            setCount(0);
            setLeads([]);
            setAlert(true);
            setSeverity("error");
            setAlertMessage(error?.response?.data?.message);
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          }
        )
      );
    }
  };

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags(["tag_lead_list_read", "tag_lead_list_read_write"])
    )
      getLeadList(filter);
    if (!isTagged) getLeadList(filter);
  }, [filter]);

  const handleChangePage = (event, newPage) => {
    setPage(event);
    filter.page = event;
    filter.limit = rowsPerPage;
    getLeadList(filter);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleAlertDownload = (msg, severity) => {
    setAlert(true);
    setSeverity(severity);
    setAlertMessage(msg);
  };

  const onSearchClick = (data) => {
    setCompany(data.company);
    setProduct(data?.product);
    setPage(0);
    setFilter({
      partner_id: data.company?.value || null,
      product_id: data.product?.value || null,
      from_date: data.fromDate,
      to_date: data.toDate,
      str: data.searchText,
      page: 0,
      limit: rowsPerPage,
      status: data?.product?.isLoc
        ? data?.status.value === "disbursed"
          ? "active"
          : data?.status?.value
        : data?.status?.value,
    });
  };

  const handleNextStage = (row) => {
    window.open(
      `/admin/lending/additionalinfo/${row.company_id}/${row.product_id}/${row.loan_app_id}`,
      "_blank"
    );
  };

  const handleOpenDocuments = (row, mode = false) => {
    if (mode) {
      window.open(
        `/admin/template/loandoclist/${row.company_id}/${row.product_id}/${row.loan_app_id}/xml`,
        "_blank"
      );
    } else {
      window.open(
        `/admin/template/loandoclist/${row.company_id}/${row.product_id}/${row.loan_app_id}/pdf`,
        "_blank"
      );
    }
  };

  const handleOpenCampsForm = (row) => {
    window.open(
      `/admin/lending/leads/cams/${row.company_id}/${row.product_id}/${row.loan_app_id}`,
      "_blank"
    );
  };
  //
  const handleOpenAScoreForm = (row) => {
    window.open(
      `/admin/lending/leads/ascore/${row.company_id}/${row.product_id}/${row.loan_app_id}`,
      "_blank"
    );
  };
  //

  const handleOpenSelectorForm = (row) => {
    window.open(
      `/admin/lending/leads/selector/${row.company_id}/${row.product_id}/${row.loan_app_id}`,
      "_blank"
    );
  };

  const handleClose = () => {
    setDetailsModal(false);
  };

  const handleCloseLog = () => {
    setOpenLog(false);
  };

  const handleSetAleart = (message, type, isAleart) => {
    setAlert(isAleart);
    setSeverity(type);
    setAlertMessage(message);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const handleNavLeadDetails = (row) => {
    if (
      (isTagged &&
        checkAccessTags([
          "tag_lead_list_read",
          "tag_lead_list_read_write",
          "tag_lead_details_read",
          "tag_lead_details_read_write",
        ])) ||
      !isTagged
    ) {
      window.open(
        `/admin/lead/details/${row.loan_app_id}/${row.company_id}/${row.product_id}/${row.loan_schema_id}`,
        "_blank"
      );
    }
  };

  const handleNavEditLead = (row) => {
    window.open(
      `/admin/lead/edit/${row.loan_app_id}/${row.company_id}/${row.product_id}/${row.loan_schema_id}`,
      "_blank"
    );
  };

  const columns = [
    {
      id: "fullName",
      label: "CUSTOMER NAME",
      format: (rowData) =>
        `${rowData.first_name} ${
          rowData.middle_name ? rowData.middle_name : ""
        } ${rowData.last_name}`,
    },
    {
      id: "LOAN APPLICATION ID",
      label: "LOAN APPLICATION ID",
      format: (rowData) => (
        <Link onClick={() => handleNavLeadDetails(rowData)}>
          {rowData.loan_app_id}
        </Link>
      ),
    },
    { id: "created_at", label: "CREATION DATE" },
    {
      id: "lead_status",
      label: "STATUS",
      format: (rowData) =>
        rowData.lead_status.charAt(0).toUpperCase() +
        rowData.lead_status.slice(1),
    },
  ];
  const handleActionClick = (row, event) => {
    setSelectedRow(row);

    // Calculate the position based on the click event's coordinates
    const rect = event.currentTarget.getBoundingClientRect();
    const top = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;

    // Set the calculated position for the pop-up
    setPopupPosition({ top, left });
    setShowActionList(!showActionList);
    setAnchorEl(row);
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "53vh",
    backgroundColor: "#F5F7FF",
    borderRadius: "35px",
    marginLeft: "15%",
    marginRight: "25%",
    marginTop: "80px",
  };

  const imageStyle = {
    marginTop: "5vh",
    width: "100%",
    maxWidth: "400px",
    height: "auto",
  };

  return (
    <div style={{ width: "100%", maxHeight: "80vh" }}>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <ActionMenu />
      {detailsModal && (
        <LoanDemographics
          onModalClose={handleClose}
          title="Lead Details"
          data={selectedRow}
          loanSchemaId={selectedRow?.loan_schema_id}
        />
      )}
      <Log
        openLog={openLog}
        data={selectedRow}
        loanSchemaId={selectedRow?.loan_schema_id}
        handleCloseLog={() => handleCloseLog()}
        handleSetAleart={handleSetAleart}
      />
      {/* <h2 style={{padding:"20px"}}>Leads</h2> */}
      <div style={{ backgroundColor: "white" }}>
        <div>
          <div
            style={{
              padding: "4px",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <BasicFilter
              company={company}
              product={product}
              onSearchClick={onSearchClick}
              isCustomDatePicker={true}
              isViewSearch={true}
              isViewFromDate={true}
              isViewToDate={true}
              mandatoryFields={{
                company: true,
                partner: true,
                product: true,
                fromDate: true,
                toDate: true,
              }}
              statusList={leadStatusListed}
              isViewStatus={true}
              status=""
              allowGlobalSearch={true}
            />
          </div>
          {!leads.length && (
            <div style={containerStyle}>
              <div>
                <img
                  src={LeadLoanLineImage}
                  alt="Lead Image"
                  style={imageStyle}
                />
              </div>
              <h2
                style={{
                  fontSize: "27px",
                  lineHeight: "48px",
                  fontFamily: "Montserrat-SemiBold",
                  padding: "30px",
                }}
              >
                Kindly fill the above fields to get started
              </h2>
            </div>
          )}

          {leads.length ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                // marginRight:"0.3vw"
              }}
            >
              {isTagged ? (
                checkAccessTags(["tag_lead_export"]) ? (
                  <div style={{ marginRight: "20px" }}>
                    <DownloadLeadFiles
                      disabled={!responseData.length}
                      filter={filter}
                      company={company?.value ? company : companyGlobal}
                      product={product?.value ? product : productGlobal}
                      handleAlert={() => handleAlertDownload}
                    />
                  </div>
                ) : null
              ) : (
                <div style={{ marginRight: "20px" }}>
                  <DownloadLeadFiles
                    disabled={!responseData.length}
                    filter={filter}
                    company={company}
                    product={product}
                    handleAlert={() => handleAlertDownload}
                  />
                </div>
              )}
            </div>
          ) : null}
          {leads.length ? (
            <div>
              <div style={{ maxWidth: "100%", padding: "8px 20px 20px 20px" }}>
                <Table
                  customStyle={{ width: "100%" }}
                  data={leads}
                  columns={columns}
                  actions={{ handleActionClick }}
                  handleActionClick={handleActionClick}
                />
                {count ? (
                  <Pagination
                    onPageChange={handleChangePage}
                    totalItems={count}
                    itemsPerPage={10}
                  />
                ) : null}
                {/* <Pagination
                onPageChange={handleChangePage}
                totalItems={count}
                itemsPerPage={10}
              /> */}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* Render the pop-up container when isPopupOpen is true */}
      {isLoading && <Preloader />}
    </div>
  );
}

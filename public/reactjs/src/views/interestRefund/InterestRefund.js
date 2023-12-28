import * as React from "react";
import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import Pagination from 'react-sdk/dist/components/Pagination/Pagination';
import { getAllCompaniesWatcher } from "../../actions/company";
import { getAllProductByCompanyIDWatcher } from "../../actions/product";
import { DataGrid } from '@material-ui/data-grid';
import Grid from '@material-ui/core/Grid';
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import BasicDatePicker from '../../components/DatePicker/basicDatePicker';
import Button from 'react-sdk/dist/components/Button';
import searchIcon from "../../msme/images/searchIcon.svg";
import downloadIcon from "../../msme/assets/Download.svg";
import InterestRefundRequestPopup from "../../views/InterestRefundRequestPopup";
import { CSVLink, CSVDownload } from "react-csv";
import { getTdsRefundDataWatcher } from '../../actions/tdsRefund.js';
import { storedList } from '../../util/localstorage';
import moment from 'moment';
import { setAlert } from "../../actions/common";
import Img from "../../views/lending/images/download-button.svg";
import './interestRefund.css'
import { checkAccessTags } from "../../util/uam";

export default function InterestRefund() {
  const user = storedList('user');
  const dispatch = useDispatch();
  const [batchRowsPerPage, setBatchRowsPerPage] = useState(10);
  const [batchCount, setBatchCount] = useState(0);
  const [company, setCompany] = useState([]);
  const [product, setProduct] = useState([]);
  const [companyID, setCompanyID] = useState();
  const [productID, setProductID] = useState();
  const [isOpen,setIsOpen] =useState(false);
  const [stateData, setStateData] = useState();
  const [validationData, setValidationData] = useState({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roleList, setRoleList] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [status, setStatus] = useState('');
  const [loanCreationDate, setLoanCreationDate] = useState('');
  const [loanDisbustmentDate, setLoanDisbustmentDate] = useState('');
  const [searchText, setSearchText] = useState('');
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [count, setCount] = useState(0);

  const columns = [
    { field: 'id', headerName: 'LOAN ID', flex: 1.4, sortable: false},
    {
      field: 'final_approval_date',
      headerName: 'FINAL APPROVAL DATE',
      flex: 1.1,
      valueFormatter: params => 
      moment(params?.value).format("DD-MM-YYYY"),
      sortable: false
    },
    {
      field: 'distburstement_date',
      headerName: 'DISBURSEMENT DATE',
      flex: 1.1,
      valueFormatter: params => 
      moment(params?.value).format("DD-MM-YYYY"),
      sortable: false
    },
    {
      field: 'first_installment_date',
      headerName: 'FIRST INSTALLMENT DATE',
      flex: 1.3,
      valueFormatter: params => 
      moment(params?.value).format("DD-MM-YYYY"),
      sortable: false
    },
    {
      field: 'refund_days',
      headerName: 'REFUND DAYS',
      flex: 0.8,
      sortable: false
    },
    {
      field: 'refund_amount',
      headerName: 'REFUND AMOUNT',
      flex: 0.9,
      sortable: false
    },
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 0.7,
      sortable: false,
      renderCell: (params) => (
        <Button
          id="validate"
          label={customStatus(params.value)}
          buttonType="linkssss"
          customStyle={customStatusButton(params.value)}
          customLoaderClass={{
            borderTop: '4px solid #fff',
          }}
        />
      ),
    },
  ];

  const refundStatus = [
    { label: 'All', value: null },
    { label: 'Not Initiated', value: 'Open' },
    { label: 'Failed', value: 'Failed' },
    { label: 'In Progress', value: 'In_Progress' },
    { label: 'Completed', value: 'Processed' },
    { label: 'Rejected', value: 'Rejected' }
  ]

  const inputBoxCss = {
    marginTop: "8px",
    maxHeight: "500px",
    zIndex: 1,
    width: "105%"
  };

  const customStatus = (status) => {
    if(status == 'Open'){
      return 'Not Initiated'
    } else {
      return status.replace("_",` `);
    }
  }

  const customStatusButton = (status) => {
    let color
    switch (status) {
      case 'Rejected':
      case 'Failed':
        color = '#B30000'
        break;
      case 'Processed':
        color = '#008042'
        break;
      default:
        color = '#475BD8'
        break;
    }
    return {
      borderRadius: '0.25rem',
      color: `${color}`,
      padding: '0.25rem',
      border: `1px solid ${color}`,
      backgroundColor: `${color}29`,
    }
  };

  const inputData = [
    { label: 'Company', value: 'company', isDrawdown: true },
    { label: 'Product', value: 'product', isDrawdown: true },
    { label: 'Status', value: 'status', isDrawdown: true },
  ]

  const inputDate = [
    { label: 'Loan Disbursement Date', value: 'LDD' },
    { label: 'Loan Creation Date', value: 'LCD' }
  ]

  useEffect(() => {
    dispatch(
      getAllCompaniesWatcher(
        result => {
          let temp = result;
          let allCompany = [];
          temp.forEach(comp => {
            allCompany.push({
              label: comp.name,
              value: comp.name,
              _id: comp._id
            });
          });
          setCompany(allCompany);
        },
        error => { }
      )
    );
  }, []);


  useEffect(() => {
    if (companyID) {
      dispatch(
        getAllProductByCompanyIDWatcher(
          companyID,
          result => {
            let temp = result;
            let allProduct = [];
            temp.forEach(prod => {
              allProduct.push({
                label: prod.name,
                value: prod.name,
                _id: prod._id
              });
            });
            setProduct(allProduct);
          },
          error => { }
        )
      );
    }
  }, [companyID]);

  const handleBatchChangePage = (event, newPage) => {
    setPage(event+1);
  };

  const dropDownOptions = (row) => {
    switch (row) {
      case "company":
        return company;
      case "product":
        return product;
      case "status":
        return refundStatus;
      default:
        return company;
    }
  };
  const handleClick =()=>{
    setIsOpen(true);
   
  }
  const handleClose=()=>{
    setIsOpen(false);
    fetchLoanOfferDetails(false);
   }

   const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity('');
    setAlertMessage('');
  };


  const changeDateSelected = (value, name) => {
    if(name === 'LCD'){
      setLoanCreationDate(value)
    }
    if(name === 'LDD'){
      setLoanDisbustmentDate(value)
    }
  };

  const fetchLoanOfferDetails = (firstcall=false) => {
    let type = "interest_refund";
    let filterData = {};
    let LCD, LDD;
    if(loanCreationDate) LCD = loanCreationDate.toISOString();
    if(loanDisbustmentDate) LDD = loanDisbustmentDate.toISOString();
    let params = {};
    if (!firstcall) {
      setPage(1);
      filterData = {
        type: type,
        partner_id: companyID || null,
        product_id: productID || null,
        str: searchText || null,
        page: 1,
        limit: rowsPerPage,
        status: status || null,
        disbursement_date_time: LDD || null,
        loan_app_date: LCD || null,
        financial_quarter: null,
        loan_id: searchText || null
      };
      params = {
        type: type,
        user_id: user._id,
        page: page,
        limit: rowsPerPage,
        company_id: companyID || null,
        product_id: productID || null,
        status: status || null,
        disbursement_date_time: LDD || null,
        loan_app_date: LCD || null,
        tds_id: searchText || null,
        financial_quarter: null,
        loan_id: searchText || null,
      };
    } else {
      params = {
        type: type,
        user_id: user._id,
        page: page,
        limit: rowsPerPage,
        company_id: company?.value || null,
        product_id: product?.value || null,
        status: status || null,
        disbursement_date_time: LDD || null,
        loan_app_date: LCD || null,
        tds_id: null,
        financial_quarter: null,
        loan_id: searchText || null,
      };
      filterData.page = page;
    }

    dispatch(
      getTdsRefundDataWatcher(
        params,
        (result) => {
          setBatchCount(result?.data?.count);
          setCount(result?.data?.count);
          setRoleList(
            result?.data?.rows.map((item, index) => ({
              id: item?.loan_id,
              final_approval_date: item?.final_approve_date,
              distburstement_date: item?.disbursement_date_time,
              first_installment_date: item?.first_inst_date,
              refund_days: item?.refund_days,
              refund_amount: item?.amount,
              status: item?.status,
            })),
          );
        },
        (error) => {
          return showAlert(error?.result?.data?.message, 'error');
        },
      ),
    );
  };

  useEffect(()=>{
    if(user.company_id !== null){
      setCompanyID(user.company_id)
    }
    fetchLoanOfferDetails(true)
  },[page, rowsPerPage])

  // useEffect(() => {
  //   fetchLoanOfferDetails(true);
  // }, [page, rowsPerPage]);

  const dropDownChange = (value, name) => {
    if (name === "company") {
      setCompanyID(value._id);
      setProduct([]);
    }
    if (name === "product") {
      setProductID(value._id);
    }
    if(name === "status"){
      setStatus(value.value)
    }
  };

  const updateSelectedData = (data) => {
    let rowData = [];
      roleList.forEach(row => {
        for (let i = 0; i < data.length; i++) {
          if(data[i] === row.id){
            rowData.push(row)
          }
        }
      })
    setSelectedRow(rowData)
  }


  const onSearchClick = () => {
    fetchLoanOfferDetails(false)
  };

  return (
    <div style={{padding: '1.5rem'}}>
      <div
        style={{
          padding: "4px",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Grid container spacing={1}>
          {
            inputData.map((row, index) => {
              return (
                <Grid key={index} item xs={2}>
                  <InputBox
                    label={row.label}
                    isDrawdown={true}
                    options={dropDownOptions(row.value)}
                    onClick={value => dropDownChange(value, row.value)}
                    customDropdownClass={inputBoxCss}
                    customClass={{
                      height: "56px",
                      width: "100%",
                      maxWidth: "100%",
                    }}
                    customInputClass={{
                      minWidth: "100%",
                      backgroundColor: "#fff"
                    }}
                  />
                </Grid>
              )
            })}
            <Grid item xs={6} style={{display: 'flex'}}>
          {
            inputDate.map((row, index) => {
              return (
                  <BasicDatePicker
                  key={index}
                    placeholder={row.label}
                    format="dd-MM-yyyy"
                    style={{ height: '56px', width: '-webkit-fill-available', margin: '0 0.2rem' }}
                    value={row.value === 'LCD' ? loanCreationDate : loanDisbustmentDate}
                    onDateChange={(date) => changeDateSelected(date, row.value)}
                  // error={item.checked.toLowerCase() === 'true' ? validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' : stateData[`${item.type}_vl_${item.field}`] !== '' && validationData[`${item.type}_vl_${item.field}State`] === 'has-danger'}
                  // helperText={item.checked.toLowerCase() === 'true' ? (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '') : stateData[`${item.type}_vl_${item.field}`] !== '' && (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '')}
                  />
              )
            })}
            <Button
              customStyle={{
                height: "54px",
                fontSize: "16px",
                display: "flex",
                justifyContent: "center",
                boxShadow: "none",
                backgroundColor: "white",
                fontFamily: "Montserrat-Regular",
                padding: "22px",
                marginLeft: "0.4rem",
                border: "1px solid #134CDE",
                color: "rgba(19, 76, 222, 1)",
                borderRadius: "6px"
              }}
              buttonType="primary"
              imageButton={searchIcon}
              imageButtonHover={searchIcon}
              iconButton="btn-secondary-download-button"
            onClick={onSearchClick}
            />
          </Grid>
          <Grid item sm={12}>
            <div>or Search by loan ID</div>
          </Grid>
          <Grid item sm={4}>
          <InputBox
            label={`Search by Loan ID`}
            isDrawdown={false}
            onClick={(e) => {
              if(e.value) setSearchText(e.value); 
              onSearchClick();
            }}
            isSearch={true}
            customClass={{
              width: "300px",
              maxWidth: "none",
              height: "56px",
              borderRadius: "8px",
              marginTop: "5px"
            }}
            customInputClass={{ maxWidth: "none", width: "280px" }}
          />
          </Grid>
          <Grid item sm={8} style={{ display: "flex", justifyContent: 'flex-end', gap: '0.5rem' }}>
            <CSVLink
              className="btn-secondary-download-button"
              style={{
                height: "54px",
                fontSize: "16px",
                display: "flex",
                justifyContent: "center",
                boxShadow: "none",
                backgroundColor: "white",
                fontFamily: "Montserrat-Regular",
                padding: "22px",
                border: "1px solid #134CDE",
                color: "rgba(19, 76, 222, 1)",
                borderRadius: "26px"
              }}
              data={selectedRow}
              filename={`initiate-refund-loans.csv`}
            >
              <img src={Img} />
              CSV
            </CSVLink>
            <Button
              isDisabled={
                !checkAccessTags([
                  "tag_refunds_int_refund_w"
                ])
              }
              customStyle={{
                height: "54px",
                fontSize: "16px",
                display: "flex",
                justifyContent: "center",
                boxShadow: "none",
                backgroundColor: "white",
                fontFamily: "Montserrat-Regular",
                padding: "22px",
                border: "1px solid #134CDE",
                color: "#fff",
                borderRadius: "6px"
              }}
              label="Initiate refund"
              buttonType="primary"
            onClick={handleClick}
            />
          </Grid>
        </Grid>


      </div>
      <div style={{ width: '100%' }}>
        <DataGrid
          rows={roleList}
          columns={columns}
          pageSize={count}
          // autoPageSize={true}
          onSelectionModelChange={item => updateSelectedData(item.selectionModel)}
          className="multiselect-table"
          autoHeight
          hideFooter
          checkboxSelection
          disableSelectionOnClick
          rowsPerPageOptions={[10, 20, 30]}
          disableColumnMenu
        />
      </div>


    <Pagination itemsPerPage={rowsPerPage} totalItems={count} rowsPerPageOptions={[10, 20, 30]} onPageChange={handleBatchChangePage} showOptions={true} setRowLimit={setRowsPerPage} />
    {isOpen && <InterestRefundRequestPopup handleClose ={handleClose} company ={companyID} product={productID} data={roleList}></InterestRefundRequestPopup>}
    
    </div>
  );
};
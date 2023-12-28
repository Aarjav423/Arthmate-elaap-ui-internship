import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AlertBox } from '../../components/AlertBox';
import { getTdsRefundDataWatcher } from '../../actions/tdsRefund.js';
import moment from 'moment';
import { checkAccessTags } from '../../util/uam';
import { storedList } from '../../util/localstorage';
import Button from 'react-sdk/dist/components/Button/Button';
import Table from 'react-sdk/dist/components/Table/Table';
import Pagination from 'react-sdk/dist/components/Pagination/Pagination';
import NewBasicFilter from '../../components/Filter/newBasicFilter';
import TDSRefundDetails from './TDSRefundDetails';
import { refundStatusListed } from '../../util/helper';
import Preloader from '../../components/custom/preLoader';
import ViewIcon from './images/refundviewicon.svg';
import { b64ToBlob } from '../../util/helper';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import { viewDocsWatcher } from '../../actions/loanDocuments';
import CloseIcon from '@mui/icons-material/Close';
import TdsRefundPopup from '../../../src/views/TDSRefundRequestPopup';

const TdsRefund = () => {
  const user = storedList('user');
  const dispatch = useDispatch();
  const [popupContent, setPopupContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [company, setCompany] = useState(user?.type === 'company' ? { label: user?.company_name, value: user?.company_id } : "");
  const [product, setProduct] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [docExt,setdocExt] = useState([]);
  const isLoading = useSelector((state) => state.profile.loading);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [filter, setFilter] = useState('');
  const [column, setColumn] = useState('');
  const [page, setPage] = useState(1);
  const [filterParams, setFilterData] = useState({});
  const [isFirstCall, setIsFirstCall] = useState(true);
  const [roleList, setRoleList] = useState([]);
  const [loanData, setLoanData] = useState({});
  const [loanDataApi, setLoanDataApi] = useState([]);
  const [limit, setLimit] = useState(10);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [finanicalyearData, setFinanicalyearData] = useState([]);
  const [refundDetails, setRefundDetails] = useState({});
  const [viewDetails, setViewDetails] = useState(false);

  const [count, setCount] = useState(0);
  const onSearchClick = (data) => {
    fetchLoanOfferDetails(1, rowsPerPage, data);
  };
  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const isTagged = process.env.REACT_APP_BUILD_VERSION > 1 ? user?.access_metrix_tags?.length : false;
  const columns = [
    { id: 'REQUEST ID', label: 'REQUEST ID' },
    { id: 'TDS CERT. NO.', label: 'TDS CERT. NO.' },
    { id: 'TDS REFUND AMOUNT', label: 'TDS REFUND AMOUNT' },
    { id: 'FIN YEAR', label: 'FIN YEAR' },
    { id: 'CREATED ON', label: 'CREATED ON' },
    { id: 'UTR DATE', label: 'UTR DATE' },
    { id: 'COMPLETED ON', label: 'COMPLETED ON' },
    { id: 'STATUS', label: 'STATUS' },
    { id: 'TDS CERT.', label: 'TDS CERT.' },
  ];

  const handleViewDetails = () => {
    setViewDetails(true);
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

  const handleChangePage = (event) => {
    setPage(event + 1);
  };

  const handleDocumentPopUp = (pdf, fileType) => {
    if (pdf.indexOf('data:application/pdf;base64,') >= 0) {
      pdf = pdf.replace('data:application/pdf;base64,', '');
    }

    const contentType = 'application/pdf';
    const blob = b64ToBlob(pdf, contentType);
    const blobUrl = URL.createObjectURL(blob);

    setPopupContent(
      <ReactBSAlert
        style={{
          display: 'block',
          marginTop: '-350px',
          width: '900px',
          padding: '15px 4px 3px 3px',
          position: 'relative',
        }}
        title={fileType}
        confirmBtnBsStyle="success"
        btnSize="md"
        showConfirm={false}
      >
        <div>
          <button
            type="button"
            className="close"
            style={{
              position: 'absolute',
              top: '21px',
              right: '20px',
              zIndex: '999',
            }}
            onClick={() => setPopupContent(false)}
          >
            <CloseIcon />
          </button>
          <iframe src={blobUrl} type="application/pdf" width="100%" height="450px" />
        </div>
      </ReactBSAlert>,
    );
  };

  const handleViewDoc = (awsurl, doctype, company_id, product_id) => {
    const user = storedList('user');
    let data = {
      company_id: company_id,
      product_id: product_id,
      awsurl,
      user_id: user._id,
    };
    dispatch(
      viewDocsWatcher(
        data,
        (response) => {
          handleDocumentPopUp(response, doctype);
        },
        (error) => {},
      ),
    );
  };

  const handleViewRefundDetails = (id, event) => {
    if (event.target.localName!="img") {
      const res = loanData?.rows?.filter((item) => item._id == id)[0];
      setRefundDetails(res);
      setViewDetails(true);
    }
  };

  const fetchLoanOfferDetails = (firstcall = false, data) => {
    setFilter(data);
    let type = 'tds_refund';
    let filterData = {};
    let params = {};
    if (!firstcall) {
      setCompany(data?.company);
      setProduct(data?.product);
      setPage(1);
      filterData = {
        type: type,
        partner_id: data?.company?.value || null,
        product_id: data?.product?.value || null,
        str: data?.searchText,
        page: 1,
        limit: rowsPerPage,
        status: data?.status?.value || null,
        tds_id: data?.searchText || null,
        loan_id: null,
        disbursement_date_time: null,
        loan_app_date: null
      };
      params = {
        type: type,
        user_id: user._id,
        page: page,
        limit: rowsPerPage,
        company_id: data?.company?.value ? data?.company?.value :user?.company_id,
        product_id: data?.product?.value || null,
        status: data?.status?.value || null,
        financial_quarter: data?.financialYear?.value || null,
        tds_id: data?.searchText || null,
        loan_id: null,
        disbursement_date_time: null,
        loan_app_date: null
      };
    } else {
      params = {
        type: type,
        user_id: user._id,
        page: page,
        limit: rowsPerPage,
        company_id: data?.company?.value ? data?.company?.value :user?.company_id,
        product_id: product?.value || null,
        status: data?.status?.value || null,
        financial_quarter: data?.financialYear?.value || null,
        tds_id: data?.searchText || null,
        loan_id: null,
        disbursement_date_time: null,
        loan_app_date: null
      };
      filterData.page = page;
    }

    dispatch(
      getTdsRefundDataWatcher(
        params,
        (result) => {
          setFinanicalyearData(result?.data?.financialQuarter);
          setdocExt(result?.data?.doc_ext);
          setRoleList(
            result?.data?.rows.map((item, index) => ({
              'REQUEST ID': item?._id,
              'TDS CERT. NO.': item?.certificate_number,
              'TDS REFUND AMOUNT': new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item?.amount),
              'FIN YEAR': item?.reference_year,
              'CREATED ON': item?.createdAt ? moment(item?.createdAt).format('DD-MM-YYYY, HH:mm A') : '',
              'UTR DATE': item?.utr_date ? moment(item?.utr_date).format('DD-MM-YYYY') : '',
              'COMPLETED ON': item?.utr_date ? moment(item?.utr_date).format('DD-MM-YYYY') : '',
              STATUS:
                item?.status == 'Open' ? (
                  <div style={{ fontFamily: 'Montserrat-Medium', fontSize: '12px', display: 'flex', padding: '2px 8px', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', border: '1px solid var(--primary-50, #475BD8)', color: 'var(--primary-50, #475BD8)', background: 'var(--primary-0, #EDEFFB)' }}>Open</div>
                ) : item?.status == 'Rejected' ? (
                  <div style={{ fontFamily: 'Montserrat-Medium', fontSize: '12px', display: 'flex', padding: '2px 8px', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', border: '1px solid var(--utility-danger-30, #B30000)', color: 'var(--utility-danger-30, #B30000)', background: 'var(--utility-danger-0, #FFECEC)' }}>Rejected</div>
                ) : item?.status == 'Processed' ? (
                  <div style={{ fontFamily: 'Montserrat-Medium', fontSize: '12px', display: 'flex', padding: '2px 8px', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', border: '1px solid var(--utility-success-50, #008042)', color: 'var(--utility-success-50, #008042)', background: 'var(--utility-success-0, #EEFFF7)' }}>Processed</div>
                ) : item?.status == 'Failed' ? (
                  <div style={{ fontFamily: 'Montserrat-Medium', fontSize: '12px', display: 'flex', padding: '2px 8px', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', border: '1px solid var(--utility-danger-30, #B30000)', color: 'var(--utility-danger-30, #B30000)', background: 'var(--utility-danger-0, #FFECEC)' }}>Failed</div>
                ) : (
                  'null'
                ),
              "TDS CERT.": (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <img onClick={() => handleViewDoc(item?.file_url, 'TDS Certificate', item.company_id, item.product_id)} style={{ marginLeft: '10px', cursor: 'pointer' }} src={ViewIcon} alt="download icon" />
                </div>
              ),
            })),
          );
          setLoanData(result.data);
          setCount(result?.data?.count);
          setLoanDataApi(result.data.rows.slice(0, 10));
        },
        (error) => {
          return showAlert(error?.result?.data?.message, 'error');
        },
      ),
    );
  };

  useEffect(() => {
    fetchLoanOfferDetails(true);
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (filter && (!viewDetails || !isOpen)) {
      fetchLoanOfferDetails(false, filter);
    } else if (!viewDetails || !isOpen) {
      fetchLoanOfferDetails(true);
    }
  }, [viewDetails, isOpen]);


  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>{alert ? <AlertBox severity={severity} msg={alertMessage} onClose={handleAlertClose} /> : null}</div>
      {popupContent}
      <div style={{ display: 'flex', marginLeft: '16px', marginTop: '16px', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div
              style={{
                padding: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <NewBasicFilter
                company={company}
                product={product}
                onSearchClick={(data) => {
                  fetchLoanOfferDetails(false, data);
                }}
                setFilterParameters={setFilterData}
                isCustomDatePicker={true}
                isFinancialYear={true}
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
                financialYearList={finanicalyearData}
                statusList={refundStatusListed}
                isViewStatus={true}
                status=""
                allowGlobalSearch={true}
              />
            </div>
            <div style={{ float: 'right', marginTop: '5px', marginRight: '30px' }}>
              <Button
                label="Create new request"
                buttonType="primary"
                customStyle={{
                  width: '220px',
                  height: '52px',
                  padding: '0px 0px 0px 0px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  display: 'flex',
                }}
                isDisabled={product?.value >= 0 || filterParams?.product?.value && checkAccessTags(["tag_tds_refund_w","tag_tds_refund_create_new_w"]) ? false : true}
                onClick={handleClick}
              ></Button>
            </div>
          </div>
          {finanicalyearData.length ? (
            <>
              <Table customStyle={{ width: '95%', marginLeft: '2%' }} data={roleList} columns={columns} rowClickValue={'REQUEST ID'} rowClickFunction={handleViewRefundDetails} />
              <Pagination itemsPerPage={rowsPerPage} totalItems={count} rowsPerPageOptions={[10, 20, 30]} onPageChange={handleChangePage} showOptions={true} setRowLimit={setRowsPerPage} />
            </>
          ) : null}
        </div>
        {isOpen ? <TdsRefundPopup handleClose={handleClose} company={company?.value?company.value:filterParams?.company?.value} product={product?.value?product.value:filterParams?.product?.value} finanicalyearData={finanicalyearData} doc_ext ={docExt} /> : null}
      </div>
      {isLoading && <Preloader />}
      {viewDetails && checkAccessTags(['tag_tds_refund_details_r', 'tag_tds_refund_details_w']) ? <TDSRefundDetails setViewDetails={setViewDetails} refundDetails={refundDetails} handleViewDoc={handleViewDoc} /> : null}
    </>
  );
};

export default TdsRefund;

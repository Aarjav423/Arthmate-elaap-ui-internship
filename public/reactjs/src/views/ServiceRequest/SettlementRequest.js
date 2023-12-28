import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { storedList } from '../../util/localstorage';
import Grid from '@mui/material/Grid';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Link } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { AlertBox } from '../../components/AlertBox';
import { useParams } from 'react-router-dom';
import { Button } from '@material-ui/core';
import moment from 'moment';
import { getSettlementRequest } from '../../actions/settlementRequest';
import Preloader from '../../components/custom/preLoader';
import { checkAccessTags } from '../../util/uam';
import SettlementPopUp from '../lending/createSettlementOffer';
import ReviewPopUp from '../lending/approveSettlementOffer';
import { b64ToBlob } from '../../util/helper';
import { viewDocsWatcher } from '../../actions/loanDocuments';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import CloseIcon from '@mui/icons-material/Close';
import Buttoned from "react-sdk/dist/components/Button/Button";
import Pagination from "react-sdk/dist/components/Pagination/Pagination";
import Table from "react-sdk/dist/components/Table/Table";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import "react-sdk/dist/styles/_fonts.scss";

const SettlementOfferRequest = () => {

  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [roleList, setRoleList] = useState([]);
  const { company_id, product_id, loan_id } = useParams();
  const [loanData, setLoanData] = useState({});
  const [loanDataApi, setLoanDataApi] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const isLoading = useSelector((state) => state.profile.loading);
  const dispatch = useDispatch();
  const user = storedList('user');
  const [settlement, setSettlement] = useState(false);
  const [reviewPopup, setReviewPopup] = useState(false);
  const [row, setRow] = useState({});
  const [request_id, setRequest_id] = useState('');
  const [popupContent, setPopupContent] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isTextChanged, setIsTextChanged] = useState(false);
  const today = moment();
  
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
          position: 'relative'
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
              zIndex: '999'
            }}
            onClick={() => setPopupContent(false)}
          >
            <CloseIcon />
          </button>
          <iframe
            src={blobUrl}
            type="application/pdf"
            width="100%"
            height="450px"
          />
        </div>
      </ReactBSAlert>
    );
  };

  const handleViewDoc = (awsurl, doctype) => {

    const user = storedList('user');

    let data = {

      company_id: company_id,

      product_id: product_id,

      awsurl,

      user_id: user._id

    };

    dispatch(
      viewDocsWatcher(
        data,
        (response) => {
          handleDocumentPopUp(response, doctype);
        },
        (error) => { }
      )
    );
  };



  const showAlert = (msg, type) => {
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity('');
    setAlertMessage('');
  };

  useEffect(() => {
    console.log("running component::::")
    fetchLoanOfferDetails();
  }, [page]);



  const fetchLoanOfferDetails = () => {
    const filterData = {};
    const params = {
      company_id: company_id,
      product_id: product_id,
      loan_id: loan_id,
      user_id: user._id,
      page: page,
      limit: limit
    };

    filterData.page = page;

    dispatch(
      getSettlementRequest(
        params,
        (result) => {
          setRoleList(result.data.offers.count);
          setLoanData(result.data);
          setCount(result?.data?.offers.count);
          setLoanDataApi(result.data.offers.rows.slice(0, 10));
        },
        (error) => {
          return showAlert(error?.result?.data?.message, 'error');
        }
      )
    );
  };
  const handleCloseSettlementTranchesPopup = () => {
    setSettlement(false);
  };
  const handleCloseReviewPopup = () => {
    setReviewPopup(false);
  };
  const handleClose = () => {
    setOpenDialog(!openDialog);
  };
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(3)
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(3)

    }
  }));
  const BootstrapDialogTitle = (props) => {

    const { children, onClose, ...other } = props;
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white'
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };
  const handleChangePage = (event, newPage) => {
    setPage(event);
  };

  const renderProductSchemePopup = () => (
    <>
    <FormPopup 
     heading="Offer Invalid"
          onClose={handleClose}
          isOpen={openDialog}
          customStyles={{
              width: "fit-content",
              display:"flex",flexDirection: "column"
          }}>
       <div style={{ padding: '20px 0px' ,fontFamily:"Montserrat-Regular" }}>
          {isTextChanged ? 'This' : 'Your previous '} offer is invalid. Kindly
          generate a new settlement <div> offer for the loan.</div>
        </div>
     <div style={{ marginTop: 'auto', marginBottom: '10px', padding: '15px 0px' , display:"flex" , justifyContent:"center", fontFamily:"Montserrat-Regular" }}>
     <Buttoned
     label='Cancel'
     buttonType='secondary'
     customStyle={{
              backgroundColor: 'white',
              color: '#475BD8',
              textAlign: 'center',
              border: '1px solid #475BD8',
              width: '50%',
              marginRight: '10px',
              height: '40px',
              boxShadow:"none"
            }}
            onClick={handleClose}
          />
         
      
          <Buttoned
          label='Create new offer'
          buttonType='primary'
            customStyle={{
              backgroundColor: '#475BD8',
              color: 'white',
              textAlign: 'center',
              width: '50%',
              height: '40px',
              boxShadow:"none"
            }}
            onClick={() => {
              setSettlement(true);
              setOpenDialog(!openDialog);
            }}
          />
     </div>
     </FormPopup>
    </>
  );

  const StyledTableCell = styled(TableCell)(({ theme }) => ({

    [`&.${tableCellClasses.head}`]: {

      backgroundColor: '#5e72e4',

      color: theme.palette.common.black

    },

    [`&.${tableCellClasses.body}`]: {

      fontSize: 14,

      color: theme.palette.common.black

    }

  }));

  const [selectedRow, setSelectedRow] = useState({});
  const handleClick = (event, row) => {
    setSelectedRow(row);
    setShowActionList(true);
    setAnchorEl(event.currentTarget);
  };

  const principal = isNaN(parseFloat(loanData.prin_os))
    ? 0
    : parseFloat(loanData.prin_os);
  const interest = isNaN(parseFloat(loanData.int_due))
    ? 0
    : parseFloat(loanData.int_due);
  const lpiDue = isNaN(parseFloat(loanData.lpi_due))
    ? 0
    : parseFloat(loanData.lpi_due);
  const bounceCharge = isNaN(parseFloat(loanData.bounce_charge))
    ? 0
    : parseFloat(loanData.bounce_charge);
  const gst = isNaN(parseFloat(loanData.gst)) ? 0 : parseFloat(loanData.gst);


  const total = principal + interest + lpiDue + bounceCharge + gst;
  const columns = [

    {
      id: "Request ID", label: "REQUEST ID", format: (row) => <Link
        onClick={() => {
          if (
            loanData?.offers?.rows[0].status ==
            'Pending' &&
            loanData?.offers?.rows[0]
              .first_settlement_date <
            today.format('YYYY-MM-DD')
          ) {
            setIsTextChanged(true);
            setOpenDialog(!openDialog);
          } else {
            setReviewPopup(true),
            setRow(row);
          }
        }}
      >
        {row._id}

      </Link>
    },
    { id: "Requested by", label: "REQUESTED BY", format: (row) => row?.requestor_id },
    { id: "Request date", label: "REQUEST DATE", format: (row) => moment(row.requested_date).format("YYYY-MM-DD") },
    { id: "Valid till", label: "VALID TILL", format: (row) => moment(row.last_settlement_date).format('YYYY-MM-DD') },
    { id: "Status", label: "STATUS", format: (row) => row.status },
    {
      id: "Settlement letter", label: "SETTLEMENT LETTER", format: (row) => row.status === 'Settled' ||
        row.status === 'Approved' ?
        <div>{popupContent}
        <Link  onClick={() =>handleViewDoc(row.file_url, "Settlement Letter")}>View</Link></div> : "NA"

    }
  ];

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}

      {openDialog ? renderProductSchemePopup() : null}

      {/* <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '27px',
          fontSize: '18px',
          color: '#151515',
          top: '80px',
          left: '13px',
          fontWeight: '500',
          lineHeight: '150%'
        }}
      >
        <button
          onClick={() => window.open(`/admin/lending/loan_queue`, '_self')}
          style={{ border: 'none', background: 'none' }}
        >
          <ArrowBackIcon />
        </button>
        Settlement Offer
      </div> */}
      {checkAccessTags(['tag_loan_queue_settlement_read_write']) ? (

        <div>
          <Buttoned
            customStyle={{
              marginTop: "138px",
              display: "inline-flex",
              marginRight: "17px",
              padding: "13px 26px",
              float: "right",
              top: "40px",
              height: "48px",
              radius: "8px",
              borderRadius: "8px",
              fontSize: "16px",
              lineHeight: "150%",
              justifyCcontent: "center",
              alignItems: "center",
              gap: "10px",
              fontFamily: "Montserrat-Regular",
              backgroundColor: "#475BD8",
              fontWeight: "600",
              fontStyle: "normal",
              lineHeight: "150%",
              backgroundColor:"#475BD8"
            }}
            label=" Create settlement offer" buttonType="primary" onClick={() => { if (loanData.isInvalidOfferPresent) { setIsTextChanged(false), setOpenDialog(!openDialog); } else { setSettlement(true); } }} />
        </div>



      ) : null}
      <div style={{ width: "97%", marginTop: "30px", backgroundColor: "#F9F8FA", border: " 1px solid #EDEDED", borderRadius: "8px", marginLeft: "25px", padding: "16px", fontFamily: "Montserrat-SemiBold" }}>
        <h4 style={{ fontSize: "20px", lineHeight: "150%", fontFamily: "Montserrat-SemiBold", color: "#141519" }}>Loan Details</h4>
        <div style={{ display: "grid", gridTemplateColumns: "18% 18% 18% 18% 18% 18%", marginTop: "16px" }}>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }}>  POS<div style={{ color: "black", fontFamily: "Montserrat-Regular", fontSize: "16px", fontWeight : "800" }}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(principal))}
          </div>
          </div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }} >INTEREST<div style={{ color: "black", fontFamily: "Montserrat-Regular", fontSize: "16px", fontWeight : "800" }}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(interest))}</div>
          </div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }} >LPI <div style={{ color: "black", fontFamily: "Montserrat-Regular", fontSize: "16px" , fontWeight : "800" }}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(lpiDue))}
          </div>
          </div>

          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }} >BOUNCE CHARGE<div style={{ color: "black", fontFamily: "Montserrat-Regular", fontSize: "16px", fontWeight:"800" }}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(bounceCharge))}</div></div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }} >GST<div style={{ color: "black", fontFamily: "Montserrat-Regular", fontSize: "16px", fontWeight:"800" }}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(gst))}</div></div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }} >TOTAL<div style={{ color: "black", fontFamily: "Montserrat-Regular", fontSize: "16px", fontWeight:"800" }}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(parseFloat(total)))}
          </div>
          </div>
        </div>
      </div>

      <div>
        {settlement ? (
          <SettlementPopUp
            offerInvalidPopup={setOpenDialog}
            open={settlement}
            closePopup={() => {
              handleCloseSettlementTranchesPopup();
            }}
            loanId={loan_id}
            companyId={company_id}
            productId={product_id}
          />
        ) : null}
      </div>
      <div>
        {reviewPopup ? (
          <ReviewPopUp
            offerInvalidPopup={setOpenDialog}
            open={reviewPopup}
            closePopup={() => {
              handleCloseReviewPopup();
            }}
            row={row}
            loanId={loan_id}
            companyId={company_id}
            productId={product_id}
          />
        ) : null}
      </div>

      <div>

        {loanDataApi.length ? (

          <div>

            <h2 style={{ fontFamily: "Montserrat-SemiBold", marginLeft: "25px", fontSize: "20pz", lineHeight: "150%", marginTop: "40px", marginBottom: "-20px" }}>Previous Settlement Offers</h2>

            <div style={{ maxWidth: "100%", padding: "18px", marginLeft:"6.2px", marginTop:"10px" }}>

              <Table
                customStyle={{ width: "100%" }}
                data={loanDataApi}
                columns={columns}
              />

              {count ? <Pagination

                onPageChange={handleChangePage}

                totalItems={count}

                itemsPerPage={10}

              /> : null}

            </div>

          </div>) : ""}

      </div>

      {isLoading && <Preloader />}

    </>

  );
};



export default SettlementOfferRequest;
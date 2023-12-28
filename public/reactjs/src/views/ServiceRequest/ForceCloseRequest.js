import * as React from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { AlertBox } from '../../components/AlertBox';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { storedList } from '../../util/localstorage';
import moment from 'moment';
import { getForceCloseByLoanIdWatcher, addForceCloseByLoanIdWatcher } from '../../actions/foreclosureOffer';
export default function ForceCloseRequest(props) {
  const params = useParams();
  const [forceCloseData, setForceCloseData] = useState({
    principal_outstanding: 0,
    principal_outstanding_received: 0,
    interest_due: 0,
    interest_due_received: 0,
    lpi_due: 0,
    lpi_due_received: 0,
    bounce_charges: 0,
    bounce_charges_received: 0,
    gst_bounce_charges: 0,
    gst_bounce_charges_received: 0,
    total_amount: 0,
    total_amount_received: 0,
    int_on_termination: 0,
    comments: '',
  });
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [formDisabled, setFormDisabled] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const dispatch = useDispatch();
  const user = storedList('user');

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      setAlert(false);
    }, 3000);
  };

  useEffect(() => {
    try {
      const payload = {
        company_id: params.company_id,
        product_id: params.product_id,
        loan_id: params.loan_id,
      };
      dispatch(
        getForceCloseByLoanIdWatcher(
          payload,
          (response) => {
            let updated_data = {
              ...response.data.loan_details,
              ...response.data.charges_details,
              comments: '',
              principal_outstanding: response.data.charges_details.prin_os,
              interest_due: response.data.charges_details.int_due,
              lpi_due: response.data.charges_details.lpi_due,
              bounce_charges: response.data.charges_details.charges_due,
              gst_bounce_charges: response.data.charges_details.gst,
              total_amount: response.data.charges_details.total_due,
              total_amount_received: response.data.charges_details.total_amount_excess,
              int_on_termination: response.data.charges_details.int_on_termination,
            };
            if (response.data.closure_details) {
              const closure_details = response.data.closure_details;
              const closure_offers = response.data.closure_details.offers[0];
              updated_data = {
                ...updated_data,
                request_id: closure_details._id,
                request_date: closure_details.created_at,
                comments: closure_details.requestor_comment,
                closure_status: closure_offers.status,
                principal_outstanding_received: closure_details.prin_os - closure_details.prin_os_waiver,
                interest_due: closure_offers.int_due,
                interest_due_received: closure_offers.int_due - closure_offers.interest_waiver,
                lpi_due: closure_offers.lpi_due,
                lpi_due_received: closure_offers.lpi_due - closure_offers.lpi_waiver,
                bounce_charges: closure_offers.bounce_charges,
                bounce_charges_received: closure_offers.bounce_charges - closure_offers.bounce_charges_waiver,
                gst_bounce_charges: closure_offers.gst_on_bc,
                gst_bounce_charges_received: closure_offers.gst_on_bc - closure_offers.gst_reversal_bc,
              };
            }
            const access_metrix_tags = user?.access_metrix_tags ?? [];
            if (!access_metrix_tags.includes('tag_loan_queue_force_closure_write')) {
              updated_data = {
                ...updated_data,
                closure_status: updated_data.closure_status ?? 'approved',
              };
            }
            setForceCloseData((prev_state) => ({ ...prev_state, ...updated_data }));
            if (updated_data?.closure_status) {
              setFormDisabled(true);
              setSaveDisabled(true);
            } else {
              if (updated_data?.total_amount_received == 0) {
                setFormDisabled(false);
                setSaveDisabled(false);
              }
            }
            if(forceCloseData.total_amount > forceCloseData.total_amount_received){
              setSaveDisabled(true);
            }
          },
          (error) => {
            showAlert(error?.response?.data?.message ?? 'Technical error, please try again.', 'error');
          },
        ),
      );
    } catch (error) {
      showAlert(error?.response?.data?.message ?? 'Technical error, please try again.', 'error');
    }
  }, []);

  const updateForm = (event, key) => {
    try {
      if (key === 'comments') {
        setForceCloseData((prev_state) => ({ ...prev_state, [key]: event.target.value }));
      } else {
        let value = Number(event.target.value.toString().replace(/[^\d.]/g, ''));
        if (!isNaN(value)) {
          value = value < 0 ? 0 : parseFloat(value);
          const updated_state = {
            principal_outstanding_received: forceCloseData?.principal_outstanding_received,
            interest_due_received: forceCloseData?.interest_due_received,
            lpi_due_received: forceCloseData?.lpi_due_received,
            bounce_charges_received: forceCloseData?.bounce_charges_received,
            gst_bounce_charges_received: forceCloseData?.gst_bounce_charges_received,
          };
          if (key === 'principal_outstanding_received') {
            if (value > forceCloseData.principal_outstanding) {
              updated_state.principal_outstanding_received = forceCloseData.principal_outstanding;
            } else {
              updated_state.principal_outstanding_received = value;
            }
          }
          if (key === 'interest_due_received') {
            if (value > forceCloseData.interest_due) {
              updated_state.interest_due_received = forceCloseData.interest_due;
            } else {
              updated_state.interest_due_received = value;
            }
          }
          if (key === 'lpi_due_received') {
            if (value > forceCloseData.lpi_due) {
              updated_state.lpi_due_received = forceCloseData.lpi_due;
            } else {
              updated_state.lpi_due_received = value;
            }
          }
          if (key === 'bounce_charges_received') {
            if (value > forceCloseData.bounce_charges) {
              updated_state.bounce_charges_received = forceCloseData.bounce_charges;
            } else {
              updated_state.bounce_charges_received = value;
            }
          }
          updated_state.gst_bounce_charges_received = updated_state.bounce_charges_received * 0.18;
          setForceCloseData((prev_state) => ({ ...prev_state, ...updated_state }));
          const total_amount_received = updated_state.principal_outstanding_received + updated_state.interest_due_received + updated_state.lpi_due_received + updated_state.bounce_charges_received + updated_state.gst_bounce_charges_received;
          if(forceCloseData.total_amount <= forceCloseData.total_amount_received){
            if(forceCloseData.total_amount == total_amount_received){
              setSaveDisabled(false);
            } else {
              showAlert('Please adjust the total amount received against all the above headers for closure of the loan.', 'error');
              setSaveDisabled(true);
            }
          } else if(forceCloseData.total_amount > forceCloseData.total_amount_received){
            setSaveDisabled(true);
            if(forceCloseData.total_amount_received == total_amount_received){
              setSaveDisabled(false);
            } else {
              showAlert('Please adjust the total amount received against all the above headers for closure of the loan.', 'error');
              setSaveDisabled(true);
            }
          } else {
            setSaveDisabled(true);
          }
          
          // if(total_amount_received == forceCloseData.total_amount_received){
          //   setSaveDisabled(false);
          // } else if (total_amount_received > forceCloseData.total_amount_received){
          //   showAlert('Please adjust the total amount received against all the above headers for closure of the loan.', 'error');
          //   setSaveDisabled(true);
          // } else if (total_amount_received <= forceCloseData.total_amount_received && forceCloseData.total_amount_received > 0) {
          //   setSaveDisabled(false);
          // } else {
          //   setSaveDisabled(true);
          // }
        } else {
          setForceCloseData((prev_state) => ({ ...prev_state, [key]: 0 }));
          setSaveDisabled(true);
        }
      }
    } catch (error) {
      showAlert(error?.message ?? 'Technical error, please try again.', 'error');
    }
  };

  const clearAll = () => {
    window.open(`/admin/lending/loan_queue`, '_self');
  };

  const submitData = async () => {
    if (!saveDisabled && !formDisabled) {
      try {
        let payload = {
          company_id: params.company_id,
          product_id: params.product_id,
          loan_id: params.loan_id,
          principal_outstanding: forceCloseData.principal_outstanding,
          principal_outstanding_received: forceCloseData.principal_outstanding_received,
          interest_due: forceCloseData.interest_due,
          interest_due_received: forceCloseData.interest_due_received,
          lpi_due: forceCloseData.lpi_due,
          lpi_due_received: forceCloseData.lpi_due_received,
          bounce_charges: forceCloseData.bounce_charges,
          bounce_charges_received: forceCloseData.bounce_charges_received,
          gst_bounce_charges: forceCloseData.gst_bounce_charges,
          gst_bounce_charges_received: forceCloseData.gst_bounce_charges_received,
          total_amount: forceCloseData.total_amount,
          total_amount_received: forceCloseData.total_amount_received,
          int_on_termination: forceCloseData.int_on_termination,
          comments: forceCloseData.comments,
        };
        payload = {
          ...payload,
          principal_outstanding_waiver: forceCloseData.principal_outstanding - payload.principal_outstanding_received,
          interest_due_waiver: forceCloseData.interest_due - payload.interest_due_received,
          lpi_due_waiver: forceCloseData.lpi_due - payload.lpi_due_received,
          bounce_charges_waiver: forceCloseData.bounce_charges - payload.bounce_charges_received,
          gst_bounce_charges_waiver: forceCloseData.gst_bounce_charges - payload.gst_bounce_charges_received,
          total_amount_waiver: forceCloseData.total_amount - payload.total_amount_received,
        };
        Object.keys(payload).forEach((key) => {
          if (!['company_id', 'product_id', 'loan_id', 'comments'].includes(key.toString())) {
            payload[key] = Number(parseFloat(payload[key]).toFixed(2));
          }
        });
        dispatch(
          addForceCloseByLoanIdWatcher(
            payload,
            (response) => {
              showAlert(response?.message ?? 'Loan closed successfully.', 'success');
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            },
            (error) => {
              showAlert(error?.response?.data?.message ?? 'Technical error, please try again.', 'error');
            },
          ),
        );
      } catch (error) {
        showAlert(error?.response?.data?.message ?? 'Technical error, please try again.', 'error');
      }
    } else {
      showAlert('Form fields are disabled, please try again.', 'error');
    }
  };

  if (Object.keys(forceCloseData).length == 0) {
    return <>{alert && <AlertBox severity={severity} msg={alertMessage} onClose={() => setAlert(false)} />}</>;
  }

  const dialogFont = {
    fontFamily: 'Montserrat-SemiBold',
  };
  const inputStyle = {
    outline: 'none',
    margin: '0px 3px 0px 3px',
    padding: '8px 8px 8px 16px',
    borderRadius: '8px',
    border: '1px solid #BBBFCC',
    background: formDisabled ? '#dcdad13d' : 'var(--base-white, #FFF)',
    height: '36px',
    width: '36%',
  };
  const headCellStyle = {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: '14px',
    fontWeight: '600',
    color: '#625E5E',
    background: '#E5E5E8',
    borderBottom: 'none',
    height: '64px',
  };

  const tableRow = {
    border: '1px solid #EDEDED',
    color: '#1C1C1C',
  };
  const bodyCellStyle = {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: 600,
    fontSize: '14px',
    color: '#1C1C1C',
    borderBottom: 'none',
  };
  const buttons = {
    padding: '13px 39px',
    height: '43px',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: 600,
  };
  const classes = {
    root: {
      color: '#161719',
      fontFamily: 'Montserrat-SemiBold',
      fontSize: '16px',
    },
  };
  return (
    <>
      {alert && <AlertBox severity={severity} msg={alertMessage} onClose={() => setAlert(false)} />}
      <DialogContent style={dialogFont}>
        <Grid mt={2} ml={2} mr={2}>
          <Grid style={{ backgroundColor: '#F9F8FA', border: ' 1px solid #EDEDED', borderRadius: '8px', padding: '16px', fontFamily: 'Montserrat-SemiBold' }}>
            <Typography>
              <div style={{ fontSize: '20px', fontFamily: 'Montserrat-SemiBold', color: '#141519', marginBottom: '16px' }}>Loan Details</div>
            </Typography>
            <Grid container>
              {forceCloseData?.closure_status && (
                <Grid item xs={2}>
                  <Typography>
                    <div style={{ fontFamily: 'Montserrat-Regular', fontSize: '12px' }}>REQUEST ID</div>
                    <div style={{ color: '#161719', fontFamily: 'Montserrat-SemiBold', fontSize: '16px' }}> {forceCloseData?.request_id ?? 'N/A'}</div>
                  </Typography>
                </Grid>
              )}
              <Grid item xs={forceCloseData?.closure_status ? 2 : 3}>
                <Typography>
                  <div style={{ fontFamily: 'Montserrat-Regular', fontSize: '12px' }}>LOAN ID</div>
                  <div style={{ color: '#161719', fontFamily: 'Montserrat-SemiBold', fontSize: '16px' }}>{forceCloseData?.loan_id ?? 'N/A'}</div>
                </Typography>
              </Grid>
              <Grid item xs={forceCloseData?.closure_status ? 2 : 3}>
                <Typography>
                  <div style={{ fontFamily: 'Montserrat-Regular', fontSize: '12px' }}>PARTNER NAME</div>
                  <div style={{ color: '#161719', fontFamily: 'Montserrat-SemiBold', fontSize: '16px' }}>{forceCloseData?.company_name ?? forceCloseData?.partner_name ?? 'N/A'}</div>
                </Typography>
              </Grid>
              <Grid item xs={forceCloseData?.closure_status ? 2 : 3}>
                <Typography>
                  <div style={{ fontFamily: 'Montserrat-Regular', fontSize: '12px' }}>PRODUCT NAME</div>
                  <div style={{ color: '#161719', fontFamily: 'Montserrat-SemiBold', fontSize: '16px' }}>{forceCloseData?.product_name ?? 'N/A'}</div>
                </Typography>
              </Grid>
              <Grid item xs={forceCloseData?.closure_status ? 2 : 3}>
                <Typography>
                  <div style={{ fontFamily: 'Montserrat-Regular', fontSize: '12px' }}>CUSTOMER NAME</div>
                  <div style={{ color: '#161719', fontFamily: 'Montserrat-SemiBold', fontSize: '16px' }}>{forceCloseData?.customer_name ?? 'N/A'}</div>
                </Typography>
              </Grid>
              {forceCloseData?.closure_status && (
                <Grid item xs={2}>
                  <Typography>
                    <div style={{ fontFamily: 'Montserrat-Regular', fontSize: '12px' }}>REQUEST DATE</div>
                    <div style={{ color: '#161719', fontFamily: 'Montserrat-SemiBold', fontSize: '16px' }}>{forceCloseData?.request_date ? moment(forceCloseData?.request_date).format('YYYY-MM-DD') : 'N/A'}</div>
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid
            style={{
              marginTop: '15px',
            }}
          >
            <TableContainer>
              <Table>
                <TableHead
                  style={{
                    borderTopLeftRadius: '15px',
                    borderTopRightRadius: '15px',
                    background: '#f9f8fa',
                    border: '1px solid #f9f8fa',
                  }}
                >
                  <TableRow>
                    <TableCell style={{ ...headCellStyle, borderTopLeftRadius: '15px' }}>DESCRIPTION </TableCell>
                    <TableCell style={headCellStyle}>SYSTEM VALUE</TableCell>
                    <TableCell style={headCellStyle}>AMOUNT RECEIVED</TableCell>
                    <TableCell style={{ ...headCellStyle, borderTopRightRadius: '15px' }}>WAIVER</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={0} style={tableRow}>
                    <TableCell style={bodyCellStyle} scope="row">
                      Principal Outstanding
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat(forceCloseData?.principal_outstanding).toFixed(2)}
                    </TableCell>
                    <TableCell style={{ ...bodyCellStyle, paddingLeft: '0px' }} scope="row">
                      <div>
                        <span style={{ position: 'relative', right: '-20px' }}>₹</span>
                        <input disabled={formDisabled} type="number" step=".01" min="0" value={formDisabled ? (forceCloseData?.principal_outstanding_received ?? '0.00')?.toFixed(2) : forceCloseData?.principal_outstanding_received?.toString()} style={inputStyle} onChange={(event) => updateForm(event, 'principal_outstanding_received')} />
                      </div>
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat(forceCloseData?.principal_outstanding - forceCloseData?.principal_outstanding_received).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow key={1} style={tableRow}>
                    <TableCell style={bodyCellStyle} scope="row">
                      {' '}
                      Interest Due
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat(forceCloseData?.interest_due).toFixed(2)}
                    </TableCell>
                    <TableCell style={{ ...bodyCellStyle, paddingLeft: '0px' }} scope="row">
                      <div>
                        <span style={{ position: 'relative', right: '-20px' }}>₹</span>
                        <input disabled={formDisabled} type="number" step=".01" min="0" value={formDisabled ? (forceCloseData?.interest_due_received ?? '0.00')?.toFixed(2) : forceCloseData?.interest_due_received?.toString()} style={inputStyle} onChange={(event) => updateForm(event, 'interest_due_received')} />
                      </div>
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat(forceCloseData?.interest_due - forceCloseData?.interest_due_received).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow key={2} style={tableRow}>
                    <TableCell style={bodyCellStyle} scope="row">
                      LPI Due
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat(forceCloseData?.lpi_due).toFixed(2)}
                    </TableCell>
                    <TableCell style={{ ...bodyCellStyle, paddingLeft: '0px' }} scope="row">
                      <div>
                        <span style={{ position: 'relative', right: '-20px' }}>₹</span>
                        <input disabled={formDisabled} type="number" step=".01" min="0" value={formDisabled ? (forceCloseData?.lpi_due_received ?? '0.00')?.toFixed(2) : forceCloseData?.lpi_due_received?.toString()} style={inputStyle} onChange={(event) => updateForm(event, 'lpi_due_received')} />
                      </div>
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat(forceCloseData?.lpi_due - forceCloseData?.lpi_due_received).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow key={3} style={tableRow}>
                    <TableCell style={bodyCellStyle} scope="row">
                      Bounce Charges
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat(forceCloseData?.bounce_charges).toFixed(2)}
                    </TableCell>
                    <TableCell style={{ ...bodyCellStyle, paddingLeft: '0px' }} scope="row">
                      <div>
                        <span style={{ position: 'relative', right: '-20px' }}>₹</span>
                        <input disabled={formDisabled} type="number" step=".01" min="0" value={formDisabled ? (forceCloseData?.bounce_charges_received ?? '0.00')?.toFixed(2) : forceCloseData?.bounce_charges_received?.toString()} style={inputStyle} onChange={(event) => updateForm(event, 'bounce_charges_received')} />
                      </div>
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat(forceCloseData?.bounce_charges - forceCloseData?.bounce_charges_received).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow key={4} style={tableRow}>
                    <TableCell style={bodyCellStyle} scope="row">
                      GST on Bounce Charges
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat(forceCloseData?.gst_bounce_charges).toFixed(2)}
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat(forceCloseData?.gst_bounce_charges_received).toFixed(2)}
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat(forceCloseData?.gst_bounce_charges - forceCloseData?.gst_bounce_charges_received).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow key={5} style={tableRow}>
                    <TableCell style={bodyCellStyle} scope="row">
                      Total Amount
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat(forceCloseData?.total_amount).toFixed(2)}
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat(forceCloseData?.total_amount_received).toFixed(2)}
                    </TableCell>
                    <TableCell style={bodyCellStyle} scope="row">
                      ₹{parseFloat((forceCloseData?.principal_outstanding - forceCloseData?.principal_outstanding_received)+(forceCloseData?.interest_due - forceCloseData?.interest_due_received)+(forceCloseData?.lpi_due - forceCloseData?.lpi_due_received)+(forceCloseData?.bounce_charges - forceCloseData?.bounce_charges_received)+(forceCloseData?.gst_bounce_charges - forceCloseData?.gst_bounce_charges_received)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Grid style={{ marginTop: '24px' }} m={2}>
          <TextField
            InputLabelProps={{
              style: { color: '#161719', fontFamily: 'Montserrat-SemiBold', fontSize: '14px' },
            }}
            disabled={formDisabled}
            label="Add Comment *"
            fullWidth
            multiline
            rows={2}
            value={forceCloseData?.comments}
            onChange={(event) => updateForm(event, 'comments')}
          />
        </Grid>
        {forceCloseData?.closure_status ? (
          <Grid style={{ margin: '24px 14px 24px 0px', display: 'flex', justifyContent: 'flex-end' }} m={2}>
            <Button style={{ ...buttons, marginRight: '5px', border: '2px solid #475BD8', color: '#475BD8' }} variant="outlined" onClick={() => clearAll()}>
              Go Back
            </Button>
          </Grid>
        ) : (
          <Grid style={{ margin: '24px 14px 24px 0px', display: 'flex', justifyContent: 'flex-end' }} m={2}>
            <Button style={{ ...buttons, marginRight: '5px', border: '2px solid #475BD8', color: '#475BD8' }} variant="outlined" onClick={() => clearAll()}>
              Cancel
            </Button>
            <Button style={{ ...buttons, background: `${saveDisabled || formDisabled ? '#475bd852' : '#475BD8'}`, color: '#fff' }} disabled={saveDisabled || formDisabled} variant="contained" onClick={() => submitData()}>
              Submit
            </Button>
          </Grid>
        )}
      </DialogContent>
    </>
  );
}

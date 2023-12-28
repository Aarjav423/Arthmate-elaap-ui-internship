import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
import GridOnIcon from '@mui/icons-material/GridOn';
import { getLeadDetailsWatcher } from '../../actions/loanRequest.js';
import { downloadDataInXLSXFormat } from '../../util/helper';
import moment from 'moment';
import Button from 'react-sdk/dist/components/Button/Button.js';

import Img from './images/download-button.svg';
import imgH from './images/download-button-hover.svg';

const DownloadMsmeFile = ({ filter, handleAlert, company, product, disabled, checkAccessTags, isTagged }) => {
  const dispatch = useDispatch();

  const getDownloadData = (ext) => {
    dispatch(
      getLeadDetailsWatcher(
        {
          ...filter,
          isExport: true,
          company_id: company.value ? company.value : company._id,
          product_id: product.value ? product.value : product._id,
        },
        (result) => {
          let fileName = `Leads_${company.label || company.name}_${product.label || product.name}_${moment(filter.from_date).format('DD_MMM_YYYY') !== 'Invalid date' ? moment(filter.from_date).format('DD_MMM_YYYY') : 'NA'}_${moment(filter.to_date).format('DD_MMM_YYYY') !== 'Invalid date' ? moment(filter.to_date).format('DD_MMM_YYYY') : 'NA'}.${ext}`;
          downloadDataInXLSXFormat(fileName, result);
          handleAlert('File downloaded successfully', 'success');
        },
        (error) => {
          return handleAlert('Problem downloading file', 'error');
        },
      ),
    );
  };
  // useEffect(() => {
  //   setIsxlsxDisabled(true);
  //   setIscsvDisabled(true);
  //   if (
  //     filter.partner_id &&
  //     filter.product_id &&
  //     filter.from_date &&
  //     filter.to_date
  //   ) {
  //     setIsxlsxDisabled(false);
  //     setIscsvDisabled(false);
  //   }
  // }, [filter]);

  return (
    <>
      <div style={{ display: 'flex' }}>
        {isTagged && checkAccessTags(['tag_msme_lead_btn_xlsx']) && (
          <Button
            buttonType="secondary"
            label="XLSX"
            customStyle={{
              width: '109px',
              height: '40px',
              border: '1px solid #475BD8',
              color: '#475BD8',
              borderRadius: '26px',
              fontSize: '12px',
              display: 'flex',
              justifyContent: 'center',
              boxShadow: 'none',
              backgroundColor: 'white',
            }}
            onClick={() => getDownloadData('xlsx')}
            imageButton={Img}
            imageButtonHover={imgH}
            iconButton="btn-secondary-download-button"
          />
        )}

        {isTagged && checkAccessTags(['tag_msme_lead_btn_csv']) && (
          <Button
            label="CSV"
            buttonType="secondary"
            customStyle={{
              width: '109px',
              height: '40px',
              marginLeft: '12px',
              border: '1px solid #475BD8',
              color: '#475BD8',
              borderRadius: '26px',
              fontSize: '12px',
              display: 'flex',
              justifyContent: 'center',
              boxShadow: 'none',
              backgroundColor: 'white',
            }}
            onClick={() => getDownloadData('csv')}
            imageButton={Img}
            imageButtonHover={imgH}
            iconButton="btn-secondary-download-button"
          />
        )}
      </div>
    </>
  );
};

export default DownloadMsmeFile;

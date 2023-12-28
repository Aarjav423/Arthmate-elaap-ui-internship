import useDimensions from 'hooks/useDimensions';
import React, { useEffect, useState } from 'react';
import { toCamel } from '../../../util/helper';
import { formatLeadSectionValidationStatusAndRemarks } from '../../../util/msme/helper';
import { Tooltip } from '../msme.component';
import StatusIcon from '../StatusIcon/StatusIcon';

export const ValidationChecklist = ({ leadSectionObject }) => {
  const [sectionValidations, setSectionValidations] = useState({});
  const { innerWidth, innerHeight } = useDimensions();
  const styles = useStyles({ innerWidth, innerHeight });

  useEffect(() => {
    if (leadSectionObject) {
      const tempSectionValidation = formatLeadSectionValidationStatusAndRemarks(leadSectionObject);
      setSectionValidations(tempSectionValidation);
    }
  }, [leadSectionObject]);



  return (
    <React.Fragment>
      {sectionValidations && Object.keys(sectionValidations).length ? (
        <div style={styles?.customHeadingContainer}>
          <div style={styles?.customHeading}>Validation Checklist</div>
          <div style={styles?.validationContainer}>
            {Object.entries(sectionValidations).map(([key, { status, remarks }], index) => (
              <div style={styles?.subValidationContainer} key={index}>
                <span style={styles?.validationTitleContainer}>{toCamel(key, true)}</span>
                <div style={styles?.validationStatusContainer}>
                  <StatusIcon status={status.toLowerCase()} />
                  {status == 'in_review' || status == 'rejected' ? <Tooltip content={remarks ? remarks : ''} /> : <div style={{ width: '21px', height: '18px', backgroundColor: 'transparent' }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div />
      )}
    </React.Fragment>
  );
};

const useStyles = ({innerWidth,innerHeight})=> ({
  customHeadingContainer: {
    marginTop: '50px',
    marginBottom: '50px',
  },
  customHeading: {
    width: '100%',
    fontSize: '18px',
    fontWeight: '600',
    lineHeight: '18px',
    color: '#1C1C1C',
    fontFamily: 'Montserrat-Regular',
    marginBottom: '20px',
  },
  validationContainer: {
    display: 'grid',
    gridTemplateColumns: innerWidth>1500?'35% 35%':'40% 40%',
    columnGap: '10%',
  },
  subValidationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  validationTitleContainer: {
    fontFamily: 'Montserrat-Medium',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '30px',
    color: 'rgb(107, 111, 128)',
  },
  validationStatusContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '105px',
    height: '32px'
  },
});

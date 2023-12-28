import * as React from 'react';
import { storedList } from '../../../util/localstorage';
import useDimensions from '../../../hooks/useDimensions';
import InfoIcon from '../../../assets/img/info-circle-amber.svg';

const user = { _id: storedList('user')?._id, id: storedList('user')?.id };

export const LogViewer = (props) => {
  const { innerWidth, innerHeight } = useDimensions();
  const styles = useStyles({ innerWidth, innerHeight });
  const { head, body } = props;
  return (
    <div style={styles.comment}>
      <div style={{ display: 'flex' }}>
        <div style={{paddingRight:"15px"}}>
          <img src={InfoIcon} style={{ color: '#EDA12F' }} color="yellow" alt="hello" />
        </div>
        <div>
          <div style={{ color: '#EDA12F', fontSize: '18px' }}>{head}</div>
          <div style={{ color: '#161719', fontSize: '14px', paddingTop: '5px' }}>{body}</div>
        </div>
      </div>
    </div>
  );
};

const useStyles = ({ innerWidth, innerHeight }) => {
  return {
    comment: {
      height: '74px',
      top: '117px',
      left: '473px',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #EDA12F',
      margin: '16px',
    },
  };
};

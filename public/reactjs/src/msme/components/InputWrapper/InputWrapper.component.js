import * as React from 'react';
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import 'react-sdk/dist/styles/_fonts.scss';
import useDimensions from 'hooks/useDimensions';
import BasicDatePicker from 'components/DatePicker/basicDatePicker';

export default function InputWrapper({ object, onChange, data = {}, type, inputCss = {}, disabled = false, isBoxType = 'button', dropdown, onDrawdownSelect = () => null, validationData = {}, value, isDrawdown = false, disabledAge = 18 }) {
  const { innerWidth, innerHeight } = useDimensions();
  const styles = useStyles({ innerWidth, innerHeight });

  if (!object) {
    return <div />;
  }

  if (object?.type == 'date' || type == 'date') {
    return (
      <BasicDatePicker
        disabled={false}
        placeholder={'Date of Birth'}
        style={{ ...styles.inputCss, width: '30%', maxWidth: '328px' }}
        value={data[`${object.type}_vl_${object.field}`] || null}
        format="dd-MM-yyyy"
        shouldDisableDate={(date) => {
          const today = new Date();
          const selectedDate = new Date(date);
          const age = today.getFullYear() - selectedDate.getFullYear() - (today.getMonth() < selectedDate.getMonth() || (today.getMonth() === selectedDate.getMonth() && today.getDate() < selectedDate.getDate()) ? 1 : 0);
          return age < disabledAge;
        }}
        shouldDisableYear={(date) => {
          const today = new Date();
          const selectedDate = new Date(date);
          const age = today.getFullYear() - selectedDate.getFullYear();
          return age < disabledAge;
        }}
        onDateChange={(date) => {
          onChange(date, object.type, object.field);
        }}
        error={false}
        helperText={``}
      />
    );
  }

  return (
    <InputBox
      id={object}
      type={type ? type : object.type ?? 'text'}
      label={object['title']}
      isDrawdown={disabled ? false : isDrawdown || object['isDrawdown']}
      initialValue={value ? value : data[`${object['type']}_vl_${object['field']}`]}
      isDisabled={disabled}
      customClass={{ ...styles.inputCss, ...inputCss, ...(isBoxType == 'icon' ? { border: '1px solid green' } : {}) }}
      customInputClass={styles.inputBoxCss}
      onClick={(event) => onChange(event, object.type, object.field)}
      error={!object.isOptional && validationData[`${object['type']}_vl_${object['field']}`] ? validationData[`${object['type']}_vl_${object['field']}`] : false}
      helperText={!object.isOptional && validationData[`${object['type']}_vl_${object['field']}`] ? object['validationMsg'] : ''}
      options={object['isDrawdown'] || isDrawdown ? (dropdown ? dropdown : object['options']) : []}
      customDropdownClass={styles.inputDropdownClass}
      isBoxType={isBoxType}
      onDrawdownSelect={onDrawdownSelect}
    />
  );
}

const useStyles = ({ innerWidth, innerHeight }) => {
  return {
    inputFlex: {
      display: 'flex',
      justifyContent: 'start',
    },
    inputBoxCss: {
      marginTop: '0px',
      backgroundColor: '#fff',
      minWidth: '100%',
    },
    inputCss: {
      height: '56px',
      width: '30%',
    },
    inputDropdownClass: {
      marginTop: '8px',
      maxHeight: '500px',
      zIndex: 1,
      width: '105%',
      minWidth: '100%',
    },
  };
};

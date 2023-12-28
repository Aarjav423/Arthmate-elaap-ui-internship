import * as React from "react";
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";
import {getAllActiveDisbursementChannelMaster} from "../../actions/disbursementChannelMaster";
import CustomDropdown from "../custom/customSelect";

const DisbursementChannelSelect = ({
  onChannelChange,
  channel,
  placeholder,
  disabled
}) => {
  const [list, setList] = React.useState([]);
  const dispatch = useDispatch();

  const handleSetList = result => {
    setList(
      result
        .filter(item => item.status === "1")
        .map(item => {
          return {
            value: item.title,
            label: `${item.title}`
          };
        })
    );
  };

  React.useEffect(() => {
    dispatch(
      getAllActiveDisbursementChannelMaster(
        {},
        result => {
          handleSetList(result.data);
        },
        error => {}
      )
    );
  }, []);

  return (
    <CustomDropdown
      placeholder={placeholder}
      data={list}
      value={channel}
      id="channel"
      handleDropdownChange={item => {
        onChannelChange(item);
      }}
      disabled={disabled}
    />
  );
};

DisbursementChannelSelect.propTypes = {
  children: PropTypes.node
};

DisbursementChannelSelect.defaultProps = {
  children: ""
};

export default DisbursementChannelSelect;

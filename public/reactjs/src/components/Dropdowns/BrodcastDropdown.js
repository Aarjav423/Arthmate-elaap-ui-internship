import * as React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { broadcastEventListWatcher } from "../../actions/pubsub";
import CustomDropdown from "../custom/customSelect";
import { storedList } from "../../util/localstorage";

const BrodcastSelect = ({
    onChange,
    placeholder,
    value,
    width,
}) => {
    const [brodcastEvents, setBrodcastEvents] = React.useState([]);
    const [disabled, setDisabled] = React.useState(false);
    const dispatch = useDispatch();
    const user = storedList("user");

    const handleGetData = () => {
        new Promise((resolve, reject) => {
            dispatch(broadcastEventListWatcher({}, resolve, reject));
        }).then((response) => {
            setBrodcastEvents(response.map((record) => {
                return {
                    label: record.title,
                    value: record._id,
                    key: record.key
                }
            }))
        }).catch((error) => {
            return error;
        });
    };

    React.useEffect(() => {
        handleGetData();
    }, []);


    return (
        <CustomDropdown
            placeholder={placeholder}
            data={brodcastEvents}
            value={value}
            id={"brodcast"}
            handleDropdownChange={onChange}
            disabled={disabled}
            width={width}
        />
    );
};

BrodcastSelect.propTypes = {
    children: PropTypes.node,
};

BrodcastSelect.defaultProps = {
    children: "",
};

export default BrodcastSelect;

import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
    getListDisbursementChannelWatcher,
} from "../../actions/compositeDisbursement";
import CustomDropdown from "../custom/customSelect";
import { storedList } from "../../util/localstorage";

const DisbursementChannelDropdown = (props) => {
    const {
        onValueChange,
        placeholder,
        valueData,
        id,
        helperText,
        handleShowAleart,
        company,
        ...other
    } = props;

    const dispatch = useDispatch();
    const [channels, setChannels] = useState([]);


    const handleGetChannelList = () => {
        try {
            const user = storedList("user");
            const data = {
                userData: {
                    company_id: company?.value,
                    user_id: user._id,
                },
                submitData: {},
            };

            new Promise((resolve, reject) => {
                dispatch(getListDisbursementChannelWatcher(data, resolve, reject));
            }).then((response) => {
                setChannels(response.data?.map((record) => {
                    return {
                        label: record.title,
                        value: record._id,
                    }
                }));
            }).catch((error) => {
                handleShowAleart("error", error.response.data.message);
            });
        } catch (error) {
        }
    };

    useEffect(() => {
        const user = storedList("user");
        const data = {
            userData: {
                company_id: company?.value,
                user_id: user._id,
            },
            submitData: {},
        };
        dispatch(
            getListDisbursementChannelWatcher(data,
                (result) => {
                    setChannels(
                        result.map((item) => {
                            return {
                                value: item.title,
                                label: item._id,
                            };
                        })
                    );
                },
                (error) => { }
            )
        );
    }, []);

    useEffect(() => {
        handleGetChannelList();
    }, []);


    return (
        <CustomDropdown
            placeholder={placeholder}
            data={channels}
            value={valueData}
            id={id}
            multiple={true}
            handleDropdownChange={onValueChange}
            helperText={helperText}
        />
    );
};

DisbursementChannelDropdown.propTypes = {
    children: PropTypes.node,
};

DisbursementChannelDropdown.defaultProps = {
    children: "",
};

export default DisbursementChannelDropdown;

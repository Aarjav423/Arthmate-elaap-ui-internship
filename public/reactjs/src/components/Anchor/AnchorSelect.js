import { useEffect, useState}  from "react";
import { useDispatch } from "react-redux";
import { anchorListWatcher } from "../../actions/anchor";
import CustomDropdown from "../custom/customSelect";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";

const AnchorSelect = ({ onAnchorChange, placeholder, anchor, width }) => {
    const [anchors, setAnchors] = useState([]);
    placeholder = "Select Anchor (Optional)";
    const [selectedAnchor, setSelectedAnchor] = useState({
        label: "",
        value: ""
    });
    const dispatch = useDispatch();

    const handleSelectedAnchor = item => {
        setSelectedAnchor(item);
        onAnchorChange(item);
    };

    useEffect(() => {
        if(anchor){
            setSelectedAnchor(anchor);
        }
        const payload = { page: 0, limit: 10000, str: "null" };
        dispatch(
            anchorListWatcher(
                payload,
                response => {
                    const finalAnchorArray = response.rows.map( item => {
                        return {
                            ...item,
                            value: item._id,
                            label: `${item.name}`
                        };
                    });
                    setAnchors(finalAnchorArray);
                },
                error => {
                }
            )
        );
    }, []);

    const inputBoxCss={
        marginTop:"0px",
        marginLeft:"2px",
        maxHeight:"500px",
        zIndex:5,
        padding:"0px 16px"
      }
    return (
        <InputBox
        label={placeholder}
        initialValue={anchor}
        customClass={{ width: width, height: "56px", maxWidth: "none" }}
        isDrawdown={true}
        onClick={handleSelectedAnchor}
        options={anchors}
        customDropdownClass={inputBoxCss}
        />
    );
};

export default AnchorSelect;

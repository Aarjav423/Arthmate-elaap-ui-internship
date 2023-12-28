import react, { useEffect, useState } from "react";
import "./filterComponent.css";
import Slider from "./DoubleSlider";
import Dropdown from "components/Collection/Dropdown/Dropdown";
import clearFilter_img from "../../../assets/collection/images/clearFilter_img.svg";
import { convertIntoINR } from "util/collection/helper";
import Autocomplete from "components/Collection/Autocomplete/autoComplete";
import { getCollectionCaseLmsIdWatcher } from "actions/collection/cases.action";
import { useDispatch } from "react-redux";

const FilterComponent = ({
  closeFilter,
  payload,
  applyCaseFilter,
  fosUserCaseList,
  setPayload,
  setLmsIdInputValue,
  lmsIdInputValue,
  status
}) => {
  let filterItem = [
    "minAmount",
    "maxAmount",
    "minDPD",
    "maxDPD",
    "pincode",
    "lms_id",
  ];
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedDPD, setSelectedDPD] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [LMSIdList, setLMSIdList] = useState([]);

  useEffect(() => {
    filterItem.forEach((item) => {
      if (payload[item]) {
        if (item === "minDPD") {
          switch (payload[item]) {
            case "1":
              setSelectedDPD("dpd1");
              setFormData({ ...formData, minDPD: 1, maxDPD: 30 });
              break;
            case "31":
              setSelectedDPD("dpd2");
              setFormData({ ...formData, minDPD: 31, maxDPD: 60 });
              break;
            case "61":
              setSelectedDPD("dpd3");
              setFormData({ ...formData, minDPD: 61, maxDPD: 90 });
              break;
            case "91":
              setSelectedDPD("dpd4");
              setFormData({ ...formData, minDPD: 91, maxDPD: 120 });
              break;
            default:
              setSelectedDPD("dpd5");
              setFormData({ ...formData, minDPD: 120 });
          }
        } else if (item === 'lms_id') {
          setFormData({ ...formData, [item]: payload[item] });
          setLmsIdInputValue(payload[item]);
        } else {
          setFormData({ ...formData, [item]: payload[item] });
        }
      }
    });
    if(!payload["lms_id"]){
      setLmsIdInputValue("");
    }
  }, [payload]);

  useEffect(() => {
    const delay = 500
    if (lmsIdInputValue) {
      const handler = setTimeout(() => {
        fetchCollectionCaseLmsIdList();
      }, delay);
      return () => {
        clearTimeout(handler);
      }
    }
  }, [lmsIdInputValue])

  const radioOptions = [
    { id: "dpd1", value: "1-30", label: "1-30 Days" },
    { id: "dpd2", value: "31-60", label: "31-60 Days" },
    { id: "dpd3", value: "61-90", label: "61-90 Days" },
    { id: "dpd4", value: "91-120", label: "91-120 Days" },
    { id: "dpd5", value: "120", label: "120+ Days" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "range") {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10), // Convert the value to an integer
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const applyFilter = (e) => {
    e.preventDefault();
    applyCaseFilter(formData);
    closeFilter();
  };

  const handleClearForm = () => {
    setFormData({});
    setSelectedDPD("");
    applyCaseFilter({});
    closeFilter();
    setPayload({
      ...payload,
      minAmount: null,
      maxAmount: null,
      minDPD: null,
      maxDPD: null,
      pincode: null,
      lms_id: null,
      assigned_to: null,
    });
  };

  const fetchCollectionCaseLmsIdList = () => {
    let payload = {
      pattern: lmsIdInputValue.toUpperCase(),
    };
    new Promise((resolve, reject) => {
      dispatch(getCollectionCaseLmsIdWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setLMSIdList(response?.data);
      })
      .catch((error) => {
        setAlert(true);
        setTimeout(() => { }, 4000);
      });
  };


  return (
    <form className="formComponent" onSubmit={applyFilter}>
      <div className="formChild">
        <div className="filterDiv">
          <div className="filterChild">
            <h4 className="h4Style">Filter By</h4>
            <button className="buttonCancel" onClick={closeFilter}>
              <img src={clearFilter_img} alt="clearFilter" />
            </button>
          </div>

          <div className="headerBottom">
            <div className="left">
              <div className="rangeDiv">
                <h4 className="rangeLable">Amount</h4>
                <Slider
                  min={0}
                  max={1000000}
                  payLoadMin={payload.minAmount}
                  payLoadMax={payload.maxAmount}
                  minValue={formData.minAmount ? formData.minAmount : payload.minAmount?payload.minAmount: 0}
                  maxValue={formData.maxAmount ? formData.maxAmount :payload.maxAmount?payload.maxAmount: 1000000}
                  setMinValue={(value) =>
                    setFormData({ ...formData, minAmount: value })
                  }
                  setMaxValue={(value) =>
                    setFormData({ ...formData, maxAmount: value })
                  }
                />

                <div className="LableDiv">
                  <p className="rangeLabel">
                    ₹{" "}
                    {formData.minAmount || payload.minAmount
                      ? convertIntoINR(
                        formData.minAmount || payload.minAmount,
                        0
                      )
                      : convertIntoINR(0, 0)}
                  </p>
                  <p className="rangeLabel">
                    ₹
                    {formData.maxAmount || payload.maxAmount
                      ? convertIntoINR(
                        formData.maxAmount || payload.maxAmount,
                        0
                      )
                      : convertIntoINR(1000000, 0)}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <h4 className="txtDpd">DPD</h4>
                <div className="gridContainer">
                  {radioOptions.map((item) => (
                    <CheckBox
                      key={item.id}
                      label={item.label}
                      onChange={() => {
                        setSelectedDPD(item.id);
                        const dpd = item.value.split("-");
                        if (dpd.length > 1) {
                          setFormData({
                            ...formData,
                            minDPD: dpd[0],
                            maxDPD: dpd[1],
                          });
                        } else {
                          let { maxDPD, ...otherFormData } = formData;
                          otherFormData.minDPD = dpd[0];
                          setFormData(otherFormData);
                        }
                      }}
                      checked={selectedDPD === item.id}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="right">
                <input
                  placeholder="Pincode"
                  type="number"
                  name="pincode"
                  id="pincode"
                  className="pincodeInput"
                  value={formData.pincode ? formData.pincode : ""}
                  onChange={handleChange}
                />
                <Autocomplete
                  options={LMSIdList?.map((data) => ({
                    label: data.lms_id,
                    value: data.lms_id,
                  }))}
                  placeholder="Enter LMS Id"
                  value={lmsIdInputValue}
                  setValue={(value) => setLmsIdInputValue(value)}
                  type="cross"
                  onOptionSelect={(newValue) =>{
                      setFormData({
                        ...formData,
                        lms_id: newValue && newValue!=''?newValue:null,
                      })
                  }
                  }
                  customStyleParent={{
                    width: "100%",
                    border: '1px solid grey',
                    borderRadius: '5px',
                    height: '40px',
                  }}
                  customStyleContainer={{
                    display: "flex",
                  }}
                  customStyleDropDownIcon={{
                    padding: "5px 10px 5px 0", marginLeft: '10px'
                  }}
                  customStyleInput={{
                    width: '235px'
                  }}
                  customStyleDropDown={{
                    width: '270px',
                    marginTop:'3px'
                  }}

                />
              </div>

              <div style={{display:status && status=="open"?"none":"initial"}}>
                <p className="para"></p>
                <Dropdown
                  id="assigned_to"
                  dropdownList={fosUserCaseList.map((data) => ({
                    label: data.name,
                    value: data._id,
                  }))}
                  isActive={isDropdownOpen}
                  setIsActive={setIsDropdownOpen}
                  value={formData?.assigned_to || payload?.assigned_to}
                  // payload={payload?.assigned_to}
                  myStyle={{
                    height: "48px",
                    width: "180px",
                    marginTop: "20px",
                  }}
                  setValue={(newValue) =>
                    setFormData({
                      ...formData,
                      assigned_to: newValue,
                    })
                  }
                  placeholder="FOS Agent"
                />
              </div>
              <div className="buttonDivParent">
                <div className="buttonDivChild">
                  <button
                    onClick={handleClearForm}
                    type="button"
                    className="clearButton"
                  >
                    Clear Filter
                  </button>
                  <button className="applyFilterStyle" type="submit">
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FilterComponent;

function CheckBox({ onChange, checked, label }) {
  return (
    <div className="gridItem">
      <input
        type="checkbox"
        onChange={onChange}
        checked={checked}
        className="inputCheckBox"
      />
      <p className="paraInput">{label}</p>
    </div>
  );
}

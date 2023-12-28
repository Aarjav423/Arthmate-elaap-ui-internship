import react, { useEffect, useState } from "react";
import "./dashboard.css";

import clearFilter_img from "assets/collection/images/clearFilter_img.svg";
import Dropdown from "components/Collection/Dropdown/Dropdown";

const FilterFos = ({
  setPayload,
  handleClose,
  fosData,
  setFosData,
  fosUserDropDown,
  payloadData,
  payload,
  setSelectAgent,
  selectAgent,
}) => {
  const [fosAgentName, setFosAgentName] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const initialFormData = {
    dateRange: null,
    amountRange: 0, // Default range value
    assigned_end_date: null,
    fosAgent: payload && payload.fosAgent ? payload.fosAgent : null,
    assigned_start_date: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChangeStartDate = (e) => {
    setFormData({
      ...formData,
      assigned_start_date: e.target.value,
    });
  };

  const handleChangeEndDate = (e) => {
    setFormData({
      ...formData,
      assigned_end_date: e.target.value,
    });
  };

  const applyFilter = (e) => {
    e.preventDefault();

    const newPayload = {
      assigned_end_date: formData?.assigned_end_date
        ? formData?.assigned_end_date
        : payload?.assigned_end_date,
      assigned_start_date: formData?.assigned_start_date
        ? formData?.assigned_start_date
        : payload?.assigned_start_date,
      minAmount: 0,
      maxAmount: formData?.amountRange,
      fosAgent: formData?.fosAgent,
    };
    setPayload(newPayload);
    handleClose();
  };

  const handleClearForm = (e) => {
    setFormData(initialFormData);
    setPayload("");
    handleClose();
  };

  useEffect(() => {
    setFosAgentName(fosData);
  }, []);

  const closeFosFilter = () => {
    handleClose();
  };

  return (
    <form onSubmit={applyFilter}>
      <div className="absoluteContainer">
        <div className="MyfilterDiv">
          <div className="DivHeader">
            <h4 className="customStyleH4">Filter By</h4>
            <button className="buttonCancel" onClick={closeFosFilter}>
              <img src={clearFilter_img} alt="clearFilter" />
            </button>
          </div>

          <div className="headerBottom">
            <div className="headerBottomChild">
              <div className="rightContainer">
                <div>
                  <p className="montserratRegular">Start Date</p>
                  <input
                    placeholder="Select Date Range"
                    type="date"
                    name="assigned_start_date"
                    id="assigned_start_date"
                    style={{
                      padding: "8px 10px",
                      borderRadius: "4px",
                      border: "1px solid grey",
                      marginRight: "4px",
                      color: "grey",
                      borderColor: "grey",
                      width: "200px",
                      opacity: "initial",
                      height: "auto",
                    }}
                    value={
                      formData.assigned_start_date
                        ? formData.assigned_start_date
                        : payload?.assigned_start_date
                    }
                    onChange={handleChangeStartDate}
                  />
                </div>

                <div>
                  <p className="montserratRegular">End Date</p>
                  <input
                    placeholder="Select Date Range"
                    type="date"
                    name="assigned_end_date"
                    id="assigned_end_date"
                    style={{
                      padding: "8px 10px",
                      borderRadius: "4px",
                      border: "1px solid grey",
                      marginRight: "4px",
                      color: "grey",
                      borderColor: "grey",
                      width: "200px",
                      opacity: "initial",
                      height: "auto",
                    }}
                    value={
                      formData.assigned_end_date
                        ? formData.assigned_end_date
                        : payload?.assigned_end_date
                    }
                    onChange={handleChangeEndDate}
                  />
                </div>

                <div>
                  <p className="montserratRegular">FOS Agent</p>

                  <Dropdown
                    id="fosAgent"
                    dropdownList={fosUserDropDown.map((data) => ({
                      label: data.name,
                      value: data._id,
                    }))}
                    isActive={isDropdownOpen}
                    setIsActive={setIsDropdownOpen}
                    setSelectAgent={setSelectAgent}
                    value={formData?.fosAgent}
                    myStyle={{
                      height: "48px",
                      width: "180px",
                    }}
                    payload={payload}
                    setValue={(newValue) =>
                      setFormData({
                        ...formData,
                        fosAgent: newValue,
                      })
                    }
                    placeholder="FOS Agent"
                  />
                </div>
              </div>

              <div className="buttonParent">
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="buttonClearStyle"
                >
                  Clear Filter
                </button>
                <button
                  type="Submit"
                  onSubmit={applyFilter}
                  className="buttonFilter"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FilterFos;

import react, { useState } from "react";

const FilterComponent = () => {
    const [amountRange, setAmountRange] = useState(100);
    const [pincode, setPincode] = useState("");
    const [selectedFos, setSelectedFos] = useState("fos");
    const [selectedLsmid, setSelectedLsmid] = useState("lsmid");
    const [dpdCheckboxes, setDpdCheckboxes] = useState({
        "1-30 Days": false,
        "31-60 Days": false,
        "61-90 Days": false,
        "91-120 Days": false,
        "120+ Days": false,
    });
    const filterDiv = {
        height: "320px",
        borderRadius: "10px",
        // border: "1px solid grey",
        width: "860px",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        // margin: "auto",
        FontFace: "Montserrat",
    };

    const DivHeader = {
        display: "flex",
        justifyContent: "space-between",
        padding: "0px 18px 0px 18px",
    };

    const handleDpdCheckboxChange = (label) => {
        setDpdCheckboxes((prevState) => ({
            ...prevState,
            [label]: !prevState[label],
        }));
    };

    const inputCheckBox = {
        height: "24px",
        width: "28px",
    };

    const inputDiv = {
        padding: "20px 10px 12px 0px",
        display: "flex",
        alignItems: "center",
    };

    const inputDivParent = {
        display: "flex",
        flexWrap: "wrap",
        // width: "90%",
    };

    const inputRangeStyle = {
        width: "100%",
        background: "#475bd8",
    };

    const headerBottom = {
        display: "flex",
        justifyContent: "space-around",
    };

    const selectStyle = {
        padding: "8px 64px",
        borderRadius: "4px",
        marginTop: "10px",
    };

    const selectStyle2 = {
        padding: "8px 40px",
        borderRadius: "4px",
    };

    const inputStyle = {
        padding: "8px 10px",
        borderRadius: "4px",
        border: "1px solid grey",
        marginRight: "4px",
    };

    const lableFont = {
        fontSize: "12px",
    };

    const rangeLable = {
        textAlign: "start",
        margin: "0px",
    };

    const buttonDiv = {
        display: "flex",
        marginTop: "150px",
        width: "100%",
    };

    const buttonClear = {
        background: "transparent",
    };

    const buttonClearStyle = {
        border: "none",
        background: "transparent",
        color: "#475bd8",
        marginRight: "20px",
        cursor: "pointer",
    };

    const buttonFilter = {
        border: "none",
        background: "#475bd8",
        height: "36px",
        width: "96px",
        borderRadius: "18px",
        color: "white",
        marginRight: "20px",
        cursor: "pointer",
    };

    const buttonCancel = {
        background: "transparent",
        border: "none",
        cursor: "pointer",
    };

    return (
        <div style={filterDiv}>
            <div style={DivHeader}>
                <h4>Filter By</h4>
                <button style={buttonCancel}>
                    <p>X</p>
                </button>
            </div>

            <div style={headerBottom} className="headerBottom">
                <div style={{ width: "44%", margin: "10px" }} className="left">
                    <div>
                        <h4 style={rangeLable}>Amount</h4>
                        <input
                            style={inputRangeStyle}
                            type="range"
                            min="50000"
                            max="100000"
                            onChange={(e) => setAmountRange(e.target.value)}
                        />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                paddingTop: "10px",
                            }}
                        >
                            <p style={rangeLable}>₹50000</p>
                            <p style={rangeLable}>₹100000</p>
                        </div>
                    </div>

                    <div style={{ width: "325px" }}>
                        <h4 style={{ textAlign: "start", margin: "32px 8px 0px 6px" }}>
                            DPD
                        </h4>

                        {/* DPD Checkboxes */}
                        <div style={inputDivParent}>
                            {Object.keys(dpdCheckboxes).map((label) => (
                                <div style={inputDiv} key={label}>
                                    <input
                                        style={inputCheckBox}
                                        type="checkbox"
                                        checked={dpdCheckboxes[label]}
                                        onChange={() => handleDpdCheckboxChange(label)}
                                    />
                                    <label style={lableFont} htmlFor="vehicle1">
                                        {label}
                                    </label>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>
                <div style={{ width: "20%" }} className="right">
                    <input
                        placeholder="Pincode"
                        style={inputStyle}
                        type="number"
                        onChange={(e) => setPincode(e.target.value)}
                    />

                    <select
                        onChange={(e) => setSelectedFos(e.target.value)}
                        style={selectStyle}
                        name="fos"
                        id="fos"
                    >
                        <option value="fos">fos</option>
                        <option value="fos">fos</option>
                        <option value="fos">fos</option>
                        <option value="fos">fos</option>
                    </select>
                </div>
                <div style={{ padding: "0px 10px" }}>
                    <select
                        onChange={(e) => setSelectedLsmid(e.target.value)}
                        style={selectStyle2}
                        name="lsmid"
                        id="lsmid"
                    >
                        <option value="lsmid">Lms Id</option>
                        <option value="lsmid">Lms Id</option>
                        <option value="lsmid">Lms Id</option>
                        <option value="lsmid">Lms Id</option>
                    </select>
                    <div style={buttonDiv}>
                        <button style={buttonClearStyle}>Clear Filter</button>
                        <button style={buttonFilter}>Apply filters</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterComponent;

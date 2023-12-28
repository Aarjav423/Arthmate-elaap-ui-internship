import React, { useState, useEffect } from "react";
import "./UploadinputComponent.css";

const UploadinputComponent = ({ tittle, array }) => {
    const initialCheckboxes = {
        check1: false,
        check2: false,
        check3: false,
    };

    const [myInput, setMyInput] = useState(initialCheckboxes);
    const handleCheckboxChange = (id) => {
        setMyInput({
            ...myInput,
            [id]: !myInput[id],
        });
    };

    useEffect(() => {
        console.log(myInput, "myInputmyInput");
    }, [myInput]);

    return (
        <>
            <h8 className="headingStyle">{tittle}</h8>
            <div className="parentContainer">
                {array.map((checkbox) => (
                    <div className="checkBoxParent">
                        <div key={checkbox.id} className="spanParent">
                            <span className="spanStyle">{checkbox.name}</span>

                            <label htmlFor={checkbox.id} className="lableStyle">
                                upload
                            </label>
                            <input
                                type="file"
                                id={checkbox.id}
                                style={{ display: "none" }}
                                onChange={() => handleCheckboxChange(checkbox.id)}
                            />

                            {/* {checkbox.name} */}
                        </div>
                        <p className="paraStyle">PDF up to 5MB</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default UploadinputComponent;

import React, { useEffect, useLayoutEffect, useState } from "react";
import "./DoubleSlider.css";

var thumbSize = 0;

const Slider = ({
    min,
    max,
    minValue,
    maxValue,
    setMinValue,
    setMaxValue
}) => {
    const [avg, setAvg] = useState((min + max) / 2);
    const width = 400;
    const minWidth =
        thumbSize + ((avg - min) / (max - min)) * (width - 2 * thumbSize);
    const minPercent = ((minValue - min) / (avg - min)) * 100;
    const maxPercent = ((maxValue - avg) / (max - avg)) * 100;
    const styles = {
        min: {
            width: minWidth,
            left: 0,
            "--minRangePercent": `${minPercent}%`,
        },
        max: {
            width: thumbSize + ((max - avg) / (max - min)) * (width - 2 * thumbSize),
            left: minWidth,
            "--maxRangePercent": `${maxPercent}%`,
        },
    };

    useLayoutEffect(() => {
        setAvg((maxValue + minValue) / 2);
    }, [minValue, maxValue]);

    return (
        <div
            className="min-max-slider"
            data-legendnum="2"
            data-rangemin={min}
            data-rangemax={max}
            data-thumbSize={thumbSize}
            data-rangewidth={width}
        >
            <label htmlFor="min">Minimum price</label>
            <input
                id="min"
                className="min"
                style={styles.min}
                name="min"
                type="range"
                step="100"
                min={min}
                max={avg}
                value={minValue}
                onChange={({ target }) => {
                    setMinValue(Number(target.value));
                }}
            />
            <label htmlFor="max">Maximum price</label>
            <input
                id="max"
                className="max"
                style={styles.max}
                name="max"
                type="range"
                step="100"
                min={avg}
                max={max}
                value={maxValue}
                onChange={({ target }) => {
                    setMaxValue(Number(target.value));
                }}
            />
        </div>
    );
};

export default Slider;

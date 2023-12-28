import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconMenu from "./images/ActionIcon.svg"
// import CheckBoxDashIcon from "../../assets/images/CheckboxDashIcon.svg";
import "./Grid.scss";


export default function GenericTable ({ data, columns, actions }) {
  const [hoveredDiv, setHoveredDiv] = useState(null);
  const [clickedDiv, setClickedDiv] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredDiv(index);
  };

  const handleMouseLeave = () => {
    setHoveredDiv(null);
  };

  const handleClick = (index) => {
    setClickedDiv(index);
  };

  return (
    <div>
      <div className='header'>
        {actions && (
          <div className='checkbox-header'>
            {/* ... Checkbox input logic */}
          </div>
        )}
        {columns.map((column, index) => (
          <div
          key={index}
            className={
              index === 0 && !actions ? 'first-row-title' : 'title'
            }
          >
            {column.label}
          </div>
        ))}
        {actions && (
          <div className='action-head'>
            ACTION
          </div>
        )}
      </div>

      {data.map((row, rowIndex) => (
        <div
        key={rowIndex} 
          onMouseEnter={() => handleMouseEnter(rowIndex)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(rowIndex)}
          className={
            clickedDiv === rowIndex
              ? 'clicked-row'
              : hoveredDiv === rowIndex
              ? 'content-row-hovered'
              : rowIndex === data.length - 1
              ? 'content-row-last'
              : 'content-row'
          }
        >
          {actions && (
            <div key={rowIndex} className='checkbox-header'>
              {/* ... Checkbox input logic */}
            </div>
          )}
          {columns.map((column, columnIndex) => (
            <div
            key={columnIndex} 
              className={
                columnIndex === 0 && !actions
                  ? 'first-element-content-style'
                  : 'content-style'
              }
            >
              {column.format ? column.format(row) : row[column.id]}
            </div>
          ))}
          {actions && (
            <div className='action-icon'>
            <img style={{marginTop:"20px",  height:"25px"}} src={IconMenu} alt="svg" />
              {/* ... Action icon */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


GenericTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  actions: PropTypes.object
};

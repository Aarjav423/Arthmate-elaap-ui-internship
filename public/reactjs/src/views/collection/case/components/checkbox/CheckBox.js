import React from 'react'
import "./checkbox.style.css";
export default function CheckBox({onChange, checked,style={}}) {
  return (
      <input
          className='checkbox-style'
          style={{backgroundColor:"red",...style}}
          type="checkbox"
          onChange={onChange}
          checked={checked}
      />
  )
}

import './style.css'
import React from 'react'
import { Input } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import loader from '../../assets/images/dark-loader.gif'

export function CustomInput(properties){
    const placeholder = properties.placeholder;
    const onChange = properties.onChange;
    const onEnter = properties.onEnter;
    const name = properties.name;
    const value = properties.value;
    const type = properties.type;
    const cInput = 
        <input 
            className="input_1"
            type = {type} 
            placeholder = {placeholder}
            name = {name} 
            value = {value}
            onChange = { (value) => onChange(value) }
        />
    return cInput;
}


export function CustomButton(properties){
    console.log(properties)
    return (
        <button  
            className = "c_btn"
            style = {properties.dynamicStyles}
            onClick = { _ => properties.onClick()}
            disabled = {properties.status}
        >
        <span className="btn_txt"><b>{properties.name}</b></span>
        </button>
      );
}

export function CustomLoader(){
    return ( 
    <div className = "loader">
        <img className="loader-img" src={loader}/>
    </div> )
}

export function CustomToggle(properties){
}
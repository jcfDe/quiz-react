import React, { useState, useEffect } from "react";
import '../App.css'
import gifok from "../images/brent-rambo-thumbs-up.gif"
import gifno from "../images/no-donkeys.gif"
import gifLoad from "../images/image_processing20210903-11678-1a0xsu0.gif"

export default function Popup(props) {
    if (props.value === "ok") {
        return <div className="popup">
            <h1>Fuck yeah!!</h1>
            <img src={gifok} alt="Gif ok" />
        </div>
    }
    if (props.value ==="no"){
        return <div className="popup">
            <h1>Oh no!</h1>
            <img src={gifno} alt="Gif no" />
        </div>
        
    } 
    if (props.value ==="loading"){
        return <div className="popup">
            <img src={gifLoad} alt="Gif Loading" />
        </div>
        
    } else {
        return ""
    }
}
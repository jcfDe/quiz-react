import React, { useState, useEffect } from "react";
import '../App.css'


export default function Top10(props) {

   
    var top10 = props.score


    return <div className="top10">
        <div className="scoretable">
            <h2 className="top10title">Top 10 Players</h2>
            <p className="lineaH">---------------------------------------------------------------------</p>
            <div className="scorerow"><h3>Name</h3><h3>Score</h3><h3>Date</h3></div>
            <p className="lineaH">---------------------------------------------------------------------</p>
        </div>
        {top10.map((e, i) => {
            return <div className="scorerow"><h3>{e.user}</h3><p>{e.score}</p><p>{e.date}</p></div>
        })}
    </div>

}
import React from 'react';
import { useState } from "react";
import { getAllSpots } from "../../store/spot";
import { useDispatch } from "react-redux";
import SpotIndexItem from "../SpotIndexItem";

const SpotsIndex = ({ spots }) => {
  return (<>
    <h3>SpotsIndex</h3>
    {spots.map(spot => {
      return (
        <SpotIndexItem spot={spot} />
      )
    })}
  </>)
}

export default SpotsIndex;
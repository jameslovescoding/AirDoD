import React from 'react';
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { getAllSpots } from "../../store/spot";
import { useDispatch } from "react-redux";

const SpotIndexItem = ({ spot }) => {
  const history = useHistory();

  const handleClickOnTile = (e) => {
    console.log(spot.id);
    //history.push()
  };

  return (<>
    <h4>SpotIndexItem</h4>
    <div onClick={handleClickOnTile}>
      <img src={`${spot.previewImage}`} />
      <div>
        <p>{spot.city}, {spot.state}</p>
        <p>{spot.avgRating}</p>
      </div>
      <p>${spot.price} per night</p>
    </div>


  </>)
}

export default SpotIndexItem;
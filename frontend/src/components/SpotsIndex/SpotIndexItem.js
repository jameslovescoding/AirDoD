import React from 'react';
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { getAllSpots } from "../../store/spot";
import { useDispatch } from "react-redux";

const SpotIndexItem = ({ spot }) => {
  const history = useHistory();

  const handleClickOnTile = (e) => {
    const url = `/spots/${spot.id}`;
    history.push(url);
  };

  return (<>
    <div onClick={handleClickOnTile} className='spot-index-item-tile'>
      <img
        src={`${spot.previewImage}`}
        className='spot-index-item-tile-preview-img'
        alt={`${spot.previewImage}`}
      />
      <div className='spot-index-item-tile-location-and-rating'>
        <p>{spot.city}, {spot.state}</p>
        <p>
          <span>
            <i className="fa-solid fa-star"></i>
          </span> {spot.avgRating || "New"}
        </p>
      </div>
      <p>
        <span className='spot-index-item-tile-price'>
          ${spot.price}
        </span> /night
      </p>
    </div>
  </>)
}

export default SpotIndexItem;
import React from 'react';
import { useHistory } from "react-router-dom";

const SpotIndexItem = ({ spot }) => {
  const history = useHistory();

  const handleClickOnTile = (e) => {
    const url = `/spots/${spot.id}`;
    history.push(url);
  };

  return (<>
    <div onClick={handleClickOnTile} className='spot-tile pointer hover-shadow tooltip-container'>
      <span className='tooltip-text'>{spot.name}</span>
      <img className='spot-tile-image' src={`${spot.previewImage}`} alt={`${spot.previewImage}`} />
      <div className='spot-tile-info'>
        <div className='spot-tile-info-first-line'>
          <p>{spot.city}, {spot.state}</p>
          <p><span><i className="fa-solid fa-star"></i></span> {spot.avgRating || "New"}</p>
        </div>
        <p><span className='spot-tile-price'>${spot.price}</span> / night</p>
      </div>

    </div>
  </>)
}

export default SpotIndexItem;
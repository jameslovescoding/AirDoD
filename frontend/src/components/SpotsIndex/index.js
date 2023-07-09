import React from 'react';
import SpotIndexItem from "./SpotIndexItem";
import './SpotsIndex.css';

const SpotsIndex = ({ spots }) => {
  return (<div className='spot-tile-container'>
    {spots.map(spot => {
      return (
        <SpotIndexItem key={spot.id} spot={spot} />
      )
    })}
  </div>)
}

export default SpotsIndex;
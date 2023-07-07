import React from 'react';
import SpotIndexItem from "./SpotIndexItem";

const SpotsIndex = ({ spots }) => {
  return (<>
    {spots.map(spot => {
      return (
        <SpotIndexItem key={spot.id} spot={spot} />
      )
    })}
  </>)
}

export default SpotsIndex;
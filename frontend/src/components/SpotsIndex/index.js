import React from 'react';
import SpotIndexItem from "./SpotIndexItem";

const SpotsIndex = ({ spots }) => {
  return (<>
    {spots.map(spot => {
      return (
        <SpotIndexItem spot={spot} />
      )
    })}
  </>)
}

export default SpotsIndex;
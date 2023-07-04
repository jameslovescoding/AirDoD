import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpotById } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";

const SpotShow = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const currentSpot = useSelector(state => state.spots.singleSpot);

  useEffect(() => {
    dispatch(getSpotById(spotId))
      .then(setIsLoaded(true));
  }, [dispatch]);

  const handleReserveButtonPress = (e) => {
    alert("Feature Coming Soon...")
  }
  return (isLoaded && <>
    <h2>{currentSpot.name}</h2>
    <p>{currentSpot.city}, {currentSpot.state}, {currentSpot.country}</p>
    <div>
      {currentSpot.SpotImages.map(imgObj => {
        return (<img src={imgObj.url} />)
      })}
    </div>
    <div>
      <div>
        <h3>Hosted by {currentSpot.Owner.firstName} {currentSpot.Owner.lastName}</h3>
        <p>{currentSpot.description}</p>
      </div>
      <div>
        <div>
          <div>
            <p><span>${currentSpot.price}</span> night</p>
            <p><span><i class="fa-solid fa-star"></i></span> {currentSpot.avgStarRating || "no rating available"}</p>
            <p>{currentSpot.numReviews} reviews</p>
          </div>
          <button onClick={handleReserveButtonPress}>Reserve</button>
        </div>
      </div>
    </div >
    <div>

    </div>
  </>)
}

export default SpotShow;
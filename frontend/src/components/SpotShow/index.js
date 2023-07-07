import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpotById } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import ReviewsIndex from "../ReviewsIndex";
import ReviewStats from "./ReviewStats";

const SpotShow = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const currentSpot = useSelector(state => state.spots.singleSpot);
  const {
    name,
    city,
    state,
    country,
    Owner: owner,
    description,
    price,
    avgStarRating,
    numReviews,
    ownerId
  } = currentSpot;

  useEffect(() => {
    dispatch(getSpotById(spotId)).then(() => setIsLoaded(true))
  }, [dispatch]);

  const handleReserveButtonPress = (e) => {
    alert("Feature Coming Soon...")
  }

  return (isLoaded && <>
    <h2>{name}</h2>
    <p>{city}, {state}, {country}</p>
    <div>
      {currentSpot.SpotImages.map(imgObj => {
        return (<img key={imgObj.url} src={imgObj.url} alt={imgObj.url} />)
      })}
    </div>
    <div>
      <div>
        <h3>Hosted by {owner.firstName} {owner.lastName}</h3>
        <p>{description}</p>
      </div>
      <div>
        <div>
          <div>
            <p><span>${price}</span> night</p>
            <ReviewStats
              avgStarRating={avgStarRating}
              numReviews={numReviews}
            />
          </div>
          <button onClick={handleReserveButtonPress}>Reserve</button>
        </div>
      </div>
    </div >
    <hr />
    <div>
      <ReviewStats
        avgStarRating={avgStarRating}
        numReviews={numReviews}
      />
    </div>
    <div>
      <ReviewsIndex spotName={name} spotId={spotId} ownerId={ownerId} numReviews={numReviews} />
    </div>
  </>)


}

export default SpotShow;

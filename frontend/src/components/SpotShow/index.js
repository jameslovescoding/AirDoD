import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpotById } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import ReviewsIndex from "../ReviewsIndex";
import ReviewStats from "./ReviewStats";
import './SpotShow.css';

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

  return (isLoaded && <div className='spot-show'>
    <h2>{name}</h2>
    <p>{city}, {state}, {country}</p>
    <div className='spot-show-images'>
      {currentSpot.SpotImages.map(imgObj => {
        return (<img className='spot-show-image' key={imgObj.url} src={imgObj.url} alt={imgObj.url} />)
      })}
    </div>
    <div className='spot-show-info'>
      <div className='spot-show-description'>
        <h3>Hosted by {owner.firstName} {owner.lastName}</h3>
        <p>{description}</p>
      </div>
      <div className='spot-show-order'>
        <div className='spot-show-card'>
          <div className='spot-show-card-first-line'>
            <p><span className='spot-show-price'>${price}</span> / night</p>
            <div className='review-stats-card'>
              <ReviewStats
                avgStarRating={avgStarRating}
                numReviews={numReviews}
              />
            </div>
          </div>
          <button onClick={handleReserveButtonPress}>Reserve</button>
        </div>
      </div>
    </div >
    <hr className='spot-show-hr' />
    <div className='review-stats-reviews'>
      <ReviewStats
        avgStarRating={avgStarRating}
        numReviews={numReviews}
      />
    </div>
    <div>
      <ReviewsIndex spotName={name} spotId={spotId} ownerId={ownerId} numReviews={numReviews} />
    </div>
  </div>)


}

export default SpotShow;

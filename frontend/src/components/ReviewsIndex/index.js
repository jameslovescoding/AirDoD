import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReviewsOfSpot } from '../../store/review';
import ReviewItem from './ReviewItem';
import OpenModalButton from '../OpenModalButton';
import CreateReviewForm from '../CreateReviewForm';

const ReviewsIndex = ({ spotName, spotId, ownerId: spotOwnerId, numReviews }) => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [enablePostReview, setEnablePostReview] = useState(false);
  const reviews = useSelector(state => state.reviews.spot);
  const sessionUser = useSelector(state => state.session.user); // get userId

  useEffect(() => {
    dispatch(getAllReviewsOfSpot(spotId)).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    // don't show post review button for visitors
    if (sessionUser === null) {
      setEnablePostReview(false);
      return
    }
    // spot owner can not post review on his own spot
    if (spotOwnerId === sessionUser.id) {
      setEnablePostReview(false);
      return
    }
    // hide button if user has already posted a review on this spot
    for (const review of Object.values(reviews)) {
      if (review.User.id === sessionUser.id) {
        setEnablePostReview(false);
        return
      }
    }
    setEnablePostReview(true);
  }, [spotOwnerId, sessionUser, reviews])

  return (isLoaded && <>
    <div>
      {enablePostReview && <div>
        <OpenModalButton
          buttonText="Post Your Review"
          modalComponent={<CreateReviewForm spotId={spotId} />}
        />
        {numReviews === 0 && <p>Be the first to post a review!</p>}
      </div>}
      {Object.values(reviews).sort((a, b) => b.id - a.id).map(review => {
        return (<ReviewItem key={review.id} review={review} spotId={spotId} spotName={spotName} />)
      })}
    </div>
  </>);
}

export default ReviewsIndex;
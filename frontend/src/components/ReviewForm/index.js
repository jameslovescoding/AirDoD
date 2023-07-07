import React, { useEffect } from 'react';
import { useState } from 'react';
import StarsInput from './StarsInput';
import { useDispatch } from 'react-redux';
import { createReviewForSpot, getAllReviewsOfSpot } from '../../store/review';
import { getSpotById } from '../../store/spot';
import { useModal } from '../../context/Modal';

const ReviewForm = ({ review, spotId, formType }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [content, setContent] = useState(review.review);
  const [stars, setStars] = useState(review.stars);
  const [disableButton, setDisableButton] = useState(true);

  const handleFormOnSubmit = async (e) => {
    e.preventDefault();
    const newReview = {
      review: content,
      stars: stars,
    }
    const response = await dispatch(createReviewForSpot(spotId, newReview));
    if (response.ok) {
      await dispatch(getSpotById(spotId));
      await dispatch(getAllReviewsOfSpot(spotId));
      closeModal();
    }
  }

  useEffect(() => {
    if (content.length >= 10 && stars > 0) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [content, stars])

  return (<>
    <form onSubmit={handleFormOnSubmit}>
      <h2>How was your stay?</h2>
      <textarea
        value={content}
        placeholder='Leave your review here..'
        onChange={(e) => setContent(e.target.value)}
      />
      <StarsInput stars={stars} setStars={setStars} />
      <input type='submit' value='Submit Your Review' disabled={disableButton} />
    </form>
  </>)
}

export default ReviewForm;
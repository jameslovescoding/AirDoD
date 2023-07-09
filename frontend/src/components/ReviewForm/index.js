import React, { useEffect } from 'react';
import { useState } from 'react';
import StarsInput from './StarsInput';
import { useDispatch } from 'react-redux';
import { createReviewForSpot, editReviewById, getAllReviewsOfSpot, getAllReviewsOfCurrentUser } from '../../store/review';
import { getSpotById } from '../../store/spot';
import { useModal } from '../../context/Modal';

const ReviewForm = ({ review, spotId, spotName, formType, updateType }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [content, setContent] = useState(review.review);
  const [stars, setStars] = useState(review.stars);
  const [disableButton, setDisableButton] = useState(true);
  const [error, setError] = useState(null);
  const buttonText = formType === "create" ? "Submit Your Review" : "Update Your Review";

  const handleFormOnSubmit = async (e) => {
    e.preventDefault();
    const newReview = {
      review: content,
      stars: stars,
    }
    if (formType === "create") {
      const response = await dispatch(createReviewForSpot(spotId, newReview));
      if (response.ok) {
        await dispatch(getSpotById(spotId));
        await dispatch(getAllReviewsOfSpot(spotId));
        closeModal();
      } else {
        const resJSON = await response.json();
        //console.log(resJSON.message);
        setError(resJSON.message);
      }
    } else if (formType === "update") {
      const response = await dispatch(editReviewById(review.id, newReview));
      if (response.ok) {
        if (updateType === "spot") {
          await dispatch(getSpotById(spotId));
          await dispatch(getAllReviewsOfSpot(spotId));
        } else if (updateType === "user") {
          await dispatch(getAllReviewsOfCurrentUser());
        }
        closeModal();
      } else {
        const resJSON = await response.json();
        //console.log(resJSON.message);
        setError(resJSON.message);
      }
    }
  }

  useEffect(() => {
    if (content.length >= 10 && stars > 0) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [content, stars])

  return (<div className='review-modal'>
    {formType === "create" && <h2 className='review-modal-heading'>How was your stay?</h2>}
    {formType === "update" && (<>
      <h2 className='review-modal-heading'>How was your stay at "{spotName}"?</h2>
    </>)}
    <form className="review-modal-form" onSubmit={handleFormOnSubmit}>
      {error && <p className='review-error'>{error}</p>}
      <textarea
        value={content}
        placeholder='Leave your review here..'
        onChange={(e) => setContent(e.target.value)}
        maxlength="500"
      />
      <p>{content.length} / 500</p>
      <StarsInput stars={stars} setStars={setStars} />
      <input type='submit' value={buttonText} disabled={disableButton} />
    </form>
  </div>)
}

export default ReviewForm;
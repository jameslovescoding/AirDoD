import React from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { deleteReviewById, getAllReviewsOfSpot, getAllReviewsOfCurrentUser } from '../../store/review';
import { getSpotById } from '../../store/spot';

const DeleteReviewModal = ({ review, spotId, updateType }) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleYesButtonClick = async () => {
    const response = await dispatch(deleteReviewById(review.id));
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
      console.log(resJSON.message);
    }
  };

  const handleNoButtonClick = () => {
    closeModal();
  };

  return (<div className='delete-modal'>
    <h2 className='review-modal-heading'>Confirm Delete</h2>
    <p>Are you sure you want to delete this review?</p>
    <div className='delete-modal-buttons'>
      <button className="delete-button delete-yes" onClick={handleYesButtonClick}>Yes (Delete Review)</button>
      <button className="delete-button delete-no" onClick={handleNoButtonClick}>No (Keep Review)</button>
    </div>
  </div>)
}

export default DeleteReviewModal;
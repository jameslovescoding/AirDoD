import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import DeleteReviewModal from './DeleteReviewModal';
import EditReviewForm from "../EditReviewForm";

const ReviewItem = ({ review, spotId, spotName }) => {
  const firstName = review.User.firstName;
  const date = review.createdAt.split("T")[0];
  const content = review.review;
  const [enableManageButton, setEnableManageButton] = useState(false);
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    if (sessionUser) {
      if (review.userId === sessionUser.id) {
        setEnableManageButton(true);
        return;
      }
    }
    setEnableManageButton(false);
  }, [review, sessionUser]);

  return (<div className="review-item">
    <div className="review-content">
      <h4 className="review-content-name">{firstName}</h4>
      <p className="review-content-date">{date}</p>
      <p>{content}</p>
    </div>
    {enableManageButton && <div className="review-item-buttons">
      <OpenModalButton
        buttonText="Update"
        modalComponent={<EditReviewForm review={review} spotId={spotId} spotName={spotName} updateType="spot" />}
      />
      <OpenModalButton
        buttonText="Delete"
        modalComponent={<DeleteReviewModal review={review} spotId={spotId} updateType="spot" />}
      />
    </div>}
  </div>)
}

export default ReviewItem;
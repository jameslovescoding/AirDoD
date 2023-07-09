import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import DeleteReviewModal from './DeleteReviewModal';
import EditReviewForm from "../EditReviewForm";

const ReviewItem = ({ review, spotId, spotName }) => {
  const monthConverter = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
  }

  const firstName = review.User.firstName;
  const fullDate = review.createdAt.split("T")[0];
  const [year, month, _day] = fullDate.split("-");
  const date = `${monthConverter[month]} ${year}`;
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
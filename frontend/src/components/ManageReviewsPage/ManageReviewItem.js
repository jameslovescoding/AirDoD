import React from "react";
import OpenModalButton from "../OpenModalButton";
import EditReviewForm from '../EditReviewForm';
import DeleteReviewModal from '../ReviewsIndex/DeleteReviewModal';

const ManageReviewItem = ({ review }) => {
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

  const spotName = review.Spot.name;
  const spotId = review.spotId;
  const fullDate = review.createdAt.split("T")[0];
  const [year, month, _day] = fullDate.split("-");
  const date = `${monthConverter[month]} ${year}`;
  const content = review.review;
  return (<div className="review-item">
    <div className="review-content">
      <h4 className="review-content-name">{spotName}</h4>
      <p className="review-content-date">{date}</p>
      <p>{content}</p>
    </div>
    <div className="review-item-buttons">
      <OpenModalButton
        buttonText="Update"
        modalComponent={<EditReviewForm review={review} spotId={spotId} spotName={spotName} updateType="user" />}
      />
      <OpenModalButton
        buttonText="Delete"
        modalComponent={<DeleteReviewModal review={review} spotId={spotId} updateType="user" />}
      />
    </div>
  </div>)
}

export default ManageReviewItem;
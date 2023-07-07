import React from "react";
import OpenModalButton from "../OpenModalButton";
import EditReviewForm from '../EditReviewForm';
import DeleteReviewModal from '../ReviewsIndex/DeleteReviewModal';

const ManageReviewItem = ({ review }) => {
  const spotName = review.Spot.name;
  const spotId = review.spotId;
  const date = review.createdAt.split("T")[0];
  const content = review.review;
  return (<div>
    <div>
      <h4>{spotName}</h4>
      <p>{date}</p>
      <p>{content}</p>
    </div>
    <div>
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
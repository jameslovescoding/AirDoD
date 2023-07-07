import React from 'react';
import ReviewForm from '../ReviewForm';

const EditReviewForm = ({ review, spotId, spotName, updateType }) => {
  return (<>
    <ReviewForm review={review} spotId={spotId} spotName={spotName} formType="update" updateType={updateType} />
  </>)
}

export default EditReviewForm;
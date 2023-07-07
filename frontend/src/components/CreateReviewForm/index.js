import React from 'react';
import ReviewForm from '../ReviewForm';

const CreateReviewForm = ({ spotId }) => {
  const review = {
    "review": "",
    "stars": 0,
  }
  return (<>
    <ReviewForm review={review} spotId={spotId} formType="create" />
  </>)
}

export default CreateReviewForm;
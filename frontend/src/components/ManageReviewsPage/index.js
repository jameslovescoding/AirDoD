import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReviewsOfCurrentUser } from '../../store/review';
import ManageReviewItem from './ManageReviewItem';

const ManageReviewsPage = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const reviews = useSelector(state => state.reviews.user);

  useEffect(() => {
    dispatch(getAllReviewsOfCurrentUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (<div className='manage-reviews-page'>
    <h2>Manage Reviews</h2>
    {isLoaded && <div>
      {Object.values(reviews).sort((a, b) => b.id - a.id).map(review => {
        return (<ManageReviewItem review={review} />)
      })}
    </div>}
  </div>)
}

export default ManageReviewsPage;
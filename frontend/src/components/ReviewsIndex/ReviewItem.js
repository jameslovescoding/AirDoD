import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

const ReviewItem = ({ review }) => {
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

  return (<div>
    <div>
      <h4>{firstName}</h4>
      <p>{date}</p>
      <p>{content}</p>
    </div>
    {enableManageButton && <div>
      <button>Update</button>
      <button>Delete</button>
    </div>}
  </div>)
}

export default ReviewItem;
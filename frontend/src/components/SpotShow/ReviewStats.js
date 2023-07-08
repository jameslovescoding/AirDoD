import React from "react";

const ReviewStats = ({ avgStarRating, numReviews }) => {
  if (numReviews === 0 || numReviews === "0") {
    return (< >
      <p><span><i className="fa-solid fa-star"></i></span> New</p>
    </>);
  }
  if (numReviews === 1 || numReviews === "1") {
    return (<>
      <p><span><i className="fa-solid fa-star"></i></span> {avgStarRating}</p>
      <p>{numReviews} review</p>
    </>)
  }
  return (<>
    <p><span><i className="fa-solid fa-star"></i></span> {avgStarRating}</p>
    <p>{numReviews} reviews</p>
  </>)
}

export default ReviewStats;
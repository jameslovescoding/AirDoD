import React from "react";

const ReviewStats = ({ avgStarRating, numReviews }) => {
  if (numReviews === 0 || numReviews === "0") {
    return (<div>
      <p><span><i className="fa-solid fa-star"></i></span> New</p>
    </div>);
  }
  if (numReviews === 1 || numReviews === "1") {
    return (<div>
      <p><span><i className="fa-solid fa-star"></i></span> {avgStarRating}</p>
      <p>{numReviews} review</p>
    </div>)
  }
  return (<div>
    <p><span><i className="fa-solid fa-star"></i></span> {avgStarRating}</p>
    <p>{numReviews} reviews</p>
  </div>)
}

export default ReviewStats;
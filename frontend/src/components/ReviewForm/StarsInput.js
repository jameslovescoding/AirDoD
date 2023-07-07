import React from "react";
import { useState } from "react";

const StarsInput = ({ stars, setStars }) => {
  // store the temperary stars durin the hover
  const [hoverStars, setHoverStars] = useState(stars);
  const ratings = [1, 2, 3, 4, 5];
  return (<div>
    {ratings.map(rating => {
      return (<i
        className={`fa-${hoverStars >= rating ? "solid" : "regular"} fa-star`}
        onClick={() => setStars(hoverStars)}
        onMouseEnter={() => setHoverStars(rating)}
        onMouseLeave={() => setHoverStars(stars)}
      ></i>);
    })}
  </div>);
}

export default StarsInput;
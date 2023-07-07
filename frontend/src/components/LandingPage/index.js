import React from 'react';
import { useEffect, useState } from "react";
import { getAllSpots } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import SpotsIndex from '../SpotsIndex';

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector(state => Object.values(state.spots.allSpots));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getAllSpots()).then(() => setIsLoaded(true))
  }, [dispatch]);

  return (isLoaded && <>
    <div>
      <SpotsIndex spots={spots} />
    </div>
  </>)
}

export default LandingPage;
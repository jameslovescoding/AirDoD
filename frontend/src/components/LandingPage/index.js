import React from 'react';
import { useEffect, useState } from "react";
import { getAllSpots } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import SpotsIndex from '../SpotsIndex';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const spots = useSelector(state => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(getAllSpots())
      .then(setIsLoaded(true));
  }, [dispatch]);

  return (<>
    <h2>LandingPage</h2>
    {isLoaded && <SpotsIndex spots={spots} />}
  </>)
}

export default LandingPage;
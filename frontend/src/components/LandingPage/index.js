import React from 'react';
import { useEffect, useState } from "react";
import { getAllSpots } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import SpotsIndex from '../SpotsIndex';

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector(state => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch]);

  if (!Object.keys(spots).length) {
    return (<>
      <h2>Loading spot</h2>
    </>)
  }

  return (<>
    <SpotsIndex spots={spots} />
  </>)
}

export default LandingPage;
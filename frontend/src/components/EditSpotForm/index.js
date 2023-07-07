import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpotById } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import SpotForm from '../SpotForm';

const EditSpotForm = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const spot = useSelector(state => state.spots.singleSpot);

  useEffect(() => {
    dispatch(getSpotById(spotId)).then(() => setIsLoaded(true))
  }, [dispatch]);

  return (<>
    <h2>Update your spot</h2>
    {isLoaded && <SpotForm spot={spot} formType="update" />}
  </>)
}

export default EditSpotForm;
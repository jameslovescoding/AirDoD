import React from 'react';
import { useState } from "react";
import { getAllSpots } from "../../store/spot";
import { useDispatch } from "react-redux";
import SpotForm from '../SpotForm';

const CreateSpotForm = () => {
  return (<>
    <h2>CreateSpotForm</h2>
    <SpotForm spot={spot} />
  </>)
}

export default CreateSpotForm;
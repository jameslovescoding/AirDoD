import React from 'react';
import { useState } from "react";
import { getAllSpots } from "../../store/spot";
import { useDispatch } from "react-redux";
import SpotForm from '../SpotForm';

const CreateSpotForm = () => {
  const spot = {
    "address": "",
    "city": "",
    "state": "",
    "country": "",
    "lat": 37.7645358,
    "lng": -122.4730327,
    "name": "",
    "description": "",
    "price": 0
  };

  return (<>
    <h2>Create a new Spot</h2>
    <SpotForm spot={spot} formType="create-spot-form" />
  </>)
}

export default CreateSpotForm;
import React from 'react';
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

  return (<div className='spot-form-page'>
    <h1>Create a new Spot</h1>
    <SpotForm spot={spot} formType="create" />
  </div>)
}

export default CreateSpotForm;
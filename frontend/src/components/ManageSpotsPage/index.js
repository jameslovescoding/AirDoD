import React from 'react';
import { useEffect, useState } from "react";
import { getAllSpots } from "../../store/spot";
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsForCurrentUser } from '../../store/spot';
import ManageSpotItem from './ManageSpotItem';
import "./ManageSpotsPage.css";

const ManageSpotsPage = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const spots = useSelector(state => Object.values(state.spots.allSpots));
  const [isLoaded, setIsLoaded] = useState(false);
  const history = useHistory();

  useEffect(() => {
    dispatch(getAllSpotsForCurrentUser()).then(() => setIsLoaded(true))
  }, [dispatch]);

  const handleCreateButtonClick = (e) => {
    // Redirect to create new spot form
    history.push("/spots/new");
  };

  return (sessionUser && <>
    <div className='manage-spot-title-section'>
      <h2>Manage Spots</h2>
      <button className="create-spot-button hover-shadow" onClick={handleCreateButtonClick}>Create a New Spot</button>
    </div>
    {isLoaded && <div className='spot-tile-container'>
      {spots.map(spot => {
        return (
          <ManageSpotItem spot={spot} />
        )
      })}
    </div>}
  </>)
}

export default ManageSpotsPage;
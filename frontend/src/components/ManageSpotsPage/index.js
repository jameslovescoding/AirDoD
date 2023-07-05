import React from 'react';
import { useEffect, useState } from "react";
import { getAllSpots } from "../../store/spot";
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsForCurrentUser } from '../../store/spot';
import ManageSpotItem from './ManageSpotItem';

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
    <h2>Manage Spots</h2>
    <button onClick={handleCreateButtonClick}>Create a New Spot</button>
    {isLoaded && <div>
      {spots.map(spot => {
        return (
          <ManageSpotItem spot={spot} />
        )
      })}
    </div>}
  </>)
}

export default ManageSpotsPage;
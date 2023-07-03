import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from "./components/Navigation";
import SpotIndex from "./components/SpotIndex";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    isLoaded && (<>
      <Navigation isLoaded={isLoaded} />
      <SpotIndex />
    </>
    )
  );
}

export default App;

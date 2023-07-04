import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from "./components/Navigation";
import SpotsIndex from "./components/SpotsIndex";
import SpotShow from './components/SpotShow';
import LandingPage from './components/LandingPage';
import CreateSpotForm from './components/CreateSpotForm';
import ManageSpotsPage from './components/ManageSpotsPage';
import EditSpotForm from './components/EditSpotForm';
import ManageReviewsPage from './components/ManageReviewsPage';

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
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/spots/new">
          <CreateSpotForm />
        </Route>
        <Route path="/spots/current">
          <ManageSpotsPage />
        </Route>
        <Route path="/spots/:id/edit">
          <EditSpotForm />
        </Route>
        <Route path="/spots/:id">
          <SpotShow />
        </Route>
        <Route path="/reviews/current">
          <ManageReviewsPage />
        </Route>
      </Switch>
    </>
    )
  );
}

export default App;

import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import iconSrc from './favicon.png';
import './Navigation.css';

function Navigation({ isLoaded }) {

  const history = useHistory();

  const sessionUser = useSelector(state => state.session.user);

  return (<>
    <div className='nav-bar'>
      <NavLink className="home-icon-assembly" to="/"><img className="home-icon" src={iconSrc} />AirDoD</NavLink>
      <div className='right-section'>{isLoaded && (
        <>
          {sessionUser &&
            <NavLink className="create-new-spot" to="/spots/new">Create a New Spot</NavLink>
          }
          <ProfileButton user={sessionUser} />
        </>
      )}</div>
    </div>
  </>

  );
}

export default Navigation;
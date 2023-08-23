import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import iconSrc from './favicon.png';
import './Navigation.css';
import DeveloperInfo from '../Footer';
import OpenModalButton from '../OpenModalButton';
import OpenModalMenuItem from './OpenModalMenuItem';

function Navigation({ isLoaded }) {

  const history = useHistory();

  const sessionUser = useSelector(state => state.session.user);

  return (<>
    <div className='nav-bar'>
      <NavLink className="home-icon-assembly" to="/"><img className="home-icon" src={iconSrc} />AirDoD</NavLink>
      <OpenModalMenuItem
        itemText={"About This Website"}
        modalComponent={<DeveloperInfo />}
      />
      <div className='right-section'>{isLoaded && (
        <>
          {sessionUser &&
            <NavLink className="create-new-spot hover-shadow" to="/spots/new">Create a New Spot</NavLink>
          }
          <ProfileButton user={sessionUser} />
        </>
      )}</div>
    </div>
  </>

  );
}

export default Navigation;
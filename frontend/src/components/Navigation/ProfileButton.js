// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';
import './Navigation.css';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    // if showMenu is true, nothing happens
    if (showMenu) return;
    // if showMenu is false, set showMenu to true
    setShowMenu(true);
  };

  // when showMenu status changes
  useEffect(() => {
    //console.log('show menu triggered', showMenu);
    // if showMenu is false, do nothing
    if (!showMenu) return;
    // if showMenu is true, add event listener to whole document
    const closeMenu = (e) => {
      // check if the click comes from outside of the icon
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    // when click, set showMenu to false
    document.addEventListener('click', closeMenu);
    // return a clean up function for the event listener
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  // handleLogout
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push(`/`);
    closeMenu();
  };

  const handleManageSpots = (e) => {
    e.preventDefault();
    history.push(`/spots/current`);
    closeMenu();
  }

  const handleManageReviews = (e) => {
    e.preventDefault();
    history.push(`/reviews/current`);
    closeMenu();
  }

  // use .hidden class and display: none in css to hide the ul
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div>
      <button className="profile-button hover-shadow" onClick={openMenu}>
        <i class="fa-solid fa-bars"></i>
        <i class="fa-regular fa-circle-user fa-2x"></i>
      </button>
      {user ? (
        <div className={ulClassName} ref={ulRef}>
          <div className="profile-dropdown-user-info">
            <p>Hello, {user.firstName}!</p>
            <p>{user.email}</p>
          </div>
          <hr />
          <div className="profile-dropdown-buttons">
            <button className="profile-dropdown-button hover-outline" onClick={handleManageSpots}>Manage Spots</button>
            <button className="profile-dropdown-button hover-outline" onClick={handleManageReviews}>Manage Reviews</button>
            <button className="log-out-button hover-shadow" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      ) : (
        <div className={ulClassName} ref={ulRef}>
          <OpenModalMenuItem
            itemText="Log In"
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />
          <hr></hr>
          <OpenModalMenuItem
            itemText="Sign Up"
            onItemClick={closeMenu}
            modalComponent={<SignupFormModal />}
          />
        </div>
      )}
    </div>
  );
}

export default ProfileButton;
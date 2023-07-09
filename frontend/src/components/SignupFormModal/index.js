// frontend/src/components/SignupFormPage/index.js
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";
import "./SignupForm.css";


function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disableButton, setDisableButton] = useState(true);

  useEffect(() => {
    if (!email || username.length < 4 || !firstName || !lastName || password.length < 6 || confirmPassword.length < 6) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [email, username, firstName, lastName, password, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      const response = await dispatch(sessionActions.signup({ email, username, firstName, lastName, password, }))
      if (response.ok) {
        closeModal();
      } else {
        const data = await response.json();
        setErrors(data.errors);
      }
    } else {
      setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field"
      });
    }
  };

  const enterDemoUserInfo = () => {
    setEmail("jack@gmail.com");
    setUsername("jackAlwaysWin");
    setFirstName("Jack");
    setLastName("Smith");
    setPassword("123ggg");
    setConfirmPassword("123ggg");
  };

  const clearDemoInput = () => {
    setEmail("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  }



  return (
    <div className="user-modal">
      <h1 className="user-modal-heading">Sign Up</h1>
      <form className="user-modal-form" onSubmit={handleSubmit}>
        <label for="sign-up-email">Email</label>
        <input
          id="sign-up-email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
        <label for="sign-up-username">Username</label>
        <input
          id="sign-up-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {errors.username && <p className="error-message">{errors.username}</p>}
        <label for="sign-up-first-name">First Name</label>
        <input
          id="sign-up-first-name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        <label for="sign-up-last-name">Last Name</label>
        <input
          id="sign-up-last-name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        <label for="sign-up-password">Password</label>
        <input
          id="sign-up-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
        <label for="sign-up-confirm-password">Confirm Password</label>
        <input
          id="sign-up-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        <input type="submit" value="Sign Up" disabled={disableButton} />
      </form>
      <div className="dev-buttons">
        <button onClick={enterDemoUserInfo}>Demo User</button>
        <button onClick={clearDemoInput}>Clear Form</button>
      </div>
    </div>
  );
}

export default SignupFormModal;
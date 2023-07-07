import { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import "./LoginForm.css";

const LoginFormModal = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disableButton, setDisableButton] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const response = await dispatch(sessionActions.login({ credential, password }))
    if (response.ok) {
      closeModal();
      history.push("/");
    } else {
      const data = await response.json();
      setErrors(data.errors);
    }
  }

  useEffect(() => {
    if (credential.length >= 4 && password.length >= 6) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [credential, password])

  const handleSubmitDemoUser = async () => {
    const response = await dispatch(sessionActions.login({
      "credential": "AliceLee123",
      "password": "password1"
    }));
    if (response.ok) {
      closeModal();
    } else {
      const data = await response.json();
      setErrors(data.errors);
    }
  }

  const handleSubmitDemoUser2 = async () => {
    const response = await dispatch(sessionActions.login({
      "credential": "BobSmith877",
      "password": "password2"
    }));
    if (response.ok) {
      closeModal();
    } else {
      const data = await response.json();
      setErrors(data.errors);
    }
  }

  return (<>
    <h1>Log In</h1>
    <form onSubmit={handleSubmit}>
      <label>
        Username or Email
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {errors.invalidCredentials && <p>{errors.invalidCredentials}</p>}
      {errors.credential && <p>{errors.credential}</p>}
      {errors.password && <p>{errors.password}</p>}
      <input type="submit" value="Login" disabled={disableButton} />
    </form>
    <button onClick={handleSubmitDemoUser}>Demo User Alice</button>
    <button onClick={handleSubmitDemoUser2}>Demo User Bob</button>
  </>)
}

export default LoginFormModal;
import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal';
import "./LoginForm.css";

const LoginFormModal = () => {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const response = await dispatch(sessionActions.login({ credential, password }))
    if (response.ok) {
      closeModal();
    } else {
      const data = await response.json();
      setErrors(data.errors);
    }
  }

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
      <button type="submit">Log In</button>
    </form>
    <button onClick={handleSubmitDemoUser}>Demo User</button>
  </>)
}

export default LoginFormModal;
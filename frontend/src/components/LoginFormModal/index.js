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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        setErrors(data.errors);
      });
  }

  const handleSubmitDemoUser = () => {
    return dispatch(sessionActions.login({
      "credential": "AliceLee123",
      "password": "password1"
    }))
      .then(closeModal)
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
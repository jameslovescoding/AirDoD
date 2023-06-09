import { csrfFetch } from "./csrf";

// constant for the reducer

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

// action creator

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
}

const removeUser = () => {
  return {
    type: REMOVE_USER,
  }
}

// thunk action creator

// login user
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
  }
  return response;
}

// restore user from token
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// sign up user
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
  }
  return response;
};

// logout
export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  if (response.ok) {
    dispatch(removeUser());
  }
  return response;
};

// session reducer

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      const newState = { ...state };
      newState.user = action.payload;
      return newState;
    }
    case REMOVE_USER: {
      const newState = { ...state };
      newState.user = null;
      return newState;
    }
    default:
      return state;
  }
}

export default sessionReducer;

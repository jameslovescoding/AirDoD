import { csrfFetch } from "./csrf";

// constant for the reducer

const SET_SPOT = "reviews/setSpot";

const SET_USER = "reviews/setUser";

// action creator

const setSpot = (reviews) => {
  return {
    type: SET_SPOT,
    payload: reviews,
  }
}

const setUser = (reviews) => {
  return {
    type: SET_USER,
    payload: reviews,
  }
}

// thunk action creator

// 3-1 Get all Reviews of the Current User
export const getAllReviewsOfCurrentUser = () => async (dispatch) => {
  const url = "/api/reviews/current";
  const response = await csrfFetch(url);
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.Reviews));
  }
  return response;
};

// 3-2 Get all Reviews by a Spot's id
export const getAllReviewsOfSpot = (spotId) => async (dispatch) => {
  const url = `/api/spots/${spotId}/reviews`;
  const response = await csrfFetch(url);
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpot(data.Reviews));
  }
  return response;
}

// 3-3 Create a Review for a Spot based on the Spot's id
export const createReviewForSpot = (spotId, review) => async (dispatch) => {
  const url = `/api/spots/${spotId}/reviews`;
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'XSRF-Token': 'XSRF-TOKEN',
    },
    body: JSON.stringify(review),
  }
  const response = await csrfFetch(url, options);
  return response;
}

// 3-4 Add an Image to a Review based on the Review's id
export const addImageToReviewById = (reviewId, image) => async (dispatch) => {
  const url = `/api/reviews/${reviewId}/images`;
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'XSRF-Token': 'XSRF-TOKEN',
    },
    body: JSON.stringify(image),
  }
  const response = await csrfFetch(url, options);
  return response;
}

// 3-5 Edit a Review
export const editReviewById = (reviewId, review) => async (dispatch) => {
  const url = `/api/reviews/${reviewId}`;
  const options = {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'XSRF-Token': 'XSRF-TOKEN',
    },
    body: JSON.stringify(review),
  }
  const response = await csrfFetch(url, options);
  return response;
}

// 3-6 Delete a Review
export const deleteReviewById = (reviewId) => async (dispatch) => {
  const url = `/api/reviews/${reviewId}`;
  const options = {
    method: "DELETE",
    headers: {
      'XSRF-Token': 'XSRF-TOKEN',
    },
  }
  const response = await csrfFetch(url, options);
  return response;
}

// spot reducer

const initialState = {
  spot: {},
  user: {},
}

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOT: {
      const newState = { ...state };
      const spot = {};
      action.payload.forEach(review => {
        spot[review.id] = review;
      });
      newState.spot = spot;
      return newState;
    }
    case SET_USER: {
      const newState = { ...state };
      const user = {};
      action.payload.forEach(review => {
        user[review.id] = review;
      });
      newState.user = user;
      return newState;
    }
    default:
      return state;
  }
}
export default reviewReducer;
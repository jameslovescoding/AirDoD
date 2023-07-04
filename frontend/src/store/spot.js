import { csrfFetch } from "./csrf";
import Cookies from 'js-cookie';

// constant for the reducer

const SET_ALL_SPOTS = "spots/setAllSpots";
const REMOVE_ALL_SPOTS = "spots/removeAllSpots";
const ADD_SPOT_IN_LIST = "spots/addSpotInList";
const EDIT_SPOT_IN_LIST = "spots/editSpotInList";
const REMOVE_SPOT_IN_LIST = "spots/removeSpotInList";

const SET_SINGLE_SPOT = "spots/setSingleSpot";
const REMOVE_SINGLE_SPOT = "spots/removeSingleSpot";

// action creator

const setAllSpots = (spots) => { // spots is an array
  return {
    type: SET_ALL_SPOTS,
    payload: spots,
  }
}

const removeAllSpots = () => {
  return {
    type: REMOVE_ALL_SPOTS,
  }
}

const addSpotInList = (spot) => {
  return {
    type: ADD_SPOT_IN_LIST,
    payload: spot,
  }
}

const editSpotInList = (spot) => {
  return {
    type: EDIT_SPOT_IN_LIST,
    payload: spot,
  }
}

const removeSpotInList = (spotId) => {
  return {
    type: REMOVE_SPOT_IN_LIST,
    id: spotId,
  }
}

const setSingleSpot = (spot) => {
  return {
    type: SET_SINGLE_SPOT,
    payload: spot
  }
}

const removeSingleSpot = () => {
  return {
    type: REMOVE_SINGLE_SPOT,
  }
}

// thunk action creator

// 2-1: get all spots, GET /api/spots
export const getAllSpots = (filter) => async (dispatch) => {
  let url = "/api/spots";
  if (filter) {
    const { page, size, maxLat, minLat, maxLng, minLng, maxPrice, minPrice } = filter;
    const queries = {};
    if (page) queries.page = page;
    if (size) queries.size = size;
    if (maxLat) queries.maxLat = maxLat;
    if (minLat) queries.minLat = minLat;
    if (maxLng) queries.maxLng = maxLng;
    if (minLng) queries.minLng = minLng;
    if (maxPrice) queries.maxPrice = maxPrice;
    if (minPrice) queries.minPrice = minPrice;
    const allKeys = Object.keys(queries);
    if (allKeys.length > 0) {
      url = url + "?";
      url = url + allKeys.map(key => `${key}=${queries[key]}`).join("&")
    }
  }
  //console.log("Get all spots url: ", url)
  const response = await csrfFetch(url);
  const data = await response.json();
  dispatch(setAllSpots(data.Spots));
  return response;
}

// 2-2: get all spots for current user, GET /api/spots/current
export const getAllSpotsForCurrentUser = () => async (dispatch) => {
  const url = "/api/spots/current";
  const response = await csrfFetch(url);
  const data = await response.json();
  dispatch(setAllSpots(data.Spots));
  return response;
}

// 2-3: get the details of a spot from an id, GET /api/spots/:spotId
export const getSpotById = (spotId) => async (dispatch) => {
  const url = `/api/spots/${spotId}`;
  const response = await csrfFetch(url);
  const data = await response.json();
  dispatch(setSingleSpot(data));
  return response;
}

// 2-4: create and return a new spot, POST /api/spots
export const createNewSpot = (spot) => async (dispatch) => {
  const url = "/api/spots";
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'XSRF-Token': 'XSRF-TOKEN',
    },
    body: JSON.stringify(spot),
  };
  const response = await csrfFetch(url, options);
  const data = await response.json();
  // set the singleSpot
  dispatch(setSingleSpot(data));
  // add spot to spots
  dispatch(addSpotInList(data));
  return response;
}

// 2-6: edit a spot, PUT /api/spots/:spotId
export const editSpotById = (spotId, spot) => async (dispatch) => {
  const url = `/api/spots/${spotId}`;
  const options = {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'XSRF-Token': 'XSRF-TOKEN',
    },
    body: JSON.stringify(spot),
  };
  const response = await csrfFetch(url, options);
  const data = await response.json();
  // set the singleSpot
  dispatch(setSingleSpot(data));
  // update spot in the spots
  dispatch(editSpotInList(data));
  return response;
}

// 2-7: delete a existing spot, DELETE /api/spots/:spotId
export const deleteSpotById = (spotId) => async (dispatch) => {
  const url = `/api/spots/${spotId}`;
  const response = await csrfFetch(url);
  //const data = await response.json();
  dispatch(removeSpotInList(spotId));
  return response;
}

// spot reducer

const initialState = {
  allSpots: {},
  singleSpot: {},
}

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_SPOTS: {
      const newState = { ...state };
      const allSpots = {};
      action.payload.forEach(spot => {
        allSpots[spot.id] = { ...spot };
      })
      newState.allSpots = allSpots;
      return newState;
    }
    case REMOVE_ALL_SPOTS: {
      const newState = { ...state };
      const allSpots = {};
      newState.allSpots = allSpots;
      return newState;
    }
    case SET_SINGLE_SPOT: {
      const newState = { ...state };
      const singleSpot = { ...action.payload };
      newState.singleSpot = singleSpot;
      return newState;
    }
    case REMOVE_SINGLE_SPOT: {
      const newState = { ...state };
      const singleSpot = {};
      newState.singleSpot = singleSpot;
      return newState;
    }
    default:
      return state;
  }
}

export default spotReducer
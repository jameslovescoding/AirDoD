import React from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { getAllSpotsForCurrentUser, deleteSpotById } from "../../store/spot";

const DeleteButtonModal = ({ spot }) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleYesButtonClick = async () => {
    console.log("proceed to delete the spot");
    const response = await dispatch(deleteSpotById(spot.id));
    if (response.ok) {
      await dispatch(getAllSpotsForCurrentUser());
      closeModal();
    }
  };

  const handleNoButtonClick = () => {
    closeModal();
  };

  return (<div className='delete-modal'>
    <h2 className='review-modal-heading'>Confirm Delete</h2>
    <p>Are you sure you want to remove this spot from the listings?</p>
    <div className='delete-modal-buttons'>
      <button className="delete-button delete-yes" onClick={handleYesButtonClick}>Yes (Delete Spot)</button>
      <button className="delete-button delete-no" onClick={handleNoButtonClick}>No (Keep Spot)</button>
    </div>

  </div>)
}

export default DeleteButtonModal;
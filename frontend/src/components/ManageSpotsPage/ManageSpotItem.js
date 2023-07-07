import SpotIndexItem from "../SpotsIndex/SpotIndexItem";
import { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { getAllSpotsForCurrentUser, deleteSpotById } from "../../store/spot";
import OpenModalButton from "../OpenModalButton";
import DeleteButtonModal from "./DeleteButtonModal";

const ManageSpotItem = ({ spot }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  // console.log("manage spot item", spot);

  // Redirect to the update form page of this spot
  const handleUpdateButtonClick = () => {
    history.push(`/spots/${spot.id}/edit`);
  };

  // show the delete modal
  const handleDeleteButtonClick = async () => {
    const response = await dispatch(deleteSpotById(spot.id));
    if (response.ok) {
      await dispatch(getAllSpotsForCurrentUser());
    }
  };

  return (<>
    <SpotIndexItem spot={spot} />
    <div>
      <button onClick={handleUpdateButtonClick}>Update</button>
      <OpenModalButton
        buttonText="Delete"
        modalComponent={<DeleteButtonModal spot={spot} />}
      />
    </div>
  </>);
}

export default ManageSpotItem;
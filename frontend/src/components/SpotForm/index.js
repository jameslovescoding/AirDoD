import React from 'react';
import { useState } from "react";
import { createNewSpot, editSpotById, addImageToSpotById } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import './SpotForm.css';

const SpotForm = ({ spot, formType }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [country, setCountry] = useState(spot.country);
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [lat, setLat] = useState(spot.lat);
  const [lng, setLng] = useState(spot.lng);
  const [name, setName] = useState(spot.name);
  const [description, setDescription] = useState(spot.description);
  const [price, setPrice] = useState(spot.price);
  const [errors, setErrors] = useState({});
  const [imgURLPreview, setImgURLPreview] = useState("");
  const [imgURL1, setImgURL1] = useState("");
  const [imgURL2, setImgURL2] = useState("");
  const [imgURL3, setImgURL3] = useState("");
  const [imgURL4, setImgURL4] = useState("");
  const buttonText = formType === "create" ? "Create spot" : "Update spot";

  const enterDemoSpotInfo1 = () => {
    setCountry("United States of America");
    setAddress("123 Disney Lane");
    setCity("San Francisco")
    setState("California")
    setName("App Academy")
    setDescription("Place where web developers are created")
    setPrice(123)
    setImgURLPreview("https://a0.muscache.com/im/pictures/323b2430-a7fa-44d7-ba7a-6776d8e682df.jpg")
    setImgURL1("https://a0.muscache.com/im/pictures/7a243e45-6f5e-4c75-b783-e0976d667345.jpg")
    setImgURL2("https://a0.muscache.com/im/pictures/miso/Hosting-21409981/original/2e27efa0-6fad-48ff-aab7-71980fc66471.jpeg")
    setImgURL3("https://a0.muscache.com/im/pictures/9b04b01e-3244-4f1a-b2ae-934590a87fd2.jpg")
    setImgURL4("https://a0.muscache.com/im/pictures/2d7b67a2-ec3a-443d-9d66-ebe83514f5c1.jpg")
  }

  const clearForm = () => {
    setCountry("");
    setAddress("");
    setCity("")
    setState("")
    setName("")
    setDescription("")
    setPrice("")
    setImgURLPreview("")
    setImgURL1("")
    setImgURL2("")
    setImgURL3("")
    setImgURL4("")
  }

  const handleFormOnSubmit = async (e) => {
    e.preventDefault();
    console.log("form submit triggered")
    if (validateForm()) {
      // passed the validation
      console.log("Good to go!")
      const newSpot = {
        country,
        address,
        city,
        state,
        lat: 37.7645358,
        lng: -122.4730327,
        name,
        description,
        price
      }
      if (formType === "create") {
        // create the spot
        const response = await dispatch(createNewSpot(newSpot))
        if (response.ok) {
          const data = await response.json();
          const spotId = data.id;
          // add images
          if (imgURLPreview.length > 0) await dispatch(addImageToSpotById(spotId, { url: imgURLPreview, preview: true }))
          if (imgURL1.length > 0) await dispatch(addImageToSpotById(spotId, { url: imgURL1, preview: false }))
          if (imgURL2.length > 0) await dispatch(addImageToSpotById(spotId, { url: imgURL2, preview: false }))
          if (imgURL3.length > 0) await dispatch(addImageToSpotById(spotId, { url: imgURL3, preview: false }))
          if (imgURL4.length > 0) await dispatch(addImageToSpotById(spotId, { url: imgURL4, preview: false }))
          history.push(`/spots/${spotId}`);
        }
      } else {
        // update the spot
        const response = await dispatch(editSpotById(spot.id, newSpot));
        if (response.ok) {
          history.push(`/spots/${spot.id}`);
        }
      }
    } else {
      // did not pass the validation
      console.log("Fix issues")
    }
  }

  const validateForm = () => {
    const newErrors = {};
    if (!country.length) newErrors.country = "Country is required";
    if (!address.length) newErrors.address = "Address is required";
    if (!city.length) newErrors.city = "City is required";
    if (!state.length) newErrors.state = "State is required";
    if (description.length < 30) newErrors.description = "Description needs a minimum of 30 characters";
    if (!name.length) newErrors.name = "Name is required";
    if (!price) newErrors.price = "Price is required";
    if (formType === "create") {
      if (!imgURLPreview.length) newErrors.imgURLPreview = "Preview image is required";
      if (imgURLPreview.length > 0 && !validateImg(imgURLPreview)) newErrors.imgURLPreview = "Image URL must end in .png, .jpg, .jpeg";
      if (imgURL1.length > 0 && !validateImg(imgURL1)) newErrors.imgURL1 = "Image URL must end in .png, .jpg, .jpeg";
      if (imgURL2.length > 0 && !validateImg(imgURL2)) newErrors.imgURL2 = "Image URL must end in .png, .jpg, .jpeg";
      if (imgURL3.length > 0 && !validateImg(imgURL3)) newErrors.imgURL3 = "Image URL must end in .png, .jpg, .jpeg";
      if (imgURL4.length > 0 && !validateImg(imgURL4)) newErrors.imgURL4 = "Image URL must end in .png, .jpg, .jpeg";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    } else {
      return true
    }
  }

  const validateImg = (str) => {
    return str.endsWith(".png") || str.endsWith(".jpg") || str.endsWith(".jpeg");
  }

  return (<>
    <button onClick={enterDemoSpotInfo1}>Enter demo</button>
    <button onClick={clearForm}>Clear form</button>
    <form className="spot-form" onSubmit={handleFormOnSubmit}>
      <div className='spot-form-section'>
        <h3>Where's your place located?</h3>
        <p>Guests will only get your exact address once they booked a reservation.</p>
        <div>
          <label>
            Country {errors.country && <span className='spot-form-error'>Country is required</span>}
            <input
              type="text" value={country} placeholder="Country"
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Street Address {errors.address && <span className='spot-form-error'>Address is required</span>}
            <input
              type="text" value={address} placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            City {errors.city && <span className='spot-form-error'>City is required</span>}
            <input
              type="text" value={city} placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <label>
            State {errors.state && <span className='spot-form-error'>State is required</span>}
            <input
              type="text" value={state} placeholder="State"
              onChange={(e) => setState(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className='spot-form-section'>
        <h3>Describe your place to guests</h3>
        <p>Mention the best features ofyour place, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
        <textarea
          value={description} placeholder="Please write at least 30 characters"
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p><span className='spot-form-error'>Description needs a minimum of 30 characters</span></p>}
      </div>
      <div className='spot-form-section'>
        <h3>Create a title for your spot</h3>
        <p>Catch guests' attention with a spot title that hightlights what makes your place special.</p>
        <input
          type="text" value={name} placeholder='Name of your spot'
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p><span className='spot-form-error'>Name is required</span></p>}
      </div>
      <div className='spot-form-section'>
        <h3>Set a base price for your spot</h3>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <label>
          $ <input
            type="number" value={price} placeholder='Price per night (USD)'
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        {errors.price && <p><span className='spot-form-error'>Price is required</span></p>}
      </div>
      {formType === "create" && (<div className='spot-form-section'>
        <h3>Liven up your spot with photos</h3>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <div>
          <input
            type="text" value={imgURLPreview} placeholder='Preview Image URL'
            onChange={(e) => setImgURLPreview(e.target.value)}
          />
          {errors.imgURLPreview && <p><span className='spot-form-error'>{errors.imgURLPreview}</span></p>}
        </div>
        <div>
          <input
            type="text" value={imgURL1} placeholder='Image URL'
            onChange={(e) => setImgURL1(e.target.value)}
          />
          {errors.imgURL1 && <p><span className='spot-form-error'>{errors.imgURL1}</span></p>}
        </div>
        <div>
          <input
            type="text" value={imgURL2} placeholder='Image URL'
            onChange={(e) => setImgURL2(e.target.value)}
          />
          {errors.imgURL2 && <p><span className='spot-form-error'>{errors.imgURL2}</span></p>}
        </div>
        <div>
          <input
            type="text" value={imgURL3} placeholder='Image URL'
            onChange={(e) => setImgURL3(e.target.value)}
          />
          {errors.imgURL3 && <p><span className='spot-form-error'>{errors.imgURL3}</span></p>}
        </div>
        <div>
          <input
            type="text" value={imgURL4} placeholder='Image URL'
            onChange={(e) => setImgURL4(e.target.value)}
          />
          {errors.imgURL4 && <p><span className='spot-form-error'>{errors.imgURL4}</span></p>}
        </div>
      </div>)}
      <div className='spot-form-button-section'>
        <input type="submit" value={buttonText} />
      </div>
    </form>
  </>)
}

export default SpotForm;
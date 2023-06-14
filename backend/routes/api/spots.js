const express = require('express');
const { User, Spot, SpotImage, Review, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// 2-1 Get all Spots

router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll({
    include: [
      {
        model: SpotImage,
        attributes: ['url'],
        where: { preview: true },
        required: false
      },
      {
        model: Review,
        attributes: ['stars']
      }
    ]
  });

  const resObj = {};

  resObj.Spots = spots.map(spot => {
    // convert to JSON object
    const spotJSON = spot.toJSON();
    // extract aggregate key
    const { Reviews, SpotImages } = spotJSON;
    // calculate average rating
    if (Reviews.length) {
      spotJSON.avgRating = Reviews.reduce((acc, ele) => { return acc + ele.stars }, 0) / Reviews.length;
    } else {
      spotJSON.avgRating = null;
    }
    // find preview
    if (SpotImages.length) {
      spotJSON.previewImage = SpotImages[0].url;
    } else {
      spotJSON.previewImage = null;
    }
    delete spotJSON["Reviews"];
    delete spotJSON["SpotImages"];
    return spotJSON;
  });

  res.json(resObj)
});

// 2-2 Get all Spots owned by the Current User

router.get('/current', async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  //
  const { id } = req.user;
  const spots = await Spot.findAll({
    where: { ownerId: id },
    include: [
      {
        model: SpotImage,
        attributes: [['url', 'previewImage']],
        where: { preview: true },
        required: false
      },
      {
        model: Review,
        attributes: ['stars']
      }
    ]
  });

  const resObj = {};

  resObj.Spots = spots.map(spot => {
    const spotJSON = spot.toJSON();
    // extract aggregate key
    const { Reviews, SpotImages } = spotJSON;
    // calculate average rating
    if (Reviews.length) {
      spotJSON.avgRating = Reviews.reduce((acc, ele) => { return acc + ele.stars }, 0) / Reviews.length;
    } else {
      spotJSON.avgRating = null;
    }
    // find preview
    if (SpotImages.length) {
      spotJSON.previewImage = SpotImages[0].url;
    } else {
      spotJSON.previewImage = null;
    }
    delete spotJSON["Reviews"];
    delete spotJSON["SpotImages"];
    return spotJSON;
  });

  res.json(resObj);
});

// 2-3 Get details of a Spot from an id

router.get("/:spotId", async (req, res, next) => {
  let { spotId } = req.params;
  if (!spotId || !Number.isInteger(parseInt(spotId)) || parseInt(spotId) < 0) {
    res.status(400);
    return res.json({ message: "Invalid spotId input" })
  }
  const spot = await Spot.findOne({
    where: { id: spotId },
    include: [
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Review,
        attributes: ['stars']
      },
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview']
      }
    ]
  })
  if (!spot) {
    res.status(404);
    return res.json({ "message": "Spot couldn't be found" });
  }
  const resObj = spot.toJSON();
  const { Reviews } = resObj;
  resObj.numReviews = Reviews.length;
  resObj.avgStarRating = Reviews.reduce((acc, ele) => { return acc + ele.stars }, 0) / Reviews.length;
  delete resObj["Reviews"];
  res.json(resObj);
});

// 2-4 Create a Spot

const validateCreateSpot = [
  check('address').exists({ checkFalsy: true }).withMessage('Street address is required'),
  check('city').exists({ checkFalsy: true }).withMessage('City is required'),
  check('state').exists({ checkFalsy: true }).withMessage('State is required'),
  check('country').exists({ checkFalsy: true }).withMessage('Country is required'),
  check('lat').exists({ checkFalsy: true }).isFloat().withMessage('Latitude is not valid'), // did not use isLatLong()
  check('lng').exists({ checkFalsy: true }).isFloat().withMessage('Longitude is not valid'), // did not use isLatLong()
  check('name').exists({ checkFalsy: true }).isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
  check('description').exists({ checkFalsy: true }).withMessage('Description is required'),
  check('price').exists({ checkFalsy: true }).isNumeric().withMessage('Price per day is required'),
  handleValidationErrors
];

router.post("/", validateCreateSpot, async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  const { id: ownerId } = req.user;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const newSpot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });
  res.json(newSpot.toJSON());
});

module.exports = router;
const express = require('express');
const { Op } = require('sequelize');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');
const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// 2-1 Get all Spots

const validateGetSpot = [
  query('page', "Page must be greater than or equal to 1").default(1).isInt({ min: 1, max: 10 }).toInt(),
  query('size', "Size must be greater than or equal to 1").default(20).isInt({ min: 1, max: 20 }).toInt(),
  query('minLat', "Minimum latitude is invalid").isDecimal().toFloat().optional(),
  query('maxLat', "Maximum latitude is invalid").isDecimal().toFloat().optional(),
  query('minLng', "Minimum longitude is invalid").isDecimal().toFloat().optional(),
  query('maxLng', "Maximum longitude is invalid").isDecimal().toFloat().optional(),
  query('minPrice', "Minimum price must be greater than or equal to 0").isFloat({ min: 0 }).toFloat().optional(),
  query('maxPrice', "Maximum price must be greater than or equal to 0").isFloat({ min: 0 }).toFloat().optional(),
  handleValidationErrors
];

router.get('/', validateGetSpot, async (req, res, next) => {
  //console.log(req.query);
  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
  // Handling pagination
  const pagination = {};
  pagination.limit = size;
  if (page > 1) {
    pagination.offset = size * (page - 1);
  }
  //console.log(pagination);
  // Handling search filter on lat, lng, price
  const where = {};
  // lat
  if (minLat || maxLat) { where.lat = {}; }
  if (minLat) { where.lat = { ...where.lat, [Op.gte]: minLat }; }
  if (maxLat) { where.lat = { ...where.lat, [Op.lte]: maxLat }; }
  // lng
  if (minLng || maxLng) { where.lng = {}; }
  if (minLng) { where.lng = { ...where.lng, [Op.gte]: minLng }; }
  if (maxLng) { where.lng = { ...where.lng, [Op.lte]: maxLng }; }
  // price
  if (minPrice || maxPrice) { where.price = {}; }
  if (minPrice) { where.price = { ...where.price, [Op.gte]: minPrice } }
  if (maxPrice) { where.price = { ...where.price, [Op.lte]: maxPrice } }
  //console.log(where);
  // The main query
  const spots = await Spot.findAll({
    where: where,
    ...pagination,
    include: [
      { model: SpotImage, attributes: ['url'], where: { preview: true }, required: false },
      { model: Review, attributes: ['stars'] }
    ]
  });
  const resObj = {};
  resObj.page = page;
  resObj.size = size;
  resObj.Spots = spots.map(spot => {
    // convert to JSON object
    const spotJSON = spot.toJSON();
    // extract aggregate key
    const { Reviews, SpotImages } = spotJSON;
    // calculate average rating
    if (Reviews.length) {
      spotJSON.avgRating = (Reviews.reduce((acc, ele) => { return acc + ele.stars }, 0) / Reviews.length).toFixed(1);
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
  const { id } = req.user;
  const spots = await Spot.findAll({
    where: { ownerId: id },
    include: [
      { model: SpotImage, attributes: ['url'], where: { preview: true }, required: false },
      { model: Review, attributes: ['stars'] }
    ]
  });
  const resObj = {};
  resObj.Spots = spots.map(spot => {
    const spotJSON = spot.toJSON();
    // extract aggregate key
    const { Reviews, SpotImages } = spotJSON;
    //console.log(SpotImages)
    // calculate average rating
    if (Reviews.length) {
      spotJSON.avgRating = (Reviews.reduce((acc, ele) => { return acc + ele.stars }, 0) / Reviews.length).toFixed(1);
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

const validateGetSpotDetail = [
  check('spotId')
    .exists({ checkFalsy: true }).withMessage("spotId is required")
    .isInt({ min: 1 }).withMessage("spotId need to be an integer and larger than 0"),
  handleValidationErrors
];

router.get("/:spotId", validateGetSpotDetail, async (req, res, next) => {
  let { spotId } = req.params;
  const spot = await Spot.findOne({
    where: { id: spotId },
    include: [
      { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] },
      { model: Review, attributes: ['stars'] },
      { model: SpotImage, attributes: ['id', 'url', 'preview'] }
    ]
  })
  if (!spot) {
    res.status(404);
    return res.json({ "message": "Spot couldn't be found" });
  }
  const resObj = spot.toJSON();
  const { Reviews } = resObj;
  resObj.numReviews = Reviews.length;
  resObj.avgStarRating = (Reviews.reduce((acc, ele) => { return acc + ele.stars }, 0) / Reviews.length).toFixed(1);
  delete resObj["Reviews"];
  res.json(resObj);
});

// 2-4 Create a Spot

const validateCreateSpot = [
  check('address')
    .exists({ checkFalsy: true }).notEmpty().withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true }).notEmpty().withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true }).notEmpty().withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true }).notEmpty().withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true }).isFloat().withMessage('Latitude is not valid'), // did not use isLatLong()
  check('lng')
    .exists({ checkFalsy: true }).isFloat().withMessage('Longitude is not valid'), // did not use isLatLong()
  check('name')
    .exists({ checkFalsy: true }).notEmpty().withMessage("Name is required")
    .isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true }).notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage("Description must be less than 500 characters"),
  check('price')
    .exists({ checkFalsy: true }).withMessage('Price per day is required')
    .isNumeric().withMessage('Price need to be a number'),
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
  // use status code 201
  res.status(201);
  res.json(newSpot.toJSON());
});

// 2-5 Add an Image to a Spot based on the Spot's id

const validateCreateSpotImage = [
  check('url').exists().notEmpty().withMessage('url is required').isLength({ max: 500 }).withMessage('url max 500 long'),
  check('preview').exists().withMessage('preview is required').isBoolean().withMessage('preview need to be a boolean'),
  check('spotId').exists().isInt({ min: 1 }).withMessage("spotId need to be an integer and larger than 0"),
  handleValidationErrors
];

router.post("/:spotId/images", validateCreateSpotImage, async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  // Find the spot with spotId
  const { spotId } = req.params;
  const spot = await Spot.findOne({ where: { id: spotId } });
  // Couldn't find a Spot with the specified id
  if (!spot) {
    res.status(404);
    return res.json({ "message": "Spot couldn't be found" })
  }
  // Handle un-authorized situation
  if (req.user.id !== spot.ownerId) {
    res.status(403);
    return res.json({ "message": "Forbidden" });
  }
  // create the spotImage
  const { url, preview } = req.body;
  const newSpotImage = await SpotImage.create({
    spotId: spot.id,
    url: url,
    preview: preview
  })
  // Grab the id of newly created spotImage and return
  const resObj = {};
  resObj.id = newSpotImage.id;
  resObj.url = url;
  resObj.preview = preview;
  res.json(resObj);
});

// 2-6 Edit a Spot

const validateEditSpot = [
  check('spotId').exists().isInt({ min: 1 }).withMessage("spotId need to be an integer and larger than 0"),
  check('address').exists({ checkFalsy: true }).notEmpty().withMessage('Street address is required'),
  check('city').exists({ checkFalsy: true }).notEmpty().withMessage('City is required'),
  check('state').exists({ checkFalsy: true }).notEmpty().withMessage('State is required'),
  check('country').exists({ checkFalsy: true }).notEmpty().withMessage('Country is required'),
  check('lat').exists({ checkFalsy: true }).isFloat().withMessage('Latitude is not valid'), // did not use isLatLong()
  check('lng').exists({ checkFalsy: true }).isFloat().withMessage('Longitude is not valid'), // did not use isLatLong()
  check('name')
    .exists({ checkFalsy: true }).notEmpty().withMessage("Name is required")
    .isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true }).notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage("Description must be less than 500 characters"),
  check('price')
    .exists({ checkFalsy: true }).withMessage('Price per day is required')
    .isNumeric().withMessage('Price need to be a number'),
  handleValidationErrors
];

router.put('/:spotId', validateEditSpot, async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  // Find the spot with spotId
  const { spotId } = req.params;
  const spot = await Spot.findOne({ where: { id: spotId } });
  // Couldn't find a Spot with the specified id
  if (!spot) {
    res.status(404);
    return res.json({ "message": "Spot couldn't be found" })
  }
  // Handle un-authorized situation
  if (req.user.id !== spot.ownerId) {
    res.status(403);
    return res.json({ "message": "Forbidden" });
  }
  // Update the spot
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  spot.address = address;
  spot.city = city;
  spot.state = state;
  spot.country = country;
  spot.lat = lat;
  spot.lng = lng;
  spot.name = name;
  spot.description = description;
  spot.price = price;
  // Save the update
  await spot.save();
  res.json(spot);
});

// 2-7 Delete a Spot

const validateDeleteSpot = [
  check('spotId').exists().isInt({ min: 1 }).withMessage("spotId need to be an integer and larger than 0"),
  handleValidationErrors
];

router.delete("/:spotId", validateDeleteSpot, async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  // Find the spot with spotId
  const { spotId } = req.params;
  const spot = await Spot.findOne({ where: { id: spotId } });
  // Couldn't find a Spot with the specified id
  if (!spot) {
    res.status(404);
    return res.json({ "message": "Spot couldn't be found" })
  }
  // Handle un-authorized situation
  if (req.user.id !== spot.ownerId) {
    res.status(403);
    return res.json({ "message": "Forbidden" });
  }
  // Delete the spot
  await spot.destroy();
  res.json({ "message": "Successfully deleted" })
});

// 3-2 Get all Reviews by a Spot's id

const validateGetReviewBySpot = [
  check('spotId').exists().isInt({ min: 1 }).withMessage("spotId need to be an integer and larger than 0"),
  handleValidationErrors
];

router.get("/:spotId/reviews", validateGetReviewBySpot, async (req, res, next) => {
  const { spotId } = req.params;
  const spot = await Spot.findOne({ where: { id: spotId } });
  // Couldn't find a Spot with the specified id
  if (!spot) {
    res.status(404);
    return res.json({ "message": "Spot couldn't be found" })
  }
  // find all related reviews
  const reviews = await Review.findAll({
    where: { spotId: spotId },
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      { model: ReviewImage, attributes: ['id', 'url'] }
    ]
  })
  const resObj = {};
  resObj.Reviews = reviews.map(review => {
    const reviewJSON = review.toJSON();
    return reviewJSON;
  })
  res.json(resObj);
});

// 3-3 Create a Review for a Spot based on the Spot's id

const validateCreateReviewBySpot = [
  check('spotId').exists().isInt({ min: 1 }).withMessage("spotId need to be an integer and larger than 0"),
  check('review')
    .exists().withMessage("Review text is required")
    .isLength({ min: 1, max: 500 }).withMessage("Review text length is between 1 to 500 characters"),
  check('stars').exists().isInt({ min: 1, max: 5 }).withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
];

router.post("/:spotId/reviews", validateCreateReviewBySpot, async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  // Try to find the spot with spotId
  const { spotId } = req.params;
  const spot = await Spot.findOne({ where: { id: spotId } });
  // Couldn't find a Spot with the specified id
  if (!spot) {
    res.status(404);
    return res.json({ "message": "Spot couldn't be found" })
  }
  // Check if the user has already made a review on this spot
  const prevReview = await Review.findOne({
    where: { spotId: spotId, userId: req.user.id }
  })
  // If found, return status 500
  if (prevReview) {
    res.status(500);
    return res.json({ "message": "User already has a review for this spot" });
  }
  // If not, create the new review
  const { review, stars } = req.body;
  const newReview = await Review.create({
    spotId: spot.id,
    userId: req.user.id,
    review: review,
    stars: stars
  })
  // response status 201
  res.status(201);
  res.json(newReview);
});

// 4-2 Get all Bookings for a Spot based on the Spot's id

const validateGetBookingBySpot = [
  check('spotId').exists().isInt({ min: 1 }).withMessage("spotId need to be an integer and larger than 0"),
  handleValidationErrors
];

router.get('/:spotId/bookings', validateGetBookingBySpot, async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  // Try to find the spot
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404);
    return res.json({ "message": "Spot couldn't be found" })
  }
  const isOwner = req.user.id == spot.ownerId;
  //
  const options = {};
  options.where = { spotId: req.params.spotId };
  if (isOwner) {
    options.attributes = ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'];
    options.include = {
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    }
  } else {
    options.attributes = ['spotId', 'startDate', 'endDate']
  }
  const bookings = await Booking.findAll(options);
  //
  const resObj = {};
  resObj.Bookings = bookings.map(booking => {
    const bookingJSON = booking.toJSON();
    return bookingJSON;
  })
  res.json(resObj);
});

// 4-3 Create a Booking from a Spot based on the Spot's id

const validateCreateBookingFromSpot = [
  check('spotId').exists().isInt({ min: 1 }).withMessage("spotId need to be an integer and larger than 0"),
  check('startDate').exists().isDate().withMessage("startDate is not valid"),
  check('endDate').exists().isDate().withMessage("endDate is not valid"),
  check('endDate').custom((_endDate, { req }) => {
    // convert to Date object
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    if (startDate && endDate) {
      // use getTime() on Date object before comparing values
      if (endDate.getTime() <= startDate.getTime()) {
        throw new Error('endDate cannot be on or before startDate');
      }
    }
    return true;
  }),
  handleValidationErrors
];

router.post('/:spotId/bookings', validateCreateBookingFromSpot, async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  // Try to find the spot with spotId
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404);
    return res.json({ "message": "Spot couldn't be found" })
  }
  // Handle un-authorized situation
  // The owner can not book it's own property
  if (spot.ownerId === req.user.id) {
    res.status(403);
    return res.json({ "message": "Forbidden" });
  }
  // Try to find all the bookings for this spot
  const bookings = await Booking.findAll({
    where: { spotId: req.params.spotId },
    attributes: ['startDate', 'endDate']
  });
  // Check conflicts
  const errors = {};
  // store conflict bookings
  // errors.conflictBookings = [];
  // convert to values before comparing
  const bookingStart = new Date(req.body.startDate).getTime();
  const bookingEnd = new Date(req.body.endDate).getTime();
  // go through all the bookings
  bookings.forEach(booking => {
    const bookingJSON = booking.toJSON();
    //console.log(bookingJSON);
    const startDate = (new Date(bookingJSON.startDate)).getTime();
    const endDate = (new Date(bookingJSON.endDate)).getTime();
    // Three cases that we need to generate errors
    if (startDate <= bookingStart && bookingStart < endDate) {
      // startDate is inside another booking's boundary
      errors.startDate = "Start date conflicts with an existing booking";
      // errors.conflictBookings.push(bookingJSON);
    }
    if (startDate < bookingEnd && bookingEnd <= endDate) {
      // endDate is inside another booking's boundary
      errors.endDate = "End date conflicts with an existing booking";
      // errors.conflictBookings.push(bookingJSON);
    }
    if (bookingStart <= startDate && bookingEnd >= endDate) {
      // Both startDate and endDate are overlaping another booking's boundary
      errors.startDate = "Start date conflicts with an existing booking";
      errors.endDate = "End date conflicts with an existing booking";
      // errors.conflictBookings.push(bookingJSON);
    }
  });
  //console.log(errors);
  // Check errors, return status code 403
  if (errors.startDate || errors.endDate) {
    res.status(403);
    const resObj = {};
    resObj.message = "Sorry, this spot is already booked for the specified dates";
    resObj.errors = errors;
    return res.json(resObj);
  }
  // If there is no error, then create new booking
  const newBooking = await Booking.create({
    userId: req.user.id,
    spotId: req.params.spotId,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  })
  res.json(newBooking);
});

module.exports = router;
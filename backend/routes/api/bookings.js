const express = require('express');
const { Op } = require('sequelize');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// 4-1 Get all of the Current User's Bookings

router.get('/current', async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: {
      model: Spot,
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
      include: {
        model: SpotImage,
        attributes: ['url'],
        where: { preview: true },
        required: false,
      },
    }
  })
  const resObj = {};
  resObj.Bookings = bookings.map(booking => {
    const bookingJSON = booking.toJSON();
    if (bookingJSON.Spot.SpotImages.length) {
      bookingJSON.Spot.previewImage = bookingJSON.Spot.SpotImages[0].url;
    } else {
      bookingJSON.Spot.previewImage = null;
    }
    delete bookingJSON.Spot["SpotImages"];
    return bookingJSON;
  })
  res.json(resObj);
});

// 4-4 Edit a Booking

const validateEditBooking = [
  check('bookingId').exists().isInt({ min: 1 }).withMessage("bookingId need to be an integer and larger than 0"),
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

router.put('/:bookingId', validateEditBooking, async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  // Try to find the booking with bookingId
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) {
    res.status(404);
    return res.json({ "message": "Booking couldn't be found" })
  }
  // Check if the booking is a past booking
  const endDate = new Date(booking.endDate).getTime();
  const current = Date.now();
  if (endDate <= current) {
    res.status(403);
    return res.json({ "message": "Past bookings can't be modified" });
  }
  // Check booking conflict
  const bookings = await Booking.findAll({
    where: {
      spotId: booking.spotId,
      id: { [Op.not]: req.params.bookingId }
    },
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
  bookings.forEach(ele => {
    const bookingJSON = ele.toJSON();
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
  // If there is no error, then update new booking
  booking.startDate = req.body.startDate;
  booking.endDate = req.body.endDate;
  await booking.save();
  res.json(booking);
});

// 4-5 Delete a Booking

const validateDeleteBooking = [
  check('bookingId').exists().isInt({ min: 1 }).withMessage("bookingId need to be an integer and larger than 0"),
  handleValidationErrors
];

router.delete('/:bookingId', validateDeleteBooking, async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  // Try to find the booking with bookingId
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) {
    res.status(404);
    return res.json({ "message": "Booking couldn't be found" })
  }
  // Handle un-authorized situation
  // The user is either creator of the booking or the owner of the spot
  const spot = await Spot.findByPk(booking.spotId);
  if (req.user.id !== booking.userId && req.user.id !== spot.ownerId) {
    res.status(403);
    return res.json({ "message": "Forbidden" });
  }
  // Check if the booking has started
  const startDate = new Date(booking.startDate).getTime();
  const current = Date.now();
  if (startDate <= current) {
    res.status(403);
    return res.json({ "message": "Bookings that have been started can't be deleted" });
  }
  // Delete the booking
  await booking.destroy();
  res.json({ message: "Successfully deleted" })
});



module.exports = router;
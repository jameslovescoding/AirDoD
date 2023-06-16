// backend/routes/api/index.js
const router = require('express').Router();

const sessionRouter = require('./session.js');

const usersRouter = require('./users.js');

const spotsRouter = require('./spots.js');

const reviewsRouter = require('./reviews.js');

const bookingsRouter = require('./bookings.js');

const spotImageRouter = require('./spot-images.js');

const reviewImageRouter = require('./review-images.js');

const { restoreUser } = require('../../utils/auth.js');

// parse and verify the token
// if everything is fine, user is stored in req.user

router.use(restoreUser);

// Login, logout, Get the current user

router.use('/session', sessionRouter);

// Signup

router.use('/users', usersRouter);

// Spots

router.use('/spots', spotsRouter);

// Reviews

router.use('/reviews', reviewsRouter);

// Bookings

router.use('/bookings', bookingsRouter);

// Spot Images

router.use('/spot-images', spotImageRouter);

// Review Images

router.use('/review-images', reviewImageRouter);

// Test

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

// export default
module.exports = router;
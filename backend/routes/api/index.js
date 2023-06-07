// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require('../../utils/auth.js');

// parse and verify the token
// if everything is fine, user is stored in req.user
// with attributes: email, createdAt, updatedAt
router.use(restoreUser);

// Login: POST / api / session
// Logout: DELETE / api / session
// Get session user: GET / api / session
router.use('/session', sessionRouter);

// Signup: POST /api/users
router.use('/users', usersRouter);

// Test: POST /api/test
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

// export default
module.exports = router;
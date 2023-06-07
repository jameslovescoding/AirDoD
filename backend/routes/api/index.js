// backend/routes/api/index.js
const router = require('express').Router();

const { restoreUser } = require('../../utils/auth.js');

// parse and verify the token
// if everything is fine, user is stored in req.user
// with attributes: email, createdAt, updatedAt
router.use(restoreUser);

module.exports = router;
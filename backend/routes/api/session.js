// backend/routes/api/session.js
const express = require('express')

const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { environment } = require('../../config');
const isProduction = environment === 'production';

const router = express.Router();

const validateLogin = [
  check('credential').exists({ checkFalsy: true }).notEmpty().withMessage('Email or username is required'),
  check('password').exists({ checkFalsy: true }).withMessage('Password is required'),
  handleValidationErrors
];

// 1-4 Log in
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential
      }
    }
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error('Login failed');
    err.status = 401;
    err.title = 'Login failed';
    err.errors = { credential: 'The provided credentials were invalid.' };
    return next(err);
  }

  //console.log(user);

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
});

// log in error handling
router.use('/', (err, req, res, next) => {
  console.log("log in error handle")
  resObj = {};
  if (err.status === 400) {
    res.status(400);
    resObj.message = "Bad Request";
    resObj.errors = {};
    if (err.errors.credential) {
      resObj.errors.credential = "Email or username is required";
    }
    if (err.errors.password) {
      resObj.errors.password = "Password is required";
    }
    return res.json(resObj);
  }
  if (err.status === 401) {
    res.status(401);
    resObj.message = "Invalid credentials";
    return res.json(resObj);
  }
});

// Log out
router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
});

// 1-3 Get the Current User / Restore session user
router.get('/', (req, res) => {
  const { user } = req;
  if (user) {
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };
    return res.json({
      user: safeUser
    });
  } else return res.json({ user: null });
});

module.exports = router;
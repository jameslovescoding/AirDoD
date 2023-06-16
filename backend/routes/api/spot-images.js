const express = require('express');
const { Op } = require('sequelize');
const { Booking, User, Spot, SpotImage, Review, ReviewImage, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// 5-1 Delete a Spot Image

const validateDeleteImage = [
  check('imageId').exists().isInt({ min: 1 }).withMessage("imageId need to be an integer and larger than 0"),
  handleValidationErrors
];

router.delete('/:imageId', validateDeleteImage, async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  // Try to find the spot image and eager load owner info
  const spotImage = await SpotImage.findOne({
    where: { id: req.params.imageId },
    attributes: ['id', 'spotId'],
    include: {
      model: Spot,
      attributes: ['id', 'ownerId'],
    }
  });
  // If we can not find the spot image
  if (!spotImage) {
    res.status(404);
    return res.json({ "message": "Spot Image couldn't be found" });
  }
  // Handle un-authorized situation
  if (req.user.id !== spotImage.Spot.ownerId) {
    res.status(403);
    return res.json({ "message": "Forbidden" });
  }
  // Delete the spot image
  await spotImage.destroy();
  res.json({ "message": "Successfully deleted" });
});

module.exports = router;
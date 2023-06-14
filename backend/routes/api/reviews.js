const express = require('express');
const { User, Spot, SpotImage, Review, ReviewImage, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get("/current", async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  //
  const reviews = await Review.findAll({
    where: { userId: req.user.id },
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      {
        model: Spot,
        attributes: [
          'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price',
        ],
        include: {
          model: SpotImage, attributes: ['url'], where: { preview: true }, required: false,
        },

      },
      { model: ReviewImage, attributes: ['id', 'url'] }
    ]
  })
  const resObj = {};
  resObj.Reviews = reviews.map(review => {
    const reviewJSON = review.toJSON();
    reviewJSON.Spot.previewImage = reviewJSON.Spot.SpotImages[0].url;
    delete reviewJSON.Spot["SpotImages"];
    return reviewJSON;
  })
  res.json(resObj);
});

// 3-4 Add an Image to a Review based on the Review's id



module.exports = router;
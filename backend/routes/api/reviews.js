const express = require('express');
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// 3-1 Get all Reviews of the Current User

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
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
        include: {
          model: SpotImage,
          attributes: ['url'],
          where: { preview: true },
          required: false,
        },
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  })
  const resObj = {};
  resObj.Reviews = reviews.map(review => {
    const reviewJSON = review.toJSON();
    if (reviewJSON.Spot.SpotImages.length) {
      reviewJSON.Spot.previewImage = reviewJSON.Spot.SpotImages[0].url;
    } else {
      reviewJSON.Spot.previewImage = null;
    }
    delete reviewJSON.Spot["SpotImages"];
    return reviewJSON;
  })
  res.json(resObj);
});

// 3-4 Add an Image to a Review based on the Review's id

const validateAddImageToReview = [
  check('reviewId').exists().isInt({ min: 1 }).withMessage("reviewId need to be an integer and larger than 0"),
  check('url').exists().isString().withMessage("Valid url is required"),
  handleValidationErrors
];

router.post("/:reviewId/images", validateAddImageToReview, async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  //const { id: userId } = req.user.id;
  // find the review by reviewId
  const { reviewId } = req.params;
  const review = await Review.findOne({
    where: { id: reviewId },
    include: { model: ReviewImage, attributes: ['id'] }
  })
  // If not found the review, respond 404
  if (!review) {
    res.status(404);
    return res.json({ "message": "Review couldn't be found" });
  }
  // Handle un-authorized situation
  if (req.user.id !== review.userId) {
    res.status(403);
    return res.json({ "message": "Forbidden" });
  }
  // check the number of images
  if (review.ReviewImages.length >= 10) {
    res.status(403);
    return res.json({ "message": "Maximum number of images for this resource was reached" })
  }
  // Add the image to the review
  const newReviewImage = await ReviewImage.create({
    reviewId: review.id,
    url: req.body.url
  })
  const resObj = {};
  resObj.id = newReviewImage.id;
  resObj.url = newReviewImage.url;
  res.json(resObj);
});

// 3-5 Edit a Review

const validateEditReview = [
  check('reviewId').exists().isInt({ min: 1 }).withMessage("reviewId need to be an integer and larger than 0"),
  check('review')
    .exists().withMessage("Review text is required")
    .isLength({ min: 1, max: 500 }).withMessage("Review text length is between 1 to 500 characters"),
  check('stars')
    .exists().withMessage("Stars is required")
    .isInt({ min: 1, max: 5 }).withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
];

router.put("/:reviewId", validateEditReview, async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  // find the review by reviewId
  const { reviewId } = req.params;
  const review = await Review.findByPk(reviewId);
  // If not found the review, respond 404
  if (!review) {
    res.status(404);
    return res.json({ "message": "Review couldn't be found" });
  }
  // Handle un-authorized situation
  if (req.user.id !== review.userId) {
    res.status(403);
    return res.json({ "message": "Forbidden" });
  }
  // If found, assign new values
  review.review = req.body.review;
  review.stars = req.body.stars;
  // Save the change
  await review.save();
  res.json(review);
});

// 3-6 Delete a Review

const validateDeleteReview = [
  check('reviewId').exists().isInt({ min: 1 }).withMessage("reviewId need to be an integer and larger than 0"),
  handleValidationErrors
];

router.delete("/:reviewId", validateDeleteReview, async (req, res, next) => {
  // Handling un-authenticated situation
  if (!req.user) {
    res.status(401);
    return res.json({ "message": "Authentication required" });
  }
  // find the review by reviewId
  const { reviewId } = req.params;
  const review = await Review.findByPk(reviewId);
  // If not found the review, respond 404
  if (!review) {
    res.status(404);
    return res.json({ "message": "Review couldn't be found" });
  }
  // Handle un-authorized situation
  if (req.user.id !== review.userId) {
    res.status(403);
    return res.json({ "message": "Forbidden" });
  }
  // If found and authorized, delete
  await review.destroy();
  res.json({ "message": "Successfully deleted" });
});

module.exports = router;
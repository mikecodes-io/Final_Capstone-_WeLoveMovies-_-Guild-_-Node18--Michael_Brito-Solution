const router = require("express").Router({ mergeParams: true });
const controller = require("./reviews.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Add your routes here
// Route to get reviews for a specific movie
router.get("/:movieId/reviews", controller.list);

// Route to update a review
router.put("/:reviewId", controller.update);

// Route to delete a review
router.delete("/:reviewId", controller.destroy);
module.exports = router;

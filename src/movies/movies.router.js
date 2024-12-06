const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const reviewsRouter = require("../reviews/reviews.router");
const theatersRouter = require("../theaters/theaters.router");

// Route to list all movies
router.route("/")
  .get(controller.list)  // Calls the list function from the controller
  .all(methodNotAllowed); // Handles any methods that are not GET

// Route to get a specific movie by its ID
router.route("/:movieId")
  .get(controller.read)  // Calls the read function from the controller
  .all(methodNotAllowed); // Handles any methods that are not GET

// Route to handle reviews related to movies
router.use("/:movieId/reviews", reviewsRouter); // Delegates routes related to reviews for a specific movie

// Route to handle theaters related to movies
router.use("/:movieId/theaters", theatersRouter); // Delegates routes related to theaters for a specific movie

// Explicitly handle /movies/:movieId/critics to return 404
router.all("/:movieId/critics", (req, res) => {
  res.status(404).json({
    error: `Resource not found for movie ID ${req.params.movieId}/critics`
  });
});

module.exports = router;

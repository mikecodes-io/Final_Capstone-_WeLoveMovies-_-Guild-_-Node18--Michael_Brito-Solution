// Load environment variables if the USER environment variable is set
if (process.env.USER) require("dotenv").config();

const express = require("express");
const app = express();
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");
const methodNotAllowed = require("./errors/methodNotAllowed");

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount the routers for movies, theaters, and reviews
app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);

// Catch-all route for any unsupported methods (e.g., POST, PUT) on other paths
app.all("*", methodNotAllowed);

// Error handling middleware (catch all errors)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

module.exports = app;

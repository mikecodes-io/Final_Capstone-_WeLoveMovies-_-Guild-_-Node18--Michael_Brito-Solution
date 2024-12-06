const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  const { movieId } = request.params;

  try {
    const movie = await service.read(movieId); // Check if the movie exists by calling the service layer
    if (movie) {
      response.locals.movie = movie; // Store the movie in response.locals for later use
      return next();
    } else {
      return next({ status: 404, message: `Movie with id ${movieId} not found` }); // If the movie is not found, send a 404 error
    }
  } catch (error) {
    return next(error); // Pass errors to the error handler
  }
}

async function read(request, response) {
  const { movieId } = request.params;
  
  // Send the movie data as the response
  response.json({ data: response.locals.movie });
}

async function list(request, response) {
  try {
    const movies = await service.list(); // Get all movies using the service layer
    response.json({ data: movies }); // Send the list of movies as the response
  } catch (error) {
    return next(error); // Pass any errors to the error handler
  }
}

module.exports = {
  list: [asyncErrorBoundary(list)], // Wrap the list function with asyncErrorBoundary
  read: [asyncErrorBoundary(movieExists), read], // First check if the movie exists, then return it
};

const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  try {
    const { reviewId } = request.params;
    const review = await service.read(reviewId);

    if (!review) {
      return next({
        status: 404,
        message: `Review cannot be found: ${reviewId}`,
      });
    }

    response.locals.review = review;
    next();
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
}

async function destroy(request, response, next) {
  try {
    const { reviewId } = request.params;
    await service.delete(reviewId);
    response.sendStatus(204); // No content after deletion
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
}

async function list(request, response, next) {
  try {
    const { movieId } = request.params;
    const reviews = await service.listReviewsForMovie(movieId);
    response.json({ data: reviews });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  const { reviewId } = request.params;

  try {
    const review = await service.read(reviewId);
    
    if (!review) {
      return response.status(404).json({
        error: `Review with id ${reviewId} cannot be found`, // Adjusted message
      });
    }

    const updatedReview = await service.update({ ...review, ...request.body });
    return response.json({ data: updatedReview });
    
  } catch (error) {
    next(error);
  }
}


module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};

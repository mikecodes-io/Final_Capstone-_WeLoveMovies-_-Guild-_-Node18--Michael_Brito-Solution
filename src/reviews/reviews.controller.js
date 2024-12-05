const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  try {
    const review = await service.read(request.params.review_id);
    if (review) {
      response.locals.review = review;
      return next();
    }
    next({ status: 404, message: `Review cannot be found.` });
  } catch (error) {
    next(error);
  }
}

async function destroy(request, response, next) {
   // TODO: Write your code here
  try {
    const { review } = response.locals;
    await service.delete(review.review_id); 
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

async function list(request, response, next) {
  // TODO: Write your code here
  try {
    const data = await service.list()
    response.json({ data });
  } catch (error) {
    next (error)
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

async function update(request, response, next) {
  // TODO: Write your code here
  try {
    const updatedReview = { 
      ...request.body.data,
      review_id: response.locals.review.review_id,
    };
    const data = await service.update(updatedReview);
    response.json({ data });
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

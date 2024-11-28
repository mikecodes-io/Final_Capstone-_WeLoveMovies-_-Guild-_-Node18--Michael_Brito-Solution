const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function movieExists(request, response, next) {
  // TODO: Add your code here.
  try {
    const movie = await service.read(request.params.movieId); 
    if (movie) {
      response.locals.movie = movie; 
      return next(); 
    }
    next({ status: 404, message: "Movie cannot be found." }); 
  } catch (error) {
    next(error); 
  }
}

async function read(request, response, next) {
  try {
    const data = await service.read();
    response.json({ data });
  } catch (error) {
    next(error);
  }
}

async function list(request, response, next) {
  // TODO: Add your code here.
  try {
    const data = await service.list()
    response.json({ data });
  } catch (error) {
    next(error)
  }
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
};

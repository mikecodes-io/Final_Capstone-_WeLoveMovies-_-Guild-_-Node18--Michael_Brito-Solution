const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movie_id) {
  // Fetch a movie by its movie_id
  const movie = await db("movies")
    .select("*")
    .where({ movie_id })
    .first(); // Only retrieve the first result since movie_id should be unique

  if (!movie) {
    throw new Error(`Movie with ID ${movie_id} not found.`);
  }

  return movie;
}

module.exports = {
  list,
  read,
};

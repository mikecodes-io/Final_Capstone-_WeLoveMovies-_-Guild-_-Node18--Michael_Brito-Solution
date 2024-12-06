const db = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
});

async function list() {
  try {
    // Perform the database query and join the necessary tables
    const theaters = await db("theaters")
      .join(
        "movies_theaters",
        "movies_theaters.theater_id",
        "theaters.theater_id"
      )
      .join("movies", "movies.movie_id", "movies_theaters.movie_id")
      .then(reduceMovies);

    return theaters; // Return the result
  } catch (error) {
    // Log the error or handle it appropriately
    console.error("Error fetching theaters: ", error);
    throw new Error("Unable to fetch theaters");
  }
}

module.exports = {
  list,
};

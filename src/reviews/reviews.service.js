const db = require("../db/connection");

const tableName = "reviews";

async function destroy(reviewId) {
  // Fetch the review first
  const review = await db("reviews").where({ review_id: reviewId }).first();

  // If no review is found, throw an error
  if (!review) {
    throw new Error(`cannot be found.`);
  }

  // Delete the review
  await db("reviews").where({ review_id: reviewId }).del();

  return review; // Optionally return the deleted review if needed
}


async function list(movie_id) {
  // Retrieves all reviews for a specific movie
  const reviews = await db(tableName)
    .where({ movie_id })
    .select("*");

  // If no reviews are found, return an empty array
  if (!reviews.length) {
    return [];
  }

  // Set the critic data for each review
  return Promise.all(reviews.map(setCritic));
}

async function read(reviewId) {
  // Retrieves a specific review by its ID
  const review = await db(tableName)
    .where({ review_id: reviewId })
    .first();

  // If no review is found, throw an error
  if (!review) {
    throw new Error(`cannot be found`);
  }

  // Set the critic data for the review
  return setCritic(review);
}

async function readCritic(critic_id) {
  // Retrieves critic data by its ID
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  // Adds the critic data to the review object
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  // Updates an existing review in the database
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))  // Fetch the updated review
    .then(setCritic);  // Add the critic information to the updated review
}

module.exports = {
  destroy,
  list,
  read,
  update,
};

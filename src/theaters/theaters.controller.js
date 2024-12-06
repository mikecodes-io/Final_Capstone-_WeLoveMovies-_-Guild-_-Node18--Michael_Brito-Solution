const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(request, response) {
  try {
    // Fetch all theaters from the service
    const theaters = await service.list();

    // Send the theaters data back in the response
    response.json({ data: theaters });
  } catch (error) {
    // Handle any errors
    next(error);
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
};

const router = require("express").Router({ mergeParams: true });
const controller = require("./theaters.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Route to get all theaters
router.route("/")
  .get(controller.list)  // Handle GET request to list theaters
  .all(methodNotAllowed); // Handle other methods (e.g., POST, PUT, DELETE) with MethodNotAllowed

module.exports = router;

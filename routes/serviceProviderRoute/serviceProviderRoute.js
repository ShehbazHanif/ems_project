const express = require("express");
const serviceRouter = express.Router();
const { addService, getMyServices, deleteService } = require("../../controllers/serviceProviderController/serviceController");
const {authenticateToken} = require("../../middlewares/auth");

serviceRouter.post("/add", authenticateToken, addService);
serviceRouter.get("/my-services", authenticateToken, getMyServices);
serviceRouter.delete("/:serviceId", authenticateToken, deleteService);

module.exports = serviceRouter;

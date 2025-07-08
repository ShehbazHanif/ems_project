const express = require("express");
const serviceRouter = express.Router();
const { addService, getMyServices, deleteService, recommendedJob } = require("../controllers/serviceController");
const { authenticateToken } = require("../middlewares/auth");

serviceRouter.post("/addService", authenticateToken, addService);
serviceRouter.get("/my-services", authenticateToken, getMyServices);
serviceRouter.delete("/:serviceId", authenticateToken, deleteService);
serviceRouter.get('/getJobs', authenticateToken, recommendedJob)

module.exports = serviceRouter;
